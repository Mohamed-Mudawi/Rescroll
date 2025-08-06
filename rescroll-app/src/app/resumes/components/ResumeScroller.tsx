'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { resumesApi, type Resume } from '@/lib/supabase'
import { AnimatePresence, motion } from 'framer-motion'

type Props = {
  industry: string
  level: string
}

export default function ResumeScroller({ industry, level }: Props) {
  const [resumes, setResumes] = useState<Resume[]>([])
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')

  // Fetch resumes with proper error handling
  const fetchResumes = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      
      const data = await resumesApi.fetchResumes(
        industry === 'all' ? undefined : industry,
        level === 'all' ? undefined : level
      )
      
      setResumes(data)
      setCurrent(0) // Reset to first resume when filters change
    } catch (err) {
      console.error('Error fetching resumes:', err)
      setError('Failed to load resumes. Please try again.')
      setResumes([])
    } finally {
      setLoading(false)
    }
  }, [industry, level])

  useEffect(() => {
    fetchResumes()
  }, [fetchResumes])

  // Navigation handlers
  const prev = useCallback(() => {
    setDirection(-1)
    setCurrent((c) => (c === 0 ? resumes.length - 1 : c - 1))
  }, [resumes.length])

  const next = useCallback(() => {
    setDirection(1)
    setCurrent((c) => (c === resumes.length - 1 ? 0 : c + 1))
  }, [resumes.length])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault()
        prev()
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault()
        next()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [prev, next])

  // Current resume data
  const currentResume = useMemo(() => {
    return resumes[current] || null
  }, [resumes, current])

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Loading resumes...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchResumes}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  // No resumes found
  if (!resumes.length) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="text-center">
          <p className="text-gray-600 mb-2">No resumes found.</p>
          <p className="text-sm text-gray-500">
            Try adjusting your filters or check back later.
          </p>
        </div>
      </div>
    )
  }

  const { filename, file_url } = currentResume

  return (
    <div className="h-[calc(100vh-4rem)] bg-white-100 flex flex-col">
      {/* Controls panel + Image */}
      <div className="flex-1 flex">
        {/* Static control panel */}
        <div className="w-60 shadow rounded-l-xl flex-shrink-0 bg-[#dcdee3] p-4 flex flex-col">
          {/* Top: Resume info and open link */}
          <div className="mb-4">
            <p className="text-sm text-gray-700 mb-2 truncate" title={filename}>
              {filename}
            </p>
            <p className="text-xs text-gray-500 mb-3">
              {current + 1} of {resumes.length}
            </p>
            <a
              href={file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[#ff8c8c] text-white px-3 py-1 rounded shadow transform transition hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0.5 active:shadow-inner text-sm"
            >
              Open in New Tab ↗
            </a>
          </div>

          {/* Middle: arrows centered */}
          <div className="flex-1 flex flex-col items-center justify-center space-y-4">
            <button
              onClick={prev}
              className="w-full px-3 py-2 bg-[#ff8c8c] text-white rounded shadow transform transition hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0.5 active:shadow-inner"
              title="Previous resume (↑ or ←)"
            >
              ↑ Previous
            </button>
            <button
              onClick={next}
              className="w-full px-3 py-2 bg-[#ff8c8c] text-white rounded shadow transform transition hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0.5 active:shadow-inner"
              title="Next resume (↓ or →)"
            >
              ↓ Next
            </button>
          </div>

          {/* Bottom: Keyboard hints */}
          <div className="text-xs text-gray-600 mt-4">
            <p>Keyboard shortcuts:</p>
            <p>↑/← Previous</p>
            <p>↓/→ Next</p>
          </div>
        </div>

        {/* Image pane */}
        <div className="flex-1 mr-4 shadow rounded-r-xl min-w-0 flex items-center justify-center bg-gray-200 p-4">
          {file_url ? (
            <div className="relative shadow-2xl bg-white rounded shadow overflow-hidden max-w-full max-h-full">
              <AnimatePresence initial={false} mode="wait">
                <motion.div
                  key={current}
                  className="block max-h-[calc(100vh-8rem)] mx-auto"
                  initial={{ opacity: 0, y: direction > 0 ? 50 : -50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: direction > 0 ? -50 : 50 }}
                  transition={{ duration: 0.4 }}
                >
                  <img
                    src={file_url}
                    alt={`Resume: ${filename}`}
                    className="object-contain max-h-[calc(100vh-8rem)] max-w-full"
                    onError={(e) => {
                      console.error('Failed to load image:', file_url)
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                    }}
                  />
                </motion.div>
              </AnimatePresence>

              {/* Top 20% = previous (only show if there are multiple resumes) */}
              {resumes.length > 1 && (
                <div
                  onClick={prev}
                  className="
                    absolute inset-x-0 top-0 h-[20%] z-20 cursor-pointer group
                    hover:bg-gradient-to-b hover:from-purple-500/40 hover:to-transparent
                    transition-colors
                  "
                  title="Click to go to previous resume"
                >
                  <span
                    className="
                      absolute inset-0 flex items-center justify-center
                      text-white text-lg font-semibold px-2
                      opacity-0 group-hover:opacity-100
                      transition-opacity
                    "
                  >
                    Previous resume
                  </span>
                </div>
              )}

              {/* Bottom 20% = next (only show if there are multiple resumes) */}
              {resumes.length > 1 && (
                <div
                  onClick={next}
                  className="
                    absolute inset-x-0 bottom-0 h-[20%] z-20 cursor-pointer group
                    hover:bg-gradient-to-t hover:from-green-500/40 hover:to-transparent
                    transition-colors
                  "
                  title="Click to go to next resume"
                >
                  <span
                    className="
                      absolute inset-0 flex items-center justify-center
                      text-white text-lg font-semibold px-2
                      opacity-0 group-hover:opacity-100
                      transition-opacity
                    "
                  >
                    Next resume
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center">
              <p className="text-red-500 mb-2">Failed to load resume image.</p>
              <button
                onClick={fetchResumes}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Refresh
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}