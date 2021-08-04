let kSlider, mSlider, sliders = [];
let m = 0.5, k = 2, values = [m, k], factors = [10, 10];
let inputs = [], inputAttr = [[0.2, 5, 0.1], [0.2, 5, 0.1]];
let graph1, graph2;

function setup() {
    createCanvas(720, 1000).parent('canvas');
    createSliders();
    createInputs();

    graph1 = new StaticGraph(150, 40, 350, 340, [0, 5], [-3, 3], 1, 1);
    graph1.addPointsFunction("m1", [], amp11, 1, 'red');
    graph1.addPointsFunction("m2", [], amp12, 1, 'blue');
    graph1.addPointsFunction("total", [], amp1T);

    graph2 = new StaticGraph(150, 410, 350, 340, [0, 5], [-3, 3], 1, 1);
    graph2.addPointsFunction("m1", [], amp21, 1, 'red');
    graph2.addPointsFunction("m2", [], amp22, 1, 'blue');
    graph2.addPointsFunction("total", [], amp2T);
}

function draw() {
    background(255);
    updateSliders();
    graph1.draw();
    graph2.draw();

    //diagram drawing
    push();
    text("Total", 70, 365);
    line(30, 362, 60, 362);
    text("Mode 1", 70, 385);
    text("Mode 2", 70, 405);
    stroke('red');
    line(30, 382, 60, 382);
    stroke('blue');
    line(30, 402, 60, 402);
    pop();
    push();
    drawSubscript(155, 33, 'x', '1');
    line(154, 39, 167, 39);
    drawSubscript(155, 49, 'x', '0');
    drawSubscript(155, 404, 'x', '2');
    line(154, 410, 167, 410);
    drawSubscript(155, 420, 'x', '0');
    drawFraction(520, 205, 'ω', '');
    drawSubscript(514, 222, 'ω', 'n1');
    drawFraction(520, 575, 'ω', '');
    drawSubscript(514, 592, 'ω', 'n2');
    drawSubscript(560, 80, 'k', '1');
    drawSubscript(560, 220, 'k', '2');
    drawSubscript(650, 55, 'x', '0');
    drawSubscript(520, 160, 'x', '1');
    drawSubscript(520, 310, 'x', '2');
    strokeWeight(3);
    line(550, 20, 630, 20);
    strokeWeight(1);
    drawSpring(590, 20, 22, 110, 11);
    drawSpring(590, 160, 22, 110, 11);
    fill('lightseagreen');
    stroke('lightseagreen');
    rect(560, 130, 60, 30);
    rect(560, 270, 60, 30);
    line(560, 145, 530, 145);
    line(560, 285, 530, 285);
    triangle(545, 178, 540, 170, 550, 170);
    triangle(545, 318, 540, 310, 550, 310);
    strokeWeight(3);
    strokeCap(SQUARE);
    line(545, 145, 545, 170);
    line(545, 285, 545, 310);
    stroke('#FFB90F');
    fill('#FFB90F');
    line(645, 20, 645, 45);
    strokeWeight(1);
    line(630, 20, 660, 20);
    triangle(645, 53, 640, 45, 650, 45);
    pop();
    push();
    drawSubscript(585, 150, 'm', '1');
    drawSubscript(585, 290, 'm', '2');
    pop();

}

/*
        DRAWING FUNCTIONS
*/

function updateSliders() {
    push();
    drawSubscript(20, 30, 'm', '2');
    line(36, 35, 19, 35);
    drawSubscript(20, 46, 'm', '1');
    text(':', 37, 38);
    drawSubscript(20, 95, 'k', '2');
    line(33, 100, 19, 100);
    drawSubscript(20, 111, 'k', '1');
    text(':', 34, 103);
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
    m = values[0];
    k = values[1];
}


/*

         SETUP FUNCTIONS

 */

function createInputs() {
    let startX = 40, startY = 25;
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
    kSlider = createSlider(2, 50, 20);
    kSlider.position(15, 120);
    kSlider.style('width', '80px');
    kSlider.parent('canvas');
    mSlider = createSlider(2, 50, 5);
    mSlider.position(15, 55);
    mSlider.style('width', '80px');
    mSlider.parent('canvas');
    sliders = [mSlider, kSlider];
    mSlider.input(onSliderInput(0));
    kSlider.input(onSliderInput(1));
}

/*
        MATH FUNCTIONS
*/

function premath() {
    let mf = mSlider.value() / 10, kf = kSlider.value() / 10;
    let int1 = mf + mf * kf + kf, int2 = Math.sqrt(Math.pow(int1, 2) - 4 * mf * kf);
    let root1 = (int1 - int2) / (2 * mf), root2 = (int1 + int2) / (2 * mf);
    let mode1 = 1 / (1 - mf * root1 / kf), mode2 = 1 / (1 - mf * root2 / kf);
    let w1 = Math.sqrt(root1), w2 = Math.sqrt(root2);
    let int3 = (1 - mode2) / (mode1 - mode2), int4 = (mode1 - 1) / (mode1 - mode2);
    return {
        w1: w1,
        w2: w2,
        int1: int3,
        int2: int4,
        mode1: mode1,
        mode2: mode2
    }
}

function amp11(x) {
    let pm = premath();
    return pm.int1 / (1 - x * x / pm.w1 / pm.w1);
}

function amp12(x) {
    let pm = premath();
    return pm.int2 / (1 - x * x / pm.w2 / pm.w2);
}

function amp1T(x) {
    return amp11(x) + amp12(x);
}

function amp21(x) {
    return amp11(x) * premath().mode1;
}

function amp22(x) {
    return amp12(x) * premath().mode2;
}

function amp2T(x) {
    return amp22(x) + amp21(x);
}