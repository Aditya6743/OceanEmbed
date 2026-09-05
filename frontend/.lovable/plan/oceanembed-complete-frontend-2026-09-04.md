# OceanEmbed complete frontend

## Goal
Turn the existing OceanEmbed intro into a connected scientific visualization experience: realistic globe entry, interactive map-based prediction workflow, and a temperature-driven vertical depth exploration using one shared mock prediction response.

## User flow
```text
Intro globe (/)
  → globe dive / Explore
Map + prediction dashboard (/dashboard)
  → select ocean location → Predict → staged processing → results
Vertical depth profile (/depth-profile)
  → scroll 0–2000 m → View Full Chart
Dashboard results (#results)
```

## Screen 1 — Intro globe
- Preserve the current title, subtitle, SIH badge, button, layout, and ambient jellyfish/plankton artwork.
- Replace the single Earth image with bundled high-resolution natural-color Earth, cloud, and night-light textures.
- Render separate day surface, emissive night lights, and semi-transparent moving cloud shells with directional sunlight, low ambient fill, and a Fresnel-style atmospheric rim.
- Enable damped OrbitControls for smooth drag inertia while retaining slow automatic rotation.
- Keep the Indian Ocean pin and camera dive interaction.
- Complete the transition by navigating to `/dashboard` rather than stopping on a blank state.
- Make the OceanEmbed mark a reset/home action; returning to `/` remounts the intro with clean camera and transition state.

## Screen 2 — Map and prediction dashboard
- Add a responsive scientific dashboard with a compact header, model/data status, SIH badge, and back-to-globe action.
- Add a client-only Leaflet map with pan/zoom, ocean-focused initial framing, click-to-place marker behavior, and clearly displayed latitude/longitude.
- Add controls for selected coordinates and date, plus SST, SSH, and SSS readouts from the shared mock response.
- Add Predict and Reset actions. Predict runs the three requested sequential states with restrained Framer Motion transitions before revealing results.
- Keep Reset local and deterministic: restore the default Indian Ocean selection, date, surface values, loading state, and hidden results.
- Add a results area containing:
  - Plotly temperature-vs-depth chart with depth increasing downward.
  - Lightweight React Three Fiber water column driven by the same profile points.
  - Validation panel showing model version and unavailable RMSE/MAE/reference states honestly rather than inventing values.
  - Explore Depth Profile action.

## Screen 3 — Vertical depth exploration
- Add a full-screen `/depth-profile` route whose scroll distance maps continuously from 0 m to 2000 m.
- Keep a fixed depth readout and slim right-side progress rail with a moving position indicator.
- Interpolate temperature between profile samples at the current depth.
- Drive the scene color from that interpolated temperature: warmer/lighter teal near warm water and progressively cooler/darker navy as temperature falls.
- Place glass data cards at the supplied depth samples, showing depth, temperature, and standard oceanographic zone labels.
- Add a restrained, deterministic field of low-opacity particles that becomes somewhat denser at depth without obstructing data.
- End with min/max temperature, total range, and a View Full Chart action returning to `/dashboard#results`.

## Shared data and structure
- Define the prediction/profile types, default coordinates, mock response, interpolation, statistics, and zone-label helpers in a browser-safe data module.
- Put the mock request behind an async prediction-service function so a future FastAPI call can replace its internals without changing screens or visualization components.
- Store the active prediction in a small React context at the root so the dashboard, depth view, chart, and 3D column consume the same object. Direct route visits fall back to the same default mock response.
- Add focused reusable pieces for the app header, status/readout cards, prediction controls, profile chart, water column, and depth cards.

## Technical details
- Add `leaflet`, `react-leaflet`, `framer-motion`, `plotly.js-dist-min`, and `react-plotly.js` with required type packages.
- Isolate Leaflet and Plotly behind lazy client-only boundaries so their browser dependencies do not enter server rendering.
- Keep all palette, glow, glass, map, chart, and depth colors in semantic CSS variables; retain the current typography and ambient artwork.
- Bundle all globe textures locally and avoid runtime texture/CDN dependencies.
- Give `/dashboard` and `/depth-profile` distinct OceanEmbed metadata.
- Keep animation counts modest and honor reduced-motion preferences.

## Validation
- Verify the intro globe is lit and textured, drag inertia works, the pin and Explore both enter the dashboard, and returning home resets the intro.
- Verify map click selection, coordinate/date controls, Reset, all three loading messages, and result reveal.
- Verify chart, 3D water column, depth interpolation, fixed counter, progress rail, zone cards, and chart return action.
- Check desktop and mobile screenshots, map/chart sizing, keyboard focus, no overlap, and build/runtime/console/network health.
