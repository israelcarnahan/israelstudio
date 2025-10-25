# Israel Studio

A artist website showcasing artwork with webshop, and commission request forms.

## Tech Stack

- **Framework**: React 18 + Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Animation**: Framer Motion for parallax effects and transitions
- **Icons**: Lucide React
- **Carousel**: Embla Carousel with autoplay
- **Deployment**: Render (static + server)

## Local Development

### Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### Documentation Style

- **Cross-file links** connecting related components
- **Audit notes** for future maintenance
- **Safe ranges** for CSS variables

### Collaboration Guidelines

- All positioning logic uses CSS variables (globals.css)
- JavaScript handles animations and interactions only
- No hardcoded pixel values
- Performance-first approach with lazy loading
