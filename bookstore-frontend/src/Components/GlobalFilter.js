import React, { useState } from 'react'
import { useAsyncDebounce } from 'react-table'

export const GlobalFilter = ({ filter, setFilter }) => {

  return (
    <div className = "search-box">
      Search:{' '}
      <input
        value={filter || ''}
        onChange={(e) =>
          setFilter(e.target.value)}
      />
    </div>
  )
}