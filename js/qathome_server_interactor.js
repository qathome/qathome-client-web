var isLoggedIn = false; // ???

var api_url = 'http://qathome.com/api/v1/?format=json';
var tickets_url;
var firms_url;
var users_url;

function initServerCommunication() {
	getAsyncDataFromURL(api_url, function(data) {
		tickets_url = data['tickets'];
		firms_url = data['firms'];
		users_url = data['users'];
    });
}

function getAsyncDataFromURL(url, callbackFunction) {
	$.ajax({
        url: url,
		crossDomain: true
    }).then(callbackFunction);
}

function getSyncDataFromURL(url, callbackFunction) {
	$.ajax({
        url: url,
		async: false,
		crossDomain: true
    }).then(callbackFunction);
}

function isLogged() {
	// TODO: Reperire info dal server
	return isLoggedIn;
}

function logIn() {
	// TODO: Login sul server
	isLoggedIn = true;
}

function isDeskAdmin() {
	// TODO: Reperire info dal server
	return true;
}

function logOut() {
	// TODO: Logout sul server
	isLoggedIn = false;
}

function hasAlreadyTakenTicket() {
	// TODO: Reperire info dal server
	return false;
}

function getLoggedUserName() {
	// TODO: Reperire info dal server
	return 'Antonello';
}

function ticketsEmissionClosed() {
	// TODO: Reperire info dal server
	return false;
}

function tooManyTickets() {
	// TODO: Reperire info dal server
	return false;
}

function getNumberOfPeopleOnQueue() {
	// TODO: Reperire info dal server
	return 12;
}

function getNumberOfPeopleBeforeYou(firmName) {
	var ret = 'ERROR!';
	getSyncDataFromURL(firms_url, function(data) {
		var count = data['count'];
		var results = data['results'];
		for (var i = 0; i < count; i++) {
			var name = results[i]['name'];
			console.log(name);//
			if(name === firmName) {
				ret = results[i]['waiting_users'];
				return;
			}
		}
    });
	return ret;
}

/*
function getWaitTime() {
	// TODO: Reperire info dal server
	return 17;
}
*/

function getNumber() {
	// TODO: Reperire info dal server
	return 168;
}

function deleteTicket() {
	// TODO: Annullare il ticket dal server
}

function sendMailWithTicketLink(mailAddress) {
	// TODO: Inviare mail con link, server-side
}

function emailAlreadyInDB() {
	// TODO: Reperire info dal server
	return false;
}

/*
function getFirmName() {
	return 'Matricolandosi - Unipi';
}
*/