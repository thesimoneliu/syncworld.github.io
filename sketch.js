let shared;
let buttonErase, buttonKeep, buttonStart, buttonRestart;
let timeLimit = 20;
let a = [1, 2];
let pressed2;
let wOff = 80;
let hOff = 80;

function preload() {
  // establish connection to party server
  partyConnect(
    "wss://deepstream-server-1.herokuapp.com",
    "smliu_sketch_3", // room name: when i wrote 'smliu_sync_letter-final' it didnt sync!!!!
    "main" // app name
  );

  // load the shared object
  shared = partyLoadShared("shared", shared);
  guests = partyLoadGuestShareds("shared", shared);
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  // set/reset shared object properties
  partySetShared(shared, {
    letterTemp: [],
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

  partyToggleInfo(true);

  background(shared.COL.bg);
  noStroke();
  textAlign(CENTER, CENTER);
  textFont("Poppins");
  textSize(100);

  buttonErase = createButton("Erase All");
  buttonKeep = createButton("Keep It");
  buttonStart = createButton("Start");
  buttonRestart = createButton("Restart");
  push();
  buttonErase.position(width / 2 - wOff - 80, height - hOff);
  buttonKeep.position(width / 2 + wOff +30, height - hOff);
  buttonStart.position(width / 2 - wOff, height - hOff);
  buttonRestart.position(width / 2 - wOff, height - hOff);
  pop();

  translate;
  buttonErase.style("width", "100px");
  buttonKeep.style("width", "100px");
  buttonStart.style("width", "100px");
  buttonRestart.style("width", "100px");
  buttonErase.style("height", "30px");
  buttonKeep.style("height", "30px");
  buttonStart.style("height", "30px");
  buttonRestart.style("height", "30px");
  buttonErase.hide();
  buttonKeep.hide();
  buttonStart.hide();
  buttonRestart.hide();
}

function draw() {
  //const ctx = canvas.getContext('2d');

  switch (shared.gameState) {
    case 0: // welcoming page
      clearBG();
      fill(shared.COL.txt);
      if (partyIsHost()) {
        textSize(10);
        text("You are the host", width / 2, 20);
      }
      textSize(80);
      text("click to start", width / 2, height / 2);

      shared.counter = 0;
      shared.counterLast = millis();
      buttonErase.hide();
      buttonKeep.hide();
      buttonStart.show();
      buttonStart;
      buttonStart.mousePressed(gameStateChange);
      buttonRestart.hide();

      break;

    case 1: // playing
      background(shared.COL.bg);

      let col = partyIsHost() ? shared.COL.text1 : shared.COL.text2;
      fill(col);
      // draw the most recent key pressed to the screen
      textAlign(CENTER, CENTER);
      textSize(100);
      text(shared.letterTemp.join(""), shared.posX, shared.posY);
      // draw time to the screen
      textAlign(LEFT, TOP);
      textSize(20);
      fill(shared.COL.txt);
      shared.counter = round((millis() - shared.counterLast) / 1000, 3);
      text(shared.counter, 20, 20);
      //set time limitation
      if (shared.counter > timeLimit) {
        shared.gameState = 2;
      }

      buttonErase.show();
      buttonKeep.show();
      buttonErase.mousePressed(clearBG); // click the button to restart the game
      buttonKeep.mousePressed(addText);
      if (pressed2) {
        text(shared.letterBank.join(""), width / 2, 10);
      }
      buttonStart.hide();
      buttonRestart.hide();

      break;

    case 2: // game over
      background(shared.COL.bg);
      fill(shared.COL.txt);

      textAlign(CENTER, CENTER);
      textSize(20);
      let txt01 = 'Congradulations! Your Group has make ' + shared.letterBank.length + ' words in 20 seconds.';
      text(txt01,width/2,hOff*2)
      let txt02 = 'Here\'s your sentence:';
      text(txt02,width/2,hOff*4)
      textSize(80);
      text(shared.letterBank.join(""), width / 2, height / 2);

      buttonErase.hide();
      buttonKeep.hide();
      buttonStart.hide();
      buttonRestart.show();
      buttonRestart.mousePressed(gameStateChange);
      break;
  }
}

function clearBG() {
  //clear();
  shared.letterTemp = [];
  background(shared.COL.bg);
  //console.log("background cleared",shared.letter);
}

function addText() {
  pressed2 = true;
  fill("black");
  //textFont("Roboto");
  textSize(14);
  textAlign(CENTER, CENTER);
  shared.letterBank.push(shared.letterTemp.join("") + "\n");
  shared.letterTemp = [];
  console.log("new words achieved:", shared.letterTemp);
}

function keyPressed() {
  // add key string to shared.letterTemp array
  if (key.match(/^[a-zA-Z]$/i) || key.match(/^([a-zA-Z0-9]+\s?)*$/)) {
    //keyCode >= 65 && keyCode <= 122
    shared.letterTemp.push(key);
    shared.leng = shared.letterTemp.length;
  } else {
    console.log("nothing");
  }
}

function gameStateChange() {
  return (shared.gameState =
    shared.gameState === 0 ? 1 : shared.gameState === 2 ? 0 : 1);
}
