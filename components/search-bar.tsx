"use client"

import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Menüde ara..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10 py-6 text-base"
      />
    </div>
  )
}
