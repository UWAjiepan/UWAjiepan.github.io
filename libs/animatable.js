let blacka = '#000000';

function drawSpring(startX, startY, sideLength, totalLength, numOfSides) {
    let curx = startX;
    let cury = startY;
    let side = sideLength;
    let diag = totalLength / (numOfSides / 2);
    let angle = acos(-1 * (pow(diag, 2) - 2 * pow(side, 2)) / (2 * pow(side, 2)));
    for (let i = 0; i < numOfSides + 1; i++) {
        let v;
        if (i === 0) { //first
            v = p5.Vector.fromAngle((angle / 2), side / 2);
        } else if (i === 11) { //last
            v = p5.Vector.fromAngle(PI - (angle / 2), side / 2);
        } else if (i % 2) { //odd
            v = p5.Vector.fromAngle(PI - (angle / 2), side);
        } else { //even
            v = p5.Vector.fromAngle((angle / 2), side);
        }
        line(curx, cury, curx + v.x, cury + v.y);
        curx += v.x;
        cury += v.y;
    }
}

function drawMass(startX, startY, w, h, yFunc) {
    let y;
    if (typeof startX !== "number") throw TypeError("startX not a number");
    if (typeof startY !== "number") throw TypeError("startY not a number");
    if (typeof w !== "number") throw TypeError("w is not a number");
    if (typeof h !== "number") throw TypeError("h is not a number");
    if (typeof yFunc === "function") y = yFunc();
    else if (typeof yFunc === "number") y = yFunc;
    else throw TypeError("yFunc is not a function");
    push();
    strokeWeight(1);
    fill(color(52, 195, 235));
    rect(startX, startY + y, w, h);
    pop();
    /*
    if (points.length>440){
        push();
        stroke('green');
        strokeWeight(2);
        line(619, 198 + y, 658, 198 + y);
        pop();
    }
    */
    return y;
}

function drawDamperBox(startX, startY, h) {
    rect(startX, startY, 12, h);
}

function drawDamper(x, y, h) {
    push();
    strokeWeight(1);
    stroke(blacka);
    line(x, y - h, x, y);
    line(x - 4, y - h, x + 4, y - h);
    pop();
}

function drawForceVector(x, originY, y) {
    push();
    stroke('orange');
    strokeWeight(5);
    line(x, originY, x, originY + y);
    strokeWeight(1);
    let offset;
    if (y < 0) offset = -2;
    else offset = 2;
    line(x - 7, originY + y + offset, x + 7, originY + y + offset);
    pop();
}

function drawOOBMass(originX, originY, l) {
    push();
    let v = p5.Vector.fromAngle((plot.getLatestDataValue(0) !== 0 ? -(t * 8 * fMass) % (TWO_PI) : 0), l);
    line(originX, originY, originX + v.x, originY + v.y);
    fill(blacka);
    circle(originX + v.x, originY + v.y, 5);
    pop();
}

//TODO add subscript
function drawFraction(x, y, top, bottom, txtSize = 12, colour = blacka) {
    push();
    textAlign(CENTER);
    fill(colour);
    textSize(txtSize);
    text(top, x, y);
    textAlign(CENTER, TOP);
    text(bottom, x, y + textAscent());
    stroke(colour);
    let lineWidth = (textWidth(top) > textWidth(bottom) ? textWidth(top) : textWidth(bottom)) / 2;
    line(x - 5 - lineWidth, y + textDescent(), x + lineWidth + 5, y + textDescent());
    pop();
}

function drawSubscript(x, y, normal, sub, txtSize = 12, colour = blacka, subSize = txtSize - 2) {
    push();
    fill(colour);
    textSize(txtSize);
    text(normal, x, y);
    textAlign(LEFT, CENTER);
    let wid = textWidth(normal);
    textSize(subSize);
    text(sub, x + wid, y);
    pop();
}

function drawEquation(x, y, text, txtSize = 12, colour = blacka) {
    push();
    textSize(txtSize);
    fill(colour);
    let subre = /\^(.*?)\^/g;
    let frare = /\/(.*?)\//g;
    let fra = text.match(frare);
    fra.forEach(function (value, index, array) {
        array[index] = value.replace(/\//g, '');
    });
    console.log(text);
    text.replace(frare, '');
    console.log(text);
    let sub = text.match(subre);
    sub.forEach(function (value, index, array) {
        array[index] = value.replace(/\^/g, '');
    });
    console.log(fra);
    console.log(sub);
    //console.log(text.match(fra));
    pop();
}

function mouseDebug() {
    push();
    text(`${mouseX}, ${mouseY}`, 50, 10);
    pop();
}
