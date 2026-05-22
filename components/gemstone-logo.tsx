"use client"

export function GemstoneLogo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <div className={`${className} relative`}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Gemstone shape */}
        <defs>
          <linearGradient id="gemGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E8E8E8" />
            <stop offset="25%" stopColor="#C0C0C0" />
            <stop offset="50%" stopColor="#A8A8A8" />
            <stop offset="75%" stopColor="#C0C0C0" />
            <stop offset="100%" stopColor="#E8E8E8" />
          </linearGradient>
          <linearGradient id="gemShine" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
          <filter id="gemGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        
        {/* Main diamond shape */}
        <g filter="url(#gemGlow)">
          {/* Top facet */}
          <polygon
            points="50,8 75,35 50,45 25,35"
            fill="url(#gemGradient)"
            stroke="#9CA3AF"
            strokeWidth="1"
          />
          
          {/* Left facet */}
          <polygon
            points="25,35 50,45 50,92 15,50"
            fill="#A8A8A8"
            stroke="#9CA3AF"
            strokeWidth="1"
          />
          
          {/* Right facet */}
          <polygon
            points="75,35 85,50 50,92 50,45"
            fill="#D4D4D4"
            stroke="#9CA3AF"
            strokeWidth="1"
          />
          
          {/* Top left edge */}
          <polygon
            points="50,8 25,35 15,50 50,45"
            fill="#C0C0C0"
            stroke="#9CA3AF"
            strokeWidth="1"
          />
          
          {/* Top right edge */}
          <polygon
            points="50,8 75,35 85,50 50,45"
            fill="#E8E8E8"
            stroke="#9CA3AF"
            strokeWidth="1"
          />
          
          {/* Shine effect */}
          <polygon
            points="50,8 60,25 50,32 40,25"
            fill="url(#gemShine)"
          />
          
          {/* Inner sparkle */}
          <circle cx="45" cy="30" r="3" fill="white" opacity="0.6" />
          <circle cx="55" cy="38" r="2" fill="white" opacity="0.4" />
        </g>
      </svg>
    </div>
  )
}
