# VidPlay Interactive Video Player

A professional, highly customizable interactive video player with hotspots, sections, and advanced playback controls. Designed for seamless integration into larger projects with unique namespacing to prevent conflicts.

## 🎯 Features

- **Interactive Hotspots**: Clickable areas that appear at specific video timestamps
- **Section-based Navigation**: Jump to predefined video sections with visual indicators
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Keyboard Shortcuts**: Full keyboard control support
- **Progress Bar**: Visual progress tracking with time tooltips
- **Fullscreen Support**: Native fullscreen functionality
- **Performance Optimized**: Hardware acceleration and efficient DOM updates
- **Accessibility**: Screen reader friendly with proper ARIA labels
- **Conflict-Free**: All identifiers prefixed with `vidplay-` for safe integration

## 📁 Project Structure

```
vidplay/
├── README.md                  # This documentation
├── INTEGRATION.md            # Integration guide for developers               # API reference and configuration
├── vidplay-index.html       # Example HTML implementation
├── vidplay-styles.css       # Complete CSS styles
├── vidplay-script.js        # Core JavaScript functionality
└── video/                   # Video assets directory
    └── Colliers-Presentation-FullVideo.mp4
```

## 🚀 Quick Start

### Basic Implementation

1. **Include the required files** in your HTML:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Your Project</title>
    <link rel="stylesheet" href="path/to/vidplay-styles.css" />
  </head>
  <body>
    <!-- Your existing content -->

    <!-- VidPlay Container -->
    <div class="vidplay-video-wrapper" id="vidplayVideoWrapper">
      <video
        class="vidplay-video-player"
        id="vidplayMainVideo"
        preload="metadata"
        muted
        playsinline
        crossorigin="anonymous"
      >
        <source src="path/to/your/video.mp4" type="video/mp4" />
        Your browser doesn't support HTML5 video.
      </video>

      <!-- Interactive Elements -->
      <div class="vidplay-hotspots-layer"></div>
      <div class="vidplay-play-overlay" id="vidplayPlayOverlay">
        <button class="vidplay-play-button" id="vidplayPlayButton">
          <span class="vidplay-play-button-icon">▶</span>
        </button>
      </div>
      <div class="vidplay-play-indicator" id="vidplayPlayIndicator">▶</div>
      <div class="vidplay-loader" id="vidplayLoader"></div>
      <div class="vidplay-status-toast" id="vidplayStatusToast"></div>

      <!-- Section Indicator -->
      <div class="vidplay-section-indicator" id="vidplaySectionIndicator">
        <span class="vidplay-section-icon"></span>
        <span class="vidplay-section-name"></span>
      </div>

      <!-- Progress Bar -->
      <div class="vidplay-progress-track" id="vidplayProgressTrack">
        <div class="vidplay-progress-fill" id="vidplayProgressFill"></div>
        <div class="vidplay-time-tooltip" id="vidplayTimeTooltip">00:00</div>
      </div>

      <!-- Controls -->
      <div class="vidplay-video-controls">
        <button class="vidplay-control-btn" id="vidplayNextSectionBtn">
          ⏭️
        </button>
        <button class="vidplay-control-btn" id="vidplayReplayBtn">🔄</button>
        <button class="vidplay-control-btn" id="vidplayMuteBtn">🔊</button>
        <button class="vidplay-control-btn" id="vidplayFullscreenBtn">⛶</button>
      </div>

      <!-- Menu -->
      <button class="vidplay-menu-btn" id="vidplayMenuToggle">☰</button>
      <div class="vidplay-sections-menu" id="vidplaySectionsMenu">
        <div class="vidplay-menu-header">
          <h3>Video Sections</h3>
          <button class="vidplay-close-menu" id="vidplayCloseMenu">✕</button>
        </div>
        <div class="vidplay-section-list"></div>
      </div>
    </div>

    <script src="path/to/vidplay-script.js"></script>
  </body>
</html>
```

2. **Configure your video sections** by editing the `VIDPLAY_VIDEO_CONFIG` object in `vidplay-script.js`:

```javascript
const VIDPLAY_VIDEO_CONFIG = {
  sections: [
    { name: "Introduction", start: 0, end: 10, icon: "🎬" },
    { name: "Main Content", start: 10, end: 30, icon: "📋" },
    { name: "Conclusion", start: 30, end: 45, icon: "🎯" },
  ],
  hideIntervals: [
    { start: 15, end: 20 }, // Hide hotspots during these times
  ],
};
```

3. **Access the player instance**:

```javascript
// Wait for player to initialize
document.addEventListener("DOMContentLoaded", () => {
  const player = window.vidplayVideoPlayer;

  // Player is ready to use
  console.log("VidPlay ready:", player);
});
```

## ⚙️ Configuration

### Video Sections

Define interactive sections in your video:

```javascript
const VIDPLAY_VIDEO_CONFIG = {
  sections: [
    {
      name: "Section Name", // Display name
      start: 0, // Start time in seconds
      end: 10, // End time in seconds
      icon: "🎬", // Emoji icon for display
    },
  ],
  hideIntervals: [
    {
      start: 5, // Hide hotspots from 5 seconds
      end: 8, // to 8 seconds
    },
  ],
};
```

### Hotspot Positioning

Hotspot positions are defined in CSS custom properties in `vidplay-styles.css`:

```css
:root {
  --vidplay-hotspot-1-top: 30%;
  --vidplay-hotspot-1-left: 29%;
  --vidplay-hotspot-2-top: 34%;
  --vidplay-hotspot-2-left: 46%;
  /* Add more hotspot positions as needed */
}
```

## 🎮 Keyboard Shortcuts

| Key     | Action                |
| ------- | --------------------- |
| `Space` | Play/Pause            |
| `F`     | Toggle Fullscreen     |
| `M`     | Toggle Mute           |
| `R`     | Replay from beginning |
| `N`     | Next Section          |
| `←`     | Seek backward 10s     |
| `→`     | Seek forward 10s      |
| `↑`     | Seek forward 30s      |
| `↓`     | Seek backward 30s     |
| `Tab`   | Toggle sections menu  |
| `Esc`   | Close sections menu   |

## 📱 Mobile Support

The player is fully responsive and supports:

- Touch controls for progress seeking
- Mobile-optimized tooltips
- Adaptive button sizing
- Hardware acceleration
- iOS/Safari compatibility

## 🔧 Browser Support

- **Modern Browsers**: Chrome 60+, Firefox 55+, Safari 12+, Edge 79+
- **Mobile**: iOS Safari 12+, Chrome Mobile 60+
- **Features**: HTML5 Video, CSS Grid, ES6 Classes

## 🎨 Customization

### Styling

All styles use the `vidplay-` prefix and can be customized:

```css
/* Customize colors */
.vidplay-video-wrapper {
  background: your-color;
}

/* Customize hotspot appearance */
.vidplay-hotspot {
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
}
```

### JavaScript API

Access player methods:

```javascript
const player = window.vidplayVideoPlayer;

// Control playback
player.video.play();
player.video.pause();

// Jump to section
player.playSection(elementWithDataAttributes);

// Show status message
player.showStatus("Custom message", 3000);
```

## 🚨 Important Notes

1. **Namespace**: All CSS classes and IDs use `vidplay-` prefix
2. **Global Variable**: Player instance available at `window.vidplayVideoPlayer`
3. **Dependencies**: No external dependencies required
4. **Video Formats**: Supports MP4, WebM, and other HTML5 video formats

## 🐛 Troubleshooting

### Common Issues

1. **Video not loading**: Check file path and server MIME types
2. **Hotspots not appearing**: Verify section timing in `VIDPLAY_VIDEO_CONFIG`
3. **Styling conflicts**: Ensure CSS specificity and check for overwrites
4. **Mobile playback**: Add `playsinline` and `muted` attributes

### Debug Mode

Enable console logging by adding to your configuration:

```javascript
// Add after player initialization
const player = window.vidplayVideoPlayer;
player.video.addEventListener("timeupdate", () => {
  console.log("Current time:", player.video.currentTime);
});
```
