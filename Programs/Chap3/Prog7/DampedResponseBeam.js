let mSlider, k1Slider, k2Slider, c1Slider, c2Slider, blSlider, sliders = [];
let mMass = 1, kMass1 = 20, kMass2 = 10, cMass1 = 0.3, cMass2 = 0.4, blMass = 0.3,
    values = [mMass, kMass1, cMass1, blMass, kMass2, cMass2],
    factors = [10, 10, 100, 100, 10, 100];
let inputs = [],
    inputAttr = [[0.1, 2, 0.1], [0.1, 40, 0.1], [0.01, 1, 0.01], [0.01, 1, 0.01], [0.1, 40, 0.1], [0.01, 1, 0.01]];
let graph;

function setup() {
    createCanvas(920, 440).parent('canvas');
    createSliders();
    createInputs();
    graph = new StaticGraph(330, 50, 550, 350, [0, 8], [-5, 1], 1, 'log');
    graph.addPointsFunction('amp2', [], amp2, 1, 'blue');
    graph.addPointsFunction('amp1', [], amp1, 1, 'red');
}

function draw() {
    background(255);
    updateSliders();
    graph.draw();
    text('Frequency     (Hz)', 570, 430);
    drawSubscript(270, 58, 'X', '1', 12, 'red');
    drawFraction(275, 60, '', 'F', 12, 'red');
    drawSubscript(270, 98, 'X', '2', 12, 'blue');
    drawFraction(275, 100, '', 'F', 12, 'blue');
    drawFraction(300, 60, 'm', 'N');
    drawSubscript(20, 335, 'k', '1');
    drawSubscript(65, 335, 'c', '1');
    drawSubscript(140, 335, 'k', '2');
    drawSubscript(5, 275, "X", "1", 12, 'red');
    drawSubscript(215, 275, "X", '2', 12, 'blue');
    text("L", 110, 262);
    let f = lerp(50, 180, blMass);
    text('F', f + 7, 295);
    push();
    fill('black');
    strokeCap(SQUARE);
    triangle(56, 264, 56, 270, 50, 267);
    triangle(174, 264, 174, 270, 180, 267);
    triangle(21, 275, 29, 275, 25, 270);
    triangle(201, 275, 209, 275, 205, 270);
    line(15, 310, 45, 310);
    line(185, 310, 215, 310);
    line(180, 305, 180, 260);
    line(50, 305, 50, 260);
    line(56, 267, 174, 267);
    fill('orange');
    stroke('orange');
    strokeWeight(3);
    line(f, 310, f, 290);
    triangle(f - 2, 290, f + 2, 290, f, 287);
    strokeWeight(1);
    stroke('black');
    noFill();
    line(35, 319, 65, 319);
    line(160, 319, 190, 319);
    line(50, 311, 50, 319);
    line(180, 310, 180, 319);
    rect(52, 319, 8, 18);
    drawDamper(56, 360, 30);
    rect(175, 319, 8, 18);
    drawDamper(179, 360, 30);
    drawSpring(41, 320, 13, 40, 5);
    drawSpring(165, 320, 13, 40, 5);
    strokeWeight(3);
    line(25, 310, 25, 275);
    line(205, 310, 205, 275);
    stroke('cadetblue');
    strokeWeight(4);
    line(50, 310, 180, 310);
    fill('gold');
    stroke('gold');
    rect(38, 360, 152, 10);
    pop();
}

/*

        EVENT HANDLERS

 */

function updateSliders() {
    push();
    text('m:                 kg', 40, 50);
    drawSubscript(38, 110, 'k', '1');
    text(':                 N/m', 51, 110);
    drawSubscript(38, 170, 'c', '1');
    text(':                 Ns/m', 51, 170);
    text('b/L:                 mm', 162, 50);
    drawSubscript(168, 110, "k", '2');
    text(':                 N/m', 181, 110);
    drawSubscript(168, 170, 'c', '2');
    text(':                 Ns/m', 181, 170);
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
    kMass1 = values[1];
    cMass1 = values[2];
    blMass = values[3];
    kMass2 = values[4];
    cMass2 = values[5];
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
    mSlider = createSlider(1, 20, mMass * 10);
    k1Slider = createSlider(1, 400, kMass1 * 10);
    k2Slider = createSlider(1, 400, kMass2 * 10);
    c1Slider = createSlider(1, 100, cMass1 * 100);
    c2Slider = createSlider(1, 100, cMass2 * 100);
    blSlider = createSlider(1, 100, blMass * 100);
    sliders = [mSlider, k1Slider, c1Slider, blSlider, k2Slider, c2Slider];
    let ypos = 60;
    sliders.forEach(function (s, i) {
        let xpos = (i < 3 ? 25 : 155);
        s.position(xpos, ypos);
        s.style('width', '100px');
        s.parent('canvas');
        s.input(onSliderInput(i));
        ypos += (i !== 2 ? 60 : -120);
    });
}

/*
        MATH FUNCTIONS
*/

function amp1(x) {
    let w = x * TWO_PI;
    let eq1 = 12 * kMass2 * (1 - blMass) - mMass * sq(w) * (4 - 6 * blMass);
    let eq2 = 12 * w * cMass2 * (1 - blMass);
    let eq3 = (4 * kMass1 - mMass * sq(w)) * (4 * kMass2 - mMass * sq(w)) - 4 * kMass2 * kMass1 - 12 * sq(w) * cMass1 * cMass2;
    let eq4 = 4 * w * (cMass1 * (3 * kMass2 - mMass * sq(w)) + cMass2 * (3 * kMass1 - mMass * sq(w)));
    return Math.sqrt((sq(eq1) + sq(eq2)) / (sq(eq3) + sq(eq4)));
}

function amp2(x) {
    let w = x * TWO_PI;
    let eq1 = 12 * kMass1 * blMass + mMass * sq(w) * (2 - 6 * blMass);
    let eq2 = 12 * w * cMass1 * blMass;
    let eq3 = (4 * kMass1 - mMass * sq(w)) * (4 * kMass2 - mMass * sq(w)) - 4 * kMass2 * kMass1 - 12 * sq(w) * cMass1 * cMass2;
    let eq4 = 4 * w * (cMass1 * (3 * kMass2 - mMass * sq(w)) + cMass2 * (3 * kMass1 - mMass * sq(w)));
    return Math.sqrt((sq(eq1) + sq(eq2)) / (sq(eq3) + sq(eq4)));
}

