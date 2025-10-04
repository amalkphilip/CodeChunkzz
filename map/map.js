document.addEventListener('DOMContentLoaded', function () {
    // --- 1. INITIALIZE THE MAP ---
    const map = L.map('map').setView([34.0522, -118.2437], 8); // Centered on Los Angeles

    // Add a base tile layer from OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Layer groups for markers
    let searchLayer = L.layerGroup().addTo(map); // For user-searched location

    // --- 4. USER LOCATION SEARCH ---
    const searchInput = document.getElementById('location-input');
    const searchButton = document.getElementById('search-button');
    const locationDetails = document.getElementById('location-details');

    async function searchLocation() {
        const query = searchInput.value;
        if (!query) return;

        locationDetails.innerHTML = 'Searching...';
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
        const data = await response.json();

        if (data && data.length > 0) {
            const result = data[0];
            const lat = parseFloat(result.lat);
            const lon = parseFloat(result.lon);
            
            // Update map view and add a simple marker for context
            searchLayer.clearLayers();
            map.flyTo([lat, lon], 13);
            L.marker([lat, lon]).addTo(searchLayer)
                .bindPopup(`<b>Searched Location:</b><br>${result.display_name.split(',').slice(0, 2).join(',')}`)
                .openPopup();
            
            // Update details panel
            locationDetails.innerHTML = `
                <b>${result.display_name}</b><br>
                Lat: ${lat.toFixed(4)}, Lon: ${lon.toFixed(4)}
            `;
        } else {
            locationDetails.innerHTML = 'Location not found. Please try again.';
        }
    }

    searchButton.addEventListener('click', searchLocation);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchLocation();
        }
    });


    // --- 5. SPECIALIZED DATA LAYERS ---
    // These layers are kept as they can be toggled independently
    // Dust Storm Layer - Now a LayerGroup to hold multiple storm areas
    const dustStorms = [
        L.polygon([ // Southern California
            [33.8, -118.0], [33.9, -117.8], [33.7, -117.7], [33.6, -117.9]
        ], { color: 'orange', fillColor: '#DAA520', fillOpacity: 0.3, weight: 1 })
        .bindPopup("<b>Alert:</b> Dust storm warning in SoCal. High levels of particulate matter expected."),
        
        L.polygon([ // Arizona / Phoenix Area
            [33.2, -112.5], [33.8, -112.4], [33.7, -111.5], [33.1, -111.6]
        ], { color: 'orange', fillColor: '#DAA520', fillOpacity: 0.3, weight: 1 })
        .bindPopup("<b>Alert:</b> Monsoon dust storm near Phoenix."),

        L.polygon([ // Rajasthan, India
            [26.5, 72.0], [28.0, 73.5], [27.5, 75.0], [26.0, 74.0]
        ], { color: 'orange', fillColor: '#DAA520', fillOpacity: 0.3, weight: 1 })
        .bindPopup("<b>Alert:</b> Pre-monsoon dust activity in the Thar Desert region.")
    ];
    const dustLayer = L.layerGroup(dustStorms);

    // Pollen Hotspots Layer - Added more locations
    const pollenMarkers = [
        // US Locations
        L.circle([34.18, -118.30], { radius: 2000, color: 'green', fillColor: '#90EE90', fillOpacity: 0.5 }).bindPopup("High Tree Pollen Zone"),
        L.circle([33.85, -118.35], { radius: 1500, color: 'green', fillColor: '#90EE90', fillOpacity: 0.5 }).bindPopup("High Grass Pollen Zone (LA)"),
        L.circle([38.60, -121.45], { radius: 3000, color: 'green', fillColor: '#90EE90', fillOpacity: 0.5 }).bindPopup("High Weed Pollen Zone (Sacramento)"),
        L.circle([37.75, -122.45], { radius: 1800, color: 'green', fillColor: '#90EE90', fillOpacity: 0.5 }).bindPopup("Moderate Tree Pollen (San Francisco)"),
        // India Locations
        L.circle([28.61, 77.23], { radius: 5000, color: 'green', fillColor: '#90EE90', fillOpacity: 0.5 }).bindPopup("High Parthenium Pollen Zone (Delhi)"),
        L.circle([12.97, 77.59], { radius: 4000, color: 'green', fillColor: '#90EE90', fillOpacity: 0.5 }).bindPopup("High Grass & Weed Pollen (Bangalore)")
    ];
const pollenLayer = L.layerGroup(pollenMarkers);

    // Create layer control object
    // The heatLayer will be added here later
    const overlayMaps = {
        "<span style='color: #DAA520;'>💨 Dust Storm</span>": dustLayer,
        "<span style='color: green;'>🌿 Pollen Hotspots</span>": pollenLayer
    };
    // We will create the control after defining the heatLayer


    // --- 6. DYNAMIC HEATMAP LAYER & SLIDER CONTROL ---
    // This section was moved and consolidated from the duplicate code blocks.
    
    // Sample air quality data points: [lat, lng, intensity]
    const airQualityData = [
        // Los Angeles Area (Existing Data)
        [34.05, -118.24, 155], [34.15, -118.44, 120], [33.94, -118.40, 110],
        [34.02, -118.49, 45],  [34.20, -118.55, 130], [33.77, -118.19, 90],
        [34.14, -118.14, 160], [34.06, -118.02, 175], [33.83, -118.35, 60],
        [34.28, -118.79, 30],  [33.95, -118.23, 165]
        ,
        // Expanded Data for Wider Coverage
        // Bay Area
        [37.77, -122.41, 80],  // San Francisco
        [37.33, -121.88, 95],  // San Jose
        [37.80, -122.27, 105], // Oakland
        // Other California Cities
        [38.58, -121.49, 130], // Sacramento
        [36.73, -119.78, 160], // Fresno
        [35.37, -119.01, 170], // Bakersfield
        [32.71, -117.16, 60],  // San Diego
        // Neighboring States
        [36.17, -115.14, 110], // Las Vegas, NV
        [33.44, -112.07, 140], // Phoenix, AZ
        [39.52, -119.81, 55],   // Reno, NV
        // India
        [28.61, 77.23, 250],  // New Delhi
        [19.07, 72.87, 180],  // Mumbai
        [12.97, 77.59, 160],  // Bangalore
        [22.57, 88.36, 190],  // Kolkata
        [13.08, 80.27, 170]   // Chennai
    ];

    // Create the heat layer using the air quality data
    const heatLayer = L.heatLayer(airQualityData, {
        radius: 35,
        blur: 20,
        maxZoom: 12,
        gradient: {
            0.1: 'blue', 0.3: 'lime', 0.5: 'yellow', 0.7: 'orange', 1.0: 'red'
        }
    });

    // Add the heatmap to the overlay control object
    overlayMaps["<span style='color: red;'>🔥 Air Quality Heatmap</span>"] = heatLayer;

    // Add the layer control to the map now that all layers are defined
    L.control.layers(null, overlayMaps, { collapsed: false }).addTo(map);
    heatLayer.addTo(map); // Add it to the map by default
    dustLayer.addTo(map); // Add dust storm layer by default
    pollenLayer.addTo(map); // Add pollen layer by default

    // Slider to control heatmap opacity
    const slider = document.getElementById('time-slider');
    const timeLabel = document.getElementById('time-label');

    slider.addEventListener('input', (e) => {
        const value = parseInt(e.target.value);
        // Map the slider value (0-47) to an opacity value (0.2 - 1.0)
        const newOpacity = 0.2 + (value / 47) * 0.8;
        heatLayer.setOpacity(newOpacity); // Control the heatLayer, not a modelOverlay

        // Update the label to show forecast strength
        const forecastStrength = Math.round((value / 47) * 100);
        timeLabel.textContent = `Forecast Strength: ${forecastStrength}%`;
    });

    // Set initial label
    timeLabel.textContent = 'Forecast Strength: 0%';
});