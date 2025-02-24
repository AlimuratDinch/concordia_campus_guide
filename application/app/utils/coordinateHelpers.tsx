// app/utils/coordinateHelpers.tsx

export interface Building {
  BuildingName: string;
  "Building Long Name": string;
  Address: string;
  Latitude_Longitude_Points: string;
  color: string;
  strokeColor: string;
}

export interface Coordinate {
  latitude: number;
  longitude: number;
}

/**
 * Parses a building's coordinate string into an array of coordinates.
 * Supports two formats:
 * 1. Legacy format with parentheses: "[(1,1)]" (or multiple pairs)
 * 2. Custom format: "lat,lng;lat,lng;..."
 */
export const parseCoordinates = (coordinateString: string): Coordinate[] => {
  try {
    // Check if the string contains "(" or ")" indicating a legacy format.
    if (coordinateString.includes('(') || coordinateString.includes(')')) {
      // Replace parentheses with square brackets and parse as JSON.
      const normalized = coordinateString.replace(/\(/g, "[").replace(/\)/g, "]");
      const parsed = JSON.parse(normalized) as [number, number][];
      return parsed.map(([latitude, longitude]) => ({ latitude, longitude }));
    } else {
      // Custom format: split by semicolon, then by comma.
      const pairs = coordinateString.split(';').filter(pair => pair.trim() !== '');
      return pairs.map(pair => {
        const [latStr, lngStr] = pair.split(',');
        const latitude = parseFloat(latStr.trim());
        const longitude = parseFloat(lngStr.trim());
        if (isNaN(latitude) || isNaN(longitude)) {
          throw new Error(`Invalid coordinate pair: ${pair}`);
        }
        return { latitude, longitude };
      });
    }
  } catch (error) {
    console.error("Error parsing coordinate string", error);
    return [];
  }
};

export const mapCoordinates = (coordinateString: string): Coordinate[] =>
  parseCoordinates(coordinateString);

/**
 * Computes the center point from an array of coordinates.
 */
export const getCenterFromCoordinates = (coords: Coordinate[]): Coordinate | null => {
  if (coords.length === 0) return null;
  const latSum = coords.reduce((sum, c) => sum + c.latitude, 0);
  const lngSum = coords.reduce((sum, c) => sum + c.longitude, 0);
  return {
    latitude: latSum / coords.length,
    longitude: lngSum / coords.length,
  };
};
