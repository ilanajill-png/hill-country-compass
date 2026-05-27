# Hill Country Compass

A small Coder-friendly local life planner for someone who splits attention
between Austin, San Antonio, and the I-35 corridor.

The first prototype scores possible outings across five interests:

- gardening and seasonal yard tasks
- live music
- good restaurants
- lifehacking through code
- weird Texas history

The point is not another generic events app. The useful wedge is a personal
"what should I actually do with this evening?" planner that combines errands,
curiosity, weather, distance, and mood.

## Run

This is a static prototype.

```sh
python3 -m http.server 4173
```

Then open `http://localhost:4173`.

Inside Coder, forward/open port `4173` from the workspace.

## Current Status

- Local seed data only.
- No API keys required.
- Designed to grow into an agent/data project: add scrapers or API imports for
  venue calendars, city history markers, garden reminders, and restaurant notes.

## Coder Angle

This is a good Coder demo because the whole project can live in a reproducible
workspace:

- starter data in `data/`
- static UI
- future API collectors in scripts
- repeatable schedule/import tasks
- safe local experimentation before exposing anything public
