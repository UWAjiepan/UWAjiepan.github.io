let gold = '#DAA520', red = '#FF0000', blue = '#0000FF', orange = '#FFA500', cblue = '#5F9EA0';
let lSlider, dSlider, sliders = [], animSlider;
let lBeam = 0.7, dBeam = 0.15, values = [lBeam, dBeam],
    factors = [10, 100];
let inputs = [], inputAttr = [[0.2, 2, 0.1], [0.1, 0.2, 0.01]];
let graph;


function setup() {
    createCanvas(920, 900).parent('canvas');
    createSliders();
    createInputs();
    frameRate(24);

    graph = new StaticGraph(250, 50, 470, 400, [0, 5000], [-13, -3], 1000, 'log');
    graph.addPointsFunction('1', [], calcResponseWithout, 1, cblue);
    graph.addPointsFunction('1', [], calcResponseWith, 1, '#ff0000');
    graph.pointObjects[0].dens = 2.5;
}

function draw() {
    background(255);
    updateSliders();
    graph.draw();
    text('Frequency     (Hz)', 455, 480);
    text('Receptance', 150, 95);

    drawFraction(175, 60, 'X', 'F');
    drawFraction(200, 60, 'm', 'N');

    drawDiagram();
    drawAnim();
}

function drawDiagram() {
    text('Bernoulli / Euler', 80, 305);
    text('Shear and rotary inertia', 80, 325);
    push();
    stroke(cblue);
    line(50, 300, 75, 300);
    stroke('#ff0000');
    line(50, 320, 75, 320);
    stroke(blue);
    rect(45, 205, 90, 20);
    pop();
    push();
    fill(blue);
    text('X', 150, 265);
    fill(orange);
    text('F', 150, 245);
    stroke(orange);
    rect(29, 185, 15, 60);
    pop();

    line(45, 195, 45, 180);
    line(135, 195, 135, 180);
    line(105, 205, 105, 245);
    line(135, 225, 135, 270);
    line(45, 187, 83, 187);
    line(135, 187, 96, 187);
    line(135, 240, 147, 240);
    line(135, 260, 147, 260);
    text('D', 110, 250);
    text('L', 87, 192);
    push();
    fill('#000000');
    triangle(45, 187, 50, 183, 50, 191);
    triangle(135, 187, 130, 183, 130, 191);
    triangle(147, 240, 142, 244, 142, 236);
    triangle(147, 260, 142, 264, 142, 256);
    triangle(105, 205, 101, 210, 109, 210);
    triangle(105, 225, 101, 220, 109, 220);
    pop();
}

/*
        EVENT HANDLERS
*/

function updateSliders() {
    push();
    text('Length:                 m', 33, 50);
    text('Diameter:                 m', 23, 110);
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
    lBeam = values[0];
    dBeam = values[1];
}

/*

         SETUP FUNCTIONS

 */

function createInputs() {
    let startX = 75, startY = 35;
    for (let i = 0; i < sliders.length; i++) {
        let s = createInput(values[i].toString(), 'number');
        s.attribute('min', inputAttr[i][0]);
        s.attribute('max', inputAttr[i][1]);
        s.attribute('step', inputAttr[i][2]);
        s.elt.onblur = onTextInput(i, ...inputAttr[i]);
        s.parent('canvas');
        s.position(startX, startY + i * 60);
        s.style('width', '50px');
        inputs.push(s);
    }
}

function createSliders() {
    lSlider = createSlider(2, 20, lBeam * 10);
    dSlider = createSlider(10, 20, dBeam * 100);
    sliders = [lSlider, dSlider];
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

function calcResponseWithout(x) {
    let a = PI * sq(dBeam) / 4;
    let inertia = a * sq(dBeam) / 16;
    let w = x * TWO_PI;
    let lambda = Math.sqrt(Math.sqrt(sq(w) * a * 7800 / (2E11 * inertia)));
    let lamlen = lambda * lBeam;
    let s = Math.sin(lamlen);
    let c = Math.cos(lamlen);
    let sh = Math.sinh(lamlen);
    let ch = Math.cosh(lamlen);
    return Math.abs(-1 * (c * sh - s * ch) * (1 / (2E11 * inertia * (lambda ** 3) * (c * ch + 1))))
}

function calcResponseWith(x) {
    let a = PI * sq(dBeam) / 4;
    let inertia = a * sq(dBeam) / 16;
    let w = x * TWO_PI;
    let lambda = Math.sqrt(Math.sqrt(sq(w) * a * 7800 / (2E11 * inertia)));
    let eq1 = Math.sqrt(((7800 * inertia * sq(w) * (1 + 2E11 / (lambda * 8E10))) + Math.sqrt(7800 * inertia * sq(w) * (7800 * inertia * sq(w) * sq(1 - 2E11 / (lambda * 8E10)) + 8E11 * a))) / (4E11 * inertia));
    let ceq1, ceq2, ceq3, ceq4, ceq5;
    if (w < Math.sqrt(lambda * 8E10 * a / (7800 * inertia))) {
        let eq2 = Math.sqrt((-(7800 * inertia * sq(w) * (1 + 2E11 / (lambda * 8E10))) + Math.sqrt(7800 * inertia * sq(w) * (7800 * inertia * sq(w) * sq(1 - 2E11 / (lambda * 8E10)) + 8E11 * a))) / (4E11 * inertia));
        let eq3 = (7800 * sq(w) / (lambda * 8E10) / eq2 + eq2) * eq2;
        let eq4 = (7800 * sq(w) / (lambda * 8E10) / eq1 - eq1) * eq1;
        let eq5 = 1 / (7800 * sq(w) * a * (2 - 2 * (Math.cos(eq1 * lBeam) * Math.cosh(eq2 * lBeam)) + ((eq3 * eq2) / (eq4 * eq1) - (eq4 * eq1) / (eq3 * eq2)) * (Math.sin(eq1 * lBeam) * Math.sinh(eq2 * lBeam))));
        ceq3 = -((Math.cos(eq1 * lBeam) * Math.sinh(eq2 * lBeam)) * ((eq3 * eq2) / eq4 - eq2) - (Math.sin(eq1 * lBeam) * Math.cosh(eq2 * lBeam)) * ((eq4 * eq1) / eq3 - eq1)) * eq5;
        ceq4 = -((Math.sin(eq1 * lBeam) * Math.sinh(eq2 * lBeam)) * ((eq4 * eq1) / eq2 - (eq3 * eq2) / eq1) + ((Math.cos(eq1 * lBeam) * Math.cosh(eq2 * lBeam)) - 1) * (eq4 + eq3)) * eq5;
        ceq1 = -(Math.sinh(eq2 * lBeam) * ((eq3 * eq2) / eq4 - eq2) - Math.sin(eq1 * lBeam) * ((eq4 * eq1) / eq3 - eq1)) * eq5;
        ceq2 = (Math.cos(eq1 * lBeam) - Math.cosh(eq2 * lBeam)) * (eq3 - eq4) * eq5;
        ceq5 = -((Math.sin(eq1 * lBeam) * Math.cosh(eq2 * lBeam)) * eq3 * (eq3 / eq1 - (7800 * sq(w) / (lambda * 8E10) / eq1 - eq1)) + (Math.cos(eq1 * lBeam) * Math.sinh(eq2 * lBeam)) * eq4 * (eq4 / eq2 - (7800 * sq(w) / (lambda * 8E10) / eq2 + eq2))) * eq5;
    } else {
        let eq2 = Math.sqrt(((7800 * inertia * sq(w) * (1 + 2E11 / (lambda * 8E10))) - Math.sqrt(7800 * inertia * sq(w) * (7800 * inertia * sq(w) * sq(1 - 2E11 / (lambda * 8E10)) + 8E11 * a))) / (4E11 * inertia));
        let eq3 = (7800 * sq(w) / (lambda * 8E10) / eq2 - eq2) * eq2;
        let eq4 = (7800 * sq(w) / (lambda * 8E10) / eq1 - eq1) * eq1;
        let eq5 = 1 / (7800 * sq(w) * a * (2 - 2 * (Math.cos(eq1 * lBeam) * Math.cos(eq2 * lBeam)) - ((eq3 * eq2) / (eq4 * eq1) + (eq4 * eq1) / (eq3 * eq2)) * (Math.sin(eq1 * lBeam) * Math.sin(eq2 * lBeam))));
        ceq3 = ((Math.cos(eq1 * lBeam) * Math.sin(eq2 * lBeam)) * ((eq3 * eq2) / eq4 - eq2) + (Math.sin(eq1 * lBeam) * Math.cos(eq2 * lBeam)) * ((eq4 * eq1) / eq3 - eq1)) * eq5;
        ceq4 = -((Math.sin(eq1 * lBeam) * Math.sin(eq2 * lBeam)) * ((eq4 * eq1) / eq2 + (eq3 * eq2) / eq1) + ((Math.cos(eq1 * lBeam) * Math.cos(eq2 * lBeam)) - 1) * (eq4 + eq3)) * eq5;
        ceq1 = (Math.sin(eq2 * lBeam) * ((eq3 * eq2) / eq4 - eq2) + Math.sin(eq1 * lBeam) * ((eq4 * eq1) / eq3 - eq1)) * eq5;
        ceq2 = -(Math.cos(eq2 * lBeam) - Math.cos(eq1 * lBeam)) * (eq3 - eq4) * eq5;
        ceq5 = ((Math.sin(eq1 * lBeam) * Math.cos(eq2 * lBeam)) * eq3 * (7800 * sq(w) / (lambda * 8E10) / eq1 - eq1 - eq3 / eq1) + (Math.cos(eq1 * lBeam) * Math.sin(eq2 * lBeam)) * eq4 * ((7800 * sq(w) / (lambda * 8E10) / eq2 - eq2) - eq4 / eq2)) * eq5;
    }
    return Math.abs(ceq3 + (ceq1 * (ceq2 * ceq4 - ceq1 * ceq5) + ceq2 * (ceq1 * ceq4 - ceq2 * ceq3)) / (ceq3 * ceq5 - ceq4 * ceq4));
}

function drawAnim() {
    push();
    stroke(cblue);
    noFill();
    rect(180, 530 - (300 * dBeam) / 2, 300 * lBeam, 300 * dBeam);
    fill(orange);
    stroke(orange);
    rect(150, 480, 30, 102);
    pop();
}
