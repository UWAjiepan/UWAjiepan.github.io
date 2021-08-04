let gold = '#DAA520', red = '#FF0000', blue = '#0000FF', orange = '#FFA500', cblue = '#5F9EA0';
let lSlider, doSlider, dlSlider, sliders = [], animSlider;
let lBeam = 2, doBeam = 0.05, dlBeam = 0.2, values = [lBeam, doBeam, dlBeam], factors = [10, 100, 100];
let inputs = [], inputAttr = [[0.5, 2, 0.1], [0.02, 0.2, 0.01], [0.02, 0.2, 0.01]];
let graph;
let t = 0, dt = 1 / 60;
let sA = [];

function setup() {
    createCanvas(920, 900).parent('canvas');
    createSliders();
    createInputs();

    animSlider = createSlider(1, 5000, 500);
    animSlider.parent('canvas');
    animSlider.position(242, 495);
    animSlider.style('width', '480px');
    animSlider.input(updateAnim);

    graph = new StaticGraph(250, 50, 470, 400, [0, 5000], [-13, -5], 1000, 'log');
    graph.addPointsFunction('1', [], calcResponse, 1, cblue);
    graph.addAnalysisLine(blue, 1, calcResponse, []);

    updateAnim();
}

function draw() {
    background(255);
    updateSliders();
    graph.draw();
    text('Frequency     (Hz)', 455, 480);
    text('Receptance', 145, 80);

    drawFraction(160, 45, 'X', 'F');
    drawFraction(185, 45, 'm', 'N');

    drawDiagram();
    drawAnim();

    if (focused) t += dt;

    mouseDebug();
}

/*
        EVENT HANDLERS
*/

function updateSliders() {
    push();
    text('Length:                 m', 18, 50);
    drawSubscript(40, 110, 'D', 'o');
    text(':                 m', 55, 110);
    drawSubscript(40, 170, 'D', 'L');
    text(':                 m', 55, 170);
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
    doBeam = values[1];
    dlBeam = values[2];
    updateAnim();
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
        s.position(startX, startY + i * 60);
        s.style('width', '50px');
        inputs.push(s);
    }
}

function createSliders() {
    lSlider = createSlider(5, 20, lBeam * 10);
    doSlider = createSlider(2, 20, doBeam * 100);
    dlSlider = createSlider(2, 20, dlBeam * 100);
    sliders = [lSlider, doSlider, dlSlider];
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
    translate(0, 100);
    push();
    stroke(blue);
    quad(40, 207, 140, 195, 140, 235, 40, 223);
    line(36, 207, 21, 207);
    line(36, 223, 21, 223);
    line(144, 235, 159, 235);
    line(144, 195, 159, 195);
    pop();
    push();
    fill(blue);
    text('X', 155, 275);
    fill(orange);
    text('F', 155, 258);
    pop();


    line(40, 190, 40, 175);
    line(140, 190, 140, 175);
    line(27, 207, 27, 245);
    line(140, 238, 140, 280);
    line(40, 182, 83, 182);
    line(140, 182, 96, 182);
    line(140, 253, 152, 253);
    line(140, 270, 152, 270);
    line(152, 235, 152, 195);
    drawSubscript(31, 250, 'D', 'o');
    drawSubscript(157, 220, 'D', 'L');
    text('L', 87, 187);
    push();
    fill('#000000');
    triangle(40, 182, 45, 178, 45, 186);
    triangle(140, 182, 135, 178, 135, 186);
    triangle(152, 253, 147, 257, 147, 249);
    triangle(152, 270, 147, 274, 147, 266);
    triangle(27, 207, 24, 211, 30, 211);
    triangle(27, 223, 24, 219, 30, 219);
    triangle(152, 235, 148, 230, 156, 230);
    triangle(152, 195, 148, 200, 156, 200);
    pop();
    pop();
}

function calcResponse(x) {
    let l = x * TWO_PI * Math.sqrt(3.9 * (10 ** -8));
    let ro = doBeam / 2;
    let rl = dlBeam / 2;
    let eq1 = l * ro / ((rl - ro) / lBeam);
    let eq2 = l * lBeam + eq1;
    let eq3 = (Math.cos(eq1) / eq1) - (Math.sin(eq1) / sq(eq1));
    let eq4 = (Math.cos(eq2) / sq(eq2)) + (Math.sin(eq2) / eq2);
    let eq5 = (Math.cos(eq1) / sq(eq1)) + (Math.sin(eq1) / eq1);
    let eq6 = (Math.cos(eq2) / eq2) - (Math.sin(eq2) / sq(eq2));
    return Math.abs(-1 * (eq5 * Math.sin(eq2) + eq3 * Math.cos(eq2)) / (TWO_PI * (10 ** 11) * sq(rl) * l * (eq3 * eq4 - eq5 * eq6) * eq2));
}

function updateAnim() {
    sA = [];
    let l = animSlider.value() * TWO_PI * Math.sqrt(3.9 * (10 ** -8));
    let ro = doBeam / 2;
    let rl = dlBeam / 2;
    let drl = (rl - ro) / lBeam;
    let max = 0;
    for (let i = 0; i < 25; i++) {
        let eq1 = l * (i * lBeam / 25 + ro / drl);
        let eq2 = l * ro / drl;
        let eq3 = l * lBeam + eq2;
        let eq4 = Math.cos(eq2) / eq2 - Math.sin(eq2) / sq(eq2);
        let eq5 = Math.cos(eq3) / sq(eq3) + Math.sin(eq3) / eq3;
        let eq6 = Math.cos(eq2) / sq(eq2) + Math.sin(eq2) / eq2;
        let eq7 = Math.cos(eq3) / eq3 - Math.sin(eq3) / sq(eq3);
        sA.push(-1 * (eq6 * Math.sin(eq1) + eq4 * Math.cos(eq1)) / (TWO_PI * (10 ** 11) * sq(rl) * l * (eq4 * eq5 - eq6 * eq7) * eq1));
        if (Math.abs(sA[i]) > max) max = Math.abs(sA[i]);
    }
    sA = sA.map(x => x * 20 / max);
}

function drawAnim() {
    graph.drawAnalysisLine(animSlider.value());
    push();
    fill(blue);
    text(`${animSlider.value()} Hz`, 255 + animSlider.value() * graph.xDens, 438);
    pop();

    let s25;
    for (let i = 0; i < 25; i++) {
        let r = 250 * (doBeam / 2 + (dlBeam - doBeam) * i / 50);
        let s = (250 * i * lBeam / 25) - ((r * Math.cos(PI / 3)) - (sA[i] * Math.cos(0.7 * t * TWO_PI)));
        arc(120 + s, 640 - r / 2, r, r * 2, HALF_PI, 3 * HALF_PI);
        if (i === 24) s25 = s;
    }
    let r = 250 * dlBeam / 2;
    ellipse(120 + s25, 640 - r / 2, r, r * 2);
    push();
    stroke(orange);
    let f = 20 * Math.cos(0.7 * t * TWO_PI);
    strokeWeight(2);
    line(120 + s25, 640 + r / 2, 120 + s25, 665 + r / 2);
    strokeWeight(3.5);
    line(120 + s25, 652 + r / 2, 120 + s25 + f, 652 + r / 2);
    pop();

}
