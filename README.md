# nvRanger Official Website

Official website for nvRanger, a gaming content creator on YouTube.

## Features

- 🎮 Modern, responsive design
- 📱 Mobile-friendly navigation
- 🎨 Beautiful gradient animations
- ⚡ Smooth scrolling and transitions
- 🔗 Direct links to YouTube channel
- 📊 Channel statistics display

## Getting Started

### Prerequisites

No build tools or dependencies required! This is a pure HTML, CSS, and JavaScript website.

### Installation

1. Clone or download this repository
2. Open `index.html` in your web browser
3. That's it! The website is ready to use.

### Local Development

For the best development experience, you can use a local server:

**Using Python:**
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

**Using Node.js (with http-server):**
```bash
npx http-server
```

**Using PHP:**
```bash
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

## File Structure

```
website/
├── index.html      # Main HTML file
├── styles.css      # All styling
├── script.js       # JavaScript functionality
└── README.md       # This file
```

## Customization

### Colors

Edit the CSS variables in `styles.css`:

```css
:root {
    --primary-color: #ff0000;      /* YouTube red */
    --secondary-color: #1a1a1a;    /* Dark background */
    /* ... more variables */
}
```

### Content

- Update channel statistics in `index.html` (hero-stats section)
- Modify the about section text
- Add more video cards or social links
- Update footer information

### YouTube Integration

To embed actual YouTube videos, you can:

1. Get video IDs from the YouTube channel
2. Replace video cards with YouTube iframe embeds
3. Use the YouTube Data API to fetch latest videos dynamically

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This website is created for nvRanger. All rights reserved.

## Contact

For questions or support, visit the [YouTube channel](https://www.youtube.com/@nvRanger).



