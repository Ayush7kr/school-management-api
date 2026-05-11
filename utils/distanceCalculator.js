/**
 * Calculates the distance between two sets of coordinates using the Haversine formula.
 * The Haversine formula determines the great-circle distance between two points on a sphere 
 * given their longitudes and latitudes.
 * 
 * @param {number} lat1 - Latitude of the first point
 * @param {number} lon1 - Longitude of the first point
 * @param {number} lat2 - Latitude of the second point
 * @param {number} lon2 - Longitude of the second point
 * @returns {number} Distance in kilometers
 */
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const toRadians = (degree) => {
    return degree * (Math.PI / 180);
  };

  const R = 6371; // Radius of the Earth in kilometers

  // Convert degrees to radians
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  const radLat1 = toRadians(lat1);
  const radLat2 = toRadians(lat2);

  // Haversine formula
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(radLat1) * Math.cos(radLat2);
            
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  const distance = R * c;
  
  // Return distance rounded to 2 decimal places
  return parseFloat(distance.toFixed(2));
};

module.exports = {
  calculateDistance
};
