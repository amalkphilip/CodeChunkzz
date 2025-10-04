document.addEventListener('DOMContentLoaded', function () {
    // --- 1. INITIALIZE THE MAP ---
    const map = L.map('map').setView([20, 0], 2); // Centered for a global view

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
    // Add more dust storm locations
    dustStorms.push(
        L.polygon([[30.0, 28.0], [31.5, 29.0], [30.5, 30.5], [29.0, 29.5]], { color: 'orange', fillColor: '#DAA520', fillOpacity: 0.3, weight: 1 }).bindPopup("<b>Alert:</b> Saharan dust plume moving over Egypt."),
        L.polygon([[15.0, 20.0], [17.0, 22.0], [16.0, 24.0], [14.0, 22.5]], { color: 'orange', fillColor: '#DAA520', fillOpacity: 0.3, weight: 1 }).bindPopup("<b>Alert:</b> Dust storm activity in the Sahel region, Chad."),
        L.polygon([[25.0, 45.0], [26.5, 46.0], [25.5, 47.5], [24.0, 46.5]], { color: 'orange', fillColor: '#DAA520', fillOpacity: 0.3, weight: 1 }).bindPopup("<b>Alert:</b> Shamal winds causing dust storms in central Saudi Arabia."),
        L.polygon([[33.0, 43.0], [34.5, 44.0], [33.5, 45.5], [32.0, 44.5]], { color: 'orange', fillColor: '#DAA520', fillOpacity: 0.3, weight: 1 }).bindPopup("<b>Alert:</b> Dust event in Iraq."),
        L.polygon([[40.0, 85.0], [41.5, 86.0], [40.5, 87.5], [39.0, 86.5]], { color: 'orange', fillColor: '#DAA520', fillOpacity: 0.3, weight: 1 }).bindPopup("<b>Alert:</b> Dust from the Taklamakan Desert, China."),
        L.polygon([[44.0, 108.0], [45.5, 109.0], [44.5, 110.5], [43.0, 109.5]], { color: 'orange', fillColor: '#DAA520', fillOpacity: 0.3, weight: 1 }).bindPopup("<b>Alert:</b> Gobi Desert dust storm event."),
        L.polygon([[-25.0, 133.0], [-23.5, 134.0], [-24.5, 135.5], [-26.0, 134.5]], { color: 'orange', fillColor: '#DAA520', fillOpacity: 0.3, weight: 1 }).bindPopup("<b>Alert:</b> Dust storm in the Australian Outback."),
        L.polygon([[-22.0, -68.0], [-23.5, -67.0], [-24.5, -68.5], [-23.0, -69.5]], { color: 'orange', fillColor: '#DAA520', fillOpacity: 0.3, weight: 1 }).bindPopup("<b>Alert:</b> High winds and dust in the Atacama Desert, Chile."),
        L.polygon([[31.0, 64.0], [32.5, 65.0], [31.5, 66.5], [30.0, 65.5]], { color: 'orange', fillColor: '#DAA520', fillOpacity: 0.3, weight: 1 }).bindPopup("<b>Alert:</b> Dust storm in Helmand Province, Afghanistan."),
        L.polygon([[35.0, 50.0], [36.5, 51.0], [35.5, 52.5], [34.0, 51.5]], { color: 'orange', fillColor: '#DAA520', fillOpacity: 0.3, weight: 1 }).bindPopup("<b>Alert:</b> Dust haze over Tehran, Iran."),
        L.polygon([[28.0, 68.0], [29.5, 69.0], [28.5, 70.5], [27.0, 69.5]], { color: 'orange', fillColor: '#DAA520', fillOpacity: 0.3, weight: 1 }).bindPopup("<b>Alert:</b> Dust storm in Sindh, Pakistan."),
        L.polygon([[39.0, -104.0], [40.5, -103.0], [39.5, -101.5], [38.0, -102.5]], { color: 'orange', fillColor: '#DAA520', fillOpacity: 0.3, weight: 1 }).bindPopup("<b>Alert:</b> High plains dust event in Colorado, USA."),
        L.polygon([[33.0, -101.0], [34.5, -100.0], [33.5, -98.5], [32.0, -99.5]], { color: 'orange', fillColor: '#DAA520', fillOpacity: 0.3, weight: 1 }).bindPopup("<b>Alert:</b> Dust storm in West Texas, USA."),
        L.polygon([[48.0, 62.0], [49.5, 63.0], [48.5, 64.5], [47.0, 63.5]], { color: 'orange', fillColor: '#DAA520', fillOpacity: 0.3, weight: 1 }).bindPopup("<b>Alert:</b> Aral Sea region dust storm."),
        L.polygon([[-32.0, -64.0], [-30.5, -63.0], [-31.5, -61.5], [-33.0, -62.5]], { color: 'orange', fillColor: '#DAA520', fillOpacity: 0.3, weight: 1 }).bindPopup("<b>Alert:</b> Pampero winds causing dust in Argentina."),
        L.polygon([[15.5, 32.0], [17.0, 33.0], [16.0, 34.5], [14.5, 33.5]], { color: 'orange', fillColor: '#DAA520', fillOpacity: 0.3, weight: 1 }).bindPopup("<b>Alert:</b> Haboob dust storm near Khartoum, Sudan."),
        L.polygon([[44.0, 25.0], [45.5, 26.0], [44.5, 27.5], [43.0, 26.5]], { color: 'orange', fillColor: '#DAA520', fillOpacity: 0.3, weight: 1 }).bindPopup("<b>Alert:</b> Saharan dust transport over Romania."),
        L.polygon([[37.0, 35.0], [38.5, 36.0], [37.5, 37.5], [36.0, 36.5]], { color: 'orange', fillColor: '#DAA520', fillOpacity: 0.3, weight: 1 }).bindPopup("<b>Alert:</b> Dust from Syria affecting Turkey."),
        L.polygon([[20.0, -10.0], [21.5, -9.0], [20.5, -7.5], [19.0, -8.5]], { color: 'orange', fillColor: '#DAA520', fillOpacity: 0.3, weight: 1 }).bindPopup("<b>Alert:</b> Dust storm in Mauritania."),
        L.polygon([[39.0, -8.0], [40.5, -7.0], [39.5, -5.5], [38.0, -6.5]], { color: 'orange', fillColor: '#DAA520', fillOpacity: 0.3, weight: 1 }).bindPopup("<b>Alert:</b> Saharan dust event over Spain and Portugal.")
    );
    const dustLayer = L.layerGroup(dustStorms);

    // Pollen Hotspots Layer - Added more locations
    const pollenMarkers = [
        // US Locations
        L.circle([34.18, -118.30], { radius: 2000, color: 'green', fillColor: '#90EE90', fillOpacity: 0.5 }).bindPopup("High Tree Pollen Zone (Burbank)"),
        L.circle([33.85, -118.35], { radius: 1500, color: 'green', fillColor: '#90EE90', fillOpacity: 0.5 }).bindPopup("High Grass Pollen Zone (LA)"),
        L.circle([38.60, -121.45], { radius: 3000, color: 'green', fillColor: '#90EE90', fillOpacity: 0.5 }).bindPopup("High Weed Pollen Zone (Sacramento)"),
        L.circle([37.75, -122.45], { radius: 1800, color: 'green', fillColor: '#90EE90', fillOpacity: 0.5 }).bindPopup("Moderate Tree Pollen (San Francisco)"),
        // India Locations
        L.circle([28.61, 77.23], { radius: 5000, color: 'green', fillColor: '#90EE90', fillOpacity: 0.5 }).bindPopup("High Parthenium Pollen Zone (Delhi)"),
        L.circle([12.97, 77.59], { radius: 4000, color: 'green', fillColor: '#90EE90', fillOpacity: 0.5 }).bindPopup("High Grass & Weed Pollen (Bangalore)")
    ];
    // Add more pollen locations
    pollenMarkers.push(
        // North America
        L.circle([33.74, -84.38], { radius: 4000, color: 'green', fillColor: '#90EE90', fillOpacity: 0.5 }).bindPopup("High Tree Pollen (Atlanta, GA)"),
        L.circle([30.26, -97.74], { radius: 5000, color: 'green', fillColor: '#90EE90', fillOpacity: 0.5 }).bindPopup("High Cedar Pollen (Austin, TX)"),
        L.circle([47.60, -122.33], { radius: 3000, color: 'green', fillColor: '#90EE90', fillOpacity: 0.5 }).bindPopup("High Alder/Birch Pollen (Seattle, WA)"),
        L.circle([43.65, -79.38], { radius: 4500, color: 'green', fillColor: '#90EE90', fillOpacity: 0.5 }).bindPopup("High Ragweed Pollen (Toronto, ON)"),
        L.circle([49.28, -123.12], { radius: 3500, color: 'green', fillColor: '#90EE90', fillOpacity: 0.5 }).bindPopup("High Tree Pollen (Vancouver, BC)"),
        L.circle([33.44, -112.07], { radius: 4000, color: 'green', fillColor: '#90EE90', fillOpacity: 0.5 }).bindPopup("Multiple Pollen Hotspot (Phoenix, AZ)"),
        L.circle([37.68, -97.33], { radius: 5000, color: 'green', fillColor: '#90EE90', fillOpacity: 0.5 }).bindPopup("High Ragweed/Grass Pollen (Wichita, KS)"),
        // Europe
        L.circle([45.76, 4.83], { radius: 4000, color: 'green', fillColor: '#90EE90', fillOpacity: 0.5 }).bindPopup("High Ragweed Pollen (Lyon, France)"),
        L.circle([45.46, 9.19], { radius: 5000, color: 'green', fillColor: '#90EE90', fillOpacity: 0.5 }).bindPopup("High Grass Pollen (Milan, Italy)"),
        L.circle([37.88, -4.77], { radius: 6000, color: 'green', fillColor: '#90EE90', fillOpacity: 0.5 }).bindPopup("High Olive Tree Pollen (Córdoba, Spain)"),
        L.circle([52.52, 13.40], { radius: 4000, color: 'green', fillColor: '#90EE90', fillOpacity: 0.5 }).bindPopup("High Birch Pollen (Berlin, Germany)"),
        L.circle([52.22, 21.01], { radius: 4500, color: 'green', fillColor: '#90EE90', fillOpacity: 0.5 }).bindPopup("High Grass/Birch Pollen (Warsaw, Poland)"),
        // Asia
        L.circle([35.68, 139.69], { radius: 6000, color: 'green', fillColor: '#90EE90', fillOpacity: 0.5 }).bindPopup("High Cedar/Cypress Pollen (Tokyo, Japan)"),
        L.circle([32.06, 118.79], { radius: 4000, color: 'green', fillColor: '#90EE90', fillOpacity: 0.5 }).bindPopup("High Plane Tree Pollen (Nanjing, China)"),
        // Australia
        L.circle([-35.28, 149.12], { radius: 5000, color: 'green', fillColor: '#90EE90', fillOpacity: 0.5 }).bindPopup("High Grass Pollen (Canberra)"),
        L.circle([-37.81, 144.96], { radius: 4500, color: 'green', fillColor: '#90EE90', fillOpacity: 0.5 }).bindPopup("High Grass/Tree Pollen (Melbourne)"),
        L.circle([-31.95, 115.86], { radius: 3500, color: 'green', fillColor: '#90EE90', fillOpacity: 0.5 }).bindPopup("High Grass Pollen (Perth)"),
        // South America
        L.circle([-25.42, -49.27], { radius: 4000, color: 'green', fillColor: '#90EE90', fillOpacity: 0.5 }).bindPopup("High Grass Pollen (Curitiba, Brazil)"),
        L.circle([-33.44, -70.66], { radius: 4500, color: 'green', fillColor: '#90EE90', fillOpacity: 0.5 }).bindPopup("High Plane Tree Pollen (Santiago, Chile)"),
        // Africa
        L.circle([-33.92, 18.42], { radius: 3000, color: 'green', fillColor: '#90EE90', fillOpacity: 0.5 }).bindPopup("Various Pollens Hotspot (Cape Town, SA)")
    );
    // Add even more pollen locations
    pollenMarkers.push(
        L.circle([39.95, -75.16], { radius: 4200, color: 'green', fillColor: '#90EE90', fillOpacity: 0.5 }).bindPopup("High Tree & Ragweed Pollen (Philadelphia, PA)"),
        L.circle([42.36, -71.05], { radius: 3800, color: 'green', fillColor: '#90EE90', fillOpacity: 0.5 }).bindPopup("High Tree Pollen (Boston, MA)"),
        L.circle([38.90, -77.03], { radius: 4000, color: 'green', fillColor: '#90EE90', fillOpacity: 0.5 }).bindPopup("High Oak & Grass Pollen (Washington, D.C.)"),
        L.circle([25.76, -80.19], { radius: 3500, color: 'green', fillColor: '#90EE90', fillOpacity: 0.5 }).bindPopup("High Oak & Bayberry Pollen (Miami, FL)"),
        L.circle([45.50, -73.56], { radius: 4300, color: 'green', fillColor: '#90EE90', fillOpacity: 0.5 }).bindPopup("High Ragweed & Tree Pollen (Montreal, QC)"),
        L.circle([20.65, -103.34], { radius: 4000, color: 'green', fillColor: '#90EE90', fillOpacity: 0.5 }).bindPopup("High Ash & Grass Pollen (Guadalajara, MX)"),
        L.circle([39.73, -104.99], { radius: 4800, color: 'green', fillColor: '#90EE90', fillOpacity: 0.5 }).bindPopup("High Grass & Weed Pollen (Denver, CO)"),
        L.circle([35.22, -80.84], { radius: 5000, color: 'green', fillColor: '#90EE90', fillOpacity: 0.5 }).bindPopup("Very High Tree Pollen (Charlotte, NC)"),
        L.circle([36.16, -86.78], { radius: 5200, color: 'green', fillColor: '#90EE90', fillOpacity: 0.5 }).bindPopup("High Tree & Grass Pollen (Nashville, TN)"),
        L.circle([35.46, -97.51], { radius: 5500, color: 'green', fillColor: '#90EE90', fillOpacity: 0.5 }).bindPopup("Very High Grass & Weed Pollen (Oklahoma City, OK)"),
        L.circle([35.14, -90.04], { radius: 5300, color: 'green', fillColor: '#90EE90', fillOpacity: 0.5 }).bindPopup("Very High Tree Pollen (Memphis, TN)"),
        L.circle([41.58, -93.62], { radius: 4700, color: 'green', fillColor: '#90EE90', fillOpacity: 0.5 }).bindPopup("High Ragweed Pollen (Des Moines, IA)"),
        L.circle([53.48, -2.24], { radius: 3500, color: 'green', fillColor: '#90EE90', fillOpacity: 0.5 }).bindPopup("High Grass Pollen (Manchester, UK)"),
        L.circle([41.38, 2.17], { radius: 4000, color: 'green', fillColor: '#90EE90', fillOpacity: 0.5 }).bindPopup("High Plane Tree & Olive Pollen (Barcelona, Spain)"),
        L.circle([48.13, 11.58], { radius: 4200, color: 'green', fillColor: '#90EE90', fillOpacity: 0.5 }).bindPopup("High Birch & Grass Pollen (Munich, Germany)"),
        L.circle([50.07, 14.43], { radius: 4100, color: 'green', fillColor: '#90EE90', fillOpacity: 0.5 }).bindPopup("High Hazel & Alder Pollen (Prague, CZ)"),
        L.circle([59.32, 18.06], { radius: 3900, color: 'green', fillColor: '#90EE90', fillOpacity: 0.5 }).bindPopup("High Birch Pollen (Stockholm, SE)"),
        L.circle([53.34, -6.26], { radius: 3700, color: 'green', fillColor: '#90EE90', fillOpacity: 0.5 }).bindPopup("High Grass Pollen (Dublin, IE)"),
        L.circle([38.72, -9.13], { radius: 4000, color: 'green', fillColor: '#90EE90', fillOpacity: 0.5 }).bindPopup("High Grass & Olive Pollen (Lisbon, PT)"),
        L.circle([46.94, 7.44], { radius: 4500, color: 'green', fillColor: '#90EE90', fillOpacity: 0.5 }).bindPopup("High Ash & Grass Pollen (Bern, CH)"),
        L.circle([44.42, 26.10], { radius: 4300, color: 'green', fillColor: '#90EE90', fillOpacity: 0.5 }).bindPopup("High Ragweed Pollen (Bucharest, RO)"),
        L.circle([59.91, 10.75], { radius: 3600, color: 'green', fillColor: '#90EE90', fillOpacity: 0.5 }).bindPopup("High Birch & Grass Pollen (Oslo, NO)"),
        L.circle([55.67, 12.56], { radius: 3800, color: 'green', fillColor: '#90EE90', fillOpacity: 0.5 }).bindPopup("High Grass Pollen (Copenhagen, DK)"),
        L.circle([47.05, 15.43], { radius: 4400, color: 'green', fillColor: '#90EE90', fillOpacity: 0.5 }).bindPopup("High Ragweed & Birch Pollen (Graz, AT)"),
        L.circle([34.69, 135.50], { radius: 5000, color: 'green', fillColor: '#90EE90', fillOpacity: 0.5 }).bindPopup("High Cedar & Cypress Pollen (Osaka, Japan)"),
        L.circle([31.52, 74.35], { radius: 5500, color: 'green', fillColor: '#90EE90', fillOpacity: 0.5 }).bindPopup("High Paper Mulberry Pollen (Lahore, Pakistan)"),
        L.circle([33.68, 73.04], { radius: 5800, color: 'green', fillColor: '#90EE90', fillOpacity: 0.5 }).bindPopup("Very High Paper Mulberry Pollen (Islamabad, Pakistan)"),
        L.circle([1.35, 103.81], { radius: 3000, color: 'green', fillColor: '#90EE90', fillOpacity: 0.5 }).bindPopup("Tropical Grass Pollen (Singapore)"),
        L.circle([33.59, 130.40], { radius: 4800, color: 'green', fillColor: '#90EE90', fillOpacity: 0.5 }).bindPopup("High Cedar Pollen (Fukuoka, Japan)"),
        L.circle([22.31, 114.16], { radius: 3500, color: 'green', fillColor: '#90EE90', fillOpacity: 0.5 }).bindPopup("High Casuarina & Pine Pollen (Hong Kong)"),
        L.circle([30.65, 104.06], { radius: 4000, color: 'green', fillColor: '#90EE90', fillOpacity: 0.5 }).bindPopup("High Cryptomeria Pollen (Chengdu, China)"),
        L.circle([23.12, 113.26], { radius: 4100, color: 'green', fillColor: '#90EE90', fillOpacity: 0.5 }).bindPopup("High Mulberry & Banyan Pollen (Guangzhou, China)"),

        // More Australia / NZ
        L.circle([-27.46, 153.02], { radius: 4000, color: 'green', fillColor: '#90EE90', fillOpacity: 0.5 }).bindPopup("High Grass Pollen (Brisbane)"),
        L.circle([-34.92, 138.60], { radius: 4200, color: 'green', fillColor: '#90EE90', fillOpacity: 0.5 }).bindPopup("High Grass & Olive Pollen (Adelaide)"),
        L.circle([-41.28, 174.77], { radius: 3500, color: 'green', fillColor: '#90EE90', fillOpacity: 0.5 }).bindPopup("High Pine & Grass Pollen (Wellington, NZ)"),
        L.circle([-43.53, 172.63], { radius: 3800, color: 'green', fillColor: '#90EE90', fillOpacity: 0.5 }).bindPopup("High Grass Pollen (Christchurch, NZ)"),

        // More South America
        L.circle([-31.42, -64.18], { radius: 4000, color: 'green', fillColor: '#90EE90', fillOpacity: 0.5 }).bindPopup("High Grass & Weed Pollen (Córdoba, AR)"),
        L.circle([3.45, -76.53], { radius: 3500, color: 'green', fillColor: '#90EE90', fillOpacity: 0.5 }).bindPopup("Tropical Grass & Weed Pollen (Cali, CO)"),
        L.circle([-0.22, -78.52], { radius: 3800, color: 'green', fillColor: '#90EE90', fillOpacity: 0.5 }).bindPopup("High Altitude Grass Pollen (Quito, EC)"),

        // More Africa
        L.circle([-29.85, 31.02], { radius: 3600, color: 'green', fillColor: '#90EE90', fillOpacity: 0.5 }).bindPopup("Subtropical Grass & Tree Pollen (Durban, SA)"),
        L.circle([9.07, 7.49], { radius: 4000, color: 'green', fillColor: '#90EE90', fillOpacity: 0.5 }).bindPopup("High Grass Pollen (Abuja, NG)"),
        L.circle([33.57, -7.58], { radius: 3900, color: 'green', fillColor: '#90EE90', fillOpacity: 0.5 }).bindPopup("High Olive & Grass Pollen (Casablanca, MA)"),
        L.circle([36.77, 3.05], { radius: 4100, color: 'green', fillColor: '#90EE90', fillOpacity: 0.5 }).bindPopup("High Cypress & Olive Pollen (Algiers, DZ)")
    );
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
        [13.08, 80.27, 170],   // Chennai

        // Europe
        [51.50, -0.12, 70],   // London, UK
        [48.85, 2.35, 85],    // Paris, France
        [52.52, 13.40, 90],   // Berlin, Germany
        [41.90, 12.49, 110],  // Rome, Italy
        [40.41, -3.70, 75],   // Madrid, Spain
        [55.75, 37.61, 120],  // Moscow, Russia
        [47.49, 19.04, 130],  // Budapest, Hungary

        // East Asia
        [35.68, 139.69, 100], // Tokyo, Japan
        [39.90, 116.40, 220], // Beijing, China
        [31.23, 121.47, 190], // Shanghai, China
        [37.56, 126.97, 140], // Seoul, South Korea

        // South America
        [-34.60, -58.38, 95],  // Buenos Aires, Argentina
        [-23.55, -46.63, 150], // São Paulo, Brazil
        [-12.04, -77.04, 135], // Lima, Peru
        [4.71, -74.07, 160],   // Bogotá, Colombia

        // Africa
        [30.04, 31.23, 200],  // Cairo, Egypt
        [6.52, 3.37, 180],   // Lagos, Nigeria
        [-26.20, 28.04, 140], // Johannesburg, South Africa
        [-1.29, 36.82, 110],  // Nairobi, Kenya

        // Australia / Oceania
        [-33.86, 151.20, 50], // Sydney, Australia
        [-37.81, 144.96, 65], // Melbourne, Australia
        [-36.84, 174.76, 40], // Auckland, New Zealand

        // Middle East
        [25.20, 55.27, 210],  // Dubai, UAE
        [24.71, 46.67, 230],   // Riyadh, Saudi Arabia

        // More North America
        [19.43, -99.13, 185], // Mexico City, Mexico
        [43.65, -79.38, 80],  // Toronto, Canada
        [41.87, -87.62, 115], // Chicago, USA
        [29.76, -95.36, 125], // Houston, USA

        // More South America
        [-22.90, -43.17, 130], // Rio de Janeiro, Brazil
        [-33.44, -70.66, 145], // Santiago, Chile

        // More Europe
        [41.00, 28.97, 140], // Istanbul, Turkey
        [50.45, 30.52, 125], // Kyiv, Ukraine
        [52.36, 4.89, 65],   // Amsterdam, Netherlands

        // More Asia / Southeast Asia
        [13.75, 100.50, 195], // Bangkok, Thailand
        [-6.20, 106.84, 205], // Jakarta, Indonesia
        [24.86, 67.00, 215],  // Karachi, Pakistan
        [35.68, 51.38, 240],   // Tehran, Iran
    

    // Add even more heatmap locations
    
        // More North America
        [39.95, -75.16, 120], // Philadelphia, USA
        [32.77, -96.79, 130], // Dallas, USA
        [25.76, -80.19, 95],  // Miami, USA
        [42.33, -83.04, 110], // Detroit, USA
        [45.50, -73.56, 90],  // Montreal, Canada
        [51.04, -114.07, 75], // Calgary, Canada
        [25.68, -100.31, 170],// Monterrey, Mexico
        [20.65, -103.34, 165],// Guadalajara, Mexico
        [38.90, -77.03, 100], // Washington D.C., USA
        [47.60, -122.33, 70], // Seattle, USA

        // More South America
        [-12.97, -38.50, 115],// Salvador, Brazil
        [-15.79, -47.88, 105],// Brasilia, Brazil
        [6.24, -75.58, 155],  // Medellín, Colombia
        [-0.18, -78.46, 140], // Quito, Ecuador
        [10.48, -66.90, 135], // Caracas, Venezuela
        [-31.42, -64.18, 120],// Córdoba, Argentina

        // More Europe
        [53.48, -2.24, 80],   // Manchester, UK
        [41.38, 2.16, 95],    // Barcelona, Spain
        [45.46, 9.19, 150],   // Milan, Italy
        [59.32, 18.06, 50],   // Stockholm, Sweden
        [53.34, -6.26, 60],   // Dublin, Ireland
        [37.98, 23.72, 100],  // Athens, Greece
        [44.42, 26.10, 145],  // Bucharest, Romania
        [50.07, 14.43, 115],  // Prague, Czech Republic
        [52.22, 21.01, 160],  // Warsaw, Poland
        [59.91, 10.75, 55],   // Oslo, Norway
        [48.13, 11.58, 85],   // Munich, Germany
        [38.72, -9.13, 70],   // Lisbon, Portugal

        // More Asia
        [23.12, 113.26, 200], // Guangzhou, China
        [30.67, 104.06, 210], // Chengdu, China
        [22.54, 114.05, 180], // Shenzhen, China
        [17.38, 78.48, 185],  // Hyderabad, India
        [23.02, 72.57, 195],  // Ahmedabad, India
        [34.69, 135.50, 110], // Osaka, Japan
        [14.59, 120.98, 225], // Manila, Philippines
        [3.13, 101.68, 175],  // Kuala Lumpur, Malaysia
        [1.35, 103.81, 85],   // Singapore
        [21.02, 105.83, 230], // Hanoi, Vietnam
        [23.77, 90.39, 260],  // Dhaka, Bangladesh
        [31.52, 74.35, 255],  // Lahore, Pakistan
        [-6.91, 107.61, 190], // Bandung, Indonesia

        // More Africa
        [-4.32, 15.30, 190],  // Kinshasa, DR Congo
        [9.06, 38.74, 125],   // Addis Ababa, Ethiopia
        [33.57, -7.58, 130],  // Casablanca, Morocco
        [-29.85, 31.02, 100], // Durban, South Africa
        [12.00, 8.51, 200],   // Kano, Nigeria
        [31.20, 29.91, 180],  // Alexandria, Egypt

        // More Australia
        [-27.47, 153.02, 45], // Brisbane, Australia
        [-31.95, 115.86, 55], // Perth, Australia
        [-34.92, 138.60, 60]  // Adelaide, Australia
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