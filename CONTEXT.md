# Personal Portfolio Website 

### Structure

- app/page.tsx - Main page structure
- app/globals.css - Animations and global css
- app/components - Folder for reusable components
- app/components/AmbientBirds.tsx - Animating bird formations across top of page
- app/components/Footer.tsx - Randomly generated rock formations
- app/components/AsciiSky.tsx - Fluid wind simulation, customizable speed, and color grading gradient based on time of day.

### Design

- Prioritize beauty and performance.
- Theme of intersection between Nature and Technology
- Built as developer portfolio, to show off skills

### Tech Stack

- The ASCII wind layer is a canvas/DOM hybrid challenge. 
- The animals and scene as SVG + GSAP — it layers cleanly over the ASCII, stays 2D which matches the aesthetic, and the performance cost is predictable.

### Linking

- Dashboards
    - Vegan Dashboard 
        - (in page: portfolio.domain.com/vegan_dash)
- Ai Applications
    - AWC
        - (subdomain: awc.domain.com)
    - TTD
        - (subdomain: ttd.domain.com)
- Designs
    - Root
        - (undecided)
    - TAK
        - (in page: portfolio.domain.com/tak)
    - NGI
        - (in page: portfolio.domain.com/ngi)

### To Do

- include polygon animals, a deer standing waving its tail and one sitting with its head up, couple turtles in background, ‘if all goes well and is easy, maybe a fox running across screen’ 
- in the background, mountains and a little river running from them into the foreground, river didn’t have to be animated but if it has a little shimmer of life it could be nice

### Done

- ascii wind background color, Each row drifts at a slightly different speed with a sinusoidal gust pulse, so it has that layered parallax quality you'd want — faster near the top (higher altitude), slower at the bottom.

