let gold = '#DAA520', red = '#FF0000', blue = '#0000FF', orange = '#FFA500', cblue = '#5F9EA0';
let lSlider, dSlider, bSlider, sliders = [], animSlider;
let lBeam = 1.5, dBeam = 0.12, bBeam = 0.12, values = [lBeam, dBeam, bBeam], factors = [100, 100, 100];
let inputs = [], inputAttr = [[0.5, 2, 0.01], [0.08, 0.2, 0.01], [0.02, 0.2, 0.01]];
let graph;
let t = 0, dt = 1 / 30;
let s0 = [];


function setup() {
    createCanvas(920, 900).parent('canvas');
    createSliders();
    createInputs();
    frameRate(30);

    animSlider = createSlider(1, 5000, 500);
    animSlider.parent('canvas');
    animSlider.position(242, 495);
    animSlider.style('width', '480px');
    animSlider.input(updateAnim);

    graph = new StaticGraph(250, 50, 470, 400, [0, 5000], [-13, -4], 1000, 'log');
    graph.addPointsFunction('1', [], calcResponse, 1, cblue);
    graph.addAnalysisLine(blue, 1, calcResponse, []);

    updateAnim();
}

function draw() {
    background(255);
    updateSliders();
    graph.draw();
    text('Frequency     (Hz)', 455, 480);
    text('Receptance', 155, 60);

    drawFraction(175, 20, 'X', 'F');
    drawFraction(200, 20, 'm', 'N');

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
    text('D:                 m', 48, 110);
    text('B:                 m', 48, 170);
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
    bBeam = values[2];
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
        s.position(startX + (i === 0 ? 15 : 0), startY + i * 60);
        s.style('width', '50px');
        inputs.push(s);
    }
}

function createSliders() {
    lSlider = createSlider(50, 200, lBeam * 100);
    dSlider = createSlider(8, 20, dBeam * 100);
    bSlider = createSlider(2, 20, bBeam * 100);
    sliders = [lSlider, dSlider, bSlider];
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
    fill('#ffff66');
    stroke('#ffff66');
    rect(15, 315, 10, 55);
    fill('#ffe333');
    stroke('#ffe333');
    quad(15, 315, 25, 315, 75, 280, 65, 280);//40 320 60 306
    fill(orange);
    stroke(orange);
    quad(25, 315, 25, 370, 75, 335, 75, 280);
    fill('#ffffff');
    stroke(blue);
    rect(40, 320, 120, 25);
    quad(160, 320, 160, 346, 178, 331, 178, 306);
    quad(40, 320, 60, 306, 178, 306, 160, 320);
    pop();
    push();
    line(60, 300, 60, 280);
    line(178, 300, 178, 280);
    line(125, 320, 125, 360);
    line(125, 320, 150, 301);
    line(60, 290, 110, 290);
    line(130, 290, 178, 290);
    line(170, 325, 205, 325);
    line(185, 325, 185, 350);
    line(200, 325, 200, 350);

    text('B', 151, 303);
    text('L', 117, 295);
    text('D', 130, 360);

    fill('#000000');
    triangle(60, 290, 65, 286, 65, 294);
    triangle(178, 290, 173, 286, 173, 294);
    triangle(185, 355, 181, 350, 189, 350);
    triangle(200, 355, 196, 350, 204, 350);
    triangle(125, 345, 121, 340, 129, 340);
    triangle(125, 320, 121, 325, 129, 325);
    triangle(125, 320, 126, 316, 135, 316);
    triangle(144, 305, 134, 310, 144, 309);


    fill(cblue);
    text('X', 180, 375);
    fill(orange);
    text('F', 197, 375);
    pop();
}

function calcResponse(x) {
    let a = PI * bBeam * dBeam;
    let inertia = a * sq(dBeam) / 12;
    let w = x * TWO_PI;
    let l = Math.sqrt(Math.sqrt(sq(w) * a * 7800 / (2E11 * inertia)));
    let llen = l * lBeam;
    let s = Math.sin(llen);
    let c = Math.cos(llen);
    let sh = Math.sinh(llen);
    let ch = Math.cosh(llen);
    return Math.abs(-1 * (c * sh - s * ch) * (1 / (2E11 * inertia * (l ** 3) * (c * ch + 1))));
}

function updateAnim() {
    s0 = [];
    let a = PI * bBeam * dBeam;
    let inertia = a * sq(dBeam) / 12;
    let lambda = Math.sqrt(Math.sqrt(sq(animSlider.value() * TWO_PI) * a * 7800 / (2E11 * inertia)));
    let lamlen = lambda * lBeam;
    let s = Math.sin(lamlen);
    let c = Math.cos(lamlen);
    let sh = Math.sinh(lamlen); //n / n2
    let ch = Math.cosh(lamlen);
    let ss = s + sh;
    let cs = c + ch;//n5
    let eq = 1 / (2E11 * inertia * (lBeam ** 3) * (c * ch + 1));
    let max = 0;
    for (let i = 0; i < 150; i++) {
        let ll = lamlen * i / 150;
        let sl = Math.sin(ll);
        let cl = Math.cos(ll);
        let shl = Math.sinh(ll);
        let chl = Math.cosh(ll);
        s0.push(-1 * (ss * (cl - chl) - cs * (sl - shl)) * eq);
        if (Math.abs(s0[i]) > max) max = Math.abs(s0[i]);
    }
    s0 = s0.map(x => x * 20 / max);
}

function drawAnim() {
    graph.drawAnalysisLine(animSlider.value());
    push();
    fill(blue);
    text(`${animSlider.value()} Hz`, 255 + animSlider.value() * graph.xDens, 438);
    pop();
    push();
    fill('#ffff66');
    stroke('#ffff66');
    rect(105, 610, 35, 110);
    fill('#ffe333');
    stroke('#ffe333');
    quad(105, 610, 140, 610, 215, 550, 180, 550);
    fill(orange);
    stroke(orange);
    quad(140, 610, 215, 550, 215, 645, 140, 720);
    fill('#3dafff');
    stroke('#3dafff');
    let amp = s0.map(x => x * Math.cos(0.7 * t * TWO_PI));
    beginShape();
    for (let i = 0; i < s0.length; i++) {
        vertex(175 + (i * 250 * lBeam / 150) - (250 * bBeam * Math.cos(PI / 3)), 620 - (amp[i] - dBeam * 250 / 2) + (250 * bBeam * Math.sin(PI / 3) / 2));
    }
    for (let i = s0.length - 1; i >= 0; i--) {
        vertex(175 + (i * 250 * lBeam / 150) - (250 * bBeam * Math.cos(PI / 3)), 620 - (amp[i] + dBeam * 250 / 2) + (250 * bBeam * Math.sin(PI / 3) / 2));
    }
    endShape();
    fill('#2074ff');
    stroke('#2074ff');
    beginShape();
    for (let i = 0; i < s0.length; i++) {
        vertex(175 + (i * 250 * lBeam / 150) - (250 * bBeam * Math.cos(PI / 3)), 620 - (amp[i] + dBeam * 250 / 2) + (250 * bBeam * Math.sin(PI / 3) / 2));
    }
    for (let i = s0.length - 1; i >= 0; i--) {
        vertex(175 + (i * 250 * lBeam / 150) + (250 * bBeam * Math.cos(PI / 3)), 620 - (amp[i] + dBeam * 250 / 2) - (250 * bBeam * Math.sin(PI / 3) / 2));
    }
    endShape();
    quad(175 + (149 * 250 * lBeam / 150) - (250 * bBeam * Math.cos(PI / 3)), 620 - (amp[149] - dBeam * 250 / 2) + (250 * bBeam * Math.sin(PI / 3) / 2),
        175 + (149 * 250 * lBeam / 150) - (250 * bBeam * Math.cos(PI / 3)), 620 - (amp[149] + dBeam * 250 / 2) + (250 * bBeam * Math.sin(PI / 3) / 2),
        175 + (149 * 250 * lBeam / 150) + (250 * bBeam * Math.cos(PI / 3)), 620 - (amp[149] + dBeam * 250 / 2) - (250 * bBeam * Math.sin(PI / 3) / 2),
        175 + (149 * 250 * lBeam / 150) + (250 * bBeam * Math.cos(PI / 3)), 620 - (amp[149] - dBeam * 250 / 2) - (250 * bBeam * Math.sin(PI / 3) / 2));
    pop();
    push();
    stroke(orange);
    strokeWeight(2.5);
    line(160 + 250 * lBeam + (250 * bBeam * Math.cos(PI / 3)), 620 - (amp[149] - dBeam * 250 / 2) - (250 * bBeam * Math.sin(PI / 3) / 2), 200 + 250 * lBeam + (250 * bBeam * Math.cos(PI / 3)), 620 - (amp[149] - dBeam * 250 / 2) - (250 * bBeam * Math.sin(PI / 3) / 2));
    strokeWeight(4);
    strokeCap(SQUARE);
    line(190 + 250 * lBeam + (250 * bBeam * Math.cos(PI / 3)), 620 - (amp[149] - dBeam * 250 / 2) - (250 * bBeam * Math.sin(PI / 3) / 2), 190 + 250 * lBeam + (250 * bBeam * Math.cos(PI / 3)), 620 - (20 * Math.cos(0.7 * t * TWO_PI)) - (amp[149] - dBeam * 250 / 2) - (250 * bBeam * Math.sin(PI / 3) / 2));
    pop();
}
