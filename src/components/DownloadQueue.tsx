import { Download, CheckCircle, Trash2 } from 'lucide-react'
import type { Manga, Chapter } from '../types/manga'

interface DownloadQueueProps {
  queue: {manga: Manga, chapter: Chapter}[]
  onClearQueue: () => void
}

export function DownloadQueue({ queue, onClearQueue }: DownloadQueueProps) {
  if (queue.length === 0) {
    return (
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
    )
  }

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        marginBottom: '2rem' 
      }}>
        <div>
          <h1 style={{ margin: '0 0 0.5rem 0' }}>Download Queue</h1>
          <p style={{ opacity: 0.7, margin: 0 }}>
            {queue.length} items in queue
          </p>
        </div>
        <button 
          onClick={onClearQueue}
          className="button secondary"
        >
          <Trash2 size={18} />
          Clear Queue
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {queue.map((item, index) => (
          <div 
            key={`${item.manga.id}-${item.chapter.id}-${index}`}
            className="card"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '1rem',
              padding: '1.5rem'
            }}
          >
            <img 
              src={item.manga.coverImage} 
              alt={item.manga.title}
              style={{
                width: '60px',
                height: '80px',
                objectFit: 'cover',
                borderRadius: '0.5rem'
              }}
            />
            
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>
                {item.manga.title}
              </h3>
              <p style={{ margin: '0 0 0.5rem 0', opacity: 0.7, fontSize: '0.9rem' }}>
                Chapter {item.chapter.number} - {item.chapter.title}
              </p>
              <p style={{ margin: 0, opacity: 0.6, fontSize: '0.85rem' }}>
                {item.chapter.pages.length} pages
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {item.chapter.isDownloaded ? (
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem',
                  color: '#4ecdc4'
                }}>
                  <CheckCircle size={20} />
                  <span>Downloaded</span>
                </div>
              ) : (
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem',
                  opacity: 0.7
                }}>
                  <Download size={20} />
                  <span>Downloading...</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div style={{ 
        marginTop: '2rem', 
        padding: '1.5rem',
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '1rem',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <h3 style={{ margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Download size={20} />
          Download Info
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div>
            <div style={{ opacity: 0.7, fontSize: '0.9rem' }}>Total Downloads</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{queue.length}</div>
          </div>
          <div>
            <div style={{ opacity: 0.7, fontSize: '0.9rem' }}>Completed</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#4ecdc4' }}>
              {queue.filter(item => item.chapter.isDownloaded).length}
            </div>
          </div>
          <div>
            <div style={{ opacity: 0.7, fontSize: '0.9rem' }}>In Progress</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ff6b6b' }}>
              {queue.filter(item => !item.chapter.isDownloaded).length}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}