import { useState } from 'react'
import { Library, Search, Download, BookOpen } from 'lucide-react'
import { MangaSearch } from './components/MangaSearch'
import { MangaReader } from './components/MangaReader'
import { MangaService } from './services/MangaService.js'
import type { Manga, Chapter } from './types/manga'
import './App.css'

type View = 'library' | 'search' | 'downloads' | 'reader'

function App() {
  const [currentView, setCurrentView] = useState<View>('library')
  const [selectedManga, setSelectedManga] = useState<Manga | null>(null)
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null)

  const handleMangaSelect = async (manga: Manga) => {
    console.log('Selected manga:', manga.title)
    
    // Add the manga to library first so getMangaById can find it
    try {
      await MangaService.addToLibrary(manga)
      console.log(`✅ Added ${manga.title} to library`)
    } catch (error) {
      console.error('Error adding to library:', error)
    }
    
    // Set the manga immediately
    setSelectedManga(manga)
    
    // Load chapters if they haven't been loaded yet
    if (manga.chapters.length === 0) {
      try {
        console.log('🔄 Loading chapters for selected manga...')
        const chapters = await MangaService.loadMangaChapters(manga.id)
        console.log(`📚 Loaded ${chapters.length} chapters`)
        
        const updatedManga = { ...manga, chapters }
        setSelectedManga(updatedManga)
        if (chapters[0]) {
          await handleChapterSelect(chapters[0], updatedManga)
        }
      } catch (error) {
        console.error('Error loading manga chapters:', error)
        setSelectedChapter(null)
      }
    } else {
      if (manga.chapters[0]) {
        await handleChapterSelect(manga.chapters[0], manga)
      }
    }
    
    setCurrentView('reader')
  }

  const handleAddToLibrary = async (manga: Manga) => {
    try {
      await MangaService.addToLibrary(manga)
      console.log(`Added ${manga.title} to library`)
      // You could show a toast notification here
    } catch (error) {
      console.error('Error adding to library:', error)
    }
  }

  const handleChapterSelect = async (chapter: Chapter, manga?: Manga) => {
    setSelectedChapter(chapter)
    
    const currentManga = manga || selectedManga
    if (!currentManga) {
      return
    }
    
    // Load real pages if not already loaded
    if (!chapter.pages || chapter.pages.length === 0 || chapter.pages[0].startsWith('data:image/png;base64,iVBOR')) {
      try {
        const chapterWithPages = await MangaService.getChapterWithPages(currentManga.id, chapter.id)
        if (chapterWithPages && chapterWithPages.pages.length > 0) {
          chapter.pages = chapterWithPages.pages
          setSelectedChapter({...chapter})
        }
      } catch (error) {
        console.error('Error loading chapter pages:', error)
      }
    }
  }

  const handleDownloadChapter = async (manga: Manga, chapter: Chapter) => {
    try {
      console.log(`Downloading ${manga.title} - Chapter ${chapter.number}`)
      await MangaService.downloadChapter(manga, chapter)
      console.log(`Downloaded ${manga.title} - Chapter ${chapter.number}`)
    } catch (error) {
      console.error('Download error:', error)
    }
  }

  const handleBackToLibrary = () => {
    setCurrentView('library')
    setSelectedManga(null)
    setSelectedChapter(null)
  }

  return (
    <div className="app">
      {/* Navigation */}
      <nav className="navigation">
        <div className="nav-title">
          <BookOpen size={24} />
          MangaReader
        </div>
        
        <div className="nav-buttons">
          <button 
            className={`nav-button ${currentView === 'library' ? 'active' : ''}`}
            onClick={() => setCurrentView('library')}
          >
            <Library size={18} />
            Library
          </button>
          
          <button 
            className={`nav-button ${currentView === 'search' ? 'active' : ''}`}
            onClick={() => setCurrentView('search')}
          >
            <Search size={18} />
            Search
          </button>
          
          <button 
            className={`nav-button ${currentView === 'downloads' ? 'active' : ''}`}
            onClick={() => setCurrentView('downloads')}
          >
            <Download size={18} />
            Downloads
          </button>
        </div>
      </nav>
      
      {/* Main Content */}
      <main className="main-content">
        {currentView === 'reader' && selectedManga && (
          <MangaReader
            manga={selectedManga}
            chapter={selectedChapter}
            onChapterSelect={handleChapterSelect}
            onDownloadChapter={handleDownloadChapter}
            onBack={handleBackToLibrary}
          />
        )}
        
        {currentView === 'library' && (
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            height: '60vh',
            textAlign: 'center'
          }}>
            <BookOpen size={64} style={{ opacity: 0.3, marginBottom: '1rem' }} />
            <h2 style={{ margin: '0 0 1rem 0', opacity: 0.7 }}>Your Library is Empty</h2>
            <p style={{ opacity: 0.5, maxWidth: '400px' }}>
              Start building your manga collection by searching and adding manga to your library. 
              Your downloaded chapters will be available for offline reading!
            </p>
          </div>
        )}
        
        {currentView === 'search' && (
          <MangaSearch 
            onMangaSelect={handleMangaSelect}
            onAddToLibrary={handleAddToLibrary}
          />
        )}
        
        {currentView === 'downloads' && (
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            height: '60vh',
            textAlign: 'center'
          }}>
            <Download size={64} style={{ opacity: 0.3, marginBottom: '1rem' }} />
            <h2 style={{ margin: '0 0 1rem 0', opacity: 0.7 }}>No Downloads in Queue</h2>
            <p style={{ opacity: 0.5, maxWidth: '400px' }}>
              Download manga chapters for offline reading. Downloads will appear here 
              and you'll be able to track their progress.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
