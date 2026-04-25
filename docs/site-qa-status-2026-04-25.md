# Site QA Status — 2026-04-25

Batch 18 local QA run from `projects/fupela.github.io`.

## Results

- `scripts/generate_sitemap.py`: regenerated `sitemap.xml`.
- `scripts/audit_internal_links.py`: 52 HTML files scanned, 649 internal links checked, 24 findings.
- `scripts/audit_blog_metadata.py`: 19 blog pages scanned, 0 metadata issues.
- `scripts/audit_structured_data.py`: 52 HTML files scanned, 16 pages with JSON-LD, 0 structured-data issues.

## Known Findings

The 24 internal-link findings are all product MP4 paths under `products/download*.html`:

- `d-934797adeea6/Jedai-Flow-Automation-Guide-Video.mp4`
- `d-934797adeea6/Jedai-Flow-Blueprint-Pack-Video.mp4`
- `d-934797adeea6/Jedai-Flow-Side-Hustle-Guide-Video.mp4`
- `d-934797adeea6/Jedai-Flow-Mastery-Guide-Video.mp4`

These are already documented as intentional product/Gumroad asset exclusions in `docs/site-audit-notes.md`. No new low-risk content or metadata fixes were needed.
