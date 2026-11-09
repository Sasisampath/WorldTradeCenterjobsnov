# Chennai Jobs & Hiring Drives | productwithsasi

A mobile-first directory with the Rocketlane Product Specialist drive and six Chennai company listings from the World Trade Center Reel. The site uses static HTML, CSS and JavaScript.

## Run locally

```sh
python3 -m http.server 5600 --bind 127.0.0.1
```

Open http://127.0.0.1:5600/.

## Deploy to Vercel

Import [Sasisampath/WorldTradeCenterjobsnov](https://github.com/Sasisampath/WorldTradeCenterjobsnov) into Vercel. Use **Other** for the framework and leave the root at the repository root. The checked-in `vercel.json` serves that directory with no install or build step.

## Update listings

- `jobs.js` contains the company listings, search tags and career links.
- `index.html` contains the Rocketlane details and registration URL. Update the cutoff in `script.js` if the event date changes. The past-event label uses Chennai time.
- `assets/rocketlane-drive.webp` is the supplied poster.

The supplied Rocketlane Google Form requires sign-in. Check that the form owner accepts responses from the intended audience. LinkedIn listing pages can remain visible after applications close. Hapag-Lloyd and Maersk have links to their company career pages for current openings.
