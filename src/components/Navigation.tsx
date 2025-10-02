import { Library, Search, Download, BookOpen } from 'lucide-react'

interface NavigationProps {
  currentView: 'library' | 'search' | 'reader' | 'downloads'
  onViewChange: (view: 'library' | 'search' | 'reader' | 'downloads') => void
  downloadQueueCount: number
}

export function Navigation({ currentView, onViewChange, downloadQueueCount }: NavigationProps) {
  return (
    <nav className="navigation">
      <div className="nav-title">
        <BookOpen size={24} />
        MangaReader
      </div>
      
      <div className="nav-buttons">
        <button 
          className={`nav-button ${currentView === 'library' ? 'active' : ''}`}
          onClick={() => onViewChange('library')}
        >
          <Library size={18} />
          Library
        </button>
        
        <button 
          className={`nav-button ${currentView === 'search' ? 'active' : ''}`}
          onClick={() => onViewChange('search')}
        >
          <Search size={18} />
          Search
        </button>
        
        <button 
          className={`nav-button ${currentView === 'downloads' ? 'active' : ''}`}
          onClick={() => onViewChange('downloads')}
        >
          <Download size={18} />
          Downloads
          {downloadQueueCount > 0 && (
            <span className="download-badge">{downloadQueueCount}</span>
          )}
        </button>
      </div>
    </nav>
  )
}