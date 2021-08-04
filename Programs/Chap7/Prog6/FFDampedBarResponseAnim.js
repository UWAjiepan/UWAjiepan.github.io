let gold = '#DAA520', red = '#FF0000', blue = '#0000FF', orange = '#FFA500', cblue = '#5F9EA0';
let lSlider, dSlider, etaSlider, sliders = [], animSlider;
let lBeam = 2, dBeam = 0.2, etaBeam = 0.1, values = [lBeam, dBeam, etaBeam], factors = [10, 100, 100];
let inputs = [], inputAttr = [[0.5, 2, 0.1], [0.05, 0.2, 0.01], [0.01, 1, 0.01]];
let graph;
let t = 0, dt = 1 / 60;
let s0 = [], s1 = [];


function setup() {
    createCanvas(920, 900).parent('canvas');
    createSliders();
    createInputs();

    animSlider = createSlider(1, 5000, 500);
    animSlider.parent('canvas');
    animSlider.position(242, 495);
    animSlider.style('width', '480px');
    animSlider.input(updateAnim);

    graph = new StaticGraph(250, 50, 470, 400, [0, 5000], [-12, -5], 1000, 'log');
    graph.addPointsFunction('1', [], calcResponse, 1, cblue);
    graph.addAnalysisLine(blue, 1, calcResponse, []);
    graph.pointObjects[0].dens = 2.5;

    updateAnim();
}

function draw() {
    background(255);
    updateSliders();
    graph.draw();
    text('Frequency     (Hz)', 455, 480);
    text('Receptance', 155, 85);

    drawFraction(175, 45, 'X', 'F');
    drawFraction(200, 45, 'm', 'N');

    drawDiagram();
    drawAnim();

    if (focused) t += dt;
}


/*
        EVENT HANDLERS
*/

function updateSliders() {
    push();
    text('Length:                 m', 33, 50);
    text('Diameter:                 m', 23, 110);
    text('η:', 50, 170);
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
    etaBeam = values[2];
    updateAnim();
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
        s.position(startX + (i === 2 ? -15 : 0), startY + i * 60);
        s.style('width', '50px');
        inputs.push(s);
    }
}

function createSliders() {
    lSlider = createSlider(5, 20, lBeam * 10);
    dSlider = createSlider(5, 20, dBeam * 100);
    etaSlider = createSlider(1, 100, etaBeam * 100);
    sliders = [lSlider, dSlider, etaSlider];
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
    pop();
}

function calcResponse(x) {
    let w = x * TWO_PI;
    let l = w * Math.sqrt(3.9 * (10 ** -8));
    let a = PI * sq(dBeam) / 4;
    let eq1 = Math.sqrt(1 + sq(etaBeam));
    let eq2 = Math.sqrt((eq1 + 1) / 2) / eq1;
    let eq3 = -Math.sqrt((eq1 - 1) / 2) / eq1;
    let eq4 = (Math.exp(l * eq3 * lBeam) - Math.exp(-l * eq3 * lBeam)) / 2;
    let eq5 = (Math.exp(l * eq3 * lBeam) + Math.exp(-l * eq3 * lBeam)) / 2;
    let eq6 = (Math.cos(l * eq2 * lBeam) * eq4 * (eq3 + etaBeam * eq2) + (etaBeam * eq3 - eq2) * Math.sin(l * eq2 * lBeam) * eq5) * 2 * (2 * (10 ** 11)) * a * l;
    let eq7 = (Math.cos(l * eq2 * lBeam) * eq4 * (etaBeam * eq3 - eq2) - (eq3 + etaBeam * eq2) * Math.sin(l * eq2 * lBeam) * eq5) * 2 * (2 * (10 ** 11)) * a * l;
    let eq8 = 2 / (sq(eq6) + sq(eq7));
    return Math.sqrt(sq(eq8 * (eq6 * eq5 * Math.cos(l * eq2 * lBeam) - eq7 * eq4 * Math.sin(l * eq2 * lBeam)))
        + sq(-eq8 * (eq6 * eq4 * Math.sin(l * eq2 * lBeam) + eq7 * eq5 * Math.cos(l * eq2 * lBeam))))
}

function updateAnim() {
    s0 = [];
    s1 = [];
    let l = animSlider.value() * TWO_PI * Math.sqrt(3.9 * (10 ** -8));
    let a = PI * sq(dBeam) / 4;
    let max = 0;
    for (let i = 0; i < 25; i++) {
        let eq1 = Math.sqrt(1 + sq(etaBeam));
        let eq2 = Math.sqrt((eq1 + 1) / 2) / eq1;
        let eq3 = -Math.sqrt((eq1 - 1) / 2) / eq1;
        let eq4 = (Math.exp(l * eq3 * lBeam) - Math.exp(-l * eq3 * lBeam)) / 2;
        let eq5 = (Math.exp(l * eq3 * lBeam) + Math.exp(-l * eq3 * lBeam)) / 2;
        let eq6 = (Math.cos(l * eq2 * lBeam) * eq4 * (eq3 + etaBeam * eq2) + (etaBeam * eq3 - eq2) * Math.sin(l * eq2 * lBeam) * eq5) * 2 * (2 * (10 ** 11)) * a * l;
        let eq7 = (Math.cos(l * eq2 * lBeam) * eq4 * (etaBeam * eq3 - eq2) - (eq3 + etaBeam * eq2) * Math.sin(l * eq2 * lBeam) * eq5) * 2 * (2 * (10 ** 11)) * a * l;
        let eq8 = 2 / (sq(eq6) + sq(eq7));
        let eq9 = eq8 * (eq6 * eq5 * Math.cos(l * eq2 * lBeam * i / 25) - eq7 * eq4 * Math.sin(l * eq2 * lBeam * i / 25));
        let eq10 = -eq8 * (eq6 * eq4 * Math.sin(l * eq2 * lBeam * i / 25) + eq7 * eq5 * Math.cos(l * eq2 * lBeam * i / 25));
        s0.push(eq9);
        s1.push(eq10);
        if (Math.sqrt(sq(eq9) + sq(eq10)) > max) max = Math.sqrt(sq(eq9) + sq(eq10));
    }
    s0 = s0.map(x => x * 20 / max);
    s1 = s1.map(x => x * 20 / max);
}

function drawAnim() {
    graph.drawAnalysisLine(animSlider.value());
    push();
    fill(blue);
    text(`${animSlider.value()} Hz`, 255 + animSlider.value() * graph.xDens, 438);
    pop();

    let r = 450 * dBeam / 2;
    let s00, s25;
    for (let i = 0; i < 25; i++) {
        let s = (450 * i * lBeam / 50) - ((r * Math.cos(PI / 3)) - (s0[i] * Math.cos(0.7 * t * TWO_PI)) + s1[i] * Math.sin(0.7 * t * TWO_PI));
        arc(120 + s, 640 - r, r, r * 2, HALF_PI, 3 * HALF_PI);
        if (i === 0) s00 = s;
        if (i === 24) s25 = s;
    }
    ellipse(120 + s25, 640 - r, r, r * 2);
    line(120 + s00, 640 - r * 2, 120 + s25, 640 - r * 2);
    line(120 + s00, 640, 120 + s25, 640);

    push();
    stroke(orange);
    let f = 20 * Math.cos(0.7 * t * TWO_PI);
    strokeWeight(2);
    line(120 + s25, 640, 120 + s25, 665);
    strokeWeight(3.5);
    line(120 + s25, 652, 120 + s25 + f, 652);
    pop();

}
