var userGender
var url = '/';
var usrNAme = 'Exploradxr';
var map;
var cords;
var search;
var ui;
var my_lon;
var my_lat;
var group;

function initSession() {
    usrNAme = document.getElementById('usrGndr').value;
    document.getElementById('sending_file').style.display = 'block';
    userGender = document.getElementById('usrGndr').value;
    var data = {
        type: 'initSession',
        gender: userGender
    };
    fetch(url, {
        method: 'POST', // or 'PUT'
        body: JSON.stringify(data), // data can be `string` or {object}!
        headers:{
        'Content-Type': 'application/json'
    }
    }).then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(response => {
        console.log('Success:', response)
        if(response.user_id)
            showChatArea()
    });
}

function sendMessage(){
    var data = {
        type: 'message',
        text: document.getElementById('usrMessage').value
    };
    messageCreator();
    fetch(url, {
        method: 'POST', // or 'PUT'
        body: JSON.stringify(data), // data can be `string` or {object}!
        headers:{
        'Content-Type': 'application/json'
    }
    }).then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(response => {
        console.log('Success:', response)
        if(response.Response){
            let message; 
            tokens_text =  response.Response.output.generic[0].text.split('_')
            if (tokens_text[0] === 'location') {
                document.getElementById('map-wrapper').style.display = 'block';
                //cleanMap();
                if (response.Response.output.entities[0].entity === 'metodo_anticonceptivo') {
                        let com = ['farmacia', 'drugstore', 'similares', 'Farmacias del Ahorro', 'Samborns']
                        let uncom = ['IMSS', 'Clinica IMSS', 'Seguro social', 'ISSSTE']
                        if (tokens_text[1] === 'comun')
                            for (let index = 0; index < com.length; index++)
                                putInMap(com[index]);
                        else
                            for (let index = 0; index < uncom.length; index++)
                                putInMap(uncom[index]);
                }
                message = {
                    user: 'Curiosito',
                    mesg: 'Veo que necesitas ayuda, en el mapa de abajo te indico algunos lugares donde puedes encontrar lo que buscas'
                }
            }else{
                message = {
                    user: 'Curiosito',
                    mesg: response.Response.output.generic[0].text
                }
            }
            messageCreator(message);
        }
    });
	document.getElementById('usrMessage').value = '';
}

function showChatArea() {
    document.getElementById('sending_file').style.display = 'none';
    document.getElementById('chat-area').style.opacity = 0.1;
    messageCreator({
        user: 'Curiosito',
        mesg: 'Hola, yo soy \'curiosito\' y estoy aquí para resolver todas las dudas que puedas tener sobre tu sexulidad. Recuerda, aquí puedes tener toda la confianza del mundo, nada de lo que digas será guardado por ningún motivo :D'
    });
    fade(document.getElementById('welcome'), document.getElementById('chat-area'));
    // document.getElementById('main-chat').addEventListener('click', function(e) {
    //     document.getElementById(user_area_on).getElementsByClassName('chat-selector')[0].classList.remove('selected');
    //     document.getElementById('main-chat').getElementsByClassName('chat-selector')[0].classList.add('selected');
    //     document.getElementById(chat_area_on).style.display = 'none';
    //     document.getElementById('messagess-area').style.display = 'block';
    //     chat_area_on = 'messagess-area';
    //     user_area_on = 'main-chat';
    // });
}

function fade(element, element2Unfade) {
    var op = 1;  // initial opacity
    var timer = setInterval(function () {
        if (op <= 0.1){
            clearInterval(timer);
			element.style.display = 'none';
			unfade(element2Unfade);
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op -= op * 0.1;
    }, 50);
}

function unfade(element) {
	var op = 0.1;  // initial opacity
    element.style.display = 'block';
    var timer = setInterval(function () {
        if (op >= 1){
            clearInterval(timer);
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op += op * 0.1;
    }, 10);
}

function messageCreator(message) {
	
	let nodeMes = document.createElement("div");
	let nodeMesName = document.createElement("div");
	let nodeMesText = document.createElement("div");
	let file_imege_wraper = document.createElement("div");
	let node_image = document.createElement("i");
	let node_p = document.createElement("p");
	let file = document.createElement('a');
	let name;
	let mesg;
	let fromoWhom =  'messagess-area';
	nodeMes.classList.add("message");                					// Create a <div> node
	nodeMesName.classList.add("name");
	nodeMesText.classList.add("text");
	if (message == null){ 
		name = document.createTextNode(usrNAme);
		mesg = document.createTextNode(document.getElementById('usrMessage').value);
		nodeMes.classList.add("self");
		nodeMesText.appendChild(mesg);
	}else{
		//if(message.to != ('messagess-area-' + usrNAme) && message.to != 'messagess-area') return;
		name = document.createTextNode(message.user);
		mesg = document.createTextNode(message.mesg);
		
		if(message.file == null)
			nodeMesText.appendChild(mesg);
		else{
			let path_ = ''
			node_image.classList.add('fas', 'fa-file');
			node_image.style.display = 'inline';
			node_p.innerHTML = message.mesg;
			file_imege_wraper.appendChild(node_image);
			file_imege_wraper.appendChild(node_p);
			file.appendChild(file_imege_wraper);
			file.addEventListener('click', function(e) {
				if (e.path[2].text != null)
					path_ = e.path[2].text;
				else if(e.path[1].text != null)
					path_ = e.path[1].text;
				else
					path_ = e.path[3].text;
				downloadFile(path_);
			});
			nodeMesText.appendChild(file);
		}
	}
	
	
	nodeMesName.appendChild(name);
	nodeMes.appendChild(nodeMesName);
	nodeMes.appendChild(nodeMesText);
	document.getElementById(fromoWhom).appendChild(nodeMes); 
}

var platform = new H.service.Platform({
    app_id: "zO5CTVSrwGEodjkhrTof",
    app_code: "Hg8-y4kk02tg8teEYcaaqQ",
    useHTTPS: true
});
// Create a group object to hold map markers:
navigator.geolocation.getCurrentPosition(position => {
    // Define search parameters:
    cords = `${position.coords.latitude},${position.coords.longitude}`;
    console.log('Las coordenadas' ,cords);
    my_lat = position.coords.latitude;
    my_lon = position.coords.longitude;
    // Instantiate a map inside the DOM element with id map. The
    // map center is in San Francisco, the zoom level is 10:
    map = new H.Map(document.getElementById('map'),
        platform.createDefaultLayers().normal.map, {
            center: {lat: position.coords.latitude, lng: position.coords.longitude},
            zoom: 15
    });
    group = new H.map.Group();
    // Create the default UI components:
    ui = H.ui.UI.createDefault(map, platform.createDefaultLayers());

    // Add the group object to the map:
    map.addObject(group);

    // Obtain a Search object through which to submit search
    // requests:
    search = new H.places.Search(platform.getPlacesService()), error;
});

function putInMap(query) {
    var params = {
        // Plain text search for places with the word "hotel"
        // associated with them:
        'q': query,
        //  Search in the Chinatown district in San Francisco:
        'at': cords
    };
    search.request(params, {}, onResult, onError);
}

function cleanMap() {
    map = new H.Map(document.getElementById('map'),
    platform.createDefaultLayers().normal.map, {
        center: {lat: my_lat, lng: my_lon},
        zoom: 15
    });
}
// This function adds markers to the map, indicating each of
// the located places:
function addPlacesToMap(result) {
    group.addObjects(result.items.map(function (place) {
        var marker = new H.map.Marker({lat: place.position[0],
            lng: place.position[1]})
        return marker;
    }));
}

// Define a callback function to handle data on success:
function onResult(data) {
    document.getElementById('info_map').innerHTML = data;
    addPlacesToMap(data.results);
}

// Define a callback function to handle errors:
function onError(data) {
    error = data;
    console.log(error);
}

//var geocoder = platform.getGeocodingService();
// if(navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition(position => {
//         geocoder.reverseGeocode(
//             {
//                 mode: "retrieveAddresses",
//                 maxresults: 1,
//                 prox: position.coords.latitude + "," + position.coords.longitude
//             }, data => {
//                 alert("The nearest address to your location is:\n" + data.Response.View[0].Result[0].Location.Address.Label);
//             }, error => {
//                 console.error(error);
//             }
//         );
//     });
// } else {
//     console.error("Geolocation is not supported by this browser!");
// }