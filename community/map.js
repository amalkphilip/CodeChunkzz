// This file initializes the map and sets up the community layers.
// All variables defined here are global and accessible by the script in the community.html file.

// --- 1. MAP INITIALIZATION ---
// Center: Los Angeles (default for demo)
const map = L.map('communityMap').setView([34.0522, -118.2437], 10); 

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// --- 2. LAYER GROUPS FOR COMMUNITY DATA ---
// These are the containers where user-submitted markers will be placed.
const pollutionReportsLayer = L.layerGroup().addTo(map);
const cleanSpotsLayer = L.layerGroup().addTo(map);

// --- 3. CUSTOM MARKER ICONS ---
const PollutionIcon = L.icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
});

const CleanSpotIcon = L.icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
});

// --- 4. GEOCODING FUNCTION (Global helper) ---
// Function to convert address strings to Latitude/Longitude coordinates using Nominatim
async function geocodeAddress(address) {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data && data.length > 0) {
            return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon), displayName: data[0].display_name };
        }
    } catch (error) {
        console.error("Geocoding failed:", error);
    }
    return null;
}

// --- 5. LAYER CONTROL SETUP ---
const overlayMaps = {
    "<span style='color: red;'>🚨 Community Pollution Reports</span>": pollutionReportsLayer,
    "<span style='color: green;'>✅ Recommended Clean Spots</span>": cleanSpotsLayer
};

// Adds a control to the map for users to toggle the community layers
L.control.layers(null, overlayMaps, { collapsed: false }).addTo(map);

console.log("Map initialized and layers ready for community reports.");