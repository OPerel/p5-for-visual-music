let song, fft;
const prevLevels = new Array(60);

function setup() {
  createCanvas(700, 400);
  song = loadSound("Damage.mp3", loaded);
  fft = new p5.FFT(0.9, 256);
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
  // console.log(spectrum)
  // remove very high frequencies
  // const twoThirds = Math.floor((spectrum.length / 3) * 2);
  spectrum.splice(120);

  // set width and spacing of each rect
  const spacing = 3;
  const w = width / (spectrum.length * spacing);

  translate(width / 2, height / 2);
  beginShape(QUADS);

    
    // loop over all frequencies in spectrum array
    for (let i = 0; i < 120; i++) {
      const r = 80;
      const x = r * cos(i * 3);
      const y = r * sin(i * 3);
      const h = map(spectrum[i], 0, 1, 80, 80.8);
      const xh = h * cos(i * 3);
      const yh = h * sin(i * 3);

      vertex(xh, yh);
      vertex(xh, yh);
      vertex(x, y);
      vertex(x, y);

      const alpha = map(spectrum[i], 0, 256, 0, 1);
      stroke(`rgba(${spectrum[i]}, 90, 220, ${alpha})`)
    }

  endShape();
}