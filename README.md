# Weijden Multicare Website

Een moderne, responsieve website voor Weijden Multicare met automatische development server.

## 🚀 Development Server

### Snel starten:
```bash
npm run dev
```

### Alternatieve methoden:
```bash
# Linux/Mac
./start-dev.sh

# Windows  
start-dev.bat

# Direct live-server
live-server --port=8080
```

## ✨ Features

- **Auto-reload**: Browser refresht automatisch bij file changes
- **File watching**: Monitort CSS, JS, pages en assets folders
- **Responsive design**: Mobiel-eerst ontwerp
- **Dark/Light mode**: Automatische thema switching
- **GSAP animaties**: Smooth page transitions
- **Modern stack**: HTML5, CSS3, Vanilla JavaScript

## 📁 Project Structuur

```
wijdenmulticare/
├── index.html              # Homepage
├── pages/                  # Alle subpagina's
│   ├── diensten.html
│   ├── wie-zijn-we.html
│   ├── vacatures.html
│   └── contact.html
├── css/                    # Stylesheets
│   ├── main.css           # Hoofdstylesheet
│   ├── animations.css     # GSAP animaties
│   └── responsive.css     # Mobile responsive
├── js/                     # JavaScript
│   ├── main.js            # Hoofd functionaliteit
│   ├── page-transitions.js
│   ├── menu.js
│   └── dark-mode.js
├── assets/                 # Media bestanden
│   └── images/            # Logo's en afbeeldingen
└── start-dev.sh           # Development server script
```

## 🎨 Kleurenschema

### Light Mode:
- Primary: #41A38F (turquoise)
- Secondary: #504F4E (donker grijs)
- Text: #585857 (grijs)
- Background: #FFFFFF (wit)

### Dark Mode:
- Background: #1F1E1E (heel donker)
- Secondary: #262626 (donker grijs)
- Text: #FFFFFF (wit)

## 🔧 Development Commands

```bash
npm run dev     # Start development server
npm start       # Alias voor npm run dev
npm run build   # Static site - geen build nodig
npm run deploy  # Info over Netlify deployment
```

## 📱 Browser Support

- Chrome/Edge: Laatste 2 versies
- Firefox: Laatste 2 versies  
- Safari: Laatste 2 versies
- Mobile: iOS Safari, Chrome Mobile

# weijden
