"use client"

interface CategoryHeaderProps {
  title: string
}

export function CategoryHeader({ title }: CategoryHeaderProps) {
  return (
    <div className="text-center my-16 px-4">
      <div className="flex items-center justify-center gap-6">
        {/* Sol Dekoratif Scrollwork Süsleme */}
        <div className="flex-shrink-0 hidden sm:block">
          <svg width="80" height="40" viewBox="0 0 80 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Fleur-de-lis inspired ornament */}
            <path
              d="M75 20 Q 65 20, 60 15 Q 55 10, 50 12 Q 48 13, 50 15 Q 52 17, 50 20 Q 48 23, 50 25 Q 52 27, 50 28 Q 55 30, 60 25 Q 65 20, 75 20 Z"
              stroke="#C9A961"
              strokeWidth="0.8"
              fill="none"
            />
            {/* Extended line */}
            <path d="M0 20 L45 20" stroke="#C9A961" strokeWidth="0.5"/>
            {/* Small flourish */}
            <circle cx="47" cy="20" r="1.5" fill="#C9A961" opacity="0.7"/>
          </svg>
        </div>

        <h2 className="text-3xl sm:text-4xl font-['Playfair_Display',serif] text-[#C9A961] tracking-[0.3em] uppercase font-bold">
          {title}
        </h2>

        {/* Sağ Dekoratif Scrollwork Süsleme (mirror of left) */}
        <div className="flex-shrink-0 hidden sm:block">
          <svg width="80" height="40" viewBox="0 0 80 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Fleur-de-lis inspired ornament (mirrored) */}
            <path
              d="M5 20 Q 15 20, 20 15 Q 25 10, 30 12 Q 32 13, 30 15 Q 28 17, 30 20 Q 32 23, 30 25 Q 28 27, 30 28 Q 25 30, 20 25 Q 15 20, 5 20 Z"
              stroke="#C9A961"
              strokeWidth="0.8"
              fill="none"
            />
            {/* Extended line */}
            <path d="M35 20 L80 20" stroke="#C9A961" strokeWidth="0.5"/>
            {/* Small flourish */}
            <circle cx="33" cy="20" r="1.5" fill="#C9A961" opacity="0.7"/>
          </svg>
        </div>
      </div>

      {/* Subtle decorative accent under title */}
      <div className="flex justify-center mt-4">
        <svg width="120" height="8" viewBox="0 0 120 8" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 4 Q 30 0, 60 4 T 120 4" stroke="#C9A961" strokeWidth="0.5" fill="none" opacity="0.5"/>
        </svg>
      </div>
    </div>
  )
}
