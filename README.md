# Modern React Application

A comprehensive React application showcasing modern development practices with TypeScript, Material-UI, Zustand, and more.

## 🚀 Features

- **React 19** - Latest version with concurrent features
- **TypeScript** - Full type safety and better development experience
- **Material-UI** - Beautiful, accessible components following Material Design
- **Zustand** - Lightweight state management with minimal boilerplate
- **React Router** - Declarative routing for single-page applications
- **Tailwind CSS** - Utility-first CSS framework for rapid styling
- **Axios** - Promise-based HTTP client for API requests
- **Moment.js** - Date/time manipulation and formatting
- **Vite** - Fast build tool and development server

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd cursorweb
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.tsx      # Navigation header with responsive design
│   └── Footer.tsx      # Application footer
├── pages/              # Page components
│   ├── Home.tsx        # Home page with counter and API demo
│   └── About.tsx       # About page with project information
├── store/              # State management
│   └── useStore.ts     # Zustand store with counter and API state
├── types/              # TypeScript type definitions
├── App.tsx             # Main application component
├── main.tsx            # Application entry point
├── theme.ts            # Material-UI theme configuration
└── index.css           # Global styles with Tailwind CSS
```

## 🎯 Key Features Demonstrated

### State Management (Zustand)
- Counter functionality with increment, decrement, and reset
- State persistence across component re-renders
- Accessible from anywhere in the application

### API Integration
- GitHub API integration using fetch
- Loading states and error handling
- Data display with Material-UI components

### Routing
- React Router DOM setup
- Navigation between Home and About pages
- Responsive navigation with mobile drawer

### UI/UX
- Material-UI theme with custom colors and typography
- Responsive design that works on all devices
- Modern card-based layout
- Hover effects and transitions

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎨 Customization

### Theme
The Material-UI theme can be customized in `src/theme.ts`:
- Colors (primary, secondary, background)
- Typography settings
- Component style overrides

### Styling
The application uses both Material-UI and Tailwind CSS:
- Material-UI for component styling and theming
- Tailwind CSS for utility classes and custom styling

### State Management
Add new state slices to `src/store/useStore.ts`:
```typescript
interface NewState {
  // your state properties
  newAction: () => void;
}

// Add to the store
export const useStore = create<AppState & NewState>((set) => ({
  // existing state
  // new state
}));
```

## 📱 Responsive Design

The application is fully responsive with:
- Mobile-first design approach
- Responsive navigation with hamburger menu
- Adaptive grid layouts
- Touch-friendly interface

## 🔧 Development

### Adding New Pages
1. Create a new component in `src/pages/`
2. Add the route to `src/App.tsx`
3. Update navigation in `src/components/Header.tsx`

### Adding New Components
1. Create the component in `src/components/`
2. Import and use in your pages
3. Follow the existing component patterns

### API Integration
1. Add API calls to the Zustand store
2. Handle loading and error states
3. Use Material-UI components for data display

## 🚀 Deployment

The application is ready for deployment to any static hosting service:

1. Build the application:
```bash
npm run build
```

2. Deploy the `dist` folder to your hosting service

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

If you have any questions or need help, please open an issue on GitHub.
