# 🎂 Birthday Celebration Webapp

A beautiful, interactive birthday celebration webpage built with React, Vite, and GSAP animations.

## ✨ Features

- ⏰ **Countdown Timer** with flip animations
- 🎉 **Interactive Celebration Page** with QNA flow
- 🎵 **Music Player** with custom audio
- 📸 **Photo Gallery** with lazy loading
- 💌 **Personalized Message Card**
- 🎊 **Confetti & Effects** animations
- 💗 **Floating Hearts** background
- 🔄 **Smooth Page Transitions** with GSAP
- ⌨️ **Keyboard Navigation** support
- ♿ **Error Boundary** for graceful error handling
- 📱 **Fully Responsive Design**

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

```bash
# Clone and install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build  

# Preview production build
npm run preview
```

## ⚙️ Configuration

### Set Birthday Date

Edit `src/components/Countdown.jsx` (line ~25):

```jsx
const defaultTarget = new Date('2026-01-30T01:00:00');
// Format: YYYY-MM-DDTHH:MM:SS
```

### Add Music

Place your audio file in `public/` and update `src/components/MusicPlayer.jsx`:

```jsx
const MUSIC_URL = '/your-music-file.mp3';
```

### Customize Name

Update the `[Name]` placeholder throughout the app:
- `src/App.jsx` (line ~127)
- `src/components/CelebrationPage.jsx` (line ~48)
- `index.html` (line ~15)

### Add Photos

Place images in `public/images/` and update `src/components/Gallery.jsx`:

```jsx
const images = [
  { id: 1, src: '/images/photo1.jpg', alt: 'Description' },
  // ... add more
];
```

## 🎮 Keyboard Shortcuts

- **Enter / Space** - Proceed through slides
- **Y** - Answer "Yes" to questions
- **N** - Answer "No" to questions
- **?resetCountdown=1** - Reset countdown state (URL parameter)

## 🔧 Customization

### Text & Messages

- `src/App.jsx` - Hero title and button text
- `src/components/CelebrationPage.jsx` - Slide questions and messages
- `src/components/MessageCard.jsx` - Personal message
- `src/components/Gallery.jsx` - Gallery title

### Colors

- `src/index.css` - Root background gradient
- `src/App.css` - Page elements and buttons
- Component CSS files - Individual component colors

### Animations

- GSAP animations in `src/components/CelebrationPage.jsx`
- CSS animations in respective `.css` files
- Confetti in `src/components/Confetti.jsx`

## 📱 Responsive Design

The site is fully responsive with breakpoints at:
- Mobile: < 600px
- Tablet: 601px - 1024px
- Desktop: > 1024px

## 🐛 Error Handling

The app includes an Error Boundary component that catches render errors gracefully and displays a user-friendly error page with a refresh button.

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy preview
npm run deploy:preview

# Deploy production
npm run deploy:prod
```

### Manual Deployment

Build the production bundle:

```bash
npm run build
```

Deploy the `dist/` folder to your hosting service (Netlify, GitHub Pages, etc.)

## 📊 Performance Tips

1. **Optimize Images**: Compress images before uploading to `public/images/`
2. **Preload Audio**: Audio is preloaded in `index.html` for faster playback
3. **Lazy Loading**: Gallery images use lazy loading for better performance
4. **Animation Cleanup**: GSAP animations are cleaned up on component unmount

## 🎨 Browser Support

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support (iOS 13+)
- Mobile Browsers: ✅ Optimized

## 📝 Development Notes

### File Structure

```
src/
├── components/
│   ├── CelebrationPage.jsx    # Main celebration with QNA
│   ├── Countdown.jsx          # Countdown timer
│   ├── Gallery.jsx            # Photo gallery
│   ├── MessageCard.jsx        # Personal message
│   ├── MusicPlayer.jsx        # Audio player
│   ├── Effects.jsx            # Celebration effects
│   ├── Confetti.jsx           # Confetti animation
│   ├── Hearts.jsx             # Floating hearts
│   └── ErrorBoundary.jsx      # Error handling
├── hooks/
│   └── useButtonAnimation.js  # Reusable button animation hook
├── App.jsx                    # Main app component
├── main.jsx                   # Entry point
├── index.css                  # Global styles
└── App.css                    # App styles
```

### State Management

- **Page Navigation**: `currentPage` state in `App.jsx`
- **Countdown**: Local state in `Countdown.jsx`
- **Celebration**: Local state in `CelebrationPage.jsx`

## 🔐 Best Practices

1. Always test on mobile devices before deployment
2. Use the error boundary for graceful error handling
3. Keep birthday date in UTC to avoid timezone issues
4. Compress all media files before upload
5. Test keyboard navigation for accessibility

## 🐛 Troubleshooting

### Music not playing
- Check file path in `MusicPlayer.jsx`
- Ensure browser allows autoplay (often requires user interaction)
- Test with a different audio format (mp3 usually works best)

### Countdown not showing
- Verify target date is in the future
- Check timezone settings
- Use `?resetCountdown=1` URL parameter

### Images not loading
- Verify images are in `public/images/` folder
- Check image paths in `Gallery.jsx`
- Ensure images are properly compressed

## 📧 Support

For issues or questions, check the code comments and error boundary output.

---

**Built with ❤️ using React, Vite, and GSAP**
