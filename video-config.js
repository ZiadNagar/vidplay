// =================================================================================
// VIDEO CONFIGURATION FILE
// =================================================================================
/*
INSTRUCTIONS FOR UPDATING VIDEO SECTIONS:

When you receive a new video from your client, follow these steps:

1. Replace the video file in the ./video/ folder
2. Update the sections array below with the new timings in seconds
3. Update hideIntervals if there are specific times when hotspots should be hidden
4. Adjust menuAvailableOffset if needed (when menu should appear)

EXAMPLE for a 120-second video with 4 sections:

const VIDEO_CONFIG = {
  sections: [
    { name: "Introduction", start: 0, end: 30, icon: "🎬" },
    { name: "Features", start: 30, end: 70, icon: "⭐" },
    { name: "Benefits", start: 70, end: 100, icon: "💡" },
    { name: "Contact", start: 100, end: 120, icon: "📞" },
  ],
  hideIntervals: [
    { start: 25, end: 32 },  // Hide during transition
    { start: 95, end: 102 }, // Hide during outro
  ],
  menuAvailableOffset: 1.2,
};

Available icons: 💰 🚚 📦 👷 🛠️ 🎬 ⭐ 💡 📞 🏠 🔧 📊 📈 💼 🎯 ⚡ 🚀 🎨 📱 💻 🌟 🔥 ✨ 🎪 🎭
*/

const VIDEO_CONFIG = {
  // Video sections with start and end times in seconds
  sections: [
    { name: "Rent Services", start: 4.5, end: 12, icon: "💰" },
    { name: "Transportation", start: 12, end: 40, icon: "🚚" },
    { name: "Inventory Carry", start: 40, end: 51, icon: "📦" },
    { name: "Labor Solutions", start: 51, end: 70.5, icon: "👷" },
    { name: "Other Services", start: 70.5, end: 83, icon: "🛠️" },
  ],

  // Time intervals where hotspots should be hidden (in seconds)
  // Useful for transitions, credits, or parts where hotspots would be distracting
  hideIntervals: [
    { start: 43.6, end: 49 },
    { start: 74.4, end: 81 },
  ],

  // Menu will be available this many seconds before the first section starts
  menuAvailableOffset: 1.2,
};

// Export for use in main player
if (typeof module !== "undefined" && module.exports) {
  module.exports = VIDEO_CONFIG;
}
