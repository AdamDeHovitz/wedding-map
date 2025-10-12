interface MeepleProps {
  color: string
  size?: number
  className?: string
  style?: '3d' | 'flat'
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
export type MeepleStyle = '3d' | 'flat'

export function Meeple({ color, size = 40, className = '', style = '3d' }: MeepleProps) {
  // Flat style: original rounded shapes
  if (style === 'flat') {
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
          <ellipse cx="40" cy="78" rx="7" ry="14" fill={color} />

          {/* Right leg */}
          <ellipse cx="60" cy="78" rx="7" ry="14" fill={color} />
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

  // 3D style: authentic meeple with layered depth
  // Use subtle darkening for depth layers only - keep top face pure color
  const layer1 = adjustColorBrightness(color, -8)
  const layer2 = adjustColorBrightness(color, -12)
  const layer3 = adjustColorBrightness(color, -16)
  const layer4 = adjustColorBrightness(color, -20)

  const meeplePath =
    "M256 54.99c-27 0-46.418 14.287-57.633 32.23-10.03 16.047-14.203 34.66-15.017 50.962-30.608 15.135-64.515 30.394-91.815 45.994-14.32 8.183-26.805 16.414-36.203 25.26C45.934 218.28 39 228.24 39 239.99c0 5 2.44 9.075 5.19 12.065 2.754 2.99 6.054 5.312 9.812 7.48 7.515 4.336 16.99 7.95 27.412 11.076 15.483 4.646 32.823 8.1 47.9 9.577-14.996 25.84-34.953 49.574-52.447 72.315C56.65 378.785 39 403.99 39 431.99c0 4-.044 7.123.31 10.26.355 3.137 1.256 7.053 4.41 10.156 3.155 3.104 7.017 3.938 10.163 4.28 3.146.345 6.315.304 10.38.304h111.542c8.097 0 14.026.492 20.125-3.43 6.1-3.92 8.324-9.275 12.67-17.275l.088-.16.08-.166s9.723-19.77 21.324-39.388c5.8-9.808 12.097-19.576 17.574-26.498 2.74-3.46 5.304-6.204 7.15-7.754.564-.472.82-.56 1.184-.76.363.2.62.288 1.184.76 1.846 1.55 4.41 4.294 7.15 7.754 5.477 6.922 11.774 16.69 17.574 26.498 11.6 19.618 21.324 39.387 21.324 39.387l.08.165.088.16c4.346 8 6.55 13.323 12.61 17.254 6.058 3.93 11.974 3.45 19.957 3.45H448c4 0 7.12.043 10.244-.304 3.123-.347 6.998-1.21 10.12-4.332 3.12-3.122 3.984-6.997 4.33-10.12.348-3.122.306-6.244.306-10.244 0-28-17.65-53.205-37.867-79.488-17.493-22.74-37.45-46.474-52.447-72.315 15.077-1.478 32.417-4.93 47.9-9.576 10.422-3.125 19.897-6.74 27.412-11.075 3.758-2.168 7.058-4.49 9.81-7.48 2.753-2.99 5.192-7.065 5.192-12.065 0-11.75-6.934-21.71-16.332-30.554-9.398-8.846-21.883-17.077-36.203-25.26-27.3-15.6-61.207-30.86-91.815-45.994-.814-16.3-4.988-34.915-15.017-50.96C302.418 69.276 283 54.99 256 54.99z"

  return (
    <svg
      viewBox="0 0 512 512"
      width={size}
      height={size}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Ground shadow */}
      <ellipse cx="270" cy="485" rx="100" ry="25" fill="black" opacity="0.2" />

      {/* Extruded side — 4 layers with subtle flat darkening for depth */}
      <g transform="translate(-8, -8)">
        <path d={meeplePath} fill={layer4} />
      </g>
      <g transform="translate(-6, -6)">
        <path d={meeplePath} fill={layer3} />
      </g>
      <g transform="translate(-4, -4)">
        <path d={meeplePath} fill={layer2} />
      </g>
      <g transform="translate(-2, -2)">
        <path d={meeplePath} fill={layer1} />
      </g>

      {/* Top face with PURE original color - no gradient */}
      <path d={meeplePath} fill={color} />

      {/* Subtle highlight on top edge only */}
      <path
        d={meeplePath}
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="1.5"
        fill="none"
        opacity="0.5"
      />
    </svg>
  )
}

function adjustColorBrightness(color: string, percent: number): string {
  const num = parseInt(color.replace('#', ''), 16)
  const amt = Math.round(2.55 * percent)
  const R = Math.max(0, Math.min(255, (num >> 16) + amt))
  const G = Math.max(0, Math.min(255, ((num >> 8) & 0x00ff) + amt))
  const B = Math.max(0, Math.min(255, (num & 0x0000ff) + amt))
  return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`
}
