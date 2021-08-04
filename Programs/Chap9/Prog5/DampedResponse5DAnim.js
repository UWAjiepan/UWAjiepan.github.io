let m = [1.9, 1.8, 1.7, 1.6, 1.5], k = [1.2, 1.3, 1.4, 1.5, 1.6], c = [1 / 100, 1 / 100, 1 / 100, 1 / 100, 1 / 100],
    v = [m, k, c], graph, xPos = 0, fPos = 3, xL, xR, fL, fR, aMat, receptArray = [],
    calcButton, animSlider, gold = '#DAA520', cblue = '#5F9EA0', rblue = '#4169E1', t = 0, dt = 1 / 30, iPos = 0;
let inputs = [], inputBounds = [massInputBounds, springInputBounds, damperInputBounds],
    inputAttr = [[0.01, 0.01, 10], [0.1, 1, 100], [0.01, 0, 1]]; //m,k,c

function setup() {
    createCanvas(900, 800).parent('canvas');
    frameRate(30);

    createInputs();
    createGraph();
    createXPosButtons();
    createFPosButtons();
    createCalcButton();
}

function draw() {
    background(255);

    updateInputs();
    drawSprings();
    drawDampers();
    drawMasss();
    graph.draw();
    drawXPos();
    drawFPos();

    clickDetection();

    if (receptArray.length !== 0) {
        drawAnim();
        if (focused) t += dt;
    }

    drawFraction(25, 135, 'X', 'F');
    drawFraction(55, 135, 'm', 'N');
    text('Frequency    (rad/s)', 395, 555);

}

function createGraph() {
    graph = new StaticGraph(70, 170, 750, 350, [0, 3], [-5, 3], 0.5, "log");
    graph.addPointsFunction('', [], eqReturn, 1, cblue);
    graph.addAnalysisLine(rblue, 1, eqReturn, 0);

    animSlider = createSlider(10, 2995, 750);
    animSlider.position(66, 565);
    animSlider.style('width', '755px');
    animSlider.mouseClicked(function () {
        genRMat(animSlider.value() / 1000);
    })
    animSlider.parent('canvas');
}

function createInputs() {
    let startX = 655, startY = 10;
    for (let i = 0; i < 3; i++) {
        let s = createInput(v[i][iPos], 'number');
        s.attribute('step', inputAttr[i][0]);
        s.attribute('min', inputAttr[i][1]);
        s.attribute('max', inputAttr[i][2]);
        s.elt.onblur = inputBounds[i];
        s.position(startX, startY + i * 35);
        s.style('width', '40px');
        s.parent('canvas');
        inputs.push(s);
    }
}

function updateInputs() {
    let startX = 635, startY = 24, vars = ['m', 'k', 'c'], units = ['kg', 'N/m', 'Ns/m'];
    for (let i in inputs) {
        drawSubscript(startX, startY + i * 35, vars[i], iPos + 1);
        text(`:              ${units[i]}`, startX + 15, startY + i * 35);
    }
}

function massInputBounds() {
    if (this.value < 0.01 && this.value !== "") this.value = 0.01;
    else if (this.value > 10) this.value = 10;
    else if (this.value % 0.01 !== 0) this.value = Number((Math.round(this.value * (100)) / (100)).toFixed(2));
    if (Number.isNaN(this.value)) this.value = m[iPos];
    m[iPos] = Number(this.value);
}

function springInputBounds() {
    if (this.value < 1 && this.value !== "") this.value = 1;
    else if (this.value > 100) this.value = 100;
    else if (this.value % 0.1 !== 0) this.value = Number((Math.round(this.value * (10)) / (10)).toFixed(1));
    if (Number.isNaN(this.value)) this.value = k[iPos];
    k[iPos] = Number(this.value);
}

function damperInputBounds() {
    if (this.value < 0 && this.value !== "") this.value = 0;
    else if (this.value > 1) this.value = 1;
    else if (this.value % 0.01 !== 0) this.value = Number((Math.round(this.value * (100)) / (100)).toFixed(2));
    if (Number.isNaN(this.value)) this.value = c[iPos];
    c[iPos] = Number(this.value);
}

function drawMasss() {
    push();
    fill(gold);
    stroke(gold);
    rect(70, 40, 25, 60);
    fill(cblue);
    stroke(cblue);
    for (let i = 0; i < 5; i++) {
        rect(170 + i * 100, 50, 25, 40);
    }
    pop();
}


function drawSprings() {
    push();
    translate(90, 60);
    rotate(-PI / 2);
    for (let i = 0; i < 5; i++) {
        drawSpring(0, i * 100, 13, 80, 9);
    }
    pop();
}

function drawDampers() {
    push();
    noFill();
    for (let i = 0; i < 5; i++) {
        rect(95 + i * 100, 72, 40, 12);
        line(120 + i * 100, 78, 170 + i * 100, 78);
        line(120 + i * 100, 75, 120 + i * 100, 81);
    }
    pop();
}

function createXPosButtons() {
    xL = createButton('');
    xL.position(95, 25);
    xL.size(20);
    xL.html('<i class="al"></i>');
    xL.mouseClicked(function () {
        if (xPos !== 0) xPos--;
    });
    xL.parent('canvas');
    xR = createButton('');
    xR.position(605, 25);
    xR.size(20);
    xR.html('<i class="ar"></i>');
    xR.mouseClicked(function () {
        if (xPos !== 4) xPos++;
    })
    xR.parent('canvas');
}

function createFPosButtons() {
    fL = createButton('');
    fL.position(95, 95);
    fL.size(20);
    fL.html('<i class="al"></i>');
    fL.mouseClicked(function () {
        if (fPos !== 0) fPos--;
    });
    fL.parent('canvas');
    fR = createButton('');
    fR.position(605, 95);
    fR.size(20);
    fR.html('<i class="ar"></i>');
    fR.mouseClicked(function () {
        if (fPos !== 4) fPos++;
    })
    fR.parent('canvas');
}

function drawXPos() {
    let startX = 180 + xPos * 100, startY = 50;
    push();
    translate(startX, startY);
    line(0, -2, 0, -16);
    line(0, -9, 10, -9);
    line(10, -9, 6, -5);
    line(10, -9, 6, -13);
    textSize(16);
    text("X", 13, -4);
    pop();
}

function drawFPos() {
    let startX = 180 + fPos * 100, startY = 107;
    push();
    translate(startX, startY);
    line(0, -2, 0, -16);
    line(0, -9, 10, -9);
    line(10, -9, 6, -5);
    line(10, -9, 6, -13);
    textSize(16);
    text("F", 13, -2);
    pop();
}

function emptyMatrix(n) {
    let mat = Matrix.create(n, n);
    return Matrix.map(function () {
        return 0;
    }, mat);
}

function receptances(n) {
    let aR = emptyMatrix(6), aI = emptyMatrix(6), bR = emptyMatrix(6), bI = emptyMatrix(6), cR = emptyMatrix(6),
        cI = emptyMatrix(6);
    let size = 5;
    for (let i = 1; i < size + 1; i++) {
        let o1 = getSMD(i);
        bR.mat[i][i] = -1.0 / (o1.m * sq(n));
        bI.mat[i][i] = 0;
        bR.mat[i - 1][i] = bR.mat[i][i];
        bI.mat[i - 1][i] = bI.mat[i][i];
        bR.mat[i - 1][i - 1] = (o1.k / (sq(o1.k) + sq(o1.c * n))) + bR.mat[i][i];
        bI.mat[i - 1][i - 1] = -1 * n * (o1.c / (sq(o1.k) + sq(o1.c * n))) + bI.mat[i][i];
        for (let j = 1; j < i; ++j) {
            for (let k = 1; k < j + 1; ++k) {
                cR.mat[k][j] = aR.mat[k][j];
                cI.mat[k][j] = aI.mat[k][j];
            }
        }
        let eq1 = bR.mat[i - 1][i - 1] + cR.mat[i - 1][i - 1];
        let eq2 = bI.mat[i - 1][i - 1] + cI.mat[i - 1][i - 1];
        for (let j = 1; j < i + 1; ++j) {
            for (let k = 1; k < j + 1; ++k) {
                let eq3 = sq(eq1) + sq(eq2);
                if (j < i - 1) {
                    let eq4 = -1 * (cR.mat[j][i - 1] * eq1 + cI.mat[j][i - 1] * eq2) / eq3;
                    let eq5 = -1 * (cI.mat[j][i - 1] * eq1 - cR.mat[j][i - 1] * eq2) / eq3;
                    aR.mat[k][j] = cR.mat[k][i - 1] * eq4 - cI.mat[k][i - 1] * eq5 + cR.mat[k][j];
                    aI.mat[k][j] = cR.mat[k][i - 1] * eq5 + cI.mat[k][i - 1] * eq4 + cI.mat[k][j];
                }
                if (j === i - 1) {
                    let eq4 = 1 - ((cR.mat[i - 1][i - 1] * eq1 + cI.mat[i - 1][i - 1] * eq2) / eq3);
                    let eq5 = -1 * (cI.mat[i - 1][i - 1] * eq1 - cR.mat[i - 1][i - 1] * eq2) / eq3;
                    aR.mat[k][j] = cR.mat[k][i - 1] * eq4 - cI.mat[k][i - 1] * eq5;
                    aI.mat[k][j] = cI.mat[k][i - 1] * eq4 + cR.mat[k][i - 1] * eq5;
                }
                if (j === i) {
                    let eq4 = (-1 * bR.mat[i - 1][j] * eq1 + (-1 * bI.mat[i - 1][j]) * eq2) / eq3;
                    let eq5 = ((-1 * bI.mat[i - 1][j]) * eq1 - (-1 * bR.mat[i - 1][j]) * eq2) / eq3;
                    if (k < i) {
                        aR.mat[k][j] = cR.mat[k][i - 1] * -1 * eq4 - cI.mat[k][i - 1] * -1 * eq5;
                        aI.mat[k][j] = cR.mat[k][i - 1] * -1 * eq5 + cI.mat[k][i - 1] * -1 * eq4;
                    } else {
                        aR.mat[k][j] = bR.mat[i - 1][k] * eq4 - bI.mat[i - 1][k] * eq5 + bR.mat[k][j];
                        aI.mat[k][j] = bR.mat[i - 1][k] * eq5 + bI.mat[i - 1][k] * eq4 + bI.mat[k][j];
                    }
                }
            }
        }
    }
    return {
        r: aR.mat,
        i: aI.mat
    }
}

function getSMD(n) {
    return {
        m: m[n - 1],
        k: k[n - 1],
        c: c[n - 1]
    }
}

function genRecepOnce() {
    let y = [], pos = [xPos + 1, fPos + 1].sort(function (a, b) {
        return b - a;
    });
    for (let i = 0; i < 600; i++) {
        let r = receptances(i / 200);
        r = sq(r.r[pos[1]][pos[0]]) + sq(r.i[pos[1]][pos[0]]);
        if (!Number.isNaN(r)) {
            y.push(r);
        } else y.push(y.length - 1);
    }
    return y;
}

function createCalcButton() {
    calcButton = createButton('Calculate');
    calcButton.position(640, 110);
    calcButton.parent('canvas');
    calcButton.mouseClicked(function () {
        receptArray = genRecepOnce();
        genRMat(animSlider.value() / 1000);
        //calcButton.removeClass("glow");
    });
}

function eqReturn(x) {
    return pow(10, Math.log10(receptArray[Math.round(x * 200)]) / 2);
}

function genRMat(w) {
    aMat = receptances(w);
}

function calcDisp() {
    let size = 5, amp = [], phase = [];
    for (let i = 0; i <= fPos; i++) {
        amp[i] = Math.sqrt(sq(aMat.r[i + 1][fPos + 1]) + sq(aMat.i[i + 1][fPos + 1]));
        phase[i] = Math.atan2(aMat.i[i + 1][fPos + 1], aMat.r[i + 1][fPos + 1]);
    }
    for (let i = fPos + 1; i < size; i++) {
        amp[i] = Math.sqrt(sq(aMat.r[fPos + 1][i + 1]) + sq(aMat.i[fPos + 1][i + 1]));
        phase[i] = Math.atan2(aMat.i[fPos + 1][i + 1], aMat.r[fPos + 1][i + 1]);
    }
    return {
        a: amp,
        p: phase
    };
}

function drawAnim() {
    let startX = 60, startY = 615;
    let w = animSlider.value() / 1000;
    graph.drawAnalysisLine(w);
    push();
    fill(rblue);
    text(`${w.toFixed(2)} rad/s`, graph.xZero + (w * graph.xDens) + 5, 510);
    let disp = calcDisp(), scale = 60 / (Math.max(...disp.a) * 2);
    fill(gold);
    stroke(gold);
    rect(startX, startY, 25, 40);
    fill(cblue);
    stroke(cblue);
    for (let m in disp.a) {
        rect(startX + 100 + m * 80 + (scale * disp.a[m] * Math.sin((t * PI) + disp.p[m])), startY, 25, 40);
    }
    pop();
}

function clickDetection() {
    let startX = 95, startY = 50, w = 100, h = 40, size = 5;
    push();
    noFill();
    stroke(rblue);
    strokeWeight(3);
    rect(startX + iPos * w, startY, w, h);
    if (mouseIsPressed && mouseButton === LEFT) {
        if ((mouseX >= startX && mouseX <= startX + w * size) &&
            (mouseY >= startY && mouseY <= startY + h)) {
            iPos = Math.floor((mouseX - startX) / w);
            for (let i in inputs) {
                inputs[i].value(v[i][iPos]);
            }
        }
    }
    pop();
}