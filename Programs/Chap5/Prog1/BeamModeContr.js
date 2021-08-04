let mSlider, kLSlider, kRSlider, kTSlider, tpSlider, mTSlider, sliders = [];
let mMass = 1, kSpringL = 10, kSpringR = 10, kSpringT = 10, tPos = 0.8, topMass = 0.5,
    values = [mMass, kSpringL, kSpringR, topMass, kSpringT, tPos], factors = [10, 10, 10, 10, 10, 100];
let inputs = [],
    inputAttr = [[0.2, 2, 0.1], [1, 20, 0.1], [1, 20, 0.1], [0.01, 1, 0.1], [0.5, 40, 0.1], [0, 1, 0.01]];
let t = 0, dt = 1 / 40;


function setup() {
    frameRate(30);
    createCanvas(1000, 440).parent('canvas');
    createSliders();
    createInputs();
}

function draw() {
    background(255);
    updateSliders();
    let modes = findModes();
    let m1 = getYValues(modes.w[0], modes.m[0]);
    let m1x = lerp(280, 470, tPos);
    let sl = 18;
    drawSpring(280, 100 + m1[0], sl, 95 - m1[0], 9);
    drawSpring(470, 100 + m1[1], sl, 95 - m1[1], 9);
    drawSpring(m1x, 53 + m1[2], 10, 44 + lerp(m1[0], m1[1], tPos) - m1[2], 9);

    let m2 = getYValues(modes.w[1], modes.m[1]);
    let m2x = lerp(538, 728, tPos);
    drawSpring(538, 100 + m2[0], sl, 95 - m2[0], 9);
    drawSpring(728, 100 + m2[1], sl, 95 - m2[1], 9);
    drawSpring(m2x, 53 + m2[2], 10, 44 + lerp(m2[0], m2[1], tPos) - m2[2], 9);

    let m3 = getYValues(modes.w[2], modes.m[2]);
    let m3x = lerp(795, 985, tPos);
    drawSpring(795, 100 + m3[0], sl, 95 - m3[0], 9);
    drawSpring(985, 100 + m3[1], sl, 95 - m3[1], 9);
    drawSpring(m3x, 53 + m3[2], 10, 44 + lerp(m3[0], m3[1], tPos) - m3[2], 9);


    push();
    stroke('cadetblue');
    fill('cadetblue');
    strokeWeight(4);
    line(280, 100 + m1[0], 470, 100 + m1[1]);
    rect(m1x - 8, 41 + m1[2], 16, 10);

    line(538, 100 + m2[0], 728, 100 + m2[1]);
    rect(m2x - 8, 41 + m2[2], 16, 10);

    line(795, 100 + m3[0], 985, 100 + m3[1]);
    rect(m3x - 8, 41 + m3[2], 16, 10);

    noStroke();
    fill('gold');
    rect(270, 195, 210, 20);
    rect(528, 195, 210, 20);
    rect(785, 195, 210, 20);
    pop();

    text(`                     First Mode\n      Natural frequency ${(modes.w[0] / TWO_PI).toPrecision(4)} Hz\nMode shape ${(modes.m[0])[0].toPrecision(4)} : ${(modes.m[0])[1].toPrecision(4)} : ${(modes.m[0])[2].toPrecision(4)}`, 280, 240);
    text(`                      Second Mode\n         Natural frequency ${(modes.w[1] / TWO_PI).toPrecision(4)} Hz\nMode shape ${(modes.m[1])[0].toPrecision(4)} : ${(modes.m[1])[1].toPrecision(4)} : ${(modes.m[1])[2].toPrecision(4)}`, 528, 240);
    text(`                     Third Mode\n      Natural frequency ${(modes.w[2] / TWO_PI).toPrecision(4)} Hz\nMode shape ${(modes.m[2])[0].toPrecision(4)} : ${(modes.m[2])[1].toPrecision(4)} : ${(modes.m[2])[2].toPrecision(4)}`, 810, 240);
    t += dt;
}

/*

        EVENT HANDLERS

 */

function updateSliders() {
    push();
    drawSubscript(34, 50, 'm', '1');
    text(':                 kg', 51, 50);
    drawSubscript(38, 110, 'k', '1');
    text(':                 N/m', 51, 110);
    drawSubscript(38, 170, 'k', '2');
    text(':                 N/m', 51, 170);
    drawSubscript(168, 50, "m", '3');
    text(':                 kg', 181, 50);
    drawSubscript(168, 110, "k", '3');
    text(':                 N/m', 181, 110);
    text('Dpos:', 154, 170);
    pop();
}

function onSliderInput(index) {
    return function () {
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
        values[index] = Number(this.value);
        sliders[index].value(this.value * factors[index]);
        updateValues();
    }
}

function updateValues() {
    mMass = values[0];
    kSpringL = values[1];
    kSpringR = values[2];
    topMass = values[3];
    kSpringT = values[4];
    tPos = values[5];
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
    mSlider = createSlider(2, 20, mMass * 10);
    kLSlider = createSlider(10, 200, kSpringL * 10);
    kRSlider = createSlider(10, 200, kSpringR * 10);
    kTSlider = createSlider(5, 400, kSpringT * 10);
    tpSlider = createSlider(0, 100, tPos * 100);
    mTSlider = createSlider(1, 10, topMass * 10);
    sliders = [mSlider, kLSlider, kRSlider, mTSlider, kTSlider, tpSlider];
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

function findModes() {
    let m1 = Matrix.create([
        [mMass, 0, 0],
        [0, mMass / 12, 0],
        [0, 0, topMass]]);
    let m2 = Matrix.create([
        [kSpringL + kSpringR + kSpringT, (kSpringL - kSpringR) / 2 - kSpringT * (tPos - 1 / 2), -kSpringT],
        [(kSpringL - kSpringR) / 2 - kSpringT * (tPos - 1 / 2), (kSpringL + kSpringR) / 4 + kSpringT * (tPos - 1 / 2) * (tPos - 1 / 2), kSpringT * (tPos - 1 / 2)],
        [-kSpringT, kSpringT * (tPos - 1 / 2), kSpringT]
    ]);
    let eValues = eigenvalues(m1, m2);
    let w = [], m = [];
    for (let i = 0; i < eValues.length; i++) {
        w.push(Math.sqrt(eValues[i]));
        let eVec = eigenvectors(m1, m2, eValues[i]);
        let mode = [eVec[0] + eVec[1] / 2, eVec[0] - eVec[1] / 2, eVec[2]];
        let max = Array.from(mode);
        max = Math.abs(max.sort(function (a, b) {
            return Math.abs(a) - Math.abs(b)
        })[2]);
        m.push(mode.map(x => (i % 2 === 0 ? -1 : 1) * x / max));
    }
    return {
        w: w,
        m: m
    };
}

function getYValues(w, m) {
    m.push(m[0] + (m[1] - m[0]) * tPos);
    return m.map(x => 25 * x * Math.sin(w * t));
}
