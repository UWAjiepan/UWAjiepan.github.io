let m1Slider, k1Slider, c1Slider, m2Slider, k2Slider, c2Slider, sliders = [];
let mMass1 = 1, kMass1 = 10, cMass1 = 0.4, mMass2 = 1, kMass2 = 10, cMass2 = 0.08,
    values = [mMass1, kMass1, cMass1, mMass2, kMass2, cMass2],
    factors = [10, 10, 100, 10, 10, 100];
let inputs = [],
    inputAttr = [[0.1, 2, 0.1], [1, 40, 0.1], [0.01, 1, 0.01], [0.1, 2, 0.1], [1, 40, 0.1], [0.01, 1, 0.01]];
let graph, cmplxPremath, gold = '#DAA520', blue = '#5F9EA0';

function setup() {
    createCanvas(920, 600).parent('canvas');
    frameRate(20);
    createSliders();
    createInputs();
    cmplxPremath = matrixPremath();
    setupGraph();
}

function draw() {
    background(255);
    updateSliders();
    graph.draw();
    text('Frequency     (Hz)', 475, 430);
    drawFraction(225, 17, 'X', 'F');
    drawFraction(255, 17, 'm', 'N');

    push();
    fill('#FFA500');
    text('Phase  (ϕ)', 765, 125);
    pop();

    drawDiagram();
    drawLegend();

}

function drawDiagram() {
    drawSubscript(60, 315, 'k', '1', 14);
    drawSubscript(60, 445, 'k', '2', 14);

    drawSubscript(130, 315, 'c', '1', 14);
    drawSubscript(130, 445, 'c', '2', 14);
    push();
    translate(0, 210);
    drawSpring(90, 55, 19, 100, 9);
    drawSpring(90, 185, 19, 100, 9);
    push();
    noFill();
    drawDamperBox(110, 55, 55);
    drawDamper(116, 155, 60);
    drawDamperBox(110, 185, 55);
    drawDamper(116, 285, 60);
    fill(gold);
    stroke(gold);
    rect(75, 25, 60, 30);
    fill(blue);
    stroke(blue);
    rect(80, 155, 50, 30);
    rect(80, 285, 50, 30);
    pop();
    pop();
    push();
    textSize(14);
    text('(t)', 49, 395);
    text('sinωt', 170, 380);

    fill(blue);
    stroke(blue);
    triangle(63, 395, 71, 395, 67, 402);
    strokeWeight(2);
    line(80, 377, 60, 377);
    strokeWeight(4);
    line(67, 379, 67, 395);
    fill('#FFA500');
    stroke('#FFA500');
    strokeWeight(1);
    triangle(139, 395, 147, 395, 143, 402);
    strokeWeight(2);
    line(130, 377, 150, 377);
    strokeWeight(4);
    line(143, 379, 143, 395);
    pop();
    drawSubscript(97, 385, 'm', '1', 14);
    drawSubscript(97, 515, 'm', '2', 14);
    drawSubscript(35, 395, 'x', '1', 14);
    drawSubscript(155, 380, 'F', '1', 14);


}

function drawLegend() {
    push();
    strokeWeight(2);
    line(235, 441, 205, 441);
    stroke('#FFA500');
    line(235, 468, 205, 468);
    strokeWeight(4);
    stroke(255, 0, 0, 150);
    point(232, 495);
    point(225, 495);
    point(218, 495);
    point(211, 495);
    stroke(0, 0, 255, 150);
    point(232, 522);
    point(225, 522);
    point(218, 522);
    point(211, 522);
    pop();
    push();
    textSize(11);
    text('Exact Response\n\nExact Phase\n\nModal Response\n\nModal Phase', 240, 445);
    pop();
}

/*
        EVENT HANDLERS
*/

function updateSliders() {
    push();
    drawSubscript(24, 50, "m", '1');
    text(':              kg', 41, 50);
    drawSubscript(27, 110, 'k', '1');
    text(':              N/m', 41, 110);
    drawSubscript(27, 170, "c", '1');
    text(':              Ns/m', 41, 170);
    drawSubscript(124, 50, "m", '2');
    text(':              kg', 141, 50);
    drawSubscript(127, 110, 'k', '2');
    text(':              N/m', 141, 110);
    drawSubscript(127, 170, "c", '2');
    text(':              Ns/m', 141, 170);
    pop();
}

function onSliderInput(index) {
    return function () {
        values[index] = this.value() / factors[index];
        inputs[index].value(this.value() / factors[index]);
        updateValues();
    }
}

function onTextInput(index, min, max, step) {
    let dec;
    if (Math.floor(step) === step) dec = 0;
    else dec = step.toString().split(".")[1].length || 0;
    return function () {
        if (this.value < min && this.value !== "") this.value = Number(min);
        else if (this.value > max) this.value = Number(max);
        else if (this.value % step !== 0) this.value = Number((Math.round(this.value * (10 ** dec)) / (10 ** dec)).toFixed(dec));
        if (Number.isNaN(this.value)) this.value = values[index];
        values[index] = Number(this.value);
        sliders[index].value(this.value * factors[index]);
        updateValues();
    }
}

function updateValues() {
    mMass1 = values[0];
    kMass1 = values[1];
    cMass1 = values[2];
    mMass2 = values[3];
    kMass2 = values[4];
    cMass2 = values[5];

    if (graph !== undefined) {
        let p = modalPoints();
        graph.pointObjects[1].yPoints = p.yA;
        graph.pointObjects[3].yPoints = p.yP;
    }
}


/*

         SETUP FUNCTIONS

 */

function createInputs() {
    let startX = 45, startY = 35, curY = 0;
    for (let i = 0; i < sliders.length; i++) {
        let s = createInput(values[i].toString(), 'number');
        s.attribute('min', inputAttr[i][0]);
        s.attribute('max', inputAttr[i][1]);
        s.attribute('step', inputAttr[i][2]);
        s.elt.onblur = onTextInput(i, ...inputAttr[i]);
        s.parent('canvas');
        s.position(startX + (i > 2 ? 100 : 0), startY + curY);
        s.style('width', '40px');
        inputs.push(s);
        curY += (i === 2 ? -120 : 60)
    }
}

function createSliders() {
    m1Slider = createSlider(1, 20, mMass1 * 10);
    k1Slider = createSlider(10, 400, kMass1 * 10);
    c1Slider = createSlider(1, 100, cMass1 * 100);
    m2Slider = createSlider(1, 20, mMass2 * 10);
    k2Slider = createSlider(10, 400, kMass2 * 10);
    c2Slider = createSlider(1, 100, cMass2 * 100);
    sliders = [m1Slider, k1Slider, c1Slider, m2Slider, k2Slider, c2Slider];
    let ypos = 60;
    sliders.forEach(function (s, i) {
        let xpos = (i < 3 ? 25 : 125);
        s.position(xpos, ypos);
        s.style('width', '80px');
        s.input(onSliderInput(i));
        s.parent('canvas');
        ypos += (i === 2 ? -120 : 60);
    });
}

function setupGraph() {
    graph = new StaticGraph(240, 50, 550, 350, [0, 8], [-4, 2], 1, 'log');
    graph.addPointsFunction('amp', [], amp, 1, blackp, 1.5);
    let p = modalPoints();
    graph.addPointsArray('mAmp', p.x, p.yA, 1, color(255, 0, 0, 170));
    graph.addSecondYAxis([-360, 0], 45);
    graph.changeY2Height(250);
    graph.addPointsFunction('phase', [], phase, 2, '#FFA500', 2);
    graph.addPointsArray('mPhase', p.x, p.yP, 2, color(0, 0, 255, 130));
}

function premath(x) {
    let eq1 = TWO_PI * x;
    let eq2 = sq(kMass2) + sq(eq1 * cMass2);
    let eq3 = kMass2 / eq2 - 1 / (mMass2 * sq(eq1));
    let eq4 = -eq1 * cMass2 / eq2;
    let eq5 = kMass1 - mMass1 * sq(eq1) + eq3 / (sq(eq3) + sq(eq4));
    let eq6 = eq1 * cMass1 - eq4 / (sq(eq3) + sq(eq4));
    return {
        r: eq5 / (sq(eq5) + sq(eq6)),
        q: -eq6 / (sq(eq5) + sq(eq6))
    }
}

function amp(x) {
    let pm = premath(x / 8);
    return Math.sqrt(sq(pm.r) + sq(pm.q));
}

function phase(x) {
    let pm = premath(x / 8);
    return degrees(Math.atan2(pm.q, pm.r));
}

function matrixPremath() {
    let mat1 = Matrix.create([
        [mMass1, 0],
        [0, mMass2]]);
    let mat2 = Matrix.create([
        [kMass1 + kMass2, -kMass2],
        [-kMass2, kMass2]
    ]);
    let mat3 = Matrix.create([
        [cMass1 + cMass2, -cMass2],
        [-cMass2, cMass2]
    ]);
    let mat4 = Matrix.inverse(mat1);
    let mat5 = Matrix.mult(mat4, mat2).mat;
    let mat6 = Matrix.mult(mat4, mat3).mat;
    let mat7 = Matrix.create([
        [0, 0, -1, 0],
        [0, 0, 0, -1],
        [mat5[0][0], mat5[0][1], mat6[0][0], mat6[0][1]],
        [mat5[1][0], mat5[1][1], mat6[1][0], mat6[1][1]]
    ]);


    let es = Matrix.eigenstructure(mat7);
    es.lr = es.lr.sort((a, b) => a - b);
    es.li = es.li.sort((a, b) => Math.abs(a) - Math.abs(b));

    let ev = eigenvalues(mat1, mat2);
    let evec1 = Matrix.eigenstructure(Matrix.sub(mat2, Matrix.scale(mat1, ev[0]))).V.mat;
    evec1 = [evec1[1][0], evec1[1][1]];
    let evec2 = Matrix.eigenstructure(Matrix.sub(mat2, Matrix.scale(mat1, ev[1]))).V.mat;
    evec2 = [evec2[1][0], evec2[1][1]];

    let mode1 = mMass1 * sq(evec1[0]) + mMass2 * sq(evec1[1]);
    let mode2 = mMass1 * sq(evec2[0]) + mMass2 * sq(evec2[1]);

    let xi1 = Math.sqrt(1 / (1 + sq(es.li[0] / es.lr[0])));
    let xi2 = Math.sqrt(1 / (1 + sq(es.li[2] / es.lr[2])));
    let w1 = es.li[0] / Math.sqrt(1 - sq(xi1));
    let w2 = es.li[2] / Math.sqrt(1 - sq(xi2));

    return {
        eVec: [evec1, evec2],
        mode: [mode1, mode2],
        xi: [xi1, xi2],
        w: [w1, w2]
    }
}

function modalPoints() {
    cmplxPremath = matrixPremath();
    let x = [];
    let yA = [];
    let yP = [];
    for (let i = 0; i < 8; i += 1 / 15) {
        x.push(i);
        let wn = TWO_PI * i / 8;
        let eq1 = sq(cmplxPremath.w[0]) - sq(wn);
        let eq2 = 2 * cmplxPremath.xi[0] * cmplxPremath.w[0] * wn;
        let eq3 = sq(cmplxPremath.w[1]) - sq(wn);
        let eq4 = 2 * cmplxPremath.xi[1] * cmplxPremath.w[1] * wn;
        let rA = eq1 / (sq(eq1) + sq(eq2)) * cmplxPremath.eVec[0][0] * cmplxPremath.eVec[0][0] / cmplxPremath.mode[0] + eq3 / (sq(eq3) + sq(eq4)) * cmplxPremath.eVec[1][0] * cmplxPremath.eVec[1][0] / cmplxPremath.mode[1];
        let iA = -eq2 / (sq(eq1) + sq(eq2)) * cmplxPremath.eVec[0][0] * cmplxPremath.eVec[0][0] / cmplxPremath.mode[0] - eq4 / (sq(eq3) + sq(eq4)) * cmplxPremath.eVec[1][0] * cmplxPremath.eVec[1][0] / cmplxPremath.mode[1];
        yA.push(Math.sqrt(sq(rA) + sq(iA)));
        let p = 180 * Math.atan(iA / rA) / PI;
        if (p >= 0) p -= 180;
        yP.push(p);
    }
    return {
        x: x, yA: yA, yP: yP
    }
}

