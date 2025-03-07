'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { LucideMenu, LucideSearch, LucideBell, LucideHelpCircle, LucideChevronDown } from 'lucide-react'
import { Button } from '../ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { cn } from '@/lib/utils'
import { Input } from '../ui/input'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger
} from '../ui/dropdown-menu'

interface HeaderProps {
  className?: string
}

export default function Header({ className }: HeaderProps) {
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
    const pathname = usePathname()
    const { data: session } = useSession()

    // Get user initials for avatar fallback
    const getUserInitials = () => {
        if (!session?.user?.name) return 'U'
        return session.user.name
            .split(' ')
            .map(name => name[0])
            .join('')
            .toUpperCase()
            .substring(0, 2)
    }

    // Extract page title from pathname
    const getPageTitle = () => {
        const path = pathname.split('/').filter(Boolean)
        if (path.length === 1 && path[0] === 'dashboard') return 'Overview'
        if (path.length > 1) return path[1].charAt(0).toUpperCase() + path[1].slice(1)
        return 'Dashboard'
    }

    const handleToggleSidebar = () => {
        setIsMobileSidebarOpen(!isMobileSidebarOpen)
    }

    return (
        <header className={cn("bg-white py-3 px-6 flex items-center justify-between", className)}>
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden"
                    onClick={handleToggleSidebar}
                    aria-label="Toggle menu"
                >
                    <LucideMenu className="h-5 w-5" />
                </Button>
                
                {/* Search bar - hidden on mobile */}
                <div className="hidden md:flex items-center relative">
                    <div className="relative rounded-md w-72">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <LucideSearch className="h-4 w-4 text-gray-400" />
                        </div>
                        <Input 
                            type="text" 
                            placeholder="Search..." 
                            className="pl-10 py-2 text-sm bg-gray-50 border-gray-200 focus-visible:ring-emerald-500"
                        />
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-3">
                {/* Notification icon */}
                <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700">
                    <LucideBell className="h-5 w-5" />
                </Button>
                
                {/* Help icon */}
                <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700">
                    <LucideHelpCircle className="h-5 w-5" />
                </Button>
                
                {/* User profile dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-9 flex items-center gap-2 px-2 hover:bg-gray-100">
                            <Avatar className="h-8 w-8 border border-gray-200">
                                <AvatarImage src={session?.user?.image || ''} />
                                <AvatarFallback className="bg-emerald-100 text-emerald-800 text-xs">
                                    {getUserInitials()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="hidden md:flex flex-col items-start text-sm">
                                <span className="font-medium">{session?.user?.name || 'User'}</span>
                                <span className="text-xs text-gray-500">Account</span>
                            </div>
                            <LucideChevronDown className="h-4 w-4 text-gray-500" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Profile</DropdownMenuItem>
                        <DropdownMenuItem>Settings</DropdownMenuItem>
                        <DropdownMenuItem>Billing</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <a href="/api/auth/signout" className="w-full flex">Sign out</a>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    )
}