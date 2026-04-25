# Site Audit Notes

## Known Internal-Link Audit Findings

The internal-link audit intentionally reports local links even when the missing
asset is excluded from Cloudflare Pages on purpose. Treat the following as known
non-urgent unless the product delivery strategy changes:

- `products/download*.html -> d-934797adeea6/*.mp4`

Those MP4 files exceed Cloudflare Pages upload limits and are intentionally
excluded by `.pagesignore`. Gumroad should remain the delivery path for paid
video/product assets.

## Resolved Real Findings

- `dispatchanchor.html -> /assets/dispatchanchor/sample-call.mp3`

Resolved 2026-04-25 by replacing the dead audio player with a live-demo CTA.
When a real sample call asset exists, reintroduce the audio player with the
actual checked-in file path.
