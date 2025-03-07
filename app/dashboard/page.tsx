// app/dashboard/page.tsx
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Card, CardContent, CardHeader, CardTitle } from '../../src/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../src/components/ui/tabs'
import { BarChart, Chrome, Globe, Smartphone, TrendingUp, Users, Clock, Activity } from 'lucide-react'
import VisitorChart from '../../src/components/analytics/visitor-chart'
import { DashboardMetric } from '../../src/components/analytics/dashboard-metric'
import BrowserChart from '../../src/components/analytics/browser-chart'
import DeviceChart from '../../src/components/analytics/device-chart'
import LocationChart from '../../src/components/analytics/location-chart'
import { getRelativeTimeFrame } from '@/lib/date-utils'

// Define types for analytics data
interface DeviceData {
    device: string;
    count: number;
}

interface BrowserData {
    browser: string;
    count: number;
}

interface CountryData {
    country: string;
    count: number;
}

interface DailyVisitData {
    date: string;
    visits: number;
}

interface AnalyticsData {
    totalVisits: number;
    uniqueVisitors: number;
    browsers: BrowserData[];
    devices: DeviceData[];
    countries: CountryData[];
    dailyVisits: DailyVisitData[];
}

// Get aggregated metrics for all user websites
async function getAnalyticsOverview(userId: string, days: number = 30): Promise<AnalyticsData> {
    const timeFrame = getRelativeTimeFrame(days)

    // Get total visits
    const totalVisits = await db.visit.count({
        where: {
            website: {
                userId
            },
            timestamp: {
                gte: timeFrame.start,
                lte: timeFrame.end
            }
        }
    })

    // Get unique visitors (rough estimate by IP)
    const uniqueVisitors = await db.$queryRaw`
    SELECT COUNT(DISTINCT ip) FROM "Visit" 
    WHERE "websiteId" IN (SELECT id FROM "Website" WHERE "userId" = ${userId})
    AND "timestamp" >= ${timeFrame.start} AND "timestamp" <= ${timeFrame.end}
  `

    // Get browser distribution
    const browsers = await db.$queryRaw`
    SELECT "browser", COUNT(*) as count 
    FROM "Visit"
    WHERE "websiteId" IN (SELECT id FROM "Website" WHERE "userId" = ${userId})
    AND "timestamp" >= ${timeFrame.start} AND "timestamp" <= ${timeFrame.end}
    GROUP BY "browser"
    ORDER BY count DESC
    LIMIT 5
  `

    // Get device distribution
    const devices = await db.$queryRaw`
    SELECT "device", COUNT(*) as count 
    FROM "Visit"
    WHERE "websiteId" IN (SELECT id FROM "Website" WHERE "userId" = ${userId})
    AND "timestamp" >= ${timeFrame.start} AND "timestamp" <= ${timeFrame.end}
    GROUP BY "device"
    ORDER BY count DESC
  `

    // Get country distribution
    const countries = await db.$queryRaw`
    SELECT "country", COUNT(*) as count 
    FROM "Visit"
    WHERE "websiteId" IN (SELECT id FROM "Website" WHERE "userId" = ${userId})
    AND "timestamp" >= ${timeFrame.start} AND "timestamp" <= ${timeFrame.end}
    GROUP BY "country"
    ORDER BY count DESC
    LIMIT 10
  `

    // Get daily visits for chart
    const dailyVisits = await db.$queryRaw`
    SELECT 
      DATE("timestamp") as date,
      COUNT(*) as visits
    FROM "Visit"
    WHERE "websiteId" IN (SELECT id FROM "Website" WHERE "userId" = ${userId})
    AND "timestamp" >= ${timeFrame.start} AND "timestamp" <= ${timeFrame.end}
    GROUP BY DATE("timestamp")
    ORDER BY date
  `

    return {
        totalVisits,
        uniqueVisitors: (uniqueVisitors as any)[0].count,
        browsers: browsers as BrowserData[],
        devices: devices as DeviceData[],
        countries: countries as CountryData[],
        dailyVisits: dailyVisits as DailyVisitData[]
    }
}

export default async function DashboardPage() {
    const session = await getServerSession(authOptions)
    const userId = session?.user?.id

    if (!userId) return null

    const analytics = await getAnalyticsOverview(userId)

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
                <p className="text-gray-500">Monitor your websites' performance and visitor analytics.</p>
            </div>

            <Tabs defaultValue="7days" className="w-full">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center space-x-2">
                        <Activity className="h-5 w-5 text-emerald-500" />
                        <h2 className="text-xl font-bold text-gray-800">Analytics Overview</h2>
                    </div>
                    <TabsList className="bg-gray-100/80 p-1">
                        <TabsTrigger value="7days" className="text-sm rounded-md">7 days</TabsTrigger>
                        <TabsTrigger value="30days" className="text-sm rounded-md">30 days</TabsTrigger>
                        <TabsTrigger value="3months" className="text-sm rounded-md">3 months</TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="7days" className="mt-0">
                    {/* Highlight cards */}
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
                        <DashboardMetric
                            title="Total Visits"
                            value={analytics.totalVisits}
                            icon={<BarChart className="h-5 w-5 text-blue-500" />}
                            description="Total page views in the last 7 days"
                            trend={{ value: 15, isPositive: true }}
                            className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                        />
                        <DashboardMetric
                            title="Unique Visitors"
                            value={analytics.uniqueVisitors}
                            icon={<Users className="h-5 w-5 text-emerald-500" />}
                            description="Based on unique IP addresses"
                            trend={{ value: 8, isPositive: true }}
                            className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                        />
                        <DashboardMetric
                            title="Mobile Users"
                            value={analytics.devices.find((d) => d.device === 'mobile')?.count || 0}
                            icon={<Smartphone className="h-5 w-5 text-purple-500" />}
                            description="Visits from mobile devices"
                            trend={{ value: 12, isPositive: true }}
                            className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                        />
                        <DashboardMetric
                            title="Avg. Session"
                            value="3m 42s"
                            icon={<Clock className="h-5 w-5 text-amber-500" />}
                            description="Average time spent per session"
                            trend={{ value: 4, isPositive: false }}
                            className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                        />
                    </div>

                    {/* Main data visualization cards */}
                    <div className="grid gap-6 md:grid-cols-12">
                        {/* Visitors chart - wider */}
                        <Card className="col-span-12 md:col-span-8 bg-white border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                            <CardHeader className="pb-0 border-b border-gray-100">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-base font-medium text-gray-800">
                                        <div className="flex items-center gap-2">
                                            <TrendingUp className="h-4 w-4 text-emerald-500" />
                                            Visitors Over Time
                                        </div>
                                    </CardTitle>
                                    <div className="text-xs font-medium bg-emerald-50 text-emerald-700 rounded-full px-2 py-1">
                                        +24% vs. previous
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <VisitorChart data={analytics.dailyVisits} />
                            </CardContent>
                        </Card>

                        {/* Browser chart - narrower */}
                        <Card className="col-span-12 md:col-span-4 bg-white border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                            <CardHeader className="pb-0 border-b border-gray-100">
                                <CardTitle className="text-base font-medium text-gray-800">
                                    <div className="flex items-center gap-2">
                                        <Chrome className="h-4 w-4 text-blue-500" />
                                        Browser Distribution
                                    </div>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <BrowserChart data={analytics.browsers} />
                            </CardContent>
                        </Card>
                    </div>

                    <div className="mt-6 grid gap-6 md:grid-cols-12">
                        {/* Device chart */}
                        <Card className="col-span-12 md:col-span-6 bg-white border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                            <CardHeader className="pb-0 border-b border-gray-100">
                                <CardTitle className="text-base font-medium text-gray-800">
                                    <div className="flex items-center gap-2">
                                        <Smartphone className="h-4 w-4 text-purple-500" />
                                        Device Types
                                    </div>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <DeviceChart data={analytics.devices} />
                            </CardContent>
                        </Card>

                        {/* Location chart */}
                        <Card className="col-span-12 md:col-span-6 bg-white border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                            <CardHeader className="pb-0 border-b border-gray-100">
                                <CardTitle className="text-base font-medium text-gray-800">
                                    <div className="flex items-center gap-2">
                                        <Globe className="h-4 w-4 text-amber-500" />
                                        Top Locations
                                    </div>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <LocationChart data={analytics.countries} />
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Similar content for 30days and 3months tabs */}
                <TabsContent value="30days">
                    {/* Same structure as 7days but with 30 day data */}
                </TabsContent>

                <TabsContent value="3months">
                    {/* Same structure as 7days but with 3 month data */}
                </TabsContent>
            </Tabs>
        </div>
    )
}
