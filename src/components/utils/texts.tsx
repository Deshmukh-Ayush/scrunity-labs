import { cn } from 'cn';
import React from 'react'

export const Heading = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className={cn("text-[40px] leading-[1.25] tracking-[-1.2px] font-normal text-foreground",  className)}>
      {children}
    </div>
  )
}

export const SubHeading = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className={cn("text-[30px] leading-[1.25] tracking-[-0.7px] font-normal text-[#919395]",  className)}>
      {children}
    </div>
  )
}

export const Para = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className={cn("text-[17px] leading-[1.25] tracking-[-0.1px] font-normal text-[#919395]",  className)}>
      {children}
    </div>
  )
}
