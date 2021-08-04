let gold = '#DAA520', red = '#FF0000', blue = '#0000FF', orange = '#FFA500', cblue = '#5F9EA0';
let lbSlider, dbSlider, lcSlider, dcSlider, sliders = [];
let lbBeam = 0.4, dbBeam = 0.06, lcBeam = 0.6, dcBeam = 0.04, values = [lbBeam, dbBeam, lcBeam, dcBeam],
    factors = [100, 100, 100, 100];
let inputs = [], inputAttr = [[0.2, 1.5, 0.01], [0.02, 0.2, 0.01], [0.2, 1.5, 0.01], [0.02, 0.2, 0.01]];
let graph;


function setup() {
    createCanvas(920, 900).parent('canvas');
    createSliders();
    createInputs();
    frameRate(24);

    graph = new StaticGraph(280, 50, 470, 400, [0, 5000], [-8, 6], 1000, 2);
    graph.addPointsFunction('1', [], calcResponse, 1, red);
    graph.addPointsFunction('2', [], interceptLine, 1, blue);


}

function draw() {
    background(255);
    updateSliders();
    graph.draw();
    text('Frequency (Hz)', 760, 200);
    text('x10⁻⁹         Receptance', 290, 30);

    drawAnalysisLine();
    drawFraction(335, 20, 'm', 'N');

    drawDiagram();
}


/*
        EVENT HANDLERS
*/

function updateSliders() {
    push();
    drawSubscript(35, 50, 'L', 'b');
    text(':                 m', 50, 50);
    drawSubscript(35, 110, 'D', 'b');
    text(':                 m', 50, 110);
    drawSubscript(35, 170, 'L', 'c');
    text(':                 m', 50, 170);
    drawSubscript(35, 230, 'D', 'c');
    text(':                 m', 50, 230);
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
    lbBeam = values[0];
    dbBeam = values[1];
    lcBeam = values[2];
    dcBeam = values[3];
}

/*

         SETUP FUNCTIONS

 */

function createInputs() {
    let startX = 55, startY = 35;
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
    lbSlider = createSlider(20, 150, lbBeam * 100);
    dbSlider = createSlider(2, 20, dbBeam * 100);
    lcSlider = createSlider(20, 150, lcBeam * 100);
    dcSlider = createSlider(2, 20, dcBeam * 100);
    sliders = [lbSlider, dbSlider, lcSlider, dcSlider];
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
    text('β₁₁ =', 40, 455);
    drawFraction(102, 447, 'sinλ  ', '  Eλcosλ  ');
    drawSubscript(109, 446, 'L', 'b');
    drawSubscript(70, 467, 'A', 'b');
    drawSubscript(122, 467, 'L', 'b');
    text('γ₁₁ =', 155, 455);
    drawFraction(212, 447, 'cosλ  ', '  Eλsinλ  ');
    drawSubscript(221, 446, 'L', 'c');
    drawSubscript(181, 467, 'A', 'c');
    drawSubscript(230, 467, 'L', 'c');

    text('λ² =', 115, 500);
    drawFraction(155, 492, 'ρω²', 'E');
    text('β₁₁', 80, 575);
    text('-γ₁₁', 80, 553);


    push();
    translate(0, 100);
    push();
    stroke(blue);
    line(50, 450, 75, 450);
    line(158, 300, 170, 300);
    rect(133, 209, 60, 12);
    rect(170, 294, 60, 12);
    stroke('#ff0000');
    line(50, 470, 75, 470);
    rect(45, 205, 90, 20);
    rect(45, 290, 90, 20);
    line(135, 300, 148, 300);
    stroke(orange);
    fill(orange);
    rect(29, 185, 15, 60);
    rect(29, 270, 15, 60);
    pop();
    line(193, 195, 193, 180);
    line(45, 195, 45, 180);
    line(135, 195, 135, 180);
    line(105, 205, 105, 245);
    line(45, 187, 83, 187);
    line(158, 187, 96, 187);
    line(171, 187, 193, 187);
    line(178, 209, 178, 245);
    drawSubscript(110, 250, 'D', 'b');
    drawSubscript(84, 192, 'L', 'b');
    drawSubscript(159, 192, 'L', 'c');
    drawSubscript(182, 250, 'D', 'c');
    text('1', 150, 295);
    push();
    fill('#000000');
    triangle(45, 187, 50, 183, 50, 191);
    triangle(135, 187, 130, 183, 130, 191);
    triangle(135, 187, 140, 183, 140, 191);
    triangle(193, 187, 188, 183, 188, 191);
    triangle(105, 205, 101, 210, 109, 210);
    triangle(105, 225, 101, 220, 109, 220);
    triangle(178, 209, 174, 214, 182, 214);
    triangle(178, 222, 174, 217, 182, 217);

    pop();
    pop();

    push();
    stroke(orange);
    fill(orange);
    rect(280, 480, 15, 60);
    fill('#ffffff');
    stroke(blue);
    rect(295 + 100 * lbBeam, 510 - (dcBeam / 2) * 200, 100 * lcBeam, 200 * dcBeam);
    stroke(red);
    rect(295, 510 - (dbBeam / 2) * 200, 100 * lbBeam, 200 * dbBeam);
    pop();
}

function calcResponse(x) {
    let w = x * TWO_PI;
    let l = w * sqrt(3.9E-8);
    let a = PI * (dbBeam ** 2) / 4;
    return (Math.tan(l * lbBeam) / (a * 2E11 * l)) * 1E9;
}

function interceptLine(x) {
    let w = x * TWO_PI;
    let l = w * sqrt(3.9E-8);
    let a = PI * (dcBeam ** 2) / 4;
    return (1 / (a * 2E11 * l * Math.tan(l * lcBeam))) * 1E9;
}

function drawAnalysisLine() {
    for (let i = 1; i < 5001; i++) {
        let prevR = calcResponse(i - 1) / 1E9;
        let curR = calcResponse(i) / 1E9;
        let prevI = interceptLine(i - 1) / 1E9;
        let curI = interceptLine(i) / 1E9;
        if (prevR < prevI && curR > curI) text(`${i} Hz`, 285 + i * graph.xDens, 215 - curR * 1E9 * graph.yDens);
    }
}

