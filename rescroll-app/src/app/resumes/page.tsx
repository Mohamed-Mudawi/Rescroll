'use client'

import { useState } from 'react'
import FilterSidebar from './components/filter_sidebar'
import ResumeScroller from './components/ResumeScroller'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function ResumesPage() {
  const [activeLevel, setActiveLevel] = useState<string>('all')
  const [industry,    setIndustry   ] = useState<string>('')
  const [collapsed,   setCollapsed  ] = useState(false)

  return (
    <main className="flex min-h-screen bg-white">

      {/* Sidebar + Toggle */}
      <div className="relative flex-shrink-0">
        {/* Sidebar */}
        <div
          className={`
            transition-all duration-300 
            overflow-hidden bg-gray-50 border-r border-gray-200
            ${collapsed ? 'w-0' : 'w-60 h-full'}
          `}
        >
          <FilterSidebar
            activeLevel={activeLevel}
            onLevelSelect={setActiveLevel}
            industrySearch={industry}
            onIndustrySearch={setIndustry}
          />
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? 'Show filters' : 'Hide filters'}
          className={`absolute left-full top-1/3 transform -translate-y-1/2
            p-2 bg-gray-50 border border-gray-200 rounded-r-md
            hover:bg-gray-100 focus:outline-none text-[#bdbdbd]`}>
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft  size={20} />}
        </button>
      </div>

      {/* Main Scroller */}
      <section className="flex-1 p-6">
        <ResumeScroller industry={industry} level={activeLevel} />
      </section>
    </main>
  )
}