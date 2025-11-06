'use client'

import { useState, useEffect, useRef } from 'react'
import styles from './page.module.css'

interface Track {
  id: number
  title: string
  artist: {
    name: string
    picture_small: string
  }
  album: {
    title: string
    cover_medium: string
  }
  duration: number
  preview: string
}

interface Album {
  id: number
  title: string
  cover_medium: string
  artist: {
    name: string
  }
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const [tracks, setTracks] = useState<Track[]>([])
  const [albums, setAlbums] = useState<Album[]>([])
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [loading, setLoading] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    fetchChartTracks()
    fetchChartAlbums()
  }, [])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener('timeupdate', updateProgress)
      audioRef.current.addEventListener('ended', handleTrackEnd)
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('timeupdate', updateProgress)
        audioRef.current.removeEventListener('ended', handleTrackEnd)
      }
    }
  }, [currentTrack])

  const fetchChartTracks = async () => {
    try {
      const res = await fetch('https://api.deezer.com/chart/0/tracks')
      const data = await res.json()
      setTracks(data.data.slice(0, 20))
    } catch (error) {
      console.error('Error fetching tracks:', error)
    }
  }

  const fetchChartAlbums = async () => {
    try {
      const res = await fetch('https://api.deezer.com/chart/0/albums')
      const data = await res.json()
      setAlbums(data.data.slice(0, 10))
    } catch (error) {
      console.error('Error fetching albums:', error)
    }
  }

  const searchMusic = async (query: string) => {
    if (!query.trim()) {
      fetchChartTracks()
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`https://api.deezer.com/search?q=${encodeURIComponent(query)}`)
      const data = await res.json()
      setTracks(data.data || [])
    } catch (error) {
      console.error('Error searching:', error)
    }
    setLoading(false)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    searchMusic(searchQuery)
  }

  const playTrack = (track: Track) => {
    if (currentTrack?.id === track.id && isPlaying) {
      audioRef.current?.pause()
      setIsPlaying(false)
    } else {
      setCurrentTrack(track)
      setIsPlaying(true)
      if (audioRef.current) {
        audioRef.current.src = track.preview
        audioRef.current.play()
      }
    }
  }

  const togglePlayPause = () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const updateProgress = () => {
    if (audioRef.current) {
      const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100
      setProgress(progress)
    }
  }

  const handleTrackEnd = () => {
    setIsPlaying(false)
    setProgress(0)
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const seekTrack = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current) return
    const rect = e.currentTarget.getBoundingClientRect()
    const percent = (e.clientX - rect.left) / rect.width
    audioRef.current.currentTime = percent * audioRef.current.duration
  }

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <svg viewBox="0 0 24 24" fill="currentColor" width="40" height="40">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
          </svg>
          <h1>Spotify Clone</h1>
        </div>
        <nav className={styles.nav}>
          <button className={styles.navItem}>
            <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M12.5 3.247a1 1 0 0 0-1 0L4 7.577V20h4.5v-6a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v6H20V7.577l-7.5-4.33zm-2-1.732a3 3 0 0 1 3 0l7.5 4.33a2 2 0 0 1 1 1.732V21a1 1 0 0 1-1 1h-6.5a1 1 0 0 1-1-1v-6h-3v6a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7.577a2 2 0 0 1 1-1.732l7.5-4.33z"/>
            </svg>
            Home
          </button>
          <button className={styles.navItem}>
            <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M10.533 1.279c-5.18 0-9.407 4.14-9.407 9.279s4.226 9.279 9.407 9.279c2.234 0 4.29-.77 5.907-2.058l4.353 4.353a1 1 0 1 0 1.414-1.414l-4.344-4.344a9.157 9.157 0 0 0 2.077-5.816c0-5.14-4.226-9.28-9.407-9.28zm-7.407 9.279c0-4.006 3.302-7.28 7.407-7.28s7.407 3.274 7.407 7.28-3.302 7.279-7.407 7.279-7.407-3.273-7.407-7.28z"/>
            </svg>
            Search
          </button>
          <button className={styles.navItem}>
            <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M14.5 2.134a1 1 0 0 1 1 0l6 3.464a1 1 0 0 1 .5.866V21a1 1 0 0 1-1 1h-6a1 1 0 0 1-1-1V3a1 1 0 0 1 .5-.866zM16 4.732V20h4V7.041l-4-2.309zM3 22a1 1 0 0 1-1-1V3a1 1 0 0 1 2 0v18a1 1 0 0 1-1 1zm6 0a1 1 0 0 1-1-1V3a1 1 0 0 1 2 0v18a1 1 0 0 1-1 1z"/>
            </svg>
            Your Library
          </button>
        </nav>
      </aside>

      <main className={styles.main}>
        <header className={styles.header}>
          <form onSubmit={handleSearch} className={styles.searchForm}>
            <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M10.533 1.279c-5.18 0-9.407 4.14-9.407 9.279s4.226 9.279 9.407 9.279c2.234 0 4.29-.77 5.907-2.058l4.353 4.353a1 1 0 1 0 1.414-1.414l-4.344-4.344a9.157 9.157 0 0 0 2.077-5.816c0-5.14-4.226-9.28-9.407-9.28zm-7.407 9.279c0-4.006 3.302-7.28 7.407-7.28s7.407 3.274 7.407 7.28-3.302 7.279-7.407 7.279-7.407-3.273-7.407-7.28z"/>
            </svg>
            <input
              type="text"
              placeholder="What do you want to listen to?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </form>
        </header>

        <div className={styles.content}>
          {!searchQuery && albums.length > 0 && (
            <section className={styles.section}>
              <h2>Popular Albums</h2>
              <div className={styles.albumGrid}>
                {albums.map((album) => (
                  <div key={album.id} className={styles.albumCard}>
                    <img src={album.cover_medium} alt={album.title} />
                    <h3>{album.title}</h3>
                    <p>{album.artist.name}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className={styles.section}>
            <h2>{searchQuery ? 'Search Results' : 'Popular Tracks'}</h2>
            {loading ? (
              <div className={styles.loading}>Loading...</div>
            ) : (
              <div className={styles.trackList}>
                {tracks.map((track, index) => (
                  <div
                    key={track.id}
                    className={`${styles.trackItem} ${currentTrack?.id === track.id ? styles.active : ''}`}
                    onClick={() => playTrack(track)}
                  >
                    <div className={styles.trackNumber}>
                      {currentTrack?.id === track.id && isPlaying ? (
                        <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                          <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                        </svg>
                      ) : (
                        <span>{index + 1}</span>
                      )}
                    </div>
                    <img src={track.album.cover_medium} alt={track.title} className={styles.trackImage} />
                    <div className={styles.trackInfo}>
                      <div className={styles.trackTitle}>{track.title}</div>
                      <div className={styles.trackArtist}>{track.artist.name}</div>
                    </div>
                    <div className={styles.trackAlbum}>{track.album.title}</div>
                    <div className={styles.trackDuration}>{formatDuration(track.duration)}</div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      {currentTrack && (
        <footer className={styles.player}>
          <div className={styles.playerTrack}>
            <img src={currentTrack.album.cover_medium} alt={currentTrack.title} />
            <div className={styles.playerTrackInfo}>
              <div className={styles.playerTrackTitle}>{currentTrack.title}</div>
              <div className={styles.playerTrackArtist}>{currentTrack.artist.name}</div>
            </div>
          </div>

          <div className={styles.playerControls}>
            <div className={styles.playerButtons}>
              <button className={styles.playerButton} onClick={togglePlayPause}>
                {isPlaying ? (
                  <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
                    <path d="M7 4v16l13-8z"/>
                  </svg>
                )}
              </button>
            </div>
            <div className={styles.playerProgress} onClick={seekTrack}>
              <div className={styles.playerProgressBar} style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div className={styles.playerVolume}>
            <span className={styles.volumeText}>Preview (30s)</span>
          </div>
        </footer>
      )}

      <audio ref={audioRef} />
    </div>
  )
}
