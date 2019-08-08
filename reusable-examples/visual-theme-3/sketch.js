let song, fft;
const prevLevels = new Array(60);

function setup() {
  createCanvas(700, 400);
  song = loadSound("Damage.mp3", loaded);
  fft = new p5.FFT(0.9, 1024);
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


}