import { useState } from 'react'
import { Search, Plus } from 'lucide-react'
import type { Manga } from '../types/manga'
import { MangaService } from '../services/MangaService.js'

interface MangaSearchProps {
  onMangaSelect: (manga: Manga) => void
  onAddToLibrary: (manga: Manga) => void
}

export function MangaSearch({ onMangaSelect, onAddToLibrary }: MangaSearchProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Manga[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = async () => {
    if (!query.trim()) return
    
    setIsLoading(true)
    try {
      const searchResults = await MangaService.searchManga(query)
      setResults(searchResults)
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search 
            size={20} 
            style={{ 
              position: 'absolute', 
              left: '1rem', 
              top: '50%', 
              transform: 'translateY(-50%)',
              color: 'rgba(255, 255, 255, 0.6)'
            }} 
          />
          <input
            type="text"
            placeholder="Search manga by title or author..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            style={{
              width: '100%',
              padding: '1rem 1rem 1rem 3rem',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '0.5rem',
              color: 'white',
              fontSize: '1rem'
            }}
          />
        </div>
        <button 
          onClick={handleSearch}
          disabled={isLoading}
          className="button"
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {isLoading && (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{ fontSize: '1.1rem', opacity: 0.7 }}>Searching manga...</div>
        </div>
      )}

      <div className="manga-grid">
        {results.map((manga) => (
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
            <p style={{ 
              margin: '0 0 1rem 0', 
              opacity: 0.8, 
              fontSize: '0.85rem',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical'
            }}>
              {manga.description}
            </p>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
              {manga.genres.map((genre) => (
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
                Read
              </button>
              <button 
                onClick={() => onAddToLibrary(manga)}
                className="button secondary"
                title="Add to Library"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {results.length === 0 && !isLoading && query && (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{ fontSize: '1.1rem', opacity: 0.7 }}>No manga found for "{query}"</div>
        </div>
      )}
      
      {results.length === 0 && !query && (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{ fontSize: '1.1rem', opacity: 0.7 }}>Start searching to discover manga!</div>
        </div>
      )}
    </div>
  )
}