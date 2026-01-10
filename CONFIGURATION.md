# configuration guide

complete guide to customizing your re-start startpage

---

## table of contents

### 1. [getting started](#getting-started)
   - [finding the settings button](#finding-the-settings-button)
   - [settings modal overview](#settings-modal-overview)
   - [saving changes](#saving-changes)
   - [reset to defaults](#reset-to-defaults)

### 2. [appearance](#appearance)
   - [color schemes](#color-schemes)
   - [fonts](#fonts)
   - [tab title](#tab-title)
   - [background images](#background-images)
   - [custom css](#custom-css)

### 3. [integrations](#integrations)
   - [overview](#overview)
   - [google (tasks & calendar)](#google-tasks--calendar)
   - [todoist](#todoist)
   - [unsplash](#unsplash)
   - [integration status indicators](#integration-status-indicators)
   - [security & privacy](#security--privacy)
   - [common integration issues](#common-integration-issues)

### 4. [clock & date](#clock--date)
   - [overview](#overview-1)
   - [time format](#time-format)
   - [date format](#date-format)
   - [clock widget behavior](#clock-widget-behavior)
   - [common questions](#common-questions)
   - [troubleshooting](#troubleshooting-1)

### 5. [weather](#weather)
   - [enabling/disabling weather](#enablingdisabling-weather)
   - [location mode](#location-mode)
   - [temperature units](#temperature-units)
   - [wind speed units](#wind-speed-units)
   - [weather widget features](#weather-widget-features)
   - [refreshing weather data](#refreshing-weather-data)
   - [understanding weather data](#understanding-weather-data)
   - [common questions](#common-questions-1)
   - [troubleshooting](#troubleshooting-2)

### 6. [tasks](#tasks)
   - [enabling/disabling tasks](#enablingdisabling-tasks)
   - [choosing a task source](#choosing-a-task-source)
   - [using local tasks](#using-local-tasks)
   - [using todoist tasks](#using-todoist-tasks)
   - [using google tasks](#using-google-tasks)
   - [adding tasks](#adding-tasks)
   - [managing tasks](#managing-tasks)
   - [task display & sorting](#task-display--sorting)
   - [refreshing tasks](#refreshing-tasks)
   - [common questions](#common-questions-2)
   - [troubleshooting](#troubleshooting-3)

### 7. [calendar](#calendar)
   - [enabling/disabling calendar](#enablingdisabling-calendar)
   - [google calendar integration](#google-calendar-integration)
   - [calendar filtering/selection](#calendar-filteringselection)
   - [event display](#event-display)
   - [instant conference links](#instant-conference-links)
   - [sync behavior](#sync-behavior)
   - [common questions](#common-questions-3)
   - [troubleshooting](#troubleshooting-4)

### 8. [quick links](#quick-links)
   - [enabling/disabling links](#enablingdisabling-links)
   - [link display settings](#link-display-settings)
   - [managing your links](#managing-your-links)
   - [default links](#default-links)
   - [link widget tips](#link-widget-tips)

### 9. [advanced features](#advanced-features)
   - [force refresh by clicking labels](#force-refresh-by-clicking-labels)
   - [keyboard shortcuts](#keyboard-shortcuts)
   - [performance tips](#performance-tips)
   - [reset settings option](#reset-settings-option)
   - [additional tips](#additional-tips)

### 10. [natural language date parsing](#natural-language-date-parsing)
   - [how it works](#how-it-works)
   - [quick reference](#quick-reference)
   - [real-world examples](#real-world-examples)
   - [tips for best results](#tips-for-best-results)
   - [where to find this feature](#where-to-find-this-feature)

### 11. [troubleshooting](#troubleshooting-5)
   - [quick troubleshooting checklist](#quick-troubleshooting-checklist)
   - [api token verification failures](#api-token-verification-failures)
   - [weather not loading](#weather-not-loading)
   - [tasks not syncing](#tasks-not-syncing)
   - [background images not appearing](#background-images-not-appearing)
   - [google sign-in issues](#google-sign-in-issues)
   - [calendar widget issues](#calendar-widget-issues)
   - [widget not showing or blank](#widget-not-showing-or-blank)
   - [performance issues](#performance-issues-1)
   - [settings not saving](#settings-not-saving)
   - [custom css not applying](#custom-css-not-applying)
   - [date parsing not working](#date-parsing-not-working)
   - [theme not changing](#theme-not-changing)
   - [getting more help](#getting-more-help)

---

**appendices:**
- [appendix a: css variable reference](#appendix-a-css-variable-reference) *(coming soon)*
- [appendix b: settings storage schema](#appendix-b-settings-storage-schema) *(coming soon)*
- [appendix c: api rate limits summary](#appendix-c-api-rate-limits-summary) *(coming soon)*
- [appendix d: theme color reference](#appendix-d-theme-color-reference) *(coming soon)*

---

## getting started

welcome to re-start! this section will help you discover and navigate the settings interface to customize your startpage.

### finding the settings button

the settings button is intentionally subtle to maintain a clean interface. here's how to find it:

**location:** top-right corner of the page

**how to access:**
1. move your cursor to the **top-right corner** of the page
2. the settings button (gear icon) will appear on hover
3. click the button to open the settings modal

**why is it hidden?**
the button appears only on hover to keep the interface minimal and distraction-free. once you know it's there, it becomes second nature!

**tip:** if you're having trouble finding it, slowly move your mouse along the top-right edge of your screen. the button will appear as soon as your cursor gets close.

### settings modal overview

the settings are organized into **7 tabs**, each focused on a different aspect of customization:

#### **appearance**
customize the visual design of your startpage:
- choose from 8 color themes
- change fonts
- enable background images
- add custom css for advanced styling
- adjust tab title

#### **integrations**
connect your external accounts:
- **google** - for google tasks and calendar (oauth sign-in)
- **todoist** - for todoist tasks (api token)
- **unsplash** - for daily background images (api key)

#### **clock**
configure time and date display:
- time format (12-hour or 24-hour)
- date format (mdy or dmy)
- show/hide clock widget

#### **weather**
set up weather information:
- enable/disable weather widget
- location mode (automatic or manual coordinates)
- temperature units (celsius or fahrenheit)
- wind speed units (km/h or mph)

#### **tasks**
manage your task list:
- enable/disable tasks widget
- choose task source (local storage, todoist, or google tasks)
- add and manage tasks with natural language date parsing

#### **calendar**
configure google calendar integration:
- enable/disable calendar widget
- select which calendars to display
- view today's events

#### **links**
customize your quick links:
- enable/disable links widget
- toggle favicon display
- set links per column
- choose link target (same tab or new tab)
- add, edit, delete, and reorder links

### saving changes

**good news:** you don't need to click a save button!

**auto-save behavior:**
- all settings changes save **automatically**
- changes apply **instantly** (no page refresh needed)
- settings persist in your browser's `localStorage`

**what this means:**
- your customizations will be there every time you open a new tab
- settings are stored locally in your browser only
- no account or cloud sync required

**if you clear your browser data:**
- clearing `localStorage` will reset all settings to defaults
- this includes clearing browsing data or cache in browser settings
- api tokens and integration settings will also be lost
- consider backing up your settings (see [appendix b](#appendix-b-settings-storage-schema))

### reset to defaults

need a fresh start? you can reset all settings to their default values.

**how to reset:**
1. open settings (hover top-right corner)
2. scroll to the bottom of any settings tab
3. click the **"reset settings"** button
4. confirm the action

**⚠️ warning:**
- resetting is **permanent** and cannot be undone
- all customizations will be lost (themes, integrations, links, etc.)
- you'll need to re-enter api tokens and reconnect integrations
- default links will be restored

**when to reset:**
- something broke and you want to start fresh
- you want to go back to the default configuration
- you're troubleshooting an issue

---

## appearance

customize the visual design of your startpage including themes, fonts, background images, and advanced styling.

### color schemes

re-start includes **8 carefully curated themes** to match your aesthetic preference:

#### available themes

1. **default** - clean monochromatic gray scale with excellent contrast. features pure blacks and whites for a professional, distraction-free appearance. ideal for users who prefer minimalism without color distractions.

2. **rosé pine** - cozy low-contrast theme with deep purple backgrounds and soft rose-pink accents. creates a warm, comfortable atmosphere perfect for late-night browsing. muted tones reduce eye strain while maintaining visual interest.

3. **catppuccin mocha** - elegant dark theme featuring pastel accents on deep backgrounds. lavender highlights and pink error states create a modern, playful aesthetic. part of the popular catppuccin color scheme family.

4. **catppuccin latte** - the only light theme in the collection. soft beige backgrounds with blue accents create a bright, airy feel. perfect for daytime use or well-lit environments. maintains the catppuccin aesthetic in a light variant.

5. **nord** - arctic-inspired theme with cool blue-gray tones and frost-blue accents. creates a calm, professional atmosphere with excellent readability. inspired by the colors of the northern lights and frozen landscapes.

6. **tokyo night** - vibrant dark blue theme capturing the neon-lit atmosphere of tokyo after dark. features bright blue accents against deep navy backgrounds. balances energy with calmness for focused work.

7. **gruvbox** - vintage retro theme with warm earthy tones. beige text on brown backgrounds creates a nostalgic, comfortable feel reminiscent of classic terminals. warm yellow accents add visual warmth.

8. **everforest** - nature-inspired theme with muted green accents and forest tones. creates a calming, organic atmosphere. soft greens and browns evoke peaceful woodland environments, reducing visual fatigue.

#### how to change themes

1. open settings → **appearance** tab
2. under **"color scheme"**, you'll see a grid of theme options
3. click any theme to apply it instantly
4. the theme applies immediately (no save button needed)

**tip:** themes change the entire color palette including text, backgrounds, and accent colors. try a few to find your favorite!

### fonts

customize the typeface used throughout the interface.

#### changing the font

1. open settings → **appearance** tab
2. find the **"font"** field
3. enter any system font name or web-safe font
4. the font applies immediately

**default font:** `Geist Mono Variable` (a modern monospace font)

#### recommended fonts

**monospace fonts:**
- `Geist Mono Variable` (default)
- `JetBrains Mono`
- `Fira Code`
- `Source Code Pro`
- `IBM Plex Mono`
- `Consolas`
- `Monaco`
- `Courier New`

**sans-serif fonts:**
- `Inter`
- `Roboto`
- `Open Sans`
- `Helvetica Neue`
- `Arial`

**tips:**
- monospace fonts provide better alignment for task lists and data
- ensure the font is installed on your system or is web-safe
- use font family names exactly as they appear in your system (case-sensitive)
- if a font fails to load, the browser will fall back to a default

### tab title

change the text displayed in your browser tab.

#### customizing the tab title

1. open settings → **appearance** tab
2. find the **"tab title"** field (next to font)
3. enter any text you want (or leave it blank for no title)
4. the tab title updates immediately

**default:** `~` (a single tilde)

**examples:**
- `~` - minimal (default)
- `home` - descriptive
- `start` - simple
- `⌘` - use emoji or symbols
- `` - leave blank for no title

**why customize this?**
- helps identify the tab among many open tabs
- personalize your browsing experience
- use symbols for a cleaner look

### background images

add beautiful daily background images powered by unsplash.

#### enabling background images

1. **first, get an unsplash api key:**
   - you need to set this up in the **integrations** tab first
   - see the [integrations](#integrations) section for detailed setup instructions

2. **enable backgrounds:**
   - open settings → **appearance** tab
   - scroll to **"background image"**
   - check the **"enabled"** checkbox

3. **if no api key is configured:**
   - you'll see a message: _"add unsplash api key in integrations tab"_
   - go to integrations tab and add your key first

#### background image controls

once enabled with a valid api key, you get these controls:

**opacity slider:**
- adjust how transparent the interface panels appear over the background
- range: 0.0 (fully transparent) to 1.0 (fully opaque)
- default: 0.85 (slightly transparent for a "frosted glass" effect)
- lower values make the background more visible
- higher values make panels more solid

**image attribution:**
- displays the photographer's name (clickable link to their unsplash profile)
- shows the image topic (nature, abstract, city, etc.)
- honors unsplash's photographer attribution requirements

**new image button:**
- click **"new image"** to fetch a fresh background immediately
- normally, backgrounds refresh automatically once per day
- topics rotate randomly: abstract, nature, city, architecture, landscape

#### how backgrounds work

- **daily refresh:** new image fetched automatically once per day
- **caching:** images are cached locally to avoid excessive api calls
- **frosted glass effect:** when backgrounds are enabled, all panels get a semi-transparent blur effect
- **performance:** images are lazy-loaded and don't impact startup speed

**visual effect:**
- with backgrounds enabled, the entire interface gets a modern "frosted glass" aesthetic
- panels become slightly transparent with a blur effect
- text remains readable with adjusted contrast
- works beautifully with all 8 color themes

### custom css

for advanced users: inject your own css to fully customize the interface.

#### how to add custom css

1. open settings → **appearance** tab
2. scroll to **"custom css"**
3. enter your css rules in the text area
4. changes apply immediately

**format:**
```css
/* add your custom styles here */
selector {
    property: value;
}
```

#### css variable reference

re-start uses css variables for theming. you can override these:

**background colors:**
- `--bg-1` - primary background (darkest/lightest)
- `--bg-2` - secondary background (medium)
- `--bg-3` - tertiary background (lightest/darkest)

**text colors:**
- `--txt-1` - primary text (highest contrast)
- `--txt-2` - secondary text (medium contrast)
- `--txt-3` - tertiary text (low contrast, muted)
- `--txt-4` - accent text (highlights, links)
- `--txt-err` - error text (warnings, errors)

**other variables:**
- `--font-family` - the current font

#### custom css examples

these examples are organized by use case. copy and paste any example into the custom css field, then tweak as needed!

##### hiding elements

**hide the weather widget completely:**
```css
/* useful if you don't need weather information */
.weather {
    display: none !important;
}
```

**hide the quick links panel:**
```css
/* if you prefer not to show quick links */
.links {
    display: none !important;
}
```

**hide the calendar/agenda widget:**
```css
/* hide calendar events */
.agenda {
    display: none !important;
}
```

**hide completed tasks immediately:**
```css
/* normally completed tasks show for 5 minutes */
.task.completed,
[data-task-completed="true"] {
    display: none !important;
}
```

**hide task project names:**
```css
/* show only task content, not project labels */
[data-task-project] {
    display: none;
}
```

**hide task due dates:**
```css
/* show only task content, not due dates */
[data-task-due] {
    display: none;
}
```

**hide the settings button:**
```css
/* hide gear icon in top-right (not recommended!) */
.settings-button {
    display: none !important;
}
```

**hide weather forecast (keep current conditions):**
```css
/* hide the 5-hour forecast, show only current weather */
.weather-forecast {
    display: none;
}
```

##### adjusting spacing & sizing

**increase spacing between panels:**
```css
/* add more breathing room between widgets */
.panel {
    margin: 2rem;
}
```

**compact layout (less spacing):**
```css
/* tighter spacing for smaller screens */
body {
    font-size: 0.9em;
}

.panel {
    padding: 1rem;
    margin: 0.5rem;
}
```

**wider task list:**
```css
/* more room for long task names */
.tasks {
    max-width: 600px;
}
```

**larger clock:**
```css
/* make the time display bigger */
.clock .time {
    font-size: 5rem;
}
```

**smaller date text:**
```css
/* make date less prominent */
.clock .date {
    font-size: 0.8rem;
}
```

**increase panel padding:**
```css
/* more internal spacing within panels */
.panel {
    padding: 2rem;
}
```

**wider quick links columns:**
```css
/* make links section wider */
.links {
    max-width: 800px;
}
```

**adjust panel width:**
```css
/* make all panels narrower or wider */
.panel {
    max-width: 400px; /* or any value you prefer */
}
```

##### custom colors

**custom accent color (affects links, highlights):**
```css
/* change accent color throughout the interface */
:root {
    --txt-4: #00d4ff; /* bright cyan */
}
```

**custom error/warning color:**
```css
/* change color used for errors and overdue tasks */
:root {
    --txt-err: #ff4444; /* bright red */
}
```

**custom primary text color:**
```css
/* change the main text color */
:root {
    --txt-1: #ffffff; /* pure white */
}
```

**custom background colors:**
```css
/* adjust background shades */
:root {
    --bg-1: #000000; /* pure black background */
    --bg-2: #0a0a0a; /* slightly lighter */
    --bg-3: #141414; /* even lighter */
}
```

**colorful task checkboxes:**
```css
/* make completed task checkboxes green */
.task input[type="checkbox"]:checked {
    accent-color: #00ff00;
}
```

**colorful links with hover effect:**
```css
/* custom link colors */
.links a {
    color: #ff6b6b;
    transition: color 0.2s;
}

.links a:hover {
    color: #ffd93d;
}
```

**gradient text for clock:**
```css
/* rainbow gradient clock */
.clock .time {
    background: linear-gradient(90deg, #ff6b6b, #ffd93d, #51cf66);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
}
```

**custom panel background:**
```css
/* darker, more opaque panels */
.panel {
    background: rgba(0, 0, 0, 0.9) !important;
    backdrop-filter: blur(20px);
}
```

##### visual effects

**rounded panels:**
```css
/* soften panel corners */
.panel {
    border-radius: 20px;
}
```

**panel shadows:**
```css
/* add drop shadows to panels */
.panel {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
}
```

**clock text shadow:**
```css
/* add glow effect to time display */
.clock .time {
    text-shadow: 0 0 20px currentColor;
}
```

**smooth transitions:**
```css
/* add smooth animations to panels */
.panel {
    transition: all 0.3s ease;
}

.panel:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
}
```

**frosted glass effect:**
```css
/* enhanced blur effect for panels */
.panel {
    backdrop-filter: blur(30px) saturate(150%);
    background: rgba(255, 255, 255, 0.05) !important;
}
```

**custom link hover underline:**
```css
/* animated underline on hover */
.links a {
    position: relative;
    transition: color 0.2s;
}

.links a::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 2px;
    background: var(--txt-4);
    transition: width 0.2s;
}

.links a:hover::after {
    width: 100%;
}
```

##### layout adjustments

**center all content:**
```css
/* center panels on the page */
.app-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
}
```

**horizontal layout:**
```css
/* arrange panels side-by-side */
.app-container {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 1rem;
}
```

**fixed panel widths:**
```css
/* consistent width for all panels */
.panel {
    width: 400px;
    max-width: 400px;
}
```

**full-width task list:**
```css
/* stretch tasks across the screen */
.tasks {
    width: 100%;
    max-width: 100%;
}
```

##### accessibility

**high contrast mode:**
```css
/* maximum contrast for better readability */
:root {
    --txt-1: #ffffff;
    --txt-2: #e0e0e0;
    --bg-1: #000000;
    --bg-2: #1a1a1a;
}
```

**larger text for readability:**
```css
/* increase all text sizes */
body {
    font-size: 1.2em;
}
```

**remove transparency:**
```css
/* solid panels (no frosted glass effect) */
.panel {
    background: var(--bg-2) !important;
    backdrop-filter: none !important;
}
```

**focus indicators:**
```css
/* visible focus outlines for keyboard navigation */
*:focus {
    outline: 2px solid var(--txt-4) !important;
    outline-offset: 2px;
}
```

#### tips for custom css

**use `!important` sparingly:**
- only needed when overriding existing styles
- most custom styles won't require it

**inspect elements:**
- right-click any element and select "inspect element"
- view the class names and current styles
- experiment in browser devtools first, then copy to custom css

**test incrementally:**
- add one rule at a time
- verify it works before adding more
- easier to debug issues this way

**backup your css:**
- custom css is stored in browser `localStorage`
- if you clear browser data, it's lost
- copy your css somewhere safe for backup

**use browser-specific prefixes if needed:**
```css
.element {
    -webkit-backdrop-filter: blur(10px);
    backdrop-filter: blur(10px);
}
```

**start simple:**
- begin with color and spacing adjustments
- advance to layout changes once comfortable
- refer to the full [css variable reference](#appendix-a-css-variable-reference) in appendix a

**combine examples:**
- you can use multiple examples together
- just paste them one after another in the custom css field
- css rules cascade, so later rules override earlier ones

---

## integrations

connect external services to supercharge your startpage with tasks, calendar events, and beautiful background images.

### overview

re-start supports three integrations:

1. **google** - access google tasks and google calendar (oauth sign-in)
2. **todoist** - sync your todoist tasks (api token required)
3. **unsplash** - daily background images from professional photographers (api key required)

**how to access integrations:**
- open settings → **integrations** tab
- you'll see three integration cards (google, todoist, unsplash)
- each card shows current status and setup instructions

---

### google (tasks & calendar)

google integration uses **oauth 2.0** authentication for secure access to your google tasks and calendar. the best part: **no api keys to copy** - just click and sign in!

#### what you get

- **google tasks**: view, add, complete, and delete tasks
- **google calendar**: view today's calendar events (read-only)
- **automatic sync**: tokens refresh automatically, no maintenance needed

#### setup instructions

**step 1: sign in**

1. open settings → **integrations** tab
2. find the **google** integration card
3. click the **"sign in"** button
4. you'll be redirected to google's sign-in page

**step 2: grant permissions**

google will ask you to:
- select which google account to use
- grant permissions for:
  - google tasks access
  - google calendar (read-only)
  - view your email address

**step 3: authorization complete**

- after granting permissions, you'll be redirected back to re-start
- your email address will appear in the integration card
- status shows "signed in" ✓

**step 4: enable features**

**for tasks:**
1. go to settings → **tasks** tab
2. change "source" to **"google-tasks"**
3. enable "show tasks" if not already on
4. your google tasks will appear on the startpage

**for calendar:**
1. go to settings → **calendar** tab
2. enable **"show calendar"**
3. today's events will appear on the startpage

#### detailed visual walkthrough

here's a complete walkthrough with descriptions of what you'll see at each step:

**signing in to google:**

1. **open re-start settings**
   - make sure re-start is open in your browser (your startpage)
   - move your mouse to the **top-right corner** of the page
   - a settings icon (gear/cog symbol) will fade in as you hover
   - click the settings icon to open the settings modal
   - you'll see a modal window with tabs at the top

2. **navigate to integrations**
   - at the top of the settings modal, you'll see tabs: "appearance", "integrations", "clock", etc.
   - click on the **"integrations"** tab (second tab)
   - the integrations page will show three cards: google, todoist, and unsplash

3. **find the google card**
   - the **google** card is the first (leftmost) card
   - it has the google logo (the colorful "G")
   - you'll see:
     - a heading: "google"
     - a description: "access google tasks and calendar"
     - if not signed in: a blue **"sign in"** button
     - if signed in: your email address and a **"sign out"** button

4. **click sign in**
   - click the blue **"sign in"** button
   - a new popup window will open (or a new tab if popups are blocked)
   - **if popup is blocked**: check your browser's address bar for a popup blocker notification
     - click the notification to allow popups from re-start
     - try clicking "sign in" again

5. **google oauth consent screen**
   - the popup window will show google's sign-in page
   - you'll see the google logo at the top
   - **if you have multiple google accounts**:
     - you'll see a list of accounts you're signed into
     - click the account you want to use for re-start
   - **if you're not signed in**:
     - you'll see email and password fields
     - enter your google account credentials
     - click "next" to sign in

6. **grant permissions**
   - after selecting/signing into your account, you'll see the **consent screen**
   - the screen shows:
     - "re-start wants to access your google account"
     - a list of permissions requested:
       - ✓ view and manage your tasks
       - ✓ view events on all your calendars
       - ✓ create calendar events (for instant meet links)
       - ✓ see your primary google account email address
   - below the permissions, you'll see two buttons:
     - **"cancel"** (gray) - do not grant access
     - **"allow"** (blue) - grant access
   - click the blue **"allow"** button to proceed
   - **important**: you must grant all permissions for the integration to work

7. **redirect back to re-start**
   - after clicking "allow", google will redirect you back to re-start
   - the popup window will close automatically
   - you'll be back on the re-start settings page
   - the google card will now show:
     - **"signed in"** status with a green checkmark ✓
     - your **email address** (e.g., "user@gmail.com")
     - a **"sign out"** button (replaces the "sign in" button)
   - this confirms you're successfully authenticated!

**enabling google tasks:**

1. **switch to tasks tab**
   - still in the settings modal, click the **"tasks"** tab at the top
   - you'll see the tasks configuration page

2. **enable the tasks widget**
   - at the top of the tasks tab, you'll see a toggle labeled **"show tasks"**
   - if it's off (gray), click it to turn it **on** (it will turn blue/green)
   - this makes the tasks widget visible on your startpage

3. **select google tasks as source**
   - below the "show tasks" toggle, you'll see a dropdown labeled **"source"**
   - click the dropdown to open it
   - you'll see three options: "local", "todoist", "google-tasks"
   - select **"google-tasks"** from the dropdown
   - the dropdown will update to show "google-tasks" as the selected option
   - **note**: you must be signed in to google first (see steps above)

4. **select task list (if you have multiple)**
   - if you have multiple google task lists, you'll see a second dropdown labeled **"list"**
   - click it to see your available task lists (e.g., "my tasks", "work", "personal")
   - select the list you want to display on your startpage
   - if you only have one list, it will be auto-selected

**enabling google calendar:**

1. **switch to calendar tab**
   - still in the settings modal, click the **"calendar"** tab at the top
   - you'll see the calendar configuration page

2. **enable the calendar widget**
   - at the top of the calendar tab, you'll see a toggle labeled **"show calendar"**
   - if it's off (gray), click it to turn it **on** (it will turn blue/green)
   - this makes the calendar widget visible on your startpage
   - **note**: you must be signed in to google first (see steps above)

3. **select which calendars to display (optional)**
   - below the toggle, you'll see a **"calendars"** section
   - after a moment, it will load a list of your google calendars
   - each calendar has:
     - a checkbox (checked = shown, unchecked = hidden)
     - a color swatch (shows the calendar's color)
     - the calendar name (e.g., "personal", "work", "holidays")
     - a "primary" label if it's your primary calendar
   - **by default**: all calendars are selected (all events shown)
   - **to filter**: uncheck calendars you don't want to see on your startpage
   - click calendars to toggle them on/off
   - changes save automatically

4. **close settings and view your events**
   - click the **"× close"** button in the top-right of the settings modal
   - or press the **escape key** on your keyboard
   - the settings modal will close
   - you'll return to your startpage
   - if you enabled tasks: you'll see a **"tasks"** panel on the left
   - if you enabled calendar: you'll see a **"calendar"** panel showing today's events

**what you should see after setup:**

**for google tasks:**
- tasks widget displays on the left side of your startpage
- shows tasks from your selected google tasks list
- incomplete tasks appear at the top with empty checkboxes
- each task shows:
  - checkbox (click to complete/uncomplete)
  - task name
  - due date in gray (if task has a due date)
  - delete button (× icon, appears on hover)
- at the bottom: input field to add new tasks
- tasks sync automatically every 5 minutes

**for google calendar:**
- calendar widget displays on the right side of your startpage (or below tasks if screen is narrow)
- panel header shows "x events" (where x is the number of events today)
- each event shows:
  - time (respects your clock time format: 12hr or 24hr)
  - event title
  - location (if specified)
  - conference link button (if google meet/zoom link exists)
- all-day events appear first
- then events are sorted chronologically
- past events are grayed out
- ongoing events may be highlighted
- empty state: "no events today" if calendar is empty
- "+ instant conf" button at bottom to quickly create a google meet link

#### signing out

to disconnect google integration:
1. open settings → **integrations** tab
2. click **"sign out"** in the google card
3. this revokes access tokens and clears your session
4. your tasks and calendar will no longer sync

#### how it works (technical)

- **oauth 2.0**: secure authentication managed by google
- **backend server**: handles token storage and refresh (no credentials stored in browser)
- **access tokens**: expire after 1 hour, automatically refreshed
- **permissions**: read google tasks, read google calendar, create calendar events (for instant meet links), view email address
- **privacy**: your credentials never leave google's servers

#### troubleshooting

**sign-in popup blocked**
- browser may have blocked the popup window
- check your browser's popup blocker settings
- allow popups for the re-start domain

**sign-in fails with error**
- try signing out and signing in again
- clear browser cache and try again
- check browser console for specific error messages

**tasks/calendar not syncing**
- check that you've selected google-tasks in the tasks tab
- check that calendar is enabled in the calendar tab
- try signing out and signing in again
- click the widget labels to force a refresh

**"unauthorized" error**
- access token may have expired and failed to refresh
- solution: sign out and sign in again

---

### todoist

todoist integration uses an **api token** for authentication. you'll need to get your personal token from todoist's website.

#### what you get

- **sync all tasks**: view tasks from your todoist inbox and projects
- **add tasks**: create new tasks with due dates
- **complete/uncomplete**: toggle task completion status
- **delete tasks**: remove tasks from todoist
- **incremental sync**: efficient syncing only fetches changes

#### setup instructions

**step 1: get your todoist api token**

1. **open todoist website**
   - go to: https://todoist.com
   - log in to your account

2. **navigate to settings**
   - click your profile picture/avatar (top-left corner)
   - select **"settings"** from the dropdown

3. **go to integrations**
   - in the settings sidebar, click **"integrations"**

4. **find the developer section**
   - scroll down to the **"developer"** section
   - you'll see "api token" with a masked token

5. **copy your api token**
   - click **"copy to clipboard"** next to the api token
   - ⚠️ keep this private - it grants full access to your todoist account

**direct url:** https://todoist.com/app/settings/integrations/developer

#### detailed visual walkthrough

here's a complete walkthrough with descriptions of what you'll see at each step:

**getting the todoist api token:**

1. **start at todoist homepage**
   - open https://todoist.com in your browser
   - you'll see the todoist login page with email and password fields
   - enter your credentials and click the red "log in" button
   - after logging in, you'll see your todoist task list

2. **access settings**
   - look at the **top-left corner** of the page
   - you'll see your profile picture (circular avatar) or initials
   - click on it to open a dropdown menu
   - in the dropdown, you'll see options like "settings", "notifications", "theme", etc.
   - click on **"settings"** (usually the first option)
   - the settings page will open

3. **find integrations section**
   - on the settings page, you'll see a **left sidebar** with tabs
   - the sidebar includes: "general", "account", "notifications", "integrations", etc.
   - click on **"integrations"** in the left sidebar
   - the integrations page will load on the right side

4. **locate the developer section**
   - scroll down the integrations page
   - you'll pass sections like "calendar feeds", "email integrations", etc.
   - near the bottom, you'll find a section titled **"developer"**
   - this section has a gray background and contains your api token
   - you'll see text that says **"api token"** followed by a masked string like `••••••••••••••••••••••••••••••••••••••••`
   - below the masked token, you'll see a **"copy to clipboard"** button

5. **copy your token**
   - click the **"copy to clipboard"** button
   - the button text will briefly change to "copied!" with a checkmark
   - your 40-character api token is now in your clipboard
   - ⚠️ **important**: this token grants full access to your todoist account - keep it private!

**quick tip:** you can also go directly to https://todoist.com/app/settings/integrations/developer to skip steps 2-3 above.

**adding token to re-start:**

1. **open re-start settings**
   - make sure re-start is open in your browser (your startpage)
   - move your mouse to the **top-right corner** of the page
   - a settings icon (gear/cog symbol) will fade in as you hover
   - click the settings icon to open the settings modal
   - you'll see a modal window with tabs at the top

2. **navigate to integrations**
   - at the top of the settings modal, you'll see tabs: "appearance", "integrations", "clock", etc.
   - click on the **"integrations"** tab (second tab)
   - the integrations page will show three cards: google, todoist, and unsplash

3. **find the todoist card**
   - the **todoist** card is the middle card
   - it has the todoist logo (a circular checkmark icon)
   - you'll see:
     - a heading: "todoist"
     - a description: "sync your todoist tasks"
     - a text field labeled **"api token"**
     - a **"verify"** button below the text field

4. **paste your api token**
   - click in the **"api token"** text field
   - the field is a password input (you'll see dots instead of characters)
   - paste your token (ctrl/cmd + v) or right-click → paste
   - you won't see the actual token - it will show as `••••••••••••••••`

5. **verify the token**
   - after pasting, click the **"verify"** button
   - the button will show a loading spinner for 1-2 seconds
   - **if valid**: you'll see a green **✓ checkmark** appear next to the field
   - **if invalid**: you'll see a red **✗ error icon** and a message like "invalid token"
   - if you see an error, double-check you copied the full token with no extra spaces

**enabling todoist tasks in re-start:**

1. **switch to tasks tab**
   - still in the settings modal, click the **"tasks"** tab at the top
   - you'll see the tasks configuration page

2. **enable the tasks widget**
   - at the top of the tasks tab, you'll see a toggle labeled **"show tasks"**
   - if it's off (gray), click it to turn it **on** (it will turn blue/green)
   - this makes the tasks widget visible on your startpage

3. **select todoist as source**
   - below the "show tasks" toggle, you'll see a dropdown labeled **"source"**
   - click the dropdown to open it
   - you'll see three options: "local", "todoist", "google-tasks"
   - select **"todoist"** from the dropdown
   - the dropdown will update to show "todoist" as the selected option

4. **close settings and view your tasks**
   - click the **"× close"** button in the top-right of the settings modal
   - or press the **escape key** on your keyboard
   - the settings modal will close
   - you'll return to your startpage
   - you should now see a **"tasks"** panel on the left side
   - it will show your todoist tasks with checkboxes, due dates, and project names
   - the panel header will show "x tasks" (where x is the number of incomplete tasks)

**what you should see after setup:**

- tasks widget displays on the left side of your startpage
- incomplete tasks appear at the top with empty checkboxes
- completed tasks (from last 5 minutes) appear below with filled checkboxes
- each task shows:
  - checkbox (click to complete/uncomplete)
  - task name
  - project name in gray (if task belongs to a project)
  - due date in gray (if task has a due date)
  - delete button (× icon, appears on hover)
- at the bottom: input field to add new tasks
- tasks sync automatically every 5 minutes (or when you click the "x tasks" label)

**step 2: add token to re-start**

1. **open settings in re-start**
   - hover over top-right corner, click settings button

2. **go to integrations tab**
   - find the **todoist** integration card

3. **paste your token**
   - paste the api token into the "api token" field
   - the input is masked (password field) for security

4. **verify the token**
   - click the **"verify"** button
   - wait a moment while it tests the token
   - you should see a **checkmark** ✓ if valid
   - you'll see an **error icon** ✗ if invalid

**step 3: enable todoist tasks**

1. **go to tasks tab**
   - click the **"tasks"** tab in settings

2. **select todoist as source**
   - in the "source" dropdown, select **"todoist"**

3. **enable tasks widget**
   - toggle **"show tasks"** to on

4. **close settings**
   - your todoist tasks will now appear on the startpage!

#### what the token looks like

- **format**: 40-character hexadecimal string
- **example**: `a1b2c3d4e5f6789012345678901234567890abcd`
- **security**: grants full read/write access to your todoist account

#### verification button

the **verify** button:
- makes a test api call to todoist
- checks if your token is valid
- does not modify any tasks
- useful for troubleshooting token issues

**verification results:**
- ✓ checkmark = token is valid
- ✗ error icon = token is invalid or network error

#### revoking access

to disconnect todoist:
1. open settings → **integrations** tab
2. delete the token from the "api token" field
3. go to **tasks** tab and switch to a different source

**to revoke the token permanently:**
1. go to todoist settings: https://todoist.com/app/settings/integrations/developer
2. click **"reset api token"**
3. this generates a new token and invalidates the old one
4. you'll need to add the new token to re-start if you want to reconnect

#### troubleshooting

**verification fails**
- check that you copied the entire token (40 characters)
- make sure there are no extra spaces at the beginning or end
- try copying the token again from todoist
- if still failing, reset your api token in todoist and use the new one

**tasks not syncing**
- check your internet connection
- click the "x tasks" label at the top of the task widget to force a refresh
- check browser console for api errors (f12 → console)
- verify your token is still valid (click "verify" again)

**"invalid token" error**
- your token may have been reset in todoist
- get a fresh token from todoist settings
- paste the new token and verify again

**sync is slow**
- todoist api may be experiencing issues
- check todoist status: https://status.todoist.com
- force refresh by clicking the "x tasks" label

---

### unsplash

unsplash integration provides **daily background images** from high-quality professional photography. you'll need to create a free developer account and application.

#### what you get

- **daily backgrounds**: beautiful new image every day
- **variety**: images from topics like nature, abstract, city, architecture, landscape
- **attribution**: photographer credit displayed (required by unsplash)
- **manual refresh**: get a new image anytime with the refresh button
- **free**: unsplash api is free for personal use (with rate limits)

#### setup instructions

**step 1: create unsplash developer account**

1. **go to unsplash**
   - url: https://unsplash.com
   - sign up for a free account or log in

2. **navigate to unsplash developers**
   - url: https://unsplash.com/developers
   - click **"register as a developer"** (first time only)

3. **accept developer terms**
   - read and accept the unsplash api terms
   - agree to provide photographer attribution

**step 2: create a new application**

1. **go to your applications**
   - url: https://unsplash.com/oauth/applications
   - click **"new application"**

2. **fill out application details**
   - **application name**: "re-start" (or your preferred name)
   - **description**: "personal startpage with daily background images"
   - check all guideline checkboxes:
     - ✓ follow api guidelines
     - ✓ provide attribution
     - ✓ don't abuse the api
   - click **"create application"**

3. **copy your access key**
   - you'll see two keys on the application page:
     - **access key** ← this is what you need
     - secret key (not needed)
   - click the **copy icon** next to **access key**
   - ⚠️ keep the secret key private (though you don't need it)

#### detailed visual walkthrough

here's a complete walkthrough with descriptions of what you'll see at each step:

**creating unsplash developer account and application:**

1. **start at unsplash homepage**
   - open https://unsplash.com in your browser
   - you'll see the unsplash homepage with beautiful photos
   - if you don't have an account, click **"join"** in the top-right
   - if you have an account, click **"log in"** in the top-right
   - after logging in, you'll see your unsplash feed

2. **access unsplash developers**
   - go directly to https://unsplash.com/developers
   - or: scroll to the footer at the bottom of any unsplash page
   - in the footer, look for the **"developers/api"** link under the "company" section
   - click it to go to the developers homepage
   - you'll see a page titled **"unsplash developers"**
   - the page explains the api and has a **"register as a developer"** button

3. **register as a developer (first time only)**
   - if this is your first time, click **"register as a developer"**
   - you'll see a page with the api terms and guidelines
   - read the **unsplash api terms of use**
   - check the boxes to agree:
     - ✓ i agree to the api terms
     - ✓ i will provide attribution
     - ✓ i won't abuse the api
   - click the **"accept terms"** button
   - you're now registered as an unsplash developer!

4. **navigate to your applications**
   - after registering (or if already registered), go to: https://unsplash.com/oauth/applications
   - or: from the developers page, click **"your apps"** in the top navigation
   - you'll see a page titled **"your applications"**
   - if you have no apps yet, you'll see a **"new application"** button
   - if you have existing apps, they'll be listed here

5. **create a new application**
   - click the **"new application"** button
   - a modal window will appear titled **"new application"**
   - you'll see a form with several fields:
     - **application name** (required)
     - **description** (required)
     - guidelines checkboxes (required)
   - fill in the form:
     - **application name**: type "re-start" (or your preferred name)
     - **description**: type "personal startpage with daily background images"
     - check **all three guideline boxes**:
       - ✓ the api guidelines
       - ✓ unsplash api use and content policy
       - ✓ approved attribution
   - click the **"create application"** button

6. **get your access key**
   - after creating the app, you'll be redirected to your application page
   - at the top, you'll see your app name: "re-start"
   - below that, you'll see application details
   - scroll down to the **"keys"** section
   - you'll see two keys displayed:
     - **access key** (long alphanumeric string)
     - **secret key** (another long string, marked as sensitive)
   - next to the **access key**, you'll see a **copy icon** (two overlapping squares)
   - click the **copy icon** next to **access key**
   - the icon will briefly show a checkmark to confirm it's copied
   - **important**: copy the **access key**, NOT the secret key!

**quick tip:** save the url of your application page (https://unsplash.com/oauth/applications/YOUR_APP_ID) in case you need to find your key again later.

**adding api key to re-start:**

1. **open re-start settings**
   - make sure re-start is open in your browser (your startpage)
   - move your mouse to the **top-right corner** of the page
   - a settings icon (gear/cog symbol) will fade in as you hover
   - click the settings icon to open the settings modal
   - you'll see a modal window with tabs at the top

2. **navigate to integrations**
   - at the top of the settings modal, you'll see tabs: "appearance", "integrations", "clock", etc.
   - click on the **"integrations"** tab (second tab)
   - the integrations page will show three cards: google, todoist, and unsplash

3. **find the unsplash card**
   - the **unsplash** card is the third (rightmost) card
   - it has the unsplash logo (stylized mountain/wave icon)
   - you'll see:
     - a heading: "unsplash"
     - a description: "daily background images"
     - a text field labeled **"api key"**
     - a **"verify"** button below the text field

4. **paste your api key**
   - click in the **"api key"** text field
   - the field is a password input (you'll see dots instead of characters)
   - paste your access key (ctrl/cmd + v) or right-click → paste
   - you won't see the actual key - it will show as `••••••••••••••••`
   - **make sure you pasted the access key, not the secret key!**

5. **verify the api key**
   - after pasting, click the **"verify"** button
   - the button will show a loading spinner for 2-3 seconds
   - the app fetches a test image from unsplash to verify the key works
   - **if valid**: you'll see a green **✓ checkmark** appear next to the field
   - **if invalid**: you'll see a red **✗ error icon** and a message
   - common error: if you see "invalid key", make sure you copied the **access key** (not secret key)

**enabling background images:**

1. **switch to appearance tab**
   - still in the settings modal, click the **"appearance"** tab at the top (first tab)
   - you'll see the appearance configuration page

2. **enable background images**
   - scroll down to the **"background image"** section
   - you'll see a toggle labeled **"show background image"**
   - if it's off (gray), click it to turn it **on** (it will turn blue/green)
   - the toggle will immediately save your preference

3. **adjust opacity (optional)**
   - below the toggle, you'll see an **"opacity"** slider
   - the slider ranges from 0% (background fully visible) to 100% (panels fully opaque)
   - default is around 80%
   - drag the slider left to make the background more visible
   - drag the slider right to make the interface panels more visible
   - you'll see the opacity value displayed next to the slider (e.g., "75%")
   - **tip**: 70-80% provides a good balance between beauty and readability

4. **get a new image (optional)**
   - below the opacity slider, you'll see a **"new image"** button
   - this forces a fresh image fetch, even if you already have today's image
   - click it to get a different background image immediately
   - the button will show a loading spinner while fetching
   - useful if you don't like the current image

5. **close settings and enjoy**
   - click the **"× close"** button in the top-right of the settings modal
   - or press the **escape key** on your keyboard
   - the settings modal will close
   - you'll return to your startpage with a beautiful background image!
   - the background will be visible behind all the widget panels
   - panels will have a frosted glass effect (blurred background behind them)

**what you should see after setup:**

- beautiful high-quality photo as your background
- frosted glass effect on all widget panels (clock, tasks, weather, etc.)
- panels are semi-transparent, showing the background through them
- photographer attribution in the bottom-left corner (hover to see details):
  - photographer name
  - photo link to unsplash
  - topic (e.g., "abstract", "nature", "city")
- background updates automatically once per day (based on your local date)
- you can force a new image anytime via settings → appearance → "new image"

**step 3: add api key to re-start**

1. **open settings in re-start**
   - hover over top-right corner, click settings button

2. **go to integrations tab**
   - find the **unsplash** integration card

3. **paste your api key**
   - paste the access key into the "api key" field
   - the input is masked (password field) for security

4. **verify the key**
   - click the **"verify"** button
   - wait while it fetches a test image
   - you should see a **checkmark** ✓ if valid
   - you'll see an **error icon** ✗ if invalid

**step 4: enable background images**

1. **go to appearance tab**
   - click the **"appearance"** tab in settings

2. **enable background**
   - toggle **"show background image"** to on

3. **adjust opacity** (optional)
   - use the opacity slider to adjust transparency
   - lower = more visible background
   - higher = more visible interface panels

4. **close settings**
   - a beautiful background image will appear!
   - image updates automatically once per day

#### daily refresh behavior

- **automatic**: fetches a new image once per day
- **smart caching**: if you already have today's image, uses cache (no api call)
- **manual refresh**: click **"new image"** in appearance settings to get a fresh image immediately
- **topics**: randomly selects from abstract, nature, city, architecture, or landscape

#### rate limits

**demo applications** (new apps):
- **50 requests per hour**
- good for personal use with daily images
- if you hit the limit, wait an hour

**production applications** (approved apps):
- **5,000 requests per hour**
- apply for production access if needed
- go to your application page and click "request production access"
- usually approved within a few days (free)

#### photographer attribution

unsplash requires attribution for all images. re-start automatically:
- displays photographer name when you hover over the background
- links to the photo on unsplash
- shows the image topic
- complies with unsplash api guidelines

**this is built-in and automatic** - you don't need to do anything!

#### verification button

the **verify** button:
- fetches a test image from unsplash
- checks if your api key is valid
- does not count against your daily image (separate test call)
- useful for troubleshooting key issues

**verification results:**
- ✓ checkmark = api key is valid
- ✗ error icon = key is invalid or network error

#### revoking access

to disconnect unsplash:
1. open settings → **integrations** tab
2. delete the api key from the "api key" field
3. go to **appearance** tab and disable "show background image"

**to permanently delete your application:**
1. go to: https://unsplash.com/oauth/applications
2. find your application (e.g., "re-start")
3. click the application name
4. scroll down and click **"delete application"**
5. this revokes the access key

#### troubleshooting

**verification fails**
- make sure you copied the **access key**, not the secret key
- check for extra spaces at beginning or end
- try copying the key again from unsplash
- verify your application was created successfully

**background image not loading**
- verify the api key first (click "verify" button)
- check browser console for errors (f12 → console)
- check if you hit the rate limit (50/hour for demo apps)
- try manual refresh in appearance settings ("new image" button)

**rate limit exceeded (429 error)**
- demo apps are limited to 50 requests per hour
- **solution**: apply for production access (free, up to 5,000/hour)
  1. go to: https://unsplash.com/oauth/applications
  2. click your application name
  3. click **"request production access"**
  4. usually approved within a few days
- or wait an hour for rate limit to reset

**images load slowly**
- unsplash images are high-quality and may take a moment to download
- the app uses "regular" size (~1080px) for balance between quality and speed
- once cached, images load instantly on future visits
- check your internet connection speed

**new image not appearing**
- images update once per day (based on current date)
- force a new image: settings → appearance → click "new image"
- clear browser cache if image seems stuck

---

### integration status indicators

in the **integrations** tab, each integration card shows its current status:

**google:**
- **"sign in"** button = not signed in
- **"signed in"** + email = connected
- **"sign out"** button = click to disconnect

**todoist:**
- **empty field** = not configured
- **✓ checkmark** = token verified successfully
- **✗ error icon** = token verification failed
- **masked field** = token entered but not verified

**unsplash:**
- **empty field** = not configured
- **✓ checkmark** = api key verified successfully
- **✗ error icon** = key verification failed
- **masked field** = key entered but not verified

**pulsing settings button:**
- if settings are incomplete, the settings button may pulse/glow
- this indicates required configuration is missing
- complete integration setups to stop the pulsing

---

### security & privacy

**google oauth:**
- credentials never stored in browser
- backend server handles token refresh
- tokens automatically expire and refresh
- revoke access anytime with "sign out"

**todoist api token:**
- stored in browser `localStorage` only
- grants full access to your todoist account
- never sent to anyone except todoist api
- revoke by resetting token in todoist settings

**unsplash api key:**
- stored in browser `localStorage` only
- access key is safe for public use (read-only)
- secret key not used (and should stay private)
- revoke by deleting application in unsplash

**data storage:**
- all credentials stored locally in your browser
- nothing sent to re-start servers (except google oauth)
- clearing browser data will erase all credentials
- no cloud sync or backup of credentials

**best practices:**
- don't share your api tokens or keys with anyone
- use the verification buttons to ensure tokens are valid
- revoke old tokens if you stop using an integration
- back up your settings if you clear browser data often (see [appendix b](#appendix-b-settings-storage-schema))

---

### common integration issues

**settings button not visible**
- **issue**: can't find settings to add credentials
- **solution**: hover cursor over the **top-right corner** of the page
- settings button appears on hover (intentionally subtle ui)

**credentials not persisting**
- **issue**: have to re-enter credentials every time
- **solution**: check browser `localStorage` isn't being cleared
- some privacy extensions clear `localStorage` aggressively
- check browser settings for `localStorage` permissions
- disable "clear data on exit" if enabled

**integration works but widget not showing**
- **issue**: signed in / token verified, but no data displayed
- **solution**: check that the widget is enabled:
  - **tasks**: settings → tasks tab → "show tasks" enabled
  - **calendar**: settings → calendar tab → "show calendar" enabled
  - **background**: settings → appearance tab → "show background image" enabled

**force refresh not working**
- **issue**: clicking widget labels doesn't refresh
- **solution**:
  - only works on some widgets (tasks, weather)
  - click the **label text** at top of widget (e.g., "x tasks", "weather")
  - background refresh: settings → appearance → "new image" button

**multiple integrations interfering**
- **issue**: switching between todoist and google tasks causes issues
- **solution**: only one task source can be active at a time
  - go to settings → tasks tab
  - select only one source: local, todoist, or google-tasks
  - switching sources is safe and won't delete data

---

## clock & date

customize how time and date are displayed on your startpage.

### overview

the clock & date widget is a **central feature** of re-start, always visible at the top of your startpage. it displays:
- current time (hours, minutes, seconds)
- current date (weekday, month, day, year)

you can customize **how** the time and date are formatted to match your preference.

**where to find clock settings:**
- open settings → **clock** tab
- you'll see two formatting options

---

### time format

choose between 12-hour or 24-hour time display.

#### available formats

**12-hour (12h)**
- displays: `01:30:45 pm`
- includes am/pm indicator
- hours range from 01-12
- noon = 12:00 pm, midnight = 12:00 am
- common in the united states

**24-hour (24h)**
- displays: `13:30:45`
- no am/pm indicator
- hours range from 00-23
- noon = 12:00, midnight = 00:00
- common internationally, preferred by developers
- **default format**

#### how to change time format

1. open settings → **clock** tab
2. under **"time format"**, select your preference:
   - **12h** - twelve-hour format with am/pm
   - **24h** - twenty-four-hour format (military time)
3. the clock updates immediately

**examples:**

| time        | 12h display  | 24h display |
|-------------|--------------|-------------|
| midnight    | 12:00:00 am  | 00:00:00    |
| early morning | 03:30:15 am | 03:30:15    |
| noon        | 12:00:00 pm  | 12:00:00    |
| afternoon   | 02:45:30 pm  | 14:45:30    |
| evening     | 11:59:59 pm  | 23:59:59    |

**tips:**
- 24-hour format is unambiguous (no confusion between am/pm)
- 12-hour format may feel more familiar depending on your region
- changes apply instantly (no page refresh needed)

---

### date format

choose between month/day/year or day/month/year order.

#### available formats

**m/d/y (american format)**
- displays: `friday, january 17, 2025`
- month comes before day
- common in the united states
- uses `en-US` locale

**d/m/y (international format)**
- displays: `friday, 17 january 2025`
- day comes before month
- common internationally (europe, asia, etc.)
- uses `en-GB` locale
- **default format**

#### how to change date format

1. open settings → **clock** tab
2. under **"date format"**, select your preference:
   - **m/d/y** - month/day/year (american)
   - **d/m/y** - day/month/year (international)
3. the date updates immediately

**examples:**

| date          | m/d/y display           | d/m/y display           |
|---------------|-------------------------|-------------------------|
| jan 1, 2025   | wednesday, january 1, 2025 | wednesday, 1 january 2025 |
| july 4, 2025  | friday, july 4, 2025    | friday, 4 july 2025     |
| dec 31, 2025  | wednesday, december 31, 2025 | wednesday, 31 december 2025 |

**tips:**
- the format affects the **order**, not the content (both show full weekday, month, day, year)
- both formats display the date in lowercase for a clean aesthetic
- choose the format that matches your regional preference

---

### clock widget behavior

the clock widget is always visible and cannot be hidden (it's a core feature of the startpage).

#### what's displayed

**time section (top):**
- hours : minutes : seconds
- am/pm indicator (if 12-hour format selected)
- large, prominent font size
- updates every second

**date section (bottom):**
- full weekday name (e.g., "monday")
- full month name (e.g., "january")
- day of month (e.g., "17")
- full year (e.g., "2025")
- slightly smaller, muted font

#### technical details

**update frequency:**
- time updates every **1 second**
- synchronized to the second boundary (no drift)

**visibility optimization:**
- clock pauses when browser tab is hidden (saves resources)
- resumes automatically when tab becomes visible
- ensures accurate time when you switch back

**performance:**
- lightweight javascript interval
- no api calls (uses browser's local time)
- minimal cpu usage

---

### common questions

**can i hide the clock?**
- no, the clock is a central feature and is always visible
- you can use [custom css](#custom-css) to hide it if absolutely needed:
  ```css
  .panel[data-label="datetime"] {
      display: none !important;
  }
  ```
- **note:** hiding the clock defeats the purpose of a startpage, but the option exists for advanced users

**can i change the timezone?**
- no, the clock uses your **system timezone** automatically
- displayed time matches your computer's time settings
- if your system time is correct, the clock will be correct

**can i show/hide seconds?**
- no, seconds are always displayed
- this is a design choice for consistency
- you can use custom css to hide seconds if needed:
  ```css
  .clock .time span:nth-child(3),
  .clock .time span:nth-child(4) {
      display: none;
  }
  ```

**does the clock sync with internet time?**
- no, it displays your **local system time**
- ensure your computer's time settings are accurate
- most operating systems sync with internet time servers automatically

**why is the date lowercase?**
- design choice for a clean, minimal aesthetic
- consistent with the overall lowercase theme of the interface
- matches the minimalist style of the entire startpage

**can i change the date format to something else (e.g., ISO 8601)?**
- not through the settings ui
- only two formats available: m/d/y and d/m/y
- advanced users can modify the code or use custom css workarounds
- both formats show the full spelled-out date (not numeric abbreviations)

---

### customization with css

for advanced customization beyond the settings, use [custom css](#custom-css).

**change clock color:**
```css
.clock .time {
    color: #00ff00; /* bright green */
}
```

**change clock font size:**
```css
.clock .time {
    font-size: 5rem; /* larger */
}
```

**change date text color:**
```css
.clock .date {
    color: var(--txt-2);
}
```

**add text shadow to time:**
```css
.clock .time {
    text-shadow: 0 0 20px currentColor;
}
```

**remove seconds separator colons:**
```css
.clock .time span:nth-child(2),
.clock .time span:nth-child(4) {
    opacity: 0.3; /* make colons more subtle */
}
```

see the [custom css section](#custom-css) in appearance for more examples and tips.

---

### troubleshooting

**clock shows wrong time**
- **issue**: displayed time doesn't match actual time
- **solution**: check your **system time settings**
  - the clock uses your computer's time
  - update timezone in your os settings
  - enable automatic time sync in your os

**clock freezes or stops updating**
- **issue**: time doesn't change, seems stuck
- **solution**:
  1. refresh the page (f5 or cmd+r)
  2. check browser console for javascript errors (f12 → console)
  3. try a different browser to isolate the issue
  4. disable browser extensions that might interfere

**am/pm not showing in 12-hour format**
- **issue**: 12-hour format selected but no am/pm indicator
- **solution**:
  1. verify **12h** is selected in settings → clock tab
  2. refresh the page
  3. check if custom css is hiding the am/pm (inspect element)

**date format not changing**
- **issue**: selected different format but date stays the same
- **solution**:
  1. verify selection in settings → clock tab (should highlight selected option)
  2. refresh the page
  3. check browser console for errors
  4. try resetting settings (settings → reset settings)

**date shows in wrong language**
- **issue**: date appears in language other than english
- **solution**:
  - the clock uses browser/system locale for date formatting
  - date format setting only changes m/d/y vs d/m/y order
  - both use english locale (en-US or en-GB)
  - if seeing a different language, check browser language settings

---

## weather

the weather widget displays current conditions and a 5-hour forecast using data from OpenMeteo (a free weather API that requires no API key). you can configure your location, temperature units, and more.

### enabling/disabling weather

**toggle weather widget:**
1. open **settings** → **weather** tab
2. check or uncheck **"enabled"**
3. changes save automatically

**what happens when disabled:**
- weather panel is completely hidden from your startpage
- no weather data is fetched (saves bandwidth)
- location access is not requested

### location mode

the weather widget needs to know your location to fetch accurate weather data. you can choose between **automatic** and **manual** location modes.

#### auto location

automatically detects your location using your browser's geolocation API.

**how to enable:**
1. open **settings** → **weather** tab
2. under **"location"**, select **"auto"**
3. your browser may prompt you to allow location access - click **"allow"**
4. weather data will be fetched using your current coordinates

**privacy notes:**
- your location is only used to fetch weather data from OpenMeteo
- coordinates are **not** sent to any third-party servers or stored remotely
- location permission is requested each time you load the page (unless you choose "remember this decision")
- you can revoke location permission in your browser settings at any time

**when to use auto mode:**
- you primarily use your browser from one location
- you're okay granting location permission to the extension
- you want hassle-free weather updates

**troubleshooting auto mode:**
- if your browser doesn't support geolocation, you'll see an error message
- if you deny permission, you'll need to switch to manual mode or re-enable location access in browser settings
- see [troubleshooting](#troubleshooting) section for more help

#### manual location

manually enter specific latitude and longitude coordinates.

**how to enable:**
1. open **settings** → **weather** tab
2. under **"location"**, select **"manual"**
3. two number inputs appear: **latitude** and **longitude**
4. enter your coordinates (e.g., latitude: `40.71`, longitude: `-74.01` for New York City)
5. weather data will be fetched using these coordinates

**finding your coordinates:**

**option 1: use the "detect" button** (recommended)
1. in manual mode, click the **"detect"** button next to the coordinate inputs
2. your browser will prompt for location permission
3. if granted, your current coordinates will be automatically filled in
4. coordinates are rounded to 2 decimal places (~1.1km precision)

**option 2: google maps**
1. open [google maps](https://maps.google.com)
2. right-click on your desired location
3. select **"what's here?"**
4. coordinates appear at the bottom of the screen (e.g., `40.714353, -74.005973`)
5. copy and paste into the latitude/longitude inputs

**option 3: search online**
1. search for "coordinates of [city name]" in your favorite search engine
2. use the coordinates from the results (usually shown as `lat, lon`)

**when to use manual mode:**
- you want weather for a specific location (e.g., your hometown while traveling)
- you prefer not to grant location permission
- you want to monitor weather for multiple locations (by changing coordinates)

**tips for manual mode:**
- coordinates support up to 2 decimal places (e.g., `40.71`)
- positive latitude = north, negative = south
- positive longitude = east, negative = west
- if you leave coordinates empty, you'll see "location not configured" error

### temperature units

choose between celsius and fahrenheit for all temperature displays.

**how to change:**
1. open **settings** → **weather** tab
2. under **"temperature"**, select either:
   - **°F** (fahrenheit) - common in USA
   - **°C** (celsius) - default, international standard
3. changes apply immediately to current conditions and forecast

**what's affected:**
- current temperature (large display in weather panel)
- feels-like temperature ("feel" metric)
- all 5 forecast temperatures

**examples:**
- **celsius:** 20°C (comfortable), 0°C (freezing), 35°C (hot)
- **fahrenheit:** 68°F (comfortable), 32°F (freezing), 95°F (hot)

### wind speed units

choose how wind speed is displayed.

**how to change:**
1. open **settings** → **weather** tab
2. under **"speed"**, select either:
   - **mph** (miles per hour) - common in USA
   - **km/h** (kilometers per hour) - default, international standard
3. changes apply immediately to wind speed display

**what's affected:**
- wind speed metric in current conditions panel

**examples:**
- **calm:** < 5 km/h (3 mph)
- **light breeze:** 10-20 km/h (6-12 mph)
- **moderate wind:** 30-40 km/h (19-25 mph)
- **strong wind:** 50+ km/h (31+ mph)

### weather widget features

the weather panel displays comprehensive current conditions and a short-term forecast.

#### current conditions

**large display:**
- **temperature:** current temperature in selected units (large font)
- **description:** weather condition (e.g., "clear sky", "partly cloudy", "light rain")

**left column:**
- **humi:** relative humidity percentage (0-100%)
- **prec:** precipitation probability percentage (0-100%)

**right column:**
- **wind:** wind speed at 10 meters height in selected units
- **feel:** apparent temperature (feels-like, accounting for wind chill and humidity)

**weather descriptions:**
weather conditions are derived from WMO weather codes and vary by time of day:
- **day descriptions:** "clear sky", "partly cloudy", "overcast", "fog", etc.
- **night descriptions:** "clear night", "partly cloudy night", etc.
- all descriptions are automatically lowercase for aesthetic consistency

#### forecast

the forecast section shows the next **5 time slots**, with data every **3 hours** starting from 3 hours after the current hour.

**forecast displays:**
- **time:** formatted according to your clock settings (12hr or 24hr format)
- **temperature:** forecasted temperature in selected units
- **description:** forecasted weather condition (abbreviated)

**examples:**
- if it's currently 2pm, forecast shows: 5pm, 8pm, 11pm, 2am, 5am
- if you use 12hr format: `5pm`, `8pm`, `11pm`, `2am`, `5am`
- if you use 24hr format: `17:00`, `20:00`, `23:00`, `02:00`, `05:00`

### refreshing weather data

weather data is cached for **15 minutes** to reduce API calls and improve performance.

#### automatic refresh

weather automatically refreshes in these scenarios:
1. **cache expiration:** after 15 minutes since last fetch
2. **location change:** when coordinates change by more than ~0.1 degrees (~11km)
3. **tab visibility:** when you switch back to the tab after being away
4. **settings change:** when you change temperature units, wind speed units, or location settings

#### manual refresh

**option 1: click the weather label** (recommended)
1. click on the word **"weather"** at the top of the weather panel
2. label changes to **"syncing..."** while fetching new data
3. data updates when sync completes

**option 2: click the refresh button**
1. click the circular **refresh icon** at the bottom-right of the weather panel
2. button spins while syncing
3. data updates when sync completes

**tip:** force refresh by clicking the label is a hidden feature that works on all widgets (weather, tasks, calendar)!

### understanding weather data

#### data source

weather data is provided by **OpenMeteo**, a free and open-source weather API:
- **no API key required** - works out of the box
- **no account needed** - completely free to use
- **high accuracy** - uses data from national weather services worldwide
- **privacy-friendly** - no tracking, no analytics

**data freshness:**
- current conditions updated hourly by OpenMeteo
- forecasts updated every 6 hours
- re-start caches data for 15 minutes to reduce redundant requests

#### what's displayed

**current weather includes:**
- temperature (actual temperature)
- apparent temperature (feels-like, accounting for wind chill and humidity)
- relative humidity (% moisture in air)
- precipitation probability (% chance of rain/snow)
- wind speed at 10 meters height
- weather condition description (derived from WMO weather code)

**forecast includes:**
- hourly temperature predictions for next 24 hours (sampled every 3 hours)
- weather condition descriptions for each forecast time
- automatically shows day/night-appropriate descriptions

### common questions

**Q: why doesn't weather require an API key?**

OpenMeteo is a free, open-source weather service that doesn't require authentication for basic usage. this makes setup incredibly simple!

**Q: how often does weather data update?**

weather data is cached for **15 minutes**. after that, the next time you view or refresh the tab, fresh data is fetched. you can also manually refresh at any time by clicking the weather label or refresh button.

**Q: can I see weather for multiple locations?**

not simultaneously - the widget shows one location at a time. however, in manual mode, you can change coordinates to view different locations. consider using browser profiles or multiple tabs with different settings if you need to monitor multiple locations.

**Q: why does the forecast only show 5 time slots?**

the widget is designed to show a concise short-term forecast (15 hours ahead). this keeps the interface compact while still providing useful information for planning your day/evening.

**Q: what if I'm traveling and my location changes?**

if you use **auto mode**, weather will automatically update when you reload the page in a new location (you'll need to grant location permission again). if you use **manual mode**, update your coordinates in settings or switch to auto mode temporarily.

**Q: does weather work offline?**

no - weather requires an active internet connection to fetch data from OpenMeteo. however, the last fetched data remains visible even if you go offline (until you reload the page).

**Q: why doesn't weather show in my language?**

weather descriptions are currently only available in english (lowercase for aesthetic consistency). this may be expanded in future versions.

### customizing weather appearance with css

you can customize the weather widget's appearance using custom css. see the [appearance](#appearance) section for general css guidance.

**example: change weather panel width**
```css
/* make weather panel wider */
.weather-panel {
    min-width: 300px;
}
```

**example: change temperature color**
```css
/* make temperature text red */
.weather-panel [data-text-color="primary"] {
    color: #ff4444 !important;
}
```

**example: hide specific weather metrics**
```css
/* hide precipitation probability */
.weather-panel:has-text("prec") {
    display: none;
}
```

**tip:** use your browser's developer tools (F12) to inspect the weather panel and identify the CSS selectors you want to target.

### troubleshooting

**weather says "location not configured"**

this error appears when:
- you're in **manual mode** but haven't entered coordinates yet
- latitude or longitude is empty or invalid

**solutions:**
1. enter valid coordinates (latitude: -90 to 90, longitude: -180 to 180)
2. use the **"detect"** button to auto-fill your current location
3. switch to **auto mode** if you're okay granting location permission

**weather widget is blank or not showing**

possible causes:
1. **weather is disabled** - check settings → weather tab → ensure "enabled" is checked
2. **location not configured** - see above
3. **network issue** - check your internet connection
4. **API issue** - OpenMeteo may be temporarily unavailable (rare)

**solutions:**
1. verify weather is enabled in settings
2. try manually refreshing by clicking the weather label
3. check browser console (F12) for error messages
4. try switching between auto/manual location modes

**auto location not working**

**symptom:** browser doesn't prompt for location, or shows error immediately

**possible causes:**
1. **permission denied** - you previously denied location access
2. **insecure context** - geolocation requires HTTPS (or localhost)
3. **browser doesn't support geolocation**
4. **location services disabled** - OS-level location services are off

**solutions:**
1. **check browser permissions:**
   - chrome: click lock icon in address bar → site settings → location → allow
   - firefox: click lock icon → permissions → location → allow
2. **verify HTTPS:** geolocation only works on HTTPS sites (or localhost)
3. **try different browser:** ensure your browser supports geolocation
4. **enable location services:** check your OS settings (system preferences → privacy → location services)
5. **fallback to manual:** use manual mode with "detect" button or enter coordinates manually

**weather data seems incorrect**

**symptom:** temperature, conditions, or forecast don't match reality

**possible causes:**
1. **wrong location** - coordinates are inaccurate
2. **stale cache** - viewing old data (>15 minutes old)
3. **timezone issues** - forecast times may be off if timezone is wrong

**solutions:**
1. **verify coordinates:**
   - auto mode: try switching to manual, use "detect", then back to auto
   - manual mode: double-check latitude/longitude values
2. **force refresh:** click weather label to fetch fresh data
3. **check timezone:** weather uses your system timezone - verify it's set correctly
4. **compare with source:** visit [open-meteo.com](https://open-meteo.com) directly to verify their data

**"detect" button doesn't work in manual mode**

**symptom:** clicking detect shows error or doesn't fill coordinates

**possible causes:**
1. same as auto location issues above
2. browser location permission denied

**solutions:**
1. follow auto location troubleshooting steps above
2. as fallback, manually enter coordinates using google maps or search

**forecast times don't match my clock format**

**symptom:** forecast shows 12hr format but I prefer 24hr (or vice versa)

**solution:**
forecast times automatically match your **clock settings**. to change:
1. go to **settings** → **clock** tab
2. change **"time format"** to **12hr** or **24hr**
3. weather forecast times will update immediately

**wind speed or temperature units wrong**

**symptom:** showing °F but I want °C (or showing mph but I want km/h)

**solution:**
1. go to **settings** → **weather** tab
2. under **"temperature"**, select **°C** or **°F**
3. under **"speed"**, select **km/h** or **mph**
4. changes apply immediately (no refresh needed)

**weather stopped updating automatically**

**symptom:** weather data is very old, doesn't refresh when switching tabs

**possible causes:**
1. browser tab management (e.g., chrome tab sleeping/freezing)
2. browser extension conflict
3. javascript error preventing updates

**solutions:**
1. **manual refresh:** click weather label to force update
2. **check console:** open developer tools (F12), look for errors
3. **disable other extensions:** temporarily disable other extensions to check for conflicts
4. **reload page:** hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

**getting rate limited by OpenMeteo**

**symptom:** errors mentioning rate limits or 429 status codes

**cause:** too many requests to OpenMeteo API (unlikely with 15-minute cache)

**solutions:**
1. **avoid rapid refreshing:** respect the 15-minute cache
2. **wait it out:** rate limits usually reset after a few minutes
3. **check for bugs:** if you're seeing this frequently, there may be a bug causing excessive requests - report it to the developer

---

## tasks

keep track of your to-dos with local storage, todoist, or google tasks. features natural language date parsing for quick task entry.

### enabling/disabling tasks

**to enable tasks:**

1. **open settings** → **tasks** tab
2. **toggle "show tasks"** to **on**
3. the tasks widget appears on your startpage
4. you'll see task input and task list

**to disable tasks:**

1. **open settings** → **tasks** tab
2. **toggle "show tasks"** to **off**
3. tasks widget is hidden (data remains saved)

**note:** disabling tasks doesn't delete your tasks - they're preserved and will reappear when you re-enable the widget.

---

### choosing a task source

re-start supports **three task backends**. each has different features and setup requirements:

| source | setup | sync | features |
|--------|-------|------|----------|
| **local** | none | no sync | browser-only, simple |
| **todoist** | api token | cross-device | projects, labels, sync |
| **google tasks** | google sign-in | cross-device | google ecosystem |

**to select a task source:**

1. **open settings** → **tasks** tab
2. **find "task backend"** dropdown
3. **select your preferred source**:
   - `local` - browser-only storage (no setup)
   - `todoist` - todoist integration (requires api token)
   - `google-tasks` - google tasks (requires google sign-in)
4. if you selected todoist or google tasks, complete the setup (see below)

**important:** each source has its own independent task list. switching sources doesn't migrate tasks between them. if you switch from todoist to google tasks, your todoist tasks remain in todoist but won't appear in the widget until you switch back.

---

### using local tasks

the simplest option - no setup required. tasks are stored in your browser's localstorage.

#### what you get

- **instant setup**: works immediately, no configuration needed
- **privacy**: tasks never leave your browser
- **simplicity**: no accounts, tokens, or sign-ins
- **speed**: instant sync (no network requests)

#### limitations

- **no sync**: tasks only exist in this browser on this device
- **no backup**: if you clear browser data, tasks are lost
- **single device**: can't access from phone or other computers
- **basic features**: no projects, labels, or advanced organization

#### when to use local tasks

- you only use one computer/browser
- you want maximum privacy
- you don't need multi-device sync
- you prefer simplicity over features

**no setup steps needed** - just select "local" as your task backend and start adding tasks!

---

### using todoist tasks

integrate with todoist for powerful task management with cross-device sync and project organization.

#### what you get

- **full sync**: tasks appear on todoist app, website, and re-start
- **projects**: organize tasks into projects (project names shown in widget)
- **due dates**: support for dates and times
- **cross-device**: access from any device with todoist or re-start
- **incremental sync**: efficient sync uses todoist sync api v1
- **offline support**: view cached tasks when offline

#### setup requirements

you must have:
- a todoist account (free or paid)
- your todoist api token (see [integrations](#integrations) section for setup)

**setup steps:**

1. **get your todoist api token**:
   - follow instructions in [integrations → todoist](#todoist) section
   - this gives you a 40-character token string

2. **configure re-start**:
   - open settings → **tasks** tab
   - select **"todoist"** as task backend
   - if not set up yet, you'll see: *"no todoist api token"*

3. **add your token**:
   - open settings → **integrations** tab
   - paste your token in the "todoist api token" field
   - click **"verify"** to test the connection
   - ✓ success: "todoist api token is valid"

4. **start using tasks**:
   - return to tasks tab or close settings
   - tasks widget now syncs with todoist
   - your todoist tasks appear in re-start

#### sync behavior

- **auto-sync triggers**:
  - page load
  - tab gains focus (switching back to tab)
  - after adding/completing/deleting a task
  - clicking the sync button
  - clicking the "x tasks" label

- **cache**: 5-minute cache reduces api requests
- **incremental**: only fetches changes since last sync (efficient)
- **optimistic updates**: tasks update instantly in ui, then sync in background

#### todoist-specific features

**projects:**
- tasks show their project name in muted text
- helps organize work, personal, and other categories
- project names come from your todoist setup

**task sorting:**
- uncompleted tasks first
- then by due date (soonest first)
- then by project
- then by todoist task order

**sync button:**
- refresh icon appears at bottom of tasks widget
- click to force immediate sync
- spins while syncing

#### link to todoist

when using todoist backend, the task count becomes a link:
- click **"x tasks"** to open todoist.com/app in new tab
- quick access to full todoist features
- useful for advanced task management

---

### using google tasks

integrate with google tasks for simple cross-device sync with the google ecosystem.

#### what you get

- **google sync**: tasks appear in google tasks app and re-start
- **cross-device**: access from any device with google tasks
- **no token needed**: uses google sign-in (oauth)
- **due dates**: support for dates and times
- **simple**: clean, straightforward task management

#### setup requirements

you must have:
- a google account
- google sign-in completed (see [integrations](#integrations) section)

**setup steps:**

1. **sign in with google**:
   - follow instructions in [integrations → google](#google-tasks--calendar) section
   - this grants re-start access to google tasks api

2. **configure re-start**:
   - open settings → **tasks** tab
   - select **"google-tasks"** as task backend
   - if not signed in yet, you'll see: *"not signed in to google"*

3. **complete sign-in**:
   - open settings → **integrations** tab
   - click **"sign in with google"**
   - grant permissions in popup
   - ✓ success: shows your email address

4. **start using tasks**:
   - return to tasks tab or close settings
   - tasks widget now syncs with google tasks
   - your google tasks appear in re-start

#### sync behavior

- **auto-sync triggers**:
  - page load
  - tab gains focus (switching back to tab)
  - after adding/completing/deleting a task
  - clicking the "x tasks" label

- **cache**: 5-minute cache reduces api requests
- **optimistic updates**: tasks update instantly in ui, then sync in background

#### google-specific features

**task list:**
- uses your default google tasks list
- all tasks added through re-start go to this list

**task sorting:**
- uncompleted tasks first
- then by due date (soonest first)
- then by google tasks order

**link to google tasks:**
when using google tasks backend, the task count becomes a link:
- click **"x tasks"** to open tasks.google.com in new tab
- quick access to full google tasks interface

---

### adding tasks

adding tasks is fast and supports **natural language date parsing** - just type dates naturally and they'll be detected automatically.

#### basic task entry

**to add a task:**

1. **find the task input**:
   - located at top of tasks widget
   - shows a **"+"** prefix
   - placeholder text: "new task"

2. **type your task**:
   - enter task description
   - example: "buy groceries"

3. **press enter**:
   - task is added to your list
   - syncs to external source (if using todoist/google tasks)
   - input field clears, ready for next task

**tip:** if the task list is empty, the input field is automatically visible. if you have tasks, click the **"+"** icon to show the input field.

#### natural language date parsing

re-start automatically detects dates in your task descriptions. as you type, detected dates are **highlighted in yellow**.

**how it works:**

1. type a task with a date mention:
   ```
   call mom tomorrow
   ```

2. the word "tomorrow" highlights in yellow (date detected)

3. press enter - the task is added with due date set to tomorrow

4. the date mention is stripped from the task name:
   - stored as: "call mom" (due: tomorrow)
   - the date becomes metadata, not part of task text

**supported date formats:**

here's what the date parser understands (all case-insensitive):

**relative dates:**
- `today` - current day
- `tomorrow`, `tmrw`, `tmr` - next day
- `yesterday` - previous day

**weekdays:**
- `monday`, `mon` - next monday
- `tuesday`, `tue`, `tues` - next tuesday
- `wednesday`, `wed` - next wednesday
- `thursday`, `thu`, `thur`, `thurs` - next thursday
- `friday`, `fri` - next friday
- `saturday`, `sat` - next saturday
- `sunday`, `sun` - next sunday
- `next monday` - monday of next week (skips this week's monday if it hasn't passed)

**special keywords:**
- `weekend` - next saturday or sunday
- `next weekend` - weekend of next week
- `weekday` - next weekday (monday-friday)
- `next weekday` - following weekday

**month + day:**
- `january 15`, `jan 15`, `jan 15th` - january 15th
- `15 january`, `15 jan` - january 15th (day-first format)
- `dec 31st` - december 31st
- works with all months: jan/feb/mar/apr/may/jun/jul/aug/sep/oct/nov/dec

**month + day + year:**
- `jan 15 2025` - january 15, 2025
- `15 jan 2025` - january 15, 2025
- `december 31, 2025` - december 31, 2025

**numeric dates:**
- `12/31` - december 31 (mdy format) or 12th of january (dmy format)
- `1-15-2025` - january 15, 2025 (mdy) or 1st of march (dmy)
- respects your date format setting (mdy vs dmy)

**ordinal dates:**
- `15th` - 15th of current/next month
- `1st` - 1st of next month
- `22nd`, `3rd` - ordinal suffixes work

**times (combined with dates):**
- `tomorrow 3pm` - tomorrow at 3:00 PM
- `friday 10am` - next friday at 10:00 AM
- `jan 15 9:30am` - january 15 at 9:30 AM
- `2pm today` - today at 2:00 PM
- supports: `3pm`, `10am`, `9:30pm`, `11:45am`, etc.

**real-world examples:**

```
meeting with john tomorrow at 2pm
→ task: "meeting with john"
→ due: tomorrow at 2:00 PM

buy milk this weekend
→ task: "buy milk"
→ due: next saturday

dentist appointment jan 15
→ task: "dentist appointment"
→ due: january 15

call sarah next friday
→ task: "call sarah"
→ due: next friday

submit report 3pm today
→ task: "submit report"
→ due: today at 3:00 PM
```

**tips for date parsing:**

- **watch the highlight**: as you type, dates highlight in yellow when detected
- **date position**: dates can appear anywhere in task text (beginning, middle, or end)
- **auto-strip**: detected dates are removed from task name automatically
- **no dates**: if no date is detected, task has no due date (that's fine!)
- **manual dates**: you can also set dates through todoist/google tasks apps

**date format preference:**

numeric dates like `12/31` are interpreted based on your **date format** setting:
- **mdy** (american): 12/31 = december 31st
- **dmy** (international): 12/31 = 12th of january

change this in settings → **clock** tab → **date format**

---

### managing tasks

once tasks are added, you can complete, uncomplete, or delete them.

#### completing tasks

**to mark a task complete:**

1. **click the checkbox** on the left of the task
2. task is marked as complete:
   - ~~text is crossed out~~
   - checkbox shows checkmark
   - syncs to external source (todoist/google tasks)
3. task **remains visible for 5 minutes**
4. after 5 minutes, task auto-hides from the list

**why keep completed tasks visible?**
- **undo buffer**: gives you time to uncomplete if you checked it by accident
- **satisfaction**: see your progress for a few minutes
- **context**: remember what you just completed while working on next task

**note:** completed tasks are not deleted - they're just hidden. they still exist in todoist/google tasks with "completed" status.

#### uncompleting tasks

if you accidentally completed a task, you can uncomplete it while it's still visible (within 5 minutes).

**to uncomplete a task:**

1. **click the checkbox** again (while task is still visible)
2. task is marked as incomplete:
   - text is no longer crossed out
   - checkbox is empty
   - syncs to external source
3. task moves back to normal position in list (by due date)

**note:** after a task has been hidden (5+ minutes), you cannot uncomplete it through re-start. use the todoist/google tasks app to restore it if needed.

#### deleting tasks

**to delete a task:**

1. **hover over the task** (or tap on mobile)
2. **click the "×" button** on the right side
3. task is deleted immediately:
   - removed from list
   - removed from external source (todoist/google tasks)
   - **no undo** - deletion is permanent

**warning:** deleting a task is permanent. there's no undo in re-start. if you delete by accident, you'll need to recreate the task.

**alternative:** instead of deleting, consider completing tasks. completed tasks are kept in todoist/google tasks for your records.

---

### task display & sorting

tasks are displayed in a specific order to show the most important tasks first.

#### sorting order

tasks are sorted by this priority:

1. **uncompleted first**: active tasks appear before completed tasks
2. **by due date**: soonest due dates first (overdue tasks at top)
3. **by project** (todoist only): tasks grouped by project
4. **by task order**: original order from source

**example task list order:**
```
☐ overdue task (due yesterday) 🔴
☐ task due today
☐ task due tomorrow
☐ task due next week
☐ task with no due date (project: work)
☐ task with no due date (project: personal)
☐ task with no due date (no project)
✓ completed task (crossed out)
```

#### what's displayed

**for each task:**
- **checkbox**: left side, click to complete/uncomplete
- **task text**: main task description
- **project name** (todoist only): shown in muted text below task
- **due date** (if set): shown in muted text on right
- **delete button**: "×" on right side (appears on hover)

**due date formatting:**
- relative: "today", "tomorrow", "yesterday"
- this week: "monday", "friday"
- future: "jan 15", "mar 3"
- overdue: shown in red text 🔴

**task count:**
- shown at top of widget: "x tasks" or "x task"
- counts only **uncompleted** tasks
- completed tasks don't affect the count

---

### refreshing tasks

tasks sync automatically in most cases, but you can force a manual refresh.

#### automatic refresh

tasks sync automatically when:
- **page loads**: fresh sync on every page load
- **tab focus**: sync when you return to the tab
- **day changes**: sync at midnight (new day)
- **after actions**: sync after add/complete/delete operations
- **cache expiry**: sync when 5-minute cache expires

**cache behavior:**
- **5-minute cache**: tasks are cached for 5 minutes to reduce api requests
- **smart invalidation**: cache is cleared after task actions
- **offline support**: cached tasks shown when offline (todoist/google tasks)

#### manual refresh (force sync)

**to force immediate sync:**

**method 1: click task count label**
1. **click "x tasks"** at top of widget
2. label changes to "syncing..."
3. fetches latest tasks from source
4. updates task list

**method 2: click sync button (todoist only)**
1. **click refresh icon** at bottom of tasks widget
2. icon spins while syncing
3. updates task list

**when to force refresh:**
- added task in todoist/google tasks app and want to see it in re-start
- completed task elsewhere and want to update re-start
- tasks seem out of sync or stale
- experiencing sync issues

**note:** clicking the label works for all widgets (tasks, weather, calendar) - it's a hidden feature!

---

### common questions

**can i use multiple task sources at once?**

no, you can only use one task source at a time. however, each source maintains its own independent task list. if you switch from local to todoist, your local tasks remain in localstorage (you can switch back anytime to see them again).

**what happens to completed tasks?**

completed tasks remain visible for 5 minutes, then auto-hide. they're not deleted:
- **local**: stored in localstorage with completed status
- **todoist**: marked complete in todoist (visible in todoist's completed tasks view)
- **google tasks**: marked complete in google tasks

**can i edit existing tasks?**

not directly in re-start. you can:
- complete/uncomplete tasks
- delete tasks
- add new tasks

to edit task text, use the native todoist or google tasks app.

**can i set priority or labels?**

not through re-start's interface. use the todoist app for:
- priority levels
- labels/tags
- recurring tasks
- subtasks
- attachments

re-start focuses on viewing and basic task management. for advanced features, use the native app.

**do i need internet for tasks?**

depends on your source:
- **local**: no internet needed (browser-only)
- **todoist**: needs internet for sync, but cached tasks viewable offline
- **google tasks**: needs internet for sync, but cached tasks viewable offline

**can i change date format?**

yes! the date format for numeric dates (like `12/31`) is controlled by:
- settings → **clock** tab → **date format**
- **mdy**: month/day/year (american)
- **dmy**: day/month/year (international)

this affects both how dates are parsed in task input AND how dates are displayed in the clock widget.

**why does "next friday" add a date 2 weeks away?**

the parser interprets "next friday" as "friday of next week", which skips this week's friday even if it hasn't passed yet. if you want this week's friday, just type "friday" without "next".

**can i customize task appearance?**

yes! use custom css in settings → **appearance** tab → **custom css**. examples:

```css
/* hide project names */
[data-task-project] {
  display: none;
}

/* make task text larger */
[data-task-content] {
  font-size: 1.1rem;
}

/* highlight overdue tasks */
[data-overdue="true"] {
  background: rgba(255, 0, 0, 0.1);
  border-left: 2px solid var(--txt-err);
}

/* hide completed tasks immediately */
[data-task-completed="true"] {
  display: none !important;
}
```

---

### troubleshooting

#### "no todoist api token" error

**symptoms:**
- selected todoist as task backend
- tasks widget shows "no todoist api token"
- can't add or view tasks

**causes & solutions:**

1. **token not set**:
   - open settings → **integrations** tab
   - paste your todoist api token
   - click "verify"
   - see [integrations → todoist](#todoist) for setup instructions

2. **token not verified**:
   - even if pasted, token must be verified
   - click "verify" button after pasting
   - wait for "todoist api token is valid" confirmation

3. **browser cleared settings**:
   - if you cleared browser data, token was deleted
   - get a fresh token from todoist
   - paste and verify again

---

#### "not signed in to google" error

**symptoms:**
- selected google tasks as backend
- tasks widget shows "not signed in to google"
- can't add or view tasks

**causes & solutions:**

1. **not signed in**:
   - open settings → **integrations** tab
   - click "sign in with google"
   - grant permissions
   - see [integrations → google](#google-tasks--calendar) for setup

2. **session expired**:
   - google sign-in tokens expire
   - sign in again through integrations tab
   - re-grant permissions

3. **popup blocked**:
   - sign-in uses popup window
   - check for popup blocker icon in address bar
   - allow popups for re-start
   - try signing in again

---

#### tasks not syncing

**symptoms:**
- added task in todoist/google tasks app
- task doesn't appear in re-start
- or: completed task in re-start, still shows as active in app

**causes & solutions:**

1. **cache not expired**:
   - tasks have 5-minute cache
   - force refresh: click "x tasks" label
   - or: wait 5 minutes for auto-sync

2. **offline**:
   - check internet connection
   - cached tasks shown when offline
   - sync happens when back online

3. **wrong task list** (google tasks only):
   - re-start uses default task list
   - check if task is in a different list
   - move task to default list in google tasks app

4. **sync token stale** (todoist only):
   - todoist uses incremental sync
   - rarely, sync token gets out of date
   - click sync button to force full refresh

---

#### task added but date not parsed

**symptoms:**
- typed task with date mention
- date didn't highlight in yellow
- task added without due date

**causes & solutions:**

1. **ambiguous date format**:
   - some dates are hard to parse
   - try more explicit formats:
     - ❌ "task 5/12" (ambiguous)
     - ✓ "task may 12" (clear)

2. **typo in date**:
   - check spelling: "tommorow" won't work, use "tomorrow"
   - check abbreviations: "fri" works, "frid" doesn't

3. **unsupported format**:
   - parser doesn't support all date formats
   - supported formats listed in [adding tasks → natural language date parsing](#natural-language-date-parsing)
   - if your format isn't supported, set date manually in todoist/google tasks app

4. **date in past** (some formats):
   - ordinal dates like "5th" assume future
   - if today is the 10th, "5th" means next month's 5th
   - for past dates, use full format: "january 5"

---

#### date parsed incorrectly

**symptoms:**
- typed "12/25" expecting december 25
- got january 12 instead (or vice versa)

**causes & solutions:**

1. **wrong date format setting**:
   - check settings → **clock** tab → **date format**
   - **mdy**: 12/25 = december 25 (american)
   - **dmy**: 12/25 = 12th of january (international)
   - change to match your expectation

2. **use explicit format**:
   - instead of numeric dates, use month names:
     - ✓ "dec 25" (unambiguous)
     - ✓ "25 december" (unambiguous)

---

#### completed tasks not hiding

**symptoms:**
- completed task 10+ minutes ago
- still visible in task list
- expected it to auto-hide after 5 minutes

**causes & solutions:**

1. **tab was hidden**:
   - auto-hide timer pauses when tab is hidden
   - timer resumes when you return to tab
   - wait 5 minutes with tab visible

2. **page never refreshed**:
   - rarely, timer fails
   - refresh page to clear old completed tasks

3. **want immediate hiding**:
   - use custom css to hide completed tasks immediately:
   ```css
   [data-task-completed="true"] {
     display: none !important;
   }
   ```

---

#### slow sync or performance

**symptoms:**
- sync takes a long time
- tasks widget feels sluggish
- delays when adding/completing tasks

**causes & solutions:**

1. **large task list**:
   - hundreds of tasks slow down rendering
   - archive old completed tasks in todoist/google tasks
   - use projects/filters in native app to reduce active tasks

2. **slow internet**:
   - sync requires network requests
   - slow connection = slow sync
   - optimistic updates still show instant ui changes

3. **api rate limiting**:
   - todoist/google apis have rate limits
   - excessive requests may be throttled
   - wait a minute and try again

4. **check todoist status**:
   - if sync is consistently slow
   - check: https://status.todoist.com
   - todoist api may be experiencing issues

---

#### deleting tasks doesn't work

**symptoms:**
- clicked delete button
- task still appears
- or: task deleted in re-start but still in todoist/google tasks app

**causes & solutions:**

1. **sync failed**:
   - delete requires network request
   - if offline, delete won't sync
   - task reappears on next sync
   - ensure you're online when deleting

2. **cache issue**:
   - task removed from cache but sync failed
   - force refresh: click "x tasks" label
   - task should reappear or confirm deletion

3. **permission issue** (google tasks only):
   - google sign-in may have expired
   - re-sign in through integrations tab

4. **api error** (todoist):
   - token may be invalid
   - verify token in integrations tab

---

## calendar

view your daily schedule with google calendar integration

---

### enabling/disabling calendar

the calendar widget (labeled "agenda") shows today's google calendar events. here's how to control it:

**step-by-step:**
1. open **settings** (top-right corner, hover to reveal)
2. navigate to the **calendar** tab
3. check **enabled** to show the calendar widget
4. uncheck **enabled** to hide the calendar widget

**important:** the calendar widget requires **google sign-in**. if you haven't signed in yet:
1. go to the **integrations** tab
2. click **sign in with google**
3. grant permissions for calendar access
4. return to the **calendar** tab to enable the widget

**what happens when disabled:**
- the calendar widget is completely hidden from your startpage
- your calendar data remains in local storage (cache) but isn't displayed
- you can re-enable anytime without re-syncing

---

### google calendar integration

the calendar widget uses **google calendar api** to display your events. it shares the same authentication as google tasks (one sign-in for both).

**what you get:**
- today's events from your google calendars
- event times, titles, locations, and video links
- visual indicators for ongoing and past events
- direct links to events in google calendar
- automatic sync with 5-minute cache

**sign-in process:**
1. go to **settings** → **integrations** tab
2. click **sign in with google**
3. a popup window opens for google authentication
4. **grant permissions** for calendar access:
   - "see events in all your calendars"
   - "view your email address"
5. the popup closes automatically after successful sign-in
6. return to **calendar** tab to enable the widget

**authentication details:**
- uses **oauth 2.0** (no passwords, secure token-based auth)
- tokens are stored locally in your browser
- tokens auto-refresh before expiration (1-hour validity)
- backend server manages token exchange (no api keys needed)
- same token used for google tasks and calendar

**signing out:**
1. go to **settings** → **integrations** tab
2. click **sign out** next to google
3. confirms with a checkmark
4. calendar data is cleared from local storage

**privacy notes:**
- your calendar data is stored only in your browser's localstorage
- no calendar data is sent to re-start servers (only auth tokens)
- you can revoke access anytime via [google account permissions](https://myaccount.google.com/permissions)

---

### calendar filtering/selection

you can choose which google calendars appear in your agenda widget. by default, **all calendars** are shown.

**how to filter calendars:**
1. open **settings** → **calendar** tab
2. ensure **enabled** is checked
3. under **calendars**, you'll see a list of all your google calendars
4. each calendar shows:
   - **checkbox** `[x]` if selected, `[ ]` if not
   - **color swatch** matching the calendar's google color
   - **calendar name**
   - **"(primary)"** label for your primary calendar
5. click any calendar to toggle its selection

**selection behavior:**
- **empty selection (no checkboxes marked)** → all calendars shown
- **one or more checkboxes marked** → only selected calendars shown
- the widget automatically re-syncs after changing selection

**example use cases:**
- **work only:** select just your work calendar to hide personal events
- **personal only:** select just your personal calendar to hide work events
- **multiple calendars:** select work, personal, and family calendars
- **all calendars:** uncheck all boxes to show everything

**loading calendars:**
when you first enable the calendar widget or sign in to google, the calendar list loads automatically. if you don't see your calendars:
1. ensure you're signed in to google (check integrations tab)
2. wait a few seconds for the list to load
3. if still empty, try clicking the sync button in the agenda widget

---

### event display

the agenda widget shows **today's events** in a clean, organized list. here's what you'll see:

#### **event information**

each event displays:
- **time:** formatted according to your clock settings (12hr or 24hr)
  - example (12hr): `9:30 am`, `2:00 pm`
  - example (24hr): `9:30`, `14:00`
  - all-day events show: `all day`
- **title:** event name or "(No title)" if blank
- **location:** physical location if specified (e.g., "conference room b")
- **video link:** join button for google meet, zoom, microsoft teams
  - automatically detects video provider and shows appropriate icon
  - click to open video conference in new tab
- **event link:** click event title to open in google calendar

#### **visual indicators**

events are marked based on their status:
- **upcoming events:** normal text color, future events
- **ongoing events:** highlighted to show currently happening
- **past events:** dimmed text color to indicate completed

#### **event sorting**

events are sorted for easy scanning:
1. **all-day events first:** full-day events appear at the top
2. **by start time:** events sorted chronologically

**example event list:**
```
all day       team offsite
9:30 am       standup meeting        [join meet]
11:00 am      design review           conference room b
2:00 pm       1:1 with manager       [join zoom]
4:30 pm       client presentation    [join teams]
```

#### **event count**

the panel header shows:
- `1 event today` or `5 events today`
- click the count to open **google calendar** in a new tab
- helpful for viewing full event details or future events

#### **empty state**

if you have no events today:
- displays: `no events today`
- the widget remains visible (doesn't hide automatically)

---

### instant conference links

the agenda widget includes a powerful feature: **instant google meet link creation**. perfect for quick impromptu meetings!

**how to create instant meet link:**
1. locate the **+ instant conf** button in the agenda panel
2. click the button
3. a modal appears with:
   - the generated google meet link
   - **copy link** button
   - **open in new tab** button
4. share the link with meeting participants
5. click **copy link** to copy to clipboard
6. click **open in new tab** to join immediately

**technical details:**
- creates a temporary google calendar event with conference data
- extracts the google meet link from the event
- deletes the temporary event (meet link remains valid)
- uses google calendar api v3 conferencedata endpoint
- requires google sign-in and calendar permissions

**when to use:**
- quick team huddles without scheduling
- instant client calls
- emergency meetings
- replacing manual meet link creation

**limitations:**
- only creates **google meet** links (not zoom or teams)
- requires active google sign-in
- meet link expires based on google's default policy
- no event appears in your calendar (temporary event deleted)

---

### sync behavior

the calendar widget automatically syncs with google calendar to keep your events up-to-date.

#### **automatic sync triggers**

the widget syncs automatically when:
1. **cache expires:** every **5 minutes** (cache expiry)
2. **tab becomes visible:** when you switch back to the re-start tab
3. **settings change:** when you change calendar selection
4. **first load:** when the page first loads (if cache is stale)

**cache behavior:**
- events are stored in **localstorage** for 5 minutes
- reduces api calls and improves performance
- cache includes both events and calendar list
- cache is cleared when signing out

#### **manual sync**

you can force an immediate sync using two methods:

**method 1: sync button**
1. locate the **sync button** (circular arrow icon) in the top-right of the agenda panel
2. click the button
3. the button spins while syncing
4. events update immediately

**method 2: click label (hidden feature)**
1. click the **"agenda"** label at the top of the panel
2. the label changes to **"syncing..."**
3. events update immediately
4. works the same as the sync button

**when to force sync:**
- you just added/edited events in google calendar
- you suspect events are outdated
- you changed calendar selection and want immediate results
- you're troubleshooting sync issues

#### **sync details**

what happens during sync:
1. **authenticate:** ensure google token is valid (auto-refresh if needed)
2. **fetch calendar list:** retrieves up to 50 calendars
3. **filter calendars:** applies your selection filter
4. **fetch events:** retrieves today's events from each selected calendar
   - up to 50 events per calendar
   - only events with start/end times today
   - excludes cancelled events
5. **sort events:** all-day first, then by start time
6. **update display:** events appear immediately

**sync performance:**
- typical sync: **1-3 seconds** (depends on calendar count)
- events are fetched in **parallel** (fast even with many calendars)
- no sync if cache is fresh (instant display)

**offline behavior:**
- if offline, displays cached events (up to 5 minutes old)
- sync fails gracefully with error message
- events remain visible until cache expires

---

### common questions

**do i need a google account?**
yes, the calendar widget requires a google account with google calendar. if you use outlook, apple calendar, or other providers, those events won't appear (google calendar only).

**why do i need to sign in?**
google requires oauth authentication to access your calendar data. this keeps your calendar private and secure. we use google's official oauth flow—no passwords stored, just secure tokens.

**can i see events from other calendar services?**
not directly. the widget only supports google calendar. however, if you sync other calendars (outlook, apple calendar) into google calendar, those events will appear.

**how many events can i see?**
up to **50 events per calendar** for today. if you have more than 50 events in a single calendar today, only the first 50 (sorted by start time) will appear.

**what if i have many calendars?**
the widget supports up to **50 calendars**. use the calendar filter to select only the calendars you want to see on your startpage.

**can i see future events (tomorrow, next week)?**
no, the widget only shows **today's events**. for future events, click the event count link to open google calendar in a new tab.

**can i edit or create events?**
not directly in re-start. to add, edit, or delete events:
1. click the **event count** link (e.g., "5 events today") to open google calendar
2. click an **event title** to open that specific event in google calendar
3. make your changes in google calendar
4. click the **sync button** in re-start to refresh

**can i create instant meet links for future meetings?**
the **+ instant conf** feature creates a meet link for immediate use. the temporary calendar event is deleted, so it won't appear in your calendar. if you need a scheduled meeting, create it in google calendar with a meet link.

**does the widget work offline?**
partially. if you've recently synced (within 5 minutes), your cached events will display. but you won't be able to sync new events or create instant meet links until you're back online.

**what timezone are events displayed in?**
events use your **system timezone** (the timezone set on your computer or device). if you're traveling, make sure your system timezone is correct.

**why is the calendar list empty?**
possible causes:
1. **not signed in:** check integrations tab and sign in to google
2. **no calendars:** you might not have any calendars in your google account
3. **loading:** wait a few seconds for the list to load
4. **permissions:** ensure you granted calendar permissions during sign-in

**can i customize the event display with css?**
yes! the agenda widget uses standard css classes. here are some examples:

```css
/* change agenda panel width */
[data-panel="agenda"] {
    min-width: 400px;
}

/* hide video link buttons */
[data-panel="agenda"] a[href*="meet.google.com"],
[data-panel="agenda"] a[href*="zoom"] {
    display: none;
}

/* customize event time color */
[data-panel="agenda"] .event-time {
    color: var(--txt-3);
}

/* hide instant conf button */
[data-panel="agenda"] button:has-text("instant conf") {
    display: none;
}
```

**why does the time format not match my clock?**
the calendar widget respects your **clock settings** (settings → clock tab). if your clock is set to 12hr, events show times like `9:30 am`. if set to 24hr, events show `9:30`.

**what happens to events that span multiple days?**
multi-day events are shown as **all-day events** on each day they occur. the widget only shows today's portion of the event.

**can i see event descriptions?**
not currently. only the event title, time, location, and video link are displayed. click the event title to view the full description in google calendar.

---

### troubleshooting

#### **"not signed in to google" error**

**symptoms:**
- calendar widget shows red error text: "not signed in to google"
- calendar settings unavailable or grayed out

**causes & solutions:**

1. **never signed in:**
   - go to **settings → integrations**
   - click **sign in with google**
   - grant calendar permissions

2. **signed out:**
   - check integrations tab for sign-in status
   - re-sign in if needed

3. **token expired:**
   - tokens should auto-refresh, but if not:
   - sign out and sign back in

#### **calendar widget not showing / blank**

**symptoms:**
- the agenda panel is completely missing
- no calendar widget visible on the startpage

**causes & solutions:**

1. **calendar disabled in settings:**
   - go to **settings → calendar tab**
   - check **enabled** checkbox

2. **not signed in to google:**
   - see "not signed in to google" error above
   - ensure you're signed in via integrations tab

3. **widget hidden by custom css:**
   - check your custom css for `display: none` rules
   - remove any css hiding `[data-panel="agenda"]`

4. **localstorage full:**
   - rare, but localstorage has size limits (5-10mb)
   - try resetting settings or clearing browser data

#### **events not syncing**

**symptoms:**
- events are outdated (don't match google calendar)
- new events don't appear after syncing
- sync button spins but nothing changes

**causes & solutions:**

1. **cache not expired:**
   - events refresh every 5 minutes automatically
   - force refresh by clicking the **sync button** or **agenda label**

2. **wrong calendars selected:**
   - check **settings → calendar → calendars**
   - ensure the calendar containing your events is selected
   - if all boxes are unchecked, all calendars should show

3. **internet connection issues:**
   - check your internet connection
   - try refreshing the page
   - check browser console for network errors

4. **google api errors:**
   - rare, but google calendar api might be down
   - check [google workspace status](https://www.google.com/appsstatus/dashboard/)
   - try signing out and back in

5. **events outside today:**
   - the widget only shows **today's** events
   - check google calendar to verify event dates
   - ensure the event's start or end time is today

#### **calendar list not loading**

**symptoms:**
- settings → calendar → calendars shows "loading..." forever
- calendar list is empty or shows "no calendars found"

**causes & solutions:**

1. **not signed in:**
   - ensure you're signed in via integrations tab
   - calendar list only loads when authenticated

2. **no calendars in google account:**
   - verify you have calendars in [google calendar](https://calendar.google.com)
   - create a calendar if needed

3. **permissions not granted:**
   - during sign-in, ensure you granted calendar permissions
   - try signing out and re-signing in with full permissions

4. **sync failed:**
   - close and reopen the settings modal
   - try clicking the sync button in the agenda widget first

#### **instant meet button not working**

**symptoms:**
- clicking "+ instant conf" does nothing
- modal doesn't appear or shows an error
- "failed to create meet link" error

**causes & solutions:**

1. **not signed in:**
   - ensure you're signed in to google
   - instant meet requires calendar api permissions

2. **calendar permissions not granted:**
   - during sign-in, you must grant write permissions to calendar
   - sign out and re-sign in, ensuring you grant all permissions

3. **google api quota exceeded:**
   - rare, but possible if you create many meet links rapidly
   - wait a few minutes and try again

4. **network error:**
   - check your internet connection
   - try again after a moment

#### **event times showing in wrong format**

**symptoms:**
- events show 24hr time but you want 12hr (or vice versa)
- event times don't match clock format

**causes & solutions:**

1. **clock settings mismatch:**
   - go to **settings → clock tab**
   - ensure **time format** matches your preference
   - calendar widget uses the same format as the clock

2. **cache not refreshed:**
   - click the **sync button** to refresh with new format
   - event times update immediately

#### **past events still showing**

**symptoms:**
- events from earlier today remain visible
- past events aren't dimmed

**causes & solutions:**

1. **expected behavior:**
   - the widget shows **all events from today** (past and future)
   - past events are dimmed (lighter text color)
   - this is intentional to see your full daily schedule

2. **cache not refreshed:**
   - if events from yesterday are showing, the cache might be stale
   - click **sync button** to refresh

3. **timezone issues:**
   - check your system timezone is correct
   - events use system timezone for past/future calculation

#### **slow sync or performance issues**

**symptoms:**
- sync takes a long time (more than 5 seconds)
- agenda panel is laggy or slow to render
- sync button spins indefinitely

**causes & solutions:**

1. **many calendars selected:**
   - fetching events from 20+ calendars takes time
   - use calendar filter to select fewer calendars
   - typical sync with 5 calendars: 1-2 seconds

2. **many events today:**
   - 50+ events can slow rendering slightly
   - consider filtering to fewer calendars

3. **slow internet connection:**
   - google calendar api requires network requests
   - check your connection speed
   - try refreshing when on faster network

4. **google api slowness:**
   - rare, but google's api might be slow temporarily
   - wait a moment and try again

---

## quick links

the quick links widget provides fast access to your favorite websites with customizable layout, favicons, and reorderable links. perfect for bookmarking frequently visited sites on your startpage.

### enabling/disabling links

**toggle links widget:**
1. open **settings** → **links** tab
2. check or uncheck **"enabled"**
3. changes save automatically

**what happens when disabled:**
- links panel is completely hidden from your startpage
- link data remains saved and will reappear when you re-enable

### link display settings

configure how your links are displayed with favicon icons, column layout, and click behavior.

#### show favicons

display website favicons (icons) next to each link title.

**how to toggle:**
1. open **settings** → **links** tab
2. check or uncheck **"show favicons"**
3. changes apply immediately

**when enabled:**
- each link displays its website's favicon (e.g., gmail's envelope icon, github's octocat)
- favicons are fetched automatically from each website's URL
- creates a more visual, recognizable link list

**when disabled:**
- simple bullet points (`•`) appear instead of favicons
- cleaner, more minimal aesthetic
- useful if favicons fail to load or you prefer text-only

**note:** favicons are fetched from `https://www.google.com/s2/favicons?domain={url}&sz=32` which provides reliable icon retrieval for most websites.

#### links per column

control how many links appear in each column to customize your layout.

**how to change:**
1. open **settings** → **links** tab
2. find **"per column"** number input
3. enter a number (minimum: 1)
4. press enter or click outside the field
5. layout updates immediately

**how it works:**
- links are divided into columns based on this number
- if you have 16 default links and set "per column" to **8**, you get **2 columns**
- if you set it to **4**, you get **4 columns**
- if you set it to **16**, you get **1 column** (all links in one vertical list)

**examples:**

| links per column | total links | result |
|------------------|-------------|--------|
| 4 | 16 | 4 columns × 4 links each |
| 8 | 16 | 2 columns × 8 links each |
| 5 | 13 | 3 columns (5 + 5 + 3) |
| 1 | 10 | 10 columns × 1 link each (horizontal) |

**tips:**
- **4-8** links per column works well for most screen sizes
- higher numbers create taller, narrower columns
- lower numbers create wider, horizontal layouts
- experiment to find what fits your screen best

#### link target (open in...)

choose whether links open in the same tab or a new tab when clicked.

**how to change:**
1. open **settings** → **links** tab
2. under **"open in"**, select either:
   - **same tab** (target: `_self`)
   - **new tab** (target: `_blank`)
3. changes apply to all links immediately

**same tab (`_self`):**
- clicking a link replaces your startpage with the destination
- use browser's back button to return to startpage
- **when to use:** you want to replace the current tab, traditional browser behavior

**new tab (`_blank`):**
- clicking a link opens destination in a new tab
- your startpage remains open in the original tab
- **when to use:** you want to keep your startpage accessible, recommended for most users

**recommended setting:** **new tab** - keeps your startpage always available in a dedicated tab.

### managing your links

add, edit, delete, and reorder links using the link editor in settings.

#### adding links

**to add a new link:**

1. open **settings** → **links** tab
2. scroll to the **"edit links"** section
3. click the **"add +"** button at the top-right of the editor
4. a new empty link row appears at the bottom with two fields:
   - **title**: enter the display name (e.g., "gmail", "github", "youtube")
   - **url**: enter the full website address (e.g., `https://mail.google.com`)
5. fill in both fields
6. click outside or press enter to save
7. the link appears in your links widget immediately

**tips for adding links:**
- **urls must include protocol**: use `https://example.com`, not just `example.com`
- **title can be anything**: short names work best (e.g., "mail" instead of "google mail")
- **favicons fetch automatically**: the icon will appear if favicons are enabled
- **leave fields empty**: empty title or url won't display (but won't cause errors)

**examples:**
```
title: gmail
url: https://mail.google.com

title: github
url: https://github.com

title: weather
url: https://weather.com
```

#### editing links

**to edit an existing link:**

1. open **settings** → **links** tab
2. scroll to the **"edit links"** section
3. find the link you want to edit in the list
4. click in the **title** or **url** field
5. modify the text
6. click outside or press enter to save
7. changes appear in your links widget immediately

**what you can edit:**
- **title**: change the display name
- **url**: update the destination address
- both fields can be edited independently

**note:** changes save automatically as you type - no save button needed.

#### deleting links

**to delete a link:**

1. open **settings** → **links** tab
2. scroll to the **"edit links"** section
3. find the link you want to remove
4. click the **"x"** button on the right side of that link's row
5. the link is removed immediately
6. the link disappears from your links widget

**warning:** deletion is immediate and cannot be undone. if you accidentally delete a link, you'll need to manually re-add it.

#### reordering links (drag-to-reorder)

links can be reordered by dragging and dropping them in the link editor.

**how to reorder:**

1. open **settings** → **links** tab
2. scroll to the **"edit links"** section
3. find the link you want to move
4. **click and hold** the drag handle (left side of each link row)
5. **drag** the link up or down to your desired position
6. **release** to drop the link in its new position
7. links widget updates immediately to reflect the new order

**how it works:**
- links are displayed in the same order as they appear in the editor
- first link in editor = first link in widget (top-left)
- last link in editor = last link in widget (bottom-right)
- order is maintained when changing "links per column" setting

**visual feedback:**
- while dragging, the link row is highlighted or moves with your cursor
- other links shift to make room for the dragged item
- drop zones are indicated (depends on UI implementation)

**tips:**
- **organize by frequency**: put most-used links first
- **group by category**: work links together, personal links together
- **visual arrangement**: consider how links will appear in columns

**example workflow:**
```
before reorder:
1. gmail
2. calendar
3. github
4. slack

after dragging github to position 2:
1. gmail
2. github
3. calendar
4. slack
```

### default links

re-start comes with **16 pre-configured links** to popular services. these serve as examples and can be fully customized.

**default link list:**

| title | url | category |
|-------|-----|----------|
| gmail | https://mail.google.com | productivity |
| calendar | https://calendar.google.com | productivity |
| drive | https://drive.google.com | productivity |
| docs | https://docs.google.com | productivity |
| github | https://github.com | development |
| slack | https://slack.com | communication |
| keep | https://keep.google.com | productivity |
| leetcode | https://leetcode.com/problemset | development |
| perplexity | https://perplexity.ai | ai tools |
| claude | https://claude.ai | ai tools |
| aistudio | https://aistudio.google.com | ai tools |
| chatgpt | https://chat.openai.com | ai tools |
| youtube | https://youtube.com | media |
| reddit | https://reddit.com | social |
| twitter | https://x.com | social |
| feedly | https://feedly.com | news |

**customizing defaults:**
- **keep what you use**: delete links you don't need
- **add your own**: add personal bookmarks, work tools, etc.
- **reorder**: arrange by your usage patterns
- **replace entirely**: delete all and start fresh with your own links

**note:** these defaults are just suggestions - the extension works best when customized to your personal workflow.

### link widget tips

**best practices:**
- **keep it focused**: 8-16 links is a sweet spot (too many becomes cluttered)
- **use new tab target**: keeps your startpage always accessible
- **enable favicons**: makes links easier to scan visually
- **organize by usage**: most-used links at the top-left
- **group by context**: work links together, personal links together
- **short titles**: "mail" is better than "google mail inbox"

**performance notes:**
- favicons are loaded from google's favicon service (fast and reliable)
- no limit on number of links (but consider visual clutter)
- links widget is lightweight and doesn't sync externally

**hidden feature:**
- the links panel spans 3 grid columns by default, giving it prominent space on your startpage

---

## advanced features

discover hidden features, keyboard shortcuts, and tips to get the most out of re-start.

---

### force refresh by clicking labels

**hidden feature:** you can force refresh any widget by clicking its label!

most widgets have a subtle label in the top-left corner (like "weather", "tasks", "calendar"). these labels are clickable and will force an immediate refresh of that widget's data.

**how to use:**
1. hover over a panel label (e.g., "weather", "tasks", "calendar")
2. the label should change color slightly to indicate it's clickable
3. click the label to trigger an immediate sync/refresh

**which widgets support this:**
- **weather** - forces immediate weather data fetch (bypasses 15-minute cache)
- **tasks** - forces immediate task sync with your task backend (local/todoist/google)
- **calendar** - forces immediate calendar event sync with google calendar

**when to use:**
- you just added/changed something in the native app (todoist, google tasks, google calendar)
- weather data seems outdated (e.g., after location change)
- widget is showing stale data or you want to see changes immediately

**note:** each widget also has a dedicated sync button (circular arrow icon) in the bottom-right corner that does the same thing. clicking the label is just a faster way to refresh without moving your cursor down to the button.

---

### keyboard shortcuts

re-start includes several keyboard shortcuts for faster navigation and accessibility.

#### settings modal shortcuts

**escape** - close settings drawer
- press `Esc` at any time while settings are open to close the drawer
- works from any tab, even when focused on input fields

#### tab navigation shortcuts

when focused on a settings tab button (click a tab icon first):

**arrow left / arrow right** - navigate between tabs
- `←` moves to the previous tab
- `→` moves to the next tab
- wraps around: pressing `→` on the last tab jumps to the first tab

**home / end** - jump to first/last tab
- `Home` jumps to the first tab (appearance)
- `End` jumps to the last tab (links)

**tab / shift+tab** - cycle through focusable elements
- `Tab` moves focus forward through buttons, inputs, and interactive elements
- `Shift+Tab` moves focus backward
- focus trap: you can't accidentally tab outside the settings drawer while it's open

#### general navigation

**tab key** - keyboard-only navigation
- all interactive elements (buttons, inputs, links) are keyboard accessible
- visible focus indicators show where you are
- tab order follows logical reading order

**note:** there are currently no global keyboard shortcuts (like opening settings with a key). all shortcuts are contextual to the settings drawer.

---

### performance tips

re-start is designed to be lightweight and efficient, but here are some tips to optimize performance:

#### automatic optimizations

re-start includes several built-in performance optimizations:

**pause when hidden:**
- clock, weather, tasks, and calendar widgets automatically pause updates when your browser tab is hidden
- uses the document visibility API to detect when you switch tabs
- saves CPU and battery life when you're not actively viewing the startpage

**smart caching:**
- **weather**: 15-minute cache - weather data is reused for 15 minutes before fetching new data
- **tasks**: 5-minute cache - task data is cached for 5 minutes (todoist/google tasks only)
- **calendar**: 5-minute cache - calendar events are cached for 5 minutes
- **background images**: daily cache - unsplash images refresh once per day
- caches are automatically invalidated when settings change (e.g., location, units, selected calendars)

**progressive image loading:**
- background images load in two stages: small thumbnail (instant) → full resolution (smooth fade-in)
- prevents layout shift and provides instant visual feedback
- reduces perceived loading time

**lightweight by default:**
- no analytics, tracking, or telemetry
- minimal external dependencies
- all data stored locally in your browser (no server roundtrips except API calls)

#### manual optimizations

if you experience performance issues, try these tips:

**disable unused widgets:**
1. open settings
2. navigate to the relevant tab (weather, tasks, calendar, links)
3. toggle off widgets you don't use
4. each disabled widget reduces memory usage and eliminates unnecessary API calls

**reduce background image opacity:**
1. open settings → appearance
2. lower the background opacity slider
3. or disable background images entirely
4. background blur effects (frosted glass) can be GPU-intensive on older devices

**use local tasks instead of remote:**
1. open settings → tasks
2. switch source to "local storage"
3. eliminates network requests and sync overhead
4. instant task operations (add, complete, delete)

**limit quick links:**
1. open settings → links
2. reduce "links per column" to show fewer links
3. or remove unused links entirely
4. each link makes a favicon request to google's servers (cached after first load)

**minimize custom css:**
1. open settings → appearance
2. remove or simplify custom css rules
3. complex selectors and animations can impact render performance
4. test incrementally: add rules one at a time to identify slow styles

**use 24-hour time format:**
- slightly faster rendering than 12-hour format (no am/pm calculation)
- negligible difference, but technically more efficient

#### checking performance

re-start does not currently include a built-in stats panel (despite references in older documentation). to monitor performance:

**browser devtools:**
1. open your browser's developer tools (F12 or right-click → inspect)
2. navigate to the performance or console tab
3. look for console warnings or errors
4. use the performance profiler to identify bottlenecks

**viewport info:**
- check your browser's window size: responsive layout works best at 1100px+ width
- the grid layout adapts to your viewport size automatically

**typical performance characteristics:**
- **first load**: 200-500ms (includes settings load, theme apply, widget mount)
- **clock update**: <1ms (updates every second)
- **weather sync**: 300-800ms (depends on network and openmeteo api)
- **task sync**: 400-1000ms (depends on network and backend: todoist/google)
- **calendar sync**: 500-1200ms (depends on network and number of events)

---

### reset settings option

if you want to restore re-start to its default configuration, you can reset all settings to their original values.

**where to find it:**
1. open settings (hover top-right corner, click gear icon)
2. scroll to the bottom of the settings drawer
3. look for the footer: "re-start v1.x.x • made with love by refact0r • **reset settings**"
4. click "reset settings" (blue link text)

**what happens when you reset:**
1. a confirmation dialog appears: "are you sure you want to reset all settings to default?"
2. click "ok" to confirm (or "cancel" to abort)
3. all settings are removed from browser storage and restored to defaults

**default settings restored:**
- **appearance**: default theme, geist mono variable font, tab title "~", no background, no custom css
- **integrations**: all api tokens and keys cleared, signed out of google
- **clock**: 24-hour format, d/m/y date format
- **weather**: enabled, manual location (not configured), celsius, km/h
- **tasks**: enabled, local storage backend
- **calendar**: enabled, no calendars selected
- **links**: enabled, favicons shown, 4 links per column, open in same tab, 16 default links restored

**what is NOT reset:**
- **browser data**: cached weather, tasks, calendar data (in localStorage) - this will be cleared on next sync
- **google session**: if you were signed into google, you'll remain signed in (tokens stored separately)
- **todoist/unsplash data**: cached data persists until next sync or manual clear

**when to use reset:**
- you've made many changes and want to start fresh
- settings are corrupted or behaving unexpectedly
- you want to restore default links
- troubleshooting: eliminate custom settings as a potential issue

**alternative: selective reset**

instead of resetting everything, you can manually restore individual settings:

1. **theme**: select "default" in appearance → theme
2. **links**: delete custom links and re-add defaults manually
3. **custom css**: clear the custom css textarea
4. **integrations**: click "sign out" or remove api tokens individually

**after resetting:**
- the settings drawer remains open so you can reconfigure immediately
- changes take effect instantly (no refresh required)
- you'll need to re-enter any api keys/tokens if you were using integrations
- if using google integrations, you'll need to sign in again

---

### additional tips

**settings auto-save:**
- all settings changes are saved automatically to browser localStorage
- no need to click a "save" button
- changes take effect immediately (reactive updates)

**settings persistence:**
- settings persist across browser sessions
- stored in localStorage (specific to this domain and browser)
- clearing browser data will erase settings (use export/backup if needed)

**widget order:**
- widgets appear in a fixed grid layout (not customizable)
- order: clock → calendar → [weather | tasks | calendar events] → links
- use custom css to hide or rearrange if needed (advanced)

**responsive layout:**
- the startpage uses a 3-column grid layout
- links panel spans all 3 columns
- layout adapts to viewport size (best viewed at 1100px+ width)

**frosted glass effect:**
- when background images are enabled, panels get a semi-transparent frosted glass effect
- uses css `backdrop-filter: blur(12px)` - may not work in all browsers
- disable background images to remove the effect and improve performance

**link favicons:**
- fetched from google's favicon service: `https://www.google.com/s2/favicons?domain=...`
- cached by your browser after first load
- if favicon doesn't appear, the site may not have one or google can't fetch it
- toggle off "show favicons" in settings → links if you prefer text-only links

---

---

## natural language date parsing

re-start includes a powerful **natural language date parser** that makes adding tasks with due dates incredibly fast. simply type dates naturally as part of your task description, and they'll be automatically detected and converted to due dates.

### how it works

as you type a task, the parser continuously scans for date patterns. when it finds a valid date:

1. **the date text highlights in yellow** - instant visual feedback
2. **the date becomes metadata** - when you press enter, the date is stripped from the task name and stored as the due date
3. **works everywhere** - local tasks, todoist, and google tasks all support this feature

**example flow:**

```
you type: "call mom tomorrow at 3pm"
you see:  "call mom [tomorrow at 3pm]" ← yellow highlight
you get:  task "call mom" with due date tomorrow at 3:00 PM
```

### quick reference

this is a comprehensive reference of all supported date formats. all patterns are **case-insensitive** (e.g., "Tomorrow" = "tomorrow" = "TOMORROW").

#### relative dates

the simplest way to set dates:

| pattern | result |
|---------|--------|
| `today` | current day |
| `tomorrow`, `tmrw`, `tmr` | next day |
| `yesterday` | previous day |

**examples:**
- "finish report today" → due today
- "grocery shopping tmrw" → due tomorrow

#### weekdays

specify any day of the week. if that day has already passed this week, it defaults to next week:

| pattern | result |
|---------|--------|
| `monday`, `mon` | next monday |
| `tuesday`, `tue`, `tues` | next tuesday |
| `wednesday`, `wed` | next wednesday |
| `thursday`, `thu`, `thur`, `thurs` | next thursday |
| `friday`, `fri` | next friday |
| `saturday`, `sat` | next saturday |
| `sunday`, `sun` | next sunday |

**with "next" modifier:**
- `next monday`, `next fri` - skips to the following week

**examples:**
- "team meeting friday" → next friday
- "dentist next wed" → wednesday of next week

#### special keywords

convenient shortcuts for common date patterns:

| pattern | result |
|---------|--------|
| `weekend` | next saturday |
| `next weekend` | saturday of next week |
| `weekday` | next weekday (mon-fri) |
| `next weekday` | following weekday |

**examples:**
- "hiking trip weekend" → next saturday
- "start project weekday" → next weekday

#### month + day

specify exact dates using month names:

| pattern | examples |
|---------|----------|
| `[month] [day]` | `jan 15`, `january 15`, `dec 31` |
| `[month] [day][ordinal]` | `jan 15th`, `dec 1st`, `mar 3rd` |
| `[day] [month]` | `15 jan`, `1 december` |

**all months supported:**
jan, feb, mar, apr, may, jun, jul, aug, sep, oct, nov, dec (full names also work)

**examples:**
- "vacation starts dec 20" → december 20th
- "tax deadline apr 15th" → april 15th
- "birthday 25 may" → may 25th

#### month + day + year

for dates in future years:

| pattern | examples |
|---------|----------|
| `[month] [day] [year]` | `jan 15 2026`, `december 31 2025` |
| `[day] [month] [year]` | `15 jan 2026`, `31 dec 2025` |

**examples:**
- "conference may 20 2026" → may 20, 2026
- "lease ends 30 jun 2025" → june 30, 2025

#### numeric dates

use slashes or dashes for quick date entry:

| pattern | examples | respects date format setting |
|---------|----------|------------------------------|
| `[m]/[d]` | `12/31`, `1/15` | yes (mdy or dmy) |
| `[m]-[d]` | `12-31`, `1-15` | yes (mdy or dmy) |
| `[m]/[d]/[yy]` | `12/31/25`, `1/15/26` | yes (mdy or dmy) |
| `[m]-[d]-[yy]` | `12-31-25`, `1-15-26` | yes (mdy or dmy) |

**note:** numeric dates respect your **date format setting** (mdy vs dmy) from clock settings.
- mdy format: `1/12` = january 12
- dmy format: `1/12` = 12th of january

**examples:**
- "submit invoice 12/31" → december 31 (mdy) or 31st of december (dmy)
- "review due 3-15-25" → march 15, 2025 (mdy) or 15th of march 2025 (dmy)

#### ordinal dates

use ordinal numbers (1st, 2nd, 3rd, etc.) for dates within the current or next month:

| pattern | examples |
|---------|----------|
| `[day][ordinal]` | `15th`, `1st`, `22nd`, `3rd` |

**behavior:**
- if the ordinal has passed this month, it rolls to next month
- example: if today is december 10th, typing "5th" means january 5th

**examples:**
- "payment due 15th" → 15th of this/next month
- "appointment 1st" → 1st of next month

#### times

add specific times to any date pattern:

| time format | examples |
|-------------|----------|
| `[hour]am/pm` | `3pm`, `10am`, `1pm` |
| `[hour]:[minute]am/pm` | `3:30pm`, `9:45am` |
| `[hour]:[minute]` (24hr) | `15:30`, `09:45`, `22:10` |
| `[bare hour]` (0-23) | `7`, `15`, `23` |

**combining with dates:**

you can combine times with any date pattern using natural bridging words or simple spacing:

| pattern | examples |
|---------|----------|
| `[date] [time]` | `tomorrow 3pm`, `friday 10am` |
| `[date] at [time]` | `jan 15 at 9am`, `next mon at 7` |
| `[time] [date]` | `3pm tomorrow`, `10am friday` |
| `[time] on [date]` | `3pm on dec 12` |
| `[date], [time]` | `dec 12, 10pm` |

**examples:**
- "meeting tomorrow 2pm" → tomorrow at 2:00 PM
- "call at 9:30am friday" → next friday at 9:30 AM
- "submit jan 15 at 5pm" → january 15 at 5:00 PM
- "10pm on weekend" → next saturday at 10:00 PM

#### time-only entries

you can also enter just a time without a date. the parser will:
- use **today** if the time hasn't passed yet
- use **tomorrow** if the time has already passed

**examples:**
- typing "3pm" at 2:00 PM → due today at 3:00 PM
- typing "1am" at 2:00 PM → due tomorrow at 1:00 AM

### real-world examples

here's how natural language dates work in practice:

```
INPUT: "meeting with john tomorrow at 2pm"
TASK:  "meeting with john"
DUE:   tomorrow at 2:00 PM

INPUT: "buy milk this weekend"
TASK:  "buy milk"
DUE:   next saturday

INPUT: "dentist appointment jan 15"
TASK:  "dentist appointment"
DUE:   january 15

INPUT: "call sarah next friday 10am"
TASK:  "call sarah"
DUE:   next friday at 10:00 AM

INPUT: "submit report 3pm today"
TASK:  "submit report"
DUE:   today at 3:00 PM

INPUT: "renew license dec 31st"
TASK:  "renew license"
DUE:   december 31

INPUT: "vacation starts 7/15"
TASK:  "vacation starts"
DUE:   july 15 (mdy) or 15th of july (dmy)

INPUT: "conference may 20 2026 9am"
TASK:  "conference"
DUE:   may 20, 2026 at 9:00 AM
```

### tips for best results

**✅ do:**
- use standard abbreviations: `mon`, `tue`, `jan`, `feb`, etc.
- watch for the yellow highlight as you type
- combine dates with times naturally: "tomorrow 3pm"
- use ordinals: `1st`, `2nd`, `15th`, `22nd`

**❌ avoid:**
- typos: "tommorow" won't work (use "tomorrow")
- invalid abbreviations: "frid" won't work (use "fri")
- ambiguous formats without context
- dates far in the past (parser assumes future dates)

**if a date isn't detected:**
1. check for typos
2. verify the format is supported (see tables above)
3. try a different format (e.g., "dec 15" instead of "12/15")
4. as a fallback, set the date manually in your task app (todoist/google tasks)

### where to find this feature

natural language date parsing is available:
- **local tasks** - enabled by default
- **todoist integration** - works with all todoist task entry
- **google tasks integration** - works with all google tasks entry

see the [tasks section](#tasks) for more details on using the task feature.

---

## troubleshooting

having issues with re-start? this section covers the most common problems and their solutions. for feature-specific issues, check the troubleshooting subsections in each feature's section.

---

### quick troubleshooting checklist

before diving into specific issues, try these general fixes:

**1. refresh the page**
- press `ctrl+r` (windows/linux) or `cmd+r` (mac)
- many issues resolve with a simple refresh
- this re-initializes all widgets and reconnects to apis

**2. check your internet connection**
- weather, tasks (todoist/google), calendar, and background images all require internet
- local tasks work offline
- try loading another website to verify connectivity

**3. check browser console for errors**
- open developer tools: `f12` or right-click → inspect
- click the "console" tab
- look for red error messages
- screenshot and report errors if you need help

**4. try incognito/private mode**
- opens re-start in a clean environment
- helps identify if browser extensions are interfering
- if it works in incognito, disable extensions one-by-one to find the culprit

**5. clear browser cache and data**
- chrome: settings → privacy and security → clear browsing data
- firefox: settings → privacy & security → cookies and site data → clear data
- safari: preferences → privacy → manage website data → remove all
- **warning**: this will reset all settings and sign you out of integrations

**6. reset re-start settings**
- open settings (top-right corner)
- scroll to footer, click "reset settings"
- restores all defaults, clears custom css, removes api tokens
- see [reset settings option](#reset-settings-option) for details

---

### api token verification failures

**problem**: "verification failed" message when entering todoist api token or unsplash api key

#### todoist api token issues

**symptoms:**
- ❌ "invalid token" or "verification failed" after clicking verify
- ❌ todoist widget shows "no todoist api token"
- ❌ tasks not syncing even after entering token

**solutions:**

**1. verify token format**
- todoist api tokens are 40-character hexadecimal strings
- example format: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0`
- no spaces, no line breaks, only letters (a-f) and numbers (0-9)
- copy/paste directly from todoist settings page

**2. get a fresh token**
1. go to [todoist.com/app/settings/integrations/developer](https://todoist.com/app/settings/integrations/developer)
2. sign in if needed
3. scroll to "api token" section
4. your token is displayed (40 characters)
5. click to copy, paste into re-start integrations tab
6. click "verify todoist api token"

**3. check token permissions**
- make sure you're copying from the correct account
- if you have multiple todoist accounts, verify you're signed into the right one
- tokens have full account access - no additional permissions needed

**4. network issues**
- verification requires internet connection
- check if todoist.com loads in another tab
- try disabling vpn or proxy temporarily
- corporate networks may block todoist api

**5. api rate limiting**
- todoist api has rate limits (though generous)
- if you've made many requests recently, wait a few minutes
- rate limit resets every minute

**still not working?**
- try revoking and regenerating token on todoist website
- check browser console (f12) for specific error messages
- verify todoist service status at [todoist.com](https://todoist.com)

---

#### unsplash api key issues

**symptoms:**
- ❌ "invalid api key" or "verification failed" after clicking verify
- ❌ background images not loading even with api key entered
- ❌ "failed to fetch image" errors

**solutions:**

**1. verify key format**
- unsplash access keys are long alphanumeric strings
- example format: `Ab1Cd2Ef3Gh4Ij5Kl6Mn7Op8Qr9St0Uv1Wx2Yz3Aa4Bb5Cc6Dd7Ee8Ff9Gg0`
- copy the **access key**, not the **secret key**
- no spaces, no line breaks

**2. get a fresh api key**
1. go to [unsplash.com/developers](https://unsplash.com/developers)
2. sign in if needed
3. click "your apps" or go to [unsplash.com/oauth/applications](https://unsplash.com/oauth/applications)
4. click your application (or create one if needed)
5. copy the **"access key"** (not secret key!)
6. paste into re-start integrations tab
7. click "verify unsplash api key"

**3. check application status**
- demo applications have 50 requests/hour limit
- if you exceed this, verification will fail
- wait an hour or apply for production (5,000/hour)
- check your application's "usage" tab on unsplash developers portal

**4. network issues**
- verification requires internet connection
- check if unsplash.com loads in another tab
- try disabling vpn or proxy temporarily
- ad blockers may interfere with api requests

**5. wrong key copied**
- make sure you copied **access key**, not **secret key**
- secret key is for server-side apps only (doesn't work in re-start)
- access key is client-safe and what re-start needs

**still not working?**
- create a new application on unsplash developers portal
- use a different unsplash account
- check browser console (f12) for specific error messages
- verify unsplash api status

---

### weather not loading

**problem**: weather widget is blank, shows error, or displays stale data

**symptoms:**
- □ weather widget is completely blank
- □ "location not configured" error message
- □ weather shows but never updates
- □ incorrect weather data for your location
- □ "failed to fetch weather" error

**solutions:**

**1. configure location**
- weather requires location (manual or auto)
- open settings → weather
- check if location mode is set
- if manual: verify latitude/longitude are entered
- if auto: click "detect" to request browser location

**2. grant location permission (auto mode)**
- browser will prompt for location access
- click "allow" when prompted
- chrome: look for location icon in address bar (click to grant)
- firefox: same, look for permission prompt
- safari: preferences → websites → location → allow for this site

**3. verify coordinates (manual mode)**
- latitude: -90 to +90 (negative = south, positive = north)
- longitude: -180 to +180 (negative = west, positive = east)
- example: new york city ≈ `40.71, -74.01`
- use [google maps](https://maps.google.com) to find coordinates:
  - right-click location → click coordinates to copy
  - first number = latitude, second = longitude

**4. check internet connection**
- weather uses openmeteo api (requires internet)
- try loading another website to verify connectivity
- vpns may slow down api requests

**5. force refresh weather**
- click the "weather" label at top of widget
- or click the refresh button (if visible)
- this bypasses the 15-minute cache

**6. check openmeteo api status**
- visit [open-meteo.com](https://open-meteo.com)
- if site is down, weather won't load
- wait for service to restore

**7. clear weather cache**
- open browser console (f12)
- type: `localStorage.removeItem('weather-data')`
- press enter
- refresh page

**still not working?**
- check browser console (f12) for error messages
- try disabling browser extensions (use incognito mode)
- verify weather widget is enabled: settings → weather → toggle on

**see also:** [weather troubleshooting section](#weather) for detailed feature-specific issues

---

### tasks not syncing

**problem**: tasks not appearing, changes not saving, or sync failures

**symptoms:**
- □ tasks added in re-start don't appear in todoist/google tasks
- □ tasks completed elsewhere don't update in re-start
- □ "sync failed" error message
- □ infinite loading/sync spinner
- □ tasks duplicated or missing

---

#### local storage tasks not syncing

**symptom**: tasks disappear after refresh, or don't persist

**cause**: local storage tasks are browser-specific and don't sync across devices

**solutions:**

**1. verify backend selection**
- open settings → tasks
- check that "local storage" is selected
- local tasks only work in this browser on this device

**2. check browser storage**
- chrome: settings → privacy and security → site settings → view permissions and data
- look for re-start domain, verify storage is allowed
- clearing browser data will delete local tasks

**3. browser storage limits**
- local storage has ~5-10mb limit per domain
- if you have hundreds of tasks, you may hit the limit
- consider switching to todoist or google tasks

**4. private/incognito mode**
- local storage doesn't persist in private/incognito windows
- tasks will be lost when you close the window
- use normal browsing mode for persistent tasks

---

#### todoist tasks not syncing

**symptom**: tasks not syncing between re-start and todoist.com

**solutions:**

**1. verify api token**
- open settings → integrations
- check todoist api token is entered and verified (green ✓)
- if not verified, see [todoist api token issues](#todoist-api-token-issues)

**2. verify backend selection**
- open settings → tasks
- check that "todoist" is selected as source
- save and refresh page

**3. check todoist service status**
- visit [todoist.com](https://todoist.com)
- sign in and verify your tasks appear
- if todoist is down, sync won't work

**4. force manual sync**
- click the "x tasks" label at top of widget
- or click the sync button (refresh icon) at bottom
- watch for sync spinner (indicates active sync)

**5. clear todoist cache**
- open browser console (f12)
- type: `localStorage.removeItem('todoist-sync-token')`
- press enter
- refresh page (this forces full re-sync)

**6. check sync token**
- re-start uses incremental sync with sync tokens
- if token gets corrupted, sync fails
- clearing cache (step 5) resets the token

**7. network issues**
- check internet connection
- todoist api requires https
- corporate firewalls may block todoist api endpoints

**8. rate limiting**
- todoist has generous rate limits, but they exist
- if you've made hundreds of requests quickly, wait a few minutes
- sync will resume when rate limit resets

**still not working?**
- try removing and re-adding todoist api token
- check browser console (f12) for specific error codes
- verify todoist account is active and not suspended

---

#### google tasks not syncing

**symptom**: tasks not syncing between re-start and google tasks

**solutions:**

**1. verify google sign-in**
- open settings → integrations
- check if signed into google (shows email address)
- if not signed in, click "sign in with google"
- see [google sign-in issues](#google-sign-in-issues) if sign-in fails

**2. verify backend selection**
- open settings → tasks
- check that "google-tasks" is selected as source
- save and refresh page

**3. check google tasks service**
- visit [tasks.google.com](https://tasks.google.com)
- sign in and verify your tasks appear
- if google tasks is down, sync won't work

**4. force manual sync**
- click the "x tasks" label at top of widget
- watch for sync spinner (indicates active sync)

**5. re-authenticate**
- open settings → integrations
- click "sign out of google"
- click "sign in with google" again
- grant permissions in popup

**6. check oauth token**
- re-start stores google oauth tokens in localStorage
- tokens expire after 1 hour (auto-refreshed)
- if refresh fails, sign out and sign in again

**7. clear google tasks cache**
- open browser console (f12)
- type: `localStorage.removeItem('google-tasks-cache')`
- press enter
- refresh page

**still not working?**
- check browser console (f12) for specific error messages
- verify popup blocker isn't blocking oauth flow
- try incognito mode to rule out extension interference

**see also:** [tasks troubleshooting section](#tasks) for detailed feature-specific issues

---

### background images not appearing

**problem**: background images don't load, show errors, or appear broken

**symptoms:**
- □ background setting enabled but no image shows
- □ "failed to fetch image" error
- □ background shows briefly then disappears
- □ photographer attribution missing
- □ images load very slowly

**solutions:**

**1. verify unsplash api key**
- open settings → integrations
- check unsplash api key is entered and verified (green ✓)
- if not verified, see [unsplash api key issues](#unsplash-api-key-issues)

**2. check background setting**
- open settings → appearance
- verify "show background image" toggle is enabled
- if disabled, no background will show (even with valid api key)

**3. force new image**
- open settings → appearance
- click "get new image" button
- this fetches a fresh random image from unsplash
- bypasses daily cache

**4. check api rate limits**
- demo applications: 50 requests/hour
- if exceeded, images won't load until next hour
- apply for production access (5,000/hour) on unsplash developers portal
- check your application's "usage" tab

**5. network issues**
- background images require internet connection
- unsplash cdn may be slow depending on your location
- try disabling vpn or using a different network

**6. browser image loading**
- check if other images load on other websites
- browser may have disabled images in settings
- chrome: settings → privacy and security → site settings → images → allow

**7. clear background cache**
- open browser console (f12)
- type: `localStorage.removeItem('unsplash-image')`
- press enter
- refresh page
- re-start will fetch a new image

**8. check unsplash service status**
- visit [unsplash.com](https://unsplash.com)
- if site is down or slow, api will be affected
- wait for service to restore

**9. content security policy (csp)**
- some corporate networks enforce strict csp
- this may block external images
- if using browser extension, check manifest.json has correct csp

**still not working?**
- try a different unsplash application
- check browser console (f12) for specific error messages
- verify unsplash api key is the **access key**, not secret key
- test with incognito mode to rule out extension interference

**see also:** [appearance troubleshooting section](#appearance) for custom css and theme issues

---

### google sign-in issues

**problem**: can't sign in with google for tasks or calendar integration

**symptoms:**
- □ "sign in with google" button does nothing
- □ popup blocked or doesn't appear
- □ "authentication failed" error
- □ sign-in succeeds but email doesn't show
- □ signed in but tasks/calendar still say "not signed in"

**solutions:**

**1. allow popups**
- google sign-in uses a popup window
- browser may be blocking popups
- look for popup blocker icon in address bar
- click and select "always allow popups from this site"
- chrome: look for blocked popup icon (🚫) in address bar
- firefox: similar, check for notification bar
- try signing in again after allowing popups

**2. disable browser extensions**
- ad blockers and privacy extensions may block google oauth
- try incognito/private mode (extensions usually disabled there)
- if it works in incognito, disable extensions one-by-one to find the culprit
- common culprits: ublock origin, privacy badger, disconnect

**3. check third-party cookies**
- google oauth requires third-party cookies
- chrome: settings → privacy and security → cookies → allow all cookies (or allow for accounts.google.com)
- firefox: settings → privacy & security → cookies → standard (not strict)
- safari: preferences → privacy → uncheck "prevent cross-site tracking" (temporarily)

**4. verify internet connection**
- oauth flow requires stable internet
- check if [accounts.google.com](https://accounts.google.com) loads
- try on a different network if possible

**5. clear google oauth tokens**
- open browser console (f12)
- type: `localStorage.removeItem('google-auth-token')`
- press enter
- type: `localStorage.removeItem('google-token-expiry')`
- press enter
- refresh page and try signing in again

**6. sign out and retry**
- if email shows but features don't work:
  - open settings → integrations
  - click "sign out of google"
  - wait a few seconds
  - click "sign in with google" again
  - grant all requested permissions

**7. grant all permissions**
- google will ask for permissions in the popup:
  - view and manage google tasks
  - view your google calendar (read-only)
  - view your email address
- you must grant ALL permissions for integration to work
- if you deny any permission, sign-in will fail or features won't work

**8. check google account settings**
- visit [myaccount.google.com/permissions](https://myaccount.google.com/permissions)
- look for re-start (or the backend domain)
- verify app has access
- if not listed or access is denied, remove it and sign in again

**9. backend issues**
- re-start uses a backend server for google oauth
- check browser console (f12) for backend errors
- backend must be running at the configured url
- if self-hosting, verify backend is accessible

**10. try different google account**
- some google workspace accounts have restrictions
- admins can disable third-party app access
- try a personal gmail account to test

**still not working?**
- check browser console (f12) for specific oauth error codes
- verify popup window actually opens (check for blocked popups)
- test in a completely different browser
- check if google services are down: [status.cloud.google.com](https://status.cloud.google.com)

**see also:**
- [integrations section](#integrations) for detailed google setup
- [calendar troubleshooting](#calendar) for calendar-specific issues
- [tasks troubleshooting](#tasks) for google tasks issues

---

### calendar widget issues

**quick fixes for common calendar problems:**

**1. calendar widget blank**
- verify google sign-in: settings → integrations → check email shows
- verify calendar enabled: settings → calendar → toggle on
- check if you have events today (visit [calendar.google.com](https://calendar.google.com))
- force refresh: click "calendar" label or sync button

**2. events not showing**
- check calendar filtering: settings → calendar → verify calendars are selected (checkboxes)
- if all unchecked, all calendars show; if some checked, only those show
- events only show for today (not past or future days beyond today)
- force sync: click "calendar" label

**3. event times wrong format**
- event times match clock settings (12hr/24hr)
- change format: settings → clock → select time format
- refresh to see changes

**see also:** [calendar troubleshooting section](#calendar) for detailed issues

---

### widget not showing or blank

**problem**: a widget (weather, tasks, calendar, links) is enabled but doesn't appear

**general solutions:**

**1. check widget toggle**
- open settings
- find the relevant tab (weather/tasks/calendar/links)
- verify the "show [widget]" toggle is enabled
- if disabled, widget won't appear even if configured

**2. check configuration requirements**
- **weather**: requires location (manual or auto)
- **tasks**: requires backend selection (local/todoist/google)
- **calendar**: requires google sign-in
- **links**: requires at least one link added

**3. scroll down**
- widgets may be below the fold
- scroll down the page to see all widgets
- order: clock → calendar → weather/tasks → links (bottom)

**4. check browser zoom**
- extreme zoom levels may break layout
- reset zoom: `ctrl+0` (windows/linux) or `cmd+0` (mac)
- optimal view: 100% zoom, 1100px+ width

**5. custom css interference**
- if using custom css: settings → appearance → custom css
- try temporarily clearing custom css to see if it's hiding the widget
- common issue: `display: none` or `visibility: hidden` on widget

**6. console errors**
- open browser console (f12)
- look for red error messages related to the widget
- errors may indicate why widget failed to load

**7. refresh page**
- sometimes widgets fail to mount on first load
- simple refresh often fixes it: `ctrl+r` or `cmd+r`

---

### performance issues

**problem**: re-start feels slow, laggy, or unresponsive

**symptoms:**
- □ page takes long time to load
- □ animations are choppy
- □ widgets update slowly
- □ typing in task input lags

**solutions:**

**1. disable background images**
- background images (especially large ones) impact performance
- open settings → appearance → disable "show background image"
- frosted glass effects are gpu-intensive

**2. reduce background opacity**
- if you want to keep backgrounds:
- open settings → appearance → reduce opacity slider to 30-50%
- less blur = better performance

**3. switch to local tasks**
- network sync (todoist/google) adds latency
- open settings → tasks → select "local storage"
- instant task operations, no network overhead

**4. disable unused widgets**
- each widget adds processing overhead
- open settings
- disable widgets you don't use:
  - weather, tasks, calendar, links can all be toggled off

**5. minimize custom css**
- complex css rules slow down rendering
- open settings → appearance → custom css
- remove or simplify rules
- avoid expensive properties: `filter`, `box-shadow`, heavy animations

**6. clear browser cache**
- accumulated cache can slow down performance
- chrome: settings → privacy → clear browsing data → cached images and files
- firefox: settings → privacy → cookies and site data → clear data

**7. check browser extensions**
- extensions can interfere and slow down pages
- try incognito mode (extensions usually disabled)
- if faster in incognito, disable extensions one-by-one

**8. use modern browser**
- re-start uses modern web features (css grid, backdrop-filter, fetch api)
- update to latest browser version
- chrome, firefox, edge, safari all supported

**9. check system resources**
- if your computer is slow overall:
- close other tabs and applications
- check cpu/memory usage in task manager
- restart browser if it's been running for days

**see also:** [performance tips](#performance-tips) in advanced features section

---

### settings not saving

**problem**: settings changes don't persist after refresh

**symptoms:**
- □ settings revert to defaults after closing browser
- □ api tokens disappear after refresh
- □ theme resets to default
- □ custom css is lost

**solutions:**

**1. check browser storage permissions**
- re-start uses localstorage to save settings
- browser may have storage disabled
- chrome: settings → privacy → site settings → find re-start → storage → allow
- firefox: settings → privacy → cookies → manage exceptions → allow for re-start

**2. private/incognito mode**
- private windows don't persist storage
- settings will be lost when you close the window
- use normal browsing mode for persistent settings

**3. browser clearing data automatically**
- chrome: settings → privacy → clear browsing data on exit
- if enabled, settings are lost when you close browser
- disable auto-clear or whitelist re-start domain

**4. storage quota exceeded**
- very rare, but possible if you have tons of tasks/links
- open browser console (f12)
- type: `console.log(JSON.stringify(localStorage).length)`
- if over 5,000,000 (5mb), you may be hitting limits
- clear some data or use cloud task backends

**5. browser extension interference**
- privacy extensions may block localstorage
- try incognito mode to test
- disable extensions one-by-one to find culprit

**6. check console for errors**
- open browser console (f12)
- look for storage-related errors
- common: `quotaexceedederror`, `security error`, `dom exception`

**still not working?**
- try a different browser to isolate the issue
- check if other websites can save data (cookies, localstorage)
- your browser may have storage completely disabled

---

### custom css not applying

**problem**: custom css entered but no visual changes

**solutions:**

**1. verify css syntax**
- open browser console (f12)
- look for css syntax errors
- missing semicolons, brackets, or quotes will break rules

**2. check css specificity**
- re-start's default styles may override your custom css
- use more specific selectors
- example: instead of `.tasks`, use `#app .tasks`
- or use `!important` (last resort): `color: red !important;`

**3. refresh page**
- custom css applies on page load
- after changing css: close settings and refresh page
- `ctrl+r` or `cmd+r`

**4. inspect element**
- right-click element you're trying to style → inspect
- check which styles are actually applied
- look for crossed-out rules (overridden)
- verify your custom css is in the `<style id="custom-css">` tag

**5. use browser devtools to test**
- open inspector (f12)
- modify styles in devtools first
- once it works, copy to custom css in settings

**6. css variable order**
- if overriding theme colors, they apply in specific order
- custom css loads after theme variables
- you may need `!important` to override theme defaults

**see also:** [custom css examples](#custom-css) in appearance section for working examples

---

### date parsing not working

**problem**: typing dates in tasks doesn't highlight or parse correctly

**solutions:**

**1. check date format**
- re-start supports many formats, but not all
- see [natural language date parsing](#natural-language-date-parsing) for supported formats
- examples: "tomorrow", "next friday", "jan 15", "12/31"

**2. watch for yellow highlight**
- as you type, detected dates highlight in yellow
- if no highlight, the date format isn't recognized
- try rephrasing: "friday" instead of "on friday"

**3. date format setting**
- numeric dates respect your date format setting (mdy vs dmy)
- "12/31" = december 31 (mdy) or 12th of january (dmy)
- change format: settings → clock → date format

**4. position in task**
- dates can appear anywhere in task text
- "call mom tomorrow" and "tomorrow call mom" both work
- date is stripped from task name after parsing

**5. capitalization doesn't matter**
- "tomorrow", "Tomorrow", "TOMORROW" all work
- parser is case-insensitive

**6. time must accompany date**
- if adding time: "tomorrow 3pm" works
- standalone times don't work: "3pm" alone won't parse
- always pair time with date: "today 3pm", "friday 10am"

**see also:** [natural language date parsing](#adding-tasks) in tasks section for full format list

---

### theme not changing

**problem**: selecting a theme but colors don't change

**solutions:**

**1. refresh page**
- themes apply on page load via injected script
- after changing theme: close settings and refresh page
- `ctrl+r` or `cmd+r`

**2. custom css override**
- if you have custom css overriding theme colors, it wins
- open settings → appearance → custom css
- look for `--bg-1`, `--txt-1`, etc. variable overrides
- remove css overrides to let theme apply

**3. check browser compatibility**
- themes use css variables (custom properties)
- very old browsers may not support them
- update to latest browser version

**4. browser extension interference**
- dark mode extensions or style injectors may override
- try incognito mode to test
- disable extensions if issue persists

**see also:** [theme descriptions](#appearance) for list of available themes

---

### getting more help

if you've tried all the above and still experiencing issues:

**1. check browser console**
- open developer tools: `f12`
- click "console" tab
- screenshot any error messages (red text)
- include in your bug report

**2. check github issues**
- visit [github.com/refact0r/re-start/issues](https://github.com/refact0r/re-start/issues)
- search for your problem (may already be reported)
- check closed issues for solutions

**3. file a bug report**
- if not found in existing issues, create a new issue
- include:
  - browser name and version
  - operating system
  - steps to reproduce
  - expected vs actual behavior
  - console errors (if any)
  - screenshots (if helpful)

**4. community support**
- check re-start discussions on github
- ask on reddit: r/startpages
- share your setup and ask for tips

**5. verify you're on the latest version**
- check settings footer for version number
- compare with latest release on github
- update if you're behind (new features, bug fixes)

---

**tip**: most issues are solved by refreshing the page, checking internet connection, or verifying api tokens/permissions. start simple before diving deep!

---

## appendix a: css variable reference

*(this section will be added in the next phase)*

---

## appendix b: settings storage schema

*(this section will be added in the next phase)*

---

## appendix c: api rate limits summary

*(this section will be added in the next phase)*

---

## appendix d: theme color reference

*(this section will be added in the next phase)*
