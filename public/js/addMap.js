mapboxgl.accessToken = mapToken;
report = JSON.parse(report);
coord = report.geometry.coordinates;
const map = new mapboxgl.Map({
    container: 'map', 
    style: 'mapbox://styles/mapbox/streets-v11', 
    center: coord, 
    zoom: 9 
});
map.addControl(new mapboxgl.NavigationControl());
const marker = new mapboxgl.Marker()
    .setLngLat(coord)
    .setPopup(
        new mapboxgl.Popup({ offset : 25 })
            .setHTML(
                `<h3>${report.address})</h3>`
            )
    )
    .addTo(map)