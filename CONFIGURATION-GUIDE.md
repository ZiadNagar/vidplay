# Video Player Configuration Guide

## Quick Setup for New Videos

When you receive a new video from your client, you only need to update the configuration in one place to make everything work correctly.

### Step 1: Replace the Video File

1. Place your new video file in the `./video/` folder
2. Update the video source in `enhanced-player.html` if the filename changed

### Step 2: Update Video Configuration

Edit the `VIDEO_CONFIG` object at the top of `enhanced-player.html` (or use the separate `video-config.js` file):

```javascript
const VIDEO_CONFIG = {
  sections: [
    { name: "Section Name", start: 0, end: 30, icon: "🎬" },
    { name: "Another Section", start: 30, end: 60, icon: "⭐" },
    // Add more sections as needed
  ],
  hideIntervals: [
    { start: 25, end: 32 }, // Hide hotspots during transitions
  ],
  menuAvailableOffset: 1.2, // Menu appears 1.2s before first section
};
```

### Section Properties:

- **name**: Display name for the section
- **start**: Start time in seconds (can use decimals like 4.5)
- **end**: End time in seconds
- **icon**: Emoji icon to display (see available icons below)

### Hide Intervals:

Use `hideIntervals` to hide hotspots during specific time ranges:

- Transitions between sections
- Credits or text overlays
- Any time when hotspots would be distracting

### Available Icons:

💰 🚚 📦 👷 🛠️ 🎬 ⭐ 💡 📞 🏠 🔧 📊 📈 💼 🎯 ⚡ 🚀 🎨 📱 💻 🌟 🔥 ✨ 🎪 🎭

## What Happens Automatically:

✅ **Hotspots are generated** - Interactive buttons appear on the video at configured positions
✅ **Menu sections are created** - Dropdown menu shows all sections with proper timings  
✅ **Navigation works** - Next section button automatically finds the correct next section
✅ **Timing calculations** - All show/hide logic uses your configured timings
✅ **Validation** - Configuration is validated on load with helpful error messages

## Example Configurations:

### Short Tutorial Video (90 seconds):

```javascript
const VIDEO_CONFIG = {
  sections: [
    { name: "Introduction", start: 0, end: 15, icon: "🎬" },
    { name: "Features", start: 15, end: 45, icon: "⭐" },
    { name: "Demo", start: 45, end: 75, icon: "💻" },
    { name: "Conclusion", start: 75, end: 90, icon: "🎯" },
  ],
  hideIntervals: [],
  menuAvailableOffset: 1.0,
};
```

### Long Presentation (5 minutes):

```javascript
const VIDEO_CONFIG = {
  sections: [
    { name: "Overview", start: 10, end: 60, icon: "📊" },
    { name: "Solution A", start: 60, end: 120, icon: "⚡" },
    { name: "Solution B", start: 120, end: 180, icon: "🚀" },
    { name: "Benefits", start: 180, end: 240, icon: "💡" },
    { name: "Next Steps", start: 240, end: 300, icon: "📞" },
  ],
  hideIntervals: [
    { start: 55, end: 65 }, // Hide during transition
    { start: 235, end: 245 }, // Hide during outro
  ],
  menuAvailableOffset: 2.0,
};
```

## Debugging:

Open browser console to see:

- Configuration validation results
- Section summary information
- Any timing conflicts or errors

The system will automatically log helpful information about your configuration when the page loads.

## Need Help?

If you encounter issues:

1. Check the browser console for error messages
2. Verify all section timings are valid (start < end)
3. Ensure no sections overlap unexpectedly
4. Test with a simple 2-3 section configuration first

The player will work with any number of sections and automatically adjust all functionality based on your configuration!
