import { Construction } from "lucide-react"

interface PlaceholderPageProps {
  title: string
  description: string
  icon?: React.ElementType
}

const PlaceholderPage = ({ title, description, icon: Icon = Construction }: PlaceholderPageProps) => (
  <div className="p-6 flex flex-col items-center justify-center min-h-[60vh]">
    <div className="text-center max-w-md">
      <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/20 mx-auto mb-4">
        <Icon className="w-8 h-8 text-blue-500 dark:text-blue-400" />
      </div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">{title}</h1>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">{description}</p>
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
        <div className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
        <span className="text-xs font-medium text-amber-700 dark:text-amber-400">Sedang dalam pengembangan</span>
      </div>
    </div>
  </div>
)

export { PlaceholderPage }
