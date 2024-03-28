
let heartRateData;
let dataArray;
let particles = [];
let currentColor;
let dateTime;

let colors;

let allParticlesOffScreen = false; // Flag to track if all particles have moved off the canvas


function preload() {
    //dataArray = loadJSON('AllHearRates/heart_rate-2023-03-11.json'); //confidence is mainly 2
    dataArray = loadJSON('AllHearRates/heart_rate-2024-01-04.json');
    //dataArray = loadJSON('AllHearRates/heart_rate-2024-02-04.json');
    //dataArray = loadJSON('sampleJSON.json');
}
function setup() {
  //createCanvas(800, 800);
  createCanvas(windowWidth, windowHeight);
  if (dataArray !== null && typeof dataArray === 'object') {
    heartRateData = Object.values(dataArray);

    console.log(heartRateData[0].dateTime);

    dateTime = new Date(heartRateData[0].dateTime);

    
    // create particles for each data point
    for (let i = 0; i < heartRateData.length; i++) {
      let bpm = heartRateData[i].value.bpm;
      let confidence = heartRateData[i].value.confidence;
      let p = new Particle(bpm, confidence);
      particles.push(p);
    }
    // Call draw() at least once to display the particles
    draw();

    // Stop the loop if all particles have moved off the canvas
    if (allParticlesOffScreen) {
      console.log("Number of red: ",nbRed, " Orange:", nbOrange ," blue: ", nbLB, " back: ", nbBlack);
      noLoop();
    }
    } else {
    console.error('heartRateData is undefined or null');
    }
}

let frameCounter = 0; // Frame counter
function draw() {
  if (!allParticlesOffScreen) {
    
    //console.log(frameCounter);
    background(105);// to remove trail

    // Update and display each particle
    for (let j = particles.length - 1; j >= 0; j--) {
      particles[j].update();
      particles[j].display();

      // Remove particles that have gone off-screen
      if (particles[j].isOffScreen()) {
        particles.splice(j, 1);
      }
    }
 // Increment frame counter
 frameCounter++;

 // Check if frame counter has reached 200
 if (frameCounter >= 130) {  
  console.log("Number of red: ",nbRed, " Orange:", nbOrange ," blue: ", nbLB, " back: ", nbBlack);
   allParticlesOffScreen = true;
 }
}
}


class Particle {
  constructor(bpm, confidence) {
    // this.position = createVector(width / 2, height / 2); // Start at the center of the canvas
    // this.velocity = p5.Vector.fromAngle(random(TWO_PI), map(bpm, 0, 200, 1, 5)); // Calculate a random velocity based on the bpm and a random angle
    
    // this.acceleration = createVector(0, 0);
    // this.color = getColor(confidence);

    this.position = createVector(width / 2, height / 2);
    this.velocity = p5.Vector.random2D();
    this.velocity.mult(map(bpm, 40, 170, 1, 5));
    this.acceleration = createVector(0, 0);
    this.bpm = bpm;
    this.color = getColor(bpm);
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


let nbRed = 0, nbOrange = 0, nbLB = 0, nbBlack = 0;


function getColor(bpm) {
  if (bpm >= 110) 
  {
    nbRed++;
    return color(255, 0, 0); // red for very fast heart rate
  } 
  else if (bpm >= 100) 
  {
    nbOrange++;
    return color(255, 140, 0); // orange for medium heart rate
  } 
  else if (bpm >= 60) 
  {
    nbLB++;
    return color(0, 191, 255); // light blue for slow heart rate
  } else 
  {
    nbBlack++;
    return color(0); // black as default color
  }
}


