# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Weijden Multicare** is a Dutch demolition and construction services company website. This is a production-ready, static website built with vanilla HTML, CSS, and JavaScript, deployed on GitHub Pages.

- **Live Site**: https://artwalters.github.io/weijden
- **GitHub**: https://github.com/Artwalters/weijden
- **Deploy Branch**: `gh-pages` (auto-deploys to GitHub Pages)
- **Main Branch**: `main`

## Development Commands

```bash
# Start development server with live reload
npm run dev

# Alternative start methods
npm start
./start-dev.sh        # Linux/Mac
start-dev.bat         # Windows

# Direct live-server (if installed globally)
live-server --port=8080
```

The development server watches `css/`, `js/`, `pages/`, and `assets/` directories and auto-refreshes the browser on file changes.

## Architecture Overview

### File Structure
```
wijdenmulticare/
├── index.html                 # Homepage
├── pages/                     # Multi-page architecture
│   ├── diensten.html         # Services page
│   ├── wie-zijn-we.html      # About us page
│   ├── vacatures.html        # Jobs page
│   └── contact.html          # Contact page
├── css/styles.css            # Single consolidated stylesheet
├── js/
│   ├── main.js              # Core WeijdenMulticare class
│   └── menu.js              # ModernMenu class with GSAP animations
└── assets/images/           # SVG logos and JPG photos
```

### Key Technical Decisions

1. **Single CSS File**: All styles consolidated into `css/styles.css` with organized sections using CSS custom properties for theming
2. **Class-based JavaScript**: Two main classes handle functionality:
   - `WeijdenMulticare` (main.js): Core site functionality, form handling, accessibility
   - `ModernMenu` (menu.js): Navigation with GSAP animations, mobile menu, scroll effects
3. **CSS Variables Design System**: Comprehensive design tokens for colors, typography, spacing, and responsive breakpoints
4. **GSAP Animation Library**: External CDN for smooth animations and scroll effects
5. **Mobile-First Responsive**: Extensive mobile optimization with particular attention to header behavior

### Component Architecture

**Navigation System**:
- Desktop: Horizontal navigation with hover animations
- Mobile: Slide-out overlay menu with GSAP animations
- Behavior: Auto-closes on scroll, click outside, or page navigation
- Z-index management: Mobile menu positioned outside header for proper layering

**Design System**:
- Primary color: `#41a38f` (turquoise)
- Typography: Inter font family with systematic sizing scale
- Spacing: Consistent spacing system using CSS custom properties
- Light-only theme (dark mode was removed due to conflicts)

## Important Development Notes

### Mobile Menu Critical Implementation
The mobile menu overlay **must** be positioned outside the header element in the DOM to achieve proper z-index layering. The menu slides down from under the navigation bar, not over it.

### Image Usage Patterns
- `lightmode_big.svg`: Primary logo used throughout site
- `businesscar.jpg`: Team photo used in about section decorative shapes
- Background images: Applied via CSS with controlled opacity (0.6 for visibility)

### GSAP Integration
- Loaded via CDN in HTML head
- Used for: menu animations, scroll effects, page load animations
- Menu animations: Staggered item reveals, icon rotations, smooth open/close

### Deployment Process
1. Work on `gh-pages` branch (this is the deployment branch)
2. Push changes directly to `gh-pages` 
3. GitHub Pages automatically deploys from this branch
4. No build process required - direct file serving

### Git Workflow
- Always check `git status` before making changes
- Use descriptive commit messages that indicate updates, not initial creation
- Include standard co-author footer: `Co-Authored-By: Claude <noreply@anthropic.com>`

## Common Issues & Solutions

### Mobile Menu Problems
If mobile menu doesn't slide properly under navigation:
1. Check DOM structure - mobile menu overlay must be outside header
2. Verify z-index values: header uses `--z-sticky: 1020`, menu uses `--z-modal-backdrop: 1040`
3. Ensure proper CSS positioning: `position: fixed; top: 60px;`

### CSS Organization
The single `styles.css` file is organized in sections:
1. Font imports
2. CSS variables/design system  
3. Reset & base styles
4. Typography
5. Layout components
6. Navigation
7. Page-specific styles
8. Responsive breakpoints

### Dark Mode History
Dark mode functionality was completely removed due to conflicts between multiple theme systems. The site now uses light mode only with comprehensive CSS custom properties for consistent theming.

## Testing & Quality Assurance

- Test mobile menu behavior on scroll
- Verify responsive design at key breakpoints (768px, 1024px)
- Check GSAP animations load properly
- Test form submissions and external link handling
- Validate proper z-index layering for navigation