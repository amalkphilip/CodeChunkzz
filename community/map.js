const map = L.map('communityMap').setView([34.0522, -118.2437], 10); 

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

const pollutionReportsLayer = L.layerGroup().addTo(map);
const cleanSpotsLayer = L.layerGroup().addTo(map);

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

const overlayMaps = {
    "<span style='color: red;'>🚨 Community Pollution Reports</span>": pollutionReportsLayer,
    "<span style='color: green;'>✅ Recommended Clean Spots</span>": cleanSpotsLayer
};

L.control.layers(null, overlayMaps, { collapsed: false }).addTo(map);

console.log("Map initialized and layers ready for community reports.");
