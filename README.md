# VELPLAY - Video Streaming Platform 🎬

A modern, responsive YouTube-style video streaming platform built entirely with **HTML5, CSS3, and Vanilla JavaScript (ES6+)**. Fully functional with client-side **LocalStorage** persistence, custom HTML5 video controls, dynamic playlist management, category editor, data backup/restore, and a dark/light theme engine.

![VELPLAY Banner](https://storage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg)

---

## ✨ Features

### 1. 🎥 Advanced Custom Video Player
- Custom responsive controls with auto-hiding (3s inactivity timer).
- Draggable seek bar with hover timestamp tooltips and buffered range indicators.
- Smooth volume slider and one-click mute/unmute.
- **Playback Speeds**: `0.25x`, `0.5x`, `0.75x`, `1x (Normal)`, `1.25x`, `1.5x`, `1.75x`, `2x`.
- **Theatre Mode** and **Fullscreen Mode** (HTML5 Fullscreen API).
- **Previous & Next Video** navigation controls with playlist/queue looping.
- **Autoplay Toggle** with 3-second countdown toast on completion.
- **Keyboard Shortcuts**:
  - `Space` / `K`: Play / Pause
  - `Left` / `Right` Arrow (`J` / `L`): Seek backward / forward 10 seconds
  - `Up` / `Down` Arrow: Volume up / down 10%
  - `M`: Mute / Unmute
  - `F`: Fullscreen mode
  - `T`: Theatre mode

### 2. 📜 Watch History & Continue Watching
- Automatically tracks watch positions and progress percentages.
- **Continue Watching** carousel on the homepage with live progress indicators.
- Automatic playback resume from the last saved second.
- History management view with single-video removal and clear-all confirmation.

### 3. ❤️ Favorites & Custom Playlists
- Instant one-tap video bookmarking to Favorites.
- Create and organize custom playlists with titles and descriptions.
- **Direct Video Addition**: Add videos to playlists directly from the playlist detail view.
- Reorder videos up/down or remove videos with live UI updates.

### 4. 🏷️ Category Management (Admin)
- Dynamically manage categories in the Admin Panel (`#/admin`):
  - **Add Category**: Create custom content categories.
  - **Rename Category**: Renames the category and automatically migrates all associated videos.
  - **Delete Category**: Safely deletes categories and reassigns affected videos.
- Automatically updates homepage filter chips, search filters, and sidebar links.

### 5. 💾 Platform Backup & Restore (JSON Export / Import)
- **Export Backup**: Download your entire VELPLAY library, categories, playlists, history, and preferences as `velplay-backup.json`.
- **Import Backup**: Upload and restore previous backups with JSON validation and confirmation dialogs.
- Accessible from both the topbar header and the Admin Dashboard.

### 6. 🌓 Dark & Light Theme System
- Complete CSS variable design system for both dark and light modes.
- Restores user theme preferences automatically on startup.
- Dynamic theme switcher button in the topbar navigation.

### 7. ⚙️ Admin Content Management (CRUD)
- Password-protected management dashboard (default password: `velplay2024`).
- Add, edit, and delete videos with confirmation dialogs.
- Supports both **remote video URLs** and **local video/image uploads** (via `URL.createObjectURL` and `FileReader`).

---

## 🚀 Getting Started

### Local Setup
No build tools or npm dependencies required! Simply open `index.html` in any modern web browser:

```bash
# Clone the repository
git clone https://github.com/meerrahil321/velplay.git

# Navigate into the project
cd velplay

# Start a local static server
python3 -m http.server 8080
# or
npx serve .
```

Visit `http://localhost:8080` in your browser.

---

## 🛠️ Tech Stack
- **HTML5**: Semantic tags, HTML5 Video API, Fullscreen API
- **CSS3**: CSS Custom Properties (Variables), Flexbox, CSS Grid, Media Queries
- **JavaScript**: Pure Vanilla ES6+ (No external frameworks or libraries)
- **Storage**: Browser `localStorage` & `sessionStorage`

---

## 📄 License
MIT License. Open source and free to use!
