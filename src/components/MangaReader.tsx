import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, ArrowLeft, Download, List } from 'lucide-react'
import type { Manga, Chapter } from '../types/manga'
import { MangaService } from '../services/MangaService.js'

interface MangaReaderProps {
  manga: Manga
  chapter: Chapter | null
  onChapterSelect: (chapter: Chapter) => void
  onDownloadChapter: (manga: Manga, chapter: Chapter) => void
  onBack: () => void
}

export function MangaReader({ 
  manga, 
  chapter, 
  onChapterSelect, 
  onDownloadChapter, 
  onBack 
}: MangaReaderProps) {
  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const [showChapterList, setShowChapterList] = useState(!chapter)
  const [pagesLoaded, setPagesLoaded] = useState(false) // Force re-render when pages load

  useEffect(() => {
    if (chapter) {
      console.log(`🔄 Chapter selected: ${chapter.number}, Pages: ${chapter.pages?.length || 0}`)
      setCurrentPageIndex(0)
      setPagesLoaded(true) // Pages should be loaded by parent component
      
      // Scroll to top when starting a new chapter
      window.scrollTo({ top: 0, behavior: 'smooth' })
      
      // Save reading progress
      const saveProgress = async () => {
        try {
          const progress = {
            mangaId: manga.id,
            chapterId: chapter.id,
            pageIndex: 0,
            timestamp: new Date()
          }
          await MangaService.saveReadingProgress(progress)
        } catch (error) {
          console.error('Error saving progress:', error)
        }
      }
      saveProgress()
    }
  }, [chapter, manga.id])

  useEffect(() => {
    if (chapter) {
      // Update reading progress when page changes
      const saveProgress = async () => {
        try {
          const progress = {
            mangaId: manga.id,
            chapterId: chapter.id,
            pageIndex: currentPageIndex,
            timestamp: new Date()
          }
          await MangaService.saveReadingProgress(progress)
        } catch (error) {
          console.error('Error saving progress:', error)
        }
      }
      saveProgress()
    }
  }, [currentPageIndex, chapter, manga.id])

  const handleNextPage = () => {
    if (chapter && chapter.pages && currentPageIndex < chapter.pages.length - 1) {
      setCurrentPageIndex(prev => prev + 1)
      // Scroll to top of page for better reading experience
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handlePrevPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(prev => prev - 1)
      // Scroll to top of page for better reading experience
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') handleNextPage()
    if (e.key === 'ArrowLeft') handlePrevPage()
    if (e.key === 'Escape') setShowChapterList(true)
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [chapter, currentPageIndex])

  const currentPage = chapter?.pages[currentPageIndex] || chapter?.downloadedPages?.[currentPageIndex]

  if (showChapterList || !chapter) {
    return (
      <div style={{ padding: '2rem' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          marginBottom: '2rem' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button onClick={onBack} className="button secondary">
              <ArrowLeft size={18} />
              Back to Library
            </button>
            <div>
              <h1 style={{ margin: '0 0 0.5rem 0' }}>{manga.title}</h1>
              <p style={{ margin: 0, opacity: 0.7 }}>by {manga.author}</p>
            </div>
          </div>
        </div>

        <div>
          <h2 style={{ marginBottom: '0.5rem' }}>Select a Chapter to Read ({manga.chapters.length} available)</h2>
          <p style={{ margin: '0 0 1.5rem 0', opacity: 0.7, fontSize: '0.9rem' }}>
            📖 Choose any chapter below to start reading
          </p>
          {manga.chapters.length === 0 && (
            <div style={{ 
              textAlign: 'center', 
              padding: '2rem',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '0.5rem',
              marginBottom: '1rem'
            }}>
              <div style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>⚠️ No chapters found</div>
              <div style={{ fontSize: '0.9rem', opacity: 0.7 }}>
                This might be due to API limitations or the manga not being available.
              </div>
              <button 
                onClick={async () => {
                  console.log('🔄 Manually reloading chapters...')
                  try {
                    const updatedManga = await MangaService.getMangaById(manga.id)
                    if (updatedManga && updatedManga.chapters.length > 0) {
                      console.log(`✅ Found ${updatedManga.chapters.length} chapters`)
                      manga.chapters = updatedManga.chapters
                      // Force re-render by updating parent component
                      window.location.reload()
                    }
                  } catch (error) {
                    console.error('❌ Error reloading chapters:', error)
                  }
                }}
                className="button"
                style={{ marginTop: '1rem' }}
              >
                🔄 Retry Loading Chapters
              </button>
            </div>
          )}
          <div className="chapter-list">
            {manga.chapters.map((chap) => (
              <div 
                key={chap.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onClick={() => {
                  onChapterSelect(chap)
                  setShowChapterList(false)
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                }}
              >
                <div>
                  <div style={{ fontWeight: 'bold' }}>Chapter {chap.number}</div>
                  <div style={{ fontSize: '0.9rem', opacity: 0.7 }}>{chap.title}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {chap.isDownloaded && (
                    <span style={{ 
                      color: '#4ecdc4', 
                      fontSize: '0.8rem',
                      background: 'rgba(78, 205, 196, 0.2)',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '1rem'
                    }}>
                      Downloaded
                    </span>
                  )}
                  {!chap.isDownloaded && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation()
                        onDownloadChapter(manga, chap)
                      }}
                      className="button secondary"
                      style={{ padding: '0.5rem' }}
                      title="Download Chapter"
                    >
                      <Download size={16} />
                    </button>
                  )}
                  <span style={{ opacity: 0.6 }}>{chap.pages.length} pages</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      background: '#000'
    }}>
      {/* Reader Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1rem 2rem',
        background: 'rgba(0, 0, 0, 0.8)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button 
            onClick={() => setShowChapterList(true)}
            className="button secondary"
          >
            <List size={18} />
            Chapters
          </button>
          <div>
            <div style={{ fontWeight: 'bold' }}>{manga.title}</div>
            <div style={{ fontSize: '0.9rem', opacity: 0.7 }}>
              Chapter {chapter.number} - {chapter.title}
            </div>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ opacity: 0.7 }}>
            Page {currentPageIndex + 1} of {chapter?.pages?.length || 0}
          </span>
          {!chapter.isDownloaded && (
            <button 
              onClick={() => onDownloadChapter(manga, chapter)}
              className="button secondary"
              title="Download Chapter"
            >
              <Download size={16} />
              Download
            </button>
          )}
        </div>
      </div>

      {/* Reader Content */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        position: 'relative'
      }}>
        {/* Previous Page Button */}
        {currentPageIndex > 0 && (
          <button
            onClick={handlePrevPage}
            style={{
              position: 'absolute',
              left: '2rem',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(0, 0, 0, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'white',
              padding: '1rem',
              borderRadius: '50%',
              cursor: 'pointer',
              zIndex: 10,
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(0, 0, 0, 0.9)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(0, 0, 0, 0.7)'
            }}
          >
            <ChevronLeft size={24} />
          </button>
        )}

                {/* Manga Page */}
        {currentPage && pagesLoaded ? (
          <img
            src={currentPage}
            alt={`Page ${currentPageIndex + 1}`}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
              userSelect: 'none'
            }}
            draggable={false}
            onError={(e) => {
              console.error('Failed to load page:', currentPage)
              e.currentTarget.style.display = 'none'
            }}
            onLoad={() => {
              console.log('Page loaded successfully:', currentPageIndex + 1)
            }}
          />
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '400px',
            color: 'white',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>📖</div>
            <div>{pagesLoaded ? 'Loading page image...' : 'Loading manga page...'}</div>
            <div style={{ fontSize: '0.9rem', opacity: 0.7, marginTop: '0.5rem' }}>
              Page {currentPageIndex + 1} of {chapter?.pages?.length || 0}
            </div>
          </div>
        )}

        {/* Next Page Button */}
        {chapter && chapter.pages && currentPageIndex < chapter.pages.length - 1 && (
          <button
            onClick={handleNextPage}
            style={{
              position: 'absolute',
              right: '2rem',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(0, 0, 0, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'white',
              padding: '1rem',
              borderRadius: '50%',
              cursor: 'pointer',
              zIndex: 10,
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(0, 0, 0, 0.9)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(0, 0, 0, 0.7)'
            }}
          >
            <ChevronRight size={24} />
          </button>
        )}
      </div>

      {/* Reader Footer */}
      <div style={{
        padding: '1rem 2rem',
        background: 'rgba(0, 0, 0, 0.8)',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        justifyContent: 'center'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '600px',
          height: '6px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '3px',
          overflow: 'hidden'
        }}>
          <div 
            style={{
              width: `${((currentPageIndex + 1) / chapter.pages.length) * 100}%`,
              height: '100%',
              background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
              borderRadius: '3px',
              transition: 'width 0.3s ease'
            }}
          />
        </div>
      </div>
    </div>
  )
}