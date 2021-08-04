let t = 0, dt = 1 / 100;
let fnSlider, fSlider, rdmSlider, drSlider, aaSlider, sliders = [];
let playButton, clearButton;
let playing;
let fnMass = 0.7, fMass = 1, rdmMass = 5, drMass = 0.05, aaMass = 10, values = [fnMass, fMass, rdmMass, drMass, aaMass],
    factors = [100, 100, 10, 100, 10];
let inputs = [], inputAttr = [[0.1, 1.5, 0.01], [0.1, 2, 0.01], [0.01, 17, 0.01], [0.001, 2, 0.001], [0.1, 20, 0.1]];


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

function drawDiagram() {
    drawDamperBox(730, 10, 150);
    push();
    strokeWeight(4);
    stroke('black');
    line(694, 10, 752, 10);
    pop();
    y = drawMass(700, 245, 40, 40, plot.getLatestDataValue(0));
    drawDamper(736, y + 245, 160);
    drawSpring(708, 10, 33, 235 + y, 11);
    drawOOBMass(720, 265 + y, 10)
}

function updateSliders() {
    push();
    drawSubscript(33, 60, 'ω', 'n');
    text(':                  Hz', 48, 60);
    text('ω:                 Hz', 41, 120);
    drawFraction(25, 170, "m' r", "(m + m')");
    text(':                 mm', 52, 177);
    text('ξ:                  ', 45, 240);
    text('α:', 42, 300);
    drawFraction(125, 290, "rad", "s²");
    pop();
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
        let preload = equation(1380);
        preload.pop();
        preload.pop();
        plot.addNewDataSource(1, preload);
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
    aaMass = values[4];
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
    fnSlider = createSlider(10, 150, 70);
    fSlider = createSlider(10, 200, 100);
    rdmSlider = createSlider(1, 170, 50);
    drSlider = createSlider(0, 200, 5);
    aaSlider = createSlider(1, 200, 100);
    sliders = [fnSlider, fSlider, rdmSlider, drSlider, aaSlider];
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
    playButton.position(50, 350);
    playButton.mousePressed(onPlay);
    playButton.style('width', '50px');
    playButton.parent('canvas');
    clearButton = createButton("Clear");
    clearButton.position(50, 380);
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

//@formatter:off
function equation(s) {
    let a = [], M = [], t = [], r = [], f = [], e = [];
    a[0] = 0, M[0] = 0, t[0] = 0, e.push(0);
    let n = fnMass * TWO_PI, d = sq(n), q = fMass * TWO_PI, I = 2 + fMass * TWO_PI / aaMass, O = 0, P = 0;
    for (let a = 0; a < s; a++) f[a] = 0, q = 0, O > 2 && (O <= I && (P = .5 * aaMass * sq(O - 2), q = aaMass * (O - 2), f[a] = -rdmMass * (sq(q) * Math.sin(P) - aaMass * Math.cos(P))), O > I && (P = sq(fMass * TWO_PI) / (2 * aaMass) + fMass * TWO_PI * (O - I), q = fMass * TWO_PI, f[a] = -rdmMass * sq(q) * Math.sin(P))), O += .02;
    O = 0;
    for (let q = 0; q < s; q++) {
        r[q] = f[q] - d * M[q] - 2 * n * drMass * t[q], M[q + 1] = M[q] + .02 * t[q] / 2, t[q + 1] = t[q] + .02 * r[q] / 2, r[q + 1] = f[q + 1] - d * M[q + 1] - 2 * n * drMass * t[q + 1], M[q + 2] = M[q] + .02 * t[q + 1] / 2, t[q + 2] = t[q] + .02 * r[q + 1] / 2, r[q + 2] = f[q + 2] - d * M[q + 2] - 2 * n * drMass * t[q + 2], M[q + 3] = M[q] + .02 * t[q + 2], t[q + 3] = t[q] + .02 * r[q + 2], r[q + 3] = f[q + 3] - d * M[q + 3] - 2 * n * drMass * t[q + 3], M[q + 1] = M[q] + .02 * (t[q] + 2 * t[q + 1] + 2 * t[q + 2] + t[q + 3]) / 6, t[q + 1] = t[q] + .02 * (r[q] + 2 * r[q + 1] + 2 * r[q + 2] + r[q + 3]) / 6, a[q + 1] = M[q + 1];
        let s = 23;
        a[q + 1] > s && (a[q + 1] = s, M[q + 1] = s, t[q + 1] *= -.7), a[q + 1] < -s && (a[q + 1] = -s, M[q + 1] = -s, t[q + 1] *= -.7), e.push(3.5 * a[q + 1]), O += .02
    }
    return e
}

//@formatter:on