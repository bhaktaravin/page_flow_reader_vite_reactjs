import { useState, useEffect } from 'react'
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
  const [library, setLibrary] = useState<Manga[]>([])

  // Load library on component mount
  useEffect(() => {
    const loadLibrary = async () => {
      try {
        const libraryData = await MangaService.getLibrary()
        setLibrary(libraryData)
        console.log(`📚 Loaded ${libraryData.length} manga from library`)
      } catch (error) {
        console.error('Error loading library:', error)
      }
    }
    loadLibrary()
  }, [])

  const handleMangaSelect = async (manga: Manga) => {
    console.log('Selected manga:', manga.title)
    
    // Add the manga to library first so getMangaById can find it
    try {
      await MangaService.addToLibrary(manga)
      // Refresh library state
      const updatedLibrary = await MangaService.getLibrary()
      setLibrary(updatedLibrary)
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
        setSelectedChapter(null) // Don't auto-select, show chapter list instead
      } catch (error) {
        console.error('Error loading manga chapters:', error)
        setSelectedChapter(null)
      }
    } else {
      setSelectedChapter(null) // Show chapter list, don't auto-select first chapter
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
          <div style={{ padding: '2rem' }}>
            <h2 style={{ marginBottom: '2rem' }}>My Library ({library.length})</h2>
            {library.length === 0 ? (
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                height: '40vh',
                textAlign: 'center'
              }}>
                <BookOpen size={64} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                <h3 style={{ margin: '0 0 1rem 0', opacity: 0.7 }}>Your Library is Empty</h3>
                <p style={{ opacity: 0.5, maxWidth: '400px' }}>
                  Start building your manga collection by searching and adding manga to your library. 
                  Your downloaded chapters will be available for offline reading!
                </p>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '2rem',
                marginTop: '2rem'
              }}>
                {library.map(manga => (
                  <div
                    key={manga.id}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '0.5rem',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onClick={() => handleMangaSelect(manga)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'
                      e.currentTarget.style.transform = 'translateY(-2px)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                      e.currentTarget.style.transform = 'translateY(0)'
                    }}
                  >
                    <img 
                      src={manga.coverImage} 
                      alt={manga.title}
                      style={{
                        width: '100%',
                        height: '200px',
                        objectFit: 'cover'
                      }}
                    />
                    <div style={{ padding: '1rem' }}>
                      <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>{manga.title}</h3>
                      <p style={{ margin: '0 0 0.5rem 0', opacity: 0.7, fontSize: '0.9rem' }}>by {manga.author}</p>
                      <p style={{ margin: '0 0 1rem 0', opacity: 0.6, fontSize: '0.8rem', lineHeight: '1.4' }}>
                        {manga.description?.substring(0, 100)}...
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ opacity: 0.7, fontSize: '0.8rem' }}>
                          {manga.chapters?.length || 0} chapters
                        </span>
                        <button 
                          className="button"
                          style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleMangaSelect(manga)
                          }}
                        >
                          Read
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
