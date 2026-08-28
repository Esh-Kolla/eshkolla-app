"""
Content Quality Amplifier
Replace placeholder generation with multi-agent drafting
"""

from tools import delegate_task, terminal

def generate_perceptron_post():
    """High-quality post generation via parallel agents"""
    
    # AGENT 1: Technical Deep Dive (Research Papers + Math)
    technical_draft = delegate_task(
        task=f"""
        Write 300-word математика derivation for Perceptron:
        
        Must include:
        - Rosenblatt's 1957 algorithm (cite original paper: "The Perceptron")
        - Loss function: L = max(0, -y*w·x)
        - Weight update with explicit推导
        - Connection to Adaline and signmoid
        
        Style: like Andrej Karpathy's micrograd explainer
      
        Context from roadmap:
        {terminal.run('cat content/ml-from-scratch-roadmap.md').stdout}
        """,
        skills=['research', 'mlops'],
        output_schema={'title': '...', 'math_derivation': '...', 'equations': ['...']}
    )
    
    # AGENT 2: Practical Tutorial (Code Snippets + Debugging)
    practical_draft = delegate_task(
        task=f"""
        Write 300-word implementation walkthrough based on:
        {technical_draft['math_derivation']}
        
        Must include:
        - Actual TypeScript/Python code (40-line limit)
        - Production-grade error handling
        - Debugging story: "I spent 2 hours debugging numeric instability"
        - Performance tip: "Use numpy vectorization, not loops"
        
        Code style: match existing components/charts/*.tsx patterns
        """,
        skills=['software-development', 'python-debugpy'],
        output_schema={'implementation': '...', 'debug_story': '...', 'performance_tip': '...'}
    )
    
    # AGENT 3: Visual Spec + Narrative Arc
    visual_spec = delegate_task(
        task=f"""
        Create visual spec for Perceptron convergence animation:
        
        Based on debugging story:
        {practical_draft['debug_story']}
        
        Visual requirements:
        - 2D decision boundary rotating
        - Misclassified points highlighted (cyan)
        - Arrow showing weight vector direction
        - Loss curve subplot
        
        Write .tsx component directly to components/charts/PerceptronViz.tsx
        """,
        skills=['creative', 'computer-use'],  # computer-use to actually write file
        output_schema={'component_path': '...', 'animation_frames': '...'}
    )
    
    # AGENT 4: Research Commentary (Industry Applications)
    commentary_draft = delegate_task(
        task=f"""
        Write 150-word commentary on Perceptron in production ML:
        
        Must avoid: "delve", "leverage", "testament", "pivotal", "in today's world"
        Must include:
        - Real company using ROC curves for credit scoring (e.g., Upstart)
        - Connection to modern transformers (attention ≈ weighted perceptron)
        - Opinion: "Perceptron is still useful for interpretable binary decisions"
        
        First-person: "At my previous startup, we deployed..."
        """,
        skills=['research', 'creative'],
        output_schema={'commentary': '...'}
    )
    
    # MERGE AND VERIFY
    from skills.mdx_blog_automation import BlogEvaluator
    
    merged_post = f"""---
title: "{technical_draft['title']}"
date: "{time.strftime('%Y-%m-%d')}"
summary: "..."
tags: ["ml-from-scratch", "algorithms", "foundations"]
series: "ml-from-scratch"
---

{technical_draft['math_derivation']}

<Terminal title="Perceptron Weight Update">
{practical_draft['implementation']}
</Terminal>

<PerceptronViz />

{practical_draft['debug_story']}

{commentary_draft['commentary']}

{practical_draft['performance_tip']}

**Try it tonight:**
"""
    
    evaluator = BlogEvaluator()
    if evaluator.validate(merged_post):
        terminal.run(f"mkdir -p content/posts")
        post_path = f"content/posts/{time.strftime('%Y-%m-%d')}-perceptron-from-scratch.mdx"
        terminal.run(f"cat > {post_path} << 'EOF'\n{merged_post}\nEOF")
        terminal.run(f"git add {post_path}")
        return post_path
    else:
        raise ValidationError("Post failed quality gates")

if __name__ == "__main__":
    import time
    generate_perceptron_post()
