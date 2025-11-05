'use client'

import * as React from 'react'
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from 'next-themes'

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  React.useEffect(() => {
    // Update primary text color based on theme settings
    const primaryTextColor = document.documentElement.style.getPropertyValue('--primary-text-color')
    if (primaryTextColor) {
      document.documentElement.style.setProperty('--primary-text-color', primaryTextColor)
    }
  }, [])

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
