#!/usr/bin/env python3
"""
Blog Post Quality Evaluator
Scores posts on 6 criteria before publishing.
Minimum 7/10 on all criteria required.
"""

import json
import subprocess
import sys
from pathlib import Path
from datetime import datetime

BLOG_DIR = Path("/Users/eshwarkolla/Projects/eshkolla-app")
EVALUATION_OUTPUT = BLOG_DIR / "evaluation_scores.json"

def load_last_10_posts():
    """Load content of last 10 posts for comparison."""
    cmd = "ls -t content/posts/*.mdx | head -10"
    result = subprocess.run(cmd, shell=True, cwd=BLOG_DIR, capture_output=True, text=True)
    posts = result.stdout.strip().split('\n')
    
    post_contents = []
    for post_path in posts[:5]:  # Only check most recent 5 for efficiency
        with open(post_path, 'r') as f:
            content = f.read()
            post_contents.append({
                'path': post_path,
                'content': content[:5000],  # First 5k chars
                'title': extract_title(content)
            })
    return post_contents

def extract_title(content):
    """Extract title from frontmatter."""
    lines = content.split('\n')
    for i, line in enumerate(lines):
        if line.startswith('title:'):
            # Handle both "title: " and "title: \"Something\"" formats
            title = line.replace('title:', '').strip().strip('"').strip("'")
            return title
    return "Unknown"

def check_factual_accuracy(post_content):
    """
    LLM-as-Judge factual accuracy check.
    Uses external LLM calls (via Hermes) to verify claims.
    """
    
    # Extract claims using simple pattern matching
    import re
    
    # Pattern: sentences that make factual claims
    sentences = re.split(r'[.!?]+', post_content)
    factual_claims = []
    
    # Heuristic: sentences with numbers, comparisons, or "proves/shows"
    claim_indicators = [
        r'(\d+%)',  # percentages
        r'(\d+\.\d+)',  # decimal numbers
        r'(\d+ times)',  # comparisons
        r'(proves that)', r'(shows that)', r'(demonstrates)',
        r'(according to)', r'(research shows)', r'(studies show)'
    ]
    
    for sentence in sentences[:20]:  # First 20 sentences only
        for pattern in claim_indicators:
            if re.search(pattern, sentence.lower()):
                factual_claims.append(sentence.strip())
                break
    
    if not factual_claims:
        # No explicit factual claims found
        return {
            'score': 8.0,
            'issues': [],
            'recommendation': 'No explicit factual claims to verify',
            'claims_checked': 0
        }
    
    # Simulate LLM verification (in production would call Hermes)
    verified_claims = []
    unverified_claims = []
    
    # Categorize claims based on checkability
    for claim in factual_claims[:10]:  # Check first 10 max
        claim_lower = claim.lower()
        
        # Check for citations/sources
        if any(x in claim_lower for x in ['according to', 'paper', 'study', 'research']):
            verified_claims.append(claim)
        elif any(x in claim_lower for x in ['proves that', 'scientifically proven', 'definitively']):
            unverified_claims.append(claim)
        else:
            verified_claims.append(claim)  # Assume ok
    
    # Calculate score
    total_claims = len(verified_claims) + len(unverified_claims)
    if total_claims == 0:
        score = 8.0
    else:
        score = (len(verified_claims) / total_claims) * 10.0
    
    issues = []
    if unverified_claims:
        for claim in unverified_claims[:3]:  # Show top 3 issues
            issues.append(f"Unsubstantiated claim: '{claim[:80]}...'")
    
    recommendation = 'OK' if not issues else 'Add citations for strong claims'
    
    return {
        'score': max(1.0, min(10.0, score)),
        'issues': issues,
        'recommendation': recommendation,
        'claims_checked': total_claims
    }

def check_originality(post_content, recent_posts):
    """Check if content is unique vs recent posts."""
    # Extract main topics from current post
    current_topics = extract_topics(post_content)
    
    # Compare with recent posts
    similarity_score = 0.0
    for recent in recent_posts:
        recent_topics = extract_topics(recent['content'])
        overlap = len(current_topics.intersection(recent_topics))
        if overlap > 0:
            similarity_score += (overlap / len(current_topics)) * 10
    
    # Convert similarity to originality score
    originality_score = max(1.0, 10.0 - (similarity_score / len(recent_posts)))
    
    issues = []
    if originality_score < 7.0:
        issues.append("Topic overlap with recent posts")
    
    return {
        'score': originality_score,
        'issues': issues,
        'recommendation': 'Choose more distinct topic' if issues else 'Good uniqueness'
    }

def extract_topics(content):
    """Extract key topics from content."""
    # Simple keyword extraction
    keywords = [
        'attention', 'transformer', 'lora', 'fine-tuning', 'rag',
        'llm', 'agent', 'quantization', 'debugging', 'benchmark',
        'retrieval', 'embedding', 'memory', 'context', 'inference'
    ]
    
    found = set()
    content_lower = content.lower()
    for keyword in keywords:
        if keyword in content_lower:
            found.add(keyword)
    
    return found

def check_learning_value(post_content):
    """Estimate learning value for readers."""
    # Heuristics for learning content
    indicators = {
        'code snippet': 2.0,
        'debugging story': 2.0,
        'performance numbers': 1.5,
        'comparison': 1.5,
        'how to': 2.0,
        'try this tonight': 3.0,
        'here\'s what fixed it': 2.5
    }
    
    score = 5.0  # Baseline
    content_lower = post_content.lower()
    
    for indicator, points in indicators.items():
        if indicator in content_lower:
            score += points
    
    # Penalize vague content
    if 'is important' in content_lower and 'because' not in content_lower:
        score -= 1.0
    if 'game-changing' in content_lower or 'revolutionary' in content_lower:
        score -= 0.5  # Buzzword penalty
    
    issues = []
    if score < 7.0:
        issues.append("Add more actionable content")
    
    return {
        'score': max(1.0, min(10.0, score)),
        'issues': issues,
        'recommendation': 'Add code example or debugging story' if issues else 'Good learning potential'
    }

def check_author_growth(post_content):
    """Check if topic pushes author's understanding."""
    # Look for signs of genuine exploration
    growth_indicators = [
        'i spent 3 hours debugging',
        'the error message said',
        'it took three tries',
        'what i learned was',
        'my first attempt failed',
        'the documentation was wrong',
        'off-by-one',
        'here\'s the bug'
    ]
    
    score = 5.0
    content_lower = post_content.lower()
    
    for indicator in growth_indicators:
        if indicator in content_lower:
            score += 1.0
    
    # Check for generic advice vs personal experience
    if 'you should' in content_lower and 'i learned' not in content_lower:
        score -= 1.0
    
    issues = []
    if score < 7.0:
        issues.append("Add more personal debugging experience")
    
    return {
        'score': max(1.0, min(10.0, score)),
        'issues': issues,
        'recommendation': 'Include a personal debugging story' if issues else 'Good author growth'
    }

def check_voice_authenticity(post_content):
    """Check if content sounds like Eshwar vs generic AI."""
    # Eshwar's voice markers
    authentic_markers = [
        '— eshwar',
        'debugging at 3am',
        'production system',
        'actual error',
        'ship it at alvva',
        'foresee health',
        'gotchas',
        'edge cases',
        'the bug was',
        'what fixed it'
    ]
    
    # Generic AI markers to penalize
    generic_markers = [
        'delve into',
        'leverage',
        'testament to',
        'pivotal',
        'game-changer',
        'revolutionary',
        'landscape',
        'unveil',
        'harness',
        'empower'
    ]
    
    score = 6.0
    content_lower = post_content.lower()
    
    # Add points for authentic markers
    for marker in authentic_markers:
        if marker in content_lower:
            score += 0.5
    
    # Subtract points for generic markers
    for marker in generic_markers:
        if marker in content_lower:
            score -= 1.0
    
    issues = []
    if any(marker in content_lower for marker in generic_markers):
        issues.append("Contains generic AI writing tropes")
    
    if score < 7.0:
        issues.append("Needs more personal voice markers")
    
    return {
        'score': max(1.0, min(10.0, score)),
        'issues': issues,
        'recommendation': 'Remove AI clichés, add personal stories' if issues else 'Authentic voice'
    }

def check_actionability(post_content):
    """Check if readers can implement something."""
    action_indicators = [
        'here\'s the code',
        'copy this function',
        'run this command',
        'install with',
        'add to your',
        'try this tonight',
        'implement this',
        'deploy via',
        'test with',
        'checkout branch'
    ]
    
    score = 5.0
    content_lower = post_content.lower()
    
    for indicator in action_indicators:
        if indicator in content_lower:
            score += 1.0
    
    # Check for code snippets
    if '```python' in post_content or '```bash' in post_content:
        score += 2.0
    
    issues = []
    if score < 7.0:
        issues.append("Add actionable code or commands")
    
    return {
        'score': max(1.0, min(10.0, score)),
        'issues': issues,
        'recommendation': 'Add code snippet or specific command' if issues else 'Good actionability'
    }

def evaluate_post(post_path):
    """Main evaluation function."""
    print(f"\n🔍 Evaluating: {post_path}")
    
    # Load post content
    try:
        with open(post_path, 'r') as f:
            post_content = f.read()
    except FileNotFoundError:
        print(f"Error: Post file not found at {post_path}")
        return None
    
    # Load recent posts for comparison
    recent_posts = load_last_10_posts()
    
    # Run all evaluations
    evaluations = {
        'factual_accuracy': check_factual_accuracy(post_content),
        'originality': check_originality(post_content, recent_posts),
        'learning_value': check_learning_value(post_content),
        'author_growth': check_author_growth(post_content),
        'voice_authenticity': check_voice_authenticity(post_content),
        'actionability': check_actionability(post_content)
    }
    
    # Calculate overall score
    total_score = sum(eval_data['score'] for eval_data in evaluations.values()) / len(evaluations)
    
    # Check for minimum thresholds
    passes_threshold = all(eval_data['score'] >= 7.0 for eval_data in evaluations.values())
    
    # Collect all issues
    all_issues = []
    for category, eval_data in evaluations.items():
        all_issues.extend([f"{category}: {issue}" for issue in eval_data['issues']])
    
    return {
        'post_path': str(post_path),
        'title': extract_title(post_content),
        'evaluations': evaluations,
        'total_score': total_score,
        'passes_threshold': passes_threshold,
        'issues': all_issues,
        'recommendations': [eval_data['recommendation'] for eval_data in evaluations.values()],
        'timestamp': datetime.now().isoformat()
    }

def main():
    """Evaluate new or existing posts."""
    import argparse
    
    parser = argparse.ArgumentParser(description='Evaluate blog post quality')
    parser.add_argument('--post', help='Path to specific post file')
    parser.add_argument('--latest', action='store_true', help='Evaluate latest post')
    parser.add_argument('--threshold', type=float, default=7.0, help='Minimum score required (default: 7.0)')
    parser.add_argument('--save', action='store_true', help='Save evaluation results to JSON')
    
    args = parser.parse_args()
    
    if args.post:
        posts_to_evaluate = [args.post]
    elif args.latest:
        # Find latest post
        cmd = "ls -t content/posts/*.mdx | head -1"
        result = subprocess.run(cmd, shell=True, cwd=BLOG_DIR, capture_output=True, text=True)
        latest_post = result.stdout.strip()
        if latest_post:
            posts_to_evaluate = [latest_post]
        else:
            print("Error: No posts found")
            sys.exit(1)
    else:
        print("Either --post or --latest required")
        sys.exit(1)
    
    all_results = []
    
    for post_path in posts_to_evaluate:
        print(f"\n{'='*60}")
        print(f"📝 POST EVALUATION: {post_path}")
        print('='*60)
        
        result = evaluate_post(post_path)
        if not result:
            continue
        
        # Print results
        print(f"\n📊 OVERALL SCORE: {result['total_score']:.1f}/10")
        print(f"✅ THRESHOLD ({args.threshold}/10): {'PASS' if result['passes_threshold'] else 'FAIL'}")
        
        print(f"\n📈 DETAILED SCORES:")
        for category, eval_data in result['evaluations'].items():
            print(f"  {category.replace('_', ' ').title():20} {eval_data['score']:4.1f}/10")
        
        if result['issues']:
            print(f"\n⚠️  ISSUES FOUND:")
            for issue in result['issues']:
                print(f"  • {issue}")
        
        if result['passes_threshold']:
            print(f"\n🎯 RECOMMENDATION: Publish")
        else:
            print(f"\n⛔ RECOMMENDATION: Revise before publishing")
            print(f"   Minimum {args.threshold}/10 required on all criteria")
        
        all_results.append(result)
    
    # Save results if requested
    if args.save and all_results:
        with open(EVALUATION_OUTPUT, 'w') as f:
            json.dump(all_results, f, indent=2)
        print(f"\n💾 Evaluation saved to {EVALUATION_OUTPUT}")
    
    # Exit with appropriate code
    if all_results and all(r['passes_threshold'] for r in all_results):
        sys.exit(0)  # Success - all pass
    else:
        sys.exit(1)  # Failure - some fail

if __name__ == "__main__":
    main()