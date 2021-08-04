let graph;
let drSlider, mrSlider, sliders = [];
let req, oobk, oobdr;
let dr = 0.05, oobm = 5, values = [dr, oobm], factors = [100, 100];
let inputs = [], inputAttr = [[0.01, 2, 0.01], [0.1, 10, 0.01]];


function preload() {
    req = loadImage('../../../assets/req.png');
    oobk = loadImage('../../../assets/oobk.png');
    oobdr = loadImage('../../../assets/oobdr.png');
}


function setup() {
    createCanvas(720, 480).parent('canvas');
    createSliders();
    createInputs();
    graph = new StaticGraph(50, 80, 350, 220, [0, 3], [0, 50], 0.5, 10);
    graph.addSecondGraph('x', [0, -180], 45, 35, 100);
    graph.addPointsFunction("oh", [], func1, 1, 'lightseagreen', 2);
    graph.addPointsFunction("", [], func2, 2, 'lightseagreen', 2);
    graph.tickColour = 'orange';
    req.resize(0, 32);
}

function draw() {
    background(255);
    graph.draw();
    text('ξ:', 43, 25);
    drawFraction(195, 16, 'mr', 'M');
    text(`:                 mm`, 210, 23);
    push();
    fill('deepskyblue');
    drawSpring(570, 70, 32, 198, 9);
    rect(550, 270, 90, 60);
    pop();
    strokeWeight(3);
    line(550, 70, 640, 70);
    strokeWeight(1);
    rect(610, 71, 12, 110);
    drawDamper(616, 270, 150);
    push();
    textSize(15);
    text("m", 589, 295);
    text("r", 585, 320);
    text("k", 545, 180);
    text("c", 630, 150);
    textSize(13);
    text("Xsin(ωt + ϕ)", 445, 325);
    strokeCap(SQUARE);
    stroke('deepskyblue');
    strokeWeight(2);
    line(515, 300, 549, 300);
    triangle(520, 340, 530, 340, 525, 350);
    strokeWeight(4);
    line(525, 300, 525, 340);
    strokeWeight(2);
    pop();
    image(req, 410, 300);
    image(oobk, 440, 70);
    image(oobdr, 440, 120);
    push();
    textSize(15);
    text('X mm', 50, 70);
    text('φ', 50, 455);
    pop();
    push();
    let v = p5.Vector.fromAngle(2, 23);
    line(595, 300, 585 + v.x, 300 + v.y);
    fill('black');
    circle(585 + v.x, 300 + v.y, 5);
    text('ωt', 558, 310);
    text("m'", 570 + v.x, 303 + v.y);
    pop();
    push();
    line(590 + v.x, 292 + v.y, 591 + v.x, 287 + v.y);
    line(590 + v.x, 292 + v.y, 585 + v.x, 291 + v.y);
    line(570, 300, 590 + v.x, 292 + v.y);
    drawingContext.setLineDash([3.5, 1.5]);
    line(595, 300, 557, 300);
    pop();
}

function func1(r) {
    return (oobm * sq(r)) / sqrt(sq(1 - sq(r)) + 4 * sq(dr) * sq(r));
}

function func2(r) {
    return degrees(Math.atan2((-2 * dr * r), (1 - sq(r))));
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
    oobm = values[1];
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
    mrSlider = createSlider(1, 1000, 500);
    mrSlider.position(185, 35);
    mrSlider.style('width', '100px');
    mrSlider.parent('canvas');
    mrSlider.input(onSliderInput(1));
    sliders = [drSlider, mrSlider]
}