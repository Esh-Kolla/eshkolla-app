# ML From Scratch — series roadmap

A themed series rebuilding ML from first principles. Inspired by ml-visualized.com:
each post derives the math by hand AND ships a live animated canvas visualization
(purpose-built component in components/charts/, registered in app/blog/[slug]/page.tsx).

Frontmatter for every series post must include:
  tags: ["ml-from-scratch", ...]
  series: "ml-from-scratch"

Tone: teach like a smart friend who codes. Derive the math, show the 40-line
implementation, make the reader watch it converge, end with "try it tonight".

## Roadmap (in order)
1. [x] Gradient descent (linear regression) — 2026-08-08 — GradientDescentChart
2. [x] Perceptron — binary classification, the decision boundary learning live — 2026-08-27 — PerceptronChart
3. [ ] Logistic regression — sigmoid, cross-entropy loss, probability outputs
4. [ ] K-means clustering — centroids drifting to cluster centers
5. [ ] PCA — variance maximization, projecting 2D to 1D
6. [ ] Neural network forward pass — layers transforming data
7. [ ] Backpropagation — chain rule through the network, loss landscape
8. [ ] Optimizers — SGD vs momentum vs Adam racing on the same landscape
9. [ ] Autoencoders — latent space compression visualized

## Rules for the cron agent writing these
- Build the visualization FIRST as components/charts/<name>.tsx (client component,
  "use client", canvas or inline SVG, animated with requestAnimationFrame, palette:
  green #00ff41, cyan #00d4ff, dim #888888, grid #1c1c1c, dark background).
- Register it in app/blog/[slug]/page.tsx components={{...}} import + map.
- No-prop usage in MDX only (object/array props and template-literal children break MDX).
- Verify in dev server that the canvas/svg markup appears in served HTML before deploying.
- Each post: 700-1000 words, derive the key math inline in code blocks, one <Callout>,
  live viz near the middle, "try it tonight" ending, link forward to next topic.
