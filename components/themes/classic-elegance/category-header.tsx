"use client"

interface CategoryHeaderProps {
  title: string
}

export function CategoryHeader({ title }: CategoryHeaderProps) {
  return (
    <div className="text-center my-16 px-4">
      <div className="flex items-center justify-center gap-6">
        {/* Sol Dekoratif Süsleme */}
        <div className="flex-shrink-0">
          <svg width="60" height="20" viewBox="0 0 60 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 10 L20 10 M40 10 L60 10" stroke="#C9A961" strokeWidth="0.5"/>
            <circle cx="30" cy="10" r="3" stroke="#C9A961" strokeWidth="0.5" fill="none"/>
          </svg>
        </div>

        <h2 className="text-3xl sm:text-4xl font-serif text-[#C9A961] tracking-[0.3em] uppercase">
          {title}
        </h2>

        {/* Sağ Dekoratif Süsleme */}
        <div className="flex-shrink-0">
          <svg width="60" height="20" viewBox="0 0 60 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 10 L20 10 M40 10 L60 10" stroke="#C9A961" strokeWidth="0.5"/>
            <circle cx="30" cy="10" r="3" stroke="#C9A961" strokeWidth="0.5" fill="none"/>
          </svg>
        </div>
      </div>
    </div>
  )
}
