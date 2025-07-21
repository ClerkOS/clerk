# Clerk UI - Modern Spreadsheet Application

A modern, responsive spreadsheet application built with React, Vite, and Tailwind CSS. Clerk UI provides a clean and intuitive interface for managing and analyzing data.

## Features

- 🎨 **Modern UI/UX**
  - Clean, intuitive interface
  - Responsive design
  - Dark/Light mode support
  - Tooltips for better navigation

- 📊 **Spreadsheet Functionality**
  - Grid-based data management
  - Formula support
  - Cell selection and editing
  - Column and row management

- 🛠️ **Tools & Utilities**
  - Command palette for quick actions
  - SideBar with essential tools
  - Formula bar for calculations
  - Property panel for cell customization

## Tech Stack

- **Frontend Framework**: React
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React Context API

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone [your-repo-url]
cd clerk-ui1
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
clerk-ui1/
├── src/
│   ├── components/     # Reusable UI components
│   ├── context/        # React context providers
│   ├── hooks/          # Custom React hooks
│   ├── utils/          # Utility functions
│   ├── assets/         # Static assets
│   └── App.tsx         # Main application component
├── public/             # Public assets
└── package.json        # Project dependencies
```

## Key Components

- **Header**: Top navigation bar with theme toggle and user controls
- **SideBar**: Left-side panel with essential tools
- **Grid**: Main spreadsheet component
- **FormulaBar**: Input area for formulas and cell content
- **StatusBar**: Bottom panel showing current status
- **PropertyPanel**: Right-side panel for cell properties
- **CommandPalette**: Quick action menu

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)
