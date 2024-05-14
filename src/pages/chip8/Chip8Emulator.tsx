import Chip8 from "./Chip8.ts";
import Display from "./Display.ts";
import Roms from "./Roms.ts";
import React from "react";

class Chip8Emulator extends React.Component {

  private display;

  private chip8;

  private roms;

  private keyDownHandler;

  private keyUpHandler;

  constructor(props) {
    super(props);

    this.roms = Object.entries(Roms).map(
      ([key, val]) => ({
        name: key,
        data: val,
      }));

    this.display = new Display(64, 32, 12);
    this.display.fill(0).flush();

    this.chip8 = new Chip8(this.display);
    this.chip8.setTimerRate(60);
    this.chip8.loadGame(this.roms[17].data);

    this.keyDownHandler = (e) => this.chip8.handleKeyDown(e);
    this.keyUpHandler = (e) => this.chip8.handleKeyUp(e);
  }

  componentDidMount() {
    document.getElementById('viewport').appendChild(this.display.getContainer());
    document.addEventListener('keydown', this.keyDownHandler);
    document.addEventListener('keyup', this.keyUpHandler);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.keyDownHandler);
    document.removeEventListener('keyup', this.keyUpHandler);
  }

  private getRomOptions() {
    return this.roms.map((rom, idx) => (
      <option value={idx} key={rom.name}>{rom.name}</option>
    ));
  }

  render() {
    return (
      <>
        <div className="container">
          <div id="viewport" />
        </div>
        <select
          onChange={e => this.chip8.loadGame(this.roms[e.target.value].data)}
        >
          { this.getRomOptions() }
        </select>
        <button onClick={() => this.chip8.togglePaused()}>Pause</button>
        <button onClick={() => this.chip8.step()}>Step</button>
      </>
    )
  }
}

export default Chip8Emulator
