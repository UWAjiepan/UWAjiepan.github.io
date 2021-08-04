let gold = '#DAA520', red = '#FF0000', blue = '#0000FF', orange = '#FFA500';
let lSlider, dSlider, sliders = [];
let lBeam = 2, dBeam = 0.2, values = [lBeam, dBeam],
    factors = [10, 100];
let inputs = [], inputAttr = [[0.5, 2, 0.1], [0.05, 0.2, 0.01]];
let graph;


function setup() {
    createCanvas(920, 900).parent('canvas');
    createSliders();
    createInputs();

    graph = new StaticGraph(250, 50, 470, 400, [0, 5000], [-12, -5], 1000, 'log');
    graph.addPointsFunction('1', [], calcResponse, 1, blue);
    graph.pointObjects[0].dens = 2.5;
}

function draw() {
    background(255);
    updateSliders();
    graph.draw();
    text('Frequency     (Hz)', 455, 480);
    text('Receptance', 160, 95);

    drawFraction(175, 60, 'X', 'F');
    drawFraction(200, 60, 'm', 'N');

    push();
    stroke(blue);
    rect(45, 205, 90, 20);
    pop();
    push();
    fill(blue);
    text('X', 150, 265);
    fill(orange);
    text('F', 150, 245);
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
    lSlider = createSlider(5, 20, lBeam * 10);
    dSlider = createSlider(5, 20, dBeam * 100);
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

function calcResponse(x) {
    let w = x * TWO_PI;
    let l = w * Math.sqrt(3.9 * (10 ** -8));
    let a = PI * sq(dBeam) / 4;
    let eq1 = -1 * Math.sin(l * lBeam) * 2 * (2 * (10 ** 11)) * a * l;
    let eq2 = 2 / sq(eq1);
    return Math.abs(eq2 * eq1 * Math.cos(l * lBeam));
}
