let gold = '#DAA520', red = '#FF0000', blue = '#0000FF', orange = '#FFA500', cblue = '#5F9EA0';
let lSlider, dSlider, kSlider, d2Slider, aSlider, sliders = [];
let lBeam = 1.2, dBeam1 = 0.15, kBeam = 1380000, dBeam2 = 0.1, aBeam = 0.4,
    values = [lBeam, dBeam1, dBeam2, kBeam, aBeam],
    factors = [100, 100, 100, 1, 1000];
let inputs = [], inputAttr = [[0.5, 2, 0.01], [0.05, 0.3, 0.01], [0.05, 0.3, 0.01], [10000, 1E8, 1], [0, 1, 0.001]];
let graph;
let r1 = [], r2 = [], r3 = [];


function setup() {
    createCanvas(920, 900).parent('canvas');
    createSliders();
    createInputs();
    frameRate(24);

    graph = new StaticGraph(280, 50, 470, 400, [0, 200], [0, 3.5], 50, 0.5);
    graph.addPointsFunction('1', [], getResponse1, 1, red);
    graph.addPointsFunction('2', [], getResponse2, 1, blue);
    graph.addPointsFunction('3', [], getResponse3, 1, cblue);

    calcResponse();
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
    drawSubscript(41, 110, 'D', '1');
    text(':                 m', 55, 110);
    drawSubscript(41, 170, 'D', '2');
    text(':                 m', 55, 170);
    text('k:                         N/m', 48, 230);
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
    dBeam1 = values[1];
    dBeam2 = values[2];
    kBeam = values[3];
    aBeam = values[4];
    calcResponse();
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
        s.style('width', (i === 3 ? '75px' : '50px'));
        inputs.push(s);
    }
}

function createSliders() {
    lSlider = createSlider(inputAttr[0][0] * 100, inputAttr[0][1] * 100, lBeam * 100);
    dSlider = createSlider(inputAttr[1][0] * 100, inputAttr[1][1] * 100, dBeam1 * 100);
    kSlider = createSlider(inputAttr[3][0], inputAttr[3][1], kBeam);
    d2Slider = createSlider(inputAttr[2][0] * 100, inputAttr[2][1] * 100, dBeam2 * 100);
    aSlider = createSlider(inputAttr[4][0] * 1000, inputAttr[4][1] * 1000, aBeam * 1000);
    sliders = [lSlider, dSlider, d2Slider, kSlider, aSlider];
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
    text('α =', 195, 440);
    text(`Main bar\nWithout absorber\nWith absorber\n\n"Absorber" bar`, 790, 25);
    push();
    stroke(cblue);
    line(765, 50, 785, 50);
    stroke(red);
    line(765, 35, 785, 35);
    stroke(blue);
    line(765, 80, 785, 80);
    pop();
    drawFraction(225, 432, 'h', 'k');
    push();
    translate(0, 160);
    push();
    stroke(blue);
    rect(45, 205, 90, 20);
    rect(45, 305, 90, 20);
    stroke(orange);
    fill(orange);
    rect(29, 185, 15, 160);
    pop();

    line(140, 214, 190, 214);
    line(185, 214, 185, 235);
    line(170, 214, 170, 235);
    line(135, 195, 135, 180);
    line(75, 205, 75, 245);
    line(75, 285, 75, 320);
    line(45, 187, 83, 187);
    line(45, 342, 83, 342);
    line(135, 350, 135, 335);
    line(135, 187, 96, 187);
    line(135, 342, 96, 342);

    drawSubscript(77, 250, 'D', '1');
    drawSubscript(77, 290, 'D', '2');
    drawSubscript(84, 192, 'L', '1');
    drawSubscript(84, 347, 'L', '2');

    push();
    fill('#000000');
    triangle(45, 187, 50, 183, 50, 191);
    triangle(135, 187, 130, 183, 130, 191);
    triangle(75, 205, 71, 210, 79, 210);
    triangle(75, 225, 71, 220, 79, 220);
    triangle(75, 305, 71, 310, 79, 310);
    triangle(75, 325, 71, 320, 79, 320);
    triangle(170, 240, 166, 235, 174, 235);
    triangle(185, 240, 181, 235, 189, 235);
    triangle(45, 342, 50, 338, 50, 346);
    triangle(135, 342, 130, 338, 130, 346);

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
    line(125, 444, 145, 444);
    line(141, 400, 141, 444);
    line(135, 444, 135, 465);
    square(137, 412, 8);
    line(145, 420, 137, 412);
    line(145, 412, 137, 420);
    text('h', 150, 420);
    text('k', 115, 420);
    drawSpring(127, 400, 7, 42, 9);
    push();
    pop();
}

function getResponse1(x) {
    return r1[Math.round(x * 4)];
}

function getResponse2(x) {
    return r2[Math.round(x * 4)];
}

function getResponse3(x) {
    return r3[Math.round(x * 4)];
}

function calcResponse() {
    r1 = [], r2 = [], r3 = [];
    let a1 = PI * (dBeam1 ** 2) / 4;
    let a2 = PI * (dBeam2 ** 2) / 4;
    let inertia1 = a1 * (dBeam1 ** 2) / 16;
    let inertia2 = a2 * (dBeam2 ** 2) / 16;
    for (let x = 0; x < 200; x += 0.25) {
        let w = x * TWO_PI;
        let l1 = ((w ** 2) * a1 * 7800 / (2E11 * inertia1)) ** 0.25;
        let l2 = ((w ** 2) * a2 * 7800 / (2E11 * inertia2)) ** 0.25;
        let lamlen1 = l1 * lBeam;
        let lamlen2 = l2 * lBeam;
        let r1t = -(Math.cos(lamlen1) * Math.sinh(lamlen1) - Math.sin(lamlen1) * Math.cosh(lamlen1)) * (1 / (2E11 * inertia1 * (l1 ** 3) * (Math.cos(lamlen1) * Math.cosh(lamlen1) + 1)));
        let r2t = -(Math.cos(lamlen2) * Math.sinh(lamlen2) - Math.sin(lamlen2) * Math.cosh(lamlen2)) * (1 / (2E11 * inertia2 * (l2 ** 3) * (Math.cos(lamlen2) * Math.cosh(lamlen2) + 1)));
        let eq1 = r2t + 1 / kBeam / (1 + (aBeam ** 2));
        let eq2 = -aBeam / kBeam / (1 + (aBeam ** 2));
        let eq3 = 1 / r1t + eq1 / ((eq1 ** 2) + (eq2 ** 2));
        let eq4 = -eq2 / ((eq1 ** 2) + (eq2 ** 2));
        r1.push(Math.abs(-(Math.cos(lamlen1) * Math.sinh(lamlen1) - Math.sin(lamlen1) * Math.cosh(lamlen1)) * (1 / (2E11 * inertia1 * (l1 ** 3) * (Math.cos(lamlen1) * Math.cosh(lamlen1) + 1)))) * 1E6);
        r2.push(Math.abs(-(Math.cos(lamlen2) * Math.sinh(lamlen2) - Math.sin(lamlen2) * Math.cosh(lamlen2)) * (1 / (2E11 * inertia2 * (l2 ** 3) * (Math.cos(lamlen2) * Math.cosh(lamlen2) + 1)))) * 1E6);
        r3.push(Math.abs(1 / Math.sqrt((eq4 ** 2) + (eq3 ** 2))) * 1E6);
    }
}

