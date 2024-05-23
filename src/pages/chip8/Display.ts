/** 
 *
 * TO USE:
 *
 *  // create the display object
 *  const display = new Display( 64, 32, 12 )
 *
 *  // clear screen
 *  display.fill(0).flush();
 *
 *  // add to the DOM
 *  document.getElementById('screen').appendChild( display.getContainer() );
 *
 */
type PxVal = (0|1);

class Display {

  private width: number;

  private height: number;

  private length: number;

  private pixelSize: number;

  private buffer: PxVal[] = [];

  private colorMap = {
    0: '#000000',
    1: '#FFFFFF',
  };

  private container: HTMLCanvasElement;

  private context: CanvasRenderingContext2D | null;

  constructor(width: number, height: number, pixelSize: number) {
    this.width = width;

    this.height = height;

    this.pixelSize = pixelSize;

    this.length = this.width * this.height;

    this.container = document.createElement('canvas'),
    this.context = this.container.getContext('2d');
    this.container.width = width * pixelSize;
    this.container.height = height * pixelSize;
  }

  getContainer() {
    return this.container;
  }

  fill(value: PxVal) {
    for (let i = 0; i < this.length; i++) {
      this.buffer[i] = value;
    }
    return this;
  }

  flush() {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (this.context) {
          this.context.fillStyle = this.colorMap[ this.buffer[ y * this.width + x ] ];
          this.context.fillRect(
            x * this.pixelSize,
            y * this.pixelSize,
            this.pixelSize,
            this.pixelSize,
          );
        }
      }
    }
    return this;
  }

  setPixel(x: number, y: number, value: PxVal) {
    this.buffer[ (y * this.width + x) % this.length ] = value;
    return this;
  }
}

export default Display;
