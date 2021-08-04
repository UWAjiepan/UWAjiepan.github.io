let mInputs = [], kInputs = [], m = [1.9, 1.8, 1.7, 1.6, 1.5], k = [1.2, 1.3, 1.4, 1.5, 1.6];


function setup() {
    createCanvas(800, 800).parent('canvas');
    frameRate(10);
    createMassInputs();
    createSpringInputs();
}

function draw() {
    background(255);

    updateMassInputs();
    updateSpringInputs();
    drawSprings();
    drawMasss();
    try {
        drawMassMatrix();
        drawSpringMatrix();
        drawEigenvalues();
        drawEigenvectors();
    } catch (e) {

    }
}

function createMassInputs() {
    let startX = 170, startY = 100;
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
    let startX = 150, startY = 115;
    for (let i in mInputs) {
        drawSubscript(startX + i * 100, startY, 'm', (i * 1) + 1);
        text(`:              kg`, startX + 16 + i * 100, startY);
    }
}

function drawMasss() {
    push();
    fill('gold');
    stroke('gold');
    rect(70, 40, 20, 60);
    fill('cadetblue');
    stroke('cadetblue');
    for (let i = 0; i < 5; i++) {
        rect(170 + i * 100, 50, 25, 40);
    }
    pop();
}

function createSpringInputs() {
    let startX = 120, startY = 30;
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
    let startX = 100, startY = 45;
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

function drawMassMatrix() {
    let startX = 120, startY = 190;
    push();
    textAlign(CENTER);
    textSize(15);
    let mMat = [
        [m[0], 0, 0, 0, 0],
        [0, m[1], 0, 0, 0],
        [0, 0, m[2], 0, 0],
        [0, 0, 0, m[3], 0],
        [0, 0, 0, 0, m[4]]];
    for (let i in mMat) {
        for (let j in mMat[i]) {
            text(fixfp((mMat[i])[j], 2), startX + j * 45, startY + i * 30);
        }
    }
    stroke('black');
    textSize(18);
    text('M =', startX - 45, startY);
    strokeWeight(3);
    line(startX - 20, 170, startX - 20, 320);
    line(startX + 200, 170, startX + 200, 320);
    pop();
}

function drawSpringMatrix() {
    let startX = 460, startY = 190;
    push();
    textAlign(CENTER);
    textSize(15);
    let kMat = [
        [k[0] + k[1], -k[1], 0, 0, 0],
        [-k[1], k[1] + k[2], -k[2], 0, 0],
        [0, -k[2], k[2] + k[3], -k[3], 0],
        [0, 0, -k[3], k[3] + k[4], -k[4]],
        [0, 0, 0, -k[4], k[4]]];
    for (let i in kMat) {
        for (let j in kMat[i]) {
            text(fixfp((kMat[i])[j], 2), startX + j * 45, startY + i * 30);
        }

    }
    stroke('black');
    textSize(18);
    text('K =', startX - 45, startY);
    strokeWeight(3);
    line(startX - 20, 170, startX - 20, 320);
    line(startX + 200, 170, startX + 200, 320);
    pop();
}

function drawEigenvalues() {
    let startX = 55, startY = 350, spacing = 140;
    let mMat = Matrix.create([
        [m[0], 0, 0, 0, 0],
        [0, m[1], 0, 0, 0],
        [0, 0, m[2], 0, 0],
        [0, 0, 0, m[3], 0],
        [0, 0, 0, 0, m[4]]]);
    let kMat = Matrix.create([
        [k[0] + k[1], -k[1], 0, 0, 0],
        [-k[1], k[1] + k[2], -k[2], 0, 0],
        [0, -k[2], k[2] + k[3], -k[3], 0],
        [0, 0, -k[3], k[3] + k[4], -k[4]],
        [0, 0, 0, -k[4], k[4]]]);
    let ev = eigenvalues(mMat, kMat);
    for (let i in ev) {
        drawSubscript(startX + i * spacing, startY, "λ", (i * 1) + 1);
        text(`= ${((ev[i].toFixed(6) * 1).toPrecision(4))}`, startX + 15 + i * spacing, startY);
        drawSubscript(startX - 8 + i * spacing, startY + 40, "ω", `n${(i * 1) + 1}`);
        text(`= ${(Math.sqrt(ev[i]).toFixed(6) * 1).toPrecision(4)} rad/s`, startX + 15 + i * spacing, startY + 40);

    }
}

function calcEigenvectors() {
    let mMat = Matrix.create([
        [m[0], 0, 0, 0, 0],
        [0, m[1], 0, 0, 0],
        [0, 0, m[2], 0, 0],
        [0, 0, 0, m[3], 0],
        [0, 0, 0, 0, m[4]]]);
    let kMat = Matrix.create([
        [k[0] + k[1], -k[1], 0, 0, 0],
        [-k[1], k[1] + k[2], -k[2], 0, 0],
        [0, -k[2], k[2] + k[3], -k[3], 0],
        [0, 0, -k[3], k[3] + k[4], -k[4]],
        [0, 0, 0, -k[4], k[4]]]);
    let ev = eigenvalues(mMat, kMat);
    let evec = [];
    for (let i in ev) {
        let t = Matrix.eigenstructure(Matrix.sub(kMat, Matrix.scale(mMat, ev[i]))).V.mat;
        let temp = [], max = 0;
        for (let j in t) {
            temp.push((t[j])[4]);
            if (abs((t[j])[4]) > abs(max)) max = (t[j])[4];
        }
        temp = temp.map(x => ((x / max).toFixed(4)));
        evec.push(temp.map(x => ((temp[0] < 0) ? -1 : 1) * x));
    }
    return evec;
}

function drawEigenvectors() {
    let startX = 35, startY = 420, spacing = 140;
    let evec = calcEigenvectors();
    push();
    translate(startX, startY);
    text('Eigen vectors', 0, 0);
    for (let i in evec) {
        line(80 + i * spacing, 20, 80 + i * spacing, 150);
    }
    strokeWeight(2);
    for (let i = 0; i < 4; i++) {
        line(135 + i * spacing, -90, 135 + i * spacing, 170);
    }
    fill('darkorange');
    stroke('darkorange');
    for (let i in evec) {
        rect(65 + i * spacing, 10, 30, 10);
    }
    strokeWeight(1);
    stroke('cadetblue');
    noFill();

    for (let i in evec) {
        beginShape();
        vertex(80 + i * spacing, 20);
        for (let j in evec[i]) {
            vertex(80 + lerp(0, 40, -(evec[i])[j]) + i * spacing, 46 + j * 26);
            line(80 + i * spacing, 46 + j * 26, 80 + lerp(0, 40, -(evec[i])[j]) + i * spacing, 46 + j * 26)
        }
        endShape();
    }
    noStroke();
    fill('black');
    for (let i in evec) {
        for (let j in evec[i]) {
            text((evec[i])[j], 3 + i * spacing, 50 + j * 26)
        }
    }


    pop();

}

//helper function to fix visual floating point FEATURES
function fixfp(num, precision) {
    const f = 10 ** precision;
    return Math.round((num + Number.EPSILON) * f) / f;
}