import Chip8 from "./Chip8.ts";
import Display from "./Display.ts";
import Roms from "./Roms.ts";
import React, { useEffect, useState, useCallback } from "react";

function Chip8Emulator() {
  const roms = Object.entries(Roms).map(
    ([key, val]) => ({
      name: key,
      data: val,
    }));;

  const [display, setDisplay] = useState(new Display(64, 32, 12));
  display.fill(0).flush();

  const [chip8, setChip8] = useState(new Chip8(display));
  chip8.setTimerRate(60);
  chip8.loadGame(roms[17].data);

  const keyDownHandler = useCallback((e) => chip8.handleKeyDown(e));
  const keyUpHandler = useCallback((e) => chip8.handleKeyUp(e));

  const getRomOptions = () => {
    return roms.map((rom, idx) => (
      <option value={idx} key={rom.name}>{rom.name}</option>
    ));
  };

  useEffect(() => {
    document.getElementById('viewport').appendChild(display.getContainer());
    document.addEventListener('keydown', keyDownHandler);
    document.addEventListener('keyup', keyUpHandler);

    return () => {
      document.removeEventListener('keydown', keyDownHandler);
      document.removeEventListener('keyup', keyUpHandler);
    };
  }, []);

  return (
    <>
      <div className="container">
        <div id="viewport" />
      </div>
      <select
        onChange={e => chip8.loadGame(roms[e.target.value].data)}
      >
        { getRomOptions() }
      </select>
      <button onClick={() => chip8.togglePaused()}>Pause</button>
      <button onClick={() => chip8.step()}>Step</button>
    </>
  );
}

export default Chip8Emulator
