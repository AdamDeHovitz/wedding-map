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

    if (isSweetheart) {
      return (
        <div
          className={`
            h-32 rounded-3xl shadow-2xl
            flex flex-col items-center justify-center
            text-center p-4
            transition-all duration-200 cursor-pointer
            ${visited
              ? 'bg-gradient-to-br from-rose-600 via-rose-500 to-pink-500 text-white border-3 border-rose-400 shadow-rose-500/50'
              : 'bg-gradient-to-br from-rose-100 via-pink-50 to-rose-50 text-rose-900 border-3 border-rose-200 hover:border-rose-300'
            }
            ${visited ? 'hover:shadow-2xl hover:scale-105' : 'hover:shadow-xl hover:scale-102'}
            ${className}
          `}
          title={`${name} (Sweetheart Table)${visited ? ' ✓ Visited' : ''}`}
          onClick={() => onTableClick?.(name)}
        >
          <div className="text-2xl mb-1">♥</div>
          <span className="text-xs font-bold leading-tight">{name}</span>
          <span className={`text-[10px] mt-1 ${visited ? 'text-white/90' : 'text-rose-700/70'} italic`}>
            Sweetheart Table
          </span>
        </div>
      )
    }

    return (
      <div
        className={`
          h-20
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
        onClick={() => onTableClick?.(name)}
      >
        <span className="text-[11px] font-semibold leading-tight">
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

      <div className="space-y-4 w-full">
        {/* Top Row: 4 tables */}
        <div className="grid grid-cols-4 gap-3">
          <TableCell name="Seaview Terrace" className="w-full" />
          <TableCell name="State Street" className="w-full" />
          <TableCell name="Baltic Street" className="w-full" />
          <TableCell name="Connecticut Ave" className="w-full" />
        </div>

        {/* Visual separator */}
        <div className="h-px bg-gradient-to-r from-transparent via-[#F5E6D3] to-transparent opacity-50"></div>

        {/* Middle Section - sweetheart table + 2x3 grid */}
        <div className="flex gap-4 items-center">
          {/* Boerum Place (Sweetheart table) - standalone on left */}
          <div className="flex-shrink-0 w-32">
            <TableCell name="Boerum Place" isSweetheart className="w-full" />
          </div>

          {/* 2 rows of 3 tables on right */}
          <div className="flex-1 space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <TableCell name="River Heights" className="w-full" />
              <TableCell name="Lakewood Drive" className="w-full" />
              <TableCell name="College Ave" className="w-full" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <TableCell name="Nerudova" className="w-full" />
              <TableCell name="Topping Drive" className="w-full" />
              <TableCell name="115th Street" className="w-full" />
            </div>
          </div>
        </div>

        {/* Visual separator */}
        <div className="h-px bg-gradient-to-r from-transparent via-[#F5E6D3] to-transparent opacity-50"></div>

        {/* Bottom Row: 4 tables */}
        <div className="grid grid-cols-4 gap-3">
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
