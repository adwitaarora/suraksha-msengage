var confirmBtn = document.getElementById('confirmPosition');
var latitude = document.getElementById('latitude');
var longitude = document.getElementById('longitude');

var lp = new locationPicker('map', {
    setCurrentPosition: false,
}, {
    zoom: 1
});

confirmBtn.onclick = async function () {
    var location = lp.getMarkerPosition();
    latitude.setAttribute('value', location.lat);
    longitude.setAttribute('value', location.lng);
};
