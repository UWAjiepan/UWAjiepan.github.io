let gold = '#DAA520', red = '#FF0000', blue = '#0000FF', orange = '#FFA500', cblue = '#5F9EA0';
let lSlider, dSlider, sliders = [], animSlider;
let lBeam = 2, dBeam = 0.2, values = [lBeam, dBeam],
    factors = [10, 100];
let inputs = [], inputAttr = [[0.5, 2, 0.1], [0.05, 0.2, 0.01]];
let graph;
let t = 0, dt = 1 / 60;


function setup() {
    createCanvas(920, 900).parent('canvas');
    createSliders();
    createInputs();

    animSlider = createSlider(1, 5000, 500);
    animSlider.parent('canvas');
    animSlider.position(242, 495);
    animSlider.style('width', '480px');

    graph = new StaticGraph(250, 50, 470, 400, [0, 5000], [-13, -5], 1000, 'log');
    graph.addPointsFunction('1', [], calcResponse, 1, cblue);
    graph.addAnalysisLine(blue, 1, calcResponse, []);
    graph.pointObjects[0].dens = 2.5;
}

function draw() {
    background(255);
    updateSliders();
    graph.draw();
    text('Frequency     (Hz)', 455, 480);
    text('Receptance', 150, 95);

    drawFraction(175, 60, 'X', 'F');
    drawFraction(200, 60, 'm', 'N');

    drawDiagram();
    drawAnim();

    if (focused) t += dt;
}

function drawDiagram() {
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
}

/*
        EVENT HANDLERS
*/

function updateSliders() {
    push();
    text('Length:                 m', 33, 50);
    text('Diameter:                 m', 23, 110);
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
        s.position(startX, startY + i * 60);
        s.style('width', '50px');
        inputs.push(s);
    }
}

function createSliders() {
    lSlider = createSlider(5, 20, lBeam * 10);
    dSlider = createSlider(5, 20, dBeam * 100);
    sliders = [lSlider, dSlider];
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

function calcResponse(x) {
    let w = x * TWO_PI;
    let l = w * Math.sqrt(3.9 * (10 ** -8));
    let a = PI * sq(dBeam) / 4;
    return Math.abs(Math.tan(l * lBeam) / (a * (2 * (10 ** 11)) * l));
}

function drawAnim() {
    graph.drawAnalysisLine(animSlider.value());
    push();
    fill(blue);
    text(`${animSlider.value()} Hz`, 255 + animSlider.value() * graph.xDens, 438);
    pop();
    let p = [], max = 0;
    let l = animSlider.value() * TWO_PI * Math.sqrt(3.9 * (10 ** -8));
    for (let i = 1; i < 26; i++) {
        p.push(Math.sin(l * lBeam * i / 25) / Math.cos(l * lBeam));
        if (Math.abs(p[i - 1]) > max) max = Math.abs(p[i - 1]);
    }
    p = p.map(x => x * 20 / max);


    let r = 400 * dBeam / 2;
    push();
    stroke('#ffff66');
    fill('#ffff66');
    ellipse(70, 605, 60, 120);
    rect(70, 545, 25, 120);
    stroke(orange);
    fill(orange);
    ellipse(90, 605, 60, 120);
    fill('#ffffff');
    stroke('#ffffff');
    rect(100, 645 - r * 2, 20, r * 2);
    pop();

    arc(100, 645 - r, r, r * 2, HALF_PI, 3 * HALF_PI);

    for (let i = 1; i < 26; i++) {
        let s = (400 * i * lBeam / 30) - ((r * Math.cos(PI / 3)) - (p[i] * Math.cos(0.7 * t * TWO_PI)));
        arc(115 + s, 645 - r, r, r * 2, HALF_PI, 3 * HALF_PI);
    }

    let s30 = (400 * lBeam * 5 / 6) - ((r * Math.cos(PI / 3)) - p[p.length - 1] * Math.cos(0.7 * t * TWO_PI));
    ellipse(115 + s30, 645 - r, r, r * 2);
    line(100, 645 - r * 2, 115 + s30, 645 - r * 2);
    line(100, 645, 115 + s30, 645);

    push();
    stroke(orange);
    let f = 30 * Math.cos(0.7 * t * TWO_PI);
    strokeWeight(3);
    line(115 + s30, 645, 115 + s30, 670);
    strokeWeight(4);
    line(115 + s30, 657, 115 + s30 + f, 657);
    pop();

}
