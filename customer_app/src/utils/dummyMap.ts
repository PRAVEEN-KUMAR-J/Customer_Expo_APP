export interface Location {
  latitude: number;
  longitude: number;
}

export const generateRandomLocation = (baseLocation: Location, radius: number = 0.01): Location => {
  const randomLat = baseLocation.latitude + (Math.random() - 0.5) * radius;
  const randomLng = baseLocation.longitude + (Math.random() - 0.5) * radius;
  
  return {
    latitude: randomLat,
    longitude: randomLng,
  };
};

export const calculateDistance = (loc1: Location, loc2: Location): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (loc2.latitude - loc1.latitude) * Math.PI / 180;
  const dLon = (loc2.longitude - loc1.longitude) * Math.PI / 180;
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(loc1.latitude * Math.PI / 180) * Math.cos(loc2.latitude * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
    
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  
  return distance;
};

export const simulateDeliveryMovement = (
  startLocation: Location,
  endLocation: Location,
  progress: number
): Location => {
  // Linear interpolation between start and end points
  const lat = startLocation.latitude + (endLocation.latitude - startLocation.latitude) * progress;
  const lng = startLocation.longitude + (endLocation.longitude - startLocation.longitude) * progress;
  
  return { latitude: lat, longitude: lng };
};

export const estimateDeliveryTime = (distance: number): string => {
  // Assuming average delivery speed of 20 km/h
  const timeInHours = distance / 20;
  const timeInMinutes = Math.ceil(timeInHours * 60);
  
  return `${timeInMinutes} minutes`;
};