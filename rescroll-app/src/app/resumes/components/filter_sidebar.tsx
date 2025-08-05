'use client'

import React, { useState } from 'react'

const LEVEL_FILTER = [
  { id: 'all', label: 'All' },
  { id: 'highschool', label: 'Highschool' },
  { id: 'collegiate', label: 'Collegiate' },
  { id: 'professional', label: 'Professional' },
]

const INDUSTRY_SUGGESTIONS = [
  'Software Engineering',
  'Consulting',
  'Data Science',
  'Product Management',
  'Cybersecurity',
]

type Props = {
  activeLevel?: string
  onLevelSelect?: (id: string) => void
  industrySearch?: string
  onIndustrySearch?: (text: string) => void
}

export default function FilterSidebar({
  activeLevel,
  onLevelSelect,
  industrySearch,
  onIndustrySearch,
}: Props) {
  const [search, setSearch] = useState(industrySearch || '')
  const [showSuggestions, setShowSuggestions] = useState(false)

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearch(value)
    setShowSuggestions(true)
    onIndustrySearch?.(value)
  }

  const handleSuggestionClick = (suggestion: string) => {
    setSearch(suggestion)
    setShowSuggestions(false)
    onIndustrySearch?.(suggestion)
  }

  const filteredSuggestions = INDUSTRY_SUGGESTIONS.filter((s) => {
    const words = s.toLowerCase().split(' ')
    const query = search.toLowerCase()
    return words.some(word => word.startsWith(query))
  })

  return (
    <aside className="w-60 border-r border-gray-200 bg-gray-50 p-4">
      <h2 className="text-red-400 font-semibold mb-4">Filter Resumes</h2>

      {/* Level Dropdown */}
      <div className="mb-4">
        <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-1">
          Career Level
        </label>
        <select
          id="level"
          value={activeLevel}
          onChange={(e) => onLevelSelect?.(e.target.value)}
          className="w-full text-black border-2 border-[#bdbdbd] focus:border-[#dcdcdc] focus:outline-none rounded-xl px-3 py-2 transition-colors duration-200"
        >
          {LEVEL_FILTER.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Industry Search with Autocomplete */}
      <div className="relative">
        <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">
          Industry
        </label>
        <input
          id="industry"
          type="text"
          placeholder="Search industry..."
          value={search}
          onChange={handleSearchChange}
          onFocus={() => setShowSuggestions(true)}
          className="w-full text-black border-2 border-[#bdbdbd] focus:border-[#dcdcdc] focus:outline-none rounded-xl px-3 py-2 transition-colors duration-200"
        />
        {showSuggestions && search.trim().length > 0 && filteredSuggestions.length > 0 && (
          <ul className="absolute z-10 bg-white border border-gray-300 w-full mt-1 rounded-md shadow-lg">
            {filteredSuggestions.map((suggestion) => (
              <li
                key={suggestion}
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 cursor-pointer"
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  )
}
