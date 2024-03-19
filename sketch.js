let grid;
let nextGrid;
let dA = 1.0; // Diffusion rate of A
let dB = 0.5; // Diffusion rate of B
let feed = 0.055; // Example feed rate
let k = 0.062; // Example kill rate
let avgBpm = 0;



function preload() {
  // Assuming the file is named "heart_rate_data.json" and located in the project directory
  let data = loadJSON("hrTest.json", calculateAverageBpm);
}

function calculateAverageBpm(data) {
  let totalBpm = 0;
  data.forEach(entry => {
    totalBpm += entry.value.bpm;
  });
  avgBpm = totalBpm / data.length;
  // Adjust feed rate based on average bpm, this is a simple mapping, adjust as needed
  feed = map(avgBpm, 40, 730, 0.055, 0.065); // Assuming your bpm range goes from 70 to 730
}

function setup() {
  createCanvas(200, 200);
  pixelDensity(1);
  grid = [];
  next = [];
  for (var x = 0; x < width; x++) {
    grid[x] = [];
    next[x] = [];
    for (var y = 0; y < height; y++) {
      grid[x][y] = {a: 1, b: 0};
      next[x][y] = {a: 1, b: 0};
    }
  }

  // Seed the center for reaction
  for (let i = 100 - 10; i < 100 + 10; i++) {
    for (let j = 100 - 10; j < 100 + 10; j++) {
      grid[i][j].b = 1;
    }
  }
}

function draw() {
  background(51);

  for (let x = 1; x < width - 1; x++) {
    for (let y = 1; y < height - 1; y++) {
      let a = grid[x][y].a;
      let b = grid[x][y].b;
      next[x][y].a = a +
        (dA * laplaceA(x, y)) -
        (a * b * b) +
        (feed * (1 - a));
      next[x][y].b = b +
        (dB * laplaceB(x, y)) +
        (a * b * b) -
        ((k + feed) * b);

      next[x][y].a = constrain(next[x][y].a, 0, 1);
      next[x][y].b = constrain(next[x][y].b, 0, 1);
    }
  }

  loadPixels();
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      let pix = (x + y * width) * 4;
      let a = next[x][y].a;
      let b = next[x][y].b;
      let c = floor((a - b) * 255);
      c = constrain(c, 0, 255);
      pixels[pix + 0] = c;
      pixels[pix + 1] = c;
      pixels[pix + 2] = c;
      pixels[pix + 3] = 255;
    }
  }
  updatePixels();

  swap();
}

function laplaceA(x, y) {
  let sumA = 0;
  sumA += grid[x][y].a * -1;
  sumA += grid[x-1][y].a * 0.2;
  sumA += grid[x+1][y].a * 0.2;
  sumA += grid[x][y-1].a * 0.2;
  sumA += grid[x-1][y-1].a * 0.05;
  sumA += grid[x+1][y-1].a * 0.05;
  sumA += grid[x-1][y+1].a * 0.05;
  sumA += grid[x+1][y+1].a * 0.05;
  return sumA;
}

function laplaceB(x, y) {
  let sumB = 0;
  sumB += grid[x][y].b * -1;
  sumB += grid[x-1][y].b * 0.2;
  sumB += grid[x+1][y].b * 0.2;
  sumB += grid[x][y+1].b * 0.2;
  sumB += grid[x][y-1].b * 0.2;
  sumB += grid[x-1][y-1].b * 0.05;
  sumB += grid[x+1][y-1].b * 0.05;
  sumB += grid[x-1][y+1].b * 0.05;
  sumB += grid[x+1][y+1].b * 0.05;
  return sumB;
}

function swap() {
  let temp = grid;
  grid = next;
  next = temp;
}