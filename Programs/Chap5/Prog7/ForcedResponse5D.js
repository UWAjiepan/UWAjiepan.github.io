let mInputs = [], kInputs = [], graph, xPos = 0, fPos = 0, xL, xR, fL, fR, receptArray = [], calcButton,
    gold = '#DAA520', blue = '#5F9EA0';
let m = [1.9, 1.8, 1.7, 1.6, 1.5], k = [1.2, 1.3, 1.4, 1.5, 1.6];

function setup() {
    createCanvas(900, 800).parent('canvas');
    frameRate(24);

    createMassInputs();
    createSpringInputs();
    createGraph();
    createXPosButtons();
    createFPosButtons();
    createCalcButton();
}

function draw() {
    background(255);

    updateMassInputs();
    updateSpringInputs();

    drawSprings();
    drawMasss();
    graph.draw();
    drawXPos();
    drawFPos();

    drawFraction(25, 135, 'X', 'F');
    drawFraction(55, 135, 'm', 'N');

}

function createGraph() {
    graph = new StaticGraph(70, 170, 750, 350, [0, 3], [-5, 3], 0.5, "log");
    graph.addPointsFunction('', [], eqReturn, 1, blue);
}

function createMassInputs() {
    let startX = 170, startY = 120;
    for (let i = 0; i < 5; i++) {
        let s = createInput(m[i], 'number');
        s.attribute('step', 0.01);
        s.attribute('min', 0.01);
        s.attribute('max', 10);
        s.elt.onblur = massInputBounds(i);
        s.position(startX + i * 100, startY);
        s.style('width', '40px');
        s.parent('canvas');
        mInputs.push(s);
    }
}

function massInputBounds(index) {
    return function () {
        if (this.value < 0.01 && this.value !== "") this.value = 0.01;
        else if (this.value > 10) this.value = 10;
        else if (this.value % 0.01 !== 0) this.value = Number((Math.round(this.value * (100)) / (100)).toFixed(2));
        if (Number.isNaN(this.value)) this.value = m[index];
        m[index] = Number(this.value);
    }
}

function updateMassInputs() {
    let startX = 150, startY = 135;
    for (let i in mInputs) {
        drawSubscript(startX + i * 100, startY, 'm', (i * 1) + 1);
        text(`:              kg`, startX + 16 + i * 100, startY);
    }
}

function drawMasss() {
    push();
    fill(gold);
    stroke(gold);
    rect(70, 40, 20, 60);
    fill(blue);
    stroke(blue);
    for (let i = 0; i < 5; i++) {
        rect(170 + i * 100, 50, 25, 40);
    }
    pop();
}

function createSpringInputs() {
    let startX = 120, startY = 5;
    for (let i = 0; i < 5; i++) {
        let s = createInput(k[i], 'number');
        s.attribute('step', 0.1);
        s.attribute('min', 1);
        s.attribute('max', 100);
        s.elt.onblur = springInputBounds(i);
        s.position(startX + i * 100, startY);
        s.style('width', '40px');
        s.parent('canvas');
        kInputs.push(s);
    }
}

function springInputBounds(index) {
    return function () {
        if (this.value < 1 && this.value !== "") this.value = 1;
        else if (this.value > 100) this.value = 100;
        else if (this.value % 0.1 !== 0) this.value = Number((Math.round(this.value * (10)) / (10)).toFixed(1));
        if (Number.isNaN(this.value)) this.value = k[index];
        k[index] = Number(this.value);
    }
}

function updateSpringInputs() {
    let startX = 100, startY = 20;
    for (let i in kInputs) {
        drawSubscript(startX + i * 100, startY, 'k', (i * 1) + 1);
        text(`:              N/m`, startX + 16 + i * 100, startY);
    }
}

function drawSprings() {
    push();
    translate(90, 70);
    rotate(-PI / 2);
    for (let i = 0; i < 5; i++) {
        drawSpring(0, i * 100, 13, 80, 9);
    }
    pop();
}

function createXPosButtons() {
    xL = createButton("");
    xL.position(95, 30);
    xL.size(20);
    xL.html('<i class="al"></i>');
    xL.mouseClicked(function () {
        if (xPos !== 0) xPos--;
    });
    xL.parent('canvas');
    xR = createButton("");
    xR.position(605, 30);
    xR.size(20);
    xR.html('<i class="ar"></i>');
    xR.mouseClicked(function () {
        if (xPos !== 4) xPos++;
    })
    xR.parent('canvas');
}

function createFPosButtons() {
    fL = createButton("");
    fL.position(95, 95);
    fL.size(20);
    fL.html('<i class="al"></i>');
    fL.mouseClicked(function () {
        if (fPos !== 0) fPos--;
    });
    fL.parent('canvas');
    fR = createButton("");
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
    let aR = emptyMatrix(6), bR = emptyMatrix(6), cR = emptyMatrix(6);
    let size = 5;
    for (let i = 1; i < size + 1; i++) {
        let o1 = getSMD(i);
        bR.mat[i][i] = -1.0 / (o1.m * sq(n));
        bR.mat[i - 1][i] = bR.mat[i][i];
        bR.mat[i - 1][i - 1] = 1 / (o1.k) + bR.mat[i][i];
        for (let j = 1; j < i; ++j) {
            for (let k = 1; k < j + 1; ++k) {
                cR.mat[k][j] = aR.mat[k][j];
            }
        }
        let n6 = bR.mat[i - 1][i - 1] + cR.mat[i - 1][i - 1];
        for (let n8 = 1; n8 < i + 1; ++n8) {
            for (let n9 = 1; n9 < n8 + 1; ++n9) {
                if (n8 < i - 1) {
                    aR.mat[n9][n8] = cR.mat[n9][i - 1] * -1 * (cR.mat[n8][i - 1] / n6) + cR.mat[n9][n8];
                }
                if (n8 === i - 1) {
                    aR.mat[n9][n8] = cR.mat[n9][i - 1] * (1 - (cR.mat[i - 1][i - 1]) / n6);
                }
                if (n8 === i) {
                    if (n9 < i) aR.mat[n9][n8] = cR.mat[n9][i - 1] * (bR.mat[i - 1][n8] / n6);
                    else aR.mat[n9][n8] = (bR.mat[i - 1][n9] * -1 * (bR.mat[i - 1][n8] / n6)) + bR.mat[n9][n8];

                }
            }
        }
    }
    let pos = [xPos + 1, fPos + 1].sort(function (a, b) {
        return b - a;
    });
    return sq(aR.mat[pos[1]][pos[0]]);
}

function getSMD(n) {
    return {
        m: m[n - 1],
        k: k[n - 1]
    }
}

function genRecepOnce() {
    let y = [];
    for (let i = 0; i < 600; i++) {
        let r = receptances(i / 200);
        if (!Number.isNaN(r)) {
            y.push(r);
        } else y.push(y.length - 1);
    }
    return y;
}

function createCalcButton() {
    calcButton = createButton('Calculate');
    calcButton.position(640, 60);
    calcButton.parent('canvas');
    calcButton.mouseClicked(function () {
        receptArray = genRecepOnce();
        //calcButton.removeClass("glow");
    });
}

function eqReturn(x) {
    return pow(10, Math.log10(receptArray[Math.round(x * 200)]) / 2);
}

