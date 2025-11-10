"use client"

interface CategoryHeaderProps {
  title: string
}

export function CategoryHeader({ title }: CategoryHeaderProps) {
  return (
    <div className="text-center my-20 px-4">
      <div className="flex items-center justify-center gap-4 sm:gap-8">
        {/* Sol Dekoratif Scrollwork Süsleme */}
        <div className="flex-shrink-0">
          <svg width="80" height="40" viewBox="0 0 80 40" className="sm:w-[120px] sm:h-[60px]" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Enhanced Fleur-de-lis inspired ornament */}
            <path
              d="M70 20 Q 60 20, 55 14 Q 52 9, 46 12 Q 43 14, 46 17 Q 49 20, 46 20 Q 43 20, 46 23 Q 49 26, 46 28 Q 52 31, 55 26 Q 60 20, 70 20 Z"
              stroke="#FFD700"
              strokeWidth="2"
              fill="#FFD700"
              fillOpacity="0.2"
            />
            {/* Extended decorative line */}
            <path d="M0 20 L40 20" stroke="#FFD700" strokeWidth="1.5"/>
            {/* Multiple flourishes */}
            <circle cx="43" cy="20" r="3" fill="#FFD700"/>
            <circle cx="43" cy="13" r="1.5" fill="#FDB931" opacity="0.7"/>
            <circle cx="43" cy="27" r="1.5" fill="#FDB931" opacity="0.7"/>
          </svg>
        </div>

        <h2 className="text-2xl sm:text-4xl md:text-5xl font-['Playfair_Display',serif] text-[#FFD700] tracking-[0.25em] uppercase font-bold drop-shadow-[0_0_12px_rgba(255,215,0,0.4)]">
          {title}
        </h2>

        {/* Sağ Dekoratif Scrollwork Süsleme (mirror of left) */}
        <div className="flex-shrink-0">
          <svg width="80" height="40" viewBox="0 0 80 40" className="sm:w-[120px] sm:h-[60px]" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Enhanced Fleur-de-lis inspired ornament (mirrored) */}
            <path
              d="M10 20 Q 20 20, 25 14 Q 28 9, 34 12 Q 37 14, 34 17 Q 31 20, 34 20 Q 37 20, 34 23 Q 31 26, 34 28 Q 28 31, 25 26 Q 20 20, 10 20 Z"
              stroke="#FFD700"
              strokeWidth="2"
              fill="#FFD700"
              fillOpacity="0.2"
            />
            {/* Extended decorative line */}
            <path d="M40 20 L80 20" stroke="#FFD700" strokeWidth="1.5"/>
            {/* Multiple flourishes */}
            <circle cx="37" cy="20" r="3" fill="#FFD700"/>
            <circle cx="37" cy="13" r="1.5" fill="#FDB931" opacity="0.7"/>
            <circle cx="37" cy="27" r="1.5" fill="#FDB931" opacity="0.7"/>
          </svg>
        </div>
      </div>

      {/* Enhanced decorative accent under title */}
      <div className="flex justify-center mt-6">
        <svg width="220" height="18" viewBox="0 0 220 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 9 Q 60 5, 110 9 T 210 9" stroke="#FFD700" strokeWidth="1.5" fill="none"/>
          <circle cx="110" cy="9" r="3.5" fill="#FFD700"/>
          <circle cx="92" cy="9" r="2" fill="#FDB931" opacity="0.8"/>
          <circle cx="128" cy="9" r="2" fill="#FDB931" opacity="0.8"/>
        </svg>
      </div>
    </div>
  )
}
