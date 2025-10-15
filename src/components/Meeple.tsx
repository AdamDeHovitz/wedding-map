interface MeepleProps {
  color: string
  size?: number
  className?: string
  style?: '3d' | 'flat' | 'bride' | 'groom'
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
export type MeepleStyle = '3d' | 'bride' | 'groom'

export function Meeple({ color, size = 40, className = '', style = '3d' }: MeepleProps) {
  // Bride style: white wedding dress with veil and elegant details
  if (style === 'bride') {
    const brideColor = '#FFFFFF'
    const layer1 = '#F5F5F5'
    const layer2 = '#ECECEC'
    const layer3 = '#E0E0E0'
    const layer4 = '#D4D4D4'

    // Custom bride dress path - wider skirt that fills the bottom
    const brideDressPath =
      "M256 54.99c-27 0-46.418 14.287-57.633 32.23-10.03 16.047-14.203 34.66-15.017 50.962-30.608 15.135-64.515 30.394-91.815 45.994-14.32 8.183-26.805 16.414-36.203 25.26C45.934 218.28 39 228.24 39 239.99c0 5 2.44 9.075 5.19 12.065 2.754 2.99 6.054 5.312 9.812 7.48 7.515 4.336 16.99 7.95 27.412 11.076 15.483 4.646 32.823 8.1 47.9 9.577-8 13.76-15 27.84-20 42.315C85 360 70 390 65 420c-3 18 0 37 15 37h352c15 0 18-19 15-37-5-30-20-60-34.314-107.488-5-14.475-12-28.555-20-42.315 15.077-1.478 32.417-4.93 47.9-9.576 10.422-3.125 19.897-6.74 27.412-11.075 3.758-2.168 7.058-4.49 9.81-7.48 2.753-2.99 5.192-7.065 5.192-12.065 0-11.75-6.934-21.71-16.332-30.554-9.398-8.846-21.883-17.077-36.203-25.26-27.3-15.6-61.207-30.86-91.815-45.994-.814-16.3-4.988-34.915-15.017-50.96C302.418 69.276 283 54.99 256 54.99z"

    return (
      <svg
        viewBox="0 0 512 512"
        width={size}
        height={size}
        className={className}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Ground shadow - softer for bride */}
        <ellipse cx="270" cy="485" rx="120" ry="30" fill="black" opacity="0.12" />

        {/* Extruded layers - white dress with depth */}
        <g transform="translate(-8, -8)">
          <path d={brideDressPath} fill={layer4} />
        </g>
        <g transform="translate(-6, -6)">
          <path d={brideDressPath} fill={layer3} />
        </g>
        <g transform="translate(-4, -4)">
          <path d={brideDressPath} fill={layer2} />
        </g>
        <g transform="translate(-2, -2)">
          <path d={brideDressPath} fill={layer1} />
        </g>

        {/* Top face - pure white dress */}
        <path d={brideDressPath} fill={brideColor} />

        {/* Fill the bottom completely to create dress silhouette */}
        <path
          d="M 65 350 L 65 457 L 447 457 L 447 350 Q 430 380, 400 400 Q 370 420, 330 440 Q 290 455, 256 457 Q 222 455, 182 440 Q 142 420, 112 400 Q 82 380, 65 350 Z"
          fill={brideColor}
        />

        {/* Flowing veil - larger and more prominent */}
        <ellipse cx="256" cy="80" rx="65" ry="40" fill={brideColor} opacity="0.75" />
        <ellipse cx="256" cy="90" rx="70" ry="45" fill={brideColor} opacity="0.6" />
        <path
          d="M 186 90 Q 160 130, 150 180 L 362 180 Q 352 130, 326 90 Z"
          fill={brideColor}
          opacity="0.65"
          stroke="#E8E8E8"
          strokeWidth="1.5"
        />

        {/* Bodice with sweetheart neckline and sparkles */}
        <path
          d="M 256 135 Q 226 145, 215 170 L 215 210 L 297 210 L 297 170 Q 286 145, 256 135 Z"
          fill="#FAFAFA"
          stroke="#E0E0E0"
          strokeWidth="2"
        />

        {/* Waistline with elegant band */}
        <ellipse cx="256" cy="230" rx="50" ry="8" fill="#F0F0F0" stroke="#D8D8D8" strokeWidth="1.5" />

        {/* Sparkle details on bodice */}
        <circle cx="240" cy="180" r="2" fill="#FFD700" opacity="0.8" />
        <circle cx="256" cy="175" r="2.5" fill="#FFD700" opacity="0.8" />
        <circle cx="272" cy="180" r="2" fill="#FFD700" opacity="0.8" />
        <circle cx="248" cy="195" r="1.5" fill="#FFD700" opacity="0.7" />
        <circle cx="264" cy="195" r="1.5" fill="#FFD700" opacity="0.7" />

        {/* Beautiful scalloped hem pattern across the entire bottom */}
        <path
          d="M 65 430 Q 75 448, 85 430 Q 95 448, 105 430 Q 115 448, 125 430 Q 135 448, 145 430 Q 155 448, 165 430 Q 175 448, 185 430 Q 195 448, 205 430 Q 215 448, 225 430 Q 235 448, 245 430 Q 255 448, 265 430 Q 275 448, 285 430 Q 295 448, 305 430 Q 315 448, 325 430 Q 335 448, 345 430 Q 355 448, 365 430 Q 375 448, 385 430 Q 395 448, 405 430 Q 415 448, 425 430 Q 435 448, 445 430 L 445 458 L 65 458 Z"
          fill={brideColor}
          stroke="#E0E0E0"
          strokeWidth="2"
          opacity="0.95"
        />

        {/* Delicate lace pattern on dress */}
        <path
          d="M 120 330 Q 140 340, 160 330 M 160 350 Q 180 360, 200 350 M 200 370 Q 220 380, 240 370"
          stroke="#E8E8E8"
          strokeWidth="1.5"
          fill="none"
          opacity="0.6"
        />
        <path
          d="M 392 330 Q 372 340, 352 330 M 352 350 Q 332 360, 312 350 M 312 370 Q 292 380, 272 370"
          stroke="#E8E8E8"
          strokeWidth="1.5"
          fill="none"
          opacity="0.6"
        />

        {/* Bridal bouquet - more elaborate */}
        <circle cx="256" cy="300" r="12" fill="#FFE8F0" opacity="0.9" />
        <circle cx="248" cy="295" r="7" fill="#FFB6D9" opacity="0.8" />
        <circle cx="264" cy="295" r="7" fill="#FFB6D9" opacity="0.8" />
        <circle cx="256" cy="288" r="6" fill="#FFF" opacity="0.9" />
        <circle cx="250" cy="305" r="5" fill="#FFD4E8" opacity="0.8" />
        <circle cx="262" cy="305" r="5" fill="#FFD4E8" opacity="0.8" />
        <path
          d="M 254 310 L 256 320 L 258 310"
          stroke="#90EE90"
          strokeWidth="2"
          fill="none"
        />

        {/* Pearl-like details on dress */}
        <circle cx="220" cy="250" r="2.5" fill="#FFF" opacity="0.9" />
        <circle cx="230" cy="260" r="2" fill="#FFF" opacity="0.9" />
        <circle cx="240" cy="270" r="2.5" fill="#FFF" opacity="0.9" />
        <circle cx="292" cy="250" r="2.5" fill="#FFF" opacity="0.9" />
        <circle cx="282" cy="260" r="2" fill="#FFF" opacity="0.9" />
        <circle cx="272" cy="270" r="2.5" fill="#FFF" opacity="0.9" />

        {/* Crown or tiara on veil */}
        <path
          d="M 236 70 L 240 60 L 244 70 L 248 62 L 252 70 L 256 58 L 260 70 L 264 62 L 268 70 L 272 60 L 276 70"
          stroke="#FFD700"
          strokeWidth="2"
          fill="none"
          opacity="0.85"
        />
        <circle cx="256" cy="58" r="3" fill="#FFD700" opacity="0.9" />

        {/* Radiant highlight for the bride */}
        <path
          d={brideDressPath}
          stroke="rgba(255,255,255,0.5)"
          strokeWidth="2"
          fill="none"
          opacity="0.8"
        />

        {/* Subtle glow effect around the bride */}
        <ellipse cx="256" cy="256" rx="150" ry="200" fill="none" stroke="rgba(255,245,240,0.3)" strokeWidth="8" />
      </svg>
    )
  }

  // Groom style: black tuxedo with white shirt and bow tie
  if (style === 'groom') {
    const tuxedoColor = '#000000'
    const layer1 = '#1A1A1A'
    const layer2 = '#0D0D0D'
    const layer3 = '#050505'
    const layer4 = '#000000'

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
        <ellipse cx="270" cy="485" rx="100" ry="25" fill="black" opacity="0.3" />

        {/* Extruded layers - black tuxedo */}
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

        {/* Top face - black tuxedo */}
        <path d={meeplePath} fill={tuxedoColor} />

        {/* White dress shirt - V-shape */}
        <path
          d="M 256 140 L 230 180 L 230 240 L 282 240 L 282 180 Z"
          fill="#FFFFFF"
        />

        {/* Bow tie */}
        <path
          d="M 235 165 L 245 170 L 245 175 L 235 180 Z M 277 165 L 267 170 L 267 175 L 277 180 Z"
          fill="#FFFFFF"
        />
        <rect x="245" y="170" width="22" height="5" fill="#FFFFFF" />
        <circle cx="256" cy="172.5" r="4" fill={tuxedoColor} />

        {/* Tuxedo lapels */}
        <path
          d="M 230 180 L 220 200 L 230 240 Z"
          fill={tuxedoColor}
          stroke="#333"
          strokeWidth="1"
        />
        <path
          d="M 282 180 L 292 200 L 282 240 Z"
          fill={tuxedoColor}
          stroke="#333"
          strokeWidth="1"
        />

        {/* Subtle highlight for shine */}
        <path
          d={meeplePath}
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="1.5"
          fill="none"
          opacity="0.5"
        />
      </svg>
    )
  }

  // 3D style: authentic meeple with layered depth (default)
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
