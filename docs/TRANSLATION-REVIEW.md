# Translation Review

UI translations exist for English, French, and Modern Standard Arabic. They were written to be natural and product-appropriate, but human review is still recommended before public launch.

## Status

No blocking translation defects found by automated tests. Human review still required for tone and regional nuance.

## Review Checklist

- [ ] French: verify tone for professional portfolio/freelance context (formal vs. friendly).
- [ ] Arabic: verify MSA tone and technical term choices (`Developer OS`, `Terminal`, `Quote`, `Privacy`).
- [ ] Confirm CTA phrasing consistency across landing, OS, quote, and privacy.
- [ ] Confirm date/location formatting expectations for FR/AR audiences.
- [ ] Confirm accessibility labels/ARIA strings read naturally in screen readers.

## Notes

- Fallback behavior exists for localized content: missing locale falls back to English and logs warning in development only.
- Do not add machine-generated claims/copy that is not backed by configured owner content.
