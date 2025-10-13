'use client'

import { GuestCheckin, WeddingTable } from '@/types/database'
import { Card } from '@/components/ui/card'
import Image from 'next/image'

/**
 * SeatingChart Component
 *
 * CRITICAL REQUIREMENT:
 * All table names in the <TableCell name="..."> props below MUST EXACTLY match
 * the table names in the database (case-sensitive, including spaces and full words).
 *
 * Common mistakes that break the "visited" status:
 * - "Ave" instead of "Avenue"
 * - "W" instead of "West"
 * - "River Heights" instead of "River Heights Road"
 * - Extra/missing spaces
 *
 * TO VERIFY TABLE NAMES:
 * Run: npx tsx scripts/check-table-names.ts
 *
 * TO TEST:
 * Run: npm test seating-chart-table-names.test.ts
 *
 * This matching is done in isVisited() which compares the name prop against
 * the database table names to determine if a table should show as visited.
 */

interface SeatingChartProps {
  tables: WeddingTable[]
  userCheckins: GuestCheckin[]
  onTableClick?: (tableName: string) => void
}

export function SeatingChart({ tables, userCheckins, onTableClick }: SeatingChartProps) {
  // Create a set of table IDs the user has visited
  const visitedTableIds = new Set(userCheckins.map(c => c.table_id))

  // Helper to check if a table has been visited
  // This function matches table names EXACTLY - any mismatch will cause
  // the table to incorrectly show as "not visited"
  const isVisited = (tableName: string) => {
    const table = tables.find(t => t.name === tableName)
    return table ? visitedTableIds.has(table.id) : false
  }

  // Helper to get icon path for a table
  const getIconPath = (tableName: string): string => {
    const iconMap: Record<string, string> = {
      'Seaview Terrace': 'seaview-terrace.png',
      'State Street': 'state-street.png',
      'Baltic Street': 'baltic-street.png',
      'Connecticut Ave': 'connecticut-ave.png',
      'Boerum Place': 'boerum-place.png',
      'River Heights': 'river-heights.png',
      'Lakewood Drive': 'lakewood-drive.png',
      'College Ave': 'college-ave.png',
      'Nerudova': 'nerudova-street.png',
      'Topping Drive': 'topping-drive.png',
      '115th Street': 'w-115th-street.png',
      'Waterman Street': 'waterman-street.png',
      'John Street': 'john-street.png',
      'Clark Street': 'clark-street.png',
      '53rd Street': 'w-53rd-street.png'
    }
    return `/table-icons/${iconMap[tableName] || 'boerum-place.png'}`
  }

  // Helper to render a table cell
  const TableCell = ({ name, isSweetheart = false, alternate = false, className = '' }: { name: string; isSweetheart?: boolean; alternate?: boolean; className?: string }) => {
    const visited = isVisited(name)

    // Color scheme for alternating tables
    const baseColors = alternate
      ? 'bg-gradient-to-br from-[#f0ddc8] to-[#e8d5c0]'
      : 'bg-gradient-to-br from-[#F5E6D3] to-[#e8d9c5]'

    return (
      <div
        className={`
          ${isSweetheart ? 'h-28' : 'h-24'}
          rounded-xl shadow-lg
          flex flex-col items-center justify-center
          text-center px-1 py-2
          transition-all duration-200 cursor-pointer relative
          ${visited
            ? 'bg-gradient-to-br from-[#7B2D26] to-[#5a211c] text-[#F5E6D3] border-2 border-[#7B2D26] shadow-[#7B2D26]/30'
            : `${baseColors} text-[#7B2D26] border-2 ${alternate ? 'border-[#e8d5c0]' : 'border-[#e8d9c5]'} hover:border-[#7B2D26]/30`
          }
          ${visited ? 'hover:shadow-lg hover:scale-105' : 'hover:shadow-md hover:border-[#8B4044]/40 hover:scale-102'}
          ${className}
        `}
        title={`${name}${visited ? ' ✓ Visited' : ''}`}
        onClick={() => onTableClick?.(name)}
      >
        <div className={`${isSweetheart ? 'mb-1' : 'mb-0.5'}`}>
          <Image
            src={getIconPath(name)}
            alt={name}
            width={isSweetheart ? 32 : 24}
            height={isSweetheart ? 32 : 24}
            className={`${visited ? 'opacity-90' : 'opacity-80'}`}
          />
        </div>
        <span className={`${isSweetheart ? 'text-[9px]' : 'text-[8px]'} font-semibold leading-tight`}>
          {name}
        </span>
      </div>
    )
  }

  return (
    <Card className="p-3 bg-gradient-to-br from-rose-50 to-white border-2 border-[#F5E6D3] shadow-xl max-w-3xl w-full">
      <div className="mb-3 flex flex-col items-center">
        <Image
          src="/table-icons/rule-of-thirds.png"
          alt="Rule of Thirds"
          width={48}
          height={48}
          className="mb-2"
        />
        <h3 className="text-lg font-bold text-center text-[#7B2D26] mb-1">Seating Chart</h3>
        <p className="text-xs text-center text-[#7B2D26]/70">Rule of Thirds</p>
      </div>

      <div className="space-y-2 w-full">
        {/*
          IMPORTANT: All table names below must EXACTLY match database names.
          Run `npx tsx scripts/check-table-names.ts` to verify.
          Run `npm test seating-chart-table-names.test.ts` to test.
        */}

        {/* Top Row: 4 tables with alternating colors */}
        <div className="grid grid-cols-4 gap-2">
          <TableCell name="Seaview Terrace" alternate={false} className="w-full" />
          <TableCell name="State Street" alternate={true} className="w-full" />
          <TableCell name="Baltic Street" alternate={false} className="w-full" />
          <TableCell name="Connecticut Avenue" alternate={true} className="w-full" />
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
              <TableCell name="River Heights Road" alternate={false} className="w-full" />
              <TableCell name="Lakewood Drive" alternate={true} className="w-full" />
              <TableCell name="College Avenue" alternate={false} className="w-full" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <TableCell name="Nerudova Street" alternate={true} className="w-full" />
              <TableCell name="Topping Drive" alternate={false} className="w-full" />
              <TableCell name="West 115th Street" alternate={true} className="w-full" />
            </div>
          </div>
        </div>

        {/* Bottom Row: 4 tables with alternating colors */}
        <div className="grid grid-cols-4 gap-3">
          <TableCell name="Waterman Street" alternate={false} className="w-full" />
          <TableCell name="John Street" alternate={true} className="w-full" />
          <TableCell name="Clark Street" alternate={false} className="w-full" />
          <TableCell name="West 53rd Street" alternate={true} className="w-full" />
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-[#F5E6D3]">
        <div className="flex items-center justify-center gap-4 text-[10px]">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-gradient-to-br from-[#7B2D26] to-[#5a211c] border border-[#7B2D26] shadow-sm"></div>
            <span className="text-[#7B2D26] font-medium">Visited</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-gradient-to-br from-[#F5E6D3] to-[#e8d9c5] border border-[#e8d9c5] shadow-sm"></div>
            <span className="text-[#7B2D26]/70 font-medium">Not Visited</span>
          </div>
        </div>
      </div>
    </Card>
  )
}
