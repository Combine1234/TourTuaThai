This is a fantastic, feature-rich concept for a travel app. Using Longdo API and integrating an AI planner directly into the UI is a highly practical approach. 

To make this actionable for your Figma drafting phase, I have translated your functional requirements into a structured, page-by-page UI design prompt. I have optimized this for a **mobile-first layout** using a **Neumorphic design system** based on the TourTuaThai logo colors.

Here is your Figma blueprint.

---

### Global Design System: Neumorphic Theme
**Base Background:** Off-white/Light Gray (e.g., `#F0F4F8`) – Crucial for Neumorphism so that white highlights and dark shadows can create the 3D effect.
**Primary Accents:** * **Ocean Blue:** Main actions, headers, active states.
* **Tropical Green:** Secondary actions, confirmation states, nature-related tags.
* **Temple Gold:** Gamification elements (Quests, EXP, Coins), highlights, premium features.
**Neumorphic Rules:** * **Extruded (Popped Out):** Buttons, cards, and sliders (idle state). Uses a light shadow on the top-left and a dark shadow on the bottom-right.
* **Inset (Pushed In):** Text fields, map containers, slider tracks, and active/pressed buttons. Uses inner shadows.

---

### Page 1: Frictionless Login (Phase 0)
**Core Function:** Get the user in instantly without passwords.
**UI Layout:**
* **Top:** Large, vibrant TourTuaThai logo centered.
* **Middle:** Two large, extruded Neumorphic buttons: "Continue with Email" and "Continue with Phone."
* **Bottom:** Subtle, inset text field that appears when a button is clicked to input the email/number, followed by a Green "Send Magic Link/OTP" button.

### Page 2: Travel Personality Sliders (Phase 1)
**Core Function:** Gather preference data via a 1-5 scale.
**UI Layout:**
* **Top:** Clean header: "Tell us your travel style."
* **Body (Scrollable):** A series of Neumorphic sliders. 
    * **Tracks:** Inset grooves.
    * **Thumbs/Knobs:** Extruded circular buttons. 
    * **Labels:** Left/Right text (e.g., "Introvert" vs. "Extrovert", "Beach" vs. "Mountain", "Slow" vs. "Maximize").
* **Bottom:** Fixed, extruded Blue "Next" button.

### Page 3: Interest Ranking & Details (Phase 1 continued)
**Core Function:** Prioritize interests and gather open-ended context.
**UI Layout:**
* **Top:** "Rank your top 5 interests."
* **Middle (Draggable List):** Extruded Neumorphic pill-shaped cards (Historical, Food, Religion, etc.). Users hold and drag them into an inset "Top 5 Box" container.
* **Lower Middle:** Three inset text areas for the optional open-ended questions (What have you done? Why are you traveling? Special interests?).
* **Bottom:** Fixed "Next" button.

### Page 4: Starting Point (Phase 1.5)
**Core Function:** Establish the geographical anchor.
**UI Layout:**
* **Center:** A large inset search bar asking "Which city are we starting in?"
* **Below Search:** A mini inset map widget that drops a Green pin when a city is typed, acting as a visual confirmation.
* **Bottom:** "Start Planning" button.

### Page 5: The Main Planner & Map (Phase 2)
**Core Function:** Interactive route generation and AI collaboration.
**UI Layout:**
* **Top Nav:** Map Mode toggle. A horizontally scrolling row of extruded pills (Province, Crowds, Authenticity, Weather, Transport, Hotspots, Local Secrets). Active pill pushes into an inset state.
* **Top Right Toolbar:** Floating, circular Neumorphic icon buttons stacked vertically or horizontally: Settings, Undo, Redo, Prompt Guide, Save.
* **Center Body:** The Longdo Map (contained within a soft, inset frame). Features day-color-coded routing pins and paths.
* **Bottom Left:** A floating, circular, glowing Blue "AI Assistant" button with a face/chat icon.
* **Bottom Sheet (Hidden/Expandable):** When the AI button is tapped, an extruded panel slides up covering the bottom half. Contains the AI chat history and an inset typing area to command trip edits.

### Page 6: Itinerary & Budget View (Phase 2 continued)
**Core Function:** Text/list breakdown of the map plan. 
*(Accessible via a toggle or swipe from the Main Planner Page)*
**UI Layout:**
* **Top:** Total Trip Budget display (prominent, maybe accented in Gold).
* **Body (Timeline):** Day-by-day vertical timeline. 
* **Elements:** Extruded cards for each location/activity. Checkboxes (inset squares that fill with Green when checked) for travel items.
* **Inline Actions:** Small "Edit with AI" buttons next to each day.

### Page 7: Mid-Trip Live Mode (Phase 3)
**Core Function:** Real-time navigation, live editing, and gamification.
**UI Layout:**
* **Background:** Live navigation map filling the screen.
* **Top:** Minimalist inset banner showing current destination and ETA.
* **Floating Elements:** * Microphone icon (Blue) for hands-free voice AI replanning on the drive.
    * End of Day Feedback prompt (slides in at a specific time).
* **Emergency Local Quest Popup:** A dramatic, extruded card with a glowing Gold border. Contains a title, a brief instruction (e.g., "Find this hidden OTOP shop!"), an inset "Upload Photo" box, and a Gold "Accept Quest for 500 EXP" button.