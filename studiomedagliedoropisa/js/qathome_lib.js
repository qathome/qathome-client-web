var contentNode = null;

// Singolo desk e singolo firm
//var firmURL = null;
//var deskURL = null;
var firmURL = 'http://qathome.com/api/v1/firms/fc06a1c8-c8a6-398a-956b-ef834b29e449/';
var deskURL = 'http://qathome.com/api/v1/firms/fc06a1c8-c8a6-398a-956b-ef834b29e449/desks/1/';

function loadPage(pageToLoad, postLoadFunction) {
	if (contentNode === null) {
		contentNode = $('.content');
	}
	contentNode.load('pages/' + pageToLoad + '.html', postLoadFunction);
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
				console.log(loginOk);
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
	});
}

function loadLoginBar() {
	$('.login_link_or_username').html('Benvenuto, ' + getLoggedUserName() + ' - <a href="#" class="logout_link">Logout</a>');
	$('.logout_link').on('click',logUserOut);
}

function logUserOut() {
	closeFirm(firmURL);
	logOut();
	$('.login_link_or_username').html('');
	loadLoginPage();
}

function loadFirmPage() {
	var ownedFirms = getOwnedFirms();
	
	//firmURL = ownedFirms['results'][0]['url'];
	//console.log('firmURL = ' + firmURL);
	//var desksURL = getFirmDesksURL(firmURL);
	//var desks = getDesks(desksURL);*/
	// Singolo desk! Prendiamo il primo
	//deskURL = desks['results'][0]['url'];
	//deskURL = firmURL + 'desks/1/';
	
	if(firmIsOpen(firmURL)) {
		loadPage('desk', function(){
			$('.firm_name').html(getFirmName(firmURL));
			$('.people_on_queue').html(getFirmWaitingUsers(firmURL));
			$('.call_next').on('click',function(){
				var ticket = getNextTicket(firmURL + 'tickets/next/?desk=1');
				var ticketNumber = ticket['user_code'];
				$('.serving').html('Stai servendo il numero: ' + ticketNumber);
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