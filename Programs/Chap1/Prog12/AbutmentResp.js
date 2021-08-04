let graph;
let drSlider, sliders = [];
let feq, dreq, req;
let dr = 0.05, values = [dr,], factors = [100];
let inputs = [], inputAttr = [[0.01, 2, 0.01]];


function preload() {
    feq = loadImage('../../../assets/feq.png');
    dreq = loadImage('../../../assets/dreq.png');
    req = loadImage('../../../assets/req.png');
}


function setup() {
    createCanvas(720, 480).parent('canvas');
    createSliders();
    createInputs();
    graph = new StaticGraph(50, 80, 350, 160, [0, 3], [0, 8], 0.5, 1);
    graph.addSecondGraph('x', [0, -180], 45, 35, 100);
    graph.addPointsFunction("oh", [], func1, 1, 'lightseagreen', 2);
    graph.addPointsFunction("", [], func2, 2, 'lightseagreen', 2);
    //graph.setAxisLabels("ω/ωn", "", "φ");
    graph.tickColour = 'orange';
    feq.resize(70, 0);
    dreq.resize(70, 0);
    req.resize(0, 32);
}

function draw() {
    background(255);
    graph.draw();
    text('ξ:', 44, 25);
    push();
    drawSpring(570, 70, 32, 198, 9);
    fill('deepskyblue');
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
    text("Xsin(ωt + ϕ)", 445, 325);
    text("sin(ωt)", 460, 95);
    drawSubscript(445, 95, "X", "0");
    strokeCap(SQUARE);
    stroke('deepskyblue');
    strokeWeight(2);
    line(515, 300, 549, 300);
    triangle(520, 340, 530, 340, 525, 350);
    strokeWeight(4);
    line(525, 300, 525, 340);
    strokeWeight(2);
    stroke('orange');
    line(548, 70, 500, 70);
    triangle(510, 105, 520, 105, 515, 115);
    strokeWeight(4);
    line(515, 70, 515, 105);
    pop();
    image(feq, 465, 175);
    image(dreq, 465, 230);
    image(req, 410, 240);
    drawFraction(65, 65, 'X', '');
    drawSubscript(61, 83, "X", '0');
    text('φ', 50, 395);
}

function func1(r) {
    let top = 1 + 4 * sq(dr * r);
    let bot = sq(1 - sq(r)) + 4 * sq(dr * r);
    return sqrt(top / bot);
}

function func2(r) {
    let y = -2 * dr * pow(r, 3);
    let x = (1 - sq(r)) + 4 * sq(dr * r);
    return degrees(Math.atan2(y, x));
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
}


/*

         SETUP FUNCTIONS

 */

function createInputs() {
    let startX = 55, startY = 10;
    for (let i = 0; i < sliders.length; i++) {
        let s = createInput(values[i].toString(), 'number');
        s.attribute('min', inputAttr[i][0]);
        s.attribute('max', inputAttr[i][1]);
        s.attribute('step', inputAttr[i][2]);
        s.elt.onblur = onTextInput(i, ...inputAttr[i]);
        s.parent('canvas');
        s.position(startX + i * 160, startY);
        s.style('width', '50px');
        inputs.push(s);
    }
}

function createSliders() {
    drSlider = createSlider(1, 200, 5);
    drSlider.position(25, 35);
    drSlider.style('width', '100px');
    drSlider.parent('canvas');
    drSlider.input(onSliderInput(0));
    sliders = [drSlider]
}