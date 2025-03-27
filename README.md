# GPT-IQ

GPT-IQ is an AI chat interface designed specifically for Iraqi Arabic language support, featuring a clean, dark-themed UI with advanced chat functionality powered by Google's Gemini AI.

## Features

- Modern, responsive UI similar to ChatGPT
- Iraqi Arabic language support with proper RTL handling
- Markdown rendering with syntax highlighting
- Keyboard shortcuts and accessibility features
- Mobile-optimized with swipe gestures
- Chat history management
- Dark theme with custom color scheme

## Tech Stack

- **Framework**: Next.js 14
- **Styling**: TailwindCSS
- **Animations**: Framer Motion
- **AI Integration**: Google Gemini API
- **UI Components**: Custom components with Tailwind
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn
- Google Gemini API key

### Installation

1. Clone the repository

```bash
git clone https://github.com/madebyak/gbt-iq.git
cd gbt-iq
```

2. Install dependencies

```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory with your Gemini API key:

```bash
GEMINI_API_KEY=your_api_key_here
```

4. Run the development server

```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Deployment to Vercel

### Deploying from GitHub

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Configure the environment variables in Vercel:
   - Add `GEMINI_API_KEY` with your Google Gemini API key
4. Deploy the application

### Direct Deployment with Vercel CLI

1. Install Vercel CLI:

```bash
npm install -g vercel
```

2. Login to Vercel:

```bash
vercel login
```

3. Deploy the application:

```bash
vercel
```

4. For production deployment:

```bash
vercel --prod
```

## Project Structure

```plaintext
/app
  /api              # API routes for Gemini integration
  /components       # UI components
    /layout         # Layout components (Header, Sidebar)
    /ui             # UI components (ChatInput, ChatMessage, etc.)
  /lib              # Utility functions and hooks
    /hooks          # Custom React hooks
    /types          # TypeScript type definitions
    /utils          # Utility functions
  /public           # Static assets
```

## Key Features

### Markdown Support

The application supports markdown rendering in AI responses, including code blocks with syntax highlighting.

### Keyboard Shortcuts

- `/` - Focus the chat input
- `j/k` - Scroll down/up in the chat
- `g/G` - Scroll to top/bottom
- `Ctrl+\` - Toggle sidebar
- `Ctrl+N` - Create new chat
- `?` - Show keyboard shortcuts

### Mobile Optimization

- Swipe from left edge to open sidebar
- Swipe from right to close sidebar
- Responsive design for all screen sizes

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Developed by MoonWhale
- Website: [www.moonswhale.com](https://www.moonswhale.com)
- Contact: 07802806666
