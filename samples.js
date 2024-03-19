// Draw a complete segment for both curves
function drawSegment(index) {
  // First curve data
  let segment1 = getSegmentData(index, height / 6); // Pass the y-level for the curve
  strokeWeight(segment1.coverageWeight);
  stroke(segment1.hue, 80, 80, segment1.coverage); // Color based on low frequency, opacity on coverage
  bezier(segment1.x0, segment1.y0, segment1.cp1x, segment1.cp1y, segment1.cp2x, segment1.cp2y, segment1.x1, segment1.y1);
  
  // Second curve data (adjust the y-level to height / 2)
  let segment2 = getSegmentData(index, height / 2); // This curve will be in the middle third
  strokeWeight(segment2.coverageWeight);
  stroke(segment2.hue, 80, 80, segment2.coverage); // Color based on low frequency, opacity on coverage
  bezier(segment2.x0, segment2.y0, segment2.cp1x, segment2.cp1y, segment2.cp2x, segment2.cp2y, segment2.x1, segment2.y1);
}

// Similar adjustment for drawPartialSegment...

// Get the data necessary for a segment of the bezier curve, add a parameter for the y-level
function getSegmentData(index, yLevel) {
  // All the same calculations as before...
  
  // Modify the y-coordinate for control points and endpoints based on the yLevel argument
  let y0 = map(data[index].rmssd, 12, 100, yLevel + 100, yLevel - 100);
  let y1 = map(data[index + 1].rmssd, 12, 100, yLevel + 100, yLevel - 100);
  // ... rest of the function remains the same

  return {
    // ... all other properties remain the same,
    y0: y0, y1: y1, // Use the new y0 and y1 for this curve's vertical placement
    // ... rest of the properties remain the same
  };
}

// You will need to make similar changes in the drawPartialSegment function