let t = 0, dt = 1 / 60;
let m1Slider, k1Slider, m2Slider, k2Slider, sliders = [];
let playButton;
let playing;
let mm1 = 1, km1 = 8, mm2 = 1, km2 = 8, values = [mm1, km1, mm2, km2],
    factors = [10, 10, 10, 10];
let inputs = [], inputAttr = [[1, 10, 0.1], [5, 40, 0.1], [1, 10, 0.1], [5, 40, 0.1]];

/*
    Setup is the first of two required functions.
    Function will be run once on page load.
    createCanvas must be called here as well as any other objects that need to be initialised once.
 */
function setup() {
    createCanvas(720, 480).parent('canvas');
    createSliders();
    createButtons();
    createInputs();
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
    line(200, 40, 250, 40);
    line(450, 40, 500, 40);
    pop();
    push();
    let y11 = equationFunc(1, 1);
    fill('darkturquoise');
    drawSpring(225, 40, 14, 85 + y11, 11);
    circle(225, 135 + y11, 20);
    let y12 = equationFunc(2, 1);
    drawSpring(225, 145 + y11, 14, 85 + y12 - y11, 11);
    circle(225, 230 + y12, 20);

    let y21 = equationFunc(1, 2);
    drawSpring(475, 40, 14, 85 + y21, 11);
    circle(475, 135 + y21, 20);
    let y22 = equationFunc(2, 2);
    drawSpring(475, 145 + y21, 14, 85 + y22 - y21, 11);
    circle(475, 230 + y22, 20);
    pop();

    push();
    text('First Mode', 200, 300);
    text(`Natural frequency ${(getW(1) / TWO_PI).toFixed(4)} Hz`, 160, 320);
    text(`Mode shape ${((km2) / (km1 + km2 - (mm1 * sq(getW(1))))).toFixed(4)}`, 160, 340);
    text('Second Mode', 450, 300);
    text(`Natural frequency ${(getW(2) / TWO_PI).toFixed(4)} Hz`, 410, 320);
    text(`Mode shape ${((km2) / (km1 + km2 - (mm1 * sq(getW(2))))).toFixed(4)}`, 410, 340);


    if (playing && focused) t += dt;
}


/*

        EVENT HANDLERS

 */

function updateSliders() {
    push();
    drawSubscript(34, 60, "m", '1');
    text(':                  kg', 51, 60);
    drawSubscript(40, 120, 'k', '1');
    text(':                  N/m', 51, 120);
    drawSubscript(34, 180, "m", '2');
    text(':                  kg', 51, 180);
    drawSubscript(40, 240, 'k', '2');
    text(':                  N/m', 51, 240);
    pop();
}

function onPause() {
    playing = false;
    playButton.html('Play');
    playButton.mousePressed(onPlay);
    sliders.forEach(unlockSliders);
    inputs.forEach(unlockSliders);
}

function onPlay() {
    playButton.html('Pause');
    playButton.mousePressed(onPause);
    sliders.forEach(lockSliders);
    inputs.forEach(lockSliders);
    playing = true;
}

function onSliderInput(index) {
    return function () {
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
        t = 0;
        values[index] = Number(this.value);
        sliders[index].value(this.value * factors[index]);
        updateValues();
    }
}

function updateValues() {
    mm1 = values[0];
    km1 = values[1];
    mm2 = values[2];
    km2 = values[3];
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
    m1Slider = createSlider(10, 100, 10);
    k1Slider = createSlider(50, 400, 80);
    m2Slider = createSlider(10, 100, 10);
    k2Slider = createSlider(50, 400, 80);
    sliders = [m1Slider, k1Slider, m2Slider, k2Slider];
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
    playButton.position(50, 280);
    playButton.mousePressed(onPlay);
    playButton.style('width', '50px');
    playButton.parent('canvas')
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

function equationFunc(mass, mode) {
    let w;
    if (mode === 1) {
        w = getW(1);
    } else if (mode === 2) {
        w = getW(2);
    }
    let eqmode = (km2) / (km1 + km2 - (mm1 * w * w));
    if (mass === 1) {
        return (Math.abs(eqmode) > 1 ? 30 : 30 * eqmode) * Math.sin(w * t);
    }
    if (mass === 2) {
        return (Math.abs(eqmode) > 1 ? 30 / eqmode : 30) * Math.sin(w * t);
    }
}

function getW(mode) {
    let eq1 = (mm2 * km1) + (km2 * mm2) + (mm1 * km2);
    let eq2 = (mm1 * mm1 * km2 * km2) + (km2 * km2 * mm2 * mm2) + (2 * mm1 * km2 * km2 * mm2) + (2 * km2 * mm2 * mm2 * km1) - (2 * mm1 * km2 * mm2 * km1) + (mm2 * mm2 * km1 * km1);
    let eq3 = 2 * mm1 * mm2;
    if (mode === 1) return sqrt((eq1 - sqrt(eq2)) / eq3);
    else if (mode === 2) return sqrt((eq1 + sqrt(eq2)) / eq3);
}
