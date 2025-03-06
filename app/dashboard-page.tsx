// app/dashboard/page.tsx
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Card, CardContent, CardHeader, CardTitle } from '../../src/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../src/components/ui/tabs'
import { BarChart, Chrome, Globe, Smartphone } from 'lucide-react'
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
        <div className="space-y-6">
            <Tabs defaultValue="7days" className="w-full">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Analytics Overview</h2>
                    <TabsList>
                        <TabsTrigger value="7days">7 days</TabsTrigger>
                        <TabsTrigger value="30days">30 days</TabsTrigger>
                        <TabsTrigger value="3months">3 months</TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="7days" className="mt-6">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        <DashboardMetric
                            title="Total Visits"
                            value={analytics.totalVisits}
                            icon={<BarChart className="h-5 w-5 text-blue-600" />}
                            description="Total page views in the last 7 days"
                        />
                        <DashboardMetric
                            title="Unique Visitors"
                            value={analytics.uniqueVisitors}
                            icon={<Globe className="h-5 w-5 text-green-600" />}
                            description="Based on unique IP addresses"
                        />
                        <DashboardMetric
                            title="Mobile Users"
                            value={analytics.devices.find((d) => d.device === 'mobile')?.count || 0}
                            icon={<Smartphone className="h-5 w-5 text-purple-600" />}
                            description="Visits from mobile devices"
                        />
                        <DashboardMetric
                            title="Top Browser"
                            value={analytics.browsers[0]?.browser || 'Unknown'}
                            icon={<Chrome className="h-5 w-5 text-orange-600" />}
                            description={`${Math.round((analytics.browsers[0]?.count / analytics.totalVisits) * 100)}% of visits`}
                        />
                    </div>

                    <div className="mt-6 grid gap-6 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Visitors Over Time</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <VisitorChart data={analytics.dailyVisits} />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Browser Distribution</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <BrowserChart data={analytics.browsers} />
                            </CardContent>
                        </Card>
                    </div>

                    <div className="mt-6 grid gap-6 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Device Types</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <DeviceChart data={analytics.devices} />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Top Locations</CardTitle>
                            </CardHeader>
                            <CardContent>
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