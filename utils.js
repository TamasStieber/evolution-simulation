function lerp(A, B, t) {
  return A + (B - A) * t;
}

function lerpForT(A, B, x) {
  return Math.abs((A - x) / (B - A));
}

function getIntersection(A, B, C, D) {
  const tTop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);
  const uTop = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);
  const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);

  if (bottom != 0) {
    const t = tTop / bottom;
    const u = uTop / bottom;
    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
      return {
        x: lerp(A.x, B.x, t),
        y: lerp(A.y, B.y, t),
        offset: t,
      };
    }
  }

  return null;
}

function decToBin(number) {
  return number.toString(2).padStart(24, '0');
}

function hexToBin(number) {
  return parseInt(number, 16).toString(2).padStart(24, '0');
}

function binToHex(number) {
  return parseInt(number, 2).toString(16);
}

function getRGBFromBin(number) {
  const newColorHex = number.match(/.{1,8}/g);

  const R = binToHex(newColorHex[0]).padStart(2, '0');
  const G = binToHex(newColorHex[1]).padStart(2, '0');
  const B = binToHex(newColorHex[2]).padStart(2, '0');

  return { R: R, G: G, B: B };
}

function mixColors(color1, color2) {
  // in hex format
  let newColor = '';
  let color1Bin = hexToBin(color1).split('');
  let color2Bin = hexToBin(color2).split('');
  for (let i = 0; i < color1Bin.length; i++) {
    if (Math.random() > 0.5) {
      newColor += color1Bin[i];
    } else {
      newColor += color2Bin[i];
    }
  }

  const newColorHex = newColor.match(/.{1,8}/g);

  const R = binToHex(newColorHex[0]).padStart(2, '0');
  const G = binToHex(newColorHex[1]).padStart(2, '0');
  const B = binToHex(newColorHex[2]).padStart(2, '0');

  newColor = R + G + B;

  return newColor;
}
