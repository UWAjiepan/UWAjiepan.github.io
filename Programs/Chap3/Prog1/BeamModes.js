let mSlider, k1Slider, k2Slider, sliders = [];
let mMass = 2, kMass1 = 15, kMass2 = 30, values = [mMass, kMass1, kMass2],
    factors = [10, 10, 10];
let inputs = [], inputAttr = [[1, 10, 0.1], [10, 100, 0.1], [10, 100, 0.1]];
let t = 0, dt = 1 / 60;


function setup() {
    createCanvas(920, 440).parent('canvas');
    createSliders();
    createInputs();
}

function draw() {
    background(255);
    updateSliders();
    push();
    let m1 = mode1(), m2 = mode2(), sl = 18;
    drawSpring(180, 100 + m1.l, sl, 95 - m1.l, 9);
    drawSpring(370, 100 + m1.r, sl, 95 - m1.r, 9);
    drawSpring(465, 100 + m2.l, sl, 95 - m2.l, 9);
    drawSpring(655, 100 + m2.r, sl, 95 - m2.r, 9);
    stroke('darkseagreen');
    strokeWeight(4);
    line(180, 100 + m1.l, 370, 100 + m1.r);
    line(465, 100 + m2.l, 655, 100 + m2.r);
    noStroke();
    fill('gold');
    rect(170, 195, 210, 20);
    rect(455, 195, 210, 20);
    pop();
    text(`              First Mode\nNatural frequency ${(m1.w / TWO_PI).toPrecision(3)} Hz\nMode shape ${m1.m.toPrecision(3)}`, 210, 240);
    text(`            Second Mode\nNatural frequency ${(m2.w / TWO_PI).toPrecision(3)} Hz\nMode shape ${m2.m.toPrecision(3)}`, 495, 240);
    t += dt;
}


function updateSliders() {
    push();
    drawSubscript(34, 50, "m", '1');
    text(':              kg', 51, 50);
    drawSubscript(37, 110, 'k', '1');
    text(':              N/m', 51, 110);
    drawSubscript(37, 170, "k", '2');
    text(':              N/m', 51, 170);
    pop();
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
    mMass = values[0];
    kMass1 = values[1];
    kMass2 = values[2];
}


/*

         SETUP FUNCTIONS

 */

function createInputs() {
    let startX = 55, startY = 35;
    for (let i = 0; i < sliders.length; i++) {
        let s = createInput(values[i].toString(), 'number');
        s.attribute('min', inputAttr[i][0]);
        s.attribute('max', inputAttr[i][1]);
        s.attribute('step', inputAttr[i][2]);
        s.elt.onblur = onTextInput(i, ...inputAttr[i]);
        s.parent('canvas');
        s.position(startX, startY + i * 60);
        s.style('width', '40px');
        inputs.push(s);
    }
}


function createSliders() {
    mSlider = createSlider(10, 100, mMass * 10);
    k1Slider = createSlider(100, 1000, kMass1 * 10);
    k2Slider = createSlider(100, 1000, kMass2 * 10);
    sliders = [mSlider, k1Slider, k2Slider];
    let ypos = 60;
    sliders.forEach(function (s, i) {
        let xpos = 30;
        s.position(xpos, ypos);
        s.style('width', '80px');
        s.parent('canvas');
        s.input(onSliderInput(i));
        ypos += 60;
    });
}

function mode1() {
    let int = Math.sqrt(4 * sq(kMass2 + kMass1) - 12 * kMass1 * kMass2);
    let w = Math.sqrt((2 * (kMass1 + kMass2) - int) / mMass);
    let mode = 2 * kMass2 / (4 * kMass1 - mMass * sq(w));
    return {
        l: (Math.abs(mode) > 1 ? 30 : 30 * mode) * Math.sin(w * t),
        r: (Math.abs(mode) > 1 ? 30 / mode : 30) * Math.sin(w * t),
        w: w,
        m: mode
    }
}

function mode2() {
    let int = Math.sqrt(4 * sq(kMass2 + kMass1) - 12 * kMass1 * kMass2);
    let w = Math.sqrt((2 * (kMass1 + kMass2) + int) / mMass);
    let mode = 2 * kMass2 / (4 * kMass1 - mMass * sq(w));
    return {
        l: (Math.abs(mode) > 1 ? 30 : 30 * mode) * Math.sin(w * t),
        r: (Math.abs(mode) > 1 ? 30 / mode : 30) * Math.sin(w * t),
        w: w,
        m: mode
    }
}

