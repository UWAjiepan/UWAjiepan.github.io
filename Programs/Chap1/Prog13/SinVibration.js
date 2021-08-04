let t = 0, dt = 1 / 10;
let ampSlider, fSlider, forceSlider, psSlider, sliders = [];
let playButton;
let playing;
let fMass = 0.5, forceM = 85, ampM = 40, psM = -60, values = [ampM, fMass, forceM, psM],
    factors = [10, 100, 10, 1];
let inputs = [], inputAttr = [[20, 100, 0.1], [0.2, 2, 0.01], [20, 100, 0.1], [-180, 180, 1]];


function setup() {
    createCanvas(1080, 1000);
    createSliders();
    createButtons();
    createInputs();
    plot = new Plot(200, 80, 460, 210);
    plot.addNewDataSource(0, forceEq, 'deepskyblue');
    plot.addNewDataSource(0, dispEq, 'darkorange');
}

function draw() {
    background(255);
    playing = plot.playing;
    updateSliders();
    plot.update();
    if (!Number.isNaN(plot.dataSources[0].points[plot.dataSources[0].points.length - 1])) {
        push();
        noFill();
        strokeWeight(2);
        stroke('gray');
        line(200, 80 + (210 / 2), 840, 80 + (210 / 2));
        stroke('black');
        rect(200 - 2, 80 - 2, 460 + 2, 210 + 2);
        pop();
        drawRotation();
    }
    if (playing && focused) t += dt;
}

function drawRotation() {
    push();
    let v0, v1, y0, y1, ox, oy, ang;
    ox = 840;
    oy = 185;
    ang = (fMass * t) % (TWO_PI);
    v0 = p5.Vector.fromAngle(ang, forceM);
    y0 = forceEq();
    v1 = p5.Vector.fromAngle(ang + radians(psM), ampM);
    y1 = dispEq();
    noFill();
    stroke('lime');
    strokeWeight(2);
    if (psM > 0) arc(ox, oy, 25, 25, PI + (ang + radians(psM)) * -1, -ang + PI);
    else arc(ox, oy, 25, 25, -ang + PI, PI + (ang + radians(psM)) * -1);
    strokeWeight(1);
    stroke('deepskyblue');
    line(ox, oy, ox - v0.x, oy + v0.y);
    line(660, oy + y0, ox - v0.x, oy + y0);
    stroke('darkorange');
    line(ox, oy, ox - v1.x, oy + v1.y);
    line(660, oy + y1, ox - v1.x, oy + y1);
    pop();
}


/*

        EVENT HANDLERS

 */

function updateSliders() {
    push();
    text('X:                  mm', 41, 60);
    text('ω:                  Hz', 41, 120);
    text('F:                  N', 41, 180);
    text('φ:                  degrees', 41, 240);
    pop();
}

function onPause() {
    plot.pause();
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
    plot.play();
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
    ampM = values[0];
    fMass = values[1];
    forceM = values[2];
    psM = values[3];
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
    ampSlider = createSlider(200, 1000, ampM * 10);
    fSlider = createSlider(20, 200, fMass * 100);
    forceSlider = createSlider(200, 1000, forceM * 10);
    psSlider = createSlider(-180, 180, psM);
    sliders = [ampSlider, fSlider, forceSlider, psSlider];
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
}

/*

        HELPER FUNCTIONS

 */

function forceEq() {
    return forceM * Math.sin(fMass * t);
}

function dispEq() {
    return ampM * Math.sin(fMass * t + radians(psM));
}


function lockSliders(s) {
    s.attribute('disabled', 'disabled');
}

function unlockSliders(s) {
    s.removeAttribute('disabled');
}
