# Interactive Video Player with Clickable Regions

A sophisticated HTML5 video player featuring interactive clickable regions, smart visibility controls, and comprehensive mobile support. This project creates an engaging video experience by overlaying interactive elements that allow users to jump to specific sections of the video.

## 📁 Project Structure

```
js-video-player/
├── enhanced-player.html     # Main HTML file with embedded CSS and JavaScript
├── basic-player.html        # Basic version (if exists)
├── README.md               # This documentation file
└── video/
    └── Colliers-Presentation-FullVideo.mp4  # Main video file
```

## 🎯 Project Overview

This interactive video player is designed for business presentations and educational content where users need to navigate to specific sections quickly. The player overlays clickable regions on the video that appear and disappear intelligently based on the video timeline and user interactions.

### Key Features

- **Smart Clickable Regions**: Interactive hotspots that appear over specific video content
- **Time-Based Visibility**: Regions show/hide based on video timeline and context
- **Overlay Menu**: Secondary navigation method for all video sections
- **Full Responsive Design**: Works seamlessly across desktop, tablet, and mobile
- **Fullscreen Support**: Maintains region positioning in fullscreen mode
- **Keyboard Controls**: Complete keyboard navigation support
- **Touch/Mobile Optimized**: Gesture support and mobile-friendly interface

## 🏗️ Architecture Overview

### 1. HTML Structure

The HTML follows a hierarchical structure:

```html
<div class="video-container">
  <video id="video">
    <!-- Main video element -->
    <div class="regions-container">
      <!-- Container for clickable regions -->
      <div class="video-region">
        <!-- Individual clickable regions -->
        <div class="overlay-menu">
          <!-- Alternative navigation menu -->
          <div class="progress-container">
            <!-- Custom progress bar -->
            <button class="control-button">
              <!-- Control buttons -->
              <div class="status-indicators"><!-- UI feedback elements --></div>
            </button>
          </div>
        </div>
      </div>
    </div>
  </video>
</div>
```

### 2. CSS Architecture

The CSS is organized into logical sections:

- **Global Styles**: Reset, typography, and layout foundation
- **Video Container**: Main container and video element styling
- **Clickable Regions**: Interactive hotspot styling and positioning
- **Fullscreen Compatibility**: Ensures consistent behavior across screen modes
- **Control Elements**: Buttons, menus, and UI components
- **Animations**: Smooth transitions and visual feedback
- **Responsive Design**: Breakpoints for different screen sizes

### 3. JavaScript Architecture

The JavaScript uses a class-based approach with the `InteractiveVideoPlayer` class:

```javascript
class InteractiveVideoPlayer {
  constructor()              // Initialize player and setup
  initializeEventListeners() // Setup all event handlers
  setupKeyboardControls()    // Keyboard shortcut configuration
  setupFullscreenSupport()   // Fullscreen API handling
  // ... additional methods for functionality
}
```

## 🎬 Video Section Configuration

The player is configured with 5 distinct video sections:

| Section              | Time Range    | Icon | Description                 |
| -------------------- | ------------- | ---- | --------------------------- |
| Rent Services        | 4.5s - 15s    | 💰   | Rental and leasing services |
| Transportation       | 15s - 22.6s   | 🚚   | Transport and logistics     |
| Inventory Management | 23.1s - 32.8s | 📦   | Inventory and storage       |
| Labor Solutions      | 32.9s - 50s   | 👷   | Workforce and labor         |
| Other Services       | 50s - 59s     | 🛠️   | Additional services         |

### Region Positioning

Regions are positioned using fixed percentages for consistency:

```css
.region-rent {
  top: 46%;
  left: 35%;
}
.region-transportation {
  top: 48%;
  left: 51%;
}
.region-inventory {
  top: 51%;
  left: 65%;
}
.region-labor {
  top: 53%;
  left: 73%;
}
.region-other {
  top: 55%;
  left: 78%;
}
```

## 🧩 Core Components Breakdown

### 1. Video Element (`<video>`)

```html
<video id="video" preload="metadata" autoplay muted playsinline>
  <source src="video/Colliers-Presentation-FullVideo.mp4" type="video/mp4" />
</video>
```

**Features:**

- Autoplay with mute for better browser compatibility
- `playsinline` for iOS compatibility
- Metadata preloading for faster startup

### 2. Clickable Regions System

Each region is a positioned div with:

```html
<div
  class="video-region region-rent"
  onclick="playPeriod(4.5, 15, 'Rent')"
  title="Click to play Rent section"
>
  <span class="region-icon">💰</span>
  <span class="region-title">Rent</span>
  <span class="region-duration">4.5s - 15s</span>
</div>
```

**Styling Features:**

- Semi-transparent background with blur effect
- Hover animations and visual feedback
- Breathing and pulse animations for attention
- Click ripple effects

### 3. Smart Visibility Logic

The `updateRegionVisibility()` method implements complex logic:

```javascript
updateRegionVisibility() {
  const currentTime = this.video.currentTime;
  const hideIntervals = [
    { start: 25.5, end: 31.5 },
    { start: 46.5, end: 52.5 },
    { start: 56, end: 59 }
  ];

  // Complex logic for when to show/hide regions
  const shouldShowRegions = !isInHideInterval && (
    (this.video.paused && isInPeriodTime && !this.isPlayingPeriod) ||
    (this.video.paused && this.isPlayingPeriod) ||
    (normalConditions)
  );
}
```

**Visibility Rules:**

- Show regions when video is paused during relevant sections
- Hide during specific "blackout" intervals
- Show during normal playback after initial period
- Never show during designated hide intervals

### 4. Overlay Menu System

Alternative navigation accessible via hamburger menu:

```html
<div class="overlay-menu" id="overlayMenu">
  <div class="menu-header">
    <span class="menu-title">Video Sections</span>
    <button class="menu-close">✕</button>
  </div>
  <div class="menu-buttons">
    <!-- Menu items for each section -->
  </div>
</div>
```

**Features:**

- Appears after initial video period (3.3 seconds)
- Smooth slide-in animation
- Keyboard navigation support
- Click-outside-to-close functionality

### 5. Progress Bar Component

Custom progress bar with hover tooltips:

```html
<div class="progress-container">
  <div class="progress-bar">
    <div class="progress-scrubber"></div>
  </div>
  <div class="progress-tooltip">00:00</div>
</div>
```

**Features:**

- Click-to-seek functionality
- Hover tooltips showing time
- Touch/mobile support
- Visual scrubber handle

### 6. Control Buttons

Three main control buttons:

```html
<button class="control-button fullscreen-button">⛶</button>
<button class="control-button mute-button">🔊</button>
<button class="control-button replay-button">🔄</button>
```

**Functionality:**

- Fullscreen toggle with cross-browser support
- Mute/unmute with visual indicator updates
- Replay from beginning with state reset

## 🎮 User Interaction Flow

### 1. Initial Load

1. Video starts playing automatically (muted)
2. No regions visible during intro (0-3.3s)
3. Menu toggle appears at 3.3 seconds

### 2. Normal Playback

1. Regions appear after intro period
2. Regions animate in with staggered timing
3. User can click regions to jump to sections
4. Regions hide during specific intervals

### 3. Section Playback

1. User clicks region or menu item
2. Video jumps to section start
3. Plays until section end, then pauses
4. Regions reappear for next interaction

### 4. Pause Interactions

1. When paused during a section, relevant regions appear
2. User can navigate to other sections
3. Regions provide visual feedback for available actions

## 📱 Responsive Design Strategy

### Breakpoint System

1. **Desktop** (>768px): Full feature set
2. **Tablet** (≤768px): Reduced region sizes, adjusted menu
3. **Mobile** (≤480px): Repositioned regions, smaller controls
4. **Small Mobile** (≤320px): Minimal interface

### Mobile Optimizations

- Touch-friendly region sizes (minimum 44px)
- Adjusted positioning for vertical screens
- Gesture support (double-tap for fullscreen)
- Optimized animations (slower for mobile)

### Fullscreen Compatibility

Special handling for fullscreen mode:

```css
.video-container:fullscreen .region-rent {
  top: 46% !important;
  left: 35% !important;
}
```

## ⌨️ Keyboard Controls

| Key     | Action                |
| ------- | --------------------- |
| `Space` | Play/Pause toggle     |
| `F`     | Fullscreen toggle     |
| `M`     | Mute/Unmute           |
| `R`     | Replay from beginning |
| `←`     | Seek backward 10s     |
| `→`     | Seek forward 10s      |
| `↑`     | Seek forward 30s      |
| `↓`     | Seek backward 30s     |
| `Tab`   | Toggle overlay menu   |
| `Esc`   | Close overlay menu    |

## 🎨 Visual Design Elements

### Color Scheme

- **Primary**: Blue gradient (`#1e3c72` to `#2a5298`)
- **Accent**: Semi-transparent white overlays
- **Text**: High contrast white with transparency levels

### Animations

- **Breathing**: Gentle scale animation for regions
- **Pulse Ring**: Expanding ring effect for attention
- **Icon Bounce**: Subtle bounce for icons
- **Click Ripple**: Feedback on interaction
- **Entrance Pulse**: Initial appearance animation

### Typography

- **Font Stack**: System fonts for optimal loading
- **Hierarchy**: Clear size and weight distinctions
- **Accessibility**: High contrast and readable sizes

## 🔧 Technical Implementation Details

### State Management

The player maintains several state variables:

```javascript
this.stopTime = null; // When to stop current playback
this.isFullscreen = false; // Fullscreen state
this.isDragging = false; // Progress bar interaction
this.isInitialAutoplay = true; // First play detection
this.isPlayingPeriod = false; // Section playback mode
this.isMenuOpen = false; // Menu visibility state
```

### Event Handling Strategy

1. **Video Events**: Time updates, play/pause, loading states
2. **User Interactions**: Clicks, keyboard, touch gestures
3. **Window Events**: Resize, orientation change, fullscreen
4. **Menu Events**: Open/close, navigation, focus management

### Performance Optimizations

- Efficient DOM queries with cached references
- Throttled resize handlers
- Optimized animation using CSS transforms
- Minimal reflows and repaints

## 🚀 Getting Started

### Prerequisites

- Modern web browser with HTML5 video support
- Local web server (for file protocol restrictions)

### Installation

1. **Clone or download** the project files
2. **Place your video** in the `video/` directory
3. **Update video source** in the HTML if using different file
4. **Serve via web server** (not file:// protocol)

### Basic Setup

```bash
# Using Python's built-in server
python -m http.server 8000

# Using Node.js http-server
npx http-server

# Then navigate to:
# http://localhost:8000/enhanced-player.html
```

### Customization

#### Changing Video Sections

Modify the `videoPeriods` array in the JavaScript:

```javascript
this.videoPeriods = [
  {
    start: 4.5,
    end: 15,
    name: "Your Section Name",
    regionClass: "region-custom",
  },
  // Add more sections...
];
```

#### Adjusting Region Positions

Update CSS positioning:

```css
.region-custom {
  top: 50%; /* Vertical position */
  left: 60%; /* Horizontal position */
}
```

#### Styling Customization

Modify CSS variables or create theme variants:

```css
:root {
  --primary-color: #1e3c72;
  --accent-color: rgba(255, 255, 255, 0.1);
  --text-color: rgba(255, 255, 255, 0.9);
}
```

## 🐛 Troubleshooting

### Common Issues

1. **Video not playing**: Check file path and server setup
2. **Regions not appearing**: Verify time ranges and visibility logic
3. **Fullscreen issues**: Check browser compatibility
4. **Mobile performance**: Reduce animation complexity

### Browser Compatibility

- **Chrome**: Full support
- **Firefox**: Full support
- **Safari**: Full support (may need playsinline)
- **Edge**: Full support
- **Mobile browsers**: Optimized support

## 🔮 Future Enhancements

### Potential Features

- **Multiple video sources** for different quality levels
- **Subtitle/caption support** with synchronized regions
- **Analytics integration** for user interaction tracking
- **A/B testing framework** for different layouts
- **Accessibility improvements** with screen reader support
- **Custom skin/theme system** for different branding

### Technical Improvements

- **WebAssembly integration** for advanced video processing
- **Service Worker caching** for offline capabilities
- **Module system** for better code organization
- **TypeScript migration** for better type safety

## 📄 License

This project is available for educational and commercial use. Please respect any video content licensing requirements.

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test across different devices
5. Submit a pull request

---

**Created with ❤️ for interactive video experiences**

- **Section-based Navigation**: Jump directly to predefined video sections
- **Custom Video Controls**: Play, pause, mute, fullscreen, and replay functionality
- **Progress Bar with Seeking**: Click or drag to navigate through the video
- **Time Display**: Current time and total duration indicator
- **Loading States**: Visual feedback during video loading

### User Experience Enhancements

- **Smooth Animations**: CSS3-powered hover effects and transitions
- **Visual Feedback**: Play/pause indicators and status messages
- **Keyboard Shortcuts**: Space, arrow keys, and letter shortcuts for control
- **Mobile Support**: Touch gestures and responsive design
- **Fullscreen Mode**: Double-click or button to enter fullscreen

### Advanced Features

- **Smart Region Visibility**: Icons appear/disappear based on video timeline
- **Period Playback**: Play specific sections and auto-pause at the end
- **Responsive Design**: Adapts to different screen sizes and orientations
- **Accessibility**: ARIA labels and keyboard navigation support

## User Controls

### Mouse/Touch Controls

- **Click Video**: Play/pause toggle
- **Double-click Video**: Enter/exit fullscreen
- **Click Menu Button**: Open overlay menu with video sections
- **Click Region Icons**: Jump to specific video sections
- **Click Progress Bar**: Seek to specific time
- **Hover Progress Bar**: Preview time at cursor position
- **Click Outside Menu**: Close overlay menu

### Keyboard Shortcuts

- **Spacebar**: Play/pause
- **Tab**: Toggle overlay menu
- **Escape**: Close overlay menu
- **F**: Toggle fullscreen
- **M**: Toggle mute
- **R**: Replay from beginning
- **← / →**: Skip backward/forward 10 seconds
- **↑ / ↓**: Skip forward/backward 30 seconds
- **. / ,**: Frame-by-frame navigation

## Technical Implementation

### Architecture Overview

The project is built using a class-based JavaScript architecture with the `InteractiveVideoPlayer` class managing all functionality:

```javascript
class InteractiveVideoPlayer {
  constructor() {
    // DOM element references
    // Player state variables
    // Video section definitions
    // Initialize components
  }
}
```

### Key Components

#### 1. Video Timeline Management

```javascript
this.videoPeriods = [
  { start: 4.5, end: 15, name: "Rent Services", regionClass: "region-rent" },
  {
    start: 15,
    end: 22.6,
    name: "Transportation",
    regionClass: "region-transportation",
  },
  // ... more sections
];
```

#### 2. Region Visibility Logic

The player intelligently shows/hides clickable regions based on:

- Current video time
- Playback state (playing specific period vs. free navigation)
- Predefined hide intervals to avoid overlapping with video content

#### 3. State Management

```javascript
// Key state variables
this.stopTime = null; // End time for period playback
this.isPlayingPeriod = false; // Currently playing a specific section
this.isFullscreen = false; // Fullscreen mode state
this.isDragging = false; // Progress bar interaction state
```

### CSS Animation System

The project uses a sophisticated CSS animation system:

#### Region Animations

- **Breathing Effect**: Subtle scale animation to draw attention
- **Pulse Ring**: Expanding ring effect around regions
- **Icon Bounce**: Gentle bounce animation for visual appeal
- **Staggered Entrance**: Sequential appearance with delays
- **Hover Effects**: Scale and glow transformations
- **Click Ripple**: Visual feedback for interactions

### Performance Optimizations

- Hardware-accelerated transforms using CSS transforms
- Efficient CSS transitions with cubic-bezier timing functions
- Reduced animations on mobile devices for better performance

## Styling Architecture

### CSS Organization

1. **Global Styles & Reset**: Base styling and normalization
2. **Video Container & Player**: Core video element styling
3. **Clickable Regions**: Interactive hotspot styling and animations
4. **Control Buttons**: UI control styling
5. **UI Overlays & Indicators**: Status messages and feedback
6. **Progress Bar & Controls**: Seeking and time display
7. **Responsive Design**: Mobile and tablet adaptations

### Design Principles

- **Modern UI**: Semi-transparent elements with backdrop blur effects
- **Consistent Spacing**: Uniform padding and margins throughout
- **Color Harmony**: Blue gradient theme with white accents
- **Accessibility**: High contrast ratios and clear focus states

## Responsive Design

### Comprehensive Breakpoint Coverage

The video player now supports all possible device dimensions with optimized layouts:

#### Mobile Devices

- **Ultra-small phones**: 320px - 374px (iPhone SE, older Android)
- **Small phones**: 375px - 424px (iPhone 12 mini, standard smartphones)
- **Large phones**: 425px - 767px (iPhone Pro Max, large Android phones)

#### Tablets & Convertibles

- **Small tablets**: 768px - 1023px (iPad Mini, 7-8" tablets)
- **Large tablets**: 1024px - 1199px (iPad Pro, Surface tablets)
- **Foldable devices**: Variable dimensions with orientation detection

#### Desktop & Monitors

- **Small desktop**: 1200px - 1439px (13-15" laptops)
- **Medium desktop**: 1440px - 1919px (Standard monitors, MacBook Pro)
- **Large desktop**: 1920px - 2559px (Full HD, QHD displays)
- **Ultra-wide**: 2560px+ (4K, ultra-wide monitors)

### Advanced Responsive Features

#### Adaptive Layouts

- **Region positioning**: Automatically repositions clickable regions based on screen size
- **Menu sizing**: Overlay menu adapts to available screen space
- **Control scaling**: All interactive elements scale appropriately

#### Performance Optimizations

- **Reduced animations**: Disables complex animations on small/slow devices
- **Touch optimization**: 44px minimum touch targets for accessibility
- **Memory management**: Optimized for various device capabilities

#### Device-Specific Enhancements

- **iOS optimizations**: Safe area handling, playsinline fixes
- **Android enhancements**: Back button handling, Chrome-specific fixes
- **High-DPI displays**: Crisp rendering on Retina and high-resolution screens

#### Accessibility & Preferences

- **Reduced motion**: Respects user's motion preferences
- **High contrast**: Enhanced visibility for accessibility needs
- **Dark mode**: Automatic adaptation to system color scheme
- **Touch vs. mouse**: Different interactions for touch and pointer devices

### Orientation & Aspect Ratio Support

- **Portrait tablets**: Optimized layout for vertical orientation
- **Landscape mobile**: Compact layout for horizontal viewing
- **Foldable devices**: Handles various aspect ratios and screen configurations
- **Ultra-wide displays**: Maximizes content area while maintaining usability

## Getting Started

### Prerequisites

- Modern web browser with HTML5 video support
- Web server for proper video loading (recommended)

### Installation

1. Clone or download the project files
2. Place your video file in the `video/` directory
3. Update the video source path in the HTML file
4. Serve the files through a web server

### Basic Usage

```html
<!-- Minimal setup -->
<video id="video" preload="metadata" autoplay muted playsinline>
  <source src="your-video.mp4" type="video/mp4" />
</video>
```

### Customization

#### Adding New Video Sections

Update the `videoPeriods` array in the JavaScript:

```javascript
this.videoPeriods = [
  {
    start: 10.5,
    end: 25.3,
    name: "Your Section Name",
    regionClass: "region-your-section",
  },
];
```

#### Positioning Regions

Modify CSS positioning for region classes:

```css
.region-your-section {
  top: 30%;
  left: 40%;
  animation-delay: 0.8s;
}
```

#### Styling Customization

- Colors: Update CSS custom properties
- Animations: Modify keyframe animations
- Layout: Adjust positioning and sizing
- Icons: Change emoji or use custom SVG icons

## Configuration Options

### Video Settings

- `preload`: "metadata" for faster initial loading
- `autoplay`: Enabled with muted for browser compatibility
- `playsinline`: Mobile Safari compatibility

### Region Configuration

- **Position**: CSS top/left/right/bottom properties
- **Timing**: Show/hide based on video timeline
- **Animation**: Customizable entrance and hover effects
- **Content**: Icons, titles, and duration text

### Player Behavior

- **Auto-pause**: Sections automatically pause at the end
- **Smart visibility**: Regions hide during irrelevant content
- **Keyboard shortcuts**: Fully customizable key bindings

## Troubleshooting

### Common Issues

#### Video Not Loading

- Ensure video file path is correct
- Use a web server instead of file:// protocol
- Check video format compatibility

#### Regions Not Appearing

- Verify video timeline matches region timing
- Check CSS positioning values
- Ensure JavaScript is enabled

#### Mobile Issues

- Test touch events on actual devices
- Verify viewport meta tag is present
- Check for iOS Safari specific issues

### Browser Compatibility

- **Modern Browsers**: Chrome 60+, Firefox 55+, Safari 11+, Edge 79+
- **Mobile**: iOS Safari 11+, Chrome Mobile 60+
- **Features**: Some features may degrade gracefully in older browsers

## Contributing

### Development Guidelines

1. Maintain consistent code formatting
2. Add comments for complex logic
3. Test on multiple devices and browsers
4. Follow accessibility best practices
5. Optimize for performance
