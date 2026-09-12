import type { ReactNode } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowRightIcon } from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const BentoGrid = ({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) => {
  return (
    <div
      className={cn(
        "grid w-full auto-rows-[22rem] grid-cols-1 md:grid-cols-3 gap-4",
        className,
      )}
    >
      {children}
    </div>
  )
}

const BentoCard = ({
  name,
  className,
  background,
  Icon,
  description,
  href,
  onClick,
  cta,
}: {
  name: string
  className?: string
  background: ReactNode
  Icon: any
  description: string | ReactNode
  href?: string
  onClick?: () => void
  cta: string
}) => {
  const navigate = useNavigate()

  const handleAction = () => {
    if (onClick) {
      onClick()
    } else if (href) {
      navigate(href)
    }
  }

  return (
    <div
      key={name}
      className={cn(
        "group relative col-span-1 md:col-span-3 flex flex-col justify-between overflow-hidden rounded-3xl",
        // light styles
        "bg-white border border-gray-200/80 [box-shadow:0_0_0_1px_rgba(0,0,0,.02),0_4px_12px_rgba(0,0,0,.04)]",
        // dark styles
        "transform-gpu dark:bg-gray-900 dark:border-gray-800 dark:[box-shadow:0_-20px_80px_-20px_#ffffff0d_inset]",
        className,
      )}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {background}
      </div>
      <div className="pointer-events-none z-10 flex transform-gpu flex-col gap-1.5 p-6 transition-all duration-300 group-hover:-translate-y-8">
        <div className="h-12 w-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center transform-gpu transition-all duration-300 ease-in-out group-hover:scale-90 shadow-xs">
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-2">
          {name}
        </h3>
        <div className="max-w-lg text-sm text-gray-500 dark:text-gray-400">
          {description}
        </div>
      </div>

      <div
        className={cn(
          "pointer-events-none absolute bottom-0 flex w-full translate-y-10 transform-gpu flex-row items-center p-6 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 z-20",
        )}
      >
        <Button
          onClick={handleAction}
          variant="default"
          size="sm"
          className="pointer-events-auto bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-md cursor-pointer inline-flex items-center"
        >
          {cta}
          <ArrowRightIcon className="ml-2 h-4 w-4" />
        </Button>
      </div>
      <div className="pointer-events-none absolute inset-0 transform-gpu transition-all duration-300 group-hover:bg-black/[.02] group-hover:dark:bg-white/[.02]" />
    </div>
  )
}

export { BentoCard, BentoGrid }
