# VidPlay Integration Guide

This guide provides detailed instructions for integrating the VidPlay Interactive Video Player into your larger project.

- Basic knowledge of HTML, CSS, and JavaScript
- Modern web browser with ES6 support
- Web server (for testing video playback)

## 🛠️ Installation

### Step 1: Copy Required Files

Copy these files to your project directory:

```text
your-project/
│── videos/
│  └── Colliers-Presentation-FullVideo.mp4
│── vidplay-styles.css
│── vidplay-script.js
└── vidplay-index.html
```

### Step 2: Include Styles

Add the CSS file to your HTML `<head>` section:

```html
<head>
  <!-- Your existing meta tags and styles -->
  <link rel="stylesheet" href="./vidplay-styles.css" />
</head>
```

### Step 3: Add HTML Structure

Insert the video player HTML structure where you want it to appear:

```html
<div class="vidplay-video-wrapper" id="vidplayVideoWrapper">
  <!-- Core video element -->
  <video
    class="vidplay-video-player"
    id="vidplayMainVideo"
    preload="metadata"
    muted
    playsinline
    crossorigin="anonymous"
  >
    <source src="assets/videos/your-video.mp4" type="video/mp4" />
    Your browser doesn't support HTML5 video.
  </video>

  <!-- Interactive elements (copy from vidplay-index.html) -->
  <div class="vidplay-hotspots-layer"></div>
  <!-- ... rest of the structure ... -->
</div>
```

### Step 4: Include JavaScript

Add the script before the closing `</body>` tag:

```html
<script src="./vidplay-script.js"></script>
```
