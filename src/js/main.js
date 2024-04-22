const element = {
  cards: document.querySelectorAll(".Game_Cards_Card"),
  containerCards: document.querySelector(".Game_Cards"),
  wrong: document.querySelector(".Game_Player_Header_Wrongs_Wrong"),
  NamePlayer: document.querySelector(".Game_Player_Header_Names_Name"),
  musicPlay: document.querySelector(".play"),
  musicStop: document.querySelector(".stop"),
  audio: document.querySelector("audio"),
  winDisplay: document.querySelector(".win"),
  winAudio: document.querySelector(".win-audio"),
  replayGame: document.querySelector(".replay"),
  time: document.querySelector(".time"),
  overDisplay: document.querySelector(".over"),
  controleButtons: document.querySelector(".controle-buttons"),
};

let elementRefernce = Object.create(element);

const {
  cards,
  containerCards,
  wrong,
  NamePlayer,
  musicPlay,
  musicStop,
  audio,
  winDisplay,
  winAudio,
  replayGame,
  time,
  overDisplay,
  controleButtons,

} = elementRefernce;

// Event listeners
musicPlay.addEventListener("click", play);
musicStop.addEventListener("click", pause);
replayGame.addEventListener("click", replay);
controleButtons.addEventListener("click", () => {
  startGame();
});

// Variables
let timeCounter = 0;
let GameOver;
let clickWong = 0;
let click = [];
let listTueCards = [];

// Functions
function startGame() {
  hideElement();
  enterPlayerName();
  startTimer();
  initializeCards();
}

function enterPlayerName() {
  let FullName = prompt("Give Me Your Full-Name");
  NamePlayer.textContent = FullName ? FullName : "Unknown";
}

function startTimer() {
  GameOver = setInterval(updateTimer, 1000);
}

function updateTimer() {
  timeCounter++;
  if (timeCounter < 10) {
    time.textContent = `00:0${timeCounter}`;
  } else if (timeCounter >= 10 && timeCounter < 60) {
    time.textContent = `00:${timeCounter}`;
  } else {
    endGameOver();
  }
}

function initializeCards() {
  let listCards = shuffle(Array.from(cards));
  listCards.forEach((element) => {
    flipCard(element, true);
    setTimeout(() => flipCard(element, false), 3000);
    element.addEventListener("click", (e) => handleCardClick(e));
    containerCards.appendChild(element);
  });
}

function flipCard(e, isFlipped = true) {
  e.style = style(isFlipped ? "180deg" : "0deg");
}

function handleCardClick(e) {
  e.target.parentElement.style = style("180deg");
  let cardData =
    e.target.parentElement.firstElementChild.firstElementChild.getAttribute(
      "data",
    );
  click.push(cardData);
  if (click.length === 2) {
    if (click[0] !== click[1]) {
      clickWong++;
      wrong.textContent = clickWong;
      handleWrongGuess();

      click = [];
    } else {
      handleCorrectGuess(click);
      click = [];
    }
  }
}

function handleCorrectGuess() {
  listTueCards.push(...click.slice(0, 2));
  if (cards.length == listTueCards.length) {
    endGameWin();
  }
}

function handleWrongGuess() {
  cards.forEach((e) => {
    if (
      click.includes(e.firstElementChild.firstElementChild.getAttribute("data"))
    ) {
      setTimeout(() => flipCard(e, false), 1000);
    }
  });
}

function endGameOver() {
  overDisplay.style = "display: block;";
  cards.forEach((e) => {
    e.style = "cursor: no-drop";
  });
}

function endGameWin() {
  winDisplay.style = "display: block;";
  clearInterval(GameOver);
  audio.pause();
  winAudio.play();
}

function play() {
  audio.play();
}

function pause() {
  audio.pause();
}

function replay() {
  location.reload(true);
}

function style(retateValue) {
  return `transform: rotateY(${retateValue}); transition: 0.5s;`;
}

function hideElement() {
  controleButtons.style = "display: none";
}

function shuffle(listCards) {
  let currentIndex = listCards.length,
    temporaryValue,
    randomIndex;

  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = listCards[currentIndex];
    listCards[currentIndex] = listCards[randomIndex];
    listCards[randomIndex] = temporaryValue;
  }
  return listCards;
}
