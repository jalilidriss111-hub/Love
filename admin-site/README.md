# 🛡️ Admin site
Static site – no build. Vercel: separate project, Root Directory = this folder.
- Login: `ADMIN_CODE` in `config.js` (change it!). It is checked in the browser, so treat it as a convenience lock, not bank security.
- ✍️ Content: loads the love site's `content.js`, you edit, then ⬇️ Export `content.js` and replace it in the love-site repo (copy any photos/audio into `love-site/media/`).
- 💎 Progress: view/set love points, baby, best scores and last mood (Supabase, same `schema.sql`).
- Links: love site, games, notes, photos, `/love` redirect. Set `LOVE_URL` / `ADMIN_URL` in `config.js`.
