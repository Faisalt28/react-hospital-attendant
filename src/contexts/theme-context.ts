import { createContext } from "react"

export interface ThemeContextType {
  isDark: boolean
  toggleDark: () => void
}

export const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  toggleDark: () => {},
})
