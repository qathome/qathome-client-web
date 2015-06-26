var contentNode = null;

function loadLoginBar() {
	if(isLogged()) {
		$('.login_link_or_username').html('Benvenuto, ' + getLoggedUserName() + ' - <span class="logout_link">Logout</span>');
		$('.logout_link').on('click',logUserOut);
	} else {
		$('.login_link_or_username').html('<span class="login_link">Accedi</span> oppure <span class="register_link">registrati</span >');
		$('.login_link').on('click',loadLoginPage);
		$('.register_link').on('click',loadRegisterPage);
	}
}

function logUserOut() {
	logOut();
	loadLoginBar();
	window.location = 'index.html';
}

function logUserIn() {
	logIn();
	loadLoginBar();
	if(isDeskAdmin()) {
		loadDeskOperatorPage();
	} else {
		if(hasAlreadyTakenTicket()) {
			loadTicket();
		} else {
			window.location = 'index.html';
		}
	}
}

function loadDeskOperatorPage() {
	loadPage('desk_operator',function(){
		$('.firm_name').html(getFirmName());
		$('.free_desk').on('click',loadDeskPage);
	});
}

function loadDeskPage() {
	loadPage('desk',function(){
		$('.firm_name').html(getFirmName());
		$('.call_next').on('click',function(){
			$('.serving').html('<strong>Stai servendo: 17b</strong>');
		});
		$('.change_desk').on('click',loadDeskOperatorPage);
	});
}

function loadPage(pageToLoad, postLoadFunction) {
	if(contentNode === null) {
		contentNode = $('.content');
	}
	contentNode.load('pages/' + pageToLoad + '.html', postLoadFunction);
}

function loadLoginPage() {
	loadPage('login', function(){
		$('.login_link_or_username').html('');
		$('.login_button').on('click',logUserIn);
		$('.register_button').on('click',loadRegisterPage);
	});
}

function loadRegisterPage() {
	loadPage('register', function(){
		$('.login_link_or_username').html('');
		$('.register_new_user_button').on('click',registerNewUser);
	});
}

function loadRegistrationOKPage() {
	loadPage('registration_ok', function(){
		$('.back_to_home').on('click',function(){
			window.location = 'index.html';
		});
	});
}

function registerNewUser() {
	if(emailAlreadyInDB()) {
		alert('Indirizzo email gia\' presente!');
	} else {
		loadRegistrationOKPage();
	}
}

function loadTicket() {
	if(tooManyTickets()) {
		showTooManyTicketsErrorMessage();
	} else {
		loadPage('ticket', function(){
			$('.people_before_you').html(getNumberOfPeopleBeforeYou());
			$('.wait_time').html(getWaitTime());
			$('.number').html(getNumber());
			$('.void_ticket').on('click',revokeTicket);
			$('.back_to_firm').on('click',function(){
				window.location = 'index.html';
			});
			$('.firm_name').html(getFirmName());
			if(isLogged()) {
				$('.ticket_link_message').html('Abbiamo mandato questo link a bill.clinton@casabianca.usa');
				$('.ticket_mail_input').hide();
				$('.ticket_mail_button').hide();
			} else {
				$('.ticket_link_message').html('Apri questo link per accedere al biglietto e controllare lo stato della coda:');
				$('.send_me_the_link').on('click',function(){
					var emailAddress = $('.email_address').val();
					sendTicketLinkByMail(emailAddress);
				});
			}
		});
	}
}

function showTooManyTicketsErrorMessage() {
	if(isLogged()) {
		alert('ERRORE: Sei oltre il secondo biglietto preso nella stessa ora!');
	} else {
		alert('ERRORE: Secondo biglietto dallo stesso IP nella stessa giornata!');
	}
}

function sendTicketLinkByMail(mailAddress) {
	sendMailWithTicketLink(mailAddress);
	alert('Inviato link via mail!');
}

function revokeTicket() {
	deleteTicket();
	window.location = 'index.html';
}

function loadCalendar() {
	if(tooManyTickets()) {
		showTooManyTicketsErrorMessage();
	} else {
		if(isLogged()) {
			loadPage('calendar', function() {
				$('.firm_name').html(getFirmName());
				$('.book_button').on('click',loadTicket);
			});
		} else {
			alert('Accedi o registrati per prenotarti all\'ora che vuoi tu');
		}
	}
}

