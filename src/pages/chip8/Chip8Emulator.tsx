import Chip8 from "./Chip8.ts";
import Display from "./Display.ts";
import Roms from "./Roms.ts";
import React, { useEffect, useState, useCallback } from "react";
import "./Chip8.scss";

function Chip8Emulator() {
  const [display, setDisplay] = useState(undefined);
  const [chip8, setChip8] = useState(undefined);
  const [isPaused, setIsPaused] = useState(false);
  const [debugData, setDebugData] = useState(undefined);

  const updateDebugData = useCallback((c8) => setDebugData(c8.getDebugData()));
  const keyDownHandler = useCallback((e) => chip8.handleKeyDown(e));
  const keyUpHandler = useCallback((e) => chip8.handleKeyUp(e));

  // Create display
  useEffect(() => {
    setDisplay(new Display(64, 32, 12));
  }, []);

  // Init display and create emulator
  useEffect(() => {
    if (display) {
      display.fill(0).flush();
      setChip8(new Chip8(display, updateDebugData));
    }
  }, [display]);

  // Init emulator
  useEffect(() => {
    if (chip8) {
      chip8.setTimerRate(60);
      chip8.loadGame(roms[17].data);

      document.getElementById('viewport').appendChild(display.getContainer());
      document.addEventListener('keydown', keyDownHandler);
      document.addEventListener('keyup', keyUpHandler);

    }

    return () => {
      if (chip8) chip8.setPaused(true);
      document.getElementById('viewport').innerHTML = '';
      document.removeEventListener('keydown', keyDownHandler);
      document.removeEventListener('keyup', keyUpHandler);
    };
  }, [chip8]);

  const roms = Object.entries(Roms).map(
    ([key, val]) => ({
      name: key,
      data: val,
    }));;

  const getRomOptions = () => {
    return roms.map((rom, idx) => (
      <option value={idx} key={rom.name}>{rom.name}</option>
    ));
  };

  return (
    <div className="chip8 d-flex flex-column align-center">
      <h1>Chip8 Emulator</h1>
      <div className="container d-flex">
        <div id="viewport" />
      </div>
      <div className="button-row d-flex">
        <select
          onChange={e => chip8.loadGame(roms[e.target.value].data)}
        >
          { getRomOptions() }
        </select>
        <button
          onClick={() => setIsPaused(chip8.togglePaused())}
        >
          { isPaused ? 'Resume' : 'Pause' }
        </button>
        <button
          className={ isPaused ? '' : 'disabled' }
          onClick={() => chip8.step()}
        >
          Step
        </button>
      </div>
      <div className="debug-data d-flex">
        <DebugData data={debugData} />
      </div>
    </div>
  );
}

function DebugData(props) {
  if (props.data) {
    return (
      <div>
        <div className="section d-flex flex-column">
          <div className="title">Registers</div>
          <div className="d-flex flex-wrap">
            <MemoryValue name="I" value={props.data.I} />
            <MemoryValue name="pc" value={props.data.pc} />
            <MemoryValue name="sp" value={props.data.sp} />
            {props.data.V.map((reg, idx) => (
              <MemoryValue key={`V${idx}`} name={`V${idx}`} value={reg} />
            ))}
          </div>
        </div>
        <div className="section d-flex flex-column">
          <div className="title">Stack</div>
          <div>
            {props.data.stack.map((value, idx) => (
              <MemoryValue key={`s-${idx}`} name={idx} value={value} />
            ))}
          </div>
        </div>
      </div>
    );
  }
  return (
    <div>No Data</div>
  );
}

function MemoryValue(props) {
  return (
    <div className="memory-value d-flex">
      <div className="name">{props.name}</div>
      <div className="value">{props.value}</div>
    </div>
  );
}

export default Chip8Emulator
