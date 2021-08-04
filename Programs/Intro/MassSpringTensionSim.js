let gold = '#DAA520', red = '#FF0000', blue = '#0000FF', orange = '#FFA500', cblue = '#5F9EA0';
let sliders = [];
let traceCheck;
let mass = 1, springConst = 10, delta = -10, xS = 6, yS = 10,
    values = [mass, springConst, delta, xS, yS],
    factors = [10, 10, 10, 1, 1];
let inputs = [], inputAttr = [[0.5, 50, 0.1], [10, 500, 0.1], [-20, 100, 0.1], [-80, 80, 1], [-80, 80, 1]];
let playButton, playing;
let vg = 0, sg = 0;
let xPoints = [], yPoints = [], maxPoints = 120;


function setup() {
    createCanvas(920, 900).parent('canvas');
    createSliders();
    createButtons();
    createInputs();

    traceCheck = createCheckbox("", false);
    traceCheck.parent('canvas');
    traceCheck.position(100, 330);
}


function draw() {
    background(255);
    updateSliders();
    drawDiagram();
    drawEquilibriumPoints();
    if (traceCheck.checked()) drawTrace();
}


/*
        EVENT HANDLERS
*/

function updateSliders() {
    push();
    text('m:                 m', 47, 50);
    text('k:                 N/m', 48, 110);
    text('δ:                 %', 48, 170);
    drawSubscript(42, 230, 'X', '0');
    drawSubscript(42, 290, 'Y', '0');
    text('Trace Path', 40, 343);
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
    mass = values[0];
    springConst = values[1];
    delta = values[2];
    xS = values[3];
    yS = values[4];
    t = 0;
    xPoints = [];
    yPoints = [];
    vg = 0;
    sg = 0;
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
    let xpos = 25, ypos = 60;
    values.forEach(function (v, i) {
        let s = createSlider(inputAttr[i][0] * factors[i], inputAttr[i][1] * factors[i], v * factors[i]);
        s.position(xpos, ypos);
        s.style('width', '100px');
        s.parent('canvas');
        s.input(onSliderInput(i));
        sliders.push(s);
        ypos += 60;
    });
}

function createButtons() {
    playButton = createButton("Play");
    playButton.position(50, 365);
    playButton.mousePressed(onPlay);
    playButton.style('width', '50px');
    playButton.parent('canvas');
}

function drawDiagram() {
    let h1 = Math.sqrt((100 * (1 + delta / 100) + xS) ** 2 + yS ** 2) + 5;
    let h2 = Math.sqrt((100 * (1 + delta / 100) - xS) ** 2 + yS ** 2) - 2;
    let a1 = Math.atan2(yS - 10, 100 * (1 + delta / 100) + xS);
    let a2 = Math.atan2(yS - 10, 100 * (1 + delta / 100) - xS);
    let sl = 22 + delta / 7;
    push();
    translate(225, 160);
    rotate(-HALF_PI + a1);
    drawSpring(0, 0, sl, h1, 11);
    pop();
    push();
    translate(250 + (200 * (1 + delta / 100)), 160);
    rotate(HALF_PI - a2);
    drawSpring(0, 0, sl, h2, 11);
    pop();
    push();
    stroke(orange);
    fill(orange);
    rect(200, 120, 25, 80);
    rect(250 + (200 * (1 + delta / 100)), 120, 25, 80);
    stroke(blue);
    fill(blue);
    circle(240 + (100 * (1 + delta / 100) + xS), 150 + yS, 30);
    pop();
    if (playing && focused) calcPath();
}

function drawTrace() {
    rect(230 + (100 * (1 + delta / 100) - Math.abs(values[3])), 370, 20 + 2 * Math.abs(values[3]), 120);
    rect(700, 25, 120, 250);
    let midx = 230 + (100 * (1 + delta / 100) - Math.abs(values[3])) + (20 + 2 * Math.abs(values[3])) / 2;
    push();
    stroke(blue);
    line(240 + (100 * (1 + delta / 100) + xS), 150 + yS, 240 + (100 * (1 + delta / 100) + xS), 370);
    beginShape();
    for (let i = xPoints.length - 1; i > -1; i--) {
        vertex(midx + xPoints[i], 370 + xPoints.length - i);
    }
    endShape();
    line(240 + (100 * (1 + delta / 100) + xS), 150 + yS, 700, 150 + yS);
    beginShape();
    for (let i = yPoints.length - 1; i > -1; i--) {
        vertex(700 + yPoints.length - i, 150 + yPoints[i]);
    }
    endShape();
    pop();
}

function drawEquilibriumPoints() {
    let xe = 240 + (100 * (1 + delta / 100));
    let ye1 = 160, ye2 = -20;
    let as = 0;
    let prev = 0, cur;
    for (let i = 1; i < 100; i++) {
        let a = HALF_PI - PI * i / 200;
        cur = 100 * (1 + delta / 100) / Math.cos(a) - 100 - mass * 9.81 / (2 * springConst * Math.sin(a));
        if (prev * cur < 0) {
            as = HALF_PI - PI * (i - 0.5) / 200;
            ye1 = 160 + (100 * (1 + delta / 100) * Math.tan(as));
        }
        prev = cur;
    }
    for (let i = 1; i < 100; i++) {
        let a = -PI * i / 200;
        cur = 100 * (1 + delta / 100) / Math.cos(a) - 100 - mass * 9.81 / (2 * springConst * Math.sin(a));
        if (prev * cur < 0) {
            as = -PI * (i - 0.5) / 200;
            ye2 = 160 + (100 * (1 + delta / 100) * Math.tan(as));
        }
        prev = cur;
    }
    push();
    noStroke();
    fill(255, 0, 0, 100);
    circle(xe, ye1, 10);
    circle(xe, ye2, 10);
    circle(40, 410, 10);
    pop();
    text('Equilibrium Positions', 50, 415);
}

function calcPath() {
    let f = [], p = [], x = [xS], y = [yS], v = [vg], s = [sg], dtx2 = 0.02;
    for (let i = 0; i < 4; i++) {
        let fa = (i < 2 ? 2 : 1);
        let h1 = Math.sqrt(((100 * (1 + delta / 100) + x[i]) ** 2) + y[i] ** 2);
        let h2 = Math.sqrt(((100 * (1 + delta / 100) - x[i]) ** 2) + y[i] ** 2);
        let sa1 = y[i] / h1;
        let ca1 = (100 * (1 + delta / 100) + x[i]) / h1;
        let sa2 = y[i] / h2;
        let ca2 = (100 * (1 + delta / 100) - x[i]) / h2;
        let d1 = h1 - 100;
        let d2 = h2 - 100;
        f.push((springConst * d2 * ca2 - springConst * d1 * ca1) / mass);
        p.push((mass * 9.81 - springConst * d2 * sa2 - springConst * d1 * sa1) / mass);
        if (i !== 3) {
            x.push(x[0] + v[i] * dtx2 / fa);
            v.push(v[0] + f[i] * dtx2 / fa);
            y.push(y[0] + s[i] * dtx2 / fa);
            s.push(s[0] + p[i] * dtx2 / fa);
        }
    }
    for (let i = 0; i < 4; i++) {
        let fa = (i === 0 || i === 3 ? 1 : 2);
        xS += fa * v[i] * dtx2 / 6;
        vg += fa * f[i] * dtx2 / 6;
        yS += fa * s[i] * dtx2 / 6;
        sg += fa * p[i] * dtx2 / 6;
    }
    xPoints.push(xS);
    yPoints.push(yS);
    if (xPoints.length >= maxPoints) {
        xPoints.splice(0, 1);
        yPoints.splice(0, 1);
    }
}

function onPlay() {
    playing = true;
    playButton.html('Pause');
    playButton.mousePressed(onPause);
    sliders.forEach(lockSliders);
    inputs.forEach(lockSliders);
    calcPath();
}

function onPause() {
    playing = false;
    playButton.html('Play');
    playButton.mousePressed(onPlay);
    sliders.forEach(unlockSliders);
    inputs.forEach(unlockSliders);
}

function lockSliders(s) {
    s.attribute('disabled', 'disabled');
}

function unlockSliders(s) {
    s.removeAttribute('disabled');
}

