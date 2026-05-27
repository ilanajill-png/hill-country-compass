# GitHub Scan And Brainstorm

## Sources Checked

- `coder/coder`: Coder's main open-source repo. The useful pattern is local or
  cloud workspaces defined with Terraform, with Docker as the easiest
  quick-start path.
- `coder/registry`: reusable Coder modules for adding tools and apps to
  workspaces.
- Coder-template examples and snippets using `coder_app`, `coder_agent`, Docker
  providers, and workspace parameters.
- Local-project examples around event maps, history maps, Austin event apps,
  and gardening calendars.

## Brainstormed Ideas

1. Hill Country Compass
   - One dashboard that ranks possible Austin/San Antonio outings by mood,
     distance from Schertz, garden timing, live music, food, code meetups, and
     weird-history overlap.
   - Started as the current prototype.

2. Weird Errand Router
   - Add a historical marker or odd local story to ordinary errands.
   - Example: "If you are already going to Pearl, add this 20-minute King
     William history loop."

3. Central Texas Garden Ops
   - A home-garden command center that combines heat index, watering reminders,
     pantry/herb plans, nursery trips, and local planting windows.

4. Live Music Dinner Pairer
   - Given a city, date, budget, and energy level, pair one show with one
     restaurant and one fallback plan.

5. Local Life Coder Workspace
   - A Coder template for personal agents: browser, data scripts, event imports,
     markdown notes, and a static dashboard all preloaded in one workspace.

## Pick

Start with Hill Country Compass because it can be useful immediately with seed
data and can grow into the other ideas without changing the core app.
