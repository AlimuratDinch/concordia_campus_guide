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
 */
export const parseCoordinates = (coordinateString: string): Coordinate[] => {
  try {
    const parsed = JSON.parse(
      coordinateString.replace(/\(/g, "[").replace(/\)/g, "]")
    ) as [number, number][];
    return parsed.map(([latitude, longitude]) => ({ latitude, longitude }));
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

/**
 * Checks if a point is inside a polygon using ray casting algorithm
 */
export const isPointInPolygon = (point: Coordinate, polygon: Coordinate[]): boolean => {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].latitude;
    const yi = polygon[i].longitude;
    const xj = polygon[j].latitude;
    const yj = polygon[j].longitude;

    const intersect = ((yi > point.longitude) !== (yj > point.longitude)) &&
      (point.latitude < (xj - xi) * (point.longitude - yi) / (yj - yi) + xi);
    
    if (intersect) inside = !inside;
  }
  return inside;
};

/**
 * Finds which building contains the given coordinate
 */
export const findBuildingAtLocation = (location: Coordinate, buildings: Building[]): Building | null => {
  for (const building of buildings) {
    const coordinates = parseCoordinates(building.Latitude_Longitude_Points);
    if (isPointInPolygon(location, coordinates)) {
      return building;
    }
  }
  return null;
};
