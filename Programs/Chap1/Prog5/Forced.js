let t = 0, dt = 1 / 100;
let fnSlider, fSlider, fkSlider, drSlider, sliders = [];
let playButton, clearButton;
let playing;
let fMass = 1, fkMass = 7, fnMass = 0.7, drMass = 0.05, values = [fnMass, fMass, fkMass, drMass],
    factors = [100, 100, 10, 100];
let inputs = [], inputAttr = [[0.1, 1.5, 0.01], [0.1, 2, 0.01], [0.01, 17, 0.01], [0.001, 2, 0.001]];


function setup() {
    createCanvas(1080, 720);
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
    drawSubscript(35, 60, "ω", "n");
    text(':                  Hz', 50, 60);
    text('ω:                  Hz', 40, 120);
    drawSubscript(20, 190, "ω", "n");
    drawFraction(25, 170, "F", "m(     )²");
    text(':                  mm', 50, 178);
    text('ξ:                  ', 43, 240);
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
    drawForceVector(750, 265 + y, plot.getLatestDataValue(1));
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
        plot.addNewDataSource(1, preload.y);
        plot.addNewDataSource(1, preload.force, 'orange');
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
    fkMass = values[2];
    drMass = values[3];
}

/*

         SETUP FUNCTIONS

 */
function createSliders() {
    fnSlider = createSlider(10, 150, fnMass * 100);
    fSlider = createSlider(10, 200, fMass * 100);
    fkSlider = createSlider(1, 170, fkMass * 10);
    drSlider = createSlider(0, 200, drMass * 100);
    sliders = [fnSlider, fSlider, fkSlider, drSlider];
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
        plot.clear();
        t = 0;
    });
    clearButton.style('width', '50px');
    clearButton.parent('canvas');
}

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
    let a = [], t = [], M = [], r = [], e = [], f = [], n = [];
    a[0] = 0, t[0] = 0, M[0] = 0, r[0] = 0;
    let h = 2 * fnMass * Math.PI, l = h * h, o = 2 * fMass * Math.PI, u = 0;
    for (let a = 0; a < s; ++a) f[a] = fkMass * l * Math.sin(o * (u - 2)), n.push(3.5 * fkMass * Math.sin(o * (u - 2))), u < 2 && (f[a] = 0, n[a] = 0), u += .02;
    u = 0;
    for (let n = 0; n < s; ++n) {
        e[n] = f[n] - l * M[n] - 2 * h * drMass * r[n], M[n + 1] = M[n] + .02 * r[n] / 2, r[n + 1] = r[n] + .02 * e[n] / 2, e[n + 1] = f[n + 1] - l * M[n + 1] - 2 * h * drMass * r[n + 1], M[n + 2] = M[n] + .02 * r[n + 1] / 2, r[n + 2] = r[n] + .02 * e[n + 1] / 2, e[n + 2] = f[n + 2] - l * M[n + 2] - 2 * h * drMass * r[n + 2], M[n + 3] = M[n] + .02 * r[n + 2], r[n + 3] = r[n] + .02 * e[n + 2], e[n + 3] = f[n + 3] - l * M[n + 3] - 2 * h * drMass * r[n + 3], M[n + 1] = M[n] + .02 * (r[n] + 2 * r[n + 1] + 2 * r[n + 2] + r[n + 3]) / 6, r[n + 1] = r[n] + .02 * (e[n] + 2 * e[n + 1] + 2 * e[n + 2] + e[n + 3]) / 6, a[n + 1] = M[n + 1];
        let s = 25;
        a[n + 1] > s && (a[n + 1] = s, M[n + 1] = s, r[n + 1] *= -.5), a[n + 1] < -s && (a[n + 1] = -s, M[n + 1] = -s, r[n + 1] *= -.5), u += .02, t.push(3.5 * a[n + 1])
    }
    return {y: t, force: n}
}

