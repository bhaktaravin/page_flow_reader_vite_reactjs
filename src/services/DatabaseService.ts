import initSqlJs from 'sql.js'
import type { Manga, Chapter, ReadingProgress } from '../types/manga'

export interface MangaDatabase {
  addManga(manga: Manga): Promise<void>
  getManga(id: string): Promise<Manga | null>
  getAllManga(): Promise<Manga[]>
  updateManga(manga: Manga): Promise<void>
  deleteManga(id: string): Promise<void>
  
  addChapter(chapter: Chapter): Promise<void>
  getChapters(mangaId: string): Promise<Chapter[]>
  updateChapter(chapter: Chapter): Promise<void>
  
  saveReadingProgress(progress: ReadingProgress): Promise<void>
  getReadingProgress(mangaId: string, chapterId: string): Promise<ReadingProgress | null>
  getAllReadingProgress(): Promise<ReadingProgress[]>
  
  addDownload(mangaId: string, chapterId: string, imageData: string[]): Promise<void>
  getDownloads(mangaId: string): Promise<string[]>
  
  exportDatabase(): Promise<Uint8Array>
  importDatabase(data: Uint8Array): Promise<void>
}

class SQLiteDatabase implements MangaDatabase {
  private db: any = null
  private isInitialized = false

  async initialize(): Promise<void> {
    if (this.isInitialized) return

    try {
      const SQL = await initSqlJs({
        // You might need to specify the path to sql-wasm.wasm
        locateFile: (file) => `https://sql.js.org/dist/${file}`
      })

      // Try to load existing database from localStorage
      const existingDb = localStorage.getItem('manga_database')
      if (existingDb) {
        const buffer = new Uint8Array(JSON.parse(existingDb))
        this.db = new SQL.Database(buffer)
      } else {
        this.db = new SQL.Database()
      }

      this.createTables()
      this.isInitialized = true
    } catch (error) {
      console.error('Failed to initialize SQLite:', error)
      // Fallback to localStorage if SQLite fails
      throw new Error('SQLite initialization failed')
    }
  }

  private createTables(): void {
    // Manga table
    this.db.run(`
      CREATE TABLE IF NOT EXISTS manga (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        author TEXT NOT NULL,
        description TEXT,
        cover_image TEXT,
        status TEXT,
        genres TEXT, -- JSON array
        added_to_library BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Chapters table
    this.db.run(`
      CREATE TABLE IF NOT EXISTS chapters (
        id TEXT PRIMARY KEY,
        manga_id TEXT NOT NULL,
        number TEXT NOT NULL,
        title TEXT,
        pages TEXT, -- JSON array
        is_downloaded BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (manga_id) REFERENCES manga (id) ON DELETE CASCADE
      )
    `)

    // Reading progress table
    this.db.run(`
      CREATE TABLE IF NOT EXISTS reading_progress (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        manga_id TEXT NOT NULL,
        chapter_id TEXT NOT NULL,
        page_index INTEGER DEFAULT 0,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(manga_id, chapter_id),
        FOREIGN KEY (manga_id) REFERENCES manga (id) ON DELETE CASCADE,
        FOREIGN KEY (chapter_id) REFERENCES chapters (id) ON DELETE CASCADE
      )
    `)

    // Downloads table (for offline content)
    this.db.run(`
      CREATE TABLE IF NOT EXISTS downloads (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        manga_id TEXT NOT NULL,
        chapter_id TEXT NOT NULL,
        page_index INTEGER NOT NULL,
        image_data TEXT NOT NULL, -- base64 encoded image
        downloaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (manga_id) REFERENCES manga (id) ON DELETE CASCADE,
        FOREIGN KEY (chapter_id) REFERENCES chapters (id) ON DELETE CASCADE
      )
    `)

    // User preferences table
    this.db.run(`
      CREATE TABLE IF NOT EXISTS user_preferences (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Search history table
    this.db.run(`
      CREATE TABLE IF NOT EXISTS search_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        query TEXT NOT NULL,
        searched_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)

    this.saveDatabase()
  }

  private saveDatabase(): void {
    try {
      const data = this.db.export()
      localStorage.setItem('manga_database', JSON.stringify(Array.from(data)))
    } catch (error) {
      console.error('Failed to save database:', error)
    }
  }

  async addManga(manga: Manga): Promise<void> {
    await this.initialize()

    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO manga 
      (id, title, author, description, cover_image, status, genres, added_to_library)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `)

    stmt.run([
      manga.id,
      manga.title,
      manga.author,
      manga.description,
      manga.coverImage,
      manga.status,
      JSON.stringify(manga.genres),
      manga.addedToLibrary ? 1 : 0
    ])

    stmt.free()

    // Add chapters
    for (const chapter of manga.chapters) {
      await this.addChapter(chapter)
    }

    this.saveDatabase()
  }

  async getManga(id: string): Promise<Manga | null> {
    await this.initialize()

    const stmt = this.db.prepare('SELECT * FROM manga WHERE id = ?')
    const result = stmt.getAsObject([id])
    stmt.free()

    if (!result.id) return null

    const chapters = await this.getChapters(id)
    const downloadedChapters = await this.getDownloads(id)

    return {
      id: result.id as string,
      title: result.title as string,
      author: result.author as string,
      description: result.description as string,
      coverImage: result.cover_image as string,
      status: result.status as 'ongoing' | 'completed' | 'hiatus',
      genres: JSON.parse(result.genres as string),
      chapters,
      addedToLibrary: Boolean(result.added_to_library),
      downloadedChapters
    }
  }

  async getAllManga(): Promise<Manga[]> {
    await this.initialize()

    const stmt = this.db.prepare('SELECT * FROM manga ORDER BY updated_at DESC')
    const results: Manga[] = []

    while (stmt.step()) {
      const row = stmt.getAsObject()
      const chapters = await this.getChapters(row.id as string)
      const downloadedChapters = await this.getDownloads(row.id as string)

      results.push({
        id: row.id as string,
        title: row.title as string,
        author: row.author as string,
        description: row.description as string,
        coverImage: row.cover_image as string,
        status: row.status as 'ongoing' | 'completed' | 'hiatus',
        genres: JSON.parse(row.genres as string),
        chapters,
        addedToLibrary: Boolean(row.added_to_library),
        downloadedChapters
      })
    }

    stmt.free()
    return results
  }

  async updateManga(manga: Manga): Promise<void> {
    await this.addManga(manga) // INSERT OR REPLACE handles updates
  }

  async deleteManga(id: string): Promise<void> {
    await this.initialize()

    const stmt = this.db.prepare('DELETE FROM manga WHERE id = ?')
    stmt.run([id])
    stmt.free()

    this.saveDatabase()
  }

  async addChapter(chapter: Chapter): Promise<void> {
    await this.initialize()

    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO chapters 
      (id, manga_id, number, title, pages, is_downloaded)
      VALUES (?, ?, ?, ?, ?, ?)
    `)

    stmt.run([
      chapter.id,
      chapter.mangaId,
      chapter.number,
      chapter.title,
      JSON.stringify(chapter.pages),
      chapter.isDownloaded ? 1 : 0
    ])

    stmt.free()
    this.saveDatabase()
  }

  async getChapters(mangaId: string): Promise<Chapter[]> {
    await this.initialize()

    const stmt = this.db.prepare('SELECT * FROM chapters WHERE manga_id = ? ORDER BY number ASC')
    const results: Chapter[] = []

    stmt.bind([mangaId])
    while (stmt.step()) {
      const row = stmt.getAsObject()
      results.push({
        id: row.id as string,
        mangaId: row.manga_id as string,
        number: row.number as string,
        title: row.title as string,
        pages: JSON.parse(row.pages as string),
        isDownloaded: Boolean(row.is_downloaded)
      })
    }

    stmt.free()
    return results
  }

  async updateChapter(chapter: Chapter): Promise<void> {
    await this.addChapter(chapter) // INSERT OR REPLACE handles updates
  }

  async saveReadingProgress(progress: ReadingProgress): Promise<void> {
    await this.initialize()

    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO reading_progress 
      (manga_id, chapter_id, page_index, timestamp)
      VALUES (?, ?, ?, ?)
    `)

    stmt.run([
      progress.mangaId,
      progress.chapterId,
      progress.pageIndex,
      progress.timestamp.toISOString()
    ])

    stmt.free()
    this.saveDatabase()
  }

  async getReadingProgress(mangaId: string, chapterId: string): Promise<ReadingProgress | null> {
    await this.initialize()

    const stmt = this.db.prepare(`
      SELECT * FROM reading_progress 
      WHERE manga_id = ? AND chapter_id = ?
    `)

    const result = stmt.getAsObject([mangaId, chapterId])
    stmt.free()

    if (!result.manga_id) return null

    return {
      mangaId: result.manga_id as string,
      chapterId: result.chapter_id as string,
      pageIndex: result.page_index as number,
      timestamp: new Date(result.timestamp as string)
    }
  }

  async getAllReadingProgress(): Promise<ReadingProgress[]> {
    await this.initialize()

    const stmt = this.db.prepare('SELECT * FROM reading_progress ORDER BY timestamp DESC')
    const results: ReadingProgress[] = []

    while (stmt.step()) {
      const row = stmt.getAsObject()
      results.push({
        mangaId: row.manga_id as string,
        chapterId: row.chapter_id as string,
        pageIndex: row.page_index as number,
        timestamp: new Date(row.timestamp as string)
      })
    }

    stmt.free()
    return results
  }

  async addDownload(mangaId: string, chapterId: string, imageData: string[]): Promise<void> {
    await this.initialize()

    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO downloads 
      (manga_id, chapter_id, page_index, image_data)
      VALUES (?, ?, ?, ?)
    `)

    imageData.forEach((data, index) => {
      stmt.run([mangaId, chapterId, index, data])
    })

    stmt.free()

    // Update chapter as downloaded
    const updateStmt = this.db.prepare('UPDATE chapters SET is_downloaded = 1 WHERE id = ?')
    updateStmt.run([chapterId])
    updateStmt.free()

    this.saveDatabase()
  }

  async getDownloads(mangaId: string): Promise<string[]> {
    await this.initialize()

    const stmt = this.db.prepare(`
      SELECT DISTINCT chapter_id FROM downloads 
      WHERE manga_id = ?
    `)

    const results: string[] = []
    stmt.bind([mangaId])
    while (stmt.step()) {
      const row = stmt.getAsObject()
      results.push(row.chapter_id as string)
    }

    stmt.free()
    return results
  }

  async exportDatabase(): Promise<Uint8Array> {
    await this.initialize()
    return this.db.export()
  }

  async importDatabase(data: Uint8Array): Promise<void> {
    const SQL = await initSqlJs({
      locateFile: (file) => `https://sql.js.org/dist/${file}`
    })

    this.db = new SQL.Database(data)
    this.isInitialized = true
    this.saveDatabase()
  }

  // Search functionality
  async searchManga(query: string): Promise<Manga[]> {
    await this.initialize()

    const stmt = this.db.prepare(`
      SELECT * FROM manga 
      WHERE title LIKE ? OR author LIKE ?
      ORDER BY title ASC
    `)

    const searchQuery = `%${query}%`
    const results: Manga[] = []

    stmt.bind([searchQuery, searchQuery])
    while (stmt.step()) {
      const row = stmt.getAsObject()
      const chapters = await this.getChapters(row.id as string)
      const downloadedChapters = await this.getDownloads(row.id as string)

      results.push({
        id: row.id as string,
        title: row.title as string,
        author: row.author as string,
        description: row.description as string,
        coverImage: row.cover_image as string,
        status: row.status as 'ongoing' | 'completed' | 'hiatus',
        genres: JSON.parse(row.genres as string),
        chapters,
        addedToLibrary: Boolean(row.added_to_library),
        downloadedChapters
      })
    }

    stmt.free()
    return results
  }

  // Analytics and insights
  async getReadingStats(): Promise<{
    totalManga: number
    totalChapters: number
    totalPagesRead: number
    readingStreak: number
    favoriteGenres: string[]
  }> {
    await this.initialize()

    const totalManga = this.db.exec('SELECT COUNT(*) as count FROM manga WHERE added_to_library = 1')[0]?.values[0][0] || 0
    const totalChapters = this.db.exec('SELECT COUNT(*) as count FROM chapters')[0]?.values[0][0] || 0
    const totalProgress = this.db.exec('SELECT SUM(page_index) as total FROM reading_progress')[0]?.values[0][0] || 0

    // Get favorite genres (simplified)
    const genreStats = this.db.exec(`
      SELECT genres FROM manga WHERE added_to_library = 1
    `)

    const allGenres: string[] = []
    genreStats[0]?.values.forEach((row: any) => {
      const genres = JSON.parse(row[0])
      allGenres.push(...genres)
    })

    const genreCounts = allGenres.reduce((acc, genre) => {
      acc[genre] = (acc[genre] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const favoriteGenres = Object.entries(genreCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([genre]) => genre)

    return {
      totalManga: Number(totalManga),
      totalChapters: Number(totalChapters),
      totalPagesRead: Number(totalProgress),
      readingStreak: 0, // Would need more complex logic
      favoriteGenres
    }
  }
}

// Singleton instance
export const mangaDatabase = new SQLiteDatabase()