import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    // 1. IP extraction (Vercel, Cloudflare, standard proxy headers)
    const forwarded = req.headers.get('x-forwarded-for');
    const realIp = req.headers.get('x-real-ip');
    const cfConnectingIp = req.headers.get('cf-connecting-ip');
    
    let ip = forwarded ? forwarded.split(',')[0].trim() : realIp || cfConnectingIp || '';
    
    // 2. Location from Edge headers (Vercel / Cloudflare geolocation)
    const city = req.headers.get('x-vercel-ip-city') || req.headers.get('cf-ipcity') || '';
    const country = req.headers.get('x-vercel-ip-country') || req.headers.get('cf-ipcountry') || '';
    const region = req.headers.get('x-vercel-ip-country-region') || '';

    let location = '';
    if (city && country) {
      location = `${decodeURIComponent(city)}, ${country}`;
    } else if (country) {
      location = country;
    }

    // 3. If running locally (localhost / private subnet), fetch real public IP and location
    const isLocalIp = !ip || ip === '::1' || ip === '127.0.0.1' || ip.startsWith('192.168.') || ip.startsWith('10.') || ip.startsWith('172.16.');

    if (isLocalIp || !location) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 2000);
        const geoRes = await fetch('https://freeipapi.com/api/json', {
          signal: controller.signal,
          headers: { 'Accept': 'application/json' }
        });
        clearTimeout(timeout);
        if (geoRes.ok) {
          const geoData = await geoRes.json();
          if (geoData.ipAddress) ip = geoData.ipAddress;
          if (geoData.cityName && geoData.countryName) {
            location = `${geoData.cityName}, ${geoData.countryName}`;
          } else if (geoData.countryName) {
            location = geoData.countryName;
          }
        }
      } catch {
        // Fallback gracefully
        if (!ip) ip = '127.0.0.1';
        if (!location) location = 'Active Session Network';
      }
    }

    const userAgent = req.headers.get('user-agent') || '';

    return NextResponse.json({
      ip: ip || '127.0.0.1',
      location: location || 'Active Session Network',
      userAgent,
      city: city || '',
      country: country || '',
      region: region || '',
    });
  } catch (error: any) {
    return NextResponse.json({
      ip: '127.0.0.1',
      location: 'Active Session Network',
      error: error?.message || 'Failed to detect IP'
    });
  }
}
