'use client'

import React from 'react'

const FILTERS = [
  { id: 'all',      label: 'All' },
  { id: 'jobs',     label: 'Job Resumes' },
  { id: 'colleges', label: 'College Resumes' },
  { id: 'interns',  label: 'Internships' },
]

type Props = {
  active?: string
  onSelect?: (id: string) => void
}

export default function FilterSidebar({ active, onSelect }: Props) {
  return (
    <aside className="w-60 border-r border-gray-200 bg-gray-50 p-4">
      <h2 className="text-lg font-semibold mb-4">Filter Resumes</h2>
      <ul className="space-y-2">
        {FILTERS.map(f => (
          <li key={f.id}>
            <button
              onClick={() => onSelect?.(f.id)}
              className={`
                block w-full text-left px-3 py-2 rounded transition
                ${active === f.id 
                   ? 'bg-blue-600 text-white' 
                   : 'hover:bg-gray-200 text-gray-800'}
              `}
            >
              {f.label}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  )
}