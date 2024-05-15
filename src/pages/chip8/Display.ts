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

class Display {

  private width;

  private height;

  private length;

  private pixelSize;

  private buffer = [];

  private colorMap = {
		0: '#000000',
		1: '#FFFFFF',
  };

  private container;

  private context;

  constructor(width, height, pixelSize) {
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

  fill(value) {
    for (let i = 0; i < this.length; i++) {
      this.buffer[i] = value;
    }
    return this;
  }

	flush() {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        this.context.fillStyle = this.colorMap[ this.buffer[ y * this.width + x ] ];
        this.context.fillRect(
          x * this.pixelSize,
          y * this.pixelSize,
          this.pixelSize,
          this.pixelSize,
        );
      }
    }
    return this;
	}

	setPixel(x, y, value) {
		this.buffer[ (y * this.width + x) % this.length ] = value;
		return this;
	}
}

export default Display;
