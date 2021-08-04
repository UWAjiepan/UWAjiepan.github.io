let graph;
let drSlider, sliders = [];
let drInput, inputs = [];
let dr = 0.1, values = [dr], factors = [100];
let feq, dreq, req;


function preload() {
    feq = loadImage('../../../assets/feq.png');
    dreq = loadImage('../../../assets/dreq.png');
    req = loadImage('../../../assets/req.png');
}


function setup() {
    createCanvas(720, 480).parent('canvas');
    graph = new StaticGraph(50, 80, 350, 160, [0, 3], [0, 8], 0.5, 1);
    graph.addSecondGraph('x', [0, -180], 45, 35, 100);
    graph.addPointsFunction("oh", [], func1, 1, 'lightseagreen', 2);
    graph.addPointsFunction("", [], func2, 2, 'lightseagreen', 2);
    //graph.setAxisLabels("ω/ωn", "", "φ");
    graph.tickColour = 'orange';
    createInputs();

    feq.resize(70, 0);
    dreq.resize(70, 0);
    req.resize(0, 32);
}

function draw() {
    background(255);
    graph.draw();
    text('ξ:', 52, 25);
    push();
    fill('deepskyblue');
    rect(550, 280, 70, 40);
    pop();
    strokeWeight(3);
    line(550, 70, 620, 70);
    strokeWeight(1);
    drawSpring(570, 70, 26, 172, 9);
    rect(595, 71, 12, 110);
    drawDamper(601, 280, 150);
    push();
    textSize(15);
    text("m", 579, 305);
    text("k", 545, 135);
    text("c", 615, 133);
    textSize(13);
    text("Xsin(ωt + ϕ)", 445, 325);
    text("Fsin(ωt)", 655, 325);
    strokeCap(SQUARE);
    stroke('deepskyblue');
    strokeWeight(2);
    line(515, 300, 549, 300);
    triangle(520, 340, 530, 340, 525, 350);
    strokeWeight(4);
    line(525, 300, 525, 340);
    strokeWeight(2);
    stroke('orange');
    line(621, 300, 655, 300);
    triangle(640, 325, 650, 325, 645, 335);
    strokeWeight(4);
    line(645, 300, 645, 325);
    pop();
    image(feq, 465, 175);
    image(dreq, 465, 230);
    image(req, 410, 240);
    drawFraction(65, 65, 'kX', 'F');
    text('φ', 50, 395);
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
        sliders[index].value(inputs[index].value() * factors[index]);
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
    drSlider = createSlider(1, 200, dr * 100);
    drSlider.position(25, 35);
    drSlider.style('width', '100px');
    drSlider.parent('canvas');
    drSlider.input(onSliderInput(0));
    sliders.push(drSlider);
    drInput = createInput(values[0].toString(), 'number');
    drInput.attribute('min', 0.001);
    drInput.attribute('max', 3);
    drInput.attribute('step', 0.001);
    drInput.elt.onblur = onTextInput(0, 0.001, 3, 0.001);
    drInput.parent('canvas');
    drInput.position(60, 10);
    drInput.style('width', '50px');
    inputs.push(drInput);
}


/*
    MATH FUNCTIONS
*/

function func1(r) {
    return 1 / sqrt(sq(1 - sq(r)) + (4 * sq(dr) * sq(r)));
}

function func2(r) {
    return degrees(Math.atan2((-2 * dr * r), (1 - sq(r))));
}
