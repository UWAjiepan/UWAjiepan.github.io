let mBSlider, m2Slider, k1Slider, k2Slider, k3Slider, fPSlider, xPSlider, dPSlider, sliders = [], animSlider;
let bMass = 1, mMass = 0.5, kSpring1 = 10, kSpring2 = 10, kSpring3 = 10, forcePos = 0.3, xPos = 0.6, dPos = 0.8, t = 0,
    dt = 1 / 100;
let values = [bMass, kSpring1, kSpring3, xPos, mMass, kSpring2, forcePos, dPos],
    factors = [10, 10, 10, 100, 10, 10, 100, 100];
let inputs = [],
    inputAttr = [[0.2, 2, 0.1], [0.1, 20, 0.1], [0.1, 10, 0.1], [0.01, 1, 0.01], [0.1, 1, 0.1], [0.1, 20, 0.1], [0.01, 1, 0.01], [0.01, 1, 0.01]];
let graph;

function setup() {
    createCanvas(920, 900).parent('canvas');
    createSliders();
    createInputs();
    animSlider = createSlider(1, 8000, 2000);
    animSlider.position(323, 445);
    animSlider.style('width', '560px');
    animSlider.parent('canvas');
    graph = new StaticGraph(330, 50, 550, 350, [0, 8], [-5, 1], 1, 'log');
    graph.addPointsFunction('amp', [], amp, 1, 'red');
    graph.addAnalysisLine('mediumblue', 1, amp, 0);

}

function draw() {
    background(255);
    updateSliders();
    graph.draw();
    text('Frequency     (Hz)', 570, 430);
    drawFraction(275, 60, 'X', 'F', 12, 'red');
    drawFraction(300, 60, 'm', 'N');
    push();
    translate(0, 50);
    drawSubscript(25, 335, 'k', '1');
    drawSubscript(190, 335, 'k', '2');
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
    drawSpring(52, 312, 13, 45, 5);
    drawSpring(178, 312, 13, 45, 5);
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

    drawAnim();

    if (focused) t += dt;
}

function updateSliders() {
    push();
    drawSubscript(13, 50, "m", 'beam');
    text(':                 kg', 51, 50);
    drawSubscript(38, 110, 'k', '1');
    text(':                 N/m', 51, 110);
    drawSubscript(38, 170, 'k', '2');
    text(':                 N/m', 51, 170);
    text('X Pos:', 20, 230);
    drawSubscript(163, 50, "m", '2');
    text(':                 kg', 181, 50);
    drawSubscript(168, 110, 'k', '3');
    text(':                 N/m', 181, 110);
    text('F Pos:', 149, 170);
    text('D Pos:', 149, 230);
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
    xPos = values[3];
    mMass = values[4];
    kSpring2 = values[5];
    forcePos = values[6];
    dPos = values[7];
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
        s.position(startX + (i < 4 ? 0 : 130), startY + cury);
        s.style('width', '50px');
        inputs.push(s);
        cury += (i === 3 ? -180 : 60)
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
    sliders = [mBSlider, k1Slider, k3Slider, xPSlider, m2Slider, k2Slider, fPSlider, dPSlider];
    let ypos = 60;
    sliders.forEach(function (s, i) {
        let xpos = (i < 4 ? 25 : 155);
        s.position(xpos, ypos);
        s.style('width', '100px');
        s.parent('canvas');
        s.input(onSliderInput(i));
        ypos += (i !== 3 ? 60 : -180);
    });
}

function receptance(x) {
    let w = x * TWO_PI, pos = [forcePos, xPos, dPos], receptance = []; //0 - 12    1 - 13    2 - 23    3 - 33    4 - A12
    for (let i in pos) {
        let eq1 = 12 * kSpring2 * (1 - pos[i]) - bMass * sq(w) * (4 - 6 * pos[i]);
        let eq2 = (4 * kSpring1 - bMass * sq(w)) * (4 * kSpring2 - bMass * sq(w)) - 4 * kSpring2 * kSpring1;
        let eq3 = 12 * kSpring1 * pos[i] + bMass * sq(w) * (2 - 6 * pos[i]);
        let l = (eq1 * eq2) / sq(eq2);
        receptance[`L${(i * 1) + 1}`] = l;
        let r = (eq3 * eq2) / sq(eq2);
        receptance[`R${(i * 1) + 1}`] = r;
        if (i === '0') {
            receptance.push((1 - xPos) * l + xPos * r);
        }
        receptance.push((1 - dPos) * l + dPos * r);
    }
    let eq1 = receptance[1] * receptance[2], eq2 = receptance[3] + ((1 / kSpring3) - (1 / (mMass * sq(w)))),
        eq3 = (eq1 * eq2) / sq(eq2);
    receptance.push(receptance[0] - eq3);
    return receptance;
}

function amp(x) {
    return abs(receptance(x)[4]);
}

function disp(x) {
    let re = receptance(x), w = sq(x * TWO_PI);
    let eq1 = (re[4] - re[0]) / re[2];
    let l = re["L1"] + re['L3'] * eq1;
    let r = re["R1"] + re["R3"] * eq1;
    let d = eq1 / (mMass * w);
    let scale = Math.max(abs(l), abs(r), abs(d));
    return [l, r, d].map(x => (x * 20) / scale);
}

function drawAnim() {
    let w = animSlider.value() / 1000;
    graph.drawAnalysisLine(w);
    let di = disp(w);
    let l = di[0] * Math.cos(TWO_PI * t);
    let r = di[1] * Math.cos(TWO_PI * t);
    let d = di[2] * Math.cos(TWO_PI * t);
    push();
    fill('mediumblue');
    text(`${w.toFixed(2)} Hz`, graph.xZero + (w * graph.xDens) + 5, 390);
    translate(0, 30);
    drawSpring(lerp(100, 450, dPos), 468 + d, 13, 49 + lerp(l, r, dPos) - d, 7);
    drawSpring(100, 520 + l, 18, 100 - l, 9);
    drawSpring(447, 520 + r, 18, 100 - r, 9);
    stroke('orange');
    strokeWeight(3);
    let force = 35 * Math.cos(TWO_PI * t);
    line(lerp(100, 450, forcePos), 520 + lerp(l, r, forcePos), lerp(100, 450, forcePos), 520 + lerp(l, r, forcePos) - force);
    stroke('gold');
    fill('gold');
    rect(85, 620, 380, 20);
    stroke('cadetblue');
    fill('cadetblue');
    line(100, 520 + l, 450, 520 + r);
    rect(lerp(100, 450, dPos) - 10, 460 + d, 20, 10);
    strokeWeight(2);
    line(lerp(100, 450, xPos), 513 + lerp(l, r, xPos), lerp(100, 450, xPos), 527 + lerp(l, r, xPos));
    pop();
}

