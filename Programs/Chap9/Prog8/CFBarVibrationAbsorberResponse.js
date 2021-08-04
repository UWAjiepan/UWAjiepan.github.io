let gold = '#DAA520', red = '#FF0000', blue = '#0000FF', orange = '#FFA500', cblue = '#5F9EA0';
let lSlider, dSlider, kSlider, mSlider, aSlider, sliders = [];
let lBeam = 1.2, dBeam = 0.15, kBeam = 393000, mBeam = 2, aBeam = 0.25, values = [lBeam, dBeam, kBeam, mBeam, aBeam],
    factors = [100, 100, 1, 100, 1000];
let inputs = [], inputAttr = [[0.5, 2, 0.01], [0.05, 0.3, 0.01], [10000, 1000000, 1], [0.05, 5, 0.01], [0, 1, 0.001]];
let graph;


function setup() {
    createCanvas(920, 900).parent('canvas');
    createSliders();
    createInputs();
    frameRate(24);

    graph = new StaticGraph(280, 50, 470, 400, [0, 200], [0, 3.5], 50, 0.5);
    graph.addPointsFunction('1', [], calcResponse1, 1, red);
    graph.addPointsFunction('2', [], calcResponse2, 1, blue);


}

function draw() {
    background(255);
    updateSliders();
    graph.draw();
    text('Frequency (Hz)', 480, 480);
    text('10⁻⁶        Receptance', 290, 30);

    drawFraction(270, 20, 'X', 'F');
    drawFraction(328, 20, 'm', 'N');

    drawDiagram();
}


/*
        EVENT HANDLERS
*/

function updateSliders() {
    push();
    text('Length:                 m', 33, 50);
    text('D:                 m', 48, 110);
    text('k:                    N/m', 48, 170);
    text('m:                 kg', 46, 230);
    text('α:                 ', 48, 290);
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
    kBeam = values[2];
    mBeam = values[3];
    aBeam = values[4];
}

/*

         SETUP FUNCTIONS

 */

function createInputs() {
    let startX = 60, startY = 35;
    for (let i = 0; i < sliders.length; i++) {
        let s = createInput(values[i].toString(), 'number');
        s.attribute('min', inputAttr[i][0]);
        s.attribute('max', inputAttr[i][1]);
        s.attribute('step', inputAttr[i][2]);
        s.elt.onblur = onTextInput(i, ...inputAttr[i]);
        s.parent('canvas');
        s.position(startX + (i === 0 ? 15 : 0), startY + i * 60);
        s.style('width', (i === 2 ? '60px' : '50px'));
        inputs.push(s);
    }
}

function createSliders() {
    lSlider = createSlider(50, 200, lBeam * 100);
    dSlider = createSlider(5, 30, dBeam * 100);
    kSlider = createSlider(10000, 1000000, kBeam);
    mSlider = createSlider(5, 500, mBeam * 100);
    aSlider = createSlider(0, 1000, aBeam * 1000);
    sliders = [lSlider, dSlider, kSlider, mSlider, aSlider];
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

function drawDiagram() {
    push();
    text(`\nWithout absorber\nWith absorber\n`, 790, 25);
    stroke(blue);
    line(765, 50, 785, 50);
    stroke(red);
    line(765, 35, 785, 35);
    pop();
    text('α =', 45, 440);
    drawFraction(75, 432, 'h', 'k');
    push();
    translate(0, 160);
    push();
    stroke(blue);
    rect(45, 205, 90, 20);
    stroke(orange);
    fill(orange);
    rect(29, 185, 15, 60);
    pop();

    line(140, 214, 190, 214);
    line(185, 214, 185, 235);
    line(170, 214, 170, 235);
    line(45, 195, 45, 180);
    line(135, 195, 135, 180);
    line(75, 205, 75, 245);
    line(45, 187, 83, 187);
    line(135, 187, 96, 187);
    text('D', 80, 250);
    text('L', 87, 192);
    push();
    fill('#000000');
    triangle(45, 187, 50, 183, 50, 191);
    triangle(135, 187, 130, 183, 130, 191);
    triangle(75, 205, 71, 210, 79, 210);
    triangle(75, 225, 71, 220, 79, 220);
    triangle(170, 240, 166, 235, 174, 235);
    triangle(185, 240, 181, 235, 189, 235);

    pop();
    pop();
    push();
    fill(blue);
    text('X', 166, 412);
    fill(red);
    text('F', 181, 412);
    pop();
    line(135, 400, 135, 385);
    line(125, 400, 145, 400);
    line(141, 400, 141, 430);
    square(137, 412, 8);
    line(145, 420, 137, 412);
    line(145, 412, 137, 420);
    text('h', 150, 420);
    text('k', 115, 420);
    drawSpring(127, 400, 5, 30, 9);
    push();
    fill(cblue);
    stroke(cblue);
    rect(125, 430, 20, 15);
    pop();
    text('m', 130, 442);

}

function calcResponse1(x) {
    let a = PI * (dBeam ** 2) / 4;
    let inertia = a * (dBeam ** 2) / 16;
    let w = x * TWO_PI;
    let l = Math.sqrt(Math.sqrt((w ** 2) * a * 7800 / (2E11 * inertia)));
    let lamlen = l * lBeam;
    return Math.abs(-(Math.cos(lamlen) * Math.sinh(lamlen) - Math.sin(lamlen) * Math.cosh(lamlen)) * (1 / (2E11 * inertia * (l ** 3) * (Math.cos(lamlen) * Math.cosh(lamlen) + 1)))) * 1E6;
}

function calcResponse2(x) {
    let a = PI * (dBeam ** 2) / 4;
    let inertia = a * (dBeam ** 2) / 16;
    let w = x * TWO_PI;
    let l = Math.sqrt(Math.sqrt((w ** 2) * a * 7800 / (2E11 * inertia)));
    let lamlen = l * lBeam;
    let eq1 = -1 / (mBeam * (w ** 2));
    let eq2 = eq1 + 1 / kBeam / (1 + (aBeam ** 2));
    let eq3 = -aBeam / kBeam / (1 + (aBeam ** 2));
    let eq4 = 1 / (-(Math.cos(lamlen) * Math.sinh(lamlen) - Math.sin(lamlen) * Math.cosh(lamlen)) * (1 / (2E11 * inertia * (l ** 3) * (Math.cos(lamlen) * Math.cosh(lamlen) + 1)))) + eq2 / ((eq2 ** 2) + (eq3 ** 2));
    let eq5 = -eq3 / ((eq2 ** 2) + (eq3 ** 2));
    return Math.abs(1 / Math.sqrt((eq4 ** 2) + (eq5 ** 2))) * 1E6;
}


