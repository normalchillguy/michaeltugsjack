# Plex Movie Collection

A modern web application built with Next.js that displays a beautiful interface for browsing your Plex movie collection. The app is designed to be fast, responsive, and provide a great user experience.

## Features

- 🎬 Display all movies from your Plex server in a clean, modern interface
- 🖼️ Optimized movie poster loading with smooth transitions
- 📱 Fully responsive design that works great on mobile and desktop
- 🔍 Detailed movie information including:
  - Title and release year
  - Duration
  - Directors
  - Plot summary
- ⚡ Performance optimizations:
  - Preloaded images for faster browsing
  - Smooth transitions between views
  - Optimized poster images (400x600 max resolution)

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/normalchillguy/michaeltugsjack.git
cd michaeltugsjack
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file with your Plex server details:
```env
PLEX_SERVER_URL=http://your.plex.server:32400
PLEX_TOKEN=your_plex_token
```

4. Download movie posters:
```bash
npm run download-posters
```

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `src/components/films/` - Main film-related components
  - `FilmList.tsx` - List view of all movies
  - `FilmDetail.tsx` - Detailed movie information modal
- `src/assets/posters/` - Optimized movie poster images
- `scripts/` - Utility scripts for poster downloading and data management

## Deployment

The project is deployed on GitHub Pages. Any push to the main branch will automatically trigger a new deployment.

## Built With

- [Next.js](https://nextjs.org) - React framework
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [TypeScript](https://www.typescriptlang.org) - Type safety
- [GitHub Pages](https://pages.github.com) - Hosting

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
