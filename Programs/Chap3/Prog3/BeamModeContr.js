let mSlider, k1Slider, k2Slider, s1Slider, s2Slider, sliders = [];
let mMass = 2, kMass1 = 20, kMass2 = 20, sMass1 = 40, sMass2 = 0, values = [mMass, kMass1, kMass2, sMass1, sMass2],
    factors = [10, 10, 10, 1, 1];
let inputs = [], inputAttr = [[0.1, 10, 0.1], [10, 100, 0.1], [10, 100, 0.1], [-45, 45, 1], [-45, 45, 1]];
let t = 0, dt = 1 / 60;


function setup() {
    createCanvas(1000, 440).parent('canvas');
    createSliders();
    createInputs();
}

function draw() {
    background(255);
    updateSliders();
    let eq = eq33();
    push();
    let sl = 18;
    drawSpring(280, 100 + (eq.l1 + eq.l2), sl, 95 - (eq.l1 + eq.l2), 9);
    drawSpring(470, 100 + (eq.r1 + eq.r2), sl, 95 - (eq.r1 + eq.r2), 9);
    drawSpring(565, 100 + eq.l1, sl, 95 - eq.l1, 9);
    drawSpring(755, 100 + eq.r1, sl, 95 - eq.r1, 9);
    drawSpring(795, 100 + eq.l2, sl, 95 - eq.l2, 9);
    drawSpring(985, 100 + eq.r2, sl, 95 - eq.r2, 9);
    stroke('darkseagreen');
    strokeWeight(4);
    line(280, 100 + (eq.l1 + eq.l2), 470, 100 + (eq.r1 + eq.r2));
    line(565, 100 + eq.l1, 755, 100 + eq.r1);
    line(795, 100 + eq.l2, 985, 100 + eq.r2);
    noStroke();
    fill('gold');
    rect(270, 195, 210, 20);
    rect(555, 195, 210, 20);
    rect(785, 195, 210, 20);
    pop();
    text(`Resultant motion`, 330, 240);
    text(`              First Mode\nNatural frequency ${(eq.w1 / TWO_PI).toPrecision(4)} Hz\nMode shape ${eq.m1.toPrecision(3)}`, 585, 240);
    text(`            Second Mode\nNatural frequency ${(eq.w2 / TWO_PI).toPrecision(4)} Hz\nMode shape ${eq.m2.toPrecision(3)}`, 825, 240);
    t += dt;
}

/*

        EVENT HANDLERS

 */

function updateSliders() {
    push();
    drawSubscript(35, 50, "m", '1');
    text(':                 kg', 51, 50);
    drawSubscript(38, 110, 'k', '1');
    text(':                 N/m', 51, 110);
    drawSubscript(38, 170, 'k', '2');
    text(':                 N/m', 51, 170);
    drawSubscript(155, 50, "x", '1');
    text('(0):                 mm', 167, 50);
    drawSubscript(155, 110, 'x', '2');
    text('(0):                 mm', 167, 110);
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
    sMass1 = values[3];
    sMass2 = values[4];
}

/*

         SETUP FUNCTIONS

 */

function createInputs() {
    let startX = 55, startY = 35, cury = 0;
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
    k1Slider = createSlider(100, 1000, kMass1 * 10);
    k2Slider = createSlider(100, 1000, kMass2 * 10);
    s1Slider = createSlider(-45, 45, sMass1);
    s2Slider = createSlider(-45, 45, sMass2);
    sliders = [mSlider, k1Slider, k2Slider, s1Slider, s2Slider];
    let ypos = 60;
    sliders.forEach(function (s, i) {
        let xpos = (i < 3 ? 25 : 155);
        s.position(xpos, ypos);
        s.style('width', '100px');
        s.parent('canvas');
        s.input(onSliderInput(i));
        ypos += (i === 2 ? -120 : 60);
    });
}

function eq33() {
    let int = Math.sqrt(4 * sq(kMass2 + kMass1) - 12 * kMass1 * kMass2);
    let w1 = Math.sqrt((2 * (kMass1 + kMass2) - int) / mMass);
    let w2 = Math.sqrt((2 * (kMass1 + kMass2) + int) / mMass);
    let mode1 = 2 * kMass2 / (4 * kMass1 - mMass * sq(w1));
    let mode2 = 2 * kMass2 / (4 * kMass1 - mMass * sq(w2));
    let rAmp1 = (sMass1 - mode2 * sMass2) / (mode1 - mode2);
    let rAmp2 = (mode1 * sMass2 - sMass1) / (mode1 - mode2);
    let lAmp1 = mode1 * rAmp1;
    let lAmp2 = mode2 * rAmp2;
    return {
        l1: lAmp1 * Math.cos(w1 * t),
        r1: rAmp1 * Math.cos(w1 * t),
        l2: lAmp2 * Math.cos(w2 * t),
        r2: rAmp2 * Math.cos(w2 * t),
        w1: w1,
        w2: w2,
        m1: mode1,
        m2: mode2
    }
}


