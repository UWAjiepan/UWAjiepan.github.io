let t = 0, dt = 1 / 8;
let ampSlider, fSlider, vSlider, drSlider, sliders = [];
let playButton, clearButton;
let playing;
let aMass = 16, fMass = 0.4, vMass = 0, drMass = 5 / 100, values = [aMass, fMass, vMass, drMass],
    factors = [1, 100, 1, 100];
let inputs = [], inputAttr = [[-16, 16, 0.01], [0.1, 2, 0.01], [-80, 80, 1], [0, 2, 0.001]];

function setup() {
    createCanvas(720, 520).parent('canvas');

    let params = getURLParams();
    if (params.hasOwnProperty('damping')) drMass = params.damping / 100;

    createSliders();
    createInputs();
    createButtons();
    plot = new Plot(160, 190, 450, 180);
    plot.addGrid(35, 0);
    plot.addScrollBar(30, 6, 5);
    plot.addNewDataSource(0, equationFunc);
}

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
    drawDamperBox(680, 3, 167);
    push();
    strokeWeight(4);
    stroke('black');
    line(644, 3, 702, 3);
    pop();
    let y = drawMass(650, 261, 40, 34, equationFunc);
    drawDamper(686, y + 261, 174);
    drawSpring(658, 3, 37, 258 + y, 11);
}

function updateSliders() {
    text('x(0):                 mm', 30, 60);
    drawSubscript(35, 120, 'ω', 'n');
    text(':                 Hz', 50, 120);
    text('v(0):                 mm/s', 30, 180);
    text('ξ:                 ', 40, 240);
}

/*

        EVENT HANDLERS

 */

function onPause() {
    plot.pause();
    playButton.html('Play');
    playButton.mousePressed(onPlay);
    clearButton.removeAttribute('disabled');
    sliders.forEach(unlockSliders);
    inputs.forEach(unlockSliders);
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
    drMass = values[3];
}

/*

         SETUP FUNCTIONS

 */

function createSliders() {
    ampSlider = createSlider(-14, 14, aMass);
    fSlider = createSlider(25, 200, fMass * factors[1]);
    vSlider = createSlider(-65, 65, vMass);
    drSlider = createSlider(0, 200, drMass * factors[3]);
    sliders = [ampSlider, fSlider, vSlider, drSlider];
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
    playButton.position(50, 290);
    playButton.mousePressed(onPlay);
    playButton.style('width', '50px');
    playButton.parent('canvas');
    clearButton = createButton("Clear");
    clearButton.position(50, 320);
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

/*

        MATH FUNCTIONS

 */

function equationFunc() {
    let y;
    if (drMass < 1) {
        let dnf = fMass * sqrt(1 - pow(drMass, 2));
        y = Math.exp(-1 * drMass * fMass * t) * (aMass * cos(dnf * t)
            + ((((vMass / 6) + (drMass * fMass * aMass)) * sin(dnf * t)) / (dnf)));
    } else if (drMass === 1) {
        y = (aMass * Math.exp(-1 * fMass * t))
            + (((vMass / 6) + (fMass * aMass)) * t * Math.exp(-1 * fMass * t));
    } else if (drMass > 1) {
        let dnf = fMass * sqrt(pow(drMass, 2) - 1);
        y = Math.exp(-1 * drMass * fMass * t) * ((aMass * Math.cosh(dnf * t))
            + ((((vMass / 6) + (drMass * fMass * aMass))) * Math.sinh(dnf * t)
                / (dnf)));
    }
    if (vMass < 0 && playing) {
        vMass += (5 / frameRate());
        vSlider.value(vMass);
    }
    if (vMass > 0 && playing) {
        vMass -= (5 / frameRate());
        vSlider.value(vMass);
    }
    return y * 2;
}

