const AssistantV2 = require('ibm-watson/assistant/v2');
var express = require('express');
var router = express.Router();
var my_session_id = null
const assistant = new AssistantV2({
	version: '2019-02-01'
});


/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Curiosito' });
});

router.get('/abautCuriosito', function(req, res, next) {
	res.render('abautCuriosito', { title: 'Curiosito' });
});

router.post('/', function(req, res, next) {
	object_req = req.body
	post_type = object_req.type
	console.log(object_req, post_type, typeof post_type, post_type == 'initSession');
	if (post_type === 'initSession'){
		initSession( () =>{
			res.json({'type': 'user_id', 'user_id': my_session_id});
		});
	} else if(post_type === 'message'){
		sendMessage(object_req.text, (WatsonRes) =>{
			res.json({'type': 'Response', 'Response': WatsonRes});
		});
	}else{
		res.json({'type': 'error'});
	}
});

function initSession(cb){
	assistant.createSession({
		assistant_id: 'c7bac764-41e7-4487-be3f-a90ac89ab23d'
	})
	.then(res => {
		console.log(JSON.stringify(res, null, 2));
		my_session_id = res.session_id;
		cb();
	})
	.catch(err => {
		console.log(err);
	});
}

function sendMessage(text, cb){
	assistant.message({
        assistant_id: 'c7bac764-41e7-4487-be3f-a90ac89ab23d',
        session_id: my_session_id,
        input: {
          'message_type': 'text',
          'text': text
        }
    })
        .then(res => {
		  console.log(JSON.stringify(res, null, 2));
		  cb(res);
    })
        .catch(err => {
          console.log(err);
    });
}
module.exports = router;
