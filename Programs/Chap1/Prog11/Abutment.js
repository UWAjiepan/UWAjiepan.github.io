let t = 0, dt = 1 / 100;
let fnSlider, fSlider, xinSlider, drSlider, sliders = [];
let playButton, clearButton;
let playing;
let fnMass = 0.7, fMass = 1, xinMass = 7, drMass = 0.05, values = [fnMass, fMass, xinMass, drMass],
    factors = [100, 100, 10, 100];
let inputs = [], inputAttr = [[0.1, 1.5, 0.01], [0.1, 2, 0.01], [0.01, 10, 0.01], [0, 2, 0.001]];

function setup() {
    createCanvas(1080, 720).parent('canvas');
    createSliders();
    createButtons();
    createInputs();
    plot = new Plot(200, 250, 460, 170);
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

        DRAWING HANDLERS

 */

function drawDiagram() {
    let my = plot.getLatestDataValue(0);
    let ay = plot.getLatestDataValue(1);
    drawDamperBox(730, 50 + ay, 190);
    push();
    strokeWeight(4);
    stroke('black');
    line(694, 50 + ay, 752, 50 + ay);
    pop();
    drawMass(700, 315, 40, 40, my);
    drawDamper(736, my + 315, 160);
    drawSpring(708, 50 + ay, 33, 265 + my - ay, 11);
}

function updateSliders() {
    push();
    drawSubscript(33, 60, 'ω', 'n');
    text(':                  Hz', 48, 60);
    text('ω:                  Hz', 41, 120);
    drawSubscript(37, 175, 'x', '0');
    text(':                  mm', 48, 175);
    text('ξ:                  ', 45, 240);
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
        plot.addNewDataSource(1, preload.y);
        plot.addNewDataSource(1, preload.f, 'orange');
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
    xinMass = values[2];
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
    fnSlider = createSlider(10, 150, 70);
    fSlider = createSlider(10, 200, 100);
    xinSlider = createSlider(1, 100, 70);
    drSlider = createSlider(0, 200, 5);
    sliders = [fnSlider, fSlider, xinSlider, drSlider];
    let spos = 70;
    sliders.forEach(function (s, i) {
        s.position(25, spos);
        s.parent('canvas');
        s.input(onSliderInput(i));
        s.style('width', '100px');
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

//@formatter:off
function equation(s) {
    let a = [], t = [], r = [], M = [], e = [], n = [], f = [];
    a[0] = 0, f.push(0), t[0] = 0, r[0] = 0;
    let u = fnMass * TWO_PI, l = sq(u), d = fMass * TWO_PI, h = .02, i = 0;
    for (let a = 0; a < s; a++) e[a] = xinMass * Math.sin(d * (i - 2)), i < 2 && (e[a] = 0), i += h, n.push(3.5 * e[a]);
    i = 0, r[0] = 0;
    for (let n = 0; n < s; n++) {
        M[n] = -l * (t[n] - e[n]) - 2 * u * drMass * (r[n] - (e[n + 1] - e[n]) / h), t[n + 1] = t[n] + r[n] * h / 2, r[n + 1] = r[n] + M[n] * h / 2, M[n + 1] = -l * (t[n + 1] - e[n + 1]) - 2 * u * drMass * (r[n + 1] - (e[n + 2] - e[n + 1]) / h), t[n + 2] = t[n] + r[n + 1] * h / 2, r[n + 2] = r[n] + M[n + 1] * h / 2, M[n + 2] = -l * (t[n + 2] - e[n + 2]) - 2 * u * drMass * (r[n + 2] - (e[n + 3] - e[n + 2]) / h), t[n + 3] = t[n] + r[n + 2] * h, r[n + 3] = r[n] + M[n + 2] * h, M[n + 3] = -l * (t[n + 3] - e[n + 3]) - 2 * u * drMass * (r[n + 3] - (e[n + 4] - e[n + 3]) / h), t[n + 1] = t[n] + (r[n] + 2 * r[n + 1] + 2 * r[n + 2] + r[n + 3]) * h / 6, r[n + 1] = r[n] + (M[n] + 2 * M[n + 1] + 2 * M[n + 2] + M[n + 3]) * h / 6, a[n + 1] = t[n + 1];
        let s = 23;
        a[n + 1] > s && (a[n + 1] = s, t[n + 1] = s, r[n + 1] *= -.7), a[n + 1] < -s && (a[n + 1] = -s, t[n + 1] = -s, r[n + 1] *= -.7), f.push(3.5 * a[n + 1]), i += h
    }
    return {y: f, f: n}
}

//@formatter:on