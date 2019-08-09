let song, amp, fft;
const prevLevels = new Array(60);

function setup() {
  createCanvas(900, 500);
  song = loadSound("Damage.mp3", loaded);
  fft = new p5.FFT(0.9, 512);
  amp = new p5.Amplitude();
  angleMode(DEGREES);
}

function loaded() {
  console.log("loaded");
  button = createButton("play");
  button.mousePressed(togglePlaying);
  song.setVolume(0.2); // note that all amplitude mappings are between 0 - 0.2 because of this.
}

// toggle song on button press
function togglePlaying() {
  if (!song.isPlaying()) {
    song.play();
    button.html("pause");
  } else {
    song.pause();
    button.html("play");
  }
}

function draw() {
  background(30, 30, 30);

  // get amplitude for inner bar circle  
  const volume = amp.getLevel();
  const volumeScale = map(volume, 0, 1, 60, 90);
  
  // fft bar circle
  const spectrum = fft.analyze();

  // remove last 100 item of the spectrum array
  spectrum.splice(-100);

  // get the middle of the spectrum
  // const midSpectrum = spectrum.slice(100, -100);

  // filter 90 bins at regular intervals
  const newSpectrum = [];
  var delta = Math.floor( spectrum.length / 90 );
  for (i = 0; i < spectrum.length; i=i+delta) {
    newSpectrum.push(spectrum[i]);
  }

  translate(width / 2, height / 2);
    
  // loop over all frequencies in newSpectrum array
  for (let i = 0; i < 90; i++) {

    // set circle radius at Amplitude.getLvel
    const r = volumeScale;

    // get x and y coords of point on the circle for each bin
    const x = r * cos(i * 4);
    const y = r * sin(i * 4);

    // get a scaled spectrum h value of each bin
    const h = map(newSpectrum[i], 0, 1, 60, 60.8);

    // and get the x, y coords for h
    const xh = h * cos(i * 4);
    const yh = h * sin(i * 4);

    // offset h coords 
    const xh1 = xh + ((y - yh) * 0.03);
    const xh2 = xh - ((y - yh) * 0.03);
    const yh1 = yh - ((x - xh) * 0.03);
    const yh2 = yh + ((x - xh) * 0.03);

    // draw a circle for 1 / 9 bin
    if (i % 9 === 0 & h > 60) {
      stroke(`rgba(${newSpectrum[i]}, 90, 220, 0.3)`)
      strokeWeight(0.6);
      noFill();
      circle(0, 0, h * 2);
    }
    
    //draw bins as quads
    stroke(`rgba(${newSpectrum[i]}, 90, 220, 1)`);
    fill(`rgba(${newSpectrum[i]}, 90, 220, 1)`);
    quad(xh1, yh1, xh2, yh2, x, y, x, y);  
  }
}