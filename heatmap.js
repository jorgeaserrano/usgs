

function makeMap(data) {
    // init map HTML
    $("#mapcontainer").empty();
    $("#mapcontainer").append(`<div id="mapid"></div>`);

    // Create the base layers.
    var dark_layer = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox/dark-v10',
        accessToken: API_KEY
    });

    var light_layer = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox/light-v10',
        accessToken: API_KEY
    });

    // Create a baseMaps object to contain the streetmap and the darkmap.
    var baseMaps = {
        "Dark": dark_layer,
        "Light": light_layer
    };

    // DO WORK AND CREATE THE OVERLAY LAYERS
    // Define arrays to hold the created  markers.
    var crimeMarkers = [];
    var heatArray = [];
    for (var i = 0; i < data.length; i++) {
        var location = data[i].location;

        if (location) {
            let marker = L.marker([location.coordinates[1], location.coordinates[0]]);
            marker.bindPopup("<h1>" + data[i].descript + "</h1> <hr> <h2>" + data[i].address + "</h2>");
            crimeMarkers.push(marker);

            // add heat map data
            heatArray.push([location.coordinates[1], location.coordinates[0]]);
        }
    }

    // Create layer groups for markers
    var crimeLayer = L.layerGroup(crimeMarkers);
    var heatLayer = L.heatLayer(heatArray, {
        radius: 30,
        blur: 10
    });

    // Create an overlayMaps object to contain the "State Population" and "City Population" layers
    var overlayMaps = {
        "Crime Markers": crimeLayer,
        "Heat Map": heatLayer
    };

    // Modify the map so that it has the streetmap, states, and cities layers
    var myMap = L.map("mapid", {
        center: [37.7749, -122.4194],
        zoom: 13,
        layers: [dark_layer, heatLayer]
    });

    // Create a layer control that contains our baseMaps and overlayMaps, and add them to the map.
    L.control.layers(baseMaps, overlayMaps).addTo(myMap);

}