interface MeepleProps {
  color: string
  size?: number
  className?: string
}

export const MEEPLE_COLORS = [
  { name: 'Burgundy', value: '#7B2D26' },
  { name: 'Forest Green', value: '#2D5016' },
  { name: 'Royal Blue', value: '#1E3A8A' },
  { name: 'Golden Yellow', value: '#F59E0B' },
  { name: 'Deep Purple', value: '#6B21A8' },
  { name: 'Coral Red', value: '#DC2626' },
  { name: 'Teal', value: '#0D9488' },
  { name: 'Burnt Orange', value: '#EA580C' },
  { name: 'Navy', value: '#1E293B' },
  { name: 'Sage Green', value: '#84A98C' },
  { name: 'Plum', value: '#86198F' },
  { name: 'Sky Blue', value: '#0EA5E9' },
] as const

export type MeepleColor = typeof MEEPLE_COLORS[number]['value']

export function Meeple({ color, size = 40, className = '' }: MeepleProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Meeple shape inspired by Carcassonne */}
      <g>
        {/* Head */}
        <circle cx="50" cy="25" r="12" fill={color} />

        {/* Body */}
        <path
          d="M 50 37
             C 45 37, 40 40, 38 45
             L 35 60
             C 34 65, 32 70, 28 75
             L 25 85
             C 24 88, 26 90, 28 90
             L 35 90
             L 38 75
             L 45 60
             L 45 90
             C 45 92, 47 93, 50 93
             C 53 93, 55 92, 55 90
             L 55 60
             L 62 75
             L 65 90
             L 72 90
             C 74 90, 76 88, 75 85
             L 72 75
             C 68 70, 66 65, 65 60
             L 62 45
             C 60 40, 55 37, 50 37
             Z"
          fill={color}
        />

        {/* Left arm */}
        <path
          d="M 38 45
             L 28 48
             C 25 49, 23 47, 24 44
             C 25 41, 27 40, 30 41
             L 40 43
             Z"
          fill={color}
        />

        {/* Right arm */}
        <path
          d="M 62 45
             L 72 48
             C 75 49, 77 47, 76 44
             C 75 41, 73 40, 70 41
             L 60 43
             Z"
          fill={color}
        />
      </g>

      {/* Outline for better visibility */}
      <g stroke="#000000" strokeWidth="1.5" opacity="0.2" fill="none">
        <circle cx="50" cy="25" r="12" />
        <path
          d="M 50 37
             C 45 37, 40 40, 38 45
             L 35 60
             C 34 65, 32 70, 28 75
             L 25 85
             C 24 88, 26 90, 28 90
             L 35 90
             L 38 75
             L 45 60
             L 45 90
             C 45 92, 47 93, 50 93
             C 53 93, 55 92, 55 90
             L 55 60
             L 62 75
             L 65 90
             L 72 90
             C 74 90, 76 88, 75 85
             L 72 75
             C 68 70, 66 65, 65 60
             L 62 45
             C 60 40, 55 37, 50 37
             Z"
        />
      </g>
    </svg>
  )
}
