# Submission Guide: Township Tycoon

## 1. Project Files
- **README.md**: Located at `c:\Users\Adaktech Enterprise\Downloads\scrolly-gamejam\README.md`. It contains all necessary instructions for running the game.
- **Code Status**: Verified. `tsc` passes with no errors. The code is clean and ready for submission.

## 2. Video Trailer Advice (30-60 Seconds)
Your trailer should be fast-paced and show off the depth of the simulation.

**Suggested Scenes:**
1.  **The "Hook" (0:00 - 0:05)**: Start with a zoomed-out view (if possible, or scrolling down) showing the entire factory buzzing with activity. Show multiple machines working, staff running around, and trucks arriving.
    *   *Caption*: "Build Your Empire."
2.  **The "Depth" (0:05 - 0:15)**: Cut to specific features.
    *   Show a **Market Surge** event (News Ticker flashing, prices doubling).
    *   Show the **Rent Timer** ticking down (tension).
    *   Show a **Machine Jam** and the player cleaning it (interaction).
    *   *Caption*: "Manage the Chaos."
3.  **The "Festive Rush" (0:15 - 0:25)**: Show the **Festive Rush Hour** event.
    *   Trucks arriving and leaving instantly.
    *   Money counter flying up.
    *   "🔥 RUSH HOUR! 🔥" banner visible.
    *   *Caption*: "Survive the Rush."
4.  **The "Prestige" (0:25 - 0:30)**: Show the **Golden Truck** arriving or a massive upgrade purchase (confetti).
    *   *Caption*: "Become a Tycoon."

**Music**: Upbeat, fast-paced simulation/tycoon style music.

## 3. Screenshot Suggestions
For your submission page, use these 3 screenshots to highlight different aspects of the game:

1.  **"The Busy Factory"**:
    *   **Content**: A shot of the middle zones (Tomato/Dairy) with machines working, staff carrying items, and a truck waiting.
    *   **Why**: Shows the core gameplay loop and visual density.
2.  **"Events & UI"**:
    *   **Content**: Capture a moment during a **Market Surge** or **Rush Hour** event. Ensure the News Ticker or Rush Hour banner is visible, along with the UI showing money and gems.
    *   **Why**: Highlights the advanced simulation mechanics and dynamic events.
3.  **"Progression & Upgrades"**:
    *   **Content**: Open the **Upgrades Menu** or **Manager Menu** over a background of a high-level farm (e.g., Orchard/Chocolate).
    *   **Why**: Shows the depth of progression, unlockable content, and strategy.

## 4. Technical Highlights (For Judges)
Use these points in your submission description to score high on "Technical Implementation" and "Uniqueness":

*   **Single-File Architecture**: The entire game logic, UI, and assets are contained within a single `index.tsx` file. No external assets (images/sounds) are required.
*   **Procedural Assets**: All graphics (Trucks, Staff, Crops, Machines) are rendered using **Inline SVGs**. This ensures fast loading and crisp visuals at any scale.
*   **Procedural Audio**: The game uses the **Web Audio API** to generate sound effects (pops, coins, upgrades) and dynamic music layers in real-time. No MP3 files are used.
*   **Advanced Simulation**:
    *   **A* Pathfinding**: Staff use vector-based movement and state machines (Idle -> Moving -> Harvesting -> Depositing -> Tired -> Drinking).
    *   **Economy**: Dynamic market with supply/demand events (Surges/Crashes).
    *   **Performance**: Optimized React rendering using `useRef` for the game loop (60fps) to avoid React render cycle overhead.
    *   **Dynamic Rent**: Rent scales with unlocked zones (Base $100 -> Max $3850), creating increasing pressure to optimize production.
    *   **Stamina System**: Staff get tired and must physically travel to the Coffee Machine. Upgrading the machine speeds up their recovery time.
