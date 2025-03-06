import Link from 'next/link'
import { LucideHome, LucideGlobe, LucideSettings, LucideLogOut } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SidebarProps {
    className?: string
}

export default function Sidebar({ className }: SidebarProps) {
    return (
        <aside className={cn('py-6 px-2 bg-white', className)}>
            <div className="px-3 py-2">
                <h2 className="text-lg font-semibold">Analytics Dashboard</h2>
            </div>
            <nav className="mt-6 flex flex-col gap-2">
                <NavItem href="/dashboard" icon={<LucideHome className="h-4 w-4" />} label="Overview" />
                <NavItem href="/dashboard/websites" icon={<LucideGlobe className="h-4 w-4" />} label="Websites" />
                <NavItem href="/dashboard/settings" icon={<LucideSettings className="h-4 w-4" />} label="Settings" />
                <NavItem href="/api/auth/signout" icon={<LucideLogOut className="h-4 w-4" />} label="Sign out" />
            </nav>
        </aside>
    )
}

interface NavItemProps {
    href: string
    icon: React.ReactNode
    label: string
}

const NavItem = ({ href, icon, label }: NavItemProps) => {
    return (
        <Link
            href={href}
            className="flex items-center gap-3 rounded-md px-3 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
            tabIndex={0}
            aria-label={label}
        >
            {icon}
            <span>{label}</span>
        </Link>
    )
}