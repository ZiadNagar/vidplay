## Project Overview

This project provides an enhanced video viewing experience for presentation or educational content by overlaying clickable hotspots on the video that allow users to navigate directly to specific sections or topics within the video.

## Features

### Core Functionality

- **Interactive Clickable Regions**: Hoverable hotspots that appear at specific times
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
- **Click Region Icons**: Jump to specific video sections
- **Click Progress Bar**: Seek to specific time
- **Hover Progress Bar**: Preview time at cursor position

### Keyboard Shortcuts

- **Space-bar**: Play/pause
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

### Breakpoints

- **Desktop**: > 768px - Full feature set
- **Tablet**: 768px - 480px - Adjusted sizing
- **Mobile**: < 480px - Repositioned regions and simplified animations

### Mobile Optimizations

- Touch-friendly button sizes (minimum 44px)
- Repositioned regions for better thumb access
- Reduced animation complexity for performance
- Orientation change handling
- Touch gesture support

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

### Future Enhancements

- [ ] Subtitle/caption support
- [ ] Multiple video quality options
- [ ] Analytics integration
- [ ] Custom theme support
- [ ] Video playlist functionality
- [ ] Advanced seeking with thumbnail previews
