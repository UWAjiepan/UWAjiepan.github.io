let graph;
let drSlider, rSlider, sliders = [];
let inputs = [], inputAttr = [[0.001, 3, 0.001], [0.01, 3, 0.01]], factors = [100, 100];
let dr = 0.1, rValue = 0.9, values = [dr, rValue];
let req;


function preload() {
    req = loadImage('../../../assets/req.png');
}


function setup() {
    createCanvas(800, 480).parent('canvas');
    createSliders();
    createInputs();
    graph = new StaticGraph(50, 80, 350, 160, [0, 3], [0, 8], 0.5, 1);
    graph.addSecondGraph('x', [0, -180], 45, 35, 100);
    graph.addPointsFunction("oh", [], func1, 1, 'lightseagreen', 2);
    graph.addPointsFunction("", [], func2, 2, 'lightseagreen', 2);
    graph.setAxisLabels("ω/ωn", "kX/F", "φ");
    graph.tickColour = 'orange';
    graph.addAnalysisLine('mediumblue', 1, func1, 0);
    graph.addAnalysisLine("forestgreen", 2, func2, 0);
    req.resize(0, 32);
}

function draw() {
    background(255);
    graph.draw();
    graph.drawAnalysisLine(rValue);
    text('ξ:', 55, 25);
    drawFraction(175, 15, "ω", "");
    drawSubscript(170, 30, "ω", "n");
    text(':', 185, 25);
    drawLocus(610, 50);
    image(req, 410, 240);
    drawFraction(20, 80, 'kX', 'F');
    text('φ', 50, 395);
}

function drawLocus(originX, originY) {
    push();
    translate(originX, originY);
    line(-170, 0, 170, 0);
    line(0, 0, 0, 320);
    noFill();
    let locus = new Complex(1 - sq(rValue), 2 * dr * rValue).inverse();
    stroke('mediumblue');
    line(0, 0, locus.re * 20, locus.im * -20);
    stroke('forestgreen');
    strokeWeight(2);
    arc(0, 0, 20, 20, 0, locus.arg() * -1);
    strokeWeight(1);
    stroke('lightseagreen');
    beginShape();
    for (let r = 0; r <= 3; r += 0.01) {
        locus = new Complex(1 - sq(r), 2 * dr * r).inverse();
        vertex(locus.re * 20, -20 * locus.im);
    }
    endShape();
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
    dr = values[0];
    rValue = values[1];
}


/*

         SETUP FUNCTIONS

 */

function createInputs() {
    let startX = 65, startY = 10;
    for (let i = 0; i < sliders.length; i++) {
        let s = createInput(values[i].toString(), 'number');
        s.attribute('min', inputAttr[i][0]);
        s.attribute('max', inputAttr[i][1]);
        s.attribute('step', inputAttr[i][2]);
        s.elt.onblur = onTextInput(i, ...inputAttr[i]);
        s.parent('canvas');
        s.position(startX + i * 125, startY);
        s.style('width', '50px');
        inputs.push(s);
    }
}

function createSliders() {
    drSlider = createSlider(4, 300, dr * 100);
    rSlider = createSlider(1, 300, rValue * 100);
    sliders = [drSlider, rSlider];
    let spos = 25;
    sliders.forEach(function (s, i) {
        s.position(spos, 35);
        s.style('width', '100px');
        s.parent('canvas');
        s.input(onSliderInput(i));
        spos += 125;
    });
}


function func1(r) {
    return 1 / sqrt(sq(1 - sq(r)) + (4 * sq(dr) * sq(r)));
}

function func2(r) {
    return degrees(Math.atan2((-2 * dr * r), (1 - sq(r))));
}


