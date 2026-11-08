# 👑 Love site (Ibtissam's world)
Static site – no build. Vercel: New Project → import repo → Framework "Other", no build command, Root Directory = this folder.
- **Supabase is used only to save progress** (love points, baby, best game scores, last mood). Run `schema.sql` once in the Supabase SQL editor. If Supabase is down the site still works and saves on the device.
- Passcode: `080530` (opens automatically). Face unlock is optional: if it fails, use the passcode. Photo = `ibtissam_ref.jpg` in the root.
- Content (notes, poems, photos, quiz…) lives in `content.js`. Edit it with the admin site → Export → replace this file → redeploy. Put photos/audio in `media/` and reference them as `media/name.jpg`.
- `config.js`: Supabase URL + anon key, and the two site URLs. `/admin` redirects to the admin site.
