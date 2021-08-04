let gold = '#DAA520', red = '#FF0000', blue = '#0000FF';
let m1Slider, m2Slider, k1Slider, sliders = [];
let mMass1 = 1, mMass2 = 1, kSpring1 = 1, values = [mMass1, mMass2, kSpring1],
    factors = [10, 10, 10];
let inputs = [], inputAttr = [[0.5, 10, 0.1], [0.5, 10, 0.1], [0.2, 10, 0.1]];
let graph;
let t = 0, dt = 1 / 100;
let ev, evec1, evec2;

function setup() {
    createCanvas(920, 900).parent('canvas');
    frameRate(15);
    createSliders();
    createInputs();
    updateEigenvalues();

    graph = new StaticGraph(250, 50, 470, 350, [0, 6], [-4, 2], 1, 'log');
    graph.addPointsFunction('1', [], mass1Calc, 1, red);
    graph.addPointsFunction('2', [], mass2Calc, 1, blue);
}

function draw() {
    background(255);
    updateSliders();
    graph.draw();
    text('Frequency     (rad/s)', 370, 430);
    drawFraction(175, 60, 'X', 'F');
    drawFraction(200, 60, 'm', 'N');


    push();
    line(25, 295, 190, 295);
    line(25, 315, 190, 315);
    line(80, 320, 80, 270);
    line(135, 320, 135, 295);
    fill('#000000');
    triangle(25, 315, 32, 310, 32, 320);
    triangle(78, 315, 71, 310, 71, 320);
    triangle(82, 315, 89, 310, 89, 320);
    triangle(133, 315, 126, 310, 126, 320);
    triangle(137, 315, 144, 310, 144, 320);
    triangle(190, 315, 183, 310, 183, 320);
    triangle(80, 263, 75, 270, 85, 270);
    fill(gold);
    stroke(gold);
    rect(10, 280, 15, 50);
    rect(190, 280, 15, 50);
    fill(red);
    stroke(red);
    circle(80, 295, 18);
    fill(blue);
    stroke(blue);
    circle(135, 295, 18);
    pop();

    drawSubscript(65, 262, 'F', '1');
    drawSubscript(72, 298, 'm', '1', 11);
    drawSubscript(127, 298, 'm', '2', 11, '#FFFFFF');
    text('a               a               a', 47, 325);
    text('K = ', 87, 270);
    drawFraction(120, 270, 'T₀', 'a', 11);

    if (focused) t += dt;

}

function updateSliders() {
    push();
    drawSubscript(30, 50, "m", '1');
    text(':                 kg', 46, 50);
    drawSubscript(30, 110, 'm', '2');
    text(':                 kg', 46, 110);
    text('K = T₀ / a:                 N/m', 10, 170);
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
    mMass2 = values[1];
    kSpring1 = values[2];
    updateEigenvalues();

}

/*

         SETUP FUNCTIONS

 */

function createInputs() {
    let startX = 50, startY = 35;
    for (let i = 0; i < sliders.length; i++) {
        let s = createInput(values[i].toString(), 'number');
        s.attribute('min', inputAttr[i][0]);
        s.attribute('max', inputAttr[i][1]);
        s.attribute('step', inputAttr[i][2]);
        s.elt.onblur = onTextInput(i, ...inputAttr[i]);
        s.parent('canvas');
        s.position(startX + (i === 2 ? 15 : 0), startY + i * 60);
        s.style('width', '50px');
        inputs.push(s);
    }
}

function createSliders() {
    m1Slider = createSlider(5, 100, mMass1 * 10);
    k1Slider = createSlider(2, 100, kSpring1 * 10);
    m2Slider = createSlider(5, 100, mMass2 * 10);
    sliders = [m1Slider, m2Slider, k1Slider];
    let ypos = 60;
    sliders.forEach(function (s, i) {
        let xpos = 25;
        s.position(xpos, ypos);
        s.style('width', '100px');
        s.parent('canvas');
        s.input(onSliderInput(i));
        ypos += 60;
    });
}

function mass1Calc(x) {
    let mode1 = mMass1 * sq(evec1[0]) + mMass2 * sq(evec1[1]);
    let mode2 = mMass1 * sq(evec2[0]) + mMass2 * sq(evec2[1]);
    return Math.abs((sq(evec1[0])) / (mode1 * (Math.abs(ev[0]) - sq(x * TWO_PI / 6))) + (sq(evec2[0])) / (mode2 * (Math.abs(ev[1]) - sq(x * TWO_PI / 6))));
}

function mass2Calc(x) {
    let mode1 = mMass1 * sq(evec1[0]) + mMass2 * sq(evec1[1]);
    let mode2 = mMass1 * sq(evec2[0]) + mMass2 * sq(evec2[1]);
    return Math.abs((evec1[0] * evec1[1]) / (mode1 * (Math.abs(ev[0]) - sq(x * TWO_PI / 6))) + (evec2[0] * evec2[1]) / (mode2 * (Math.abs(ev[1]) - sq(x * TWO_PI / 6))));
}

function updateEigenvalues() {
    let mat1 = Matrix.create([
        [mMass1, 0],
        [0, mMass2]]);
    let mat2 = Matrix.create([
        [2 * kSpring1, -kSpring1],
        [-kSpring1, 2 * kSpring1]]);
    ev = eigenvalues(mat1, mat2);
    evec1 = Matrix.eigenstructure(Matrix.sub(mat2, Matrix.scale(mat1, ev[0]))).V.mat;
    evec1 = [evec1[1][0], evec1[0][0]];
    evec2 = Matrix.eigenstructure(Matrix.sub(mat2, Matrix.scale(mat1, ev[1]))).V.mat;
    evec2 = [evec2[1][0], evec2[0][0]];
}
