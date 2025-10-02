import { BookOpen } from 'lucide-react'
import type { Manga } from '../types/manga'

interface MangaLibraryProps {
  library: Manga[]
  onMangaSelect: (manga: Manga) => void
}

export function MangaLibrary({ library, onMangaSelect }: MangaLibraryProps) {
  if (library.length === 0) {
    return (
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
    )
  }

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ margin: '0 0 0.5rem 0' }}>My Library</h1>
        <p style={{ opacity: 0.7, margin: 0 }}>
          {library.length} manga in your collection
        </p>
      </div>

      <div className="manga-grid">
        {library.map((manga) => (
          <div key={manga.id} className="card">
            <img 
              src={manga.coverImage} 
              alt={manga.title}
              style={{
                width: '100%',
                height: '200px',
                objectFit: 'cover',
                borderRadius: '0.5rem',
                marginBottom: '1rem'
              }}
            />
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>{manga.title}</h3>
            <p style={{ margin: '0 0 0.5rem 0', opacity: 0.7, fontSize: '0.9rem' }}>by {manga.author}</p>
            
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                fontSize: '0.85rem',
                opacity: 0.8
              }}>
                <span>{manga.chapters.length} chapters</span>
                <span>{manga.downloadedChapters.length} downloaded</span>
              </div>
              <div style={{
                width: '100%',
                height: '4px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '2px',
                marginTop: '0.5rem',
                overflow: 'hidden'
              }}>
                <div 
                  style={{
                    width: `${(manga.downloadedChapters.length / manga.chapters.length) * 100}%`,
                    height: '100%',
                    background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
                    borderRadius: '2px'
                  }}
                />
              </div>
            </div>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
              {manga.genres.slice(0, 3).map((genre) => (
                <span 
                  key={genre}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '1rem',
                    fontSize: '0.75rem'
                  }}
                >
                  {genre}
                </span>
              ))}
            </div>
            
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                onClick={() => onMangaSelect(manga)}
                className="button"
                style={{ flex: 1 }}
              >
                <BookOpen size={16} />
                Read
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}