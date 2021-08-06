let t = 0, dt = 1 / 8;
let ampSlider, fSlider, vSlider, sliders = [];
let playButton, clearButton;
let playing;
let fMass = 0.4, vMass = 0, aMass = 16, values = [aMass, fMass, vMass], factors = [1, 100, 1];
let inputs = [], inputAttr = [[-16, 16, 0.01], [0.1, 2, 0.01], [-80, 80, 1]];
let plot;

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
    plot = new Plot(160, 110, 450, 200);
    plot.addGrid(35, 0);
    plot.addScrollBar(30, 6, 5);
    plot.addNewDataSource(0, equationFunc);
}

/*
    draw is the second required function.
    This function will run at the start of every frame.
    background() must be called on first line for animating to occur.
    Update and drawing functions are normally called here.
 */
function draw() {
    background(255);
    playing = plot.playing;
    updateSliders();
    if (plot.hasPlayed()) drawDiagram();
    plot.update();
    if (playing && focused) t += dt;
}

/*

        DRAWING FUNCTIONS

*/

function drawDiagram() {
    push();
    strokeWeight(4);
    stroke('black');
    line(658 - 24, 10, 658 + 24, 10);
    strokeWeight(1);
    pop();
    let y = drawMass(640, 192, 36, 36, equationFunc);
    drawSpring(658, 10, 31, 182 + y, 11);
}

function updateSliders() {
    text('x(0):                 mm', 30, 60);
    drawSubscript(35, 120, 'ω', 'n');
    text(':                 Hz', 50, 120);
    text('v(0):                  mm/s', 30, 180);
}

/*

        EVENT HANDLERS

 */


function onPause() {
    playing = 0;
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
    clearButton.attribute('disabled', 'disabled');
    sliders.forEach(lockSliders);
    inputs.forEach(lockSliders);
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
        sliders[index].value(inputs[index].value() * factors[index]);
        updateValues();
    }
}

function updateValues() {
    aMass = values[0];
    fMass = values[1];
    vMass = values[2];
}

/*

         SETUP FUNCTIONS

 */

function createSliders() {
    ampSlider = createSlider(-16, 16, aMass);
    fSlider = createSlider(25, 200, fMass * 100);
    vSlider = createSlider(-80, 80, vMass);
    sliders = [ampSlider, fSlider, vSlider];
    let spos = 70;
    sliders.forEach(function (s, i) {
        s.position(25, spos);
        s.style('width', '100px');
        s.input(onSliderInput(i));
        s.parent('canvas');
        spos += 60;
    });
}

function createButtons() {
    playButton = createButton("Play");
    playButton.position(50, 230);
    playButton.mousePressed(onPlay);
    playButton.style('width', '50px');
    playButton.parent('canvas');
    clearButton = createButton("Clear");
    clearButton.position(50, 260);
    clearButton.mousePressed(function () {
        plot.clear();
        t = 0;
    });
    clearButton.style('width', '50px');
    clearButton.parent('canvas');
}

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

/*

        HELPER FUNCTIONS

 */

function lockSliders(s) {
    s.attribute('disabled', 'disabled');
}

function unlockSliders(s) {
    s.removeAttribute('disabled');
}

function equationFunc() {
    let answer = 1.8 * (aMass * cos(fMass * t) + (((vMass / 6) / fMass) * sin(fMass * t)));
   /* if (vMass < 0 && playing && focused) {
        vMass += (5 / frameRate());
        vSlider.value(vMass);
        inputs[2].value(Math.round(vMass));
    }
    if (vMass > 0 && playing && focused) {
        vMass -= (5 / frameRate());
        vSlider.value(vMass);
        inputs[2].value(Math.round(vMass));
    } */
    return answer;
}
