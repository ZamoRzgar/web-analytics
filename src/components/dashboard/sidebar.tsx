"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LucideHome, LucideGlobe, LucideSettings, LucideLogOut, LucideBarChart2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { signOut } from 'next-auth/react'



interface SidebarProps {
    className?: string
}

export default function Sidebar({ className }: SidebarProps) {
    const pathname = usePathname()
    
    const handleSignOut = async (e: React.MouseEvent) => {
        e.preventDefault()
        await signOut({ callbackUrl: '/login' })
    }
    
    return (
        <aside className={cn('py-8 px-6 bg-gradient-to-br from-gray-900 to-gray-800 text-white h-full flex flex-col shadow-xl', className)}>
            <div className="mb-10 px-2">
                <div className="flex items-center gap-3">
                    <LucideBarChart2 className="h-7 w-7 text-emerald-400" />
                    <Link href="/dashboard" className="focus:outline-none focus:ring-2 focus:ring-emerald-400 rounded-sm">
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">Analytics</h2>
                    </Link>
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
                    isActive={pathname === '/dashboard/websites' || pathname.startsWith('/dashboard/websites/')}
                />
                <NavItem 
                    href="/dashboard/settings" 
                    icon={<LucideSettings className="h-5 w-5" />} 
                    label="Settings" 
                    isActive={pathname === '/dashboard/settings'}
                />
            </nav>
            
            <div className="mt-auto pt-6 border-t border-gray-700">
                <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-4 rounded-lg px-4 py-3 transition-all duration-200 text-gray-400 hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-1 focus:ring-offset-gray-800"
                    aria-label="Sign out"
                >
                    <span className="text-gray-500">
                        <LucideLogOut className="h-5 w-5" />
                    </span>
                    <span className="text-sm">Sign out</span>
                </button>
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
                "flex items-center gap-4 rounded-lg px-4 py-3 transition-all duration-200 group relative focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-1 focus:ring-offset-gray-800",
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