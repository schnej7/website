import Chip8 from "./Chip8.ts";
import Display from "./Display.ts";
import Roms from "./Roms.ts";
import React, { useState } from "react";

class Chip8Emulator extends React.Component {

  private display =  new Display( 64, 32, 12 );

  private chip8 = new Chip8(this.display);

  componentDidMount() {
    this.display.fill(0).flush();
    document.getElementById('viewport').appendChild( this.display.getContainer() );
    this.chip8.setTimerRate(60);
    this.chip8.loadGame(Roms['PONG2']);
  }

  render() {
    return (
      <>
        <div className="container">
          <div id="viewport" />
        </div>
      </>
    )
  }
}

export default Chip8Emulator
