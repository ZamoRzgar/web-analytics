"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LucideHome, LucideGlobe, LucideSettings, LucideLogOut, LucideBarChart2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SidebarProps {
    className?: string
}

export default function Sidebar({ className }: SidebarProps) {
    const pathname = usePathname()
    
    return (
        <aside className={cn('py-8 px-6 bg-gradient-to-br from-gray-900 to-gray-800 text-white h-full flex flex-col shadow-xl', className)}>
            <div className="mb-10 px-2">
                <div className="flex items-center gap-3">
                    <LucideBarChart2 className="h-7 w-7 text-emerald-400" />
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">Analytics</h2>
                </div>
            </div>
            
            <nav className="flex-1 flex flex-col gap-2">
                <NavItem 
                    href="/dashboard" 
                    icon={<LucideHome className="h-5 w-5" />} 
                    label="Overview" 
                    isActive={pathname === '/dashboard'}
                />
                <NavItem 
                    href="/dashboard/websites" 
                    icon={<LucideGlobe className="h-5 w-5" />} 
                    label="Websites" 
                    isActive={pathname?.startsWith('/dashboard/websites')}
                />
                <NavItem 
                    href="/dashboard/settings" 
                    icon={<LucideSettings className="h-5 w-5" />} 
                    label="Settings" 
                    isActive={pathname === '/dashboard/settings'}
                />
            </nav>
            
            <div className="mt-auto pt-6 border-t border-gray-700">
                <NavItem 
                    href="/api/auth/signout" 
                    icon={<LucideLogOut className="h-5 w-5 text-gray-400" />} 
                    label="Sign out" 
                    variant="subtle"
                />
            </div>
        </aside>
    )
}

interface NavItemProps {
    href: string
    icon: React.ReactNode
    label: string
    isActive?: boolean
    variant?: 'default' | 'subtle'
}

const NavItem = ({ href, icon, label, isActive = false, variant = 'default' }: NavItemProps) => {
    return (
        <Link
            href={href}
            className={cn(
                "flex items-center gap-4 rounded-lg px-4 py-3 transition-all duration-200 group relative",
                variant === 'default' 
                    ? "hover:bg-gray-700/50" 
                    : "text-gray-400 hover:text-gray-300",
                isActive && variant === 'default' && "bg-gradient-to-r from-emerald-500/20 to-blue-500/20 text-white font-medium"
            )}
            aria-label={label}
        >
            <span className={cn(
                "transition-colors duration-200",
                isActive ? "text-emerald-400" : variant === 'default' ? "text-gray-400 group-hover:text-emerald-400" : "text-gray-500"
            )}>
                {icon}
            </span>
            <span className="text-sm">
                {label}
            </span>
            {isActive && variant === 'default' && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-emerald-400 to-blue-500 rounded-r-full" />
            )}
        </Link>
    )
}