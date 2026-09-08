# GF-Game

A browser platform brawler starring Ananya, with Anya and Vedika as helpers and Yash, Himank, and Rizzwan as rivals. Defeat boss Rizzwan at the end of stage three and reach the exit to receive the Dyson Airwrap award.

## Play locally

Run `python3 -m http.server 8765 --bind 127.0.0.1` from this folder, then open http://localhost:8765/src/code.html.

Move with A/D or arrow keys; Space jumps; J punches; K kicks; P pauses. Touch controls appear on touch devices. The pause button also works on mobile.

## Powerups

| Drop | Effect | Duration |
| --- | --- | --- |
| Cat emoji — Cat Crew | Anya supplies ranged attacks; Vedika attacks nearby rivals | 24 seconds |
| CFA book | Hold J/K to fire a 24-damage beam every 0.55 seconds | 18 seconds |
| Kamikaze shot glass | Punch and kick damage ×1.8; mint punches and pink kicks | 14 seconds |

Drops require one second before collection. Normal knockouts have an 8% powerup drop chance, capped at two drops per stage; no drop is guaranteed. Stages contain 14, 18, and 22 regular enemies respectively, plus the final Rizzwan boss. Recollecting refreshes the timer, without stacking damage. Timers freeze while paused and reset on death/restart or stage change. The phone-triggered bike sweep is unchanged.

## Build and deploy

1. Run `node tests/game.test.cjs` (Node.js required for regression tests only).
2. Run `python3 scripts/build.py`.
3. Open https://app.netlify.com/drop and sign in to your account.
4. Drag the **dist folder** or **ananya-adventures.zip** onto the drop zone. The archive has `index.html` at its root.
5. Netlify gives you a hosted URL to share. For updates, rebuild, then upload the updated `dist` folder on the existing site's Deploys page.

Official instructions: https://docs.netlify.com/start/quickstarts/netlify-drop-quickstart/

The game is a static site: no backend, API key, database, or installation is needed to play. The build bundles the six locally supplied character images. Backgrounds, phone/bike art, music, sound effects, and fonts still load from the existing CDN/Google Fonts, so an internet connection is needed for the complete presentation. Vector fallbacks keep gameplay available if image loading fails; sound failures are nonfatal.

`src/code.html` is the source of truth. Rebuild after editing it. `dist` and the zip are generated output. The source can also run in the existing creator host with its injected configuration and asset loader.

## Combat variety

Land on regular enemies to stomp and bounce (18 base damage); the boss cannot be stomped. Mix punch, kick, and stomp hits within 2.5 seconds to build a five-hit style chain, up to ×1.4 damage. Repeating a move or taking damage breaks the chain. Helpers cannot build your chain. Stage score awards hits and knockouts, and resets on stage change or restart. Enemies mix ground patrols with platform positions and engage as you approach. Powerup rarity is unchanged.
