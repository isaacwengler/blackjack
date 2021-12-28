/** @format */

// Jack is 12, Queen is 13, King is 14, Ace is 11
//style: 1 is heart, 2 is diamond, 3 is club, 4 is spade, 0 is face down
class Card {
    constructor(value, isFaceDown) {
        this.value = value;
        this.style = isFaceDown ? 0 : Math.ceil(Math.random() * 4);
    }

    flip() {
        if (!this.style) {
            this.style = Math.ceil(Math.random() * 4);
        }
    }
}

const framesPerSecond = 30;

let playerCards = [];
let dealerCards = [];

const actionSet = [
    "dealToDealer",
    "dealToPlayer",
    "dealToDealer",
    "dealToPlayer",
];
let actionSetCounter = 0;
let action = "reset";
let dealerCardX = 200;
let dealerCardY = 50;

let dealerCount = 0;
let playerCount = 0;

let moneyBet = 0;
let totalMoney = 1000;
let greatestTotalMoney = 1000;

let doubleDown = false;
let timer = 60;

window.onload = () => {
    canvas = document.getElementById("gameCanvas");
    canvasContext = canvas.getContext("2d");
    setInterval(() => {
        gameBoard();
        dealCards();
        checkCards();
        dealerFlip();
        bet();
        chips();
    }, 1000 / framesPerSecond);
};

const gameBoard = () => {
    canvasContext.fillStyle = "green";
    canvasContext.fillRect(0, 0, canvas.width, canvas.height);

    if (action === "gameOver") {
        canvasContext.fillStyle = "white";
        canvasContext.font = "15px Verdana";
        canvasContext.fillText("Results", 200, 240);
        canvasContext.fillText("Take Home Pay: $" + totalMoney, 200, 260);
        canvasContext.fillText(
            "Most Money in Bank: $" + greatestTotalMoney,
            200,
            280
        );
        canvasContext.fillText("Press P to play again", 200, 300);
    }

    playerCards.forEach((card, index) => {
        drawCards(false, index, card.style);
    });

    dealerCards.forEach((card, index) => {
        drawCards(true, index, card.style);
    });

    canvasContext.fillStyle = "white";
    canvasContext.font = "15px Verdana";
    if (playerCount) {
        canvasContext.fillText(playerCount, 450, 500);
    }
    if (dealerCards.length && dealerCards[0].style) {
        canvasContext.fillText(dealerCount, 450, 100);
    }

    if (action === "playerWins") {
        canvasContext.fillText("YOU WIN", 370, 310);
        canvasContext.fillText("+$" + moneyBet, 570, 500);
        if (timer === 60) {
            totalMoney = totalMoney + moneyBet * 2;
            if (totalMoney > greatestTotalMoney) {
                greatestTotalMoney = totalMoney;
            }
        }
        timer--;
    }

    if (action === "dealerWins") {
        canvasContext.fillText("House Wins", 360, 310);
        timer--;
    }

    if (action === "push") {
        canvasContext.fillText("PUSH", 375, 310);
        canvasContext.fillText("Money Back", 570, 500);
        if (timer === 60) {
            totalMoney = totalMoney + moneyBet;
        }
        timer--;
    }

    if (action === "blackJack") {
        canvasContext.fillText("YOU WIN BLACKJACK PAYS 3 TO 2", 300, 310);
        canvasContext.fillText("+$" + moneyBet * (3 / 2), 570, 500);
        if (timer === 60) {
            totalMoney = totalMoney + moneyBet * (5 / 2);
            if (totalMoney > greatestTotalMoney) {
                greatestTotalMoney = totalMoney;
            }
        }
        timer--;
    }

    if (timer <= 0) {
        reset();
    }
};

const multiplyer = 15;

const drawCards = (isDealer, index, style) => {
    let topY, leftX;
    if (isDealer) {
        topY = 50 + 30 * index;
        leftX = 400 - (multiplyer / 2) * 5 + index * 5;
    } else {
        topY = 550 - multiplyer * 7 - 30 * index;
        leftX = 400 - (multiplyer / 2) * 5 + index * 5;
    }

    canvasContext.fillStyle = "white";
    canvasContext.fillRect(leftX, topY, multiplyer * 5, multiplyer * 7);
    canvasContext.fillStyle = "black";
    canvasContext.strokeRect(leftX, topY, multiplyer * 5, multiplyer * 7);
    canvasContext.font = "15px Verdana";

    if (!style) {
        canvasContext.fillStyle = "red";
        canvasContext.fillRect(
            leftX + 5,
            topY + 5,
            multiplyer * 5 - 10,
            multiplyer * 7 - 10
        );
        return;
    } else if (style === 1 || style === 2) {
        canvasContext.fillStyle = "red";
    } else {
        canvasContext.fillStyle = "black";
    }
    let text;
    if (isDealer) {
        if (dealerCards[index].value > 10) {
            if (dealerCards[index].value === 11) {
                text = "A";
            }
            if (dealerCards[index].value === 12) {
                text = "J";
            }
            if (dealerCards[index].value === 13) {
                text = "Q";
            }
            if (dealerCards[index].value === 14) {
                text = "K";
            }
        } else {
            text = dealerCards[index].value;
        }
        let addForT = 0;
        if (text === 10) {
            addForT = 5;
        }
        canvasContext.fillText(
            text,
            leftX + multiplyer * 5 - 15 - addForT,
            topY + multiplyer * 7 - 5
        );
        canvasContext.fillText(text, leftX + 5, topY + 15);
        canvasContext.font = "10px Verdana";

        if (style === 1) {
            canvasContext.fillText(
                "Hearts",
                leftX + (multiplyer * 5) / 2 - 15,
                topY + (multiplyer * 7) / 2 + 5
            );
        }
        if (style === 2) {
            canvasContext.fillText(
                "Diamonds",
                leftX + (multiplyer * 5) / 2 - 22,
                topY + (multiplyer * 7) / 2 + 5
            );
        }
        if (style === 3) {
            canvasContext.fillText(
                "Clubs",
                leftX + (multiplyer * 5) / 2 - 14,
                topY + (multiplyer * 7) / 2 + 5
            );
        }
        if (style === 4) {
            canvasContext.fillText(
                "Spades",
                leftX + (multiplyer * 5) / 2 - 18,
                topY + (multiplyer * 7) / 2 + 5
            );
        }
    }
    if (!isDealer) {
        if (playerCards[index].value > 10) {
            if (playerCards[index].value === 11) {
                text = "A";
            }
            if (playerCards[index].value === 12) {
                text = "J";
            }
            if (playerCards[index].value === 13) {
                text = "Q";
            }
            if (playerCards[index].value === 14) {
                text = "K";
            }
        } else {
            text = playerCards[index].value;
        }
        let addForT = 0;
        if (text === 10) {
            addForT = 5;
        }
        canvasContext.fillText(
            text,
            leftX + multiplyer * 5 - 15 - addForT,
            topY + multiplyer * 7 - 5
        );
        canvasContext.fillText(text, leftX + 5, topY + 15);
        canvasContext.font = "10px Verdana";
        if (style === 1) {
            canvasContext.fillText(
                "Hearts",
                leftX + (multiplyer * 5) / 2 - 15,
                topY + (multiplyer * 7) / 2 + 5
            );
        }
        if (style === 2) {
            canvasContext.fillText(
                "Diamonds",
                leftX + (multiplyer * 5) / 2 - 22,
                topY + (multiplyer * 7) / 2 + 5
            );
        }
        if (style === 3) {
            canvasContext.fillText(
                "Clubs",
                leftX + (multiplyer * 5) / 2 - 14,
                topY + (multiplyer * 7) / 2 + 5
            );
        }
        if (style === 4) {
            canvasContext.fillText(
                "Spades",
                leftX + (multiplyer * 5) / 2 - 18,
                topY + (multiplyer * 7) / 2 + 5
            );
        }
    }
};

const dealCards = () => {
    canvasContext.fillStyle = "white";
    canvasContext.fillRect(200, 50, 15 * 5, 15 * 7);
    canvasContext.fillStyle = "black";
    canvasContext.strokeRect(200, 50, 15 * 5, 15 * 7);

    canvasContext.fillStyle = "red";
    canvasContext.fillRect(205, 55, 15 * 5 - 10, 15 * 7 - 10);

    if (action === "reset") {
        reset();
    }

    if (action === "dealToPlayer") {
        canvasContext.fillStyle = "white";
        canvasContext.fillRect(dealerCardX, dealerCardY, 15 * 5, 15 * 7);
        canvasContext.fillStyle = "black";
        canvasContext.strokeRect(dealerCardX, dealerCardY, 15 * 5, 15 * 7);

        canvasContext.fillStyle = "red";
        canvasContext.fillRect(
            dealerCardX + 5,
            dealerCardY + 5,
            15 * 5 - 10,
            15 * 7 - 10
        );

        dealerCardX += 7;
        dealerCardY += 17 - 2 * playerCards.length;

        if (dealerCardX > 362) {
            newPlayerCard();
            dealerCardX = 200;
            dealerCardY = 50;
            if (actionSetCounter < 3) {
                actionSetCounter++;
                action = actionSet[actionSetCounter];
            } else if (doubleDown) {
                action = "dealerTurn";
            } else {
                action = "wait";
            }
        }
    }

    if (action === "dealToDealer") {
        canvasContext.fillStyle = "white";
        canvasContext.fillRect(dealerCardX, dealerCardY, 15 * 5, 15 * 7);
        canvasContext.fillStyle = "black";
        canvasContext.strokeRect(dealerCardX, dealerCardY, 15 * 5, 15 * 7);

        canvasContext.fillStyle = "red";
        canvasContext.fillRect(
            dealerCardX + 5,
            dealerCardY + 5,
            15 * 5 - 10,
            15 * 7 - 10
        );

        dealerCardX += 10;
        dealerCardY += 2 * dealerCards.length;

        if (dealerCardX > 365) {
            newDealerCard();
            dealerCardX = 200;
            dealerCardY = 50;
            if (actionSetCounter < 3) {
                actionSetCounter++;
                action = actionSet[actionSetCounter];
            } else {
                action = "dealerTurn";
            }
        }
    }
};

const newPlayerCard = () => playerCards.push(new Card(Math.ceil(Math.random() * 13) + 1, false));

const newDealerCard = () => dealerCards.push(new Card(Math.ceil(Math.random() * 13) + 1, !dealerCards.length));


function checkCards() {
    playerCount = 0;
    dealerCount = 0;

    playerCards.forEach((card) => playerCount += card.value === 11 ? 11 : Math.min(10, card.value));

    if (playerCount > 21 && playerCards.map((card) => card.value).includes(11)) {
        playerCount -= 10 * playerCards.map((card) => card.value).reduce((total, value) => total + (value === 11 ? 1 : 0), 0);
    }

    if (playerCount === 21 && playerCards.length === 2) {
        action = "blackJack";
    }

    dealerCards.forEach((card) => dealerCount += card.value === 11 ? 11 : Math.min(10, card.value));

    if (dealerCount > 21 && dealerCards.map((card) => card.value).includes(11)) {
        dealerCount -= 10 * dealerCards.map((card) => card.value).reduce((total, value) => total + (value === 11 ? 1 : 0), 0);
    }

    if (playerCount > 21) {
        action = "dealerTurn";
    }
}

function dealerFlip() {
    if (action === "dealerTurn") {
        dealerCards[0].flip();
        if (playerCount > 21) {
            action = "dealerWins";
        } else if (dealerCount > 21) {
            action = "playerWins";
        } else if (dealerCount > playerCount) {
            action = "dealerWins";
        } else if (dealerCount < 17) {
            action = "dealToDealer";
        } else if (playerCount > dealerCount) {
            action = "playerWins";
        } else if (playerCount === dealerCount) {
            action = "push";
        }
    }
}

function reset() {
    playerCards = [];
    dealerCards = [];

    actionSetCounter = 0;
    action = "makeBet";
    dealerCardX = 200;
    dealerCardY = 50;
    dealerCount = 0;
    playerCount = 0;
    timer = 60;
    moneyBet = 0;
    doubleDown = false;
}

function bet() {
    if (totalMoney <= 0 && moneyBet === 0) {
        action = "gameOver";
    }
    if (action != "gameOver") {
        canvasContext.fillStyle = "white";
        canvasContext.font = "15px Verdana";

        canvasContext.fillText("Money Bet: $" + moneyBet, 570, 300);
        canvasContext.fillText("My Money: $" + totalMoney, 570, 530);

        canvasContext.strokeStyle = "white";
        canvasContext.strokeRect(500, 510, 295, 85);
        canvasContext.strokeStyle = "black";

        canvasContext.strokeStyle = "white";
        canvasContext.strokeRect(500, 280, 295, 85);
        canvasContext.strokeStyle = "black";
    }
    if (action === "makeBet") {
        canvasContext.fillStyle = "white";
        canvasContext.font = "15px Verdana";
        canvasContext.fillText("Cash Out: Press P", 50, 20);
        canvasContext.fillText("Make a Bet", 350, 300);
        canvasContext.fillText("Raise Bet: Press W", 50, 300);
        canvasContext.fillText("Lower Bet: Press S", 50, 320);
        canvasContext.fillText("Enter Bet: Press E", 50, 340);
    } else if (action === "wait") {
        canvasContext.fillStyle = "white";
        canvasContext.font = "15px Verdana";
        canvasContext.fillText("Hit: Press A", 50, 300);
        canvasContext.fillText("Stand: Press D", 50, 320);
        if (playerCards[2] === -1 && totalMoney >= moneyBet) {
            canvasContext.fillText("Double Down: Press F", 570, 270);
        }
    }
}

function chips() {
    if (action != "gameOver") {
        if (totalMoney >= 500) {
            canvasContext.fillStyle = "gold";

            canvasContext.beginPath();
            canvasContext.arc(570, 565, 25, 0, Math.PI * 2, true);
            canvasContext.fill();
            canvasContext.stroke();
            canvasContext.fillStyle = "black";
            canvasContext.font = "10px Verdana";
            canvasContext.fillText("500", 560, 567);
        }
        if (totalMoney % 500 >= 100) {
            canvasContext.fillStyle = "red";

            canvasContext.beginPath();
            canvasContext.arc(635, 565, 25, 0, Math.PI * 2, true);
            canvasContext.fill();
            canvasContext.stroke();
            canvasContext.fillStyle = "white";
            canvasContext.font = "10px Verdana";
            canvasContext.fillText("100", 625, 567);
        }
        if (totalMoney % 100 != 0) {
            canvasContext.fillStyle = "black";

            canvasContext.beginPath();
            canvasContext.arc(700, 565, 25, 0, Math.PI * 2, true);
            canvasContext.fill();
            canvasContext.stroke();
            canvasContext.fillStyle = "white";
            canvasContext.font = "10px Verdana";
            canvasContext.fillText("50", 693, 567);
        }
        if (moneyBet >= 500) {
            canvasContext.fillStyle = "gold";

            canvasContext.beginPath();
            canvasContext.arc(570, 330, 25, 0, Math.PI * 2, true);
            canvasContext.fill();
            canvasContext.stroke();
            canvasContext.fillStyle = "black";
            canvasContext.font = "10px Verdana";
            canvasContext.fillText("500", 560, 332);
        }
        if (moneyBet % 500 >= 100) {
            canvasContext.fillStyle = "red";

            canvasContext.beginPath();
            canvasContext.arc(635, 330, 25, 0, Math.PI * 2, true);
            canvasContext.fill();
            canvasContext.stroke();
            canvasContext.fillStyle = "white";
            canvasContext.font = "10px Verdana";
            canvasContext.fillText("100", 625, 332);
        }
        if (moneyBet % 100 != 0) {
            canvasContext.fillStyle = "black";

            canvasContext.beginPath();
            canvasContext.arc(700, 330, 25, 0, Math.PI * 2, true);
            canvasContext.fill();
            canvasContext.stroke();
            canvasContext.fillStyle = "white";
            canvasContext.font = "10px Verdana";
            canvasContext.fillText("50", 693, 332);
        }
    }
}

document.onkeydown = checkKey;

function checkKey(e) {
    e = e || window.event;

    if (e.keyCode === 65) {
        if (action === "wait") {
            action = "dealToPlayer";
        }
    }

    if (e.keyCode === 68) {
        if (action === "wait") {
            action = "dealerTurn";
        }
    }

    if (e.keyCode === 70) {
        if (action === "wait" && playerCards[2] === -1) {
            if (totalMoney >= moneyBet) {
                totalMoney -= moneyBet;
                moneyBet = moneyBet * 2;
                action = "dealToPlayer";
                doubleDown = true;
            }
        }
    }

    if (e.keyCode === 87) {
        if (action === "makeBet" && totalMoney > 0) {
            moneyBet += 50;
            totalMoney -= 50;
        }
    }

    if (e.keyCode === 83) {
        if (action === "makeBet" && moneyBet != 0) {
            moneyBet -= 50;
            totalMoney += 50;
        }
    }

    if (e.keyCode === 69) {
        if (action === "makeBet" && moneyBet > 0) {
            action = actionSet[0];
        }
    }

    if (e.keyCode === 80) {
        if (action === "gameOver") {
            totalMoney = 1000;
            greatestTotalMoney = 1000;
            reset();
        } else if (action === "makeBet") {
            action = "gameOver";
        }
    }
}
