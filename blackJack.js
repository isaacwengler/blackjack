
var framesPerSecond = 30; 

var playerCard = [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1];
var playerCardStyle = [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1];

var dealerCard = [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1];
var dealerCardStyle = [0,-1,-1,-1,-1,-1,-1,-1,-1,-1];
// Jack is 12, Queen is 13, King is 14, Ace is 11 
//style: 1 is heart, 2 is diamond, 3 is club, 4 is spade, 0 is face down

var actionSet = ['dealToDealer','dealToPlayer','dealToDealer','dealToPlayer'];
var actionSetCounter = 0;
var action = 'reset';
var dealerCardX = 200;
var dealerCardY = 50;

var dealerCount = 0;
var playerCount = 0;

var moneyBet = 0;
var totalMoney = 1000;
var greatestTotalMoney = 1000;

var doubleDown = false; 
var split = false; 

var timer = 60;

window.onload = function() {
	canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');

	
		setInterval(function(){
		gameBoard();
		dealCards();
		checkCards();
		dealerFlip();
		bet();
		chips();
		} , 1000/framesPerSecond);
	

}

function gameBoard() {
	canvasContext.fillStyle = 'green';
	canvasContext.fillRect(0,0,canvas.width,canvas.height);

	if(action == 'gameOver'){
		canvasContext.fillStyle = 'white';
		canvasContext.font = "15px Verdana";
		canvasContext.fillText('Results',200,240);
		canvasContext.fillText('Take Home Pay: $'+totalMoney,200,260);
		canvasContext.fillText('Most Money in Bank: $'+greatestTotalMoney,200,280);
		canvasContext.fillText('Press P to play again',200,300);

	}

	for (var i = 0; i < 10; i++){
		if(playerCard[i] != -1){
			drawCards(false,i,playerCardStyle[i]);
		}
	}

	for (var i = 0; i < 10; i++){
		if(dealerCard[i] != -1){
			drawCards(true,i,dealerCardStyle[i]);
		}
	}
	

	canvasContext.fillStyle = 'white';
	canvasContext.font = "15px Verdana";
	if(playerCount > 0){
		canvasContext.fillText(playerCount,450,500);
		
	}
	if(dealerCardStyle[0] != 0){
		canvasContext.fillText(dealerCount,450,100);
	}

	if(action == 'playerWins'){
		canvasContext.fillText('YOU WIN',370,310);
		canvasContext.fillText('+$'+moneyBet,570,500);
		if(timer == 60){
			totalMoney = totalMoney + (moneyBet * 2);
			if(totalMoney > greatestTotalMoney){
				greatestTotalMoney = totalMoney;
			}
		}
		timer--;
	}

	if(action == 'dealerWins'){
		canvasContext.fillText('House Wins',360,310);
		timer--;
	}

	if(action == 'push'){
		canvasContext.fillText('PUSH',375,310);
		canvasContext.fillText('Money Back',570,500);
		if(timer == 60){
			totalMoney = totalMoney + (moneyBet);
		}
		timer--;
	}

	if(action == 'blackJack'){
		canvasContext.fillText('YOU WIN BLACKJACK PAYS 3 TO 2',300,310);
		canvasContext.fillText('+$'+(moneyBet*(3/2)),570,500);
		if(timer == 60){
			totalMoney = totalMoney + (moneyBet * (5 / 2));
			if(totalMoney > greatestTotalMoney){
				greatestTotalMoney = totalMoney;
			}

		}
		timer--;
	}

	if(timer <= 0){
		resetVar();
	}

}

	//true=dealer false=player
function drawCards(playerordealer,cardnumber,cardstyle) {
	var multiplyer = 15;
	if(playerordealer){
		var topY = 50 + (30 * cardnumber);
		var leftX = 400-(multiplyer/2 * 5)+(cardnumber*5);
	}
	else{
		var topY = 550 - (multiplyer * 7) - (30 * cardnumber);
		var leftX = 400-(multiplyer/2 * 5)+(cardnumber*5);
	}

	canvasContext.fillStyle = 'white';
	canvasContext.fillRect(leftX,topY,multiplyer*5,multiplyer*7);
	canvasContext.fillStyle = 'black';
	canvasContext.strokeRect(leftX,topY,multiplyer*5,multiplyer*7);

	if(cardstyle == 0){
		canvasContext.fillStyle = 'red';
		canvasContext.fillRect(leftX+5,topY+5,multiplyer*5-10,multiplyer*7-10);
		return;
	}
	canvasContext.font = "15px Verdana";
	if(cardstyle == 1 || cardstyle == 2){
		canvasContext.fillStyle = 'red';
	}
	else{
		canvasContext.fillStyle = 'black';
	}
	var text;
	if(playerordealer){
		if(dealerCard[cardnumber] > 10){
			if(dealerCard[cardnumber] == 11){
				text = 'A';
			}
			if(dealerCard[cardnumber] == 12){
				text = 'J';
			}
			if(dealerCard[cardnumber] == 13){
				text = 'Q';
			}
			if(dealerCard[cardnumber] == 14){
				text = 'K';
			}
		}
		else{
			text = dealerCard[cardnumber];
		}
		var addForT = 0;
		if(text == 10){
			addForT = 5;
		}
	canvasContext.fillText(text,leftX+multiplyer*5-15-addForT,topY+multiplyer*7-5);
	canvasContext.fillText(text,leftX+5,topY+15);
		canvasContext.font = "10px Verdana";
		if (cardstyle == 1){
			canvasContext.fillText('Hearts',leftX+multiplyer*5/2-15,topY+multiplyer*7/2+5);
		}
		if (cardstyle == 2){
			canvasContext.fillText('Diamonds',leftX+multiplyer*5/2-22,topY+multiplyer*7/2+5);
		}
		if (cardstyle == 3){
			canvasContext.fillText('Clubs',leftX+multiplyer*5/2-14,topY+multiplyer*7/2+5);
		}
		if (cardstyle == 4){
			canvasContext.fillText('Spades',leftX+multiplyer*5/2-18,topY+multiplyer*7/2+5);
		}
	}
	if(!playerordealer){
		if(playerCard[cardnumber] > 10){
			if(playerCard[cardnumber] == 11){
				text = 'A';
			}
			if(playerCard[cardnumber] == 12){
				text = 'J';
			}
			if(playerCard[cardnumber] == 13){
				text = 'Q';
			}
			if(playerCard[cardnumber] == 14){
				text = 'K';
			}
		}
		else{
			text = playerCard[cardnumber];
		}
		var addForT = 0;
		if(text == 10){
			addForT = 5;
		}
	canvasContext.fillText(text,leftX+multiplyer*5-15-addForT,topY+multiplyer*7-5);
	canvasContext.fillText(text,leftX+5,topY+15);
		canvasContext.font = "10px Verdana";
		if (cardstyle == 1){
			canvasContext.fillText('Hearts',leftX+multiplyer*5/2-15,topY+multiplyer*7/2+5);
		}
		if (cardstyle == 2){
			canvasContext.fillText('Diamonds',leftX+multiplyer*5/2-22,topY+multiplyer*7/2+5);
		}
		if (cardstyle == 3){
			canvasContext.fillText('Clubs',leftX+multiplyer*5/2-14,topY+multiplyer*7/2+5);
		}
		if (cardstyle == 4){
			canvasContext.fillText('Spades',leftX+multiplyer*5/2-18,topY+multiplyer*7/2+5);
		}
	}
}


function dealCards() {
	canvasContext.fillStyle = 'white';
	canvasContext.fillRect(200,50,15*5,15*7);
	canvasContext.fillStyle = 'black';
	canvasContext.strokeRect(200,50,15*5,15*7);

	canvasContext.fillStyle = 'red';
	canvasContext.fillRect(205,55,15*5-10,15*7-10);

	if(action == 'reset'){
		resetVar();
	}

	if(action == 'dealToPlayer'){
		canvasContext.fillStyle = 'white';
		canvasContext.fillRect(dealerCardX,dealerCardY,15*5,15*7);
		canvasContext.fillStyle = 'black';
		canvasContext.strokeRect(dealerCardX,dealerCardY,15*5,15*7);

		canvasContext.fillStyle = 'red';
		canvasContext.fillRect(dealerCardX + 5,dealerCardY + 5,15*5-10,15*7-10);	

		dealerCardX += 7;
		dealerCardY += 17 - (2 * playerCard.indexOf(-1));
	
		if(dealerCardX > 362){
			newPlayerCard();
			dealerCardX = 200;
			dealerCardY = 50;
			if(actionSetCounter < 3){
				actionSetCounter++;
				action = actionSet[actionSetCounter];
			}
			else if(doubleDown){
				action = 'dealerTurn';
			}
			else{
				action = 'wait';
			}
		}
	}

	if(action == 'dealToDealer'){
		canvasContext.fillStyle = 'white';
		canvasContext.fillRect(dealerCardX,dealerCardY,15*5,15*7);
		canvasContext.fillStyle = 'black';
		canvasContext.strokeRect(dealerCardX,dealerCardY,15*5,15*7);

		canvasContext.fillStyle = 'red';
		canvasContext.fillRect(dealerCardX + 5,dealerCardY + 5,15*5-10,15*7-10);	

		dealerCardX += 10;
		dealerCardY += 2 * dealerCard.indexOf(-1);
	
		if(dealerCardX > 365){
			newDealerCard();
			dealerCardX = 200;
			dealerCardY = 50;
			if(actionSetCounter < 3){
				actionSetCounter++;
				action = actionSet[actionSetCounter];
			}
			else{
				action = 'dealerTurn';
			}
		}
	}

}

function newPlayerCard() {
	for (var i = 0; i < 10; i++){
		if(playerCard[i] == -1){
			playerCard[i] = (Math.ceil(Math.random() * 13))+1;
			break;
		}
	}
}

function newDealerCard(){
	for (var i = 0; i < 10; i++){
		if(dealerCard[i] == -1){
			dealerCard[i] = (Math.ceil(Math.random() * 13))+1;
			//console.log(i);
			//console.log(dealerCard[i]);
			break;
		}
	}
}

function checkCards(){
	playerCount = 0;
	dealerCount = 0;

	if(playerCard[0] == 11 && playerCard[1] != 11 && playerCard[1] >= 10){
		action = 'blackJack';
	}
	if(playerCard[1] == 11 && playerCard[0] != 11 && playerCard[0] >= 10){
		action = 'blackJack';
	}
	
	for(var i = 0; i < 10; i++){
		if(playerCard[i] == 14){
			playerCount+=10;
		}
		else if(playerCard[i] == 13){
			playerCount+=10;
		}
		else if(playerCard[i] == 12){
			playerCount+=10;
		}
		else if(playerCard[i] == 11){
			playerCount+=11;
		}
		else if(playerCard[i] != -1){
			playerCount+=playerCard[i];
		}
	}

	if(playerCount > 21){
			for(var i = 0; i < 10; i++){
				if(playerCard[i] == 11){
					playerCount-=10;
					if(playerCount <= 21){
						break;
					}
				}
			}
	}
	
	for(var i = 0; i < 10; i++){
		if(dealerCard[i] == 14){
			dealerCount+=10;
		}
		else if(dealerCard[i] == 13){
			dealerCount+=10;
		}
		else if(dealerCard[i] == 12){
			dealerCount+=10;
		}
		else if(dealerCard[i] == 11){
			dealerCount+=11;
		}
		else if(dealerCard[i] != -1){
			dealerCount+=dealerCard[i];
		}
	}

	if(dealerCount > 21){
			for(var i = 0; i < 10; i++){
				if(dealerCard[i] == 11){
					dealerCount-=10;
				}
			}
	}
	//console.log(dealerCount);
	//console.log(playerCount);
	//console.log(action);

	if(playerCount > 21){
		action = 'dealerTurn';
	}
}

function dealerFlip(){
if(action == 'dealerTurn'){
	dealerCardStyle[0] = dealerCardStyle[9];
	if(playerCount > 21){
		action = 'dealerWins';
	}
	else if(dealerCount > 21){
		action = 'playerWins';
	}
	else if(dealerCount > playerCount){
		action = 'dealerWins';
	}
	else if(dealerCount < 17){
		action = 'dealToDealer';
	}
	else if(playerCount > dealerCount){
		action = 'playerWins';
	}
	else if(playerCount == dealerCount){
		action = 'push';
	}
}
}


function resetVar(){
	playerCard = [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1];
	dealerCard = [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1];
	dealerCardStyle[0] = 0;
	for (var i = 1; i <= 10; i++){
		dealerCardStyle[i] = (Math.ceil(Math.random() * 4));
		//console.log(dealerCardStyle[i]);
	}
	for (var i = 0; i <= 10; i++){
		playerCardStyle[i] = (Math.ceil(Math.random() * 4));
		//console.log(playerCardStyle[i]);
	}


	actionSetCounter = 0;
	action = 'makeBet';
	//action = actionSet[0];
	dealerCardX = 200;
	dealerCardY = 50;
	dealerCount = 0;
	playerCount = 0;
	timer = 60;
	moneyBet = 0;
	doubleDown = false; 

}

function bet(){
	if(totalMoney <= 0 && moneyBet == 0){
		action = 'gameOver';
	}
	if(action != 'gameOver'){
		canvasContext.fillStyle = 'white';
		canvasContext.font = "15px Verdana";

		canvasContext.fillText('Money Bet: $'+moneyBet,570,300);
		canvasContext.fillText('My Money: $'+totalMoney,570,530);
		
		canvasContext.strokeStyle = 'white';
		canvasContext.strokeRect(500,510,295,85);
		canvasContext.strokeStyle = 'black';

		canvasContext.strokeStyle = 'white';
		canvasContext.strokeRect(500,280,295,85);
		canvasContext.strokeStyle = 'black';
	}
	if (action == 'makeBet'){
		canvasContext.fillStyle = 'white';
		canvasContext.font = "15px Verdana";
		canvasContext.fillText('Cash Out: Press P',50,20);
		canvasContext.fillText('Make a Bet',350,300);
		canvasContext.fillText('Raise Bet: Press W',50,300);
		canvasContext.fillText('Lower Bet: Press S',50,320);
		canvasContext.fillText('Enter Bet: Press E',50,340);
	}
	else if (action == 'wait'){
		canvasContext.fillStyle = 'white';
		canvasContext.font = "15px Verdana";
		canvasContext.fillText('Hit: Press A',50,300);
		canvasContext.fillText('Stand: Press D',50,320);
		if(playerCard[2] == -1 && totalMoney >= moneyBet){
			canvasContext.fillText('Double Down: Press F',570,270);
		}
	}
}

function chips(){
	if(action != 'gameOver'){
		if(totalMoney >= 500){
			canvasContext.fillStyle = 'gold';
			
			canvasContext.beginPath();
			canvasContext.arc(570, 565, 25, 0,Math.PI*2, true);
			canvasContext.fill();
			canvasContext.stroke();
			canvasContext.fillStyle = 'black';
			canvasContext.font = "10px Verdana";
			canvasContext.fillText('500',560,567);

		}
		if((totalMoney % 500) >= 100){
			canvasContext.fillStyle = 'red';
			
			canvasContext.beginPath();
			canvasContext.arc(635, 565, 25, 0,Math.PI*2, true);
			canvasContext.fill();
			canvasContext.stroke();
			canvasContext.fillStyle = 'white';
			canvasContext.font = "10px Verdana";
			canvasContext.fillText('100',625,567);

		}
		if((totalMoney % 100) != 0){	
			canvasContext.fillStyle = 'black';
			
			canvasContext.beginPath();
			canvasContext.arc(700, 565, 25, 0,Math.PI*2, true);
			canvasContext.fill();
			canvasContext.stroke();
			canvasContext.fillStyle = 'white';
			canvasContext.font = "10px Verdana";
			canvasContext.fillText('50',693,567);

		}
		if(moneyBet >= 500){
			canvasContext.fillStyle = 'gold';
			
			canvasContext.beginPath();
			canvasContext.arc(570, 330, 25, 0,Math.PI*2, true);
			canvasContext.fill();
			canvasContext.stroke();
			canvasContext.fillStyle = 'black';
			canvasContext.font = "10px Verdana";
			canvasContext.fillText('500',560,332);

		}
		if((moneyBet % 500) >= 100){
			canvasContext.fillStyle = 'red';
			
			canvasContext.beginPath();
			canvasContext.arc(635, 330, 25, 0,Math.PI*2, true);
			canvasContext.fill();
			canvasContext.stroke();
			canvasContext.fillStyle = 'white';
			canvasContext.font = "10px Verdana";
			canvasContext.fillText('100',625,332);

		}
		if((moneyBet % 100) != 0){	
			canvasContext.fillStyle = 'black';
			
			canvasContext.beginPath();
			canvasContext.arc(700, 330, 25, 0,Math.PI*2, true);
			canvasContext.fill();
			canvasContext.stroke();
			canvasContext.fillStyle = 'white';
			canvasContext.font = "10px Verdana";
			canvasContext.fillText('50',693,332);

		}
	}
}

document.onkeydown = checkKey;

function checkKey(e){
e = e || window.event;

if (e.keyCode == '65'){
	if(action == 'wait'){
		action = 'dealToPlayer';
	}
}

if (e.keyCode == '68'){
	if(action == 'wait'){
		action = 'dealerTurn';
	}
}

if (e.keyCode == '70'){
	if(action == 'wait' && playerCard[2] == -1){
		if(totalMoney >= moneyBet){
			totalMoney -= moneyBet;
			moneyBet = moneyBet * 2; 
			action = 'dealToPlayer';
			doubleDown = true; 
		}
	}
}

if (e.keyCode == '87'){
	if(action == 'makeBet' && totalMoney > 0){
		moneyBet+=50;
		totalMoney-=50;
	}
}

if (e.keyCode == '83'){
	if(action == 'makeBet' && moneyBet != 0){
		moneyBet-=50;
		totalMoney+=50;
	}
	//else if(action == 'wait'){
	//	if(playerCard[2] == -1 && playerCard[0] == playerCard[1]){
	//		split = true; 
	//	}
	//}
}

if (e.keyCode == '69'){
	if(action == 'makeBet' && moneyBet > 0){
		action = actionSet[0];
	}
}

if (e.keyCode == '80'){
	if(action == 'gameOver'){
		totalMoney = 1000;
		greatestTotalMoney = 1000;
		resetVar();
	}
	else if(action == 'makeBet'){
		action = 'gameOver';
	}
	
}


}