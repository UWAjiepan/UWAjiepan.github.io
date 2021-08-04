let t = 0, dt = 1 / 100;
let fnSlider, fSlider, rdmSlider, drSlider, sliders = [];
let playButton, clearButton;
let playing;
let fMass = 1, rdmMass = 5, fnMass = 0.5, drMass = 0.1, values = [fnMass, fMass, rdmMass, drMass],
    factors = [100, 100, 10, 100];
let inputs = [], inputAttr = [[0.1, 1.5, 0.01], [0.1, 2, 0.01], [0.01, 17, 0.01], [0.001, 2, 0.001]];


function setup() {
    createCanvas(1080, 720).parent('canvas');
    createSliders();
    createButtons();
    createInputs();
    plot = new Plot(200, 180, 460, 170);
    plot.addGrid(35, 0);
    plot.addScrollBar(30, 3, 5);
}

function draw() {
    background(255);
    playing = plot.playing;
    updateSliders();
    plot.update();
    if (plot.hasPlayed()) drawDiagram();
    if (plot.ended) onPause();
    if (playing && focused) t += dt;
}

/*
        DRAWING FUNCTIONS
*/

function updateSliders() {
    push();
    drawSubscript(33, 60, 'ω', 'n');
    text(':                  Hz', 48, 60);
    text('ω:                 Hz', 41, 120);
    drawFraction(25, 170, "m' r", "(m + m')");
    text(':                 mm', 52, 177);
    text('ξ:                  ', 45, 240);
    pop();
}

function drawDiagram() {
    drawDamperBox(730, 10, 150);
    push();
    strokeWeight(4);
    stroke('black');
    line(694, 10, 752, 10);
    pop();
    let y = drawMass(700, 245, 40, 40, plot.getLatestDataValue(0));
    drawDamper(736, y + 245, 160);
    drawSpring(708, 10, 33, 235 + y, 11);
    drawOOBMass(720, 265 + y, 10)
}

/*

        EVENT HANDLERS

 */

function onPause() {
    plot.pause();
    playButton.html('Play');
    playButton.mousePressed(onPlay);
    clearButton.removeAttribute('disabled');
    sliders.forEach(unlockSliders);
    inputs.forEach(unlockSliders);
    if (plot.ended) playButton.attribute('disabled', 'disabled');
}

function onPlay() {
    playButton.html('Pause');
    playButton.mousePressed(onPause);
    clearButton.attribute('disabled', 'disabled');
    sliders.forEach(lockSliders);
    inputs.forEach(lockSliders);
    if (plot.dataSources.length === 0) {
        plot.addNewDataSource(1, equation(1380));
    }
    plot.play();
}


function onSliderInput(index) {
    return function () {
        plot.clear();
        t = 0;
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
        plot.clear();
        t = 0;
        values[index] = Number(this.value);
        sliders[index].value(this.value * factors[index]);
        updateValues();
    }
}

function updateValues() {
    fnMass = values[0];
    fMass = values[1];
    rdmMass = values[2];
    drMass = values[3];
}


/*

         SETUP FUNCTIONS

 */

function createInputs() {
    let startX = 55, startY = 45;
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
    fnSlider = createSlider(10, 150, fnMass * 100);
    fSlider = createSlider(10, 200, fMass * 100);
    rdmSlider = createSlider(1, 170, rdmMass * 10);
    drSlider = createSlider(0, 200, drMass * 100);
    sliders = [fnSlider, fSlider, rdmSlider, drSlider];
    let spos = 70;
    sliders.forEach(function (s, i) {
        s.position(25, spos);
        s.style('width', '100px');
        s.parent('canvas');
        s.input(onSliderInput(i));
        spos += 60;
    });
}

function createButtons() {
    playButton = createButton("Play");
    playButton.position(50, 290);
    playButton.mousePressed(onPlay);
    playButton.style('width', '50px');
    playButton.parent('canvas');
    clearButton = createButton("Clear");
    clearButton.position(50, 320);
    clearButton.mousePressed(function () {
        playButton.removeAttribute('disabled');
        plot.reset();
        t = 0;
    });
    clearButton.style('width', '50px');
    clearButton.parent('canvas');
}

/*

        HELPER FUNCTIONS

 */

function lockSliders(s) {
    s.attribute('disabled', 'disabled');
}

function unlockSliders(s) {
    s.removeAttribute('disabled');
}

function equation(s) {
    let a = [], r = [], t = [], M = [], e = [], n = [];
    a[0] = 0, r[0] = 0, t[0] = 0, n.push(0);
    let d = fnMass * TWO_PI, f = sq(d), l = fMass * TWO_PI, u = 0;
    for (let a = 0; a < s; a++) e[a] = -rdmMass * l * l * Math.sin(l * (u - 2)), u < 2 && (e[a] = 0), u += .02;
    u = 0;
    for (let l = 0; l < s; l++) {
        M[l] = e[l] - f * r[l] - 2 * d * drMass * t[l], r[l + 1] = r[l] + .02 * t[l] / 2, t[l + 1] = t[l] + .02 * M[l] / 2, M[l + 1] = e[l + 1] - f * r[l + 1] - 2 * d * drMass * t[l + 1], r[l + 2] = r[l] + .02 * t[l + 1] / 2, t[l + 2] = t[l] + .02 * M[l + 1] / 2, M[l + 2] = e[l + 2] - f * r[l + 2] - 2 * d * drMass * t[l + 2], r[l + 3] = r[l] + .02 * t[l + 2], t[l + 3] = t[l] + .02 * M[l + 2], M[l + 3] = e[l + 3] - f * r[l + 3] - 2 * d * drMass * t[l + 3], r[l + 1] = r[l] + .02 * (t[l] + 2 * t[l + 1] + 2 * t[l + 2] + t[l + 3]) / 6, t[l + 1] = t[l] + .02 * (M[l] + 2 * M[l + 1] + 2 * M[l + 2] + M[l + 3]) / 6, a[l + 1] = r[l + 1];
        let s = 23;
        a[l + 1] > s && (a[l + 1] = s, r[l + 1] = s, t[l + 1] *= -.7), a[l + 1] < -s && (a[l + 1] = -s, r[l + 1] = -s, t[l + 1] *= -.7), n.push(3.5 * a[l + 1]), u += .02
    }
    return n
}