'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { LucideMenu } from 'lucide-react'
import { Button } from '../ui/button'

export default function Header() {
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
    const pathname = usePathname()

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
        <header className="bg-white border-b py-4 px-6 flex items-center justify-between">
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
                <h1 className="text-xl font-semibold">{getPageTitle()}</h1>
            </div>
            <div className="flex items-center gap-4">
                {/* Profile/user info can go here */}
            </div>
        </header>
    )
}