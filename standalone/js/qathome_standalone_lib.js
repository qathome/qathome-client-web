var contentNode = null;

function loadPage(pageToLoad, postLoadFunction) {
	if(contentNode === null) {
		contentNode = $('.content');
	}
	contentNode.load('pages/' + pageToLoad + '.html', postLoadFunction);
}

function loadTicket() {
	if(tooManyTickets()) {
		showTooManyTicketsErrorMessage();
	} else {
		loadPage('ticket', function(){
			$('.people_before_you').html(getNumberOfPeopleBeforeYou());
			$('.number').html(getNumber());
			$('.back_to_firm').on('click',function(){
				window.location = 'index.html';
			});
			$('.firm_name').html(getFirmName());
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
	alert('Inviato link all\'indirizzo: ' + mailAddress);
}

function revokeTicket() {
	deleteTicket();
	loadFirmPage();
}

