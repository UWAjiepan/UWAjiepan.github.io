let t = 0;
let mSlider, k1Slider, x1Slider, x2Slider, k2Slider;
let sliders = [];
let playButton, clearButton;
let playing;
let mMass = 2, xMass2 = 0, kMass1 = 20, kMass2 = 20, xMass1 = 45, values = [mMass, kMass1, kMass2, xMass1, xMass2],
    factors = [10, 10, 10, 10, 10];
let inputs = [], inputAttr = [[0.1, 10, 0.1], [1, 100, 0.1], [1, 100, 0.1], [-45, 45, 0.1], [-45, 45, 0.1]];
let plot;
let curData;
let dt;

/*
    Setup is the first of two required functions.
    Function will be run once on page load.
    createCanvas must be called here as well as any other objects that need to be initialised once.
 */
function setup() {
    createCanvas(1200, 720).parent('canvas');
    dt = 1 / 100;
    createSliders();
    createButtons();
    createInputs();
    plot = new Plot(280, 110, 500, 290);
    plot.addSecondYAxis();
    plot.addGrid(35, 0);
    plot.addScrollBar(30, 2.4, 7);
    curData = eq(1200);
    plot.addNewDataSource(1, curData.r, 'blue', 1, 1);
    plot.addNewDataSource(1, curData.l, 'blue', 1, 2);
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
    plot.update();
    let r = plot.getLatestDataValue(0), l = plot.getLatestDataValue(1);
    push();
    let sl = 18;
    drawSpring(810, 328 + l, sl, 97 - l, 9);
    drawSpring(1000, 328 + r, sl, 97 - r, 9);
    stroke('blue');
    line(782, 328 + l, 805, 328 + l);
    line(1005, 328 + r, 1020, 328 + r);
    line(1020, 328 + r, 1020, 183 + r);
    line(1020, 183 + r, 782, 183 + r);
    strokeWeight(4);
    line(810, 328 + l, 1000, 328 + r);
    noStroke();
    fill('gold');
    rect(800, 425, 210, 20);
    pop();

    if (playing && focused) t += dt;
}

/*

        EVENT HANDLERS

 */

function updateSliders() {
    push();
    drawSubscript(35, 120, "m", '1');
    text(':                 kg', 51, 120);
    drawSubscript(38, 180, 'k', '1');
    text(':                 N/m', 51, 180);
    drawSubscript(38, 240, 'k', '2');
    text(':                 N/m', 51, 240);
    drawSubscript(155, 120, "x", '1');
    text('(0):                 mm', 167, 120);
    drawSubscript(155, 180, 'x', '2');
    text('(0):                 mm', 167, 180);
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
    let newData = eq(1200);
    if (JSON.stringify(newData) !== JSON.stringify(curData)) {
        plot.reset();
        curData = newData;
        plot.addNewDataSource(1, curData.r, 'blue', 1, 1);
        plot.addNewDataSource(1, curData.l, 'blue', 1, 2);
    }
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
    mMass = values[0];
    kMass1 = values[1];
    kMass2 = values[2];
    xMass1 = values[3];
    xMass2 = values[4];
}

/*

         SETUP FUNCTIONS

 */

function createInputs() {
    let startX = 55, startY = 105, cury = 0;
    for (let i = 0; i < sliders.length; i++) {
        let s = createInput(values[i].toString(), 'number');
        s.attribute('min', inputAttr[i][0]);
        s.attribute('max', inputAttr[i][1]);
        s.attribute('step', inputAttr[i][2]);
        s.elt.onblur = onTextInput(i, ...inputAttr[i]);
        s.parent('canvas');
        s.position(startX + (i < 3 ? 0 : 130), startY + cury);
        s.style('width', '50px');
        inputs.push(s);
        cury += (i === 2 ? -120 : 60)
    }
}

function createSliders() {
    mSlider = createSlider(10, 100, mMass * 10);
    k1Slider = createSlider(10, 1000, kMass1 * 10);
    k2Slider = createSlider(10, 1000, kMass2 * 10);
    x1Slider = createSlider(-450, 450, xMass1 * 10);
    x2Slider = createSlider(-450, 450, xMass2 * 10);
    sliders = [mSlider, k1Slider, k2Slider, x1Slider, x2Slider];
    let ypos = 130;
    sliders.forEach(function (s, i) {
        let xpos = (i < 3 ? 25 : 155);
        s.position(xpos, ypos);
        s.style('width', '100px');
        s.parent('canvas');
        s.input(onSliderInput(i));
        ypos += (i === 2 ? -120 : 60);
    });
}

function createButtons() {
    playButton = createButton("Play");
    playButton.position(50, 330);
    playButton.mousePressed(onPlay);
    playButton.style('width', '50px');
    playButton.parent('canvas');
    clearButton = createButton('Clear');
    clearButton.position(50, 360);
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

function eq(points) {
    let scale, disp1 = [], s1 = [xMass2], v1 = [0], f1 = [], disp2 = [], s2 = [xMass1],
        v2 = [0],
        f2 = [], dt2 = dt * 2, max = 0;
    for (let i = 0; i < points; i++) {
        f1[i] = (-4 * kMass1 * s1[i] + 2 * kMass2 * s2[i]) / mMass;
        f2[i] = (2 * kMass1 * s1[i] - 4 * kMass2 * s2[i]) / mMass;
        for (let j = 1; j < 4; j++) {
            let k = j - 1, f = (j === 3 ? 1 : 2);
            s1[i + j] = s1[i] + v1[i + k] * dt2 / f;
            s2[i + j] = s2[i] + v2[i + k] * dt2 / f;
            v1[i + j] = v1[i] + f1[i + k] * dt2 / f;
            v2[i + j] = v2[i] + f2[i + k] * dt2 / f;
            f1[i + j] = (-4 * kMass1 * s1[i + j] + 2 * kMass2 * s2[i + j]) / mMass;
            f2[i + j] = (2 * kMass1 * s1[i + j] - 4 * kMass2 * s2[i + j]) / mMass;
        }
        s1[i + 1] = s1[i];
        s2[i + 1] = s2[i];
        v1[i + 1] = v1[i];
        v2[i + 1] = v2[i];
        for (let j = 0; j < 4; j++) {
            let m = (j > 0 && j < 3 ? 2 : 1);
            s1[i + 1] += (m * v1[i + j] * (dt2 / 6));
            s2[i + 1] += (m * v2[i + j] * (dt2 / 6));
            v1[i + 1] += (m * f1[i + j] * (dt2 / 6));
            v2[i + 1] += (m * f2[i + j] * (dt2 / 6));
        }
        max = (s1[i + 1] > max ? s1[i + 1] : max);
        max = (s2[i + 1] > max ? s2[i + 1] : max);
    }
    scale = 50 / max;
    for (let i = 0; i < points; i++) {
        disp1.push(scale * s1[i]);
        disp2.push(scale * s2[i]);
    }
    return {
        r: disp1,
        l: disp2,
    };
}

