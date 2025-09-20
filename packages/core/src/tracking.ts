// Live Aircraft Tracking Integration
// Supports multiple ADS-B data sources: OpenSky, ADS-B Exchange, FlightAware

export interface AircraftPosition {
  icao24: string;
  callsign?: string;
  latitude?: number;
  longitude?: number;
  baroAltitude?: number;
  geoAltitude?: number;
  velocity?: number;
  trueTrack?: number;
  verticalRate?: number;
  timePosition: number;
  lastContact: number;
  onGround: boolean;
  spi: boolean;
  squawk?: string;
  originCountry?: string;
}

export interface TrackingConfig {
  opensky?: {
    username?: string;
    password?: string;
  };
  adsbExchange?: {
    apiKey?: string;
  };
  flightaware?: {
    apiKey?: string;
  };
}

export class FlightTracker {
  private config: TrackingConfig;
  private cache: Map<string, AircraftPosition[]> = new Map();
  private cacheExpiry: Map<string, number> = new Map();

  constructor(config: TrackingConfig) {
    this.config = config;
  }

  // Get aircraft positions from OpenSky Network
  async getOpenSkyPositions(icao24?: string): Promise<AircraftPosition[]> {
    const url = icao24 
      ? `https://opensky-network.org/api/states/all?icao24=${icao24}`
      : 'https://opensky-network.org/api/states/all';
    
    try {
      const headers: Record<string, string> = {};
      
      // Add authentication if provided
      if (this.config.opensky?.username && this.config.opensky?.password) {
        const auth = btoa(`${this.config.opensky.username}:${this.config.opensky.password}`);
        headers['Authorization'] = `Basic ${auth}`;
      }

      const response = await fetch(url, { headers });
      
      if (!response.ok) {
        throw new Error(`OpenSky API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.states || !Array.isArray(data.states)) {
        return [];
      }

      return data.states.map((state: any[]) => ({
        icao24: state[0],
        callsign: state[1]?.trim(),
        originCountry: state[2],
        timePosition: state[3] * 1000, // Convert to milliseconds
        lastContact: state[4] * 1000,
        longitude: state[5],
        latitude: state[6],
        baroAltitude: state[7],
        onGround: state[8],
        velocity: state[9],
        trueTrack: state[10],
        verticalRate: state[11],
        squawk: state[14],
        spi: state[15],
      })).filter((pos: AircraftPosition) => pos.latitude && pos.longitude);
    } catch (error) {
      console.error('OpenSky API error:', error);
      return [];
    }
  }

  // Get aircraft positions from ADS-B Exchange
  async getADSBExchangePositions(icao24?: string): Promise<AircraftPosition[]> {
    const url = icao24
      ? `https://adsbexchange-com1.p.rapidapi.com/v2/icao/${icao24}/`
      : 'https://adsbexchange-com1.p.rapidapi.com/v2/lat/0/lon/0/dist/100/';

    try {
      const headers: Record<string, string> = {
        'X-RapidAPI-Key': this.config.adsbExchange?.apiKey || '',
        'X-RapidAPI-Host': 'adsbexchange-com1.p.rapidapi.com'
      };

      const response = await fetch(url, { headers });
      
      if (!response.ok) {
        throw new Error(`ADS-B Exchange API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.aircraft || !Array.isArray(data.aircraft)) {
        return [];
      }

      return data.aircraft.map((aircraft: any) => ({
        icao24: aircraft.hex,
        callsign: aircraft.flight?.trim(),
        latitude: aircraft.lat,
        longitude: aircraft.lon,
        baroAltitude: aircraft.alt_baro,
        geoAltitude: aircraft.alt_geom,
        velocity: aircraft.gs,
        trueTrack: aircraft.track,
        verticalRate: aircraft.baro_rate,
        timePosition: aircraft.timestamp * 1000,
        lastContact: aircraft.seen * 1000,
        onGround: aircraft.ground,
        squawk: aircraft.squawk,
        originCountry: aircraft.country,
        spi: false,
      })).filter((pos: AircraftPosition) => pos.latitude && pos.longitude);
    } catch (error) {
      console.error('ADS-B Exchange API error:', error);
      return [];
    }
  }

  // Get specific aircraft track history
  async getAircraftTrack(icao24: string, hours: number = 1): Promise<AircraftPosition[]> {
    const cacheKey = `${icao24}-${hours}h`;
    const now = Date.now();
    
    // Check cache first
    if (this.cache.has(cacheKey) && this.cacheExpiry.get(cacheKey)! > now) {
      return this.cache.get(cacheKey)!;
    }

    try {
      // Try OpenSky first (free, no API key required)
      let positions = await this.getOpenSkyPositions(icao24);
      
      // If no results and ADS-B Exchange is configured, try that
      if (positions.length === 0 && this.config.adsbExchange?.apiKey) {
        positions = await this.getADSBExchangePositions(icao24);
      }

      // Cache for 30 seconds
      this.cache.set(cacheKey, positions);
      this.cacheExpiry.set(cacheKey, now + 30000);

      return positions;
    } catch (error) {
      console.error(`Error getting track for ${icao24}:`, error);
      return [];
    }
  }

  // Get all aircraft in a specific area
  async getAircraftInArea(lat: number, lon: number, radiusKm: number = 100): Promise<AircraftPosition[]> {
    try {
      const positions = await this.getOpenSkyPositions();
      
      return positions.filter(pos => {
        if (!pos.latitude || !pos.longitude) return false;
        
        const distance = this.calculateDistance(lat, lon, pos.latitude, pos.longitude);
        return distance <= radiusKm;
      });
    } catch (error) {
      console.error('Error getting aircraft in area:', error);
      return [];
    }
  }

  // Calculate distance between two coordinates in kilometers
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  // Update aircraft positions in database
  async updateAircraftPositions(): Promise<number> {
    try {
      const positions = await this.getOpenSkyPositions();
      let updated = 0;

      for (const position of positions) {
        if (position.callsign) {
          try {
            // Here you would update your database
            // This is a placeholder for the actual database update
            console.log(`Updating position for ${position.callsign}:`, {
              lat: position.latitude,
              lon: position.longitude,
              alt: position.baroAltitude,
              speed: position.velocity,
              heading: position.trueTrack
            });
            updated++;
          } catch (error) {
            console.error(`Error updating position for ${position.callsign}:`, error);
          }
        }
      }

      return updated;
    } catch (error) {
      console.error('Error updating aircraft positions:', error);
      return 0;
    }
  }

  // Get flight path between two airports
  async getFlightPath(origin: string, destination: string): Promise<AircraftPosition[]> {
    // This would integrate with flight planning APIs
    // For now, return empty array
    return [];
  }

  // Clear cache
  clearCache(): void {
    this.cache.clear();
    this.cacheExpiry.clear();
  }
}

// Utility function to convert ICAO24 to tail number (approximate)
export function icao24ToTail(icao24: string): string {
  // This is a simplified conversion - in reality, this requires a lookup table
  // For US aircraft, ICAO24 often starts with 'A' followed by the tail number
  if (icao24.startsWith('A')) {
    return `N${icao24.substring(1)}`;
  }
  return icao24;
}

// Utility function to get aircraft type from ICAO24
export function getAircraftType(icao24: string): string {
  // This would require integration with aircraft type databases
  return 'Unknown';
}