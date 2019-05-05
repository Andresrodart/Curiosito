var userGender
var url = '/';
var usrNAme = 'Exploradxr'
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
            messageCreator({
                user: 'Curiosito',
                mesg: response.Response.output.generic[0].text
            });
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
    "app_id": " zO5CTVSrwGEodjkhrTof",
    "app_code": " Hg8-y4kk02tg8teEYcaaqQ"
});
var geocoder = platform.getGeocodingService();
if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
        geocoder.reverseGeocode(
            {
                mode: "retrieveAddresses",
                maxresults: 1,
                prox: position.coords.latitude + "," + position.coords.longitude
            }, data => {
                alert("The nearest address to your location is:\n" + data.Response.View[0].Result[0].Location.Address.Label);
            }, error => {
                console.error(error);
            }
        );
    });
} else {
    console.error("Geolocation is not supported by this browser!");
}