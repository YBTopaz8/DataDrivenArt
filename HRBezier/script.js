let data = [
    { rmssd: 40.207, coverage: 0.899 },
    { rmssd: 33.412, coverage: 0.993 },
    { rmssd: 33.082, coverage: 0.968 },
    { rmssd: 34.57, coverage: 0.889 },
    { rmssd: 28.219, coverage: 0.996 },
    { rmssd: 36.506, coverage: 0.958 },
    { rmssd: 33.543, coverage: 0.992 },
    { rmssd: 34.338, coverage: 0.942},
    { rmssd: 35.697, coverage: 1.005},
    { rmssd: 35.697, coverage: 1.005}
  ];
  
  function setup() {
    createCanvas(800, 600);
    stroke(0);
    noFill();
    
  }
  
  let t = 0; // Interpolation parameter
  let segmentIndex = 0; // Current segment index
  
  function draw() {
    background(155); // Clear the background
    
    // Draw all completed segments
    for (let i = 0; i < segmentIndex; i++) {
      drawSegment(i);
    }
    
    // Interpolate and draw the current segment
    if (segmentIndex < data.length - 1) {
      drawInterpolatedSegment(segmentIndex, t);
      t += 0.02; // Increment t for interpolation
      
      // Once t exceeds 1, reset it and move to the next segment
      if (t >= 1) {
        t = 0;
        segmentIndex++;
      }
    }
  }
  
  // Draws a complete segment between two data points
  function drawSegment(index) {
    let x0 = map(index, 0, data.length - 1, 0, width);
    let x1 = map(index + 1, 0, data.length - 1, 0, width);
    let y0 = map(data[index].rmssd, 25, 35, 0, height);
    let y1 = map(data[index + 1].rmssd, 25, 35, 0, height);
    let strokeW = map(data[index].coverage, 0.8, 1.5, 1, 10);
  
    strokeWeight(strokeW);
    bezier(x0, height/2, x0, y0, x1, y1, x1, height/2);
  }
  
  // Draws an interpolated segment between two data points
  function drawInterpolatedSegment(index, t) {
    let x0 = map(index, 0, data.length - 1, 0, width);
    let x1 = map(index + 1, 0, data.length - 1, 0, width);
    let y0 = map(data[index].rmssd, 25, 35, 0, height);
    let y1 = map(data[index + 1].rmssd, 25, 35, 0, height);
    let strokeW = map(data[index].coverage, 0.8, 1.5, 1, 10);
  
    // Lerp the y values for the control points
    let interpY0 = lerp(height/2, y0, t);
    let interpY1 = lerp(y0, y1, t);
    
    strokeWeight(lerp(strokeW, map(data[index + 1].coverage, 0.8, 1.5, 1, 10), t));
    bezier(x0, height/2, x0, interpY0, x1, interpY1, x1, height/2);
  }
  