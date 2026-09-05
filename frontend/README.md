# OceanSphere Intro

Create the landing/intro screen for a scientific ocean-data web app called "OceanEmbed".

Theme: Deep-ocean dark aesthetic — near-black navy background (#050B14 to #0A1628 gradient), 

glowing cyan/teal accents (#22D3EE, #06B6D4), soft bioluminescent glow effects on interactive 

elements, subtle glassmorphism on cards (frosted, translucent, blurred backgrounds), clean 

scientific typography (not playful/cartoonish).

Main element: A large 3D rotating globe centered on screen, built with Three.js / React Three 

Fiber + Drei. The globe should:

- Auto-rotate slowly

- Show a realistic or stylized ocean-focused texture (deep blue oceans, muted continents)

- Have a glowing pin/marker on it representing a selected ocean location (start with a default 

  point in the Indian Ocean)

- Respond to mouse drag to rotate manually

- Have a subtle ambient glow/atmosphere effect around it

Below/around the globe:

- App title "OceanEmbed" in large clean type, with a small subtitle: "Reconstructing Subsurface 

  Ocean Temperature from Satellite Data"

- A small badge showing "SIH 2026 · PS26066"

- A single glowing "Explore Ocean Data" button below the globe

Behavior: When the user clicks the pin on the globe OR clicks "Explore Ocean Data", trigger a 

smooth zoom/transition animation (camera zooming into the pin's location) that will later lead 

into a 2D map dashboard. For now, just build the animation trigger and a placeholder transition 

(e.g., fade/zoom to a blank dark screen) — we'll wire the actual dashboard next.

Keep it minimal for now — just this intro/globe screen, nothing else.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://deep-sea-origin.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/cfd20c55-2481-40e5-81e5-17dc058dc558).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
