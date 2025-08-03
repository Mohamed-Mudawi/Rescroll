'use client'

import { useState } from 'react'
import FilterSidebar from './components/filter_sidebar'
import ResumeScroller from './components/ResumeScroller'

export default function ResumesPage() {
  const [activeFilter, setActiveFilter] = useState<string>('all')

  return (
    <main className="pt-0 flex min-h-screen bg-white">
      <FilterSidebar active={activeFilter} onSelect={setActiveFilter} />

      <section className="flex-1 p-6">
        <ResumeScroller />
      </section>
    </main>
  )
}