let data = [];

  function preload()
  {
    let table = loadTable('AllCSVs/Heart Rate Variability Details - 2024-02-20.csv', 'csv', 'header', function(table)
    {
      //Iterate over each row
      for (let r = 0; r < table.getRowCount(); r++)
      {
        let row = table.getRow(r);
        let timestamp = row.getString('timestamp');
        let rmssd = row.getNum('rmssd');
        let coverage = row.getNum('coverage');
        let low_freq = row.getNum('low_frequency');
        let high_freq = row.getNum('high_frequency');
        // Add the object to the data array
        data.push({
          timestamp: timestamp,
          rmssd: rmssd,
          coverage: coverage,
          low_frequency: low_freq,
          high_frequency: high_freq
        });
      }
    });
  }
  			
  function normalize(value, min, max)
  {
    return (value - min) / (max - min);
  }
  function setup() {
    createCanvas(1800, 1600);
    noFill();
    colorMode(HSB); // Use HSB color mode
  }
  
  let t = 0; // Interpolation parameter for the current segment
  let segmentIndex = 0; // Current segment index
  
  function draw() {
    background(225); // Clear the background
  
    // Draw each segment up to the current one fully
    for (let i = 0; i < segmentIndex; i++) {
      drawSegment(i);
    }
    
    // Draw the current segment partially, according to t
    if (segmentIndex < data.length - 1) {
      drawPartialSegment(segmentIndex, t);
      t += 6; // Adjust this value for speed
      if (t > 1) {
        t = 0; // Reset t for the next segment
        segmentIndex++; // Move to the next segment
        
      }
      
    }else
    {
      // Only call noLoop() once all segments have been drawn
  console.log("All segments drawn. Stopping loop.", segmentIndex);
  noLoop(); // Stops the draw loop
    }
  }

  

  
  // Draw a complete segment between two data points
  function drawSegment(index) {
    let segment = getSegmentData(index);
    
    strokeWeight(segment.coverageWeight);
    stroke(segment.hue, 80, 80, segment.coverage); // Color based on low frequency, opacity on coverage
    bezier(segment.x0, segment.y0, segment.cp1x, segment.cp1y, segment.cp2x, segment.cp2y, segment.x1, segment.y1);
  }
  
  // Draw the current segment partially
  function drawPartialSegment(index, t) {
    let segment = getSegmentData(index);
  
    // Lerp the x and y values for the control points and the end point
    let cp1x_interp = lerp(segment.x0, segment.cp1x, t);
    let cp1y_interp = lerp(segment.y0, segment.cp1y, t);
    let cp2x_interp = lerp(segment.x0, segment.cp2x, t);
    let cp2y_interp = lerp(segment.y0, segment.cp2y, t);
    let x1_interp = lerp(segment.x0, segment.x1, t);
    let y1_interp = lerp(segment.y0, segment.y1, t);
  
    strokeWeight(segment.coverageWeight);
    stroke(segment.hue, 80, 80, segment.coverage); // Color based on low frequency, opacity on coverage
    bezier(segment.x0, segment.y0, cp1x_interp, cp1y_interp, cp2x_interp, cp2y_interp, x1_interp, y1_interp);
  }
  
  // Get the data necessary for a segment of the bezier curve
  function getSegmentData(index) {
    let x0 = map(index, 0, data.length - 1, 50, width - 50);
    let x1 = map(index + 1, 0, data.length - 1, 50, width - 50);
    let y0 = map(data[index].rmssd, 12, 100, height * 0.8, height * 0.2); // Remember: change this to edit the acceptable height boundaries
    let y1 = map(data[index + 1].rmssd, 12, 100, height * 0.8, height * 0.2); // Adjusted for visual effect
    
    console.log("rmssd =",data[index].rmssd);
    // Find the min and max for low and high frequency in the dataset
    let lowFreqMin = Math.min(...data.map(d => d.low_frequency));
    let lowFreqMax = Math.max(...data.map(d => d.low_frequency));
    let highFreqMin = Math.min(...data.map(d => d.high_frequency));
    let highFreqMax = Math.max(...data.map(d => d.high_frequency));

    // Normalize the frequency values
    let normalizedLowFreq = normalize(data[index].low_frequency, lowFreqMin, lowFreqMax);
    let normalizedHighFreq = normalize(data[index + 1].high_frequency, highFreqMin, highFreqMax);

    // Adjust control points using normalized frequency values
    let cp1x = constrain(x0 + normalizedLowFreq * 50, 50, width - 50);
    let cp2x = constrain(x1 - normalizedHighFreq * 50, 50, width - 50);

    let cp1y = y0; // Should be based on y0
    let cp2y = y1; // Should be based on y1
    
    let coverageWeight = map(data[index].coverage, 0.7, 1, 1, 5);
    let hue = getHueForFrequency(normalizedLowFreq); //map(data[index].low_frequency, 0, 1, 0, 255); // Map low frequency to hue
    console.log("Hue", hue);
    return {
      x0: x0, y0: height / 2, x1: x1, y1: height / 2,
      cp1x: cp1x, cp1y: cp1y, cp2x: cp2x, cp2y: cp2y,
      coverageWeight: coverageWeight,
      hue: hue,
      coverage: data[index].coverage
    };
  }

  function getHueForFrequency(normalizedFreq) {
    // Assuming normalizedFreq is already between 0.011 (calm) and 0.5 (energized)
  
    console.log("value here is ", normalizedFreq);
    const calmThreshold = 0.1; 
    const energizedThreshold = 0.3; 
  
    if (normalizedFreq <= calmThreshold) {
      // Calm (Light Blue in HSB)
      // HSB equivalent of light blue: Hue around 180 (for blue), high saturation, and high brightness
      return color(180, 80, 90); // Adjust the saturation and brightness to your liking
  } else if (normalizedFreq >= energizedThreshold) {
      // Energized (Red in HSB)
      // Red has a hue of 0 in HSB
      return color(0, 100, 100);
  } else {
      // Neutral (Gray in HSB)
      
      return color(0, 0, 50);
  }
  }
  