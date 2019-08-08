let song, amp, fft;
const prevLevels = new Array(60);

function setup() {
  createCanvas(700, 400);
  song = loadSound("Damage.mp3", loaded);
  fft = new p5.FFT(0.9, 512);
  amp = new p5.Amplitude(0.9);
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
  stroke(255);
  noFill();

  const spectrum = fft.analyze();

  // get the middle of the spectrum
  const midSpectrum = spectrum.slice(100, -100);

  // filter 90 bins at regular intervals
  const newSpectrum = [];
  var delta = Math.floor( midSpectrum.length / 90 );
  for (i = 0; i < midSpectrum.length; i=i+delta) {
    newSpectrum.push(midSpectrum[i]);
  }

  const volume = amp.getLevel();

  translate(width / 2, height / 2);
  beginShape(QUADS);

    
    // loop over all frequencies in newSpectrum array
    for (let i = 0; i < 90; i++) {
      const r = map(volume, 0, 1, 80, 130);
      const x = r * cos(i * 4);
      const y = r * sin(i * 4);
      const h = map(newSpectrum[i], 0, 1, 80, 80.8);
      const xh = h * cos(i * 4);
      const yh = h * sin(i * 4);

      vertex(xh, yh);
      vertex(xh, yh);
      vertex(x, y);
      vertex(x, y);

      strokeWeight(2.2);

      // const alpha = map(newSpectrum[i], 0, 256, 0, 1);
      stroke(`rgba(${newSpectrum[i]}, 90, 220, 1)`)
    }

  endShape();
}