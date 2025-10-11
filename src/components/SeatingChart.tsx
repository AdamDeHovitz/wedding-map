'use client'

import { GuestCheckin, WeddingTable } from '@/types/database'
import { Card } from '@/components/ui/card'

interface SeatingChartProps {
  tables: WeddingTable[]
  userCheckins: GuestCheckin[]
  onTableClick?: (tableName: string) => void
}

export function SeatingChart({ tables, userCheckins, onTableClick }: SeatingChartProps) {
  // Create a set of table IDs the user has visited
  const visitedTableIds = new Set(userCheckins.map(c => c.table_id))

  // Helper to check if a table has been visited
  const isVisited = (tableName: string) => {
    const table = tables.find(t => t.name === tableName)
    return table ? visitedTableIds.has(table.id) : false
  }

  // Helper to render a table cell
  const TableCell = ({ name, isSweetheart = false, className = '' }: { name: string; isSweetheart?: boolean; className?: string }) => {
    const visited = isVisited(name)

    return (
      <div
        className={`
          ${isSweetheart ? 'min-h-28' : 'min-h-24'}
          rounded-xl shadow-md
          flex items-center justify-center
          text-center px-3 py-3
          transition-all duration-200 cursor-pointer
          ${visited
            ? 'bg-gradient-to-br from-[#8B4044] to-[#6B2D26] text-[#FFF8F0] border-2 border-[#6B2D26]'
            : 'bg-[#FFF8F0] text-[#6B2D26] border-2 border-[#E8D5C4]'
          }
          ${visited ? 'hover:shadow-lg hover:scale-105' : 'hover:shadow-md hover:border-[#8B4044]/40 hover:scale-102'}
          ${className}
        `}
        title={`${name}${visited ? ' ✓ Visited' : ''}`}
        onClick={() => onTableClick?.(name)}
      >
        <span
          className={`
            ${isSweetheart ? 'text-sm' : 'text-xs'}
            font-medium leading-tight
            ${isSweetheart ? 'font-serif italic' : ''}
          `}
        >
          {name}
        </span>
      </div>
    )
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-[#FFF8F0] via-[#FFF5EB] to-[#FFE8D6] border-2 border-[#E8D5C4] shadow-xl w-full max-w-2xl mx-auto">
      <div className="mb-6">
        <h3 className="text-2xl font-serif text-center text-[#6B2D26] mb-1 tracking-wide">Seating Chart</h3>
        <p className="text-sm text-center text-[#8B4044] font-light italic">Click a table to view on map</p>
      </div>

      <div className="space-y-4 w-full">
        {/* Top Row: 4 tables */}
        <div className="grid grid-cols-4 gap-3">
          <TableCell name="Seaview Terrace" className="w-full" />
          <TableCell name="State Street" className="w-full" />
          <TableCell name="Baltic Street" className="w-full" />
          <TableCell name="Connecticut Ave" className="w-full" />
        </div>

        {/* Middle Section - using grid to align widths */}
        <div className="grid grid-cols-4 gap-3">
          {/* Boerum Place (Sweetheart table) - narrower, spans 1 column */}
          <div className="col-span-1 flex items-center justify-center">
            <TableCell name="Boerum Place" isSweetheart className="w-full" />
          </div>

          {/* 2 rows of 3 tables - spans remaining 3 columns */}
          <div className="col-span-3 space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <TableCell name="River Heights" className="w-full" />
              <TableCell name="Lakewood Drive" className="w-full" />
              <TableCell name="College Ave" className="w-full" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <TableCell name="Nerudova Street" className="w-full" />
              <TableCell name="Topping Drive" className="w-full" />
              <TableCell name="W 115th Street" className="w-full" />
            </div>
          </div>
        </div>

        {/* Bottom Row: 4 tables */}
        <div className="grid grid-cols-4 gap-3">
          <TableCell name="Waterman Street" className="w-full" />
          <TableCell name="John Street" className="w-full" />
          <TableCell name="Clark Street" className="w-full" />
          <TableCell name="W 53rd Street" className="w-full" />
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-[#E8D5C4]">
        <div className="flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gradient-to-br from-[#8B4044] to-[#6B2D26] border-2 border-[#6B2D26]"></div>
            <span className="text-[#6B2D26] font-medium">Visited</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-[#FFF8F0] border-2 border-[#E8D5C4]"></div>
            <span className="text-[#6B2D26]/70 font-medium">Not Visited</span>
          </div>
        </div>
      </div>
    </Card>
  )
}
