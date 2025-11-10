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
              stroke="#C9A961"
              strokeWidth="2"
              fill="#C9A961"
              fillOpacity="0.15"
            />
            {/* Extended decorative line */}
            <path d="M0 20 L40 20" stroke="#C9A961" strokeWidth="1.5"/>
            {/* Multiple flourishes */}
            <circle cx="43" cy="20" r="3" fill="#C9A961"/>
            <circle cx="43" cy="13" r="1.5" fill="#C9A961" opacity="0.6"/>
            <circle cx="43" cy="27" r="1.5" fill="#C9A961" opacity="0.6"/>
          </svg>
        </div>

        <h2 className="text-2xl sm:text-4xl md:text-5xl font-['Playfair_Display',serif] text-[#C9A961] tracking-[0.25em] uppercase font-bold">
          {title}
        </h2>

        {/* Sağ Dekoratif Scrollwork Süsleme (mirror of left) */}
        <div className="flex-shrink-0">
          <svg width="80" height="40" viewBox="0 0 80 40" className="sm:w-[120px] sm:h-[60px]" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Enhanced Fleur-de-lis inspired ornament (mirrored) */}
            <path
              d="M10 20 Q 20 20, 25 14 Q 28 9, 34 12 Q 37 14, 34 17 Q 31 20, 34 20 Q 37 20, 34 23 Q 31 26, 34 28 Q 28 31, 25 26 Q 20 20, 10 20 Z"
              stroke="#C9A961"
              strokeWidth="2"
              fill="#C9A961"
              fillOpacity="0.15"
            />
            {/* Extended decorative line */}
            <path d="M40 20 L80 20" stroke="#C9A961" strokeWidth="1.5"/>
            {/* Multiple flourishes */}
            <circle cx="37" cy="20" r="3" fill="#C9A961"/>
            <circle cx="37" cy="13" r="1.5" fill="#C9A961" opacity="0.6"/>
            <circle cx="37" cy="27" r="1.5" fill="#C9A961" opacity="0.6"/>
          </svg>
        </div>
      </div>

      {/* Enhanced decorative accent under title */}
      <div className="flex justify-center mt-6">
        <svg width="200" height="16" viewBox="0 0 200 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 8 Q 50 4, 100 8 T 200 8" stroke="#C9A961" strokeWidth="1.2" fill="none"/>
          <circle cx="100" cy="8" r="3" fill="#C9A961"/>
          <circle cx="85" cy="8" r="1.5" fill="#C9A961" opacity="0.7"/>
          <circle cx="115" cy="8" r="1.5" fill="#C9A961" opacity="0.7"/>
        </svg>
      </div>
    </div>
  )
}
