# Oshaia Event Ticketing Website

A modern, fully responsive event ticketing platform built with Next.js 14, TypeScript, and Tailwind CSS.

## 🎨 Color Scheme

All colors are defined in `src/app/globals.css` and can be easily updated:

```css
:root {
  --primary-dark: #0A0B1A;        /* Main background */
  --primary-navy: #0F1729;        /* Header/footer background */
  --secondary-purple: #6C3BAF;    /* Secondary actions */
  --accent-orange: #FF5722;       /* Primary CTAs */
  --accent-pink: #E91E63;         /* Accent badges */
  --text-white: #FFFFFF;          /* Primary text */
  --text-gray: #B8B8B8;           /* Secondary text */
  --border-gray: #2A2D3E;         /* Borders */
  --card-bg: #1A1D2E;             /* Card backgrounds */
}
```

### Tailwind Classes Available:
- `bg-primary-dark`, `bg-primary-navy`, `bg-secondary-purple`
- `bg-accent-orange`, `bg-accent-pink`
- `text-white`, `text-text-gray`
- `border-border-gray`, `bg-card-bg`

## 📁 Project Structure

```
src/
├── app/
│   ├── globals.css          # Global styles & color scheme
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page
├── components/
│   └── home/
│       ├── Header.tsx           # Navigation header
│       ├── HeroCarousel.tsx     # Hero section with carousel
│       ├── EventsSection.tsx    # Events grid with category filter
│       ├── PartnersSection.tsx  # Partners logos section
│       ├── Footer.tsx           # Footer with newsletter
│       └── index.ts             # Component exports
└── modules/                 # Future modules

public/
└── images/                  # All images
    ├── Font/                # Quicksans font
    └── [event-images]       # Event posters & banners
```

## 🎯 Features

### ✅ Implemented
- **Fully Responsive Design** - Mobile, tablet, desktop optimized
- **Custom Font** - Quicksans Accurate ICG Fill font integrated
- **Hero Carousel** - Auto-playing image slider with manual controls
- **Event Filtering** - Filter events by category (ALL, CONCERT, FESTIVAL, etc.)
- **Event Cards** - Beautiful cards with hover effects
- **Partners Section** - Logo showcase grid
- **Newsletter Subscription** - Email capture in footer
- **Mobile Navigation** - Hamburger menu for mobile devices
- **Professional Color Scheme** - Dark theme with vibrant accents

### 🎨 Design Features
- Smooth transitions and hover effects
- Gradient overlays on images
- Card elevation on hover
- Category tab animations
- Responsive typography
- Mobile-first approach

## 🚀 Getting Started

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### Build for Production
```bash
npm run build
npm start
```

## 🎨 Customizing Colors

To update the color scheme, edit `src/app/globals.css`:

```css
:root {
  --accent-orange: #YOUR_COLOR;  /* Change primary CTA color */
  --secondary-purple: #YOUR_COLOR;  /* Change secondary actions */
  /* ... other colors */
}
```

Also update `tailwind.config.js` to match:

```javascript
colors: {
  'accent-orange': '#YOUR_COLOR',
  'secondary-purple': '#YOUR_COLOR',
  // ...
}
```

## 📱 Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## 🖼️ Adding Images

Place event images in `public/images/` directory. They can be referenced as:
```tsx
<Image src="/images/your-image.jpg" alt="..." />
```

## 🔧 Component Usage

### Adding New Events
Edit `src/components/home/EventsSection.tsx`:

```tsx
const events = [
  {
    id: 1,
    image: '/images/event.jpg',
    title: 'Event Name',
    category: 'CONCERT',
    date: '25 JAN 2026',
    time: '8:00 PM',
    location: 'Venue Name',
    price: 'RS 299',
    badge: 'NEW',
    badgeColor: 'bg-accent-orange'
  },
  // ... more events
]
```

### Adding Carousel Slides
Edit `src/components/home/HeroCarousel.tsx`:

```tsx
const slides = [
  {
    id: 1,
    image: '/images/slide.jpg',
    title: 'Slide Title',
    subtitle: 'Slide Description',
    date: '25 JAN 2026',
    location: 'Location'
  },
  // ... more slides
]
```

## 📦 Key Dependencies

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS
- **Lucide React** - Icon library
- **Framer Motion** - Animation library

## 🎯 Best Practices

1. **Component Organization**: Keep components small and focused
2. **Responsive Design**: Test on multiple screen sizes
3. **Image Optimization**: Use Next.js Image component
4. **Color Consistency**: Only modify colors in globals.css
5. **Type Safety**: Use TypeScript for all components

## 📝 Notes

- All images should be in `/public/images/` folder
- Font file: `/public/images/Font/Quicksans Accurate ICG Fill.ttf`
- Color updates: Only edit `globals.css` for consistency
- Components are client-side rendered with `"use client"` directive

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📄 License

Private project for Oshaia Event Ticketing Platform
