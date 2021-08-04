let gold = '#DAA520', cblue = '#5F9EA0', rblue = '#4169E1';
let SDMObjectArray = [], graph, xPos = 1, fPos = 1, iPos = 1, aMat, receptArray = [], xL, xR, fL, fR, addButton,
    removeButton, calcButton, animSlider, t = 0, dt = 1 / 30, curSize = 2, maxSize = 10, vars = ['m', 'k', 'c'];
let inputs = [], inputBounds = [massInputBounds, springInputBounds, damperInputBounds],
    inputAttr = [[0.01, 0.01, 10], [0.1, 1, 100], [0.005, 0, 1]]; //m,k,c

function setup() {
    createCanvas(1200, 800).parent('canvas');
    frameRate(30);


    SDMObjectArray.push(new SDMObject(1, 0, 0, false, true));
    SDMObjectArray.push(new SDMObject());
    SDMObjectArray.push(new SDMObject());


    createInputs();
    createGraph();
    createXPosButtons();
    createFPosButtons();
    createAddButton();
    createRemoveButton();
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
    sanityCheck();

    clickDetection();

    if (receptArray.length !== 0) {
        drawAnim();
        if (focused) t += dt;
    }

    drawFraction(25, 135, 'X', 'F');
    drawFraction(55, 135, 'm', 'N');
    text('Frequency    (rad/s)', 395, 555);

}

/*
*
*
*       CREATE OBJECT FUNCTIONS
*
*
* */

function createGraph() {
    graph = new StaticGraph(70, 170, 750, 350, [0, 3], [-5, 3], 0.5, "log");
    graph.addPointsFunction('', [], eqReturn, 1, cblue);
    graph.addAnalysisLine(rblue, 1, eqReturn, 0);

    animSlider = createSlider(10, 2995, 200);
    animSlider.position(66, 565);
    animSlider.style('width', '755px');
    animSlider.mouseClicked(function () {
        genRMat(animSlider.value() / 1000);
    });
    animSlider.parent('canvas');
}

function createInputs() {
    let startX = 870, startY = 150;
    for (let i = 0; i < 3; i++) {
        let s = createInput(SDMObjectArray[iPos][vars[i]], 'number');
        s.attribute('step', inputAttr[i][0]);
        s.attribute('min', inputAttr[i][1]);
        s.attribute('max', inputAttr[i][2]);
        s.input(inputBounds[i]);
        s.position(startX, startY + i * 35);
        s.style('width', '50px');
        s.parent('canvas');
        inputs.push(s);
    }
    createVisToggle();
    let s = createCheckbox();
    s.position(955, 150);
    s.attribute('disabled', 'disabled');
    s.mouseClicked(function () {
        SDMObjectArray[iPos].abutment = !SDMObjectArray[iPos].abutment;
        inputDisabler();
    });
    s.parent('canvas');
    inputs.push(s);
}

function createVisToggle() {
    let s = createCheckbox();
    s.id('tt');
    let l = createElement('label');
    l.class('switch');
    l.id('swlabel');
    s.parent(l);
    let d = createDiv();
    d.class('container');
    d.position(910, 250);
    l.parent(d);
    d.parent('canvas');
    let ugdiv = document.getElementById('tt');
    let label = document.getElementById('swlabel');
    label.appendChild(ugdiv.childNodes[0]);
    ugdiv.remove();
    label.appendChild(document.createElement('div'));
    label.childNodes[0].checked = true;
    inputs.push(label.childNodes[0]);
}

function createAddButton() {
    addButton = createButton('Add');
    addButton.position(850, 120);
    addButton.mouseClicked(addOnClick);
    addButton.parent('canvas');
}

function addOnClick() {
    if (curSize < maxSize) {
        if (iPos === curSize) inputs[4].checked(false);
        SDMObjectArray[curSize].abutment = false;
        curSize++;
        SDMObjectArray.push(new SDMObject());
        inputDisabler();
    }
}

function createRemoveButton() {
    removeButton = createButton('Remove');
    removeButton.position(900, 120);
    removeButton.mouseClicked(removeOnClick);
    removeButton.parent('canvas');
}

function removeOnClick() {
    if (curSize > 0) {
        if (iPos === curSize) iPos--;
        curSize--;
        SDMObjectArray.pop();
    }
}

function createCalcButton() {
    calcButton = createButton('Calculate');
    calcButton.position(870, 280);
    calcButton.mouseClicked(function () {
        receptArray = genRecepOnce();
        genRMat(animSlider.value() / 1000);
    });
    calcButton.parent('canvas');
}

function createXPosButtons() {
    xL = createButton('');
    xL.position(10, 25);
    xL.size(20);
    xL.html('<i class="al"></i>');
    xL.mouseClicked(function () {
        if (xPos > 0 && !SDMObjectArray[xPos - 1]['abutment']) xPos--;
    });
    xL.parent('canvas');
    xR = createButton('');
    xR.position(40, 25);
    xR.size(20);
    xR.html('<i class="ar"></i>');
    xR.mouseClicked(function () {
        if (xPos < curSize && !SDMObjectArray[xPos + 1]['abutment']) xPos++;
    });
    xR.parent('canvas');
}

function createFPosButtons() {
    fL = createButton('');
    fL.position(10, 95);
    fL.size(20);
    fL.html('<i class="al"></i>');
    fL.mouseClicked(function () {
        if (fPos !== 0 && !SDMObjectArray[fPos - 1]['abutment']) fPos--;
    });
    fL.parent('canvas');
    fR = createButton('');
    fR.position(40, 95);
    fR.size(20);
    fR.html('<i class="ar"></i>');
    fR.mouseClicked(function () {
        if (fPos < curSize && !SDMObjectArray[fPos + 1]['abutment']) fPos++;
    });
    fR.parent('canvas');

}

/*
          Drawing Functions
*/

function updateInputs() {
    let startX = 850, startY = 164, units = ['kg', 'N/m', 'Ns/m'];
    for (let i = 0; i < 3; i++) {
        if (inputs[i].value() !== "") SDMObjectArray[iPos][vars[i]] = inputs[i].value() * 1;
        drawSubscript(startX, startY + i * 35, vars[i], iPos);
        text(`:                 ${units[i]}`, startX + 15, startY + i * 35);
    }
    text('Hysteretic', 850, 265);
    text('Viscous', 955, 265);
    SDMObjectArray[iPos].viscous = inputs[3].checked;
    text('Abutment', 975, 165);
    SDMObjectArray[iPos].abutment = inputs[4].checked();
}

function drawMasss() {
    push();
    for (let i in SDMObjectArray) {
        if (SDMObjectArray[i].abutment) {
            fill(gold);
            stroke(gold);
        } else {
            fill(cblue);
            stroke(cblue);
        }
        rect(70 + i * 100, 50, 25, 40);
    }
    pop();
}


function drawSprings() {
    push();
    translate(90, 60);
    rotate(-PI / 2);
    for (let i = 0; i < curSize; i++) {
        drawSpring(0, i * 100, 13, 80, 9);
    }
    pop();
}

function drawDampers() {
    push();
    noFill();
    for (let i = 0; i < curSize; i++) {
        if (SDMObjectArray[i + 1].viscous) {
            rect(95 + i * 100, 72, 40, 12);
            line(120 + i * 100, 78, 170 + i * 100, 78);
            line(120 + i * 100, 75, 120 + i * 100, 81);
        } else {
            line(95 + i * 100, 78, 129 + i * 100, 78);
            square(129 + i * 100, 72, 12);
            line(129 + i * 100, 72, 141 + i * 100, 84);
            line(129 + i * 100, 84, 141 + i * 100, 72);
            line(141 + i * 100, 78, 170 + i * 100, 78);
        }
    }
    pop();
}


function drawXPos() {
    let startX = 80 + xPos * 100, startY = 50;
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
    let startX = 80 + fPos * 100, startY = 107;
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

function drawAnim() {
    let startX = 60, startY = 615;
    let w = animSlider.value() / 1000;
    graph.drawAnalysisLine(w);
    push();
    fill(rblue);
    text(`${w.toFixed(2)} rad/s`, graph.xZero + (w * graph.xDens) + 5, 510);
    let disp = calcDisp(), scale = 60 / (Math.max(...disp.a) * 2), blue = false;
    fill(gold);
    stroke(gold);
    for (let m = 0; m < disp.a.length; m++) {
        if (isAbutment(m) && blue) {
            fill(gold);
            stroke(gold);
            blue = false;
        } else if (!isAbutment(m) && !blue) {
            fill(cblue);
            stroke(cblue);
            blue = true;
        }
        rect(startX + m * 80 + (scale * disp.a[m] * Math.sin((t * PI) + disp.p[m])), startY, 25, 40);
    }
    pop();
}


/*
        MATH FUNCTIONS
*/

function emptyMatrix(n) {
    let mat = Matrix.create(n, n);
    return Matrix.map(function () {
        return 0;
    }, mat);
}

function receptances(n) {
    let aR = emptyMatrix(curSize + 2), aI = emptyMatrix(curSize + 2), bR = emptyMatrix(curSize + 2),
        bI = emptyMatrix(curSize + 2), cR = emptyMatrix(curSize + 2),
        cI = emptyMatrix(curSize + 2), size = curSize;
    if (!SDMObjectArray[0].abutment) {
        aR.mat[1][1] = -1 / (SDMObjectArray[0].m * sq(n));
    }
    for (let i = 2; i <= size + 1; i++) {
        let o1 = getSMD(i), peq1, peq2;
        bR.mat[i][i] = (o1.abutment ? 0 : -1.0 / (o1.m * sq(n)));
        bI.mat[i][i] = 0;
        bR.mat[i - 1][i] = bR.mat[i][i];
        bI.mat[i - 1][i] = bI.mat[i][i];
        if (o1.viscous) {
            peq1 = (o1.k / (sq(o1.k) + sq(o1.c * n)));
            peq2 = -1 * n * (o1.c / (sq(o1.k) + sq(o1.c * n)));
        } else {
            peq1 = (o1.k / (sq(o1.k) + sq(o1.c)));
            peq2 = -1 * (o1.c / (sq(o1.k) + sq(o1.c * n)));
        }
        bR.mat[i - 1][i - 1] = peq1 + (o1.abutment ? 0 : bR.mat[i][i]);
        bI.mat[i - 1][i - 1] = peq2 + (o1.abutment ? 0 : bI.mat[i][i]);
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
        i: aI.mat,
        s: size
    }
}

function getSMD(n) {
    return SDMObjectArray[n - 1];
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

function eqReturn(x) {
    return pow(10, Math.log10(receptArray[Math.round(x * 200)]) / 2);
}

function genRMat(w) {
    aMat = receptances(w);
}

function calcDisp() {
    let size = aMat.s + 1, amp = [0], phase = [0];
    for (let i = 1; i <= fPos; i++) {
        amp[i - 1] = Math.sqrt(sq(aMat.r[i][fPos + 1]) + sq(aMat.i[i][fPos + 1]));
        phase[i - 1] = Math.atan2(aMat.i[i][fPos + 1], aMat.r[i][fPos + 1]);
    }
    for (let i = fPos + 1; i <= size; i++) {
        amp[i - 1] = Math.sqrt(sq(aMat.r[fPos + 1][i]) + sq(aMat.i[fPos + 1][i]));
        phase[i - 1] = Math.atan2(aMat.i[fPos + 1][i], aMat.r[fPos + 1][i]);
    }
    return {
        a: amp,
        p: phase
    };
}

/*
                Helper Functions
*/

function clickDetection() {
    let startX = 95, startY = 50, w = 100, h = 40;
    let oldIPos = iPos;
    push();
    noFill();
    stroke(rblue);
    strokeWeight(3);
    if (iPos === 0) rect(startX - 26, startY, 26, h);
    else rect(startX + (iPos - 1) * w, startY, w, h);
    if (mouseIsPressed && mouseButton === LEFT && mouseY >= startY && mouseY <= startY + h) {
        if (mouseX >= startX - 25 && mouseX <= startX) iPos = 0;
        else if (mouseX >= startX && mouseX <= startX + w * curSize) iPos = Math.floor((mouseX - startX) / w) + 1;
    }
    pop();
    if (oldIPos !== iPos) inputDisabler();
}

function inputDisabler() {
    for (let i = 0; i < 3; i++) {
        inputs[i].value(SDMObjectArray[iPos][vars[i]]);
        if (iPos === 0) {
            if (i === 0 && !SDMObjectArray[iPos].abutment) inputs[i].removeAttribute('disabled');
            else inputs[i].attribute('disabled', 'disabled');
        } else if (iPos === curSize && SDMObjectArray[iPos].abutment) {
            if (i === 0) inputs[i].removeAttribute('disabled');
            else inputs[i].attribute('disabled', 'disabled');
        } else inputs[i].removeAttribute('disabled')
    }
    if (iPos === 0 || iPos === curSize) {
        inputs[4].removeAttribute('disabled');
    } else inputs[4].attribute('disabled', 'disabled');
    inputs[3].checked = SDMObjectArray[iPos].viscous;
    inputs[3].disabled = SDMObjectArray[iPos].abutment;
    inputs[4].checked(SDMObjectArray[iPos].abutment);
}

function sanityCheck() {
    if (SDMObjectArray[fPos].abutment) fPos = (fPos === 0 ? 1 : curSize - 1);
    if (SDMObjectArray[xPos].abutment) xPos = (xPos === 0 ? 1 : curSize - 1);
}

function massInputBounds() {
    if (this.value() < 0.01 && this.value() !== "") this.value(0.01);
    else if (this.value() > 10) this.value(10);
    else if ((this.value() * 100) % 1 !== 0) this.value((Math.round(this.value() * 100) / 100).toFixed(2));
}

function springInputBounds() {
    if (this.value() < 1 && this.value() !== "") this.value(1);
    else if (this.value() > 100) this.value(100);
    else if ((this.value() * 10) % 1 !== 0) this.value((Math.floor(this.value() * 10) / 10).toFixed(1));
}

function damperInputBounds() {
    if (this.value() < 0 && this.value() !== "") this.value(0);
    else if (this.value() > 1) this.value(1);
    else if ((this.value() * 1000) % 1 !== 0) this.value((Math.floor(this.value() * 1000) / 1000).toFixed(3));
}


function SDMObject(m = 1, k = 1, c = 1 / 200, vis = true, abut = false) {
    if (typeof m === 'number') this.m = m;
    else throw TypeError('SDMObject Constructor: mass must be number');
    if (typeof k === 'number') this.k = k;
    else throw TypeError('SDMObject Constructor: k must be number');
    if (typeof c === 'number') this.c = c;
    else throw TypeError('SDMObject Constructor: c must be number');
    if (typeof vis === 'boolean') this.viscous = vis;
    else throw TypeError('SDMObject Constructor: mass must be number');
    if (typeof abut === 'boolean') this.abutment = abut;
    else throw TypeError('SDMObject Constructor: mass must be number');
}

function isAbutment(n) {
    if (SDMObjectArray.length - 1 < n) return false;
    return SDMObjectArray[n].abutment;
}
