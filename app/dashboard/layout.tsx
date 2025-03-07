// app/dashboard/layout.tsx
import { ReactNode } from 'react'
import Sidebar from '@/src/components/dashboard/sidebar'
import Header from '@/src/components/dashboard/header'
import { Toaster } from '@/src/components/ui/toaster'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

interface DashboardLayoutProps {
    children: ReactNode
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
    const session = await auth()

    if (!session) {
        redirect('/login')
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row md:overflow-hidden">
            <Sidebar className="w-full md:w-64 md:flex-shrink-0" />
            <div className="flex-grow flex flex-col overflow-hidden">
                <Header className="border-b border-gray-200 bg-white shadow-sm z-10" />
                <main className="flex-grow overflow-auto p-6 bg-gray-50/50">
                    {children}
                </main>
            </div>
            <Toaster />
        </div>
    )
}

