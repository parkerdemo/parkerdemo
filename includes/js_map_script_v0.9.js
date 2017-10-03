var map;
function initMap() { 
  loadMarkers();
  // refresh every 5 minutes
  setInterval("loadMarkers()", 300000);
}

function downloadUrl(url,callback) {
    var request = window.ActiveXObject ?
         new ActiveXObject('Microsoft.XMLHTTP') :
         new XMLHttpRequest;
     
    request.onreadystatechange = function() {
        if (request.readyState == 4) {
            //request.onreadystatechange = doNothing;
            callback(request, request.status);

            //hide loading screen once AJAX is loaded
            var map_dom = document.getElementById("load");
            console.log(map_dom);
            map_dom.style.display = "none";
        }
    };
     
    request.open('GET', url, true);
    request.send(null);
}




function loadMarkers() {
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 15,
    center: {lat: -37.813828, lng: 144.961503}
  });

  var infoWindow = new google.maps.InfoWindow;

  xmlUrl = "includes/melbournedata_half.xml";
  
    map.markers = map.markers || []

    downloadUrl(xmlUrl, function(data) {
        var xml = data.responseXML;
        markers = xml.documentElement.getElementsByTagName("features");

        // for each marker
        for (var i = 0; i < markers.length; i++) {
            // store <tag> data
            var name = markers[i].getElementsByTagName("bayId")[0].innerHTML;
            var long = markers[i].getElementsByTagName("coordinates")[0].innerHTML;
            var lat = markers[i].getElementsByTagName("coordinates")[1].innerHTML;
            var streetMarker = markers[i].getElementsByTagName("streetMarker")[0].innerHTML;
            var streetName = markers[i].getElementsByTagName("streetName")[0].innerHTML;


            avail = Math.round(Math.random()+0.2);
            if (avail == 1) {
            	fcolor = 'red';
            }
            else {
            	fcolor = 'green';
            }

            //var open = markers[i].getElementsByTagName("open")[0].innerHTML;
            //var availability = markers[i].getElementsByTagName('availability')[0].innerHTML;
            //var free = availability.split(" ")[3].toString();
            //var address = markers[i].getElementsByTagName("locationName")[0].innerHTML;
           

            // marker parameters, size scales with availability
            var circle = {
              path: google.maps.SymbolPath.CIRCLE,
              fillColor: fcolor,
              fillOpacity: .5,
              scale: 4,
              strokeColor: 'white',
              strokeWeight: 0
            };

            // store coordinates
            var point = new google.maps.LatLng(
                parseFloat(lat),
                parseFloat(long));

            // placing marker and html box
            var html = "<div class='infowindow'><b>" + name + "</b><br/>" + streetMarker + " " + streetName + "</b><br/>" + "</div>";
            var marker = new google.maps.Marker({
              map: map,
              position: point,
              icon: circle,
              title: name,
              label: {
                text: ' ',
                color: 'white',
              },
              // clusters with greater availability have a higher zIndex
              //zIndex: parseInt(free),
            });

            map.markers.push(marker);
            bindInfoWindow(marker, map, infoWindow, html);
            /*console.log(freeColor);*/
        }
    });
}






function bindInfoWindow(marker, map, infoWindow, html) {
  google.maps.event.addListener(marker, 'click', function() {
    infoWindow.setContent(html);
    infoWindow.open(map, marker);
  });
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
