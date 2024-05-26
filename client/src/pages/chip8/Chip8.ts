// This is a chip-8 emulator
// Written by Jerry Schneider

import Display from './Display.ts';

// Hardcoded fontset
const FONTSET = [
  0xF0, 0x90, 0x90, 0x90, 0xF0, // 0
  0x20, 0x60, 0x20, 0x20, 0x70, // 1
  0xF0, 0x10, 0xF0, 0x80, 0xF0, // 2
  0xF0, 0x10, 0xF0, 0x10, 0xF0, // 3
  0x90, 0x90, 0xF0, 0x10, 0x10, // 4
  0xF0, 0x80, 0xF0, 0x10, 0xF0, // 5
  0xF0, 0x80, 0xF0, 0x90, 0xF0, // 6
  0xF0, 0x10, 0x20, 0x40, 0x40, // 7
  0xF0, 0x90, 0xF0, 0x90, 0xF0, // 8
  0xF0, 0x90, 0xF0, 0x10, 0xF0, // 9
  0xF0, 0x90, 0xF0, 0x90, 0x90, // A
  0xE0, 0x90, 0xE0, 0x90, 0xE0, // B
  0xF0, 0x80, 0x80, 0x80, 0xF0, // C
  0xE0, 0x90, 0x90, 0x90, 0xE0, // D
  0xF0, 0x80, 0xF0, 0x80, 0xF0, // E
  0xF0, 0x80, 0xF0, 0x80, 0x80  // F
];

// Hardcoded input keys
const INPUT_KEY_MAP: { [key: number]: number } = {
  88: 0x0,
  49: 0x1,
  50: 0x2,
  51: 0x3,
  81: 0x4,
  87: 0x5,
  69: 0x6,
  65: 0x7,
  83: 0x8,
  68: 0x9,
  90: 0xA,
  67: 0xB,
  52: 0xC,
  82: 0xD,
  70: 0xE,
  86: 0xF,
};

class Chip8 {
  private display: Display;

  // Print debug messages if true
  private debug = false;

  // Pauses emulation if true
  private isPaused = false;

  // The timeout between emulation cycles
  private timeout = 0;

  //4k memory
  // 0x000-0x1FF - Chip 8 interpreter (contains font set in emu)
  // 0x050-0x0A0 - Used for the built in 4x5 pixel font set (0-F)
  // 0x200-0xFFF - Program ROM and work RAM
  private memoryView: number[] = [];

  // Registers
  private V: number[] = [];

  // Index register (upper 4 bits are unused)
  private I = 0;

  // Program counter (upper 4 bits are unused)
  private pc = 0;

  // Pixel Display
  private pixels: boolean[] = [];

  // Timers which count down from X to 0 at 60hz
  private delay_timer = 0;
  private sound_timer = 0;

  // 16 frame stack
  private stack: number[] = [];
  // Stack pointer
  private sp = 0;

  // Key state
  private keys: boolean[] = [];

  // If the emulator is waiting for input
  private waitingForKey = false;

  private tick: ReturnType<typeof setTimeout> | undefined = undefined;

  private eventTimer: ReturnType<typeof setInterval> | undefined = undefined;

  private opcode: number = 0;

  private opcodes: {
    [key: number]: { exec: (opcode: number) => boolean | undefined },
  } = {};

  // Callback for each emulation cycle
  private onEmulationCycle;

  // Init opcodes
  constructor(display: Display, onEmulationCycle: (chip8: Chip8) => void) {
    this.display = display;
    this.onEmulationCycle = onEmulationCycle || (() => {});

    this.opcodes[0x0000] = {
      exec: (opcode) => {
        switch(opcode & 0x000F) {
          case 0x0000: { // 0x00E0: clear the screen
            for (let k = 0; k < this.pixels.length; k++) {
              this.pixels[k] = false;
            }
            this.display.fill(0).flush();
            this.pc += 2;
            return true;
          }
          case 0x000E: { // 0x00EE: return from a subroutine
            this.pc = this.stack[--this.sp] + 2;
            return true;
          }
        }
      }
    }

    this.opcodes[0x1000] = { // 1NNN: jumps to address NNN
      exec: (opcode) => {
        this.pc = 0x0FFF & opcode;
        return true;
      }
    }

    this.opcodes[0x2000] = {
      exec: (opcode) => {
        this.stack[this.sp++] = this.pc;
        this.pc = 0x0FFF & opcode;
        return true;
      }
    }

    this.opcodes[0x3000] = {
      exec: (opcode) => {
        if (this.V[ (0x0F00 & opcode) >> 8 ] === (0x00FF & opcode) ){
          this.pc += 4;
        } else {
          this.pc += 2;
        }
        return true;
      }
    }

    this.opcodes[0x4000] = {
      exec: (opcode) => {
        if (this.V[ (0x0F00 & opcode) >> 8 ] !== (0x00FF & opcode)) {
          this.pc += 4;
        } else {
          this.pc += 2;
        }
        return true;
      }
    }

    this.opcodes[0x5000] = {
      exec: (opcode) => {
        if (this.V[ (0x0F00 & opcode) >> 8 ] === this.V[ (0x00F0 & opcode) >> 4 ]) {
          this.pc += 4;
        } else{
          this.pc += 2;
        }
        return true;
      }
    }

    this.opcodes[0x6000] = {
      exec: (opcode) => {
        this.updateReg( (0x0F00 & opcode) >> 8, 0x00FF & opcode );
        this.pc += 2;
        return true;
      }
    }

    this.opcodes[0x7000] = {
      exec: (opcode) => {
        this.updateReg( (0x0F00 & opcode) >> 8, (this.V[ (0x0F00 & opcode) >> 8 ] + (0x00FF & opcode)) & 0x00FF );
        this.pc += 2;
        return true;
      }
    }

    this.opcodes[0x8000] = {
      exec: (opcode) => {
        switch(0x000F & opcode) {
          case 0x0000:  {
            this.updateReg( (0x0F00 & opcode) >> 8, this.V[ (0x00F0 & opcode) >> 4 ] );
            this.pc += 2;
            return true;
          }
          case 0x0001: {
            this.updateReg( (0x0F00 & opcode) >> 8, this.V[ (0x0F00 & opcode) >> 8 ] | this.V[ (0x00F0 & opcode) >> 4 ] );
            this.pc += 2;
            return true;
          }
          case 0x0002: {
            this.updateReg( (0x0F00 & opcode) >> 8, this.V[ (0x0F00 & opcode) >> 8 ] & this.V[ (0x00F0 & opcode) >> 4 ] );
            this.pc += 2;
            return true;
          }
          case 0x0003: {
            this.updateReg( (0x0F00 & opcode) >> 8, this.V[ (0x0F00 & opcode) >> 8 ] ^ this.V[ (0x00F0 & opcode) >> 4 ] );
            this.pc += 2;
            return true;
          }
          case 0x0004: {
            this.updateReg( (0x0F00 & opcode) >> 8, this.V[ (0x0F00 & opcode) >> 8 ] + this.V[ (0x00F0 & opcode) >> 4 ] );
            this.updateReg( 0xF, ( this.V[ (0x0F00 & opcode) >> 8 ] & 0x100 ) >> 8 );
            this.updateReg( (0x0F00 & opcode) >> 8, this.V[ (0x0F00 & opcode) >> 8 ] & 0x00FF );
            this.pc += 2;
            return true;
          }
          case 0x0005: {
            this.updateReg( (0x0F00 & opcode) >> 8, this.V[ (0x0F00 & opcode) >> 8 ] + 0x100 );
            this.updateReg( (0x0F00 & opcode) >> 8, this.V[ (0x0F00 & opcode) >> 8 ] - this.V[ (0x00F0 & opcode) >> 4 ] );
            this.updateReg( 0xF, (this.V[ (0x0F00 & opcode) >> 8 ] & 0x100) >> 8 );
            this.updateReg( (0x0F00 & opcode) >> 8, this.V[ (0x0F00 & opcode) >> 8 ] & 0x00FF );
            this.pc += 2;
            return true;
          }
          case 0x0006: {
            this.updateReg( 0xF, this.V[ (0x0F00 & opcode) >> 8 ] & 0x1 );
            this.updateReg( (0x0F00 & opcode) >> 8, this.V[ (0x0F00 & opcode) >> 8 ] >> 1 );
            this.pc += 2;
            return true;
          }
          case 0x0007: {
            this.updateReg( (0x00F0 & opcode) >> 4, this.V[ (0x00F0 & opcode) >> 4 ] + 0x100 );
            this.updateReg( (0x0F00 & opcode) >> 8, this.V[ (0x00F0 & opcode) >> 4 ] - this.V[ (0x0F00 & opcode) >> 8 ] );
            this.updateReg( 0xF, (this.V[ (0x00F0 & opcode) >> 4 ] & 0x100) >> 8 );
            this.updateReg( (0x00F0 & opcode) >> 4, this.V[ (0x00F0 & opcode) >> 4 ] & 0x00FF );
            this.pc += 2;
            return true;
          }
          case 0x000E: {
            this.updateReg( 0xF, this.V[ (0x0F00 & opcode) >> 8 ] & 0x80 ? 0x1 : 0x0 );
            this.updateReg( (0x0F00 & opcode) >> 8, this.V[ (0x0F00 & opcode) >> 8 ] << 1 );
            this.pc += 2;
            return true;
          }
        }
      }
    }

    this.opcodes[0x9000] = {
      exec: (opcode) => {
        if (this.V[ (0x0F00 & opcode) >> 8 ] !== this.V[ (0x00F0 & opcode) >> 4 ]){
          this.pc += 4;
        } else {
          this.pc += 2;
        }
        return true;
      }
    }

    this.opcodes[0xA000] = {
      exec: (opcode) => {
        this.I = opcode & 0x0FFF;
        this.pc += 2;
        return true;
      }
    }

    this.opcodes[0xB000] = {
      exec: (opcode) => {
        this.pc = (opcode & 0x0FFF) + this.V[ 0 ];
        return true;
      }
    }

    this.opcodes[0xC000] = {
      exec: (opcode) => {
        this.updateReg( (0x0F00 & opcode) >> 8, ( Math.random() * 0x80 ) & ( opcode & 0x00FF ) );
        this.pc += 2;
        return true;
      }
    }

    this.opcodes[0xD000] = {
      exec: (opcode) => {
        const X = this.V[(opcode & 0x0F00) >> 8];
        const Y = this.V[(opcode & 0x00F0) >> 4];
        const spriteHeight = opcode & 0x000F;

        this.updateReg( 0xF, 0 );
        for (let hline = 0; hline < spriteHeight; hline++) {
          const spriteRow = this.memoryView[ this.I + hline ];
          for (let vline = 0; vline < 8; vline++) {
            // If the sprite specifies a difference at this pixel
            if (spriteRow & (0x80 >> vline)) {
              const pixelIndex = ((Y + hline) * 64) %( 64*32 ) + (X + vline) % 64;
              // flip the bit
              const bit = !this.pixels[ pixelIndex ];
              this.pixels[ pixelIndex ] = bit;
              // update the display
              this.display.setPixel((X + vline) % 64, (Y + hline) % 32, bit ? 1 : 0);
              // if the bit was reset, set VF
              bit || this.updateReg( 0xF, 1 );
            }
          }
        }
        this.display.flush();
        this.pc += 2;
        return true;
      }
    }

    this.opcodes[0xE000] = {
      exec: (opcode) => {
        switch (0x00FF & opcode) {
          case 0x009E: {
            if (this.keys[ this.V[ (opcode & 0x0F00) >> 8 ] ]) {
              this.pc += 4;
            } else {
              this.pc += 2;
            }
            return true;
          }
          case 0x00A1: {
            if (!this.keys[ this.V[ (opcode & 0x0F00) >> 8 ] ]) {
              this.pc += 4;
            } else {
              this.pc += 2;
            }
            return true;
          }
        }
      }
    }

    this.opcodes[0xF000] = {
      exec: (opcode) => {
        switch (0x00FF & opcode){
          case 0x0007: {
            this.updateReg( (0x0F00 & opcode) >> 8, this.delay_timer );
            this.pc += 2;
            return true;
          }
          case 0x000A: {
            this.waitingForKey = true;
            return true;
          }
          case 0x0015: {
            this.delay_timer = this.V[ (0x0F00 & opcode) >> 8 ];
            this.pc += 2;
            return true;
          }
          case 0x0018: {
            this.sound_timer = this.V[ (0x0F00 & opcode) >> 8 ];
            this.pc += 2;
            return true;
          }
          case 0x001E: {
            this.I += this.V[ (0x0F00 & opcode) >> 8 ];
            if (this.I & 0xF000) {
              this.updateReg( 0xF, 1 );
            } else {
              this.updateReg( 0xF, 0 );
            }
            this.I = this.I & 0x0FFF;
            this.pc += 2;
            return true;
          }
          case 0x0029: {
            this.I = 0x50 + ( this.V[ (0x0F00 & opcode) >> 8 ] * 5 );
            this.pc += 2;
            return true;
          }
          case 0x0033: {
            const VX = this.V[(opcode & 0x0F00) >> 8]
            this.memoryView[this.I]     = Math.floor( VX / 100);
            this.memoryView[this.I + 1] = Math.floor( VX / 10) % 10;
            this.memoryView[this.I + 2] = VX % 10;
            this.pc += 2;
            return true;
          }
          case 0x0055: {
            const X = (opcode & 0x0F00) >> 8;
            for (let i = 0; i <= X; i++ ) {
              this.memoryView[this.I+i] = this.V[i];
            }
            this.pc += 2;
            return true;
          }
          case 0x0065: {
            const X = (opcode & 0x0F00) >> 8;
            for (let i = 0; i <= X; i++) {
              this.updateReg( i, this.memoryView[this.I+i] );
            }
            this.pc += 2;
            return true;
          }
        }
      }
    };
  }

  // Load the fontset into memory at 0x50
  private loadFontset() {
    for (let i = 0; i < FONTSET.length; i++) {
      this.memoryView[0x50 + i] = FONTSET[i];
    }
  }

  getDebugData() {
    return {
      V: this.V,
      I: this.I,
      pc: this.pc,
      stack: this.stack,
      sp: this.sp,
    };
  }

  setDebug(isEnabled: boolean) {
    this.debug = isEnabled;
  }

  getIsPaused() {
    return this.isPaused;
  }

  setPaused(isPaused: boolean) {
    this.isPaused = isPaused;
    if (this.isPaused) {
      clearTimeout(this.tick);
    } else {
      this.tick = setTimeout(
        () => {
          this.emulateCycle();
        },
        this.timeout,
      );
    }
    return this.isPaused;
  }

  togglePaused() {
    this.setPaused(!this.isPaused);
    return this.isPaused;
  }

  step() {
    if (this.isPaused){
      this.emulateCycle();
    }
  }

  private initMemory() {
    //Init 16 8-bit registers
    for (let i = 0; i < 16; i++) {
      this.V[i] = 0;
    }

    //Applications are expected to be loaded at 0x200
    this.pc = 0x200;

    //Clear memory
    this.stack = [];
    this.sp = 0;
    this.I = 0;

    //Set all pixels to 0
    for (let k = 0; k < 64 * 32; k++) {
      this.pixels[k] = false;
    }

    //Set all keys to unpressed
    for (let i = 0; i < Object.keys(INPUT_KEY_MAP).length; i++) {
      this.keys[i] = false;
    }

    this.waitingForKey = false;

    this.loadFontset();
  }

  private updateReg(idx: number, value: number) {
    this.V[idx] = value;
  }

  private emulateCycle() {
    // Fetch opcode, instructions are 2 bytes long
    this.opcode = this.memoryView[this.pc] << 8 | this.memoryView[this.pc+1];

    this.onEmulationCycle(this);
    if (this.debug) {
      console.log("memory[" + this.pc.toString(16) + "] === " + this.opcode.toString(16));
    }

    // Decode and execute opcode
    !!this.opcodes[0xF000 & this.opcode] && this.opcodes[0xF000 & this.opcode].exec(this.opcode) || console.log("Unknown Opcode! " + this.opcode.toString(16));

    if( !this.waitingForKey && !this.isPaused ){
      // Get input

      // Execute next instruction
      this.tick = setTimeout(
        () => {
          this.emulateCycle();
        },
        this.timeout,
      );
    }
  }

  private emulateCycleSecondHalf(key: number) {
    if (this.waitingForKey) {
      this.updateReg( (0x0F00 & this.opcode) >> 8, key );
      this.pc += 2;
      this.waitingForKey = false;
    }

    if (!this.isPaused) {
      // Get input

      // Execute next instruction
      this.tick = setTimeout(
        () => {
          this.emulateCycle();
        },
        this.timeout,
      );
    }
  }

  private updateTimers() {
    //Update timers
    if (this.delay_timer > 0) {
      this.delay_timer--;
      //Nothing happens here, it is a register that can be checked by the program
    }
    if (this.sound_timer > 0) {
      this.sound_timer--;
      if (this.sound_timer !== 0) {
        //TODO: Play a sound when timer is non-zero
      }
    }
  }

  setTimerRate(hz: number) {
    clearInterval( this.eventTimer );
    this.eventTimer = setInterval(
      () => {
        this.updateTimers();
      },
      1000 / hz,
    );
  }

  // Load the game into the emulator memory
  loadGame(romFile: string | ArrayBuffer) {
    // Clear existing tick, memory, and screen
    clearTimeout(this.tick);
    this.initMemory();
    this.display.fill(0).flush();

    // Load the game into memory
    if (typeof romFile === 'string') {
      for (let i = 0; i < romFile.length; i++) {
        this.memoryView[0x200 + i] = romFile.charCodeAt(i);
      }
    } else {
      const view = new DataView(romFile);
      for (let i = 0; i < romFile.byteLength; i++) {
        this.memoryView[0x200 + i] = view.getUint8(i);
      }
    }

    // Emulation loop
    this.emulateCycle();
  }

  private toUpperCase(key: number) {
    return key > 96 ? key -= 32 : key;
  }

  handleKeyDown(evt: KeyboardEvent) {
    const key = this.toUpperCase(evt.keyCode || evt.charCode);
    const keycode = INPUT_KEY_MAP[key];
    if (keycode !== undefined) {
      this.keys[keycode] = true;
      if (this.waitingForKey) {
        this.emulateCycleSecondHalf(keycode);
      }
    }
  }

  handleKeyUp(evt: KeyboardEvent) {
    const key = this.toUpperCase(evt.keyCode || evt.charCode);
    var keycode = INPUT_KEY_MAP[key];
    if (keycode !== undefined) {
      this.keys[keycode] = false;
    }
  }
}

export default Chip8;
