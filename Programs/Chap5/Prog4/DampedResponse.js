let mBSlider, m2Slider, k1Slider, k2Slider, k3Slider, c1Slider, c2Slider, fPSlider, xPSlider, dPSlider, sliders = [];
let bMass = 1, mMass = 0.5, kSpring1 = 10, kSpring2 = 10, kSpring3 = 10, cDamp1 = 0.05, cDamp2 = 0.05, forcePos = 0.3,
    xPos = 0.6, dPos = 0.8;
let values = [bMass, kSpring1, kSpring3, cDamp1, xPos, mMass, kSpring2, dPos, cDamp2, forcePos],
    factors = [10, 10, 10, 100, 100, 10, 10, 100, 100, 100];
let inputs = [],
    inputAttr = [[0.2, 2, 0.1], [0.1, 20, 0.1], [0.1, 10, 0.1], [0.01, 1, 0.01], [0.01, 1, 0.01], [0.1, 1, 0.1], [0.1, 20, 0.1], [0.01, 1, 0.01], [0.01, 1, 0.01], [0.01, 1, 0.01]];
let graph;

function setup() {
    createCanvas(920, 440).parent('canvas');
    frameRate(24);
    createSliders();
    createInputs();

    graph = new StaticGraph(330, 50, 550, 350, [0, 8], [-5, 1], 1, 'log');
    graph.addPointsFunction('amp', [], amp, 1, 'red');

}

function draw() {
    background(255);
    updateSliders();
    graph.draw();
    text('Frequency     (Hz)', 570, 430);
    drawFraction(275, 60, 'X', 'F', 12, 'red');
    drawFraction(300, 60, 'm', 'N');
    push();
    translate(0, 70);
    drawSubscript(20, 335, 'k', '1');
    drawSubscript(145, 335, 'k', '2');
    drawSubscript(62, 335, 'c', '1');
    drawSubscript(188, 335, 'c', '2');
    let f = lerp(50, 180, forcePos);
    text('F', f + 7, 340);
    let x = lerp(50, 180, xPos);
    text('X', x - 14, 323);
    let d = lerp(50, 180, dPos);
    drawSubscript(d + 6, 300, 'k', '3');
    drawSubscript(d + 14, 278, 'm', '2');
    fill('black');
    strokeCap(SQUARE);
    fill('orange');
    stroke('orange');
    strokeWeight(3);
    line(f, 312, f, 340);
    triangle(f - 2, 340, f + 2, 340, f, 344);
    strokeWeight(1);
    stroke('black');
    noFill();
    line(35, 319, 65, 319);
    line(160, 319, 190, 319);
    line(50, 311, 50, 319);
    line(180, 310, 180, 319);
    rect(52, 319, 8, 18);
    drawDamper(56, 360, 30);
    rect(175, 319, 8, 18);
    drawDamper(179, 360, 30);
    drawSpring(41, 320, 13, 40, 5);
    drawSpring(165, 320, 13, 40, 5);
    drawSpring(d, 280, 10, 26, 5);
    strokeWeight(3);
    stroke('cadetblue');
    fill('cadetblue');
    rect(d - 7.5, 273, 15, 7);
    strokeWeight(3);
    line(x, 312, x, 325);
    triangle(x - 2, 325, x + 2, 325, x, 329);
    strokeWeight(4);
    line(50, 310, 180, 310);
    fill('gold');
    stroke('gold');
    rect(38, 360, 152, 10);
    pop();
}

function updateSliders() {
    push();
    drawSubscript(13, 50, "m", 'beam');
    text(':                 kg', 51, 50);
    drawSubscript(38, 110, 'k', '1');
    text(':                 N/m', 51, 110);
    drawSubscript(38, 170, 'k', '2');
    text(':                 N/m', 51, 170);
    drawSubscript(38, 230, 'c', '1');
    text(':                 Ns/m', 51, 230);
    text('X Pos:', 20, 290);
    drawSubscript(163, 50, "m", '2');
    text(':                 kg', 181, 50);
    drawSubscript(168, 110, 'k', '3');
    text(':                 N/m', 181, 110);
    text('D Pos:', 149, 170);
    drawSubscript(168, 230, 'c', '2');
    text(':                 Ns/m', 181, 230);
    text('F Pos:', 149, 290);
    pop();
}

/*
        EVENT HANDLERS
*/

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
    bMass = values[0];
    kSpring1 = values[1];
    kSpring3 = values[2];
    cDamp1 = values[3];
    xPos = values[4];
    mMass = values[5];
    kSpring2 = values[6];
    dPos = values[7];
    cDamp2 = values[8];
    forcePos = values[9];
}

/*

         SETUP FUNCTIONS

 */

function createInputs() {
    let startX = 55, startY = 35, cury = 0;
    for (let i = 0; i < sliders.length; i++) {
        let s = createInput(values[i].toString(), 'number');
        s.attribute('min', inputAttr[i][0]);
        s.attribute('max', inputAttr[i][1]);
        s.attribute('step', inputAttr[i][2]);
        s.elt.onblur = onTextInput(i, ...inputAttr[i]);
        s.parent('canvas');
        s.position(startX + (i < 5 ? 0 : 130), startY + cury);
        s.style('width', '50px');
        inputs.push(s);
        cury += (i === 4 ? -240 : 60)
    }
}

function createSliders() {
    mBSlider = createSlider(2, 20, bMass * 10);
    k1Slider = createSlider(1, 200, kSpring1 * 10);
    k2Slider = createSlider(1, 200, kSpring2 * 10);
    k3Slider = createSlider(1, 100, kSpring3 * 10);
    fPSlider = createSlider(1, 100, forcePos * 100);
    xPSlider = createSlider(1, 100, xPos * 100);
    dPSlider = createSlider(1, 100, dPos * 100);
    m2Slider = createSlider(1, 10, mMass * 10);
    c1Slider = createSlider(1, 100, cDamp1 * 100);
    c2Slider = createSlider(1, 100, cDamp2 * 100);
    sliders = [mBSlider, k1Slider, k3Slider, c1Slider, xPSlider, m2Slider, k2Slider, dPSlider, c2Slider, fPSlider];
    let ypos = 60, sPerColumn = 5;
    sliders.forEach(function (s, i) {
        let xpos = (i < sPerColumn ? 25 : 155);
        s.position(xpos, ypos);
        s.style('width', '100px');
        s.parent('canvas');
        s.input(onSliderInput(i));
        ypos += (i !== sPerColumn - 1 ? 1 : (1 - sPerColumn)) * 60;
    });
}

function amp(x) {
    let w = x * TWO_PI, w2 = sq(x * TWO_PI), pos = [forcePos, xPos, dPos], resultsR = [], resultsI = []; //0 - 12    1 - 13    2 - 23      3 - 33
    for (let i in pos) {
        let eq1l = 12 * kSpring2 * (1 - pos[i]) - bMass * w2 * (4 - 6 * pos[i]);
        let eq2l = 12 * w * cDamp2 * (1 - pos[i]);
        let eq3 = (4 * kSpring1 - bMass * w2) * (4 * kSpring2 - bMass * w2) - 4 * kSpring2 * kSpring1 - 12 * w2 * cDamp2 * cDamp1;
        let eq4 = 4 * w * (cDamp1 * (3 * kSpring2 - bMass * w2) + cDamp2 * (3 * kSpring1 - bMass * w2));
        let eq1r = 12 * kSpring1 * pos[i] + bMass * w2 * (2 - 6 * pos[i]);
        let eq2r = 12 * w * cDamp1 * pos[i];
        let lr = (eq1l * eq3 + eq2l * eq4) / (sq(eq3) + sq(eq4));
        let li = (eq2l * eq3 - eq1l * eq4) / (sq(eq3) + sq(eq4));
        let rr = (eq1r * eq3 + eq2r * eq4) / (sq(eq3) + sq(eq4));
        let ri = (eq2r * eq3 - eq1r * eq4) / (sq(eq3) + sq(eq4));
        if (i === '0') {
            resultsR.push((1 - xPos) * lr + xPos * rr);
            resultsI.push((1 - xPos) * li + xPos * ri);
        }
        resultsR.push((1 - dPos) * lr + dPos * rr);
        resultsI.push((1 - dPos) * li + dPos * ri);
    }
    let eq1 = resultsR[1] * resultsR[2] - resultsI[1] * resultsI[2],
        eq2 = resultsR[1] * resultsI[2] + resultsI[1] * resultsR[2],
        eq3 = resultsR[3] + ((1 / kSpring3) - (1 / (mMass * w2))),
        eq4 = resultsI[3];
    let r = (eq1 * eq3 + eq2 * eq4) / (sq(eq3) + sq(eq4));
    let i = (eq2 * eq3 - eq1 * eq4) / (sq(eq3) + sq(eq4));
    return Math.sqrt(sq(resultsR[0] - r) + sq(resultsI[0] - i));
}



