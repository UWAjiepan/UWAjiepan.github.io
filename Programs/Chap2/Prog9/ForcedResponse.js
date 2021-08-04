let m1Slider, k1Slider, c1Slider, m2Slider, k2Slider, c2Slider, sliders = [];
let mMass1 = 0.1, kMass1 = 20, cMass1 = 0.05, mMass2 = 0.1, kMass2 = 20, cMass2 = 0.05,
    values = [mMass1, kMass1, cMass1, mMass2, kMass2, cMass2],
    factors = [10, 10, 100, 10, 10, 100];
let inputs = [], inputAttr = [[0.1, 2, 0.1], [1, 40, 0.1], [0, 1, 0.01], [0.1, 2, 0.1], [1, 40, 0.1], [0, 1, 0.01]];
let graph;

function setup() {
    createCanvas(920, 440).parent('canvas');
    createSliders();
    createInputs();
    graph = new StaticGraph(240, 50, 550, 350, [0, 8], [-4, 2], 1, 'log');
    graph.addPointsFunction('amp', [], amp);
    graph.addSecondYAxis([-360, 0], 45);
    graph.changeY2Height(250);
    graph.addPointsFunction('phase', [], phase, 2, '#FFA500');

}

function draw() {
    background(255);
    updateSliders();
    graph.draw();
    text('Frequency     (Hz)', 475, 430);
    drawFraction(225, 17, 'X', 'F');
    drawFraction(255, 17, 'm', 'N');

    push();
    fill('#FFA500');
    text('Phase  (ϕ)', 765, 125);
    pop();
}

function updateSliders() {
    push();
    drawSubscript(13, 50, 'm', '1');
    text(':                 kg', 29, 50);
    drawSubscript(17, 110, 'k', '1');
    text(':                 N/m', 29, 110);
    drawSubscript(17, 170, 'c', '1');
    text(':                 Ns/m', 29, 170);
    drawSubscript(118, 50, 'm', '2');
    text(':                 kg', 134, 50);
    drawSubscript(122, 110, 'k', '2');
    text(':                 N/m', 134, 110);
    drawSubscript(122, 170, 'c', '2');
    text(':                 Ns/m', 134, 170);
    pop();
}

/*
        EVENT HANDLERS
*/

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
    mMass1 = values[0];
    kMass1 = values[1];
    cMass1 = values[2];
    mMass2 = values[3];
    kMass2 = values[4];
    cMass2 = values[5];
}


/*

         SETUP FUNCTIONS

 */

function createInputs() {
    let startX = 33, startY = 35, cury = 0;
    for (let i = 0; i < sliders.length; i++) {
        let s = createInput(values[i].toString(), 'number');
        s.attribute('min', inputAttr[i][0]);
        s.attribute('max', inputAttr[i][1]);
        s.attribute('step', inputAttr[i][2]);
        s.elt.onblur = onTextInput(i, ...inputAttr[i]);
        s.parent('canvas');
        s.position(startX + (i < 3 ? 0 : 105), startY + cury);
        s.style('width', '50px');
        inputs.push(s);
        cury += (i === 2 ? -120 : 60)
    }
}

function createSliders() {
    m1Slider = createSlider(1, 20, mMass1 * 10);
    k1Slider = createSlider(10, 400, kMass1 * 10);
    c1Slider = createSlider(1, 100, cMass1 * 100);
    m2Slider = createSlider(1, 20, mMass2 * 10);
    k2Slider = createSlider(10, 400, kMass2 * 10);
    c2Slider = createSlider(1, 100, cMass2 * 100);
    sliders = [m1Slider, k1Slider, c1Slider, m2Slider, k2Slider, c2Slider];
    let ypos = 60;
    sliders.forEach(function (s, i) {
        let xpos = (i < 3 ? 25 : 125);
        s.position(xpos, ypos);
        s.style('width', '80px');
        s.parent('canvas');
        s.input(onSliderInput(i));
        ypos += (i === 2 ? -120 : 60);
    });
}


function premath(x) {
    let eq1 = TWO_PI * x;
    let eq2 = sq(kMass2) + sq(eq1 * cMass2);
    let eq3 = kMass2 / eq2 - 1 / (mMass2 * sq(eq1));
    let eq4 = -eq1 * cMass2 / eq2;
    let eq5 = kMass1 - mMass1 * sq(eq1) + eq3 / (sq(eq3) + sq(eq4));
    let eq6 = eq1 * cMass1 - eq4 / (sq(eq3) + sq(eq4));
    return {
        r: eq5 / (sq(eq5) + sq(eq6)),
        q: -eq6 / (sq(eq5) + sq(eq6))
    }
}


function amp(x) {
    let pm = premath(x);
    return Math.sqrt(sq(pm.r) + sq(pm.q));
}

function phase(x) {
    let pm = premath(x);
    return degrees(Math.atan2(pm.q, pm.r));
}