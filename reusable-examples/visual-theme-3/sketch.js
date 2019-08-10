let song, amp, fft;
const prevLevels = new Array(60);

function setup() {
  createCanvas(900, 500);
  song = loadSound("The Jungle.mp3", loaded);
  fft = new p5.FFT(0.9, 128);
  amp = new p5.Amplitude();
  angleMode(DEGREES);
}

function loaded() {
  console.log("loaded");
  button = createButton("play");
  button.mousePressed(togglePlaying);
  song.setVolume(0.2); 
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
  background(10, 10, 40);

  // get amplitude for inner bar circle  
  const volume = amp.getLevel();
  const volumeScale = map(volume, 0, 1, 60, 130);
  
  // fft bar circle
  const spectrum = fft.analyze();

  // remove last 100 item of the spectrum array
  // spectrum.splice(-100);

  // get the middle of the spectrum
  // const midSpectrum = spectrum.slice(100, -100);

  // filter 45 bins at regular intervals
  const newSpectrum = [];
  const delta = Math.floor( spectrum.length / 45 );
  for (i = 0; i < spectrum.length; i=i+delta) {
    newSpectrum.push(spectrum[i]);
  }

  // // filter 45 bins at regular intervals
  // const newSpectrum1 = [];
  // const delta1 = Math.floor( spectrum.length / 45 );
  // for (i = 0; i < spectrum.length; i = i + delta1 + 20) {
  //   newSpectrum1.push(spectrum[i]);
  // }

  translate(width / 2, height / 2);
  
  // loop over all frequencies in newSpectrum array
  for (let i = 0; i < 45; i++) {

    // set circle radius at Amplitude.getLvel
    const r = volumeScale;

    // get x and y coords of point on the circle for each bin
    const x = r * cos(i * 4);
    const y = r * sin(i * 4);

    // get a scaled spectrum value h of each bin
    const h = map(newSpectrum[i], 0, 1, 60, 60.8);

    // and get the x, y coords for h
    const xh = h * cos(i * 4);
    const yh = h * sin(i * 4);

    // offset h coords 
    const xh1 = xh + ((y - yh) * 0.04);
    const xh2 = xh - ((y - yh) * 0.04);
    const yh1 = yh - ((x - xh) * 0.04);
    const yh2 = yh + ((x - xh) * 0.04);
    
    //draw bins as quads
    fill(newSpectrum[i], 90, 40);
    quad(xh1, yh1, xh2, yh2, x, y, x, y);

    // draw a circle for 1 / 9 bin
    if (i % 9 === 0 & h > 60) {
      stroke(`rgba(${newSpectrum[i]}, 90, 40, 0.3)`)
      strokeWeight(0.6);
      fill(`rgba(${newSpectrum[i]}, 90, 40, 0.05)`);
      circle(0, 0, h * 2);
    }
  }

  // loop over spectrum array in opposite direction
  for (let i = 0; i < 45; i++) {
    // set circle radius at Amplitude.getLvel
    const r = volumeScale;

    // get x and y coords of point on the circle for each bin
    const x = r * cos((i + 45) * 4);
    const y = r * sin((i + 45) * 4);

    // get a scaled spectrum value h of each bin
    const h = map(newSpectrum[i], 0, 1, 60, 60.8); // newSpectrum[i] * sqrt(log(i+1))

    // and get the x, y coords for h
    const xh = h * cos((i + 45) * 4);
    const yh = h * sin((i + 45) * 4);

    // offset h coords 
    const xh1 = xh + ((y - yh) * 0.04);
    const xh2 = xh - ((y - yh) * 0.04);
    const yh1 = yh - ((x - xh) * 0.04);
    const yh2 = yh + ((x - xh) * 0.04);

    //draw bins as quads
    fill(newSpectrum[i], 90, 40);
    quad(xh1, yh1, xh2, yh2, x, y, x, y);
  }
}