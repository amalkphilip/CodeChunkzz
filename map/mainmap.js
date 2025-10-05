document.addEventListener('DOMContentLoaded', function () {
    const aqiApiToken = '38180dff93f8e8cb3df45491b17e52256dee16cd';

    const map = L.map('map').setView([40.7128, -74.0060], 12); 


    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);


    const heatPoints = [
        [40.7128, -74.0060, 0.5], 
        [40.7580, -73.9855, 0.8], 
        [40.7484, -73.9857, 1.0], 
        [40.7796, -73.9632, 0.4], 
        [40.7061, -73.9969, 0.7], 
        
    ];

    
    L.heatLayer(heatPoints, { radius: 25 }).addTo(map);

    
    const searchButton = document.getElementById('search-button');
    const locationInput = document.getElementById('location-input');
    const locationDetails = document.getElementById('location-details');

    /**
     
     @param {number} lat 
     @param {number} lon
     @returns {Promise<object|null>} 
     */
    async function getAqiData(lat, lon) {
        if (aqiApiToken === 'YOUR_AQI_API_TOKEN' || !aqiApiToken) {
            console.warn("AQI API token is not set. Get a free token from https://aqicn.org/api/ to see air quality data.");
            return null;
        }
        try {
            const response = await fetch(`https://api.waqi.info/feed/geo:${lat};${lon}/?token=${aqiApiToken}`);
            const data = await response.json();
            if (data.status === 'ok') {
                return data.data; 
            }
            return null;
        } catch (error) {
            console.error('Error fetching AQI data:', error);
            return null;
        }
    }
    async function searchLocation() {
        const query = locationInput.value;
        if (!query) {
            locationDetails.textContent = 'Please enter a location to search.';
            return;
        }

        locationDetails.textContent = 'Searching...';

        try {
            
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
            const data = await response.json();

            if (data && data.length > 0) {
                const result = data[0];
                const lat = parseFloat(result.lat);
                const lon = parseFloat(result.lon);

                
                const aqiData = await getAqiData(lat, lon);
                let popupContent = `<b>${result.display_name}</b>`;
                if (aqiData && aqiData.aqi) {
                    popupContent += `<br>Air Quality Index (AQI): <b>${aqiData.aqi}</b>`;
                } else {
                    popupContent += `<br>AQI data not available.`;
                }

                
                map.setView([lat, lon], 14);

                
                L.marker([lat, lon]).addTo(map).bindPopup(popupContent).openPopup();

                locationDetails.textContent = `Showing results for: ${result.display_name}`;
            } else {
                locationDetails.textContent = 'Location not found. Please try another search.';
            }
        } catch (error) {
            console.error('Error during geocoding:', error);
            locationDetails.textContent = 'An error occurred while searching.';
        }
    }

    searchButton.addEventListener('click', searchLocation);
    locationInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            searchLocation();
        }
    });

    
    const locateButton = document.getElementById('locate-button');
    locateButton.addEventListener('click', () => {
        map.locate({ setView: true, maxZoom: 16 });
    });

    map.on('locationfound', async function (e) {
        const { lat, lng } = e.latlng;
        const aqiData = await getAqiData(lat, lng);

        let popupContent = `<b>You are here!</b>`;
        if (aqiData && aqiData.aqi) {
            popupContent += `<br>Current AQI: <b>${aqiData.aqi}</b>`;
        }

        L.marker(e.latlng).addTo(map).bindPopup(popupContent).openPopup();
        locationDetails.textContent = `Your location has been found.`;
    });

    map.on('locationerror', function (e) {
        alert(e.message);
        locationDetails.textContent = `Could not find your location.`;
    });


    const popup = L.popup();

    async function onMapClick(e) {
        const { lat, lng } = e.latlng;
        let content = `Coordinates: ${lat.toFixed(5)}, ${lng.toFixed(5)}`;

        popup.setLatLng(e.latlng).setContent(content + "<br>Fetching AQI...").openOn(map);

        const aqiData = await getAqiData(lat, lng);
        if (aqiData && aqiData.aqi) {
            content += `<br>Air Quality Index (AQI): <b>${aqiData.aqi}</b>`;
        }

        popup.setContent(content);
    }

    map.on('click', onMapClick);
});