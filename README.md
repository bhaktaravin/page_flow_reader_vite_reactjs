# PageFlow Reader 📚

A modern, responsive manga reader built with React and TypeScript, featuring real-time search, offline reading capabilities, and a beautiful reading interface.

## ✨ Features

### 🔍 **Smart Search**
- Real-time manga search powered by MangaDx API
- Instant results with rich metadata
- Filter by genre, status, and author

### 📖 **Beautiful Reading Experience**
- Clean, distraction-free reading interface
- Smooth page navigation with keyboard shortcuts
- Professional manga-style layouts
- Reading progress tracking

### 🌐 **Real API Integration**
- Live connection to MangaDx database
- 97+ chapters for popular series like Horimiya
- Real-time chapter and metadata loading
- Comprehensive manga information

### 📱 **Modern UI/UX**
- Responsive design for all devices
- Dark theme with glass-morphism effects
- Smooth animations and transitions
- Intuitive navigation controls

### 💾 **Offline Capabilities**
- Add manga to personal library
- Download chapters for offline reading
- Reading progress synchronization
- Local storage integration

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/page-flow-reader.git

# Navigate to project directory
cd page-flow-reader

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## �️ Tech Stack

- **Frontend**: React 19, TypeScript
- **Build Tool**: Vite
- **Styling**: CSS3 with modern effects
- **Icons**: Lucide React
- **API**: MangaDx REST API
- **Storage**: LocalStorage + SQL.js

## 📱 Usage

1. **Search**: Enter manga title in the search bar
2. **Browse**: Click on manga covers to view details
3. **Read**: Select chapters from the sidebar
4. **Navigate**: Use arrow keys or click to turn pages
5. **Library**: Add favorites to your personal collection

## � Demo Features

The current version showcases:
- ✅ Real MangaDx API integration
- ✅ Professional manga reader interface
- ✅ 97+ real chapters loading
- ✅ Beautiful demo pages with manga-style layouts
- ✅ Full navigation and progress tracking

*Note: Real manga images require a backend CORS proxy for production use*

## 🚀 Deployment

### Deploy to Vercel (Recommended)
1. Push your code to GitHub
2. Connect repository to [Vercel](https://vercel.com)
3. Auto-deploy on every push!

### Deploy to Netlify
1. Build the project: `npm run build`
2. Upload `dist` folder to [Netlify](https://netlify.com)

## 🔧 Configuration

For real manga images in production, you'll need:
- Backend CORS proxy server
- Image caching and optimization
- Rate limiting for API requests

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── Navigation.tsx   # Main navigation bar
│   ├── MangaSearch.tsx  # Search functionality
│   ├── MangaLibrary.tsx # Library management
│   ├── MangaReader.tsx  # Reading interface
│   └── DownloadQueue.tsx# Download management
├── services/           # Business logic
│   └── MangaService.ts # API calls and data management
├── types/             # TypeScript type definitions
│   └── manga.ts       # Manga-related types
├── App.tsx           # Main application component
├── App.css          # Application styles
└── main.tsx        # Application entry point
```

## � License

MIT License - feel free to use this project for learning and development!

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

Made with ❤️ for the manga community | Powered by MangaDx API


### Reading Manga
1. Select a manga from your library or search results
2. Choose a chapter from the chapter list
3. Use arrow keys (←/→) or click the navigation buttons to turn pages
4. Press "Escape" to return to the chapter list
5. Download chapters for offline reading using the download button

### Managing Downloads
1. Click on the "Downloads" tab to view your download queue
2. Monitor download progress
3. Access downloaded chapters even when offline

### Library Management
1. View your personal manga collection in the "Library" tab
2. Track reading progress and download status
3. Continue reading from where you left off

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── Navigation.tsx   # Main navigation bar
│   ├── MangaSearch.tsx  # Search functionality
│   ├── MangaLibrary.tsx # Library management
│   ├── MangaReader.tsx  # Reading interface
│   └── DownloadQueue.tsx# Download management
├── services/           # Business logic
│   └── MangaService.ts # API calls and data management
├── types/             # TypeScript type definitions
│   └── manga.ts       # Manga-related types
├── App.tsx           # Main application component
├── App.css          # Application styles
└── main.tsx        # Application entry point
```

## 🛠️ Technologies Used

- **React 19** - UI framework
- **TypeScript** - Type safety and better development experience
- **Vite** - Fast build tool and development server
- **Lucide React** - Modern icon library
- **Local Storage** - Offline data persistence
- **CSS3** - Modern styling with gradients and animations

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📊 Features in Detail

### Offline Storage
The app uses browser localStorage to persist:
- Manga library
- Downloaded chapters (base64 encoded images)
- Reading progress
- User preferences

### Reading Progress
- Automatic progress saving
- Resume reading from last position
- Chapter completion tracking
- Reading history

### Download System
- Simulated download process for demo purposes
- Progress tracking
- Queue management
- Background downloads

## 🎯 Future Enhancements

- [ ] Real manga API integration
- [ ] User authentication
- [ ] Cloud sync for library and progress
- [ ] Multiple reading modes (webtoon, etc.)
- [ ] Bookmarks and favorites
- [ ] Reading statistics
- [ ] Offline-first PWA support
- [ ] Mobile app versions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Mock manga data and placeholders for demonstration
- Lucide React for beautiful icons
- Vite team for excellent developer experience
- React community for inspiration and best practices

---

**Note**: This is a demonstration application using mock data. In a production environment, you would integrate with real manga APIs and implement proper content delivery systems.