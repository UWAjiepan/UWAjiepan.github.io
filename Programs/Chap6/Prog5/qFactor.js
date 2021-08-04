let gold = '#DAA520', blue = '#5F9EA0', orange = '#FFA500';
let graph, mSlider, kSlider, cSlider, sliders = [], mMass = 1, kMass = 400000, cMass = 50, peak = 0, deltaW, w = 0,
    w2 = 200;
let values = [mMass, kMass, cMass], factors = [100, 1, 1];
let inputs = [], inputAttr = [[0.5, 2, 0.01], [150000, 450000, 1], [1, 500, 1]];
let feq, dreq, qeq;


function preload() {
    feq = loadImage('../../../assets/feq.png');
    dreq = loadImage('../../../assets/dreq.png');
    qeq = loadImage('../../../assets/qeq.png');
}


function setup() {
    createCanvas(900, 900).parent('canvas');
    frameRate(20);
    createGraph();
    createSliders();
    createInputs();
    findPeak();
    feq.resize(70, 0);
    dreq.resize(70, 0);
}

function draw() {
    background(255);
    updateSliders();
    graph.draw();
    drawPeak();
    drawValues();
    drawDiagram();
    drawFraction(65, 50, 'X', 'F');
    text("10⁻⁵ m/N", 80, 50);
    text('Receptance', 80, 65);
    text('Frequency (Hz)', 185, 430);
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
    mMass = values[0];
    kMass = values[1];
    cMass = values[2];

    findPeak();
}

/*

         SETUP FUNCTIONS

 */

function createInputs() {
    let startX = 465, startY = 35, cury = 0;
    for (let i = 0; i < sliders.length; i++) {
        let s = createInput(values[i].toString(), 'number');
        s.attribute('min', inputAttr[i][0]);
        s.attribute('max', inputAttr[i][1]);
        s.attribute('step', inputAttr[i][2]);
        s.elt.onblur = onTextInput(i, ...inputAttr[i]);
        s.parent('canvas');
        s.position(startX - (i === 1 ? 9 : 0), startY + i * 60);
        s.style('width', (i === 1 ? '65px' : '50px'));
        inputs.push(s);
    }
}

function createGraph() {
    graph = new StaticGraph(50, 50, 350, 350, [0, 200], [0, 3.5], 50, 0.5);
    graph.addPointsFunction('resp', [], calcResponse);
    graph.addAnalysisLine('#0000FF', 1, calcResponse, []);
}

function createSliders() {
    mSlider = createSlider(50, 200, mMass * 100);
    kSlider = createSlider(150000, 450000, kMass);
    cSlider = createSlider(1, 500, cMass);
    sliders = [mSlider, kSlider, cSlider];
    let ypos = 60;
    sliders.forEach(function (s, i) {
        let xpos = 440;
        s.position(xpos, ypos);
        s.style('width', '100px');
        s.parent('canvas');
        s.input(onSliderInput(i));
        ypos += 60;
    });
}

function updateSliders() {
    text(`m:                 kg`, 450, 50);
    text(`k:                      N/m`, 444, 110);
    text(`c:                 Ns/m`, 453, 170);
}

function drawValues() {
    text(`Resonant Frequency: ${peak.toFixed(2)} Hz`, 450, 235);
    text(`Δω: ${(deltaW / TWO_PI).toFixed(2)} Hz`, 450, 255);
    text(`Q: ${((TWO_PI * peak) / deltaW).toFixed(2)}`, 450, 275);
    image(feq, 455, 280);
    text(` = ${(Math.sqrt(kMass / mMass) / TWO_PI).toFixed(2)} Hz`, 525, 305);
    image(dreq, 455, 325);
    text(` = ${(cMass / (2 * Math.sqrt(kMass * mMass))).toFixed(5)} Hz`, 525, 345);
    image(qeq, 455, 370);
    text(` = ${(Math.sqrt(mMass * kMass) / cMass).toFixed(2)}`, 515, 395);
}

function drawDiagram() {
    push();
    translate(120, -50);
    push();
    drawSpring(570, 70, 30, 209, 11);
    fill(blue);
    rect(550, 280, 70, 40);
    pop();
    strokeWeight(3);
    line(550, 70, 620, 70);
    strokeWeight(1);
    rect(595, 71, 12, 110);
    drawDamper(601, 280, 150);
    push();
    textSize(15);
    text("m", 579, 305);
    text("k", 545, 135);
    text("c", 615, 133);
    textSize(13);
    text("Xsin(ωt + ϕ)", 535, 350);
    text("Fsin(ωt)", 655, 325);
    strokeCap(SQUARE);
    stroke(blue);
    strokeWeight(2);
    line(515, 300, 549, 300);
    triangle(520, 340, 530, 340, 525, 350);
    strokeWeight(4);
    line(525, 300, 525, 340);
    strokeWeight(2);
    stroke(orange);
    line(621, 300, 655, 300);
    triangle(640, 325, 650, 325, 645, 335);
    strokeWeight(4);
    line(645, 300, 645, 325);
    pop();
    pop();
}

function findPeak() {
    let max = 0;
    let arr = [];
    for (let i = 0; i <= 200; i += 1 / 10) {
        let resp = calcResponse(i);
        arr.push(resp / 10 ** 5);
        if (resp > max) {
            max = resp;
            peak = i;
        }
    }
    max /= 10 ** 5;
    let maxIndex = arr.indexOf(max);
    for (let i = maxIndex; i > 0; i--) {
        if (arr[i] < (max / Math.sqrt(2)) &&
            arr[i + 1] > (max / Math.sqrt(2)))
            w = (TWO_PI * i / 10) + (((PI / 4) * ((max / Math.sqrt(2)) - arr[i])) / (arr[i + 1] - arr[i]));
    }
    for (let i = maxIndex; i <= arr.length; i++) {
        if (arr[i] < (max / Math.sqrt(2)) &&
            arr[i - 1] > (max / Math.sqrt(2)))
            w2 = (TWO_PI * i / 10) - (((PI / 4) * ((max / Math.sqrt(2)) - arr[i])) / (arr[i - 1] - arr[i]));
    }
    deltaW = w2 - w;
}

function drawPeak() {
    let y = graph.drawAnalysisLine(peak);
    push();
    stroke('#0000ff');
    if (350 > ((y / Math.sqrt(2)) * graph.yDens)) line(50 + (w / TWO_PI) * graph.xDens, 400 - ((y / Math.sqrt(2)) * graph.yDens), 50 + (w2 / TWO_PI) * graph.xDens, 400 - ((y / Math.sqrt(2))) * graph.yDens);
    if (350 > (y) * graph.yDens) line(40 + (peak) * graph.xDens, 400 - ((y) * graph.yDens), 60 + (peak) * graph.xDens, 400 - ((y)) * graph.yDens);
    pop();
}

function calcResponse(x) {
    let w = TWO_PI * x;
    return (1 / Math.sqrt(sq(kMass - mMass * sq(w)) + sq(cMass * w))) * 10 ** 5;
}