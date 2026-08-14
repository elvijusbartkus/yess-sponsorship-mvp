# Design pass — make it distinctive, not generic

The app works. The problem is it looks generic (default blue SaaS template, forgettable). Do a VISUAL-ONLY pass. Do not change the flow, the logic, the data, or the structure. Only change how it looks. Keep everything functional.

## The problem to fix

It reads as an AI-generated template: default blue, white cards, system font, empty voids on quiz screens, no personality, no sense that this is about SPORT. Fix the identity and the hierarchy.

## Direction: confident, sporty, editorial — not corporate SaaS

1. **Pick a real, distinctive color palette.** Drop the default blue. Use something with energy and a point of view. Suggestion: a deep near-black ink (#0B0B0F) for text/backgrounds, one bold electric accent (e.g. a vivid lime/green #C6F135 OR a hot orange #FF5A1F — pick one and commit), and warm off-white (#FAFAF7) instead of cold grey-white. One bold accent used sparingly beats blue-everywhere.

2. **Better typography.** Use a strong display font for headlines (e.g. a tight grotesk like "Space Grotesk", "Archivo", or "Inter Tight" at heavy weight, big and confident) and a clean readable body. Headlines should be large, tight-tracked, and have presence. Import from Google Fonts.

3. **Kill the empty voids on quiz screens.** Center content in a comfortable max-width column, add visual interest: a large step number, a subtle progress element with the accent color, more presence to the question. The quiz should feel focused, not sparse. Consider a subtle full-height accent panel on one side.

4. **Make the match cards have hierarchy.** Right now every card is a flat white box. Give the top match visual prominence (accent border or a subtle tint). Make the FIT score a bold visual element (big number, accent color ring). Make the audience number the hero of each card. Use the accent color to draw the eye to what matters (fit, verified badge, tax saving).

5. **Add a sense of sport / energy.** Subtle: a dynamic accent shape or diagonal in the hero, motion on hover (cards lift slightly), the accent color used with confidence. It should feel alive, not clinical. No stock photos, no clip art — keep it clean and typographic, but with energy.

6. **Verified badge and tax line** should use color meaningfully (green tick for verified, accent for tax benefit) so the eye lands on the two things that matter.

7. **Landing hero**: make the headline huge and confident, give the two CTA cards real visual weight and contrast (the primary "back sport" card bold in the accent, the secondary clean). Tighten the spacing so it feels designed, not stacked.

## Hard rules

- Do NOT change any functionality, flow, routing, matching logic, or data.
- Do NOT rename or restructure components.
- ONLY touch styling: colors, fonts, spacing, sizing, hierarchy, hover states, layout polish.
- Keep it clean and fast. No heavy images. Typographic and color-driven design.
- Must still look professional and trustworthy, just distinctive instead of generic.

## Test

After the pass, the app should look like a product a real funded startup shipped with a designer, not an AI template. Same screens, same flow, way more personality.
