let gold = '#DAA520', red = '#FF0000', blue = '#0000FF', orange = '#FFA500', cblue = '#5F9EA0';
let lSlider, dSlider, kSlider, mSlider, sliders = [];
let lBeam = 1, dBeam = 0.1, kBeam = 1E9, mBeam = 20, values = [lBeam, dBeam, kBeam, mBeam], factors = [100, 100, 0, 10];
let inputs = [], inputAttr = [[0.5, 2, 0.01], [0.05, 0.2, 0.01], [1.5E8, 1E10, 1E7], [5, 100, 0.1]];
let graph;


function setup() {
    createCanvas(920, 900).parent('canvas');
    createSliders();
    createInputs();
    frameRate(24);

    graph = new StaticGraph(280, 50, 470, 400, [0, 5000], [-6, 8], 1000, 2);
    graph.addPointsFunction('1', [], calcResponse, 1, red);
    graph.addPointsFunction('2', [], interceptLine, 1, blue);


}

function draw() {
    background(255);
    updateSliders();
    graph.draw();
    text('Frequency (Hz)', 760, 270);
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
    text('Length:                 m', 33, 50);
    text('D:                 m', 48, 110);
    text('k:                 N/m', 48, 170);
    text('m:                 kg', 46, 230);
    pop();
}

function onSliderInput(index) {
    if (index === 2) {
        return function () {
            values[index] = this.value();
            inputs[index].value(this.value().toExponential(2));
            updateValues();
        }
    } else {
        return function () {
            values[index] = this.value() / factors[index];
            inputs[index].value(this.value() / factors[index]);
            updateValues();
        }
    }
}


function onTextInput(index, min, max, step) {
    if (index === 2) {
        return function () {
            if (this.value < min && this.value !== "") this.value = Number(min).toExponential(2);
            else if (this.value > max) this.value = Number(max).toExponential(2);
            else if (this.value % step !== 0) this.value = Number((Math.round(this.value * step) / step)).toExponential(2);
            if (Number.isNaN(this.value)) this.value = values[index].toExponential(2);
            values[index] = Number(this.value);
            sliders[index].value(Number(this.value));
            updateValues();
        }
    } else {
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
}

function updateValues() {
    lBeam = values[0];
    dBeam = values[1];
    kBeam = values[2];
    mBeam = values[3];
}

/*

         SETUP FUNCTIONS

 */

function createInputs() {
    let startX = 60, startY = 35;
    for (let i = 0; i < sliders.length; i++) {
        let s;
        if (i === 2) s = createInput(values[i].toExponential(2), 'string');
        else s = createInput(values[i].toString(), 'number');
        s.attribute('min', inputAttr[i][0]);
        s.attribute('max', inputAttr[i][1]);
        s.attribute('step', inputAttr[i][2]);
        s.elt.onblur = onTextInput(i, ...inputAttr[i]);
        s.parent('canvas');
        s.position(startX + (i === 0 ? 15 : 0), startY + i * 60);
        s.style('width', '50px');
        inputs.push(s);
    }
}

function createSliders() {
    lSlider = createSlider(50, 200, lBeam * 100);
    dSlider = createSlider(5, 20, dBeam * 100);
    kSlider = createSlider(1.3E8, 1E10, kBeam);
    mSlider = createSlider(50, 1000, mBeam * 10);
    sliders = [lSlider, dSlider, kSlider, mSlider];
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
    rotate(HALF_PI);
    drawSpring(315, -230, 15, 95, 9);
    rotate(PI);
    drawSpring(-400, 170, 13, 60, 7);
    pop();


    text('β₁₁ =', 40, 455);
    drawFraction(102, 447, 'sinλL', 'AEλcosλL');
    text('γ₁₁ =       -', 160, 455);
    drawFraction(198, 447, '1', 'k');
    drawFraction(235, 447, '1', 'mω²');
    text('λ² =', 115, 500);
    drawFraction(155, 492, 'ρω²', 'E');
    text('β₁₁', 80, 575);
    text('-γ₁₁', 80, 553);

    line(158, 400, 170, 400);

    push();
    translate(0, 100);
    push();
    stroke('#ff0000');
    line(50, 470, 75, 470);
    stroke(blue);
    rect(45, 205, 90, 20);
    rect(45, 290, 90, 20);
    line(50, 450, 75, 450);
    line(135, 300, 148, 300);
    stroke(orange);
    fill(orange);
    rect(29, 185, 15, 60);
    rect(230, 185, 15, 60);
    rect(29, 270, 15, 60);
    rect(230, 270, 15, 60);
    pop();


    line(45, 195, 45, 180);
    line(135, 195, 135, 180);
    line(105, 205, 105, 245);
    line(45, 187, 83, 187);
    line(135, 187, 96, 187);
    text('D', 110, 250);
    text('L', 87, 192);
    text('k', 185, 192);
    text('1', 150, 295);
    push();
    fill('#000000');
    triangle(45, 187, 50, 183, 50, 191);
    triangle(135, 187, 130, 183, 130, 191);
    triangle(105, 205, 101, 210, 109, 210);
    triangle(105, 225, 101, 220, 109, 220);
    pop();
    pop();

    text('m', 233, 320);
    text('m', 233, 402);
}

function calcResponse(x) {
    let w = x * TWO_PI;
    let l = w * sqrt(3.9E-8);
    let a = PI * (dBeam ** 2) / 4;
    return (Math.tan(l * lBeam) / (a * 2E11 * l)) * 1E9;
}

function interceptLine(x) {
    let w = x * TWO_PI;
    return -(1 / kBeam - 1 / (mBeam * (w ** 2))) * 1E9;
}

function drawAnalysisLine() {
    for (let i = 1; i < 5001; i++) {
        let prevR = calcResponse(i - 1) / 1E9;
        let curR = calcResponse(i) / 1E9;
        let prevI = interceptLine(i - 1) / 1E9;
        let curI = interceptLine(i) / 1E9;
        if (prevI >= prevR && curR >= curI) text(`${i} Hz`, 290 + i * graph.xDens, 290 - curR * 1E9 * graph.yDens);
    }
}

