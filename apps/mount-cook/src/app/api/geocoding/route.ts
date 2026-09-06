import { Client, Status } from '@googlemaps/google-maps-services-js';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const googleMapsClient = new Client({});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address =
    searchParams.get('address') ??
    searchParams.get('location') ??
    searchParams.get('q');

  if (!address?.trim()) {
    return NextResponse.json(
      { error: 'Missing required address query parameter.' },
      { status: 400 }
    );
  }

  const apiKey = process.env.GOOGLE_MAPS_PLATFORM_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: 'Google Maps API key is not configured.' },
      { status: 500 }
    );
  }

  try {
    const response = await googleMapsClient.geocode({
      params: {
        address,
        key: apiKey,
      },
    });

    const { results, status, error_message: errorMessage } = response.data;

    if (status === Status.OK || status === Status.ZERO_RESULTS) {
      return NextResponse.json({ results, status });
    }

    return NextResponse.json(
      {
        error: errorMessage ?? `Google Geocoding API returned ${status}.`,
        status,
      },
      { status: 502 }
    );
  } catch (error) {
    console.error('Google Geocoding API request failed.', error);

    return NextResponse.json(
      { error: 'Google Geocoding API request failed.' },
      { status: 502 }
    );
  }
}
