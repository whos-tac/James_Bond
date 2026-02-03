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
  center: false,

  // Enable slide navigation via hash
  hash: true,

  // Enable keyboard shortcuts
  keyboard: true,

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
  plugins: [Notes, Markdown]
}).then(() => {
  // Blood drip transition effect - initialize after Reveal is ready
  let bloodDripPlaying = false;
  const bloodDrip = document.querySelector('.blood-drip');

  // Override keyboard and click navigation when on title slide
  deck.addKeyBinding({ keyCode: 39, key: 'ArrowRight' }, () => {
    const currentSlide = deck.getCurrentSlide();

    if (currentSlide.classList.contains('title-slide') && !bloodDripPlaying) {
      bloodDripPlaying = true;

      // Trigger blood drip animation
      bloodDrip.classList.add('active');

      // Wait for blood drip to complete (~3.5 seconds), then navigate
      setTimeout(() => {
        bloodDrip.classList.remove('active');
        bloodDripPlaying = false;
        deck.right();
      }, 3500);

      return false; // Prevent default navigation
    }

    // Normal navigation for other slides
    deck.right();
  });

  // Also handle click/touch navigation on title slide
  deck.on('click', (event) => {
    const currentSlide = deck.getCurrentSlide();

    if (currentSlide.classList.contains('title-slide') && !bloodDripPlaying) {
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

