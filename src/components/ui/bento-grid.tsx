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
        "grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-auto md:auto-rows-[20rem] lg:auto-rows-[22rem]",
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
        "group relative col-span-1 md:col-span-1 lg:col-span-3 flex flex-col justify-between overflow-hidden rounded-3xl",
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
      
      {/* Card Header & Content */}
      <div className="z-10 flex transform-gpu flex-col gap-1.5 p-4 sm:p-6 transition-all duration-300 md:group-hover:-translate-y-6">
        <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center transform-gpu transition-all duration-300 ease-in-out md:group-hover:scale-90 shadow-xs">
          <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mt-2">
          {name}
        </h3>
        <div className="max-w-lg text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          {description}
        </div>
      </div>

      {/* CTA Button: Visible permanently on Mobile/Touch, sleek animated on Desktop */}
      <div
        className={cn(
          "z-20 p-4 sm:p-6 pt-0 flex w-full items-center",
          "md:absolute md:bottom-0 md:translate-y-10 md:opacity-0 md:transition-all md:duration-300 md:group-hover:translate-y-0 md:group-hover:opacity-100",
        )}
      >
        <Button
          onClick={handleAction}
          variant="default"
          size="sm"
          className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-md cursor-pointer inline-flex items-center justify-center text-xs font-semibold py-2.5"
        >
          <span>{cta}</span>
          <ArrowRightIcon className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <div className="pointer-events-none absolute inset-0 transform-gpu transition-all duration-300 md:group-hover:bg-black/[.02] md:group-hover:dark:bg-white/[.02]" />
    </div>
  )
}

export { BentoCard, BentoGrid }

