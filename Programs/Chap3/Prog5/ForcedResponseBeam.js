let mSlider, k1Slider, k2Slider, blSlider, sliders = [];
let mMass = 1, kMass1 = 20, kMass2 = 20, blMass = 0.3, values = [mMass, kMass1, kMass2, blMass],
    factors = [10, 10, 10, 100];
let inputs = [], inputAttr = [[0.1, 2, 0.1], [0.1, 40, 0.1], [0.1, 40, 0.1], [0.01, 1, 0.01]];
let graph;

function setup() {
    createCanvas(920, 440).parent('canvas');
    createSliders();
    createInputs();
    graph = new StaticGraph(180, 50, 550, 350, [0, 8], [-5, 1], 1, 'log');
    graph.addPointsFunction('amp2', [], amp2, 1, 'blue');
    graph.addPointsFunction('amp1', [], amp1, 1, 'red');


}

function draw() {
    background(255);
    updateSliders();
    graph.draw();
    text('Frequency     (Hz)', 400, 430);
    drawSubscript(120, 58, 'X', '1', 12, 'red');
    drawFraction(125, 60, '', 'F', 12, 'red');
    drawSubscript(120, 98, 'X', '2', 12, 'blue');
    drawFraction(125, 100, '', 'F', 12, 'blue');
    drawFraction(150, 60, 'm', 'N');
    drawSubscript(580, 105, 'k', '1');
    drawSubscript(740, 105, 'k', '2');
    drawSubscript(553, 45, "X", "1", 12, 'red');
    drawSubscript(765, 45, "X", '2', 12, 'blue');
    text("L", 660, 32);
    let f = lerp(600, 730, blMass);
    text('F', f + 7, 65);
    push();
    fill('black');
    strokeCap(SQUARE);
    triangle(606, 34, 606, 40, 600, 37);
    triangle(724, 34, 724, 40, 730, 37);
    triangle(571, 45, 579, 45, 575, 40);
    triangle(751, 45, 759, 45, 755, 40);
    line(595, 80, 565, 80);
    line(735, 80, 765, 80);
    line(730, 75, 730, 30);
    line(600, 75, 600, 30);
    line(606, 37, 724, 37);
    fill('orange');
    stroke('orange');
    strokeWeight(3);
    line(f, 80, f, 60);
    triangle(f - 2, 60, f + 2, 60, f, 57);
    strokeWeight(1);
    stroke('black');
    fill('black');
    drawSpring(603, 82, 15, 54, 7);
    drawSpring(727, 82, 15, 54, 7);
    strokeWeight(3);
    line(575, 80, 575, 45);
    line(755, 80, 755, 45);
    stroke('cadetblue');
    strokeWeight(4);
    line(600, 80, 730, 80);
    fill('gold');
    stroke('gold');
    rect(590, 130, 150, 10);
    pop();
}

function updateSliders() {
    push();
    drawSubscript(25, 50, "m", '1');
    text(':              kg', 41, 50);
    drawSubscript(28, 110, 'k', '1');
    text(':              N/m', 41, 110);
    drawSubscript(28, 170, "k", '2');
    text(':              N/m', 41, 170);
    text('b/L:              mm', 25, 230);
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
    kMass2 = values[2];
    blMass = values[3];
}


/*

         SETUP FUNCTIONS

 */

function createInputs() {
    let startX = 45, startY = 35;
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
    mSlider = createSlider(1, 20, mMass * 10);
    k1Slider = createSlider(1, 400, kMass1 * 10);
    k2Slider = createSlider(1, 400, kMass2 * 10);
    blSlider = createSlider(1, 100, blMass * 100);
    sliders = [mSlider, k1Slider, k2Slider, blSlider];
    let ypos = 60;
    sliders.forEach(function (s, i) {
        let xpos = 25;
        s.position(xpos, ypos);
        s.style('width', '80px');
        s.parent('canvas');
        s.input(onSliderInput(i));
        ypos += 60
    });
}


function amp1(x) {
    let w = x * TWO_PI;
    let eq1 = 12 * kMass2 * (1 - blMass) - mMass * sq(w) * (4 - 6 * blMass);
    let eq2 = (4 * kMass1 - mMass * sq(w)) * (4 * kMass2 - mMass * sq(w)) - 4 * kMass2 * kMass1;
    return Math.sqrt(sq(eq1) / sq(eq2));
}

function amp2(x) {
    let w = x * TWO_PI;
    let eq1 = 12 * kMass1 * blMass + mMass * sq(w) * (2 - 6 * blMass);
    let eq2 = (4 * kMass1 - mMass * sq(w)) * (4 * kMass2 - mMass * sq(w)) - 4 * kMass2 * kMass1;
    return Math.sqrt(sq(eq1) / sq(eq2));
}

