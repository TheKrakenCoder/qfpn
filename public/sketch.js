var m_socket;
var m_initButton, m_nameInputButton, m_initialPlayer;
var m_players = [];  
let m_thisPlayer = null;
var m_initialized = false;
var m_mySocketId;
var m_messageP, m_oldMessage = "&nbsp";
var m_colors = ['#000000', '#FF0000', '#55AA55', '#0000FF'];
var m_colorNum = 0;
let m_s = 1.0;
let m_cardBackImage, m_cardImages= [], m_starFieldImage;
let m_backgroundImage, m_tableImage;
let m_playerImages = [];
let m_playCardsUnshuffled = [], m_taskCardsUnshuffled = [];  // Card objects
let m_playDeck, m_taskDeck;  // Deck object
let m_decks = [];  // Decks
let m_cardsUnshuffled = [];  // each element is a Card[]
const DECK_PLAY = 0, DECK_TASK = 1;  // index into m_decks and m_cardsUnshuffled
var m_debugDeck=-1;
let m_cw = 100, m_ch = 150;
let m_bw = 50, m_bh = 50;
let m_allButtons = [];
const COMM_NONE = 0, COMM_TOP =1, COMM_MID = 2, COMM_BOT = 3, COMM_UNK = 4;
let m_trickCards = [];  // Cards
let m_taskCards = [];   // Cards
let m_standalone = false;
const TASK_NONE = 0, TASK_1 = 1, TASK_2 = 2, TASK_3 = 3, TASK_4 = 4, TASK_5 = 5, Task_LAST = 6,
      TASK_G = 7, TASK_GG = 8, TASK_GGG = 9, TASK_GGGG = 10, TASK_COMPLETE = 11;
let m_taskMarkers = [' ', '1', '2', '3', '4', '5', 'Ω', '>', '>>', '>>>', '>>>>', '✅'];
let m_distress = false;



function preload() {
  // let suits = ['clubs', 'hearts', 'spades', 'diamonds'];
  // for (let i = 0; i < suits.length; i++) {
  //   m_cardImages.push(loadImage('Assets/' + 'ace_of_' + suits[i] + '.png'));
  //   for (let j = 2; j <= 9; j++) {
  //     m_cardImages.push(loadImage('Assets/' + j + '_of_' + suits[i] + '.png'));
  //   }
  // }
  let suits = ['blue', 'green', 'pink', 'yellow'];
  for (let i = 0; i < suits.length; i++) {
    for (let j = 1; j <= 9; j++) {
      m_cardImages.push(loadImage('Assets/' + suits[i] + j + '.jpg'));
    }
  }
  for (let i = 1; i <= 4; i++) m_cardImages.push(loadImage('Assets/' + 'rocket' + i + '.jpg'));
  m_cardBackImage = loadImage('Assets/cardBack.jpg')
  m_starFieldImage = loadImage('Assets/starField.jpg')
  m_backgroundImage = loadImage('Assets/tableBackground.jpg');
  m_tableImage = loadImage('Assets/feltRed.jpg');

  // load player images
  m_playerImages['john'] = loadImage('Assets/picJohn.jpg');
  m_playerImages['ron'] = loadImage('Assets/picRon.jpg');
  m_playerImages['bob'] = loadImage('Assets/picBob.jpg');
  m_playerImages['daveb'] = loadImage('Assets/picDaveB.jpg');
  m_playerImages['daveh'] = loadImage('Assets/picDaveH.jpg');
  m_playerImages['flash'] = loadImage('Assets/picFlash.jpg');
  m_playerImages['amanda'] = loadImage('Assets/picAmanda.jpg');
  m_playerImages['amelia'] = loadImage('Assets/picAmelia.jpg');
  m_playerImages['charlie'] = loadImage('Assets/picCharlie.jpg');
  m_playerImages['cyndi'] = loadImage('Assets/picCyndi.jpg');
  m_playerImages['danny'] = loadImage('Assets/picDanny.jpg');
  m_playerImages['jake'] = loadImage('Assets/picJake.jpg');
  m_playerImages['jessica'] = loadImage('Assets/picJessica.jpg');
  m_playerImages['joe'] = loadImage('Assets/picJoe.jpg');
  // m_playerImages['john'] = loadImage('Assets/picJohn.jpg');
  m_playerImages['justin'] = loadImage('Assets/picJustin.jpg');
  m_playerImages['liz'] = loadImage('Assets/picLiz.jpg');
  m_playerImages['lou'] = loadImage('Assets/picLou.jpg');
  m_playerImages['matt'] = loadImage('Assets/picMatt.jpg');
  m_playerImages['matthew'] = loadImage('Assets/picMatthew.jpg');
  m_playerImages['melissa'] = loadImage('Assets/picMelissa.jpg');
  m_playerImages['micaela'] = loadImage('Assets/picMicaela.jpg');
  m_playerImages['michael'] = loadImage('Assets/picMichael.jpg');
  m_playerImages['rebecca'] = loadImage('Assets/picRebecca.jpg');
  m_playerImages['steffanie'] = loadImage('Assets/picSteffanie.jpg');
  m_playerImages['steve'] = loadImage('Assets/picSteve.jpg');
  m_playerImages['steven'] = loadImage('Assets/picSteven.jpg');
}

function setup() {
  createCanvas(1600, 900);

  /////////////////////////////////////////////
  // Create decks and Cards
  /////////////////////////////////////////////
  // for (i = 0; i < m_cardImages.length; i++) {
  //   m_playCardsUnshuffled.push(new Card(i, DECK_PLAY));
  //   m_taskCardsUnshuffled.push(new Card(i, DECK_TASK));
  // }
  let cnt = 0;
  for (let i = 1; i <= 4; i++) {
    // // aces
    // m_playCardsUnshuffled.push(new Card(cnt, DECK_PLAY, i, 1));
    // m_taskCardsUnshuffled.push(new Card(cnt++, DECK_PLAY, i, 1));
    // 1 thru 9
    for (let j = 1; j <= 9; j++) {
      m_playCardsUnshuffled.push(new Card(cnt, DECK_PLAY, i, j));
      m_taskCardsUnshuffled.push(new Card(cnt++, DECK_TASK, i, j));
    }
  }
  // rocket cards
  for (let j = 1; j <= 4; j++) m_playCardsUnshuffled.push(new Card(cnt++, DECK_PLAY, 5, j));

  m_cardsUnshuffled[DECK_PLAY] = m_playCardsUnshuffled;
  m_cardsUnshuffled[DECK_TASK] = m_taskCardsUnshuffled;

  m_playDeck = new Deck(DECK_PLAY, 100, 150);
  m_taskDeck = new Deck(DECK_TASK, 100, 150);

  // We don't need to add Cards, because the shuffle will take care of that
  m_playDeck.shuffle();
  m_taskDeck.shuffle();

  m_decks.push(m_playDeck);
  m_decks.push(m_taskDeck);

  console.log('m_decks[0].cards.length = ' , m_decks[0].cards.length);
  
  /////////////////////////////////////////////
  // GUI
  /////////////////////////////////////////////
  // Temporary Buttons

  // Init Button
  // m_initButton = createButton('Init: Enter Name');
  // m_initButton.mousePressed(initPlayerToServer);
  m_initButton = createSpan('Type Name and hit Enter');
  m_nameInputButton = createInput();
  m_nameInputButton.changed(initPlayerToServer);

  //////////////////////////////////////////////
  // Permanent buttons on top of canvas
  //////////////////////////////////////////////

  let buttonNewHand = createNormalButton2("New Hand", 1500, 0, m_bw, m_bh);
  buttonNewHand.mousePressed(newHand);

  // let buttonP0 = createNormalButton2("P0", 1500, 50, m_bw, m_bh);
  // buttonP0.mousePressed(() => {    m_thisPlayer = m_players[0];  });
  // let buttonP1 = createNormalButton2("P1", 1550, 50, m_bw, m_bh);
  // buttonP1.mousePressed(() => {    m_thisPlayer = m_players[1];  });
  // let buttonP2 = createNormalButton2("P2", 1500, 100, m_bw, m_bh);
  // buttonP2.mousePressed(() => {    m_thisPlayer = m_players[2];  });
  // let buttonP3 = createNormalButton2("P3", 1550, 100, m_bw, m_bh);
  // buttonP3.mousePressed(() => {    m_thisPlayer = m_players[3];  });
  let buttonSelectRandom = createNormalButton2("Sel Rand", 1500, 600, m_bw, m_bh);
  buttonSelectRandom.mousePressed(selectRandomCardForEachPlayer);
  let buttonShiftLeft = createNormalButton2("Shft Left", 1500, 650, m_bw, m_bh);
  buttonShiftLeft.mousePressed(shiftLeft);
  let buttonShiftRight = createNormalButton2("Shft Right", 1550, 650, m_bw, m_bh);
  buttonShiftRight.mousePressed(shiftRight);
  // buttonShiftLeft.mousePressed(function(){    shiftCards(1);  });

  let buttonCommNon = createNormalButton2("Comm None", 1500, 750, m_bw, m_bh);
  buttonCommNon.mousePressed(function(){    setComm(COMM_NONE); m_thisPlayer.usedCommunication = false; update(); });
  buttonCommNon.style('padding', '5px 0px');
  let buttonCommTop = createNormalButton2("Comm High", 1500, 800, m_bw, m_bh);
  buttonCommTop.mousePressed(function(){    setComm(COMM_TOP);  m_thisPlayer.usedCommunication = true; update(); });
  buttonCommTop.style('padding', '5px 0px');
  let buttonCommMid = createNormalButton2("Comm Only", 1550, 800, m_bw, m_bh);
  buttonCommMid.mousePressed(function(){    setComm(COMM_MID);  m_thisPlayer.usedCommunication = true; update(); });
  buttonCommMid.style('padding', '5px 0px');
  let buttonCommBot = createNormalButton2("Comm Low", 1500, 850, m_bw, m_bh);
  buttonCommBot.mousePressed(function(){    setComm(COMM_BOT);  m_thisPlayer.usedCommunication = true; update(); });
  buttonCommBot.style('padding', '5px 0px');
  let buttonCommUnk = createNormalButton2("Comm Unk", 1550, 850, m_bw, m_bh);
  buttonCommUnk.mousePressed(function(){    setComm(COMM_UNK);  m_thisPlayer.usedCommunication = true; update(); });
  buttonCommUnk.style('padding', '5px 0px');

  let buttonCommander = createNormalButton2("Cmdr", 1500, 50, m_bw, m_bh);
  buttonCommander.mousePressed(function(){ m_thisPlayer.isCommander = !m_thisPlayer.isCommander; update() });
  let buttonDistress = createNormalButton2("Dis tress", 1550, 50, m_bw, m_bh);
  buttonDistress.mousePressed(function(){ m_distress = !m_distress; update() });

  let buttonTakeTask = createNormalButton2("Take Task", 350, 675, m_bw, m_bh);
  buttonTakeTask.mousePressed(takeTaskCard);

  let buttonPlayCard = createNormalButton2("Play Card", 700, 675, m_bw, m_bh);
  buttonPlayCard.mousePressed(playSelectedCard);

  let buttonUnplayCard = createNormalButton2("Unplay Card", 800, 675, m_bw, m_bh);
  buttonUnplayCard.mousePressed(unplaySelectedCard);
  buttonUnplayCard.style('padding', '5px 0px');

  let buttonTakeTrick = createNormalButton2("Take Trick", 1050, 675, m_bw, m_bh);
  buttonTakeTrick.mousePressed(takeTrick);

  let buttonDealTaskCard = createNormalButton2("Deal Task", 1500, 200, m_bw, m_bh);
  buttonDealTaskCard.mousePressed(dealTaskCard);
  let buttonMarkTaskCardNone = createNormalButton2("none", 1550, 200, m_bw, m_bh);
  buttonMarkTaskCardNone.mousePressed(function(){ markTaskCard(TASK_NONE); } );
  let buttonMarkTaskCard1 = createNormalButton2("1", 1500, 250, m_bw, m_bh);
  buttonMarkTaskCard1.mousePressed(function(){ markTaskCard(TASK_1); } );
  let buttonMarkTaskCard2 = createNormalButton2("2", 1550, 250, m_bw, m_bh);
  buttonMarkTaskCard2.mousePressed(function(){ markTaskCard(TASK_2); } );
  let buttonMarkTaskCard3 = createNormalButton2("3", 1500, 300, m_bw, m_bh);
  buttonMarkTaskCard3.mousePressed(function(){ markTaskCard(TASK_3); } );
  let buttonMarkTaskCard4 = createNormalButton2("4", 1550, 300, m_bw, m_bh);
  buttonMarkTaskCard4.mousePressed(function(){ markTaskCard(TASK_4); } );
  let buttonMarkTaskCard5 = createNormalButton2("5", 1500, 350, m_bw, m_bh);
  buttonMarkTaskCard5.mousePressed(function(){ markTaskCard(TASK_5); } );
  let buttonMarkTaskCardLast = createNormalButton2("Ω", 1550, 350, m_bw, m_bh);
  buttonMarkTaskCardLast.mousePressed(function(){ markTaskCard(Task_LAST); } );
  let buttonMarkTaskCardG = createNormalButton2(">", 1500, 400, m_bw, m_bh);
  buttonMarkTaskCardG.mousePressed(function(){ markTaskCard(TASK_G); } );
  let buttonMarkTaskCardGG = createNormalButton2(">>", 1550, 400, m_bw, m_bh);
  buttonMarkTaskCardGG.mousePressed(function(){ markTaskCard(TASK_GG); } );
  let buttonMarkTaskCardGGG = createNormalButton2(">>>", 1500, 450, m_bw, m_bh);
  buttonMarkTaskCardGGG.mousePressed(function(){ markTaskCard(TASK_GGG); } );
  let buttonMarkTaskCardGGGG = createNormalButton2(">>>>", 1550, 450, m_bw, m_bh);
  buttonMarkTaskCardGGGG.mousePressed(function(){ markTaskCard(TASK_GGGG); } );
  let buttonMarkTaskCardComplete = createNormalButton2("✅", 1500, 500, m_bw, m_bh);
  buttonMarkTaskCardComplete.mousePressed(function(){ markTaskCard(TASK_COMPLETE); } );
  // buttonMarkTaskCardComplete.mousePressed(function(){ markTaskCardComplete(TASK_COMPLETE); } );

  // Below canvas
  m_messageP = createDiv('Message here');

  /////////////////////////////////////////////
  // Network communication
  /////////////////////////////////////////////
  
  // socket
  m_socket = io();
  console.log('m_socket = ' , m_socket);
  

  // For Standalone play, we don't need a socket connection and we don't even have a server running.
  if (m_socket) {

    // initPlayer message //
    // After the sketch sends the 'start' message, by pressing the Init button, the server responds with the 'initPlayer' message.
    // By the time this gets called, we should have our m_socket.id and this m_players[0].socketId
    // data: a single Player, and it should be ourselves
    m_socket.on('initPlayer', function(data) {
      console.log('initPlayer message: We got ' , data);
      // Only the player who sent the start message to the server wants to process
      // the initPlayer message
      if (m_mySocketId === data.socketId) {
        console.log('initPlayer message: found player');
        m_initialPlayer.copyFromServerData(data);
        m_players.push(m_initialPlayer);
        m_initialized = true;
        m_initButton.hide();
        m_nameInputButton.hide();
      } else {
        console.log('initPlayer message: This message intended for another player');
      }

    });

    // heartbeat message //
    // data: object containing a Player array and a Table
    m_socket.on('heartbeat', function(data) {
      if (!m_initialPlayer) return;
      console.log('heartbeat message: We got ' , data);
      createPlayersFromServerData(data.players);
      setMessageFromServerData(data.message);
      createDecksFromServerData(data.decks);
      createTrickCardsFromServerData(data.trickCards);
      createTaskCardsFromServerData(data.taskCards);
      m_distress = data.distress
      // m_firewood = data.firewood;
      // m_isOpenSeason = data.isOpenSeason;
      // m_difficulty = data.difficulty;

      // // Note I wasn't able to pass in m_discards into the function here and fill it in 
      // // using the function argument.  I had to directly specify m_discards in the function.
      // // This is probably because I keep changing what m_discards is.
      // // createCardArrayFromServerData(data.discards, m_discards);
    });
 }

}

////////////////////////////////////////////
// NETWORK FUNCTIONS
////////////////////////////////////////////

// called when user presses the Init button
function initPlayerToServer() {
  if (m_nameInputButton.value().length <= 0) {
    // m_messageP.style('color', '#000000');
    m_messageP.html("Enter a real name, buddy");
    return;
  }

  ///////////////////////////////////////
  // For solo play there should be 4 numbers indicating which classes to play
  let name = m_nameInputButton.value();
  if (name.startsWith('SA')) {
  // if (name.length > 0) {
    m_standalone = true;
    const result = name.slice('SA'.length);
    console.log('result = ' , result);
    let names = result.trim().split(/\s+/);
    console.log('names = ' , names);
    
    // if (classes.length != 4) {
    //   m_messageP.html("You have to enter exactly 4 integers after the string STANDALONE");
    //   return;
    // }
    for (let i = 0; i < names.length; i++) {
      m_players[i] = new Player(i, names[i]);
    }
    m_thisPlayer = m_players[0];
    m_initialized = true;
    // m_socket.close();

    m_initButton.hide();
    m_nameInputButton.hide();
    // m_classRadio.hide();

    return;
  }

  ///////////////////////////////////////
  // Regular internet play
  console.log("INITPLAYER");
  m_initialPlayer = new Player(-1, m_nameInputButton.value());
  // m_initialPlayer.dealer = true;
  m_initialPlayer.socketId = '/#' + m_socket.id; 
  m_thisPlayer = m_initialPlayer;
  m_socket.emit('start', m_initialPlayer);
}  // initPlayerToServer()

// called when we get a heartbeat from the server
// data: array of Player objects
function createPlayersFromServerData(data) {
  console.log('player data = ' , data);
  
  let playersTemp = [];
  for (p of data) {
    let player = new Player(p.seatPos, p.name);
    player.copyFromServerData(p);
    playersTemp.push(player);
  }
  // sort the array by seatPos, so advancing and changing dealer (next hand) work properlu
  // javascript sort converts to strings first, so returning a.seatPos - b.seatPos correctly sorts numbers
  // playersTemp.sort((a, b) => {return a.seatPos > b.seatPos});
  playersTemp.sort((a, b) => {return a.seatPos - b.seatPos});
  m_players = playersTemp;

}  // createPlayersFromServerData()

// data: String
function setMessageFromServerData(data) {
  // m_messageP.style('background-color', 'FF0000');
  if (m_oldMessage != data) {
    m_oldMessage = data;
    m_colorNum++;
    if (m_colorNum >= m_colors.length) m_colorNum = 0;
  }
  m_messageP.style('color', m_colors[m_colorNum]);
  m_messageP.html(data);
}  //setMessageFromServerData()

// data: array of Deck objects
function createDecksFromServerData(data) {
  console.log('deck data = ' , data);
  // this line prevents us from overwriting our decks when we first come up and the server
  // doesn't have any decks yet.  This messes things up for the first person and subsequently everyone
  // has no decks.
  if (data.length == 0) return;

  let decksTemp = [];
  for (d of data) {
    let deck = new Deck();
    deck.copyFromServerData(d);
    decksTemp.push(deck);
  }
  m_decks = decksTemp;

}  // createDeckFromServerData()

// data: array of Cards
function createTrickCardsFromServerData(data) {
  let tricksTemp = [];

  for (c of data) {
    let card = new Card();
    card.copyFromServerData(c);
    tricksTemp.push(card);
  }
  m_trickCards = tricksTemp;

}

// data: array of Cards
function createTaskCardsFromServerData(data) {
  let tasksTemp = [];

  for (c of data) {
    let card = new Card();
    card.copyFromServerData(c);
    tasksTemp.push(card);
  }
  m_taskCards = tasksTemp;

}

function setGlobalsFromPlayerInfo() {
  m_thisPlayer = m_players.find(plr => plr.socketId === m_mySocketId);
  // I really should not use m_taskDeck and m_playDeck, but only use the m_decks array
  m_taskDeck = m_decks[DECK_TASK];
  m_playDeck = m_decks[DECK_PLAY];
}

// emit all the players and the table to the server
function update() {
  if (m_initialized && m_socket) {
    let msg = m_messageP.html();
    let data = {
      players: m_players,
      message: msg,
      decks: m_decks,
      trickCards: m_trickCards,
      taskCards: m_taskCards,
      distress: m_distress,
      // shipTokens: m_shipTokens,
      // numSandLeft: m_numSandLeft,
    };
    m_socket.emit('update', data);
  }
}

////////////////////////////////////////////
// GUI
////////////////////////////////////////////

function createNormalButton2(name, x, y, w, h) {
  let button = createButton(name);
    button.style('width',  w+'px');
    button.style('height', h+'px');
    button.position(x, y);
    button.style('font-size', '16px');
    button.style('background-color', "#F0F0F0")
    button.style('borderRadius', "8px");
    button.mouseOver(() => button.style('background-color', 'lightblue'));
    button.mouseOut(() => button.style('background-color', '#F0F0F0'));
    // button.style('box-shadow', '3px 3px 8px rgba(0, 0, 0, 0.3)');
    m_allButtons.push(new Button(button, x, y, w, h));
    return button;
}  // createNormalButton()

////////////////////////////////////////////
// Game Play
////////////////////////////////////////////
function mousePressed() {
  console.log('mousePressed ', mouseX, mouseY);
  if (mouseX > 1500*m_s) return;
  if (!m_thisPlayer) return;

  // We only want one card selected at a time, for player cards, task cardss and player task cards.

  let changedState = false;

  // Player cards can overlap, and we only want the last one checked to be (un)selected.
  // Player cards are thus more complicated than task cards.
  // Find the currently selected card, if any.
  // Loop thru all cards, turning them off and saving the last card that was clicked on .
  // If we clicked on a card, turn it on, assuming it wasn't the currently selected card
  // which we turned off already, since we turn off every card
  let currentlySelectedCard = null;
  let foundCard = null;
  for (let card of m_thisPlayer.cards) if (card.selected) currentlySelectedCard = card;
  for (let card of m_thisPlayer.cards) {
    card.selected = false;
    if (mouseX > card.x && mouseX < card.x+m_cw && mouseY > card.y && mouseY < card.y+m_ch) {
      foundCard = card;
    }
  }
  if (foundCard) {
    changedState = true;
    if (foundCard != currentlySelectedCard) {
      foundCard.selected = true;
    }
  } else {
    if (currentlySelectedCard) changedState = true;  // because we will have turned off any currently selected card
  }


  for (let card of m_taskCards) {
    if (mouseX > card.x && mouseX < card.x+m_cw && mouseY > card.y && mouseY < card.y+m_ch) {
      changedState = true;
      card.selected = !card.selected;
    } else {
      if (card.selected) {
        card.selected = false;
        changedState = true;
      } 
    }
  } 

  for (let card of m_thisPlayer.taskCards) {
    if (mouseX > card.x && mouseX < card.x+m_cw && mouseY > card.y && mouseY < card.y+m_ch) {
      changedState = true;
      card.selected = !card.selected;
    } else {
      if (card.selected) {
        card.selected = false;
        changedState = true;
      } 
    }
  } 

  if (changedState) update();

  // // This code allowed multiple cards to be selected at the same time.

  // // check this player's cards
  // let foundCard = null;
  // for (let card of m_thisPlayer.cards) {
  //   if (mouseX > card.x && mouseX < card.x+m_cw && mouseY > card.y && mouseY < card.y+m_ch) {
  //     foundCard = card;
  //   }
  // }
  // // let foundTableTaskCard = false;
  // for (let card of m_taskCards) {
  //   if (mouseX > card.x && mouseX < card.x+m_cw && mouseY > card.y && mouseY < card.y+m_ch) {
  //     foundCard = card;
  //     // foundTableTaskCard = true;
  //   }
  // }
  // for (let card of m_thisPlayer.taskCards) {
  //   if (mouseX > card.x && mouseX < card.x+m_cw && mouseY > card.y && mouseY < card.y+m_ch) {
  //     foundCard = card;
  //   }
  // }

  // if (foundCard) foundCard.selected = !foundCard.selected;
  // if (foundCard) update();
  // // if (foundTableTaskCard) update();

  // // if we didn't click on a card, deselect all cards
  // if (!foundCard) {
  //   const sel1 = m_thisPlayer.cards.filter(card => card.selected == true);
  //   if (sel1.length > 0) for (let card of m_thisPlayer.cards) card.selected = false; 

  //   const sel2 = m_taskCards.filter(card => card.selected == true);
  //   if (sel2.length > 0) for (let card of m_taskCards) card.selected = false; 

  //   const sel3 = m_thisPlayer.taskCards.filter(card => card.selected == true);
  //   if (sel3.length > 0) for (let card of m_thisPlayer.taskCards) card.selected = false; 

  //   if (sel1 || sel2 || sel3) update();
  // }

}

function newHand() {
   for (plr of m_players) plr.reset();
   for (deck of m_decks) {
     deck.reset();
     deck.shuffle();
   }
   m_trickCards = [];
   m_taskCards = [];
   m_distress = false;

   // start dealing with the player to the dealers left
   let player = (m_thisPlayer.seatPos + 1)%m_players.length;
  //  console.log('player = ' , player);
   
   let ldone = false;
   while (m_decks[DECK_PLAY].cards.length > 0 && !ldone) {
     let crd = m_decks[DECK_PLAY].dealCard();
     if (crd) {
      //  m_players[player].cards.push(crd);
       m_players[player].addCard(crd);
       if (m_players[player].cards.length >= 14) ldone = true;
       player++;
       if (player > m_players.length-1) player = 0;
     }
   }

   for (let player of m_players) {
     player.cards.sort((a,b) => (a.color-b.color || a.value-b.value));
   }

   update();
}

function setComm(status) {
  for (let card of m_thisPlayer.cards) {
    if (card.commStatus != COMM_NONE && card.selected == false) {
      m_messageP.html('You already have a communication card.');
      card.selected = false;
      update();
      return;
    }
  }
  for (let card of m_thisPlayer.cards) {
    if (card.selected) {
      card.commStatus = status;
      card.selected = false;
      update();
      break;
    }
  }
}

function selectRandomCardForEachPlayer() {
  for (let player of m_players) {
    for (let card of player.cards) card.selected = false;
    let num = floor(random(player.cards.length));
    player.cards[num].selected = true;
  }
  update();
}

function shiftLeft() {
  for (let player of m_players) {
    let cards = player.cards.filter(card => card.selected == true);
    if (cards.length != 1) {
      m_messageP.html('Each player must select exactly one task card to shift');
      update();
      return;
    }
  }
  for (let i = 0; i < m_players.length; i++) {
    let nextPlayer = (i+1)%m_players.length;
    let selected = m_players[i].cards.filter(card => card.selected == true);
    const index = m_players[i].cards.indexOf(selected[0]);
    let removed = m_players[i].cards.splice(index, 1);
    removed[0].selected = false;
    m_players[nextPlayer].addCard(removed[0]);
  }
  for (let player of m_players) {
    player.cards.sort((a,b) => (a.color-b.color || a.value-b.value));
  }
  update();
}

function shiftRight() {
  for (let player of m_players) {
    let cards = player.cards.filter(card => card.selected == true);
    if (cards.length != 1) {
      m_messageP.html('Each player must select exactly one task card to shift');
      update();
      return;
    }
  }
  for (let i = 0; i < m_players.length; i++) {
    let nextPlayer = (i-1);
    if (nextPlayer < 0) nextPlayer += m_players.length;
    let selected = m_players[i].cards.filter(card => card.selected == true);
    const index = m_players[i].cards.indexOf(selected[0]);
    let removed = m_players[i].cards.splice(index, 1);
    removed[0].selected = false;
    m_players[nextPlayer].addCard(removed[0]);
  }
  for (let player of m_players) {
    player.cards.sort((a,b) => (a.color-b.color || a.value-b.value));
  }
  update();
}

function takeTaskCard() {
  let cards = m_taskCards.filter(card => card.selected == true) 
  if (cards.length != 1) {
    m_messageP.html('You must select exactly one task card to take');
    update();
    return;
  }
  const index = m_taskCards.indexOf(cards[0]);
  tasks = m_taskCards.splice(index, 1);
  tasks[0].selected = false;
  m_thisPlayer.addTaskCard(tasks[0]);
  update();

}

function playSelectedCard() {
  for (let card of m_thisPlayer.cards) {
    if (card.played) {
      m_messageP.html('You have already played a card.');
      card.selected = false;
      update();
      return;
    }
  }
  for (let card of m_thisPlayer.cards) {
    if (card.selected) {
      card.played = true;
      card.selected = false;
      update();
      break;
    }
  }
}


function unplaySelectedCard() {
  // for (let card of m_thisPlayer.cards) {
  //   if (card.played) {
  //     m_messageP.html('You have already played a card.');
  //     card.selected = false;
  //     update();
  //     return;
  //   }
  // }
  for (let card of m_thisPlayer.cards) {
    if (card.played) {
      card.played = false;
      card.selected = false;
      update();
      break;
    }
  }
}

function takeTrick() {
  let numCards = 0;
  for (let player of m_players) {
    for (let card of player.cards) {
      if (card.played) numCards++;
    }
  }
  if (numCards != m_players.length) {
    m_messageP.html('Each player must play one card');
    update();
    return;
  }
  for (let player of m_players) {
    player.tookLastTrick = false;
    for (let c = 0; c < player.cards.length; c++) {
      if (player.cards[c].played) {
        let cards = player.cards.splice(c, 1);
        m_trickCards.push(cards[0]);
        break;
      }
    }
  }
  m_thisPlayer.tookLastTrick = true;
  update();

}

function dealTaskCard() {
  let card = m_taskDeck.dealCard();
  if (card) {
    m_taskCards.push(card);
    update();
  }
}

// ts: task status integer
function markTaskCard(ts) {
  let cards = m_taskCards.filter(card => card.selected == true) 
  let cards2 = m_thisPlayer.taskCards.filter(card => card.selected == true) 
  if ((cards.length + cards2.length) != 1) {
    m_messageP.html('You must select exactly one task card to mark');
    update();
    return;
  }

  if (cards.length > 0) {
    cards[0].taskStatus = ts;
    cards[0].selected = false;
  }
  if (cards2.length > 0) {
    cards2[0].taskStatus = ts;
    cards2[0].selected = false;
  }
  update();
}

// // ts: task status integer
// function markTaskCard(ts) {
//   let cards = m_taskCards.filter(card => card.selected == true) 
//   if (cards.length != 1) {
//     m_messageP.html('You must select exactly one task card on the table to mark');
//     update();
//     return;
//   }
//   cards[0].taskStatus = ts;
//   cards[0].selected = false;
//   update();
// }
// // ts: task status integer
// function markTaskCardComplete(ts) {
//   let cards = m_thisPlayer.taskCards.filter(card => card.selected == true) 
//   if (cards.length != 1) {
//     m_messageP.html('You must select exactly one of your task cards to complete');
//     update();
//     return;
//   }
//   cards[0].taskStatus = ts;
//   cards[0].selected = false;
//   update();
// }

////////////////////////////////////////////
// Draw
////////////////////////////////////////////

function draw() {
  // The m_socket doesn't get an actual ID until after we are out of setup();
  // Hopefully by the time we receive our first message from the socket, we
  // have executed the lie of code below
  // m_players[0].socketId = '/#' + m_socket.id;
  if (m_standalone == false) {
    m_mySocketId = '/#' + m_socket.id;
    if (m_players.length > 0) setGlobalsFromPlayerInfo();
  }
  
  // background(220);
  image(m_backgroundImage, 0, 0, width, height);
  image(m_tableImage, 510*m_s, 260*m_s, 480*m_s, 380*m_s);

  for (p of m_players) {
    p.show();
  }

  for (let i = 0; i < m_taskCards.length; i++) {
    let x = 500*m_s + (i%5)*m_cw;
    let y = 250*m_s;
    if (i >= 5) y += m_ch;
    let card = m_taskCards[i];
    card.x = x;
    card.y = y;
    card.show();

  }

  if (m_debugDeck != -1) debugDrawDeck(m_debugDeck);


}

function windowResized() {
  // if (true) {
  // if (windowWidth >= 1600 && windowHeight>= 900) {
    let oldms = m_s;
    let newW, newH;
    let xScale = windowWidth/1600;
    let yScale = windowHeight/900;
    if (xScale <= yScale) {
      newW = windowWidth;
      newH = windowWidth*(900/1600);
      m_s = windowWidth/1600;
    } else {
      newH = windowHeight;
      newW = windowHeight*(1600/900);
      m_s = windowHeight/900;
    }

    // // we have to move tokens manually, because they have  x,y positions
    // // set by moving them, which is not based on 1600x900.  We have to remove the old
    // // scale factor and then apply the new scale factor
    // for (let p of m_players) {
    //   p.token.x /= oldms;
    //   p.token.y /= oldms;
    //   p.token.x *= m_s;
    //   p.token.y *= m_s;
    // }

    // // We have to change the deck's card width and card height.  The x and y are
    // // calculated at draw time so they should be ok
    // for (let deck of m_decks) {
    //   deck.cw = deck.cw / oldms * m_s;
    //   deck.ch = deck.ch / oldms * m_s;
    // }

    // for (let tok of m_shipTokens) {
    //   tok.x = tok.x / oldms * m_s;      
    //   tok.y = tok.y / oldms * m_s;      
    // }

    for (let b of m_allButtons) {
      b.btn.size(b.w * m_s, b.h * m_s);
      b.btn.position(b.x * m_s, b.y * m_s);
    }

    // A few remaining variables
    // m_tileSpacing = m_tileSpacing / oldms * m_s;
    // m_tileSize = m_tileSize / oldms * m_s;
    // m_tokenSize = m_tokenSize / oldms * m_s;
    m_cw = m_cw / oldms * m_s;
    m_ch = m_ch / oldms * m_s;
    m_bw = m_bw / oldms * m_s;
    m_bh = m_bh / oldms * m_s;
    // m_meterW = m_meterW / oldms * m_s;
    // m_meterH = m_meterH / oldms * m_s;
    // m_tokenShipSize = m_tokenShipSize / oldms * m_s;

    resizeCanvas(newW, newH);
  // }
}

// I need a separate class that stores all the original informaiton.  I tried using the
// button's stats (x, y, w, h) from button.size() and button.position(), but those are
// integers and I quickly lose precision as I resize the window
class Button {
  constructor(btn, x, y, w, h) {
    this.btn = btn;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }
}

// Setting m_debugSet to soemthing other than -1 causes this function to be called in draw();
function debugDrawDeck(deckIdx) {
  // console.log("debugDrawDeck :", deckIdx);
  let xpos = 0;
  let ypos = -m_ch;
  let deck = m_decks[deckIdx];
  for (let i = 0; i < deck.cards.length; i++) {
    let card = deck.cards[i];
    let idx = card.index;
    if (i % 10 == 0) {xpos = 0; ypos += m_ch}
    image(m_cardImages[idx], xpos, ypos, m_cw, m_ch);
    xpos += m_cw;
  }
}