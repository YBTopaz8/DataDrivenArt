
let heartRateData;
let dataArray;
let particles = [];
let currentColor;
let dateTime;

let colors;

function preload() {
    //dataArray = loadJSON('AllHearRates/heart_rate-2023-03-11.json'); confidence is mainly 2
    dataArray = loadJSON('AllHearRates/heart_rate-2024-01-04.json');
    //dataArray = loadJSON('sampleJSON.json');
}
function setup() {
  createCanvas(1000, 1000);
  if (dataArray !== null && typeof dataArray === 'object') {
    heartRateData = Object.values(dataArray);

    console.log(heartRateData[0].dateTime);

    dateTime = new Date(heartRateData[0].dateTime);

    // set the initial canvas color based on the hour of the first data point
    const hour = dateTime.getHours();
    setBGColor(hour);

    // create particles for each data point
    for (let i = 0; i < heartRateData.length; i++) {
      let bpm = heartRateData[i].value.bpm;
      let confidence = heartRateData[i].value.confidence;
      let p = new Particle(bpm, confidence);
      particles.push(p);
    }

  } else {
    console.error('heartRateData is undefined or null');
  }
  //noLoop();
}
function setBGColor(hour)
{
  if (hour >= 0 && hour < 6) {
    background(105); // dark gray
    console.log("darkgray");
  } else if (hour >= 6 && hour < 12) {
    background(153, 204, 255); // light blue
    console.log("LB");
  } else if (hour >= 12 && hour < 18) {
    background(255, 223, 173); // light orange
    console.log("LO");
  } else if (hour >= 18 && hour < 24) {
    background(0); // black
    console.log("black");
  }
}

let i = 0;
let currentIndex = 0; // Start with the first data point
let lastUpdateTime = 0; // Tracks when we last updated the view
let updateInterval = 1000; // 2 seconds between updates
function draw() {
  //background(105); to remove trail
  
  // loop through each data point
  if (millis() - lastUpdateTime > updateInterval) { // Check if 6 seconds have passed
    lastUpdateTime = millis(); // Update the last update time

    if (currentIndex < heartRateData.length) {
      const dateTime = new Date(heartRateData[currentIndex].dateTime);
      const hour = dateTime.getHours();

      //setBGColor(hour);

      currentIndex++; // Move to the next data point
    } else {
      currentIndex = 0; // Optionally loop back to the start
    }
  }

  // Update and display each particle
  for (let j = particles.length - 1; j >= 0; j--) {
    particles[j].update();
    particles[j].display();

    // Remove particles that have gone off-screen
    if (particles[j].isOffScreen()) {
      particles.splice(j, 1);
    }
  }

  // Re-run draw after a short delay, acting as a frame update
  //setTimeout(draw, 50);
}

class Particle {
  constructor(bpm, confidence) {
    // this.position = createVector(width / 2, height / 2); // Start at the center of the canvas
    // this.velocity = p5.Vector.fromAngle(random(TWO_PI), map(bpm, 0, 200, 1, 5)); // Calculate a random velocity based on the bpm and a random angle
    
    // this.acceleration = createVector(0, 0);
    // this.color = getColor(confidence);

    this.position = createVector(width / 2, height / 2);
    this.velocity = p5.Vector.random2D();
    this.velocity.mult(map(bpm, 0, 200, 1, 5));
    this.acceleration = createVector(0, 0);
    this.confidence = confidence;
    this.color = getColor(confidence);
  }

  update() {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
  }

  display() {
    // stroke(this.color);
    // strokeWeight(3);
    // point(this.position.x, this.position.y);
    noStroke();
    fill(this.color);
    ellipse(this.position.x, this.position.y, 10, 10);
  }

  isOffScreen() {
    return (this.position.x < -10 || this.position.x > width + 10 || this.position.y < -10 || this.position.y > height + 10);
  }
}

function getColor(confidence) {
  switch (confidence) {
    case 3:
      return color(0, 255, 0); // green
    case 2:
      return color(255, 105, 180); // pink
    case 1:
      return color(255); // white
    case 0:
      return color(255, 0, 0); // red
    default:
      return color(255); // white
  }
}