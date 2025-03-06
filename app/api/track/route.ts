// app/api/track/route.ts
import { NextResponse } from 'next/server'
import { db } from '../../../lib/db'
import { UAParser } from 'ua-parser-js'
import { headers } from 'next/headers'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { websiteId, pathname, referrer } = body

    if (!websiteId) {
      return NextResponse.json(
        { error: 'Website ID is required' },
        { status: 400 }
      )
    }

    // Get headers for analytics data
    const headersList = await headers()
    const userAgent = headersList.get('user-agent') || ''
    const ip = headersList.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1'

    // Parse user agent
    const parser = new UAParser(userAgent)
    const browser = parser.getBrowser()
    const os = parser.getOS()
    const device = parser.getDevice()

    // Get geolocation from IP (would require a service like ipinfo.io)
    // This is a placeholder - you'll need to implement actual IP geolocation
    const geoData = await fetchGeoData(ip)

    // Record the visit
    const visit = await db.visit.create({
      data: {
        websiteId,
        pathname: pathname || '/',
        referrer: referrer || '',
        ip,
        browser: browser.name || 'Unknown',
        browserVersion: browser.version || 'Unknown',
        os: `${os.name || 'Unknown'} ${os.version || ''}`.trim(),
        device: device.type || 'desktop',
        country: geoData.country,
        city: geoData.city,
        region: geoData.region
      }
    })

    return NextResponse.json({ success: true, id: visit.id })
  } catch (error) {
    console.error('Error tracking visit:', error)
    return NextResponse.json(
      { error: 'Failed to track visit' },
      { status: 500 }
    )
  }
}

// Placeholder function for geolocation
async function fetchGeoData(ip: string) {
  // In production, use a service like ipinfo.io or maxmind
  // For now, return placeholder data
  // Example with ipinfo.io:
  // const response = await fetch(`https://ipinfo.io/${ip}/json?token=YOUR_TOKEN`)
  // return await response.json()

  return {
    country: 'Unknown',
    city: 'Unknown',
    region: 'Unknown'
  }
}