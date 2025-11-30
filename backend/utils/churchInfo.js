/**
 * Church Information Utility Library
 * Central source of truth for all church information
 * Used by chatbot, API endpoints, and frontend components
 */

const churchInfo = {
  // Basic Information
  name: "PIWC Grand Rapids",
  fullName: "The Church of Pentecost USA, Inc. - PIWC Grand Rapids",
  district: "Detroit District",
  denomination: "The Church of Pentecost",
  
  // Location
  address: {
    street: "7003 28th Ave",
    city: "Hudsonville",
    state: "MI",
    zip: "49426",
    full: "7003 28th Ave, Hudsonville, MI 49426",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=7003+28th+Ave+Hudsonville+MI+49426"
  },
  
  // Contact Information
  contact: {
    phone: "(616) 123-4567", // Update with actual phone
    email: "piwcgrandrapids0@gmail.com",
    website: "https://www.piwcgrandrapids.com",
    instagram: "https://www.instagram.com/piwc_grandrapids/",
    facebook: "https://www.facebook.com/thechurchofpentecostgrandrapids"
  },
  
  // Service Times
  services: {
    sunday: {
      time: "12:30 PM",
      type: "In-Person Worship Service",
      location: "Main Sanctuary",
      description: "Join us for Spirit-filled worship, powerful preaching, and fellowship",
      address: "7003 28th Ave, Hudsonville, MI 49426"
    },
    friday: {
      time: "7:00 PM EST",
      type: "Prayer Meeting",
      location: "Online",
      description: "Virtual prayer and intercession meeting",
      zoomLink: "" // Add Zoom link when available
    }
  },
  
  // Church Colors (Official Church of Pentecost colors)
  branding: {
    colors: {
      primary: "#1B3C87", // Royal Blue
      secondary: "#FFD700", // Gold/Yellow
      accent: "#FFFFFF", // White
      text: "#1a1a2e"
    },
    logo: "Church of Pentecost official logo with dove, world map, and church name"
  },
  
  // Leadership
  leadership: {
    pastor: {
      name: "Rev. Dr. John Mensah", // Update with actual pastor
      title: "Resident Pastor",
      contact: "pastor@piwcgr.org"
    }
  },
  
  // Quick Facts
  quickFacts: {
    founded: "Part of The Church of Pentecost, founded in Ghana in 1953",
    denomination: "Pentecostal",
    globalPresence: "Over 4 million members in 100+ nations",
    language: "English (with occasional Twi services)",
    parking: "Free parking available on-site",
    accessibility: "Wheelchair accessible",
    childcare: "PIWC Kids programs available during service"
  }
};

/**
 * Get formatted service time string
 */
function getServiceTime(day = 'sunday') {
  const service = churchInfo.services[day.toLowerCase()];
  if (!service) return null;
  
  return {
    day: day.charAt(0).toUpperCase() + day.slice(1),
    time: service.time,
    type: service.type,
    location: service.location,
    description: service.description
  };
}

/**
 * Get full address string
 */
function getFullAddress() {
  return churchInfo.address.full;
}

/**
 * Get contact information
 */
function getContactInfo() {
  return {
    phone: churchInfo.contact.phone,
    email: churchInfo.contact.email,
    address: churchInfo.address.full,
    social: {
      instagram: churchInfo.contact.instagram,
      facebook: churchInfo.contact.facebook
    }
  };
}

/**
 * Get directions URL
 */
function getDirectionsUrl() {
  return churchInfo.address.googleMapsUrl;
}

/**
 * Check if service is online or in-person
 */
function isServiceOnline(day) {
  const service = churchInfo.services[day.toLowerCase()];
  return service?.location?.toLowerCase() === 'online';
}

module.exports = {
  churchInfo,
  getServiceTime,
  getFullAddress,
  getContactInfo,
  getDirectionsUrl,
  isServiceOnline
};

