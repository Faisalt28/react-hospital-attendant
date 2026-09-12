import { createContext, useContext, useState, useEffect } from "react"

interface ThemeContextType {
  isDark: boolean
  toggleDark: () => void
}

const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  toggleDark: () => {},
})

export const useTheme = () => useContext(ThemeContext)

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }, [isDark])

  return (
    <ThemeContext.Provider value={{ isDark, toggleDark: () => setIsDark((d) => !d) }}>
      {children}
    </ThemeContext.Provider>
  )
}
