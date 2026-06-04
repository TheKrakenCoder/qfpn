// Player should have a seatPosition, that never changes.  When a new Player
// comes on board, we (the server) pick the lowest unused seat position.
//         2
//     1       3
//         0
// When we draw the players, we always draw a player at the bottom of the screen
// in seat position 0.  So we draw based on a relative seat position.
class Player {
  constructor(idx, name) {
    // index will end up getting set by the server
    this.socketId = 0;       // string
    this.seatPos = idx;      // integer
    this.name = name;        // string
    this.cards = []; // Card objects
    this.taskCards = []  // Card objects
    this.isCommander = false;
    this.usedCommunication = false;
    this.tookLastTrick = false;
  }  // xtor

  show() {
    let relativeSeatPos = this.seatPos;
    if (!m_thisPlayer) return;
    relativeSeatPos = relativeSeatPos - m_thisPlayer.seatPos;
    if (relativeSeatPos < 0) relativeSeatPos += 4; // m_players.length;

    let name = this.name;
    if (this.isCommander) name += " (C)";

    // player image
    let imgName = this.name.toLowerCase();
    imgName = imgName.replace(/\s/g, '');

    // myself
    if (relativeSeatPos == 0) {
      if (m_distress) name += " (Distress)";
      fill(128), noStroke();
      rect(0, 650*m_s, 1500*m_s, 250*m_s);
      image(m_starFieldImage, 0, 650*m_s, 750*m_s, 250*m_s);
      image(m_starFieldImage, 750*m_s, 650*m_s, 750*m_s, 250*m_s);
      stroke(255), fill(255), textSize(32*m_s);
      text(name, 0, 650*m_s + 32*m_s);
      const nonComms = this.cards.filter(card => card.commStatus == 0 && card.played == false);
      const comms = this.cards.filter(card => card.commStatus != 0 && card.played == false);
      const played = this.cards.filter(card => card.played == true);
      text(nonComms.length, 0, 690*m_s + 32*m_s);
      if (m_playerImages[imgName]) {
        image(m_playerImages[imgName], 150*m_s, 650*m_s, 75*m_s, 75*m_s);
      }
      // if we took thelast trick, outline the image (or where the image would be)
      if (this.tookLastTrick) {
        stroke(0, 255, 0); noFill(), strokeWeight(4);
        rect(150*m_s, 650*m_s, 75*m_s, 75*m_s);
        stroke(255), fill(255), strokeWeight(1);
      }
      // draw whether this player has used communicaiton this round
      if (this.usedCommunication) {fill(255, 0, 0); stroke(255, 0, 0);}
      else                        {fill(0, 255, 0); stroke(0, 255, 0);}
      circle(275*m_s, 700*m_s, 50*m_s);

      // regular cards
      let space = 800*m_s;
      let offset = Math.min(space / nonComms.length, m_cw*m_s);
      // regular
      for (let i = 0; i < nonComms.length; i++) {
        nonComms[i].x = 0*m_s + i*offset; // 125*m_s + i*offset;
        nonComms[i].y = 750*m_s;
        nonComms[i].show();
      }
      // communication
      if (comms.length > 0) {
        comms[0].x = 875*m_s;  // 975*m_s;
        comms[0].y = 750*m_s;
        comms[0].show();
      }
      // played
      if (played.length > 0) {
        played[0].x = 700*m_s;
        played[0].y = 480*m_s;
        played[0].show();
      }
      // task cards
      for (let i = 0; i < this.taskCards.length; i++) {
        this.taskCards[i].x = 1500*m_s - (i+1)*m_cw;
        this.taskCards[i].y = 750*m_s;
        this.taskCards[i].show();
        stroke(255, 0, 0), fill(0), textSize(32*m_s);
        text('TASK', this.taskCards[i].x, this.taskCards[i].y+m_ch)
      }

      // draw the cards in the last trick
      if (m_trickCards.length > 0) {
        let len = m_trickCards.length;
        for (let i = 0; i < m_players.length; i++) {
          let card = m_trickCards[len-1-i];
          image(m_cardImages[card.index], 1500*m_s-m_cw*(i+1)*0.67, 650*m_s, m_cw*0.67, m_ch*0.67);
        }
      }

    } 
    if (relativeSeatPos == 1) {
      this.drawOddSeat(relativeSeatPos, 0*m_s, 275*m_s, name, imgName);
    }
    if (relativeSeatPos == 2) {
      this.drawOppositeSeat(350*m_s, 0*m_s, name, imgName);
    }
    if (relativeSeatPos == 3) {
      this.drawOddSeat(relativeSeatPos, 1000*m_s, 275*m_s, name, imgName);
      // fill(128), noStroke();
      // rect(1000, 275*m_s, 500*m_s, 350*m_s);
      // stroke(255), fill(255), textSize(32*m_s);
      // text(this.name, 1000, 275*m_s + 32*m_s);
    }
  }

  drawOppositeSeat(xstart, ystart, name, imgName) {
    fill(128), noStroke();
    rect(xstart, ystart, 900*m_s, 250*m_s);
    image(m_starFieldImage, xstart, ystart, 900*m_s, 250*m_s);
    stroke(255), fill(255), textSize(32*m_s);
    text(name, xstart, 32*m_s);
    if (m_playerImages[imgName]) {
      image(m_playerImages[imgName], xstart+150*m_s, ystart, 75*m_s, 75*m_s);
    }
    // if we took thelast trick, outline the image (or where the image would be)
    if (this.tookLastTrick) {
      stroke(0, 255, 0); noFill(), strokeWeight(4);
      rect(xstart+150*m_s, ystart, 75*m_s, 75*m_s);
      stroke(255), fill(255), strokeWeight(1);
    }
    // draw whether this player has used communicaiton this round
    if (this.usedCommunication) {fill(255, 0, 0); stroke(255, 0, 0);}
    else                        {fill(0, 255, 0); stroke(0, 255, 0);}
    circle(xstart + 275*m_s, ystart + 50*m_s, 50*m_s);

    const nonComms = this.cards.filter(card => card.commStatus == 0 && card.played == false);
    const comms = this.cards.filter(card => card.commStatus != 0 && card.played == false);
    const played = this.cards.filter(card => card.played == true);
    const selected = nonComms.filter(card => card.selected == true);

    let ts = 32*m_s;
    textSize(ts); fill(255), stroke(255);
    if (nonComms.length > 0) {
      image(m_cardBackImage, xstart + 0*m_s, ystart+100*m_s, m_cw, m_ch);
      let x = xstart + 0*m_s + m_cw/2-ts/2*m_s + 5*m_s;
      let y = ystart + 100*m_s + m_ch/2 + ts/2*m_s;
      text(nonComms.length, x, y);
      if (selected.length > 0) {
        stroke(0, 255, 0); fill(0, 255, 0);
        text('(' + selected.length + ')', x, y+ts);
        // strokeWeight(4);
        // noFill();
        // rect(xstart + 0*m_s, ystart+100*m_s, m_cw, m_ch);
        // strokeWeight(1);
      }
    }

    if (comms.length > 0) {
      comms[0].x = xstart + 150*m_s;
      comms[0].y = ystart + 100*m_s;
      comms[0].show();
    }
    if (played.length > 0) {
      played[0].x = xstart + 350*m_s;
      played[0].y = ystart + 270*m_s;
      played[0].show();
    }
  
    // task cards
    for (let i = 0; i < this.taskCards.length; i++) {
      this.taskCards[i].x = xstart + 400*m_s + i*m_cw;
      this.taskCards[i].y = ystart + 100*m_s;
      this.taskCards[i].show();
      stroke(255, 0, 0), fill(0), textSize(32*m_s);
      text('TASK', this.taskCards[i].x, this.taskCards[i].y+m_ch)
    }

  } 

  drawOddSeat(relativeSeatPos, xstart, ystart, name, imgName) {
    fill(128), noStroke();
    rect(xstart, ystart, 500*m_s, 350*m_s);
    image(m_starFieldImage, xstart, ystart, 500*m_s, 350*m_s);
    stroke(255), fill(255), textSize(32*m_s);
    text(name, xstart, ystart + 32*m_s);
    if (m_playerImages[imgName]) {
      image(m_playerImages[imgName], xstart, ystart+50*m_s, 75*m_s, 75*m_s);
    }
    // if we took thelast trick, outline the image (or where the image would be)
    if (this.tookLastTrick) {
      stroke(0, 255, 0); noFill(), strokeWeight(4);
      rect(xstart, ystart+50*m_s, 75*m_s, 75*m_s);
      stroke(255), fill(255), strokeWeight(1);
    }
    // draw whether this player has used communicaiton this round
    if (this.usedCommunication) {fill(255, 0, 0); stroke(255, 0, 0);}
    else                        {fill(0, 255, 0); stroke(0, 255, 0);}
    circle(xstart + 35*m_s, ystart + 175*m_s, 50*m_s);

    const nonComms = this.cards.filter(card => card.commStatus == 0 && card.played == false);
    const comms = this.cards.filter(card => card.commStatus != 0 && card.played == false);
    const played = this.cards.filter(card => card.played == true);
    const selected = nonComms.filter(card => card.selected == true);

    let ts = 32*m_s;
    textSize(ts); fill(255), stroke(255);
    if (nonComms.length > 0) {
      image(m_cardBackImage, xstart + 150*m_s, ystart+25*m_s, m_cw, m_ch);
      let x = xstart + 150*m_s + m_cw/2-ts/2*m_s + 5*m_s;
      let y = ystart + m_ch/2 + ts/2*m_s;
      text(nonComms.length, x, y);
      if (selected.length > 0) {
        stroke(0, 255, 0); fill(0, 255, 0);
        text('(' + selected.length + ')', x, y+ts);
        // strokeWeight(4);
        // noFill();
        // rect(xstart + 150*m_s, ystart+25*m_s, m_cw, m_ch);
        // strokeWeight(1);
      }
    }

    if (comms.length > 0) {
      comms[0].x = xstart + 300*m_s;
      comms[0].y = ystart + 25*m_s;
      comms[0].show();
    }
    if (played.length > 0) {
      if (relativeSeatPos == 1) {
        played[0].x = xstart + 520*m_s;
        played[0].y = ystart + 110*m_s;
      } else {
        played[0].x = xstart - 120*m_s;
        played[0].y = ystart + 110*m_s;
      }
      played[0].show();
    }

    // task cards
    for (let i = 0; i < this.taskCards.length; i++) {
      this.taskCards[i].x = xstart + 0*m_s + i*m_cw;
      this.taskCards[i].y = ystart + 200*m_s;
      this.taskCards[i].show();
      stroke(255, 0, 0), fill(0), textSize(32*m_s);
      text('TASK', this.taskCards[i].x, this.taskCards[i].y+m_ch)
    }


  }

  // card is a Card
  addCard(card) {
    this.cards.push(card);
  }

  // card is a Card
  addTaskCard(card) {
    this.taskCards.push(card);
  }

  reset() {
    this.cards = [];
    this.taskCards = [];
    this.isCommander = false;
    this.usedCommunication = false;
    this.tookLastTrick = false;
  }

  // data: a Player object
  copyFromServerData(data) {
    this.socketId = data.socketId;
    this.seatPos = data.seatPos;
    this.name = data.name;
    this.isCommander = data.isCommander;
    this.usedCommunication = data.usedCommunication;
    this.tookLastTrick = data.tookLastTrick;

    if (data.cards) {
      for (let c of data.cards) {
        let card = new Card();
        card.copyFromServerData(c);
        this.cards.push(card);
      }
    } else {
      this.cards = [];
    }
    if (data.taskCards) {
      for (let c of data.taskCards) {
        let card = new Card();
        card.copyFromServerData(c);
        this.taskCards.push(card);
      }
    } else {
      this.taskCards = [];
    }
  }  // copyFromServerData

}  // class Player