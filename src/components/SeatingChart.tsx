'use client'

import { GuestCheckin, WeddingTable } from '@/types/database'
import { Card } from '@/components/ui/card'

interface SeatingChartProps {
  tables: WeddingTable[]
  userCheckins: GuestCheckin[]
}

export function SeatingChart({ tables, userCheckins }: SeatingChartProps) {
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
          ${isSweetheart ? 'h-28' : 'h-20'}
          rounded-2xl shadow-lg
          flex items-center justify-center
          text-center p-3
          transition-all duration-200 cursor-pointer
          ${visited
            ? 'bg-gradient-to-br from-[#7B2D26] to-[#5a211c] text-[#F5E6D3] border-2 border-[#7B2D26] shadow-[#7B2D26]/30'
            : 'bg-gradient-to-br from-[#F5E6D3] to-[#e8d9c5] text-[#7B2D26] border-2 border-[#e8d9c5] hover:border-[#7B2D26]/30'
          }
          ${visited ? 'hover:shadow-xl hover:scale-105' : 'hover:shadow-md hover:scale-102'}
          ${className}
        `}
        title={`${name}${visited ? ' ✓ Visited' : ''}`}
      >
        <span className={`${isSweetheart ? 'text-xs' : 'text-[11px]'} font-semibold leading-tight`}>
          {name}
        </span>
      </div>
    )
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-rose-50 to-white border-2 border-[#F5E6D3] shadow-xl max-w-3xl">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-center text-[#7B2D26] mb-1">Seating Chart</h3>
        <p className="text-xs text-center text-[#7B2D26]/70">Rule of Thirds</p>
      </div>

      <div className="space-y-3 w-full">
        {/* Top Row: 4 tables */}
        <div className="grid grid-cols-4 gap-2">
          <TableCell name="Seaview Terrace" className="w-full" />
          <TableCell name="State Street" className="w-full" />
          <TableCell name="Baltic Street" className="w-full" />
          <TableCell name="Connecticut Ave" className="w-full" />
        </div>

        {/* Middle Section - using grid to align widths */}
        <div className="grid grid-cols-4 gap-2">
          {/* Boerum Place (Sweetheart table) - narrower, spans 1 column */}
          <div className="col-span-1 flex items-center justify-center">
            <TableCell name="Boerum Place" isSweetheart className="w-20" />
          </div>

          {/* 2 rows of 3 tables - spans remaining 3 columns */}
          <div className="col-span-3 space-y-2">
            <div className="grid grid-cols-3 gap-2">
              <TableCell name="River Heights" className="w-full" />
              <TableCell name="Lakewood Drive" className="w-full" />
              <TableCell name="College Ave" className="w-full" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <TableCell name="Nerudova" className="w-full" />
              <TableCell name="Topping Drive" className="w-full" />
              <TableCell name="115th Street" className="w-full" />
            </div>
          </div>
        </div>

        {/* Bottom Row: 4 tables */}
        <div className="grid grid-cols-4 gap-2">
          <TableCell name="Waterman Street" className="w-full" />
          <TableCell name="John Street" className="w-full" />
          <TableCell name="Clark Street" className="w-full" />
          <TableCell name="53rd Street" className="w-full" />
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-[#F5E6D3]">
        <div className="flex items-center justify-center gap-6 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gradient-to-br from-[#7B2D26] to-[#5a211c] border border-[#7B2D26] shadow-sm"></div>
            <span className="text-[#7B2D26] font-medium">Visited</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gradient-to-br from-[#F5E6D3] to-[#e8d9c5] border border-[#e8d9c5] shadow-sm"></div>
            <span className="text-[#7B2D26]/70 font-medium">Not Visited</span>
          </div>
        </div>
      </div>
    </Card>
  )
}
