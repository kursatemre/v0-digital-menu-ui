"use client"

interface CategoryHeaderProps {
  title: string
}

export function CategoryHeader({ title }: CategoryHeaderProps) {
  return (
    <div className="text-center mb-8 px-4">
      <div className="flex items-center justify-center gap-4 sm:gap-8">
        {/* Sol Dekoratif Scrollwork Süsleme */}
        <div className="flex-shrink-0">
          <svg width="80" height="40" viewBox="0 0 80 40" className="sm:w-[120px] sm:h-[60px]" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Enhanced Fleur-de-lis inspired ornament */}
            <path
              d="M70 20 Q 60 20, 55 14 Q 52 9, 46 12 Q 43 14, 46 17 Q 49 20, 46 20 Q 43 20, 46 23 Q 49 26, 46 28 Q 52 31, 55 26 Q 60 20, 70 20 Z"
              stroke="#D4AF37"
              strokeWidth="1.5"
              fill="#D4AF37"
              fillOpacity="0.15"
            />
            {/* Extended decorative line */}
            <path d="M0 20 L40 20" stroke="#D4AF37" strokeWidth="1"/>
            {/* Multiple flourishes */}
            <circle cx="43" cy="20" r="2.5" fill="#D4AF37" opacity="0.8"/>
            <circle cx="43" cy="13" r="1.5" fill="#D4AF37" opacity="0.5"/>
            <circle cx="43" cy="27" r="1.5" fill="#D4AF37" opacity="0.5"/>
          </svg>
        </div>

        <h2 className="text-2xl sm:text-4xl md:text-5xl font-['Playfair_Display',serif] tracking-[0.2em] uppercase font-semibold text-[#D4AF37]">
          {title}
        </h2>

        {/* Sağ Dekoratif Scrollwork Süsleme (mirror of left) */}
        <div className="flex-shrink-0">
          <svg width="80" height="40" viewBox="0 0 80 40" className="sm:w-[120px] sm:h-[60px]" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Enhanced Fleur-de-lis inspired ornament (mirrored) */}
            <path
              d="M10 20 Q 20 20, 25 14 Q 28 9, 34 12 Q 37 14, 34 17 Q 31 20, 34 20 Q 37 20, 34 23 Q 31 26, 34 28 Q 28 31, 25 26 Q 20 20, 10 20 Z"
              stroke="#D4AF37"
              strokeWidth="1.5"
              fill="#D4AF37"
              fillOpacity="0.15"
            />
            {/* Extended decorative line */}
            <path d="M40 20 L80 20" stroke="#D4AF37" strokeWidth="1"/>
            {/* Multiple flourishes */}
            <circle cx="37" cy="20" r="2.5" fill="#D4AF37" opacity="0.8"/>
            <circle cx="37" cy="13" r="1.5" fill="#D4AF37" opacity="0.5"/>
            <circle cx="37" cy="27" r="1.5" fill="#D4AF37" opacity="0.5"/>
          </svg>
        </div>
      </div>

      {/* Enhanced decorative accent under title */}
      <div className="flex justify-center mt-4">
        <svg width="180" height="16" viewBox="0 0 180 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 8 Q 50 5, 90 8 T 170 8" stroke="#D4AF37" strokeWidth="1" fill="none" opacity="0.6"/>
          <circle cx="90" cy="8" r="2.5" fill="#D4AF37" opacity="0.8"/>
          <circle cx="75" cy="8" r="1.5" fill="#D4AF37" opacity="0.5"/>
          <circle cx="105" cy="8" r="1.5" fill="#D4AF37" opacity="0.5"/>
        </svg>
      </div>
    </div>
  )
}
