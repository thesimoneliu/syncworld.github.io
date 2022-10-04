let shared;
// let buttonErase, buttonKeep, buttonStart, buttonRestart;
let timeSec = 20; //time limitation
let a = [1, 2];
let addTextClicked;
let wOff = 75;
let hOff = 120;
let mySound;

function preload() {
	// establish connection to party server
	partyConnect(
		"wss://deepstream-server-1.herokuapp.com",
		"smliu_sync_gam1e", // room name: when i wrote 'smliu_sync_letter-final' it didnt sync!!!!
		"main" // app name
	);

	// load the shared object
	shared = partyLoadShared("shared", shared);
	guests = partyLoadGuestShareds("shared", shared);

  // load sound
  // soundFormats('mp3', 'mav');
  // mySound = loadSound('assets/dream-apart.wav');
}

function setup() {
	createCanvas(windowWidth, windowHeight);

	// set/reset shared object properties
	partySetShared(shared, {
		letterInput: [],
		letterBank: [],
		leng: 0, // word length
		posX: width / 2, //word position
		posY: height / 2,
		COL: {
			bg: "#FCFAF2",
			txt: "#535953",
			text1: "#3F51B5",
			text2: "#FFC107",
		},
		counter: 0, // time counter
		gameState: 0,
	});

	background(shared.COL.bg);
	noStroke();
	textAlign(CENTER, CENTER);
	textFont("Poppins");
	textSize(100);

	partyToggleInfo(true);
	buttonSetup();

  // mySound.play();
}

function draw() {
	//const ctx = canvas.getContext('2d');
	switch (shared.gameState) {
		case 0:
			startScene();
			break;
		case 1:
			playScene();
			break;
		case 2:
			endScene();
			break;
	}
}

/* --------------------------------- Scenes ---------------------------- */

/*Sync Word, Sync World* is a duo game that focuses on building a sentence word by word collaboratively. In this world, two people who are friends can be thinking about different things all the time; two strangers who come from completely different backgrounds can talk non-stop at their first meet. Do you dare to play this game with your intimate friends? Are you curious if there’s a secret bond between you and a stranger? *Sync Word, Sync World* will give you an answer. 
The game is easy and fun to play. With a simple click, players start the game and enter a collaborative canvas. Here, both are free to type letters, no matter if it’s one by one or not. The first goal is to collaborate a word. As long as they feel satisfied with that word, either one can hit the ‘Submit’ button to send the word into the text field for a sentence. Backspace is not allowed during the process, but they can hit ‘Reset’ and clear the current semi-word. 
The ultimate goal is to make the words they collaborate into a sentence. By repeating the single-word-making process, two players will get a sentence at the end of the game within 20 seconds. 
This game currently only supports English. Leave a character, emoji, or message here if you want to see it in other languages! 
*/

function startScene() {
	title = "Sync Word\n Sync World ";
	description =
		" Make a live sentence with the other soul \n Letter by letter ";
	rules =
		"Remember: \n 1. Each letter you typed cannot be backspaced. \n 2. The word will be saved when either of you feel satisfied and choose to keep the world. \n 3. You two need to make your sentence in 20 seconds! ";

	clearBG();
  shared.letterBank = [];

	fill(shared.COL.txt);
	if (partyIsHost()) {
		textSize(10);
		textAlign(CENTER, TOP);
		text("You are the host", width / 2, height - hOff / 2.5);
	}

	textAlign(CENTER, TOP);
	textSize(60);
	textLeading(60);
	text(title, width / 2, height / 3.7);
	textSize(30);
	textLeading(30);
	text(description, width / 2, height / 2.2);
	textAlign(LEFT, TOP);
	textSize(16);
	textLeading(20);
	textWrap(WORD);
	text(rules, width / 3.2, height / 1.5, width / 2.5, height / 6);

	shared.counter = 0;
	shared.counterLast = millis();
	buttonErase.hide();
	buttonKeep.hide();
	buttonStart.show();
	buttonStart.mousePressed(gameStateChange);
	buttonRestart.hide();
	// button45sec.show();
	// button45sec.mousePressed(timeValue(45),gameStateChange);
	// button30sec.show();
	// button30sec.mousePressed(timeValue(30),gameStateChange);
	// button20sec.show();
	// button20sec.mousePressed(timeValue(20),gameStateChange);
}

function playScene() {
	background(shared.COL.bg);

	let col = partyIsHost() ? shared.COL.text1 : shared.COL.text2;
	fill(col);
	// draw the most recent key pressed to the screen
	textAlign(CENTER, CENTER);
	textSize(100);
	text(shared.letterInput.join(""), shared.posX, shared.posY);
	// draw time to the screen

	textSize(20);
	fill(shared.COL.txt);
	shared.counter = round((millis() - shared.counterLast) / 1000, 3);
	textAlign(CENTER, CENTER);
	text(shared.counter, 50, 50);
	noFill();
	stroke(shared.COL.txt);
	ellipse(50, 50, 80);
	//set time limitation
	if (shared.counter > timeSec) {
		shared.gameState = 2;
	}

	//let step = 15;
	// let i = 0;
	if (addTextClicked) {
		textAlign(CENTER, TOP);
		fill(shared.COL.txt);
		noStroke();

    text(shared.letterBank.join(""), width / 2, 20);

		// let txt = shared.letterBank[i];
		// //console.log(shared.letterBank.join(""),shared.letterBank)
		// txt = partyIsHost ? "Host: " + txt : "Guest: " + txt;
		// text(txt, width / 2, 20);
		// // step += 15;
		// if (i < shared.letterBank.length) {
		// 	i++;
		// } else {
		// 	i = 0;
		// }
	}

	buttonErase.show();
	buttonKeep.show();
	buttonErase.mousePressed(clearBG); // click the button to restart the game
	buttonKeep.mousePressed(addText);
	buttonStart.hide();
	buttonRestart.hide();
	button45sec.hide();
	button30sec.hide();
	button20sec.hide();
}

function endScene() {
	background(shared.COL.bg);
	fill(shared.COL.txt);

	textAlign(CENTER, CENTER);
	textSize(20);
	let txt01 =
		"Congratulations! \n Your Group has make " +
		shared.letterBank.length +
		" words into a sentence in 20 seconds.";
	text(txt01, width / 2, hOff * 1.2);
	let txt02 = "Here's your sentence:";
	text(txt02, width / 2, hOff * 1.9);
  
	textSize(50);
  textLeading(50);
  textAlign(LEFT,TOP);
	text(shared.letterBank.join("").replace(/\n/g," "), (width-width/2)/2, height / 3,width / 2,height/2);

	buttonErase.hide();
	buttonKeep.hide();
	buttonStart.hide();
	buttonRestart.show();
	buttonRestart.mousePressed(gameStateChange);
	button45sec.hide();
	button30sec.hide();
	button20sec.hide();
}

/* --------------------------------- Buttons ---------------------------- */

function buttonSetup() {
	//create button
	buttonErase = createButton("Erase the word");
	buttonKeep = createButton("Keep the word");
	buttonStart = createButton("Let's Go!");
	buttonRestart = createButton("Restart");
	button45sec = createButton("45s");
	button30sec = createButton("30s");
	button20sec = createButton("20s");

	//button position
	push();
	buttonErase.position(width / 2 - wOff - 80, height - hOff);
	buttonKeep.position(width / 2 + wOff + 30, height - hOff);
	buttonStart.position(width / 2 - wOff, height - hOff);
	buttonRestart.position(width / 2 - wOff, height - hOff);
	button45sec.position(width / 2 - wOff - 80, height - hOff);
	button30sec.position(width / 2 - wOff + 60, height - hOff);
	button20sec.position(width / 2 + wOff + 40, height - hOff);
	pop();

	//button style
	buttonErase.style("width", "120px");
	buttonErase.style("height", "40px");
	buttonKeep.style("width", "120px");
	buttonKeep.style("height", "40px");
	buttonStart.style("width", "150px");
	buttonStart.style("height", "60px");
	buttonRestart.style("width", "100px");
	buttonRestart.style("height", "30px");
	button45sec.style("width", "100px");
	button45sec.style("height", "30px");
	button30sec.style("width", "100px");
	button30sec.style("height", "30px");
	button20sec.style("width", "100px");
	button20sec.style("height", "30px");

	//button status
	buttonErase.hide();
	buttonKeep.hide();
	buttonStart.hide();
	buttonRestart.hide();
	button45sec.hide();
	button30sec.hide();
	button20sec.hide();
}

/* --------------------------------- Utility ---------------------------- */

function reset() {
	shared.letterInput = [];
}

function clearBG() {
	//clear();
	shared.letterInput = [];
	background(shared.COL.bg);
	//console.log("background cleared",shared.letter);
}

function addText() {
	addTextClicked = true;
	fill("black");
	//textFont("Roboto");
	textSize(14);
	textAlign(CENTER, CENTER);
	shared.letterBank.push(shared.letterInput.join("") + "\n");
	shared.letterInput = [];
	console.log("new words achieved:", shared.letterInput);
}

function keyPressed() {
	// add key string to shared.letterInput array
	// if (key.match(/^[a-zA-Z]$/i) || key.match(/^([a-zA-Z0-9]+\s?)*$/)) {
	if (keyCode >= 65 && keyCode <= 122) {
		shared.letterInput.push(key);
		shared.leng = shared.letterInput.length;
	} else {
		console.log("nothing");
	}
}

function gameStateChange() {
	return (shared.gameState =
		shared.gameState === 0 ? 1 : shared.gameState === 2 ? 0 : 1);
}

function timeLimit(num) {
	timeSec = num;
}
