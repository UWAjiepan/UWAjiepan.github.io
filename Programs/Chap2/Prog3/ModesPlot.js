let t = 0, dt = 1 / 180;
let m1Slider, k1Slider, x1Slider, m2Slider, k2Slider, x2Slider;
let sliders = [];
let playButton, clearButton;
let playing;
let mm1 = 0.1, mm2 = 0.1, km1 = 8, km2 = 8, xm1 = 7, xm2 = 7, values = [mm1, km1, xm1, mm2, km2, xm2],
    factors = [10, 10, 10, 10, 10, 10];
let inputs = [], inputAttr = [[0.1, 2, 0.1], [5, 10, 0.1], [-9, 9, 0.1], [0.1, 2, 0.1], [5, 10, 0.1], [-9, 9, 0.1]];
let plot;

/*
    Setup is the first of two required functions.
    Function will be run once on page load.
    createCanvas must be called here as well as any other objects that need to be initialised once.
 */
function setup() {
    createCanvas(1000, 480);
    createSliders();
    createButtons();
    createInputs();
    plot = new Plot(200, 82.5, 460, 310);
    plot.addSecondYAxis();
    plot.addGrid(35, 0);
    plot.addScrollBar(30, 3, 7);
    plot.addNewDataSource(0, mass1Eq, 'blue', 1, 1);
    plot.addNewDataSource(0, mass2Eq, 'blue', 1, 2);
    plot.addNewDataSource(0, m1ma1Eq, 'red', 1, 1);
    plot.addNewDataSource(0, m2ma1Eq, 'black', 1, 1);
    plot.addNewDataSource(0, m1ma2Eq, 'red', 1, 2);
    plot.addNewDataSource(0, m2ma2Eq, 'black', 1, 2);
}

/*
    draw is the second required function.
    This function will run at the start of every frame.
    background() must be called on first line for animating to occur.
    Update and drawing functions are normally called here.
 */
function draw() {
    background(255);
    updateSliders();
    push();
    strokeWeight(4);
    stroke('black');
    line(675, 20, 725, 20);
    line(750, 20, 800, 20);
    line(825, 20, 875, 20);
    pop();


    plot.update();
    push();
    fill('blue');
    let y1 = mass1Eq(), y2 = mass2Eq();
    drawSpring(700, 20, 22, 125 + y1, 11);
    drawSpring(700, 175 + y1, 22, 125 + y2 - y1, 11);
    circle(700, 160 + y1, 30);
    circle(700, 315 + y2, 30);
    y1 = (t < 0.5 ? 5 * xm1 * (0.5 - t) : 0) + m1ma1Eq();
    y2 = (t < 0.5 ? 5 * xm2 * (0.5 - t) : 0) + m1ma2Eq();
    fill('red');
    drawSpring(775, 20, 22, 125 + y1, 11);
    drawSpring(775, 175 + y1, 22, 125 + y2 - y1, 11);
    circle(775, 160 + y1, 30);
    circle(775, 315 + y2, 30);
    text("Mode 1", 755, 16);
    y1 = (t < 0.5 ? 5 * xm1 * (0.5 - t) : 0) + m2ma1Eq();
    y2 = (t < 0.5 ? 5 * xm2 * (0.5 - t) : 0) + m2ma2Eq();
    fill('black');
    drawSpring(850, 20, 22, 125 + y1, 11);
    drawSpring(850, 175 + y1, 22, 125 + y2 - y1, 11);
    circle(850, 160 + y1, 30);
    circle(850, 315 + y2, 30);
    text("Mode 2", 830, 16);
    pop();

    if (playing && focused) t += dt;
}


/*

        EVENT HANDLERS

 */

function updateSliders() {
    push();
    drawSubscript(33, 60, "m", '1');
    text(':                  kg', 51, 60);
    drawSubscript(39, 120, 'k', '1');
    text(':                  N/m', 51, 120);
    drawSubscript(20, 180, "X", '1');
    text('(0):                  mm', 34, 180);
    drawSubscript(33, 240, "m", '2');
    text(':                  kg', 51, 240);
    drawSubscript(39, 300, 'k', '2');
    text(':                  N/m', 51, 300);
    drawSubscript(20, 360, "X", '2');
    text('(0):                  mm', 34, 360);
    pop();
}

function onPause() {
    playing = false;
    playButton.html('Play');
    playButton.mousePressed(onPlay);
    clearButton.removeAttribute('disabled');
    sliders.forEach(unlockSliders);
    inputs.forEach(unlockSliders);
    plot.pause();
}

function onPlay() {
    playButton.html('Pause');
    playButton.mousePressed(onPause);
    sliders.forEach(lockSliders);
    inputs.forEach(lockSliders);
    clearButton.attribute('disabled', 'disabled');
    playing = true;
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
    mm1 = values[0];
    km1 = values[1];
    xm1 = values[2];
    mm2 = values[3];
    km2 = values[4];
    xm2 = values[5];
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
    m1Slider = createSlider(1, 20, mm1 * 10);
    k1Slider = createSlider(50, 100, km1 * 10);
    x1Slider = createSlider(-90, 90, xm1 * 10);
    m2Slider = createSlider(1, 20, mm2 * 10);
    k2Slider = createSlider(50, 100, km2 * 10);
    x2Slider = createSlider(-90, 90, xm2 * 10);
    sliders = [m1Slider, k1Slider, x1Slider, m2Slider, k2Slider, x2Slider];
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
    playButton.position(50, 400);
    playButton.mousePressed(onPlay);
    playButton.style('width', '50px');
    playButton.parent('canvas');
    clearButton = createButton('Clear');
    clearButton.position(50, 430);
    clearButton.mousePressed(function () {
        playButton.removeAttribute('disabled');
        plot.clear();
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

/*

function eq13(max) {
    let sc = 5, d1 = [sc*xm1], d2 = [sc*xm2], x1 = [xm1], x2 = [xm2], f1 = [], f2 = [], y1 = [0], y2 = [0], dt2 = 1/180;
    for (let i = 0; i < max; i++) {
        f1[i] = (-km1 * x1[i] + km2 * (x2[i] - x1[i])) / mm1;
        f2[i] = (-km2 * (x2[i] - x1[i])) / mm2;
        x1[i + 1] = x1[i] + y1[i] * dt2 / 2.0;
        x2[i + 1] = x2[i] + y2[i] * dt2 / 2.0;
        y1[i + 1] = y1[i] + f1[i] * dt2 / 2.0;
        y2[i + 1] = y2[i] + f2[i] * dt2 / 2.0;
        f1[i + 1] = (-km1 * x1[i + 1]+ km2 * (x2[i + 1] - x1[i + 1])) / mm1;
        f2[i + 1] = (-km2 * (x2[i + 1] - x1[i + 1])) / mm2;
        x1[i + 2] = x1[i] + y1[i + 1] * dt2 / 2.0;
        x2[i + 2] = x2[i] + y2[i + 1] * dt2 / 2.0;
        y1[i + 2] = y1[i] + f1[i + 1] * dt2 / 2.0;
        y2[i + 2] = y2[i] + f2[i + 1] * dt2 / 2.0;
        f1[i + 2] = (-km1 * x1[i + 2] + km2 * (x2[i + 2] - x1[i + 2])) / mm1;
        f2[i + 2] = (-km2 * (x2[i + 2] - x1[i + 2])) / mm2;
        x1[i + 3] = x1[i] + y1[i + 2] * dt2;
        x2[i + 3] = x2[i] + y2[i + 2] * dt2;
        y1[i + 3] = y1[i] + f1[i + 2] * dt2;
        y2[i + 3] = y2[i] + f2[i + 2] * dt2;
        f1[i + 3] = (-km1 * x1[i + 3]+ km2 * (x2[i + 3] - x1[i + 3])) / mm1;
        f2[i + 3] = (-km2 * (x2[i + 3] - x1[i + 3])) / mm2;
        x1[i + 1] = x1[i] + (y1[i] + 2.0 * y1[i + 1] + 2.0 * y1[i + 2] + y1[i + 3]) * dt2 / 6.0;
        x2[i + 1] = x2[i] + (y2[i] + 2.0 * y2[i + 1] + 2.0 * y2[i + 2] + y2[i + 3]) * dt2 / 6.0;
        y1[i + 1] = y1[i] + (f1[i] + 2.0 * f1[i + 1] + 2.0 * f1[i + 2] + f1[i + 3]) * dt2 / 6.0;
        y2[i + 1] = y2[i] + (f2[i] + 2.0 * f2[i + 1] + 2.0 * f2[i + 2] + f2[i + 3]) * dt2 / 6.0;
        d1[i + 1] = sc*x1[i + 1];
        d2[i + 1] = sc*x2[i + 1];
    }
    return {
        d1:d1,
        d2:d2
    }
}

 */

function m1ma2Eq() {
    let scale = 5;
    let w1 = getW(1), w2 = getW(2);
    let u1 = (km2) / (km1 + km2 - (mm1 * w1 * w1));
    let u2 = (km2) / (km1 + km2 - (mm1 * w2 * w2));
    let mode1 = (xm2 - u2 * xm1) / (u1 - u2);
    return scale * mode1 * Math.cos(w1 * t);
}

function m1ma1Eq() {
    let w = getW(1);
    let u1 = (km2) / (km1 + km2 - (mm1 * w * w));
    return u1 * m1ma2Eq();
}

function m2ma2Eq() {
    let scale = 5;
    let w1 = getW(1), w2 = getW(2);
    let u1 = (km2) / (km1 + km2 - (mm1 * w1 * w1));
    let u2 = (km2) / (km1 + km2 - (mm1 * w2 * w2));
    let mode2 = (u1 * xm1 - xm2) / (u1 - u2);
    return scale * mode2 * Math.cos(w2 * t);
}

function m2ma1Eq() {
    let w = getW(2);
    let u2 = (km2) / (km1 + km2 - (mm1 * w * w));
    return m2ma2Eq() * u2;
}

function mass2Eq() {
    return (t < 0.5 ? 5 * xm2 * (0.5 - t) : 0) + m1ma2Eq() + m2ma2Eq();
}


function mass1Eq() {
    return (t < 0.5 ? 5 * xm1 * (0.5 - t) : 0) + m1ma1Eq() + m2ma1Eq();
}


function getW(mode) {
    let eq1 = (mm2 * km1) + (km2 * mm2) + (mm1 * km2);
    let eq2 = (mm1 * mm1 * km2 * km2) + (km2 * km2 * mm2 * mm2) + (2 * mm1 * km2 * km2 * mm2) + (2 * km2 * mm2 * mm2 * km1) - (2 * mm1 * km2 * mm2 * km1) + (mm2 * mm2 * km1 * km1);
    let eq3 = 2 * mm1 * mm2;
    if (mode === 1) return sqrt((eq1 - sqrt(eq2)) / eq3);
    else if (mode === 2) return sqrt((eq1 + sqrt(eq2)) / eq3);
}

