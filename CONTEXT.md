# Personal Portfolio Website 

### Structure

- app/page.tsx - Main page structure
- app/globals.css - Animations and global css
- app/components - Folder for reusable components
- app/components/AmbientBirds.tsx - Animating bird formations across top of page
- app/components/Footer.tsx - Randomly generated rock formations
- app/components/AsciiSky.tsx - Fluid wind simulation, customizable speed, and color grading gradient based on time of day.
- app/components/ProjectSectin.tsx - Variable layout to desplay portolfio items
- app/components/XrayLeaf.tsx - Leaf that can be hovered over to reveal circuit running underneath it. 
- app/components/ScrollLink.tsx - page.tsx is a server component so it can't have onClick. This is the minimal client component required to call scrollIntoView on the snap container sections. Can't be inlined.
- app/components/TransitionLink.tsx - Intercepts link clicks, ramps wind to 4, sets isLeaving = true, waits 1s then navigates. The core of the whole transition system.
- app/components/PageWrapper.tsx - (1) sets z-index: 2 so page content stacks above birds (2) slides content left on leave, right on enter.
- app/ngi/page.tsx
- app/tak/page.tsx
- app/ttd/page.tsx

### Design

- Prioritize beauty and performance.
- Theme of intersection between Nature and Technology
- Built as developer portfolio, to show off skills

### Tech Stack

- The ASCII wind layer is a canvas/DOM hybrid challenge. 
- The animals and scene as SVG + GSAP — it layers cleanly over the ASCII, stays 2D which matches the aesthetic, and the performance cost is predictable.

### Linking + Sections

1. Hero
    - Name
    - 3 areas (AI / Designs / Dashboards)

2. Ai Applications
    - AWC
        - Click to: (in page: domain.com/awc)
            - Link to (subdomain: awc.domain.com)
    - TTD
        - Click to: (in page: domain.com/ttd)
            - Link to (subdomain: ttd.domain.com)
3. Dashboards
    - Vegan Dashboard 
        - Click to: (in page: portfolio.domain.com/vegan_dash)
4. Designs
    - Root
        - (undecided)
    - TAK
        - Click to: (in page: portfolio.domain.com/tak)
    - NGI
        - Click to: (in page: portfolio.domain.com/ngi)

5. Footer
    -  Rightside- Mountains in background, river flowing to pond in foreground, turtle on log in pond. Leftside- Deer overlooking, tail wagging, one sitting looking out too, Middle - valley going around pond, fox runs around. 
    - Bottom, actual footer - contact info.

### Page Transistioning

In page: 
- wind picks up speed, content slides out in that direction...
- ...new page loads with wind at same high speed, wind slows down to normal speed as content slides in from direction wind is blowing
- 1s animation out. (.5s fadeout, .5s wind speed)
- 1s animation in. (.5s wind speed, .5s fadein)

Subdomain: Normal link (opens in new tab)

### To Do

*Priority*
- AWC / TTD Linking
- vegan dash creation
- Deploy to synologyn
- cloudflare route www.domain -> www.portfolio.domain

*Nice to Have*
- include polygon animals, a deer standing waving its tail and one sitting with its head up, couple turtles in background, ‘if all goes well and is easy, maybe a fox running across screen’ 
- in the background, mountains and a little river running from them into the foreground, river didn’t have to be animated but if it has a little shimmer of life it could be nice
- Leaf somewhere, 

### Done

- ascii wind background color, Each row drifts at a slightly different speed with a sinusoidal gust pulse, so it has that layered parallax quality — faster near the top (higher altitude), slower at the bottom.

