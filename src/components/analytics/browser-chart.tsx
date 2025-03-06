'use client'

import React from 'react'

// Database structure from SQL query
interface BrowserDataFromDB {
  browser: string
  count: number
}

interface BrowserChartProps {
  data: BrowserDataFromDB[]
  title?: string
}

// Simple color palette for the bars
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export default function BrowserChart({ data, title = 'Browser Distribution' }: BrowserChartProps) {
  // Calculate total for percentages
  const total = data.reduce((sum, item) => sum + item.count, 0)
  
  // Sort data by count in descending order
  const sortedData = [...data].sort((a, b) => b.count - a.count)

  return (
    <div className="w-full h-full">
      <h3 className="text-lg font-medium mb-4">{title}</h3>
      
      <div className="space-y-3">
        {sortedData.map((item, index) => {
          const percentage = total > 0 ? Math.round((item.count / total) * 100) : 0
          return (
            <div key={item.browser} className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{item.browser}</span>
                <span className="text-sm text-gray-500">{percentage}% ({item.count})</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="h-2 rounded-full" 
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: COLORS[index % COLORS.length]
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>
      
      {data.length === 0 && (
        <div className="flex justify-center items-center h-32 text-gray-400">
          No browser data available
        </div>
      )}
    </div>
  )
}
