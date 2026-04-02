// =================================================================================
// GLOBAL ERROR HANDLING
// =================================================================================
// Handle unhandled promise rejections (including extension-related ones)

window.addEventListener("unhandledrejection", function (event) {
  const reason = event.reason;
  const reasonString = reason ? reason.toString() : "";

  // Check for extension-related errors
  if (
    reasonString.includes("Could not establish connection") ||
    reasonString.includes("Receiving end does not exist") ||
    reasonString.includes("Extension context invalidated") ||
    reasonString.includes("message channel closed") ||
    reasonString.includes("listener indicated an asynchronous response")
  ) {
    // Silently prevent extension-related errors from showing

    event.preventDefault();

    return;
  }

  // Log other promise rejections with warning (not error)

  console.warn("Unhandled promise rejection:", reason);

  event.preventDefault();
});

// Handle general errors (including extension-related ones)

window.addEventListener("error", function (event) {
  const message = event.message || "";

  // Filter out extension-related errors

  if (
    message.includes("extension") ||
    message.includes("listener") ||
    message.includes("Could not establish connection") ||
    message.includes("Receiving end does not exist") ||
    message.includes("Extension context invalidated") ||
    message.includes("chrome-extension") ||
    message.includes("moz-extension")
  ) {
    // Silently ignore extension-related errors

    return;
  }

  // Log other errors with warning

  console.warn("General error:", event.error);
});

// Additional console error filtering for extension-related errors

const originalConsoleError = console.error;

console.error = function (...args) {
  const message = args.join(" ");

  if (
    message.includes("Could not establish connection") ||
    message.includes("Receiving end does not exist") ||
    message.includes("Extension context invalidated") ||
    message.includes("message channel closed") ||
    message.includes("chrome-extension") ||
    message.includes("moz-extension")
  ) {
    // Silently ignore extension-related console errors

    return;
  }

  // Call original console.error for non-extension errors

  originalConsoleError.apply(console, args);
};

// =================================================================================

// VIDEO CONFIGURATION - CHANGE THESE VALUES WHEN YOU GET A NEW VIDEO

// =================================================================================

/*

      INSTRUCTIONS FOR UPDATING VIDEO SECTIONS:



      1. Update the sections array below with the new timings

      2. Update hideIntervals if there are specific times when hotspots should be hidden

      */

const VIDPLAY_VIDEO_CONFIG = {
  // Video sections with start and end times in seconds (supports high precision: x.xxx)

  sections: [
    { name: "Rent Services", start: 0, end: 7, icon: "💰" },

    { name: "Transportation", start: 8, end: 21.2, icon: "🚚" },

    { name: "Inventory Carry", start: 21.2, end: 32.1, icon: "📦" },

    { name: "Labor Solutions", start: 32.1, end: 49, icon: "👷" },

    { name: "Other Services", start: 49, end: 60, icon: "🛠️" },
  ],

  // Time intervals where hotspots should be hidden (in seconds - supports high precision)

  hideIntervals: [
    { start: 24.2, end: 30 },

    { start: 51.2, end: 56 },

    { start: 60.5, end: 999.0 },
  ],
};

// =================================================================================

// CONFIGURATION VALIDATION

// =================================================================================

function validateVidplayVideoConfig() {
  if (
    !VIDPLAY_VIDEO_CONFIG.sections ||
    VIDPLAY_VIDEO_CONFIG.sections.length === 0
  ) {
    console.error("VIDPLAY_VIDEO_CONFIG: No sections defined!");

    return false;
  }

  for (let i = 0; i < VIDPLAY_VIDEO_CONFIG.sections.length; i++) {
    const section = VIDPLAY_VIDEO_CONFIG.sections[i];

    if (
      !section.name ||
      typeof section.start !== "number" ||
      typeof section.end !== "number"
    ) {
      console.error(
        `VIDPLAY_VIDEO_CONFIG: Invalid section at index ${i}:`,

        section
      );

      return false;
    }

    if (section.start >= section.end) {
      console.error(
        `VIDPLAY_VIDEO_CONFIG: Section "${section.name}" has invalid timing (start >= end)`
      );

      return false;
    }
  }

  return true;
}

validateVidplayVideoConfig();

class VidplayVideoPlayerController {
  constructor() {
    // Core elements

    this.video = document.getElementById("vidplayMainVideo");

    this.wrapper = document.getElementById("vidplayVideoWrapper");

    this.progressTrack = document.getElementById("vidplayProgressTrack");

    this.progressFill = document.getElementById("vidplayProgressFill");

    this.timeTooltip = document.getElementById("vidplayTimeTooltip");

    this.playIndicator = document.getElementById("vidplayPlayIndicator");

    this.playOverlay = document.getElementById("vidplayPlayOverlay");

    this.playButton = document.getElementById("vidplayPlayButton");

    this.loader = document.getElementById("vidplayLoader");

    this.statusToast = document.getElementById("vidplayStatusToast");

    this.sectionIndicator = document.getElementById("vidplaySectionIndicator");

    this.sectionIcon = this.sectionIndicator.querySelector(
      ".vidplay-section-icon"
    );

    this.sectionName = this.sectionIndicator.querySelector(
      ".vidplay-section-name"
    );

    // Controls

    this.replayBtn = document.getElementById("vidplayReplayBtn");

    this.muteBtn = document.getElementById("vidplayMuteBtn");

    this.fullscreenBtn = document.getElementById("vidplayFullscreenBtn");

    this.nextSectionBtn = document.getElementById("vidplayNextSectionBtn");

    // Menu elements

    this.menuToggle = document.getElementById("vidplayMenuToggle");

    this.sectionsMenu = document.getElementById("vidplaySectionsMenu");

    this.closeMenu = document.getElementById("vidplayCloseMenu");

    // State management

    this.currentSection = null;

    this.sectionEndTime = null;

    this.isPlayingSection = false;

    this.isManualSectionSelection = false; // Track if user manually selected section

    this.menuOpen = false;

    this.isDraggingProgress = false;

    this.hasStartedPlaying = false;

    this.waitingForSectionStart = false;

    this.upcomingSectionIndex = -1;

    this.pauseBeforeSection = 0.5; // Pause 0.5 seconds before each section

    // Performance optimization

    this.lastUpdateTime = 0;

    this.lastSectionCheck = 0; // Add this for section checking optimization

    this.updateThrottle = 50; // Reduced from 100ms for smoother updates

    this.lastHotspotState = null;

    this.lastMenuState = null;

    // Tooltip system - optimized for minimal design

    this.tooltips = new Map();

    this.tooltipDelay = 300; // ms - reduced for better responsiveness

    this.tooltipTimeouts = new Map();

    // Section indicator timeout

    this.sectionIndicatorTimeout = null;

    // Configuration-based properties (calculated from VIDPLAY_VIDEO_CONFIG)

    this.sections = VIDPLAY_VIDEO_CONFIG.sections;

    this.hideIntervals = VIDPLAY_VIDEO_CONFIG.hideIntervals;

    this.firstSectionStart = this.sections[0]?.start || 0;

    this.menuAvailableTime = 0; // Menu and hotspots available from the beginning

    this.currentSectionIndex = -1;

    // Initialize dynamic elements

    this.initializeDynamicElements();

    this.init();

    this.setupTooltips();
  }

  // Helper function to safely find closest element with fallback

  findClosest(element, selector) {
    if (!element || typeof element.closest !== "function") {
      return null;
    }

    try {
      return element.closest(selector);
    } catch (error) {
      // Fallback for older browsers

      let current = element;

      while (current && current !== document) {
        if (this.elementMatches(current, selector)) {
          return current;
        }

        current = current.parentElement;
      }

      return null;
    }
  }

  // Helper function for element matching with fallback

  elementMatches(element, selector) {
    if (!element) return false;

    // Try modern matches method

    if (element.matches) {
      return element.matches(selector);
    }

    // Fallback for older browsers

    if (element.msMatchesSelector) {
      return element.msMatchesSelector(selector);
    }

    if (element.webkitMatchesSelector) {
      return element.webkitMatchesSelector(selector);
    }

    // Ultimate fallback - check class names for simple selectors

    if (selector.startsWith(".")) {
      const className = selector.substring(1);

      return element.classList && element.classList.contains(className);
    }

    return false;
  }

  initializeDynamicElements() {
    // Update hotspots with configuration

    this.updateHotspots();

    // Update menu sections

    this.updateMenuSections();

    // Re-select hotspots and section buttons after dynamic creation

    this.hotspots = document.querySelectorAll(".vidplay-hotspot");

    this.sectionButtons = document.querySelectorAll(".vidplay-section-btn");

    // Update tooltips for newly created elements immediately

    setTimeout(() => {
      this.updateHotspotTooltips();

      this.updateSectionTooltips();
    }, 100);
  }

  updateHotspots() {
    const hotspotsLayer = document.querySelector(".vidplay-hotspots-layer");

    // Clear existing hotspots

    hotspotsLayer.innerHTML = "";

    // Create hotspots based on configuration

    this.sections.forEach((section, index) => {
      const hotspot = document.createElement("button");

      hotspot.className = `vidplay-hotspot vidplay-hotspot-${section.name

        .toLowerCase()

        .replace(/\s+/g, "-")}`;

      hotspot.setAttribute("data-start", section.start);

      hotspot.setAttribute("data-end", section.end);

      hotspot.setAttribute("data-name", section.name);

      const icon = document.createElement("span");

      icon.className = "vidplay-hotspot-icon";

      icon.textContent = section.icon;

      hotspot.appendChild(icon);

      hotspotsLayer.appendChild(hotspot);
    });
  }

  updateMenuSections() {
    const sectionList = document.querySelector(".vidplay-section-list");

    // Clear existing section buttons

    sectionList.innerHTML = "";

    // Create section buttons based on configuration

    this.sections.forEach((section) => {
      const button = document.createElement("button");

      button.className = "vidplay-section-btn";

      button.setAttribute("data-start", section.start);

      button.setAttribute("data-end", section.end);

      button.setAttribute("data-name", section.name);

      button.textContent = `${section.icon} ${section.name}`;

      sectionList.appendChild(button);
    });
  }

  init() {
    this.setupEventListeners();

    this.setupKeyboardShortcuts();

    this.updateMuteButton();

    this.optimizeVideoLoading();
  }

  // Helper method to safely play video with consistent error handling

  safePlayVideo(
    successMessage = null,

    errorMessage = "Error playing video"
  ) {
    return this.video

      .play()

      .then(() => {
        if (successMessage) {
          this.showStatus(successMessage);
        }

        this.hideLoader();
      })

      .catch((error) => {
        console.warn("Video play error:", error);

        this.showStatus(errorMessage);

        this.hideLoader();
      });
  }

  setupTooltips() {
    // Initialize simplified tooltip system

    this.initializeControlTooltips();

    this.initializeHotspotTooltips();

    this.initializeMenuTooltips();

    this.setupTooltipEventListeners();
  }

  initializeControlTooltips() {
    // Control button tooltips - simplified to show on hover

    const controlTooltips = [
      {
        element: this.nextSectionBtn,

        getContent: () => this.getNextSectionTooltipText(),

        position: "control",
      },

      {
        element: this.replayBtn,

        content: "Replay from beginning",

        position: "control",
      },

      {
        element: this.muteBtn,

        getContent: () => (this.video.muted ? "Unmute" : "Mute"),

        position: "control",
      },

      {
        element: this.fullscreenBtn,

        getContent: () =>
          document.fullscreenElement ? "Exit fullscreen" : "Enter fullscreen",

        position: "control",
      },
    ];

    controlTooltips.forEach(({ element, content, getContent, position }) => {
      if (element) {
        this.tooltips.set(element, { content, getContent, position });
      }
    });
  }

  initializeHotspotTooltips() {
    // Hotspot tooltips - will be set up after dynamic creation

    this.updateHotspotTooltips();
  }

  updateHotspotTooltips() {
    // Clear existing hotspot tooltips

    this.hotspots?.forEach((hotspot) => {
      this.removeTooltip(hotspot);
    });

    // Add tooltips to newly created hotspots

    this.hotspots?.forEach((hotspot) => {
      const sectionName = hotspot.dataset.name;

      this.tooltips.set(hotspot, {
        getContent: () => `${sectionName}`,

        position: "hotspot",
      });
    });
  }

  initializeMenuTooltips() {
    // Menu button tooltip

    if (this.menuToggle) {
      this.tooltips.set(this.menuToggle, {
        content: "Video sections menu",

        position: "menu",
      });
    }

    // Section button tooltips - will be set up after dynamic creation

    this.updateSectionTooltips();
  }

  updateSectionTooltips() {
    // Clear existing section tooltips

    this.sectionButtons?.forEach((button) => {
      this.removeTooltip(button);
    });

    // Add tooltips to newly created section buttons

    this.sectionButtons?.forEach((button) => {
      const sectionName = button.dataset.name;

      this.tooltips.set(button, {
        getContent: () => `Click play to play ${sectionName}`,

        position: "section",
      });
    });
  }

  setupTooltipEventListeners() {
    // Check if device has touch capability

    const isTouchDevice =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;

    // Universal tooltip event delegation - always show on hover

    if (!isTouchDevice) {
      document.addEventListener("mouseover", (e) => {
        const element = this.findClosest(
          e.target,

          "[data-tooltip], .vidplay-control-btn, .vidplay-hotspot, .vidplay-menu-btn, .vidplay-section-btn"
        );

        if (element && this.tooltips.has(element)) {
          this.showTooltip(element, e);
        }
      });

      document.addEventListener("mouseout", (e) => {
        const element = this.findClosest(
          e.target,

          "[data-tooltip], .vidplay-control-btn, .vidplay-hotspot, .vidplay-menu-btn, .vidplay-section-btn"
        );

        if (element && this.tooltips.has(element)) {
          // Check if we're actually leaving the element (not just moving to a child)

          if (!element.contains(e.relatedTarget)) {
            this.hideTooltip(element);
          }
        }
      });
    }

    // Hide tooltips on touch interactions for mobile

    if (isTouchDevice) {
      document.addEventListener("touchstart", () => this.hideAllTooltips());
    }
  }

  showTooltip(element, event) {
    // Clear any existing timeout for this element

    if (this.tooltipTimeouts.has(element)) {
      clearTimeout(this.tooltipTimeouts.get(element));
    }

    const timeout = setTimeout(() => {
      const tooltipData = this.tooltips.get(element);

      if (!tooltipData) return;

      // Get tooltip content (dynamic or static)

      const content = tooltipData.getContent
        ? tooltipData.getContent()
        : tooltipData.content;

      if (!content) return;

      // Remove any existing tooltip for this element

      this.removeTooltip(element);

      // Create tooltip element

      const tooltip = document.createElement("div");

      tooltip.className = `vidplay-tooltip ${tooltipData.position}-tooltip`;

      tooltip.textContent = content;

      tooltip.setAttribute("data-tooltip-for", element.id || "element");

      // Get element position without affecting layout

      const rect = element.getBoundingClientRect();

      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;

      const scrollLeft =
        window.pageXOffset || document.documentElement.scrollLeft;

      // Position tooltip relative to document body

      tooltip.style.position = "fixed";

      tooltip.style.zIndex = "10000";

      // Position based on tooltip type

      if (tooltipData.position === "hotspot") {
        tooltip.style.left = `${rect.left + rect.width / 2}px`;

        tooltip.style.top = `${rect.top - 10}px`;

        tooltip.style.transform = "translateX(-50%) translateY(-100%)";
      } else if (tooltipData.position === "control") {
        tooltip.style.left = `${rect.left + rect.width / 2}px`;

        tooltip.style.top = `${rect.top - 10}px`;

        tooltip.style.transform = "translateX(-50%) translateY(-100%)";
      } else {
        tooltip.style.left = `${rect.left + rect.width / 2}px`;

        tooltip.style.top = `${rect.top - 10}px`;

        tooltip.style.transform = "translateX(-50%) translateY(-100%)";
      }

      // Append to body instead of element to avoid layout issues

      document.body.appendChild(tooltip);

      // Trigger show animation

      requestAnimationFrame(() => {
        tooltip.classList.add("show");
      });

      // Store reference for cleanup

      element._tooltip = tooltip;
    }, this.tooltipDelay);

    this.tooltipTimeouts.set(element, timeout);
  }

  hideTooltip(element) {
    // Clear timeout

    if (this.tooltipTimeouts.has(element)) {
      clearTimeout(this.tooltipTimeouts.get(element));

      this.tooltipTimeouts.delete(element);
    }

    // Remove tooltip with animation

    this.removeTooltip(element);
  }

  removeTooltip(element) {
    const tooltip = element._tooltip;

    if (tooltip) {
      tooltip.classList.remove("show");

      setTimeout(() => {
        if (tooltip.parentNode) {
          tooltip.parentNode.removeChild(tooltip);
        }
      }, 300); // Match CSS transition duration

      element._tooltip = null;
    }
  }

  hideAllTooltips() {
    // Hide all active tooltips

    this.tooltips.forEach((_, element) => {
      this.hideTooltip(element);
    });
  }

  getNextSectionTooltipText() {
    const currentTime = this.video.currentTime;

    let nextSectionIndex = -1;

    if (this.isPlayingSection && this.currentSectionIndex >= 0) {
      nextSectionIndex = this.currentSectionIndex + 1;
    } else {
      for (let i = 0; i < this.sections.length; i++) {
        if (currentTime < this.sections[i].start) {
          nextSectionIndex = i;

          break;
        }
      }
    }

    if (nextSectionIndex === -1 || nextSectionIndex >= this.sections.length) {
      return "Next section: Back to start";
    }

    const nextSection = this.sections[nextSectionIndex];

    return `Next section: ${nextSection.name}`;
  }

  optimizeVideoLoading() {
    // Show play overlay initially

    this.showPlayOverlay();

    // Enhanced video loading optimization

    this.video.preload = "metadata"; // Start with metadata only

    this.video.load();

    // Detect connection quality and adjust buffering

    this.setupAdaptiveBuffering();

    // Optimize for mobile and slow connections

    if ("connection" in navigator) {
      const connection = navigator.connection;

      if (
        connection.effectiveType === "slow-2g" ||
        connection.effectiveType === "2g"
      ) {
        this.video.preload = "none"; // Minimal preload for slow connections
      }
    }

    // Enhanced metadata loading

    this.video.addEventListener(
      "loadedmetadata",

      () => {
        this.hideLoader();

        this.prebufferKeySections();
      },

      { once: true }
    );

    // Optimize video element attributes for performance

    this.video.setAttribute("x-webkit-airplay", "allow");

    this.video.setAttribute("webkit-playsinline", "true");

    // Enable hardware acceleration hints

    this.video.style.willChange = "transform";
  }

  setupAdaptiveBuffering() {
    // Monitor buffering and adjust quality

    this.video.addEventListener("progress", () => {
      if (this.video.buffered.length > 0) {
        const bufferedEnd = this.video.buffered.end(
          this.video.buffered.length - 1
        );

        const bufferedPercent = (bufferedEnd / this.video.duration) * 100;

        // Hide loader when sufficient buffer is available

        if (bufferedPercent > 15 && this.video.readyState >= 3) {
          this.hideLoader();
        }
      }
    });

    // Handle buffering states more efficiently

    this.video.addEventListener("waiting", () => {
      this.showLoader();
    });

    this.video.addEventListener("canplaythrough", () => {
      this.hideLoader();
    });
  }

  prebufferKeySections() {
    // Pre-buffer the first few seconds of each section for smooth transitions

    if (!this.sections || this.sections.length === 0) return;

    // Enhanced prebuffering strategy

    const prebufferSections = async () => {
      const originalTime = this.video.currentTime;

      const originalPaused = this.video.paused;

      try {
        // Brief seek to each section start to trigger buffering

        for (let i = 0; i < Math.min(3, this.sections.length); i++) {
          const section = this.sections[i];

          if (section.start > 0) {
            this.video.currentTime = section.start;

            await new Promise((resolve) => setTimeout(resolve, 50));
          }
        }

        // Restore original position

        this.video.currentTime = originalTime;

        if (!originalPaused) {
          this.video.play().catch(() => {});
        }
      } catch (error) {
        // Restore position anyway

        this.video.currentTime = originalTime;
      }
    };

    // Start prebuffering after a short delay

    setTimeout(prebufferSections, 500);
  }

  setupEventListeners() {
    // Optimized video events with passive listeners where possible

    this.video.addEventListener("timeupdate", () => this.onTimeUpdate(), {
      passive: true,
    });

    this.video.addEventListener("loadstart", () => this.showLoader(), {
      passive: true,
    });

    this.video.addEventListener("canplay", () => this.hideLoader(), {
      passive: true,
    });

    this.video.addEventListener("waiting", () => this.showLoader(), {
      passive: true,
    });

    this.video.addEventListener(
      "playing",

      () => {
        this.hideLoader();

        this.hidePlayOverlay();

        this.hasStartedPlaying = true;

        // Show appropriate status message based on current state

        // Priority: Check if we're in a section first

        if (
          this.isPlayingSection &&
          this.currentSectionIndex >= 0 &&
          this.sections[this.currentSectionIndex]
        ) {
          const currentSection = this.sections[this.currentSectionIndex];

          this.showStatus(`Playing: ${currentSection.name}`);
        } else {
          // Only show "Video started" when truly starting from beginning

          const currentTime = this.video.currentTime;

          if (currentTime < 2) {
            // Only show at very beginning

            this.showStatus("Video started");
          }

          // Don't show anything else to avoid conflicts
        }

        if (!this.isPlayingSection) {
          this.updateHotspotVisibility();
        }
      },

      { passive: true }
    );

    this.video.addEventListener(
      "pause",

      () => {
        this.updateHotspotVisibility();

        this.hideLoader();

        // Don't show play overlay again if user manually paused
      },

      { passive: true }
    );

    this.video.addEventListener(
      "ended",

      () => {
        this.showStatus("Video ended"); // Simplified status message

        this.onVideoEnd();
      },

      {
        passive: true,
      }
    );

    this.video.addEventListener("error", (e) => this.onVideoError(e), {
      passive: true,
    });

    // Optimized buffering events

    this.video.addEventListener("stalled", () => {}, { passive: true });

    // Throttled progress event for better performance

    let progressTimeout;

    this.video.addEventListener(
      "progress",

      () => {
        if (progressTimeout) return;

        progressTimeout = setTimeout(() => {
          if (this.video.buffered.length > 0) {
            const buffered =
              (this.video.buffered.end(0) / this.video.duration) * 100;

            if (buffered > 15) {
              // Hide loader when 15% is buffered

              this.hideLoader();
            }
          }

          progressTimeout = null;
        }, 100);
      },

      { passive: true }
    );

    // Video click for play/pause

    this.video.addEventListener("click", (e) => {
      if (!this.findClosest(e.target, ".vidplay-hotspot")) {
        this.togglePlayPause();
      }
    });

    // Play button overlay

    this.playButton.addEventListener("click", () => this.startVideo());

    this.playOverlay.addEventListener("click", (e) => {
      if (e.target === this.playOverlay) {
        this.startVideo();
      }
    });

    // Control buttons

    this.replayBtn.addEventListener("click", () => {
      this.replay();

      this.showStatus("Replay from beginning"); // Show status when clicked
    });

    this.muteBtn.addEventListener("click", () => {
      this.toggleMute();

      this.showStatus(this.video.muted ? "Muted" : "Unmuted"); // Show status when clicked
    });

    this.fullscreenBtn.addEventListener("click", () => this.toggleFullscreen());

    this.nextSectionBtn.addEventListener("click", () => {
      this.nextSection();

      // Status will be shown by the nextSection method
    });

    // Menu controls

    this.menuToggle.addEventListener("click", () => this.toggleMenu());

    this.closeMenu.addEventListener("click", () => this.closeMenuPanel());

    // Progress bar

    this.progressTrack.addEventListener("click", (e) => this.seekTo(e));

    this.progressTrack.addEventListener("mousemove", (e) =>
      this.showTimeTooltip(e)
    );

    this.progressTrack.addEventListener("mouseleave", () =>
      this.hideTimeTooltip()
    );

    // Touch support for progress track

    this.progressTrack.addEventListener("touchstart", (e) =>
      this.onTouchStart(e)
    );

    this.progressTrack.addEventListener("touchmove", (e) =>
      this.onTouchMove(e)
    );

    this.progressTrack.addEventListener("touchend", () => this.onTouchEnd());

    // Hotspots and section buttons (using event delegation for dynamic elements)

    document.addEventListener("click", (e) => {
      const hotspot = this.findClosest(e.target, ".vidplay-hotspot");

      if (hotspot) {
        this.playSection(hotspot);

        return;
      }

      const sectionBtn = this.findClosest(e.target, ".vidplay-section-btn");

      if (sectionBtn) {
        this.playSection(sectionBtn);

        return;
      }
    });

    // Fullscreen changes

    document.addEventListener("fullscreenchange", () =>
      this.onFullscreenChange()
    );

    document.addEventListener("webkitfullscreenchange", () =>
      this.onFullscreenChange()
    );

    document.addEventListener("mozfullscreenchange", () =>
      this.onFullscreenChange()
    );

    // Click outside menu to close

    document.addEventListener("click", (e) => {
      if (
        this.menuOpen &&
        !this.sectionsMenu.contains(e.target) &&
        !this.menuToggle.contains(e.target)
      ) {
        this.closeMenuPanel();
      }
    });

    // Double click for fullscreen

    this.video.addEventListener("dblclick", () => this.toggleFullscreen());
  }

  setupKeyboardShortcuts() {
    document.addEventListener("keydown", (e) => {
      switch (e.key) {
        case " ":
          e.preventDefault();

          this.togglePlayPause();

          break;

        case "f":

        case "F":
          e.preventDefault();

          this.toggleFullscreen();

          break;

        case "m":

        case "M":
          e.preventDefault();

          this.toggleMute();

          break;

        case "r":

        case "R":
          e.preventDefault();

          this.replay();

          break;

        case "ArrowLeft":
          e.preventDefault();

          this.seek(-10);

          break;

        case "ArrowRight":
          e.preventDefault();

          this.seek(10);

          break;

        case "ArrowUp":
          e.preventDefault();

          this.seek(30);

          break;

        case "ArrowDown":
          e.preventDefault();

          this.seek(-30);

          break;

        case "n":

        case "N":
          e.preventDefault();

          this.nextSection();

          break;

        case "Tab":
          if (!e.shiftKey) {
            e.preventDefault();

            this.toggleMenu();
          }

          break;

        case "Escape":
          if (this.menuOpen) {
            e.preventDefault();

            this.closeMenuPanel();
          }

          break;
      }
    });
  }

  onTimeUpdate() {
    // Enhanced throttling for better performance

    const now = performance.now();

    if (now - this.lastUpdateTime < this.updateThrottle) {
      return;
    }

    this.lastUpdateTime = now;

    // Batch DOM updates using requestAnimationFrame

    requestAnimationFrame(() => {
      // Update progress bar only if visible and significant change

      if (this.video.duration) {
        const progress = (this.video.currentTime / this.video.duration) * 100;

        const currentWidth = parseFloat(this.progressFill.style.width) || 0;

        // Only update if change is significant (> 0.1%)

        if (Math.abs(progress - currentWidth) > 0.1) {
          this.progressFill.style.width = `${progress}%`;
        }
      }

      // Update visibility with reduced frequency

      this.updateHotspotVisibility();

      this.updateMenuVisibility();
    });

    // Check for upcoming sections with reduced frequency

    if (now - this.lastSectionCheck > 500) {
      // Check every 500ms instead of every frame

      this.checkForUpcomingSections();

      this.lastSectionCheck = now;
    }

    // Check section end (this needs to be responsive)

    if (this.sectionEndTime && this.video.currentTime >= this.sectionEndTime) {
      // Check if this is the last section AND it was reached through normal playback (not manual selection)

      const isLastSection =
        this.currentSectionIndex === this.sections.length - 1;

      const shouldContinueAfterLastSection =
        isLastSection && !this.isManualSectionSelection;

      if (shouldContinueAfterLastSection) {
        // Don't pause after the last section if reached through normal playback

        this.sectionEndTime = null;

        this.isPlayingSection = false;

        this.isManualSectionSelection = false; // Reset flag

        this.updateHotspotVisibility();

        this.showStatus("Final section completed - Video continues");
      } else {
        // Pause after manually selected sections or non-last sections

        this.video.pause();

        this.sectionEndTime = null;

        this.isPlayingSection = false;

        this.isManualSectionSelection = false; // Reset flag

        // Keep current section index for next section navigation

        this.updateHotspotVisibility();

        this.showStatus("Section ended"); // Simplified status message
      }
    }
  }

  updateHotspotVisibility() {
    const currentTime = this.video.currentTime;

    const showTime = this.menuAvailableTime;

    const lastEnd =
      this.sections.length > 0
        ? Math.max(...this.sections.map((s) => s.end))
        : 83;

    // Optimize hide interval check - use efficient loop

    let inHideInterval = false;

    for (let i = 0; i < this.hideIntervals.length; i++) {
      const interval = this.hideIntervals[i];

      if (currentTime >= interval.start && currentTime < interval.end) {
        inHideInterval = true;

        break;
      }
    }

    // Optimize section time check - cache section bounds

    let inSectionTime = false;

    if (this.hotspots.length > 0 && !inHideInterval) {
      // Use more efficient loop instead of Array.prototype.some

      for (let i = 0; i < this.hotspots.length; i++) {
        const hotspot = this.hotspots[i];

        const start = parseFloat(hotspot.dataset.start);

        const end = parseFloat(hotspot.dataset.end);

        if (currentTime >= start && currentTime <= end) {
          inSectionTime = true;

          break;
        }
      }
    }

    // Enhanced visibility logic - show during section playback unless in hide interval

    const shouldShow =
      !inHideInterval &&
      // Show during section playback (even when video is playing)

      (this.isPlayingSection ||
        // Show when video is paused and in section time

        (this.video.paused && inSectionTime) ||
        // Show when waiting for section to start

        (this.waitingForSectionStart && this.video.paused) ||
        // Show when video is paused after the last section (allow replay)

        (this.video.paused && currentTime >= showTime) ||
        // Show during normal video playback in available time range

        (currentTime >= showTime &&
          currentTime < lastEnd &&
          !this.isPlayingSection &&
          !this.video.paused));

    // Only update if state changed

    if (this.lastHotspotState === shouldShow) {
      return;
    }

    this.lastHotspotState = shouldShow;

    // Optimized DOM updates

    if (shouldShow) {
      // Use single requestAnimationFrame with batch update

      requestAnimationFrame(() => {
        // Add all classes at once to minimize reflows

        this.hotspots.forEach((hotspot) => {
          hotspot.classList.add("active");
        });
      });
    } else {
      // Immediate hide for better responsiveness - no animation needed

      this.hotspots.forEach((hotspot) => {
        hotspot.classList.remove("active");
      });
    }
  }

  updateMenuVisibility() {
    const currentTime = this.video.currentTime;

    const shouldShowMenu = currentTime >= this.menuAvailableTime;

    // Only update if state changed

    if (this.lastMenuState === shouldShowMenu) {
      return;
    }

    this.lastMenuState = shouldShowMenu;

    if (shouldShowMenu) {
      this.menuToggle.style.display = "flex";

      this.menuToggle.style.visibility = "visible";
    } else {
      this.menuToggle.style.display = "none";

      this.menuToggle.style.visibility = "hidden";

      if (this.menuOpen) {
        this.closeMenuPanel();
      }
    }
  }

  checkForUpcomingSections() {
    // Don't check if already waiting for section start or playing a specific section

    if (this.waitingForSectionStart || this.isPlayingSection) {
      return;
    }

    const currentTime = this.video.currentTime;

    // Find the next upcoming section

    for (let i = 0; i < this.sections.length; i++) {
      const section = this.sections[i];

      const pauseTime = section.start - this.pauseBeforeSection;

      // Check if we're approaching this section (within pause time)

      if (currentTime >= pauseTime && currentTime < section.start) {
        // Pause the video before the section

        this.video.pause();

        this.waitingForSectionStart = true;

        this.upcomingSectionIndex = i;

        // Update hotspot visibility to show available sections

        this.updateHotspotVisibility();

        break;
      }
    }
  }

  togglePlayPause() {
    if (this.video.paused) {
      // If we're waiting for a section to start, handle it specially

      if (this.waitingForSectionStart && this.upcomingSectionIndex >= 0) {
        const section = this.sections[this.upcomingSectionIndex];

        this.startSection(section, this.upcomingSectionIndex);
      } else {
        this.video.play().catch(() => {});
      }
    } else {
      this.video.pause();
    }
  }

  toggleMute() {
    this.video.muted = !this.video.muted;

    this.updateMuteButton();
  }

  updateMuteButton() {
    this.muteBtn.textContent = this.video.muted ? "🔇" : "🔊";

    // Tooltip content will be updated dynamically via getContent function
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      this.wrapper.requestFullscreen?.() ||
        this.wrapper.webkitRequestFullscreen?.() ||
        this.wrapper.mozRequestFullScreen?.();
    } else {
      document.exitFullscreen?.() ||
        document.webkitExitFullscreen?.() ||
        document.mozCancelFullScreen?.();
    }
  }

  onFullscreenChange() {
    const isFullscreen = !!(
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement
    );

    this.fullscreenBtn.textContent = isFullscreen ? "⛶" : "⛶";

    // Tooltip content will be updated dynamically via getContent function
  }

  replay() {
    // Clean up all UI state including tooltips

    this.hideAllTooltips();

    this.isPlayingSection = false;

    this.sectionEndTime = null;

    this.currentSectionIndex = -1;

    this.waitingForSectionStart = false;

    this.upcomingSectionIndex = -1;

    this.isManualSectionSelection = false; // Reset manual selection flag

    this.video.currentTime = 0;

    this.progressFill.style.width = "0%";

    this.hideAllHotspots();

    this.hasStartedPlaying = false;

    this.showPlayOverlay();
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;

    if (this.menuOpen) {
      this.openMenuPanel();
    } else {
      this.closeMenuPanel();
    }
  }

  openMenuPanel() {
    // Hide all tooltips before opening menu to prevent conflicts

    this.hideAllTooltips();

    this.menuOpen = true;

    this.sectionsMenu.classList.add("open");

    this.menuToggle.style.opacity = "0";

    this.menuToggle.style.pointerEvents = "none";

    const firstButton = this.sectionsMenu.querySelector(".vidplay-section-btn");

    firstButton?.focus();
  }

  closeMenuPanel() {
    this.menuOpen = false;

    this.sectionsMenu.classList.remove("open");

    this.menuToggle.style.opacity = "1";

    this.menuToggle.style.pointerEvents = "all";

    this.menuToggle.focus();

    // Clear any tooltips that might be showing from menu interaction

    setTimeout(() => {
      this.hideAllTooltips();
    }, 100);
  }

  playSection(element) {
    const start = parseFloat(element.dataset.start);

    const end = parseFloat(element.dataset.end);

    const name = element.dataset.name;

    // Find the section index and get section data

    this.currentSectionIndex = this.sections.findIndex(
      (section) => section.start === start && section.end === end
    );

    // Mark this as a manual section selection

    this.isManualSectionSelection = true;

    if (this.menuOpen) {
      this.closeMenuPanel();
    }

    // Set section state IMMEDIATELY before changing video time

    this.isPlayingSection = true;

    this.sectionEndTime = end;

    // Update hotspot visibility immediately to prevent flicker

    this.updateHotspotVisibility();

    this.video.currentTime = start;

    // Play the video - the "playing" event listener will show the section name

    this.video.play().catch((error) => {
      console.error("Error playing section:", error);

      // Show fallback status if play fails

      this.showStatus(`Error playing: ${name}`);
    });
  }

  startSection(section, sectionIndex) {
    // Clear waiting state

    this.waitingForSectionStart = false;

    this.upcomingSectionIndex = -1;

    // Set up section playback IMMEDIATELY

    this.currentSectionIndex = sectionIndex;

    this.isPlayingSection = true;

    this.sectionEndTime = section.end;

    // This is NOT a manual selection - it's from normal playbook progression

    this.isManualSectionSelection = false;

    // Update hotspot visibility immediately to prevent flicker

    this.updateHotspotVisibility();

    this.video.currentTime = section.start;

    if (this.menuOpen) {
      this.closeMenuPanel();
    }

    // Play the video - the "playing" event listener will show the section name

    this.video.play().catch((error) => {
      console.error("Error starting section:", error);

      // Show fallback status if play fails

      this.showStatus(`Error starting: ${section.name}`);
    });
  }

  hideAllHotspots() {
    // Batch DOM updates for better performance

    requestAnimationFrame(() => {
      this.hotspots.forEach((hotspot) => {
        hotspot.classList.remove("active");
      });
    });

    this.lastHotspotState = false;
  }

  seekTo(e) {
    const rect = this.progressTrack.getBoundingClientRect();

    const x = e.clientX - rect.left;

    const percentage = Math.max(0, Math.min(1, x / rect.width));

    const time = percentage * this.video.duration;

    this.video.currentTime = time;

    this.checkSectionInterrupt(time);
  }

  seek(seconds) {
    const newTime = Math.max(
      0,

      Math.min(this.video.duration, this.video.currentTime + seconds)
    );

    this.video.currentTime = newTime;

    this.checkSectionInterrupt(newTime);
  }

  checkSectionInterrupt(time) {
    // Clear waiting state when seeking

    if (this.waitingForSectionStart) {
      this.waitingForSectionStart = false;

      this.upcomingSectionIndex = -1;
    }

    if (this.isPlayingSection && this.sectionEndTime) {
      const currentSection = Array.from(this.hotspots).find(
        (hotspot) => parseFloat(hotspot.dataset.end) === this.sectionEndTime
      );

      if (currentSection) {
        const start = parseFloat(currentSection.dataset.start);

        const end = parseFloat(currentSection.dataset.end);

        if (time < start || time >= end) {
          this.isPlayingSection = false;

          this.sectionEndTime = null;

          this.updateHotspotVisibility();
        }
      }
    }
  }

  showTimeTooltip(e) {
    const rect = this.progressTrack.getBoundingClientRect();

    let x;

    if (e.type === "mousemove" || e.type === "mousedown") {
      x = e.clientX - rect.left;
    } else if (e.type === "touchstart" || e.type === "touchmove") {
      const touch = e.touches[0];

      x = touch.clientX - rect.left;
    }

    const percentage = Math.max(0, Math.min(1, x / rect.width));

    if (this.video.duration) {
      const time = percentage * this.video.duration;

      // Enhanced content with section information

      let content = this.formatTime(time);

      // Add section info if hovering over a section

      const hoveredSection = this.sections.find(
        (section) => time >= section.start && time <= section.end
      );

      if (hoveredSection) {
        content += ` • ${hoveredSection.name}`;
      }

      this.timeTooltip.textContent = content;

      this.timeTooltip.style.left = `${x}px`;

      this.timeTooltip.classList.add("show");
    }
  }

  hideTimeTooltip() {
    this.timeTooltip.classList.remove("show");
  }

  onTouchStart(e) {
    e.preventDefault();

    this.isDraggingProgress = true;

    this.handleTouch(e);
  }

  onTouchMove(e) {
    e.preventDefault();

    if (this.isDraggingProgress) {
      this.handleTouch(e);
    }
  }

  onTouchEnd() {
    this.isDraggingProgress = false;

    this.hideTimeTooltip();
  }

  handleTouch(e) {
    const rect = this.progressTrack.getBoundingClientRect();

    const touch = e.touches[0] || e.changedTouches[0];

    const x = touch.clientX - rect.left;

    const percentage = Math.max(0, Math.min(1, x / rect.width));

    if (this.video.duration) {
      const time = percentage * this.video.duration;

      this.video.currentTime = time;

      this.progressFill.style.width = `${percentage * 100}%`;

      // Enhanced content with section information

      let content = this.formatTime(time);

      const hoveredSection = this.sections.find(
        (section) => time >= section.start && time <= section.end
      );

      if (hoveredSection) {
        content += ` • ${hoveredSection.name}`;
      }

      this.timeTooltip.textContent = content;

      this.timeTooltip.style.left = `${x}px`;

      this.timeTooltip.classList.add("show");
    }
  }

  showPlayIndicator(icon) {
    this.playIndicator.textContent = icon;

    this.playIndicator.classList.add("show");

    setTimeout(() => {
      this.playIndicator.classList.remove("show");
    }, 500);
  }

  showPlayOverlay() {
    this.playOverlay.classList.remove("hidden");
  }

  hidePlayOverlay() {
    this.playOverlay.classList.add("hidden");
  }

  startVideo() {
    // Progressive loading strategy

    if (this.video.preload !== "auto") {
      this.video.preload = "auto";

      // Show loading immediately

      this.showLoader();
    } // Ensure video is ready before playing

    const playVideo = () => {
      this.video

        .play()

        .then(() => {
          // Status message will be shown by the 'playing' event listener

          this.hideLoader();
        })

        .catch((error) => {
          console.error("Play error:", error);

          this.hideLoader();
        });
    };

    // Check if enough data is loaded

    if (this.video.readyState >= 3) {
      // HAVE_FUTURE_DATA or higher - can start playing

      playVideo();
    } else {
      // Wait for enough data with improved race condition handling

      let handlerCalled = false;

      const canPlayHandler = () => {
        if (handlerCalled) return;

        handlerCalled = true;

        this.video.removeEventListener("canplay", canPlayHandler);

        playVideo();
      };

      this.video.addEventListener("canplay", canPlayHandler);

      // Timeout fallback with race condition protection

      setTimeout(() => {
        if (handlerCalled) return;

        handlerCalled = true;

        this.video.removeEventListener("canplay", canPlayHandler);

        if (this.video.readyState >= 1) {
          playVideo(); // Try anyway if we have metadata
        }
      }, 5000);
    }
  }

  showLoader() {
    this.loader.classList.add("show");
  }

  hideLoader() {
    this.loader.classList.remove("show");
  }

  showStatus(message, duration = 3000) {
    this.statusToast.textContent = message;

    this.statusToast.classList.add("show");

    setTimeout(() => {
      this.statusToast.classList.remove("show");
    }, duration);
  }

  showSectionIndicator(sectionName, sectionIcon) {
    // Clear any existing timeout

    if (this.sectionIndicatorTimeout) {
      clearTimeout(this.sectionIndicatorTimeout);
    }

    // Show only the section name (no icon for cleaner look)

    this.sectionIcon.textContent = "";

    this.sectionName.textContent = `Playing: ${sectionName}`;

    this.sectionIndicator.classList.add("show");

    // Auto-hide after 3 seconds

    this.sectionIndicatorTimeout = setTimeout(() => {
      this.hideSectionIndicator();
    }, 3000);
  }

  hideSectionIndicator() {
    if (this.sectionIndicatorTimeout) {
      clearTimeout(this.sectionIndicatorTimeout);

      this.sectionIndicatorTimeout = null;
    }

    this.sectionIndicator.classList.remove("show");
  }

  onVideoEnd() {
    // Clean up all UI state when video ends

    this.hideAllTooltips();

    // Status message will be shown by the 'ended' event listener

    this.sectionEndTime = null;

    this.isPlayingSection = false;
  }

  onVideoError(e) {
    // Clean up UI state on error

    this.hideAllTooltips();

    this.hideLoader();

    console.error("Video error:", e);

    // Try to switch to backup source

    const sources = this.video.querySelectorAll("source");

    const currentSrc = this.video.currentSrc;

    // Find next source to try

    let nextSource = null;

    for (let i = 0; i < sources.length; i++) {
      if (sources[i].src !== currentSrc) {
        nextSource = sources[i].src;

        break;
      }
    }

    if (nextSource) {
      this.video.src = nextSource;

      this.video.load();
    }
  }

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);

    const secs = Math.floor(seconds % 60);

    return `${mins.toString().padStart(2, "0")}:${secs

      .toString()

      .padStart(2, "0")}`;
  }

  nextSection() {
    // Clear waiting state

    this.waitingForSectionStart = false;

    this.upcomingSectionIndex = -1;

    // Determine current section or find next one

    const currentTime = this.video.currentTime;

    let nextSectionIndex = -1;

    // If we're currently playing a section, get the next one

    if (this.isPlayingSection && this.currentSectionIndex >= 0) {
      nextSectionIndex = this.currentSectionIndex + 1;
    } else {
      // Find the next section based on current time

      for (let i = 0; i < this.sections.length; i++) {
        if (currentTime < this.sections[i].start) {
          nextSectionIndex = i;

          break;
        }
      }
    }

    // If no next section found, start from first section

    if (nextSectionIndex === -1 || nextSectionIndex >= this.sections.length) {
      nextSectionIndex = 0;
    }

    // Play the next section

    const nextSection = this.sections[nextSectionIndex];

    this.currentSectionIndex = nextSectionIndex;

    // Mark this as a manual section selection (using Next button)

    this.isManualSectionSelection = true;

    // Set section state BEFORE changing video time to prevent flicker

    this.isPlayingSection = true;

    this.sectionEndTime = nextSection.end;

    // Update hotspot visibility immediately to prevent flicker

    this.updateHotspotVisibility();

    this.video.currentTime = nextSection.start;

    this.video

      .play()

      .then(() => {
        this.showStatus(`Jump to section: ${nextSection.name}`);
      })

      .catch((error) => {
        console.error("Error jumping to section:", error);
      });
  }
}

// Initialize player when DOM is ready

document.addEventListener("DOMContentLoaded", () => {
  window.vidplayVideoPlayer = new VidplayVideoPlayerController();
});
