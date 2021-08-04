let t = 0;
let mSlider, kSliderL, kSliderR, cSliderL, cSliderR, sSliderL, sSliderR;
let sliders = [];
let playButton, clearButton;
let playing;
let mMass = 2, kSpringL = 20, kSpringR = 20, cSpringL = 1, cSpringR = 1, sSpringL = 45, sSpringR = 0,
    values = [mMass, kSpringL, cSpringL, sSpringL, kSpringR, cSpringR, sSpringR],
    factors = [10, 10, 100, 1, 10, 100, 1];
let inputs = [],
    inputAttr = [[1, 10, 0.1], [10, 100, 0.1], [0.01, 1, 0.01], [-45, 45, 1], [10, 100, 0.1], [0.01, 1, 0.01], [-45, 45, 1]];
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
    ;
    dt = 1 / 100;
    createSliders();
    createButtons();
    createInputs();
    plot = new Plot(270, 85, 500, 290);
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
    drawSpring(800, 303 + l, sl, 97 - l, 9);
    drawSpring(980, 303 + r, sl, 97 - r, 9);
    stroke('orange');
    stroke('blue');
    line(795, 303 + l, 772, 303 + l);
    line(985, 303 + r, 1000, 303 + r);
    line(1000, 303 + r, 1000, 158 + r);
    line(772, 158 + r, 1000, 158 + r);
    strokeWeight(4);
    line(800, 303 + l, 980, 303 + r);
    noStroke();
    fill('gold');
    rect(790, 400, 210, 20);
    pop();

    if (playing && focused) t += dt;
}


/*

        EVENT HANDLERS

 */

function updateSliders() {
    push();
    text('m:                 kg', 35, 30);
    drawSubscript(33, 90, 'k', '1');
    text(':                 N/m', 46, 90);
    drawSubscript(33, 150, 'c', '1');
    text(':                 Ns/m', 46, 150);
    drawSubscript(18, 210, 'X', '1');
    text('(0):                 mm', 31, 210);
    drawSubscript(163, 90, 'k', '2');
    text(':                 N/m', 176, 90);
    drawSubscript(163, 150, 'c', '2');
    text(':                 Ns/m', 176, 150);
    drawSubscript(148, 210, 'X', '2');
    text('(0):                 mm', 161, 210);
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
    blMass = values[3];
    fMass = values[4];
}

/*

         SETUP FUNCTIONS

 */

function createInputs() {
    let startX = 50, startY = 15, curY = 0;
    for (let i = 0; i < sliders.length; i++) {
        let s = createInput(values[i].toString(), 'number');
        s.attribute('min', inputAttr[i][0]);
        s.attribute('max', inputAttr[i][1]);
        s.attribute('step', inputAttr[i][2]);
        s.elt.onblur = onTextInput(i, ...inputAttr[i]);
        s.parent('canvas');
        s.position(startX + (i < 4 ? 0 : 130), startY + curY);
        s.style('width', '50px');
        inputs.push(s);
        curY += (i !== 3 ? 60 : -120);
    }
}

function createSliders() {
    mSlider = createSlider(10, 100, mMass * 10);
    kSliderL = createSlider(100, 1000, kSpringL * 10);
    kSliderR = createSlider(100, 1000, kSpringR * 10);
    cSliderL = createSlider(1, 100, cSpringL * 100);
    cSliderR = createSlider(1, 100, cSpringR * 100);
    sSliderL = createSlider(-45, 45, sSpringL);
    sSliderR = createSlider(-45, 45, sSpringR);
    sliders = [mSlider, kSliderL, cSliderL, sSliderL, kSliderR, cSliderR, sSliderR];
    let ypos = 40;
    sliders.forEach(function (s, i) {
        let xpos = (i < 4 ? 25 : 155);
        s.position(xpos, ypos);
        s.style('width', '100px');
        s.parent('canvas');
        s.input(onSliderInput(i));
        ypos += (i !== 3 ? 60 : -120);
    });
}

function createButtons() {
    playButton = createButton("Play");
    playButton.position(50, 350);
    playButton.mousePressed(onPlay);
    playButton.style('width', '50px');
    playButton.parent('canvas');
    clearButton = createButton('Clear');
    clearButton.position(50, 380);
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
    let scale, dispR = [], s1 = [sSpringR], v1 = [0], f1 = [], dispL = [], s2 = [sSpringL],
        v2 = [0], f2 = [], dt2 = dt * 2, max = 0;
    for (let i = 0; i < points; i++) {
        if (i * dt2 < 2) {
            s1[i + 1] = sSpringR;
            v1[i + 1] = 0;
            s2[i + 1] = sSpringL;
            v2[i + 1] = 0;
            continue;
        }
        f1[i] = (-4 * kSpringL * s1[i] - 4 * cSpringL * v1[i] + 2 * kSpringR * s2[i] + 2 * cSpringR * v2[i]) / mMass;
        f2[i] = (2 * kSpringL * s1[i] + 2 * cSpringL * v1[i] - 4 * kSpringR * s2[i] - 4 * cSpringR * v2[i]) / mMass;
        for (let j = 1; j < 4; j++) {
            let k = j - 1, f = (j === 3 ? 1 : 2);
            s1[i + j] = s1[i] + v1[i + k] * dt2 / f;
            s2[i + j] = s2[i] + v2[i + k] * dt2 / f;
            v1[i + j] = v1[i] + f1[i + k] * dt2 / f;
            v2[i + j] = v2[i] + f2[i + k] * dt2 / f;
            f1[i + j] = (-4 * kSpringL * s1[i + j] - 4 * cSpringL * v1[i + j] + 2 * kSpringR * s2[i + j] + 2 * cSpringR * v2[i + j]) / mMass;
            f2[i + j] = (2 * kSpringL * s1[i + j] + 2 * cSpringL * v1[i + j] - 4 * kSpringR * s2[i + j] - 4 * cSpringR * v2[i + j]) / mMass;
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
        dispR.push(scale * s1[i]);
        dispL.push(scale * s2[i]);
    }
    return {
        r: dispR,
        l: dispL,
    };
}

