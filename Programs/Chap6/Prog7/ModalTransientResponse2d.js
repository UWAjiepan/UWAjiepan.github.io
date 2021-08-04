let gold = '#DAA520', blue = '#5F9EA0', orange = '#FFA500';
let graph1, graph2, graph3, graph4, graphs = [];
let mMass1 = 1, mMass2 = 1, kMass1 = 10, kMass2 = 10, cMass1 = 0.4, cMass2 = 0.08, xMass1 = 1, xMass2 = 0, vMass1 = 10,
    vMass2 = 0;
let values = [mMass1, kMass1, cMass1, xMass1, vMass1, mMass2, kMass2, cMass2, xMass2, vMass2],
    factors = [10, 10, 100, 10, 1, 10, 10, 100, 10, 1];
let inputs = [],
    inputAttr = [[0.1, 10, 0.1], [0.1, 40, 0.1], [0.01, 5, 0.01], [-5, 5, 0.1], [-20, 20, 1], [0.1, 10, 0.1], [0.1, 40, 0.1], [0.01, 5, 0.01], [-5, 5, 0.1], [-20, 20, 1]];
let mSlider1, mSlider2, kSlider1, kSlider2, cSlider1, cSlider2, xSlider1, xSlider2, vSlider1, vSlider2, sliders = [];
let matrixMath, gs1 = [], gs2 = [];

function setup() {
    createCanvas(900, 900).parent('canvas');
    frameRate(24);
    createSliders();
    createInputs();
    updateValues();
    createGraphs();
}

function draw() {
    background(255);
    updateSliders();
    drawLegend();
    drawTAxis();
    drawGraphs();
    drawDiagram();
}

function updateSliders() {
    push();
    drawSubscript(20, 50, "m", '1');
    text(':              kg', 35, 50);
    drawSubscript(23, 110, 'k', '1');
    text(':              N/m', 35, 110);
    drawSubscript(23, 170, 'c', '1');
    text(':              Ns/m', 35, 170);
    drawSubscript(10, 230, 'x', '1');
    text('(0):              mm', 21, 230);
    drawSubscript(10, 290, 'v', '1');
    text('(0):              mm/s', 21, 290);
    drawSubscript(145, 50, "m", '2');
    text(':              kg', 161, 50);
    drawSubscript(148, 110, 'k', '2');
    text(':              N/m', 161, 110);
    drawSubscript(148, 170, 'c', '2');
    text(':              Ns/m', 161, 170);
    drawSubscript(135, 230, 'x', '2');
    text('(0):              mm', 147, 230);
    drawSubscript(135, 290, 'v', '2');
    text('(0):              mm/s', 147, 290);

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
    xMass1 = values[3];
    vMass1 = values[4];
    mMass2 = values[5];
    kMass2 = values[6];
    cMass2 = values[7];
    xMass2 = values[8];
    vMass2 = values[9];

    updateMatrix();
    response(1500);
    if (graph3 !== undefined) {
        graph3.pointObjects[1].yPoints = modalResponse1().y;
        graph4.pointObjects[1].yPoints = modalResponse2().y;
    }
}

/*

         SETUP FUNCTIONS

 */

function createInputs() {
    let startX = 40, startY = 35, cury = 0;
    for (let i = 0; i < sliders.length; i++) {
        let s = createInput(values[i].toString(), 'number');
        s.attribute('min', inputAttr[i][0]);
        s.attribute('max', inputAttr[i][1]);
        s.attribute('step', inputAttr[i][2]);
        s.elt.onblur = onTextInput(i, ...inputAttr[i]);
        s.parent('canvas');
        s.position(startX + (i < 5 ? 0 : 125), startY + cury);
        s.style('width', '40px');
        inputs.push(s);
        cury += (i === 4 ? -240 : 60)
    }
}

function createGraphs() {
    graph1 = new StaticGraph(260, 45, 450, 100, [0, 50], [-4, 4], 5, 2);
    graph1.noXTicksNos = true;
    graph1.addPointsFunction('mode1', [], calcMode1, 1, '#0000ff');
    graph2 = new StaticGraph(260, 185, 450, 100, [0, 50], [-4, 4], 5, 2);
    graph2.noXTicksNos = true;
    graph2.addPointsFunction('mode2', [], calcMode2, 1, '#00ff00');
    graph3 = new StaticGraph(260, 325, 450, 100, [0, 50], [-4, 4], 5, 2);
    graph3.noXTicksNos = true;
    graph3.addPointsFunction('exactResp', [], getResp1);
    let p = modalResponse1();
    graph3.addPointsArray('modalResp', p.x, p.y, 1, color(255, 0, 0, 180), 3.5);
    graph4 = new StaticGraph(260, 465, 450, 100, [0, 50], [-4, 4], 5, 2);
    graph4.noXTicksNos = true;
    graph4.addPointsFunction('exactResp', [], getResp2);
    p = modalResponse2();
    graph4.addPointsArray('modalResp', p.x, p.y, 1, color(255, 0, 0, 180), 3.5);
}

function createSliders() {
    mSlider1 = createSlider(1, 100, mMass1 * 10);
    mSlider2 = createSlider(1, 100, mMass2 * 10);
    kSlider1 = createSlider(1, 400, kMass1 * 10);
    kSlider2 = createSlider(1, 400, kMass2 * 10);
    cSlider1 = createSlider(1, 500, cMass1 * 100);
    cSlider2 = createSlider(1, 500, cMass2 * 100);
    xSlider1 = createSlider(-50, 50, xMass1 * 10);
    xSlider2 = createSlider(-50, 50, xMass2 * 10);
    vSlider1 = createSlider(-20, 20, vMass1);
    vSlider2 = createSlider(-20, 20, vMass2);
    sliders = [mSlider1, kSlider1, cSlider1, xSlider1, vSlider1, mSlider2, kSlider2, cSlider2, xSlider2, vSlider2];
    let ypos = 60;
    sliders.forEach(function (s, i) {
        let xpos = (i < 5 ? 20 : 145);
        s.position(xpos, ypos);
        s.style('width', '80px');
        s.parent('canvas');
        s.input(onSliderInput(i));
        ypos += (i !== 4 ? 60 : -240);
    });
}

function drawGraphs() {
    graph1.draw();
    graph2.draw();
    graph3.draw();
    graph4.draw();
    drawSubscript(260, 30, 'X', '1');
    drawSubscript(260, 170, 'X', '1');
    drawSubscript(260, 310, 'X', '1');
    drawSubscript(260, 450, 'X', '2');
    text('Mode 1', 275, 30);
    text('Mode 2', 275, 170);
    text('mm', 275, 310);
    text('mm', 275, 450);
}

function drawDiagram() {
    push();
    translate(735, -180);
    drawSubscript(60, 315, 'k', '1', 14);
    drawSubscript(60, 445, 'k', '2', 14);

    drawSubscript(130, 315, 'c', '1', 14);
    drawSubscript(130, 445, 'c', '2', 14);
    push();
    translate(0, 210);
    drawSpring(90, 55, 19, 100, 9);
    drawSpring(90, 185, 19, 100, 9);
    push();
    noFill();
    drawDamperBox(110, 55, 55);
    drawDamper(116, 155, 60);
    drawDamperBox(110, 185, 55);
    drawDamper(116, 285, 60);
    fill(gold);
    stroke(gold);
    rect(75, 25, 60, 30);
    fill(blue);
    stroke(blue);
    rect(80, 155, 50, 30);
    rect(80, 285, 50, 30);
    pop();
    pop();
    push();
    textSize(14);
    text('(t)', 49, 395);
    text('(t)', 49, 525);
    fill(blue);
    stroke(blue);
    triangle(63, 395, 71, 395, 67, 402);
    triangle(63, 525, 71, 525, 67, 532);
    strokeWeight(2);
    line(80, 377, 60, 377);
    line(80, 507, 60, 507);
    strokeWeight(4);
    line(67, 379, 67, 395);
    line(67, 509, 67, 525);
    pop();
    drawSubscript(97, 385, 'm', '1', 14);
    drawSubscript(97, 515, 'm', '2', 14);
    drawSubscript(35, 395, 'x', '1', 14);
    drawSubscript(35, 525, 'x', '2', 14);
    pop();
}

function drawLegend() {
    text(`Exact\n               Response\n\nModal\n               Response\n               Mode 1  X₁\n               Mode 2  X₁`, 120, 350);
    line(125, 359, 165, 359);
    push();
    stroke('#0000ff');
    line(125, 420, 165, 420);
    stroke('#00ff00');
    line(125, 437, 165, 437);
    stroke('#ff0000');
    fill('#ff0000');
    circle(160, 406, 4);
    circle(150, 406, 4);
    circle(140, 406, 4);
    circle(130, 406, 4);

    pop();
}

function drawTAxis() {
    line(256, 615, 714, 615);
    for (let i = 0; i <= 10; i++) {
        line(260 + 45 * i, 612, 260 + 45 * i, 618);
        if (i !== 0 && i !== 10) {
            text(i * 5, 260 + 45 * i - textWidth(i * 5) / 2, 605)
        }
    }
    text(`Time (secs)`, 455, 640);
}

function updateMatrix() {
    let mat1 = Matrix.create([
        [mMass1, 0],
        [0, mMass2]]);
    let mat2 = Matrix.create([
        [kMass1 + kMass2, -kMass2],
        [-kMass2, kMass2]
    ]);
    let mat3 = Matrix.create([
        [cMass1 + cMass2, -cMass2],
        [-cMass2, cMass2]
    ]);
    let mat4 = Matrix.inverse(mat1);
    let mat5 = Matrix.mult(mat4, mat2).mat;
    let mat6 = Matrix.mult(mat4, mat3).mat;
    let mat7 = Matrix.create([
        [0, 0, -1, 0],
        [0, 0, 0, -1],
        [mat5[0][0], mat5[0][1], mat6[0][0], mat6[0][1]],
        [mat5[1][0], mat5[1][1], mat6[1][0], mat6[1][1]]
    ]);


    let es = Matrix.eigenstructure(mat7);
    es.lr = es.lr.sort((a, b) => a - b);
    es.li = es.li.sort((a, b) => Math.abs(a) - Math.abs(b));

    let ev = eigenvalues(mat1, mat2);
    let evec1 = Matrix.eigenstructure(Matrix.sub(mat2, Matrix.scale(mat1, ev[0]))).V.mat;
    evec1 = [evec1[1][0], evec1[1][1]];
    let evec2 = Matrix.eigenstructure(Matrix.sub(mat2, Matrix.scale(mat1, ev[1]))).V.mat;
    evec2 = [evec2[1][0], evec2[1][1]];

    let xi1 = Math.sqrt(1 / (1 + sq(es.li[0] / es.lr[0])));
    let xi2 = Math.sqrt(1 / (1 + sq(es.li[2] / es.lr[2])));

    matrixMath = {
        eVec: [evec1, evec2],
        mode: [mMass1 * sq(evec1[0]) + mMass2 * sq(evec1[1]), mMass1 * sq(evec2[0]) + mMass2 * sq(evec2[1])],
        xi: [xi1, xi2],
        wn: [es.li[0] / Math.sqrt(1 - sq(xi1)), es.li[2] / Math.sqrt(1 - sq(xi2))],
        wd: [es.li[0], es.li[2]],
        xiw: [es.lr[0], es.lr[2]]
    }
}

function calcMode1(x) {
    x *= 2;
    let eq1 = (mMass1 * matrixMath.eVec[0][0] * xMass1 + mMass2 * matrixMath.eVec[0][1] * xMass2) / matrixMath.mode[0];
    let eq2 = (mMass1 * matrixMath.eVec[0][0] * vMass1 + mMass2 * matrixMath.eVec[0][1] * vMass2) / matrixMath.mode[0];
    let eq3 = Math.sqrt(sq(eq1) + sq(eq2 + matrixMath.xiw[0] * eq1) / matrixMath.wd[0] / matrixMath.wd[0]);
    let eq4 = Math.atan2(eq2 + matrixMath.xiw[0] * eq1, matrixMath.wd[0] * eq1);
    return eq3 * Math.cos(matrixMath.wd[0] * x - eq4) * matrixMath.eVec[0][0] * Math.exp(-matrixMath.xiw[0] * x);
}

function calcMode2(x) {
    x *= 2;
    let eq1 = (mMass1 * matrixMath.eVec[1][0] * xMass1 + mMass2 * matrixMath.eVec[1][1] * xMass2) / matrixMath.mode[1];
    let eq2 = (mMass1 * matrixMath.eVec[1][0] * vMass1 + mMass2 * matrixMath.eVec[1][1] * vMass2) / matrixMath.mode[1];
    let eq3 = Math.sqrt(sq(eq1) + sq(eq2 + matrixMath.xiw[1] * eq1) / matrixMath.wd[1] / matrixMath.wd[1]);
    let eq4 = Math.atan2(eq2 + matrixMath.xiw[1] * eq1, matrixMath.wd[1] * eq1);
    return eq3 * Math.cos(matrixMath.wd[1] * x - eq4) * matrixMath.eVec[1][0] * Math.exp(-matrixMath.xiw[1] * x);
}

function modalResponse1() {
    let x = [], y = [];
    for (let i = 0; i < 50; i += 1 / 3) {
        x.push(i);
        y.push(calcMode1(i) + calcMode2(i));
    }
    return {
        x: x, y: y
    }
}

function modalResponse2() {
    let x = [], y = [];
    for (let i = 0; i < 50; i += 1 / 3) {
        x.push(i);
        let eq1 = (mMass1 * matrixMath.eVec[0][0] * xMass1 + mMass2 * matrixMath.eVec[0][1] * xMass2) / matrixMath.mode[0];
        let eq2 = (mMass1 * matrixMath.eVec[0][0] * vMass1 + mMass2 * matrixMath.eVec[0][1] * vMass2) / matrixMath.mode[0];
        let eq3 = Math.sqrt(sq(eq1) + sq(eq2 + matrixMath.xiw[0] * eq1) / matrixMath.wd[0] / matrixMath.wd[0]);
        let eq4 = Math.atan2(eq2 + matrixMath.xiw[0] * eq1, matrixMath.wd[0] * eq1);
        let eq5 = (mMass1 * matrixMath.eVec[1][0] * xMass1 + mMass2 * matrixMath.eVec[1][1] * xMass2) / matrixMath.mode[1];
        let eq6 = (mMass1 * matrixMath.eVec[1][0] * vMass1 + mMass2 * matrixMath.eVec[1][1] * vMass2) / matrixMath.mode[1];
        let eq7 = Math.sqrt(sq(eq5) + sq(eq6 + matrixMath.xiw[1] * eq5) / matrixMath.wd[1] / matrixMath.wd[1]);
        let eq8 = Math.atan2(eq6 + matrixMath.xiw[1] * eq5, matrixMath.wd[1] * eq5);
        y.push((eq3 * Math.cos(matrixMath.wd[0] * i * 2 - eq4) * matrixMath.eVec[0][1] * Math.exp(-matrixMath.xiw[0] * i * 2) + (eq7 * Math.cos(matrixMath.wd[1] * i * 2 - eq8) * matrixMath.eVec[1][1] * Math.exp(-matrixMath.xiw[1] * i * 2))));
    }
    return {
        x: x, y: y
    }
}

function response(points) {
    let s1 = [xMass1], v1 = [vMass1], f1 = [], s2 = [xMass2], v2 = [vMass2],
        f2 = [], dt2 = 1 / 15;
    for (let i = 0; i < points; i++) {
        f1[i] = (-kMass1 * s1[i] - cMass1 * v1[i] + kMass2 * (s2[i] - s1[i]) + cMass2 * (v2[i] - v1[i])) / mMass1;
        f2[i] = (-kMass2 * (s2[i] - s1[i]) - cMass2 * (v2[i] - v1[i])) / mMass2;
        for (let j = 1; j < 4; j++) {
            let k = j - 1, f = (j === 3 ? 1 : 2);
            s1[i + j] = s1[i] + v1[i + k] * dt2 / f;
            s2[i + j] = s2[i] + v2[i + k] * dt2 / f;
            v1[i + j] = v1[i] + f1[i + k] * dt2 / f;
            v2[i + j] = v2[i] + f2[i + k] * dt2 / f;
            f1[i + j] = (-kMass1 * s1[i + j] - cMass1 * v1[i + j] + kMass2 * (s2[i + j] - s1[i + j]) + cMass2 * (v2[i + j] - v1[i + j])) / mMass1;
            f2[i + j] = (-kMass2 * (s2[i + j] - s1[i + j]) - cMass2 * (v2[i + j] - v1[i + j])) / mMass2;
        }
        s1[i + 1] = s1[i];
        s2[i + 1] = s2[i];
        v1[i + 1] = v1[i];
        v2[i + 1] = v2[i];
        for (let j = 0; j < 4; j++) {
            let m = (j > 0 && j < 3 ? 2 : 1);
            s1[i + 1] += (m * v1[i + j] * (dt2 / 6));
            s2[i + 1] += (m * v2[i + j] * (dt2 / 6));
            v1[i + 1] += (m * f1[i + j] * (dt2 / 6));
            v2[i + 1] += (m * f2[i + j] * (dt2 / 6));
        }
    }
    gs1 = s1;
    gs2 = s2;
}

function getResp1(x) {
    return gs1[Math.round(x * 30)];
}

function getResp2(x) {
    return gs2[Math.round(x * 30)];
}