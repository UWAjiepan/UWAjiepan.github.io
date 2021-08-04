let gold = '#DAA520', blue = '#5F9EA0', orange = '#FFA500';
let graph, m1Slider, k1Slider, c1Slider, m2Slider, k2Slider, c2Slider, sliders = [],
    mMass1 = 1.5, kMass1 = 400000, cMass1 = 150, mMass2 = 1.2, kMass2 = 200000, cMass2 = 3, peak1 = 0, peak2 = 0,
    deltaW1, w11 = 0,
    w12 = 200, deltaW2, w21 = 0, w22 = 200, xi1, xi2, modes;
let values = [mMass1, kMass1, cMass1, mMass2, kMass2, cMass2], factors = [100, 1, 1, 100, 1, 10];
let inputs = [],
    inputAttr = [[0.1, 2, 0.01], [50000, 450000, 1], [5, 500, 1], [0.1, 2, 0.01], [50000, 450000, 1], [0.1, 100, 0.1]];

function setup() {
    createCanvas(900, 900).parent('canvas');
    frameRate(20);
    createGraph();
    createSliders();
    createInputs();
    findPeak();
    findModes();
}

function draw() {
    background(255);
    updateSliders();
    graph.draw();
    drawPeak();
    drawValues();
    drawDiagram();
    drawLegend();
    drawFraction(290, 50, 'X₁', 'F₁');
    text("10⁻⁵ m/N", 305, 50);
    text('Receptance', 305, 65);
    text('Frequency (Hz)', 410, 430);
}

/*
        EVENT HANDLERS
*/

function updateSliders() {
    push();
    drawSubscript(24, 50, 'm', '1');
    text(':                 kg', 41, 50);
    drawSubscript(19, 110, 'k', '1');
    text(':                     N/m', 32, 110);
    drawSubscript(28, 170, 'c', '1');
    text(':                 Ns/m', 41, 170);
    drawSubscript(148, 50, "m", '2');
    text(':                 kg', 166, 50);
    drawSubscript(144, 110, "k", '2');
    text(':                     N/m', 157, 110);
    drawSubscript(153, 170, "c", '2');
    text(':                 Ns/m', 166, 170);
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

    findPeak();
    findModes();
}

/*

         SETUP FUNCTIONS

 */

function createInputs() {
    let startX = 45, startY = 35, cury = 0;
    for (let i = 0; i < sliders.length; i++) {
        let s = createInput(values[i].toString(), 'number');
        s.attribute('min', inputAttr[i][0]);
        s.attribute('max', inputAttr[i][1]);
        s.attribute('step', inputAttr[i][2]);
        s.elt.onblur = onTextInput(i, ...inputAttr[i]);
        s.parent('canvas');
        s.position(startX + (i < 3 ? 0 : 125) - (cury === 60 ? 9 : 0), startY + cury);
        s.style('width', (cury === 60 ? '65px' : '50px'));
        inputs.push(s);
        cury += (i === 2 ? -120 : 60)
    }
}

function createGraph() {
    graph = new StaticGraph(275, 50, 400, 350, [0, 200], [0, 3.5], 50, 0.5);
    graph.addPointsFunction('mode1', [], calcMode1, 1, orange);
    graph.addPointsFunction('mode2', [], calcMode2, 1, '#00FF00');
    graph.addPointsFunction('resp', [], calcResponse);
    graph.addPointsFunction('mf', [], calcModalFit, 1, '#FF0000');
    graph.addAnalysisLine('#0000FF', 1, calcResponse, []);
}

function createSliders() {
    m1Slider = createSlider(10, 200, mMass1 * 100);
    m2Slider = createSlider(10, 200, mMass2 * 100);
    k1Slider = createSlider(50000, 450000, kMass1);
    k2Slider = createSlider(50000, 450000, kMass2);
    c1Slider = createSlider(5, 500, cMass1);
    c2Slider = createSlider(1, 1000, cMass2 * 10);
    sliders = [m1Slider, k1Slider, c1Slider, m2Slider, k2Slider, c2Slider];
    let ypos = 60;
    sliders.forEach(function (s, i) {
        let xpos = (i < 3 ? 20 : 145);
        s.position(xpos, ypos);
        s.style('width', '100px');
        s.parent('canvas');
        s.input(onSliderInput(i));
        ypos += (i !== 2 ? 60 : -120);
    });
}

function drawValues() {
    drawSubscript(152, 384, `ω`, 'n1');
    drawSubscript(152, 444, `ω`, 'n2');
    text(`Mode 1\n         = ${(modes.w1 / TWO_PI).toFixed(1)} Hz\n    u₁ = ${((modes.mode1).toFixed(6) * 1).toPrecision(4)}\n\nMode 2\n         = ${(modes.w2 / TWO_PI).toFixed(2)} Hz\n    u₂ = ${((modes.mode2).toFixed(6) * 1).toPrecision(4)}`, 145, 370)
}

function drawLegend() {
    text(`Order of Drawing\n\n1             Mode 1\n\n2             Mode 2\n\n3             Exact Fit\n\n4             Modal Fit`, 145, 220);
    line(160, 305, 190, 305);
    push();
    stroke(orange);
    line(160, 245, 190, 245);
    stroke('#00ff00');
    line(160, 275, 190, 275);
    stroke('#ff0000');
    line(160, 335, 190, 335);
    pop();
}

function drawDiagram() {
    push();
    translate(665, -180);
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
    pop();
}

function findModes() {
    let eq1 = mMass1 * mMass2;
    let eq2 = -(mMass2 * kMass1 + mMass2 * kMass2 + mMass1 * kMass2);
    let eq3 = kMass1 * kMass2;
    let w1 = Math.sqrt((-eq2 - Math.sqrt(sq(eq2) - 4 * eq1 * eq3)) / 2 / eq1);
    let w2 = Math.sqrt((-eq2 + Math.sqrt(sq(eq2) - 4 * eq1 * eq3)) / 2 / eq1);
    modes = {
        w1: w1,
        w2: w2,
        mode1: kMass2 / (kMass2 - mMass2 * sq(w1)),
        mode2: kMass2 / (kMass2 - mMass2 * sq(w2))
    }
}

//1 - mode 1
function calcMode1(x) {
    let eq1 = kMass1 / ((1 - modes.mode2) / (modes.mode1 - modes.mode2));
    let w = x * TWO_PI;
    let eq2 = 1 - sq(w) / modes.w1 / modes.w1;
    let eq3 = -2 * xi1 * w / modes.w1;
    return Math.sqrt(sq(eq2 / (sq(eq2) + sq(eq3)) / eq1) + sq(eq3 / (sq(eq2) + sq(eq3)) / eq1)) * 10 ** 5;
}

//2 - mode 2
function calcMode2(x) {
    let eq1 = kMass1 / ((modes.mode1 - 1) / (modes.mode1 - modes.mode2));
    let w = x * TWO_PI;
    let eq2 = 1 - sq(w) / modes.w2 / modes.w2;
    let eq3 = -2 * xi2 * w / modes.w2;
    return Math.sqrt(sq(eq2 / (sq(eq2) + sq(eq3)) / eq1) + sq(eq3 / (sq(eq2) + sq(eq3)) / eq1)) * 10 ** 5;
}

//3 - exact
function calcResponse(x) {
    let w = TWO_PI * x;
    let eq1 = sq(kMass2) + sq(w * cMass2);
    let eq2 = kMass2 / eq1 - 1 / (mMass2 * sq(w));
    let eq3 = -w * cMass2 / eq1;
    let eq4 = kMass1 - mMass1 * sq(w) + eq2 / (sq(eq2) + sq(eq3));
    eq1 = w * cMass1 - eq3 / (sq(eq2) + sq(eq3));
    return Math.sqrt(sq(eq4 / (sq(eq4) + sq(eq1))) + sq(-eq1 / (sq(eq4) + sq(eq1)))) * 10 ** 5;
}

function drawPeak() {
    let y1 = graph.drawAnalysisLine(peak1);
    let y2 = graph.drawAnalysisLine(peak2);

    push();
    translate(graph.xZero, graph.yZero);
    if (350 > ((y1 / Math.sqrt(2)) * graph.yDens)) {
        text(`Q = ${((peak1 * TWO_PI) / deltaW1).toFixed(2)}`, 10 + (w12 / TWO_PI) * graph.xDens, 14 - ((y1) * graph.yDens));
        stroke('#0000ff');
        line((w11 / TWO_PI) * graph.xDens, -((y1 / Math.sqrt(2)) * graph.yDens), (w12 / TWO_PI) * graph.xDens, -((y1 / Math.sqrt(2))) * graph.yDens);
    }
    if (350 > (y1) * graph.yDens) {
        stroke('#0000ff');
        line(10 + (peak1) * graph.xDens, -((y1) * graph.yDens), -10 + (peak1) * graph.xDens, -((y1)) * graph.yDens);
        noStroke();
        text(`${peak1.toFixed(2)} Hz`, -18 + (peak1) * graph.xDens, -5 - ((y1) * graph.yDens));
    }
    if (350 > ((y2 / Math.sqrt(2)) * graph.yDens)) {
        text(`Q = ${((peak2 * TWO_PI) / deltaW2).toFixed(2)}`, 10 + (w22 / TWO_PI) * graph.xDens, 14 - ((y2) * graph.yDens));
        stroke('#0000ff');
        line((w21 / TWO_PI) * graph.xDens, -((y2 / Math.sqrt(2)) * graph.yDens), (w22 / TWO_PI) * graph.xDens, -((y2 / Math.sqrt(2))) * graph.yDens);
    }
    if (350 > (y2) * graph.yDens) {
        stroke('#0000ff');
        line(10 + (peak2) * graph.xDens, -((y2) * graph.yDens), -10 + (peak2) * graph.xDens, -((y2)) * graph.yDens);
        noStroke();
        text(`${peak2.toFixed(2)} Hz`, -18 + (peak2) * graph.xDens, -5 - ((y2) * graph.yDens));
    }
    pop();
}

function findPeak() {
    let max1 = 0, max2 = 0, found = false;
    let arr = [];
    for (let i = 0; i <= 200; i += 1 / 8) {
        let resp = calcResponse(i);
        arr.push(resp / (10 ** 5));
        let l = arr.length - 1;
        if (i > 3 && arr[l] < arr[l - 1] && arr[l - 1] > arr[l - 2]) {
            if (!found) {
                max1 = arr[l - 1];
                peak1 = (i - 1 / 8);
                found = true;
            } else {
                max2 = arr[l - 1];
                peak2 = (i - 1 / 8);
            }
        }
    }

    let maxIndex1 = arr.indexOf(max1);
    for (let i = maxIndex1; i > 0; i--) {
        if (arr[i] < (max1 / Math.sqrt(2)) &&
            arr[i + 1] > (max1 / Math.sqrt(2)))
            w11 = (TWO_PI * i / 8) + (((PI / 4) * ((max1 / Math.sqrt(2)) - arr[i])) / (arr[i + 1] - arr[i]));
    }
    for (let i = maxIndex1; i <= arr.length; i++) {
        if (arr[i] < (max1 / Math.sqrt(2)) &&
            arr[i - 1] > (max1 / Math.sqrt(2)))
            w12 = (TWO_PI * i / 8) - (((PI / 4) * ((max1 / Math.sqrt(2)) - arr[i])) / (arr[i - 1] - arr[i]));
    }
    deltaW1 = w12 - w11;
    xi1 = deltaW1 / (2 * peak1 * TWO_PI);

    let maxIndex2 = arr.indexOf(max2);
    for (let i = maxIndex2; i > maxIndex1; i--) {
        if (arr[i] < (max2 / Math.sqrt(2)) &&
            arr[i + 1] > (max2 / Math.sqrt(2)))
            w21 = (TWO_PI * i / 8) + (((PI / 4) * ((max2 / Math.sqrt(2)) - arr[i])) / (arr[i + 1] - arr[i]));
    }
    for (let i = maxIndex2; i <= arr.length; i++) {
        if (arr[i] < (max2 / Math.sqrt(2)) &&
            arr[i - 1] > (max2 / Math.sqrt(2)))
            w22 = (TWO_PI * i / 8) - (((PI / 4) * ((max2 / Math.sqrt(2)) - arr[i])) / (arr[i - 1] - arr[i]));
    }
    deltaW2 = w22 - w21;
    xi2 = deltaW2 / (2 * peak2 * TWO_PI);

}

//4 - modal fit
function calcModalFit(x) {
    let eq1 = kMass1 / ((1 - modes.mode2) / (modes.mode1 - modes.mode2));
    let w = x * TWO_PI;
    let eq2 = 1 - sq(w) / modes.w1 / modes.w1;
    let eq3 = -2 * xi1 * w / modes.w1;
    let r1 = eq2 / (sq(eq2) + sq(eq3)) / eq1;
    let q1 = eq3 / (sq(eq2) + sq(eq3)) / eq1;
    eq1 = kMass1 / ((modes.mode1 - 1) / (modes.mode1 - modes.mode2));
    eq2 = 1 - sq(w) / modes.w2 / modes.w2;
    eq3 = -2 * xi2 * w / modes.w2;
    let r2 = eq2 / (sq(eq2) + sq(eq3)) / eq1;
    let q2 = eq3 / (sq(eq2) + sq(eq3)) / eq1;
    return Math.sqrt(sq(r1 + r2) + sq(q1 + q2)) * 10 ** 5;
}