const background = document.getElementById('background');
const title = document.getElementById('title');
const subtitle = document.getElementById('subtitle');

// Load a random image from the internet and set it as the background
function loadRandomImage() {
  const categories = ['galaxy', 'stars'];
  const category = categories[Math.floor(Math.random() * categories.length)];
  fetch(`https://source.unsplash.com/2560x1440/?${category}`)
    .then(response => {
      // Set the image as the background
      background.style.backgroundImage = `url(${response.url})`;
      background.style.backgroundSize = 'cover';
      background.style.objectPosition = 'center center';
      background.style.backgroundPosition = 'center center';
      background.style.backgroundRepeat = 'no-repeat';

      // Extract the palette of colors from the image
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = response.url;
      img.addEventListener('load', () => {
        const vibrant = new Vibrant(img);
        const palette = vibrant.getPalette();

        // Find the color with the highest contrast ratio for the text color
        let textColor = '#fff';
        let maxContrastRatio = 0;
        for (const swatch of Object.values(palette)) {
          const contrastRatio = ColorContrastRatio(swatch.getHex(), '#fff');
          if (contrastRatio > maxContrastRatio) {
            maxContrastRatio = contrastRatio;
            textColor = swatch.getHex();
          }
        }

        // Set the style of the text based on the dominant color
        content.style.color = textColor;
        content.style.textShadow = `1px 1px 1px ${ColorToRGBA(textColor, 0.5)}`;
      });
    });
}

// Check if the device supports the DeviceOrientationEvent
if (window.DeviceOrientationEvent) {
  // Add an event listener for the device orientation change
  window.addEventListener('deviceorientation', handleOrientation);
}

// Handle the device orientation change
function handleOrientation(event) {
  // Get the device orientation angles
  const alpha = event.alpha; // Z-axis rotation [0, 360]
  const beta = event.beta; // X-axis rotation [-180, 180]
  const gamma = event.gamma; // Y-axis rotation [-90, 90]

  // Calculate the background position based on the device orientation
  const x = (gamma / 90) * 50;
  const y = (beta / 180) * 50;

  // Set the background position
  background.style.backgroundPosition = `${x}% ${y}%`;
}

// Move the background when the cursor is present on top of the page
document.addEventListener('mousemove', event => {
  const x = event.clientX / window.innerWidth - 0.5;
  const y = event.clientY / window.innerHeight - 0.5;
  const maxX = background.offsetWidth - window.innerWidth;
  const maxY = background.offsetHeight - window.innerHeight;
  const translateX = Math.max(-maxX, Math.min(0, x * maxX * 0.2));
  const translateY = Math.max(-maxY, Math.min(0, y * maxY * 0.2));
  background.style.transform = `translate(${translateX}px, ${translateY}px)`;
});

// Load a random image and set it as the background when the page loads
loadRandomImage();

// Change the background when the user clicks anywhere on the screen
document.addEventListener('click', loadRandomImage);

// Calculate the contrast ratio between two colors
function ColorContrastRatio(color1, color2) {
  const luminance1 = ColorLuminance(color1);
  const luminance2 = ColorLuminance(color2);
  const lightest = Math.max(luminance1, luminance2);
  const darkest = Math.min(luminance1, luminance2);
  return (lightest + 0.05) / (darkest + 0.05);
}

// Calculate the relative luminance of a color
function ColorLuminance(color) {
  const rgb = ColorToRGB(color);
  const r = rgb[0] / 255;
  const g = rgb[1] / 255;
  const b = rgb[2] / 255;
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance;
}

// Convert a color from hex format to RGB format
function ColorToRGB(color) {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return [r, g, b];
}
