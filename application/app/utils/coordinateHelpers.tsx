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
