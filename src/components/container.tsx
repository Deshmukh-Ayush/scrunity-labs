import { cn } from 'cn';
import React from 'react'

export const Container = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className={cn(
      "mx-auto max-w-239 px-4",
      className
    )}>
      {children}
    </div>
  )
}
