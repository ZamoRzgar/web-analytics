import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { Button } from '@/src/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Plus, Globe, ArrowUpRight, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { WebsiteAddDialog } from '@/src/components/dashboard/website-add-dialog'

async function getWebsites(userId: string) {
    return await db.website.findMany({
        where: { userId },
        include: {
            _count: {
                select: { visits: true }
            }
        },
        orderBy: { createdAt: 'desc' }
    })
}

export default async function WebsitesPage() {
    const session = await getServerSession(authOptions)
    const userId = session?.user?.id

    if (!userId) return null

    const websites = await getWebsites(userId)

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Websites</h1>
                <p className="text-gray-500">Manage your tracked websites and view their analytics.</p>
            </div>

            {/* Add Website Button */}
            <div className="flex justify-end">
                <WebsiteAddDialog>
                    <Button className="bg-emerald-500 hover:bg-emerald-600">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Website
                    </Button>
                </WebsiteAddDialog>
            </div>

            {/* Websites Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {websites.map((website) => (
                    <Card key={website.id} className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Globe className="h-5 w-5 text-gray-500" />
                                    <span className="truncate">{website.domain}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                    <Link href={`/dashboard/websites/${website.id}`}>
                                        <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700">
                                            <ArrowUpRight className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Link href={`/dashboard/websites/${website.id}`} className="block">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Total Visits</p>
                                        <p className="text-2xl font-bold text-gray-900">{website._count.visits}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Added On</p>
                                        <p className="text-sm text-gray-700">
                                            {new Date(website.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        </CardContent>
                    </Card>
                ))}

                {/* Empty State */}
                {websites.length === 0 && (
                    <Card className="col-span-full bg-gray-50 border-dashed">
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <Globe className="h-12 w-12 text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-1">No websites yet</h3>
                            <p className="text-gray-500 text-center mb-4">
                                Add your first website to start tracking analytics
                            </p>
                            <WebsiteAddDialog>
                                <Button className="bg-emerald-500 hover:bg-emerald-600">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Website
                                </Button>
                            </WebsiteAddDialog>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}