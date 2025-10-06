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
      {/* Standard Carcassonne meeple shape */}
      <g>
        {/* Head */}
        <circle cx="50" cy="20" r="10" fill={color} />

        {/* Body (torso) */}
        <ellipse cx="50" cy="50" rx="16" ry="22" fill={color} />

        {/* Left arm */}
        <ellipse
          cx="32"
          cy="45"
          rx="8"
          ry="5"
          fill={color}
          transform="rotate(-30 32 45)"
        />

        {/* Right arm */}
        <ellipse
          cx="68"
          cy="45"
          rx="8"
          ry="5"
          fill={color}
          transform="rotate(30 68 45)"
        />

        {/* Left leg */}
        <ellipse
          cx="40"
          cy="78"
          rx="7"
          ry="14"
          fill={color}
        />

        {/* Right leg */}
        <ellipse
          cx="60"
          cy="78"
          rx="7"
          ry="14"
          fill={color}
        />
      </g>

      {/* Outline for better visibility */}
      <g stroke="#000000" strokeWidth="1.5" opacity="0.3" fill="none">
        <circle cx="50" cy="20" r="10" />
        <ellipse cx="50" cy="50" rx="16" ry="22" />
        <ellipse cx="32" cy="45" rx="8" ry="5" transform="rotate(-30 32 45)" />
        <ellipse cx="68" cy="45" rx="8" ry="5" transform="rotate(30 68 45)" />
        <ellipse cx="40" cy="78" rx="7" ry="14" />
        <ellipse cx="60" cy="78" rx="7" ry="14" />
      </g>
    </svg>
  )
}
