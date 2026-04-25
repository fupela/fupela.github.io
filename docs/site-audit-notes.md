# Site Audit Notes

## Known Internal-Link Audit Findings

The internal-link audit intentionally reports local links even when the missing
asset is excluded from Cloudflare Pages on purpose. Treat the following as known
non-urgent unless the product delivery strategy changes:

- `products/download*.html -> d-934797adeea6/*.mp4`

Those MP4 files exceed Cloudflare Pages upload limits and are intentionally
excluded by `.pagesignore`. Gumroad should remain the delivery path for paid
video/product assets.

## Remaining Real Findings

- `dispatchanchor.html -> /assets/dispatchanchor/sample-call.mp3`

This is a real missing asset reference. Fix by adding the sample call audio or
removing/replacing the audio player after confirming the current demo strategy.
