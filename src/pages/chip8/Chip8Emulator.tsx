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
  const [showControls, setShowControls] = useState(true);

  const updateDebugData = useCallback((c8) => setDebugData(c8.getDebugData()));
  const keyDownHandler = useCallback((e) => chip8.handleKeyDown(e));
  const keyUpHandler = useCallback((e) => chip8.handleKeyUp(e));

  // Create display
  useEffect(() => {
    setDisplay(new Display(64, 32, 12));
  }, []);

  useEffect(() => {
    if (chip8) {
      chip8.setDebug(!showControls);
    }
  }, [showControls]);

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
      chip8.loadGame(roms[0].data);

      document.getElementById('viewport').appendChild(display.getContainer());
      document.addEventListener('keydown', keyDownHandler);
      document.addEventListener('keyup', keyUpHandler);

    }

    return () => {
      if (chip8) chip8.setPaused(true);
      const viewport = document.getElementById('viewport');
      if (viewport) {
        viewport.innerHTML = '';
      }
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

  const lowerSection = showControls
    ? <InputControls />
    : <DebugData data={debugData} />;

  return (
    <div className="chip8 d-flex flex-column align-center">
      <h1>Chip8 Emulator</h1>
      <div className="container d-flex">
        <div id="viewport" className="d-flex" />
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
      <div className="tab-row d-flex">
        <div
          className={`tab ${showControls ? 'selected' : ''}`}
          onClick={() => setShowControls(true)}
        >
          View Input Controls
        </div>
        <div
          className={`tab ${!showControls ? 'selected' : ''}`}
          onClick={() => setShowControls(false)}
        >
          View Internal Memory
        </div>
      </div>
      <div className="lower-section d-flex">
        {lowerSection}
      </div>
    </div>
  );
}

function InputControls() {
  return (
    <div className="d-flex">
      <div className="description">
        This is a Chip8 Emulator implemented in JavaScript by Jerry Schneider.  The code for this example is available on <a href="https://github.com/schnej7/website/tree/main/src/pages/chip8" target="_blank">GitHub</a>.  Use your keyboard (keypad depicted to the right) to provide input to the emulation.
      </div>
      <div className="input-controls d-flex flex-column">
        <div className="row d-flex">
          <div className="key">1</div>
          <div className="key">2</div>
          <div className="key">3</div>
          <div className="key">4</div>
        </div>
        <div className="row d-flex">
          <div className="key">q</div>
          <div className="key">w</div>
          <div className="key">e</div>
          <div className="key">r</div>
        </div>
        <div className="row d-flex">
          <div className="key">a</div>
          <div className="key">s</div>
          <div className="key">d</div>
          <div className="key">f</div>
        </div>
        <div className="row d-flex">
          <div className="key">z</div>
          <div className="key">x</div>
          <div className="key">c</div>
          <div className="key">v</div>
        </div>
      </div>
    </div>
  );
}

function DebugData(props) {
  if (props.data) {
    return (
      <div>
        <div className="section d-flex">
          Program memory (opcodes) can be viewed in the browser developer console.
        </div>
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
      <div className="value">{props.value.toString(16)}</div>
    </div>
  );
}

export default Chip8Emulator
