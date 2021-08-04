let m1Slider, k1Slider, k2Slider, m2Slider, sliders = [];
let mMass1 = 1, kMass1 = 1, kMass2 = 1, mMass2 = 1, values = [kMass1, mMass1, kMass2, mMass2],
    factors = [10, 10, 10, 10];
let inputs = [], inputAttr = [[1, 5, 0.1], [1, 5, 0.1], [1, 5, 0.1], [1, 5, 0.1],];
let graph;

function setup() {
    createCanvas(920, 460).parent('canvas');
    createSliders();
    createInputs();
    graph = new StaticGraph(250, 50, 550, 350, [-19, 1], [0, 4.5], 2, 0.5);
    graph.addPointsFunction("g", [], eqq, 1, "cadetblue", 2);
}

function draw() {
    background(255);
    updateSliders();
    graph.draw();
    graph.addModeInfo();

    drawFraction(820, 55, "k", 'm');
    drawSubscript(515, 425, 'A', '1');
    line(512, 430, 531, 430);
    drawSubscript(515, 445, 'A', '2');
    line(810, 40, 803, 78);
    line(803, 78, 800, 71);
    line(810, 40, 830, 40);
    fill('black');
    line(800, 400, 800, 403);
    text('1', 796, 413);
    push();
    stroke('gold');
    fill('gold');
    rect(30, 20, 50, 25);
    pop();
    drawSpring(55, 45, 18, 90, 9);
    drawSpring(55, 155, 18, 90, 9);
    push();
    stroke('cadetblue');
    fill('cadetblue');
    rect(40, 135, 30, 20);
    rect(40, 245, 30, 20);
    pop();
}


/*
        DRAWING FUNCTIONS
*/

function updateSliders() {
    push();
    drawSubscript(103, 60, "k", '1');
    text(':              N/m', 115, 60);
    drawSubscript(99, 120, 'm', '1');
    text(':              kg', 115, 120);
    drawSubscript(103, 180, "k", '2');
    text(':              N/m', 115, 180);
    drawSubscript(99, 240, 'm', '2');
    text(':              kg', 115, 240);
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
    kMass1 = values[0];
    mMass1 = values[1];
    kMass2 = values[2];
    mMass2 = values[3];
}

/*

         SETUP FUNCTIONS

 */

function createInputs() {
    let startX = 120, startY = 45;
    for (let i = 0; i < sliders.length; i++) {
        let s = createInput(values[i].toString(), 'number');
        s.attribute('min', inputAttr[i][0]);
        s.attribute('max', inputAttr[i][1]);
        s.attribute('step', inputAttr[i][2]);
        s.elt.onblur = onTextInput(i, ...inputAttr[i]);
        s.parent('canvas');
        s.position(startX, startY + i * 60);
        s.style('width', '40px');
        inputs.push(s);
    }
}

function createSliders() {
    m1Slider = createSlider(10, 50, mMass1 * 10);
    k1Slider = createSlider(10, 50, kMass1 * 10);
    k2Slider = createSlider(10, 50, kMass2 * 10);
    m2Slider = createSlider(10, 50, mMass2 * 10);
    sliders = [k1Slider, m1Slider, k2Slider, m2Slider];
    let ypos = 70;
    sliders.forEach(function (s, i) {
        let xpos = 90;
        s.position(xpos, ypos);
        s.style('width', '100px');
        s.parent('canvas');
        s.input(onSliderInput(i));
        ypos += 60;
    });
}

function eqq(x) {
    return Math.sqrt((kMass1 * sq(x) + kMass2 * sq(1 - x)) / (mMass1 * sq(x) + mMass2));
}

function findModes() {
    let eqa = mMass1 * mMass2;
    let eqb = -(mMass2 * kMass1 + mMass2 * kMass2 + mMass1 * kMass2);
    let eqc = kMass1 * kMass2;
    let roota = Math.sqrt((-eqb - Math.sqrt(sq(eqb) - 4 * eqa * eqc)) / (2 * eqa));
    let rootb = Math.sqrt((-eqb + Math.sqrt(sq(eqb) - 4 * eqa * eqc)) / (2 * eqa));
    let mode1 = kMass2 / (kMass1 + kMass2 - mMass1 * sq(roota));
    let mode2 = kMass2 / (kMass1 + kMass2 - mMass1 * sq(rootb));
    return {
        r1: roota,
        r2: rootb,
        m1: mode1,
        m2: mode2
    }
}

StaticGraph.prototype.addModeInfo = function () {
    let modes = findModes();
    push();
    fill('blue');
    text(`${(modes.m1).toFixed(3)}`, (this.xZero + (modes.m1 * this.xDens)) + 5, this.yZero - 5);
    text(`${(modes.r1).toFixed(3)}`, (this.xZero + (modes.m1 * this.xDens)) + 20, this.yZero + -(modes.r1 * this.yDens) + 5);
    text(`${(modes.m2).toFixed(3)}`, (this.xZero + (modes.m2 * this.xDens)) - 45, this.yZero - 5);
    text(`${(modes.r2).toFixed(3)}`, (this.xZero + (modes.m2 * this.xDens)) - 45, this.yZero + -(modes.r2 * this.yDens) + 20);
    stroke('blue');
    line(this.xZero + (modes.m1 * this.xDens), this.yZero, this.xZero + (modes.m1 * this.xDens), this.yZero + -(modes.r1 * this.yDens));

    line(this.xZero + (modes.m2 * this.xDens), this.yZero, this.xZero + (modes.m2 * this.xDens), this.yZero + -(modes.r2 * this.yDens));
    pop();
};


