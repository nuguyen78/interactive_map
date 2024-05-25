let map;
let markers = [];
let markerClicked = false; //handler to reset map if you clicked on marker

//inicilazition of empty map
export function initMap() {
    map = L.map('map').setView([0, 0], 2);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

// Initial markers can be empty or set to some initial values if needed
    markers = [];
}

//create new marker on map when image show in viewport
export function updateMapMarkers() {
    console.log('scrolled');
     const galleryElement = document.querySelector('.gallery');
    const visibleImages = Array.from(galleryElement.querySelectorAll('img')).filter(img => {
        const rect = img.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    })

    visibleImages.forEach(img => {
        const existingMarker = markers.find(marker => marker.options.alt === img.alt);
        exifr.gps(img.src).then(gps => {
            if (gps) {
                if (existingMarker) { //skip creating markers if already exist
                    if (!markerClicked) { //handler to reset map if you clicked on marker
                        map.setView([gps.latitude, gps.longitude], 10); // Set view only if not triggered by marker click
                        markerClicked = false;
                    }
                    return
                } 
                const azimuth = gps.GPSImgDirection ? gps.GPSImgDirection : 'Not available';
                const marker = L.marker([gps.latitude, gps.longitude]);
                marker.bindPopup(`<img src="${img.src}" alt="${img.alt}" style="width:100px;"><br>Azimuth: ${azimuth}`);
                marker.options.alt = img.alt;
                marker.on('click', () => {
                    scrollToImage(img.alt);
                });
                marker.addTo(map);
                markers.push(marker);
                map.setView([gps.latitude, gps.longitude], 10);
            }
        }).catch(error => { // Handle error from exifr.gps()
            //console.error('Error extracting GPS data for image: ' + img.alt);
            //console.error(error); // Log the error for further investigation
            return
        });
    });
}

//scroll to image clicked on map
function scrollToImage(imageAlt){
    const galleryImages = document.querySelectorAll('.gallery img');
    galleryImages.forEach((img) => {
        if (img.alt === imageAlt) {
            img.scrollIntoView({ behavior: 'smooth', block: 'center' });
            markerClicked = true;
            return;
        }
    });
}
