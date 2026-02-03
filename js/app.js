import Reveal from 'reveal.js';
import Notes from 'reveal.js/plugin/notes/notes.js';
import Markdown from 'reveal.js/plugin/markdown/markdown.js';
import 'reveal.js/dist/reveal.css';
import 'reveal.js/dist/theme/black.css';
import '../css/style.css';

// Initialize Reveal.js
const deck = Reveal();

deck.initialize({
  // Display settings
  width: 1200,
  height: 720,
  margin: 0.1,

  // Center slides on the screen
  center: true,

  // Number of slides away from the current that are visible (increase for overview)
  viewDistance: 10,

  // Enable slide navigation via hash
  hash: true,

  // Enable keyboard shortcuts
  keyboard: {
    39: null, // Disable default right arrow - we'll handle it ourselves
  },

  // Enable touch navigation on mobile devices
  touch: true,

  // Loop the presentation
  loop: false,

  // Change the presentation direction to be RTL
  rtl: false,

  // Randomize the order of slides each time
  shuffle: false,

  // Turns fragments on and off globally
  fragments: true,

  // Flags whether to include the current fragment in the URL
  fragmentInURL: true,

  // Flags if we should show a help overlay
  help: true,

  // Flags if speaker notes should be visible
  showNotes: false,

  // Global override for autoplaying embedded media
  autoPlayMedia: null,

  // Transition style
  transition: 'slide', // none/fade/slide/convex/concave/zoom

  // Transition speed
  transitionSpeed: 'default', // default/fast/slow

  // Transition style for full page slide backgrounds
  backgroundTransition: 'fade', // none/fade/slide/convex/concave/zoom

  // Enable slide navigation via mouse wheel
  mouseWheel: false,

  // Apply a 3D roll to links on hover
  rollingLinks: false,

  // Plugins
  plugins: [Notes]
}).then(() => {
  // Blood drip transition effect - initialize after Reveal is ready
  let bloodDripPlaying = false;
  let isInOverview = false;
  const bloodDrip = document.querySelector('.blood-drip');

  // Cached configuration objects for different modes to avoid
  // repeatedly creating new configuration literals and reconfiguring
  // the deck unnecessarily.
  const overviewModeConfig = {
    center: true,
    transition: 'none',
    backgroundTransition: 'none',
    transitionSpeed: 'fast'
  };

  const normalModeConfig = {
    transition: 'slide',
    backgroundTransition: 'fade',
    transitionSpeed: 'default'
  };

  let currentConfigMode = 'normal';

  function applyDeckConfig(mode) {
    if (mode === currentConfigMode) {
      return;
    }
    currentConfigMode = mode;
    if (mode === 'overview') {
      deck.configure(overviewModeConfig);
    } else if (mode === 'normal') {
      deck.configure(normalModeConfig);
    }
  }

  // Track when overview mode is active
  deck.on('overviewshown', () => {
    isInOverview = true;
    // Disable all transitions in overview mode
    applyDeckConfig('overview');
  });

  deck.on('overviewhidden', () => {
    isInOverview = false;
    // Re-enable transitions when exiting overview
    applyDeckConfig('normal');
  });

  // Custom keyboard handler that intercepts arrow right on title slide
  // Must use 'keydown' with capture phase to intercept before Reveal.js
  document.addEventListener('keydown', (event) => {
    // Only handle arrow right key
    if (event.keyCode !== 39 && event.key !== 'ArrowRight') {
      return;
    }

    // Don't intercept in overview mode
    if (isInOverview) {
      // Manually trigger right navigation since we disabled default
      deck.right();
      return;
    }

    const currentSlide = deck.getCurrentSlide();

    if (currentSlide && currentSlide.classList.contains('title-slide') && !bloodDripPlaying) {
      // Prevent default navigation
      event.preventDefault();
      event.stopPropagation();

      bloodDripPlaying = true;

      // Trigger blood drip animation
      bloodDrip.classList.add('active');

      // Wait for blood drip to complete (~3.5 seconds), then navigate
      setTimeout(() => {
        bloodDrip.classList.remove('active');
        bloodDripPlaying = false;
        deck.right();
      }, 3500);
    } else {
      // For all other slides, manually trigger right navigation
      deck.right();
    }
  }, true); // Use capture phase to run before Reveal.js handlers

  // Also handle click/touch navigation on title slide (but not in overview)
  deck.on('click', (event) => {
    // Don't trigger blood drip if clicking in overview mode
    if (isInOverview) {
      return;
    }

    const currentSlide = deck.getCurrentSlide();

    if (currentSlide && currentSlide.classList.contains('title-slide') && !bloodDripPlaying) {
      const clickX = event.clientX;
      const windowWidth = window.innerWidth;

      // Only trigger on right half click (forward navigation)
      if (clickX > windowWidth / 2) {
        bloodDripPlaying = true;

        // Trigger blood drip animation
        bloodDrip.classList.add('active');

        // Wait for blood drip to complete, then navigate
        setTimeout(() => {
          bloodDrip.classList.remove('active');
          bloodDripPlaying = false;
          deck.right();
        }, 3500);

        event.preventDefault();
        event.stopPropagation();
      }
    }
  });
});

