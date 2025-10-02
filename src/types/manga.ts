export interface Manga {
  id: string
  title: string
  author: string
  description: string
  coverImage: string
  status: 'ongoing' | 'completed' | 'hiatus'
  genres: string[]
  chapters: Chapter[]
  lastRead?: string // chapter id
  addedToLibrary: boolean
  downloadedChapters: string[] // chapter ids
}

export interface Chapter {
  id: string
  number: string
  title: string
  pages: string[]
  downloadedPages?: string[] // base64 encoded images for offline
  isDownloaded: boolean
  readAt?: Date
  mangaId: string
}

export interface MangaSource {
  id: string
  name: string
  baseUrl: string
  isActive: boolean
}

export interface DownloadProgress {
  mangaId: string
  chapterId: string
  progress: number
  total: number
  status: 'pending' | 'downloading' | 'completed' | 'error'
}

export interface ReadingProgress {
  mangaId: string
  chapterId: string
  pageIndex: number
  timestamp: Date
}