var contentNode = null;

// Singolo desk e singolo firm
//var firmURL = null;
//var deskURL = null;
var firmURL = 'http://qathome.com/api/v1/firms/5317a482-8483-3e7d-a17f-2dbc5d4b080f/';
var deskURL = 'http://qathome.com/api/v1/firms/5317a482-8483-3e7d-a17f-2dbc5d4b080f/desks/1/';
var ticketsURL = 'http://qathome.com/api/v1/firms/5317a482-8483-3e7d-a17f-2dbc5d4b080f/tickets/';
var firstDone = false;
var currentTicketIDForFirm;

function getFirmURL() {
	return firmURL;
}

function loadPage(pageToLoad, postLoadFunction) {
	if (contentNode === null) {
		contentNode = $('.content');
	}
	contentNode.load('pages/' + pageToLoad + '.html', postLoadFunction);
}

function loadLoginBar() {
	$('.login_link_or_username').html('Benvenuto, ' + getLoggedUserName() + ' - <a href="#" class="logout_link">Logout</a>');
	$('.logout_link').on('click',logUserOut);
}

function loadNotLoggedLoginBar() {
	$('.login_link_or_username').html('<a href="#" class="login_link">Login</a>');
	$('.login_link').on('click',loadLoginPage);
}

function logUserOut() {
	closeFirm(firmURL);
	logOut();
	$('.login_link_or_username').html('');
	window.location = 'index.html';
}

function loadLoginPage() {
	loadPage('login', function(){
		$('.login_button').on('click',function(){
			var username = $('.login_field').val();
			var password = $('.password_field').val();
			if( (username === '') || (password === '') ) {
				alert('Specificare username e password');
			} else {
				var loginOk = logIn(username,password);
				if(loginOk === true) {
					loadLoginBar();
					loadFirmPage();
				} else {
					alert('Username e/o password non validi!');
					$('.login_field').val('');
					$('.password_field').val('');
				}
			}
		});
		$('.login_link_or_username').html('');
		$('.back_to_home').on('click',function(){
			window.location = 'index.html';
		});
	});
}

function loadFirmPage() {
	
	if(firmIsOpen(firmURL)) {
		loadPage('desk', function(){
			$('.firm_name').html(getFirmName(firmURL));
			$('.people_on_queue').html(getFirmWaitingUsers(firmURL));
			$('.call_next').on('click',function(){
				$('.people_on_queue').html(getFirmWaitingUsers(firmURL));
				if(firstDone === false) { // Non abbiamo ancora fatto la first, che restituisce il primo ticket da servire
					var firstTicketToServe = getFirstTicketToServe(firmURL + 'tickets/next/');
					if(typeof firstTicketToServe === 'undefined') {
						$('.serving').html('Non ci sono utenti in coda!');
					} else {
						var ticketNumber = firstTicketToServe['user_code'];
						currentTicketIDForFirm = firstTicketToServe['id_for_firm'];
						$('.serving').html('Stai servendo il numero: ' + ticketNumber);
						firstDone = true;
					}
				} else { // First già fatta, chiamiamo la next!
					var nextTicketToServe = getNextTicketToServe(firmURL + 'tickets/next/?current=' + currentTicketIDForFirm);
					if(typeof nextTicketToServe === 'undefined') {
						$('.serving').html('Non ci sono utenti in coda!');
					} else {
						var ticketNumber = nextTicketToServe['user_code'];
						currentTicketIDForFirm = nextTicketToServe['id_for_firm'];
						$('.serving').html('Stai servendo il numero: ' + ticketNumber);
					}
				}
			});
			$('.close_desk').on('click',function(){
				closeDesk(deskURL);
				closeFirm(firmURL);
				loadFirmPage();
			});
		});
	} else {
		loadPage('desk_closed', function(){
			$('.firm_name').html(getFirmName(firmURL));
			$('.open_desk').on('click',function(){
				openFirm(firmURL);
				openDesk(deskURL);
				loadFirmPage();
			});
		});
	}
}

function loadTicketPage() {
	var ticket = getNextTicket(ticketsURL);
	loadPage('ticket', function(){
		var firmURL = getFirmURL();
		var firmName = getFirmNameNotLogged(firmURL);
		var waitingUsers = getFirmWaitingUsersNotLogged(firmURL);
		$('.firm_name').html(firmName);
		$('.back_to_firm').on('click',function(){
			window.location = 'index.html';
		});
		$('.number').html(ticket['user_code']);
		var intWaitingUsers = parseInt(waitingUsers);
		intWaitingUsers --;
		$('.people_before_you').html(intWaitingUsers);
	});
}