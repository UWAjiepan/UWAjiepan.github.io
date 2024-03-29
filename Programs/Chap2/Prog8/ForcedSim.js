let t = 0;
let m1Slider, k1Slider, c1Slider, finSlider, m2Slider, k2Slider, c2Slider, fSlider;
let sliders = [];
let playButton, clearButton;
let playing;
let mMass1 = 0.1, mMass2 = 0.1, kMass1 = 20, kMass2 = 20, fin = 0.05, fMass = 1, cMass1 = 0.5, cMass2 = 0.01,
    values = [mMass1, kMass1, cMass1, fin, mMass2, kMass2, cMass2, fMass],
    factors = [10, 10, 100, 1000, 10, 10, 100, 10];
let inputs = [],
    inputAttr = [[0.1, 2, 0.1], [1, 40, 0.1], [0, 1, 0.01], [-0.40, 0.40, 0.001], [0.1, 2, 0.1], [1, 40, 0.1], [0, 1, 0.01], [0, 2, 0.1]];
let plot;
let curData;
let dt;

/*
    Setup is the first of two required functions.
    Function will be run once on page load.
    createCanvas must be called here as well as any other objects that need to be initialised once.
 */
function setup() {
    createCanvas(1000, 720).parent('canvas');
    dt = 1 / 100;
    createSliders();
    createButtons();
    createInputs();
    plot = new Plot(280, 110, 500, 290);
    plot.addSecondYAxis();
    plot.addGrid(35, 0);
    plot.addScrollBar(30, 3, 7);
    curData = eq(1599);
    plot.addNewDataSource(1, curData.fIn, 'gold', 1, 1);
    plot.addNewDataSource(1, curData.s1, 'blue', 1, 1);
    plot.addNewDataSource(1, curData.s2, 'blue', 1, 2);
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
    let fv = plot.getLatestDataValue(0), y1 = plot.getLatestDataValue(1), y2 = plot.getLatestDataValue(2);
    push();
    strokeWeight(4);
    stroke('black');
    line(790, 15, 890, 15);
    pop();
    push();
    noFill();
    drawSpring(820, 15, 25, 152 + y1, 11);
    drawSpring(820, 197 + y1, 22, 116 + y2 - y1, 11);
    drawDamperBox(860, 15, 80);
    drawDamperBox(860, 197 + y1, 60);
    drawDamper(866, 167 + y1, 112);
    drawDamper(866, 313 + y2, 80);
    drawForceVector(895, 182 + y1, fv);
    fill('blue');
    rect(810, 167 + y1, 70, 30);
    rect(810, 313 + y2, 70, 30);
    pop();

    if (playing && focused) t += dt;
}


/*

        EVENT HANDLERS

 */

function updateSliders() {
    push();
    drawSubscript(33, 120, "m", '1');
    text(':                  kg', 51, 120);
    drawSubscript(38, 180, 'k', '1');
    text(':                  N/m', 51, 180);
    drawSubscript(38, 240, 'c', '1');
    text(':                  Ns/m', 51, 240);
    text('F:                  N', 43, 300);
    drawSubscript(158, 120, "m", '2');
    text(':                  kg', 176, 120);
    drawSubscript(163, 180, 'k', '2');
    text(':                  N/m', 176, 180);
    drawSubscript(163, 240, 'c', '2');
    text(':                  Ns/m', 176, 240);
    text('ω:                  Hz', 163, 300);
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
    let newData = eq(1599);
    if (JSON.stringify(newData) !== JSON.stringify(curData)) {
        plot.reset();
        curData = newData;
        plot.addNewDataSource(1, curData.fIn, 'orange', 1, 1);
        plot.addNewDataSource(1, curData.s1, 'blue', 1, 1);
        plot.addNewDataSource(1, curData.s2, 'blue', 1, 2);
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
    mMass1 = values[0];
    kMass1 = values[1];
    cMass1 = values[2];
    fin = values[3];
    mMass2 = values[4];
    kMass2 = values[5];
    cMass2 = values[6];
    fMass = values[7];
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
        s.position(startX + (i < 4 ? 0 : 125), startY + cury);
        s.style('width', '50px');
        inputs.push(s);
        cury += (i === 3 ? -180 : 60)
    }
}

function createSliders() {
    m1Slider = createSlider(1, 20, mMass1 * 10);
    k1Slider = createSlider(10, 400, kMass1 * 10);
    c1Slider = createSlider(0, 100, cMass1 * 100);
    finSlider = createSlider(-400, 400, fin * 1000);
    m2Slider = createSlider(1, 20, mMass2 * 10);
    k2Slider = createSlider(10, 400, kMass2 * 10);
    c2Slider = createSlider(0, 100, cMass2 * 100);
    fSlider = createSlider(1, 200, (fMass / TWO_PI) * 100);
    sliders = [m1Slider, k1Slider, c1Slider, finSlider, m2Slider, k2Slider, c2Slider, fSlider];
    let ypos = 130;
    sliders.forEach(function (s, i) {
        let xpos = (i < 4 ? 25 : 155);
        s.position(xpos, ypos);
        s.style('width', '100px');
        s.parent('canvas');
        s.input(onSliderInput(i));
        ypos += (i === 3 ? -180 : 60);
    });
}

function createButtons() {
    playButton = createButton("Play");
    playButton.position(50, 360);
    playButton.mousePressed(onPlay);
    playButton.style('width', '50px');
    playButton.parent('canvas');
    clearButton = createButton('Clear');
    clearButton.position(50, 390);
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
    let scale = 5500, fIn = [], disp1 = [0], s1 = [0], v1 = [0], f1 = [], disp2 = [0], s2 = [0], v2 = [0],
        f2 = [], dt2 = dt * 2;
    for (let i = 0; i < points; i++) {
        if (i * dt2 < 1) {
            fIn.push(0);
            continue;
        }
        fIn.push(fin * Math.sin(fMass * (i * dt2 - 1)));
    }
    for (let i = 0; i < points; i++) {
        f1[i] = (fIn[i] - kMass1 * s1[i] - cMass1 * v1[i] + kMass2 * (s2[i] - s1[i]) + cMass2 * (v2[i] - v1[i])) / mMass1;
        f2[i] = (-kMass2 * (s2[i] - s1[i]) - cMass2 * (v2[i] - v1[i])) / mMass2;
        for (let j = 1; j < 4; j++) {
            let k = j - 1, f = (j === 3 ? 1 : 2);
            s1[i + j] = s1[i] + v1[i + k] * dt2 / f;
            s2[i + j] = s2[i] + v2[i + k] * dt2 / f;
            v1[i + j] = v1[i] + f1[i + k] * dt2 / f;
            v2[i + j] = v2[i] + f2[i + k] * dt2 / f;
            f1[i + j] = (fIn[i + j] - kMass1 * s1[i + j] - cMass1 * v1[i + j] + kMass2 * (s2[i + j] - s1[i + j]) + cMass2 * (v2[i + j] - v1[i + j])) / mMass1;
            f2[i + j] = (-kMass2 * (s2[i + j] - s1[i + j]) - cMass2 * (v2[i + j] - v1[i + j])) / mMass2;
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
        let lim = 80 / scale;
        let curS = s1[i + 1];
        for (let j = 0; j < 2; j++) {
            if (curS > lim) {
                curS = lim;
                j === 0 ? v1[i + 1] *= -0.7 : v2[i + 1] *= -0.7;
            }
            if (curS < -lim) {
                curS = -lim;
                j === 0 ? v1[i + 1] *= -0.7 : v2[i + 1] *= -0.7;
            }
            j === 0 ? (disp1.push(scale * curS), curS = s2[i + 1]) : disp2.push(scale * curS);
        }
    }
    return {
        s1: disp1,
        s2: disp2,
        fIn: fIn.map(x => x * 200)
    };
}