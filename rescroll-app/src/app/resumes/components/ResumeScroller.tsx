'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { AnimatePresence, motion } from 'framer-motion'

type Resume = {
  id: string
  filename: string
  file_url: string
}

export default function ResumeScroller() {
  const [resumes, setResumes] = useState<Resume[]>([])
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchResumes() {
      setLoading(true)
      const { data, error } = await supabase
        .from('resume_urls')
        .select('id, filename, file_url')
        .order('uploaded_at', { ascending: true })

      if (error || !data) {
        console.error(error)
        setResumes([])
      } else {
        setResumes(data)
      }
      setLoading(false)
    }
    fetchResumes()
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
      Loading resumes…
    </div>
  )
  if (!resumes.length) return (
    <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
      No resumes found.
    </div>
  )

  const { filename, file_url } = resumes[current]
  const prev = () => {
    setDirection(-1)
    setCurrent(c =>
      // if at start, wrap to last; otherwise step back
      c === 0 ? resumes.length - 1 : c - 1
    )
  }
  const next = () => {
    setDirection(1)
    setCurrent(c =>
      // if at end, wrap to first; otherwise step forward
      c === resumes.length - 1 ? 0 : c + 1
    )
  }


  return (
    <div className="h-[calc(100vh-4rem)] bg-white-100 flex flex-col">

      {/* Controls panel + Image */}
      <div className="flex-1 flex">
        {/* Static control panel */}
        <div className="w-70 shadow rounded-l-xl flex-shrink-0 bg-[#dcdee3] p-4 flex flex-col">
          {/* Top: open link */}
          <a
            href={file_url}
            target="_blank"
            rel="noopener noreferrer"
            className="self-start bg-[#ff8c8c] text-white px-3 py-1 rounded shadow transform transition hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0.5 active:shadow-inner">
            Open ↗
          </a>

          {/* Middle: arrows centered */}
          <div className="flex-1 flex flex-col items-center justify-center space-y-4">
            <button
              onClick={prev}
              className="w-full px-3 py-2 bg-[#ff8c8c] text-white rounded shadow transform transition hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0.5 active:shadow-inner"
            >
              ↑
            </button>
            <button
              onClick={next}
              className="w-full px-3 py-2 bg-[#ff8c8c] text-white rounded shadow transform transition hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0.5 active:shadow-inner"
            >
              ↓
            </button>
          </div>
        </div>

        {/* Image pane */}
        <div className="flex-1 mr-4 shadow rounded-r-xl min-w-0 flex items-center justify-center bg-gray-200 p-4">
          {file_url ? (
            <div className="relative shadow-2xl bg-white rounded shadow overflow-hidden">

              <AnimatePresence initial={false} mode="wait">
                <motion.div
                  key={current}
                  className="block max-h-[calc(100vh-8rem)] mx-auto"
                  initial={{ opacity: 0, y: direction > 0 ? 50 : -50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: direction > 0 ? -50 : 50 }}
                  transition={{ duration: 0.4 }}>
                  <img
                    src={file_url}
                    alt={filename}
                    className="object-contain max-h-[calc(100vh-8rem)]"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Top 20% = previous */}
              <div
                onClick={prev}
                className="
                  absolute inset-x-0 top-0 h-[20%] z-20 cursor-pointer group
                  hover:bg-gradient-to-b hover:from-purple-500/40 hover:to-transparent
                  transition-colors
                "
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

              {/* Bottom 20% = next */}
              <div
                onClick={next}
                className="
                  absolute inset-x-0 bottom-0 h-[20%] z-20 cursor-pointer group
                  hover:bg-gradient-to-t hover:from-green-500/40 hover:to-transparent
                  transition-colors
                "
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
            </div>
          ) : (
            <p className="text-red-500">Failed to load image.</p>
          )}
        </div>
      </div>
    </div>
  )
}


