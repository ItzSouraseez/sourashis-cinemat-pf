# Sourashis Ghosh Roy — Portfolio

Cinematographer and creative director. A single-page static site: no build step, no dependencies.

## Files

| File | What it is |
|---|---|
| `index.html` | The page |
| `styles.css` | All styles |
| `app.js` | Interactions: iris intro, pull-focus hero, story monitor, playback deck, slate brief form |
| `projects.js` | **The film list.** Add a YouTube link here and it appears on the site, sorted newest first |

## Add a film

Open `projects.js` and add an entry:

```js
{ url: "https://www.youtube.com/watch?v=VIDEO_ID", title: "Film title", client: "Channel or brand",
  date: "2026-12-01", runtime: "8:30", roles: ["direct", "shoot"], format: "Brand Film" },
```

`roles` can be any of `direct`, `shoot`, `edit`.

## Contact email

The slate form opens the visitor's email app addressed to `CONTACT_EMAIL`, set near the middle of `app.js`.

## Run locally

```bash
python3 -m http.server 5173
```

Then open http://localhost:5173.

## Deploy on Vercel

Import this repository at vercel.com/new, keep Framework Preset as **Other**, leave the build command empty, and deploy. Every push to `main` redeploys.
