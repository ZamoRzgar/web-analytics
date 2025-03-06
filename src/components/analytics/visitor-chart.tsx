'use client'

import React from 'react'

// Database structure from SQL query
interface DailyVisitDataFromDB {
  date: string
  visits: number
}

interface VisitorChartProps {
  data: DailyVisitDataFromDB[]
  title?: string
}

export default function VisitorChart({ data, title = 'Visitors Over Time' }: VisitorChartProps) {
  // Sort data by date
  const sortedData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  
  // Find the max value for scaling
  const maxVisits = Math.max(...data.map(item => item.visits), 10)
  
  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div className="w-full h-full">
      <h3 className="text-lg font-medium mb-4">{title}</h3>
      
      <div className="flex flex-col space-y-4">
        <div className="relative h-60">
          {/* Chart grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between border-t border-gray-200">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="border-b border-gray-100 h-1/5"></div>
            ))}
          </div>
          
          {/* Chart bars */}
          <div className="absolute inset-0 flex items-end">
            {sortedData.map((item, index) => {
              const height = `${Math.max((item.visits / maxVisits) * 100, 5)}%`
              return (
                <div 
                  key={item.date} 
                  className="flex-1 flex flex-col items-center justify-end mx-1 group"
                >
                  <div 
                    className="w-full bg-blue-500 rounded-t-sm relative group"
                    style={{ height }}
                  >
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {item.visits} visits on {formatDate(item.date)}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        
        {/* X-axis labels */}
        <div className="flex justify-between text-xs text-gray-500 pt-2">
          {sortedData.length > 0 ? (
            <>
              <div>{formatDate(sortedData[0].date)}</div>
              {sortedData.length > 2 && (
                <div>{formatDate(sortedData[Math.floor(sortedData.length / 2)].date)}</div>
              )}
              <div>{formatDate(sortedData[sortedData.length - 1].date)}</div>
            </>
          ) : (
            <div>No data available</div>
          )}
        </div>
      </div>
      
      {data.length === 0 && (
        <div className="flex justify-center items-center h-32 text-gray-400">
          No visitor data available
        </div>
      )}
    </div>
  )
}