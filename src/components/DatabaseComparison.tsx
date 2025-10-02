import { Database, Cloud, Smartphone, Zap, Shield, DollarSign } from 'lucide-react'

interface DatabaseComparisonProps {
  onSelectDatabase: (type: 'sqlite' | 'mongodb') => void
}

export function DatabaseComparison({ onSelectDatabase }: DatabaseComparisonProps) {
  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>
        Choose Your Database Solution
      </h1>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', 
        gap: '2rem',
        marginBottom: '2rem'
      }}>
        {/* SQLite Option */}
        <div className="card" style={{ position: 'relative' }}>
          <div style={{ 
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: '#4ecdc4',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '1rem',
            fontSize: '0.8rem',
            fontWeight: 'bold'
          }}>
            RECOMMENDED
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <Database size={32} style={{ color: '#4ecdc4' }} />
            <h2 style={{ margin: 0 }}>SQLite</h2>
          </div>

          <p style={{ marginBottom: '1.5rem', opacity: 0.8 }}>
            Perfect for offline-first manga apps with local storage and sync capabilities.
          </p>

          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem' }}>✅ Pros</h3>
            <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
              <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Smartphone size={16} />
                <span>Offline-first design</span>
              </li>
              <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Zap size={16} />
                <span>Lightning fast queries</span>
              </li>
              <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Shield size={16} />
                <span>ACID compliance</span>
              </li>
              <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <DollarSign size={16} />
                <span>No server costs</span>
              </li>
            </ul>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem' }}>⚠️ Cons</h3>
            <ul style={{ margin: 0, paddingLeft: '1.5rem', opacity: 0.7 }}>
              <li style={{ marginBottom: '0.5rem' }}>Limited concurrent writes</li>
              <li style={{ marginBottom: '0.5rem' }}>Manual sync implementation needed</li>
              <li style={{ marginBottom: '0.5rem' }}>Size limitations for massive datasets</li>
            </ul>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ margin: '0 0 0.5rem 0' }}>Best For:</h4>
            <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.8 }}>
              Mobile apps, offline reading, single-user applications, PWAs, desktop apps
            </p>
          </div>

          <button 
            onClick={() => onSelectDatabase('sqlite')}
            className="button"
            style={{ width: '100%' }}
          >
            Choose SQLite
          </button>
        </div>

        {/* MongoDB Option */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <Cloud size={32} style={{ color: '#ff6b6b' }} />
            <h2 style={{ margin: 0 }}>MongoDB</h2>
          </div>

          <p style={{ marginBottom: '1.5rem', opacity: 0.8 }}>
            Ideal for scalable web applications with complex queries and team collaboration.
          </p>

          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem' }}>✅ Pros</h3>
            <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
              <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Cloud size={16} />
                <span>Built-in cloud sync</span>
              </li>
              <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Zap size={16} />
                <span>Horizontal scaling</span>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>Flexible schema</li>
              <li style={{ marginBottom: '0.5rem' }}>Rich query capabilities</li>
              <li style={{ marginBottom: '0.5rem' }}>Real-time features</li>
            </ul>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem' }}>⚠️ Cons</h3>
            <ul style={{ margin: 0, paddingLeft: '1.5rem', opacity: 0.7 }}>
              <li style={{ marginBottom: '0.5rem' }}>Requires server infrastructure</li>
              <li style={{ marginBottom: '0.5rem' }}>Network dependency</li>
              <li style={{ marginBottom: '0.5rem' }}>Higher resource usage</li>
              <li style={{ marginBottom: '0.5rem' }}>Ongoing hosting costs</li>
            </ul>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ margin: '0 0 0.5rem 0' }}>Best For:</h4>
            <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.8 }}>
              Web apps, multi-user platforms, real-time features, analytics, team projects
            </p>
          </div>

          <button 
            onClick={() => onSelectDatabase('mongodb')}
            className="button secondary"
            style={{ width: '100%' }}
          >
            Choose MongoDB
          </button>
        </div>
      </div>

      {/* Feature Comparison Table */}
      <div className="card">
        <h3 style={{ marginBottom: '1.5rem' }}>Feature Comparison</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse',
            fontSize: '0.9rem'
          }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Feature</th>
                <th style={{ padding: '1rem', textAlign: 'center' }}>SQLite</th>
                <th style={{ padding: '1rem', textAlign: 'center' }}>MongoDB</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Offline Support', '✅ Excellent', '❌ Limited'],
                ['Setup Complexity', '✅ Simple', '⚠️ Moderate'],
                ['Scalability', '⚠️ Limited', '✅ Excellent'],
                ['Query Performance', '✅ Fast', '✅ Fast'],
                ['Multi-user Support', '❌ Limited', '✅ Excellent'],
                ['Storage Cost', '✅ Free', '💰 Paid'],
                ['Real-time Features', '❌ Manual', '✅ Built-in'],
                ['Mobile Support', '✅ Excellent', '⚠️ Requires API'],
                ['Backup/Sync', '⚠️ Manual', '✅ Automatic'],
                ['Development Speed', '✅ Fast', '⚠️ Moderate']
              ].map(([feature, sqlite, mongodb], index) => (
                <tr key={index} style={{ 
                  borderBottom: '1px solid rgba(255,255,255,0.1)',
                  background: index % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent'
                }}>
                  <td style={{ padding: '0.75rem', fontWeight: '500' }}>{feature}</td>
                  <td style={{ padding: '0.75rem', textAlign: 'center' }}>{sqlite}</td>
                  <td style={{ padding: '0.75rem', textAlign: 'center' }}>{mongodb}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Implementation Guide */}
      <div className="card">
        <h3 style={{ marginBottom: '1.5rem' }}>Implementation Guide</h3>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
          gap: '1.5rem' 
        }}>
          <div>
            <h4 style={{ margin: '0 0 1rem 0', color: '#4ecdc4' }}>SQLite Setup</h4>
            <div style={{ 
              background: 'rgba(0,0,0,0.3)', 
              padding: '1rem', 
              borderRadius: '0.5rem',
              fontSize: '0.85rem'
            }}>
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{`npm install sql.js @types/sql.js

// Initialize database
import initSqlJs from 'sql.js'
const SQL = await initSqlJs()
const db = new SQL.Database()

// Create tables and use locally
// Sync with cloud when needed`}</pre>
            </div>
          </div>

          <div>
            <h4 style={{ margin: '0 0 1rem 0', color: '#ff6b6b' }}>MongoDB Setup</h4>
            <div style={{ 
              background: 'rgba(0,0,0,0.3)', 
              padding: '1rem', 
              borderRadius: '0.5rem',
              fontSize: '0.85rem'
            }}>
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{`npm install mongodb mongoose

// Connect to MongoDB
import mongoose from 'mongoose'
await mongoose.connect(uri)

// Define schemas and models
// Built-in sync and scaling`}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}