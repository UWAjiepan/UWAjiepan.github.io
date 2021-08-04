let gold = '#DAA520', red = '#FF0000', blue = '#5F9EA0';
let mInputs = [], kInputs = [], cInputs = [], inputArr = [mInputs, kInputs, cInputs],
    inputAttributes = [[0.1, 10, 0.1], [0.1, 10, 0.1], [0.001, 1, 0.001]],
    inputBounds = [massInputBounds, springInputBounds, damperInputBounds];
let values = [[], [], [], [], []];


/*
MAIN FUNCTIONS
*/

function setup() {
    createCanvas(900, 900).parent('canvas');
    frameRate(24);
    createInputs();
    updateValues();
}

function draw() {
    background(255);

    drawDiagram();
    drawInputs();
    drawValues();

}


/*
SETUP FUNCTIONS
*/

function createInputs() {
    let startco = [[155, 155], [20, 90], [155, 85]];
    for (let i in inputArr) {
        for (let j = 0; j < 2; j++) {
            let t = createInput((i < 2 ? 1 : 0.08), 'number');
            t.attribute('step', inputAttributes[i][2]);
            t.attribute('min', inputAttributes[i][0]);
            t.attribute('max', inputAttributes[i][1]);
            t.position(startco[i][0], startco[i][1] + j * 140);
            t.style('width', (i < 2 ? '35px' : '50px'));
            t.parent('canvas');
            t.input(inputBounds[i]);
            inputArr[i].push(t);
        }
    }
}


/*
DRAWING FUNCTIONS
*/

function drawDiagram() {
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
}

function drawInputs() {
    let startco = [[139, 170], [4, 105], [140, 100]], unit = [['m', 'kg'], ['k', 'N/m'], ['c', 'Ns/m']];
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 2; j++) {
            drawSubscript(startco[i][0], startco[i][1] + j * 140, unit[i][0], j + 1);
            text(unit[i][1], startco[i][0] + (i < 2 ? 55 : 70), startco[i][1] + j * 140);
        }
    }
}

function drawValues() {
    let vars = ['λ', 'ω', 'ξ', '₁', '₂'], sign = ['+', '-'], startX = 265, startY = 75, spacing = 235;
    for (let v in values[0]) {
        drawSubscript(startX + (v < 2 ? 0 : spacing), startY + (v % 2) * 35, vars[0], v * 1 + 1, 22, blacka, 13);
        text(`= ${(values[0][v].toFixed(8) * 1).toPrecision(4)} ${sign[v % 2]} i${Math.abs(values[1][v].toFixed(8) * 1).toPrecision(4)}`, startX + 25 + (v < 2 ? 0 : spacing), startY + (v % 2) * 35);
    }
    for (let v in values[2]) {
        let n = (v < 2 ? 1 : 2);
        drawSubscript(startX + (v < 2 ? 0 : spacing), startY + 100 + (v % 2) * 35, vars[1], n, 22, blacka, 13);
        if (!((v * 1) % 2)) {
            text(`=`, startX + 28 + (v < 2 ? 0 : spacing), startY + 100 + (v % 2) * 35);
            drawSubscript(startX + 37 + (v < 2 ? 0 : spacing), startY + 100 + (v % 2) * 35, vars[1], `n${n}`, 22, blacka, 13);
            drawFraction(startX + 105 + (v < 2 ? 0 : spacing), startY + 75 + (v % 2) * 35, '', `1 - ${vars[2]}²${vars[3 + v % 2]}`, 15);
            line(startX + 80 + (v < 2 ? 0 : spacing), startY + 80 + (v % 2) * 35, startX + 75 + (v < 2 ? 0 : spacing), startY + 105 + (v % 2) * 35);
            line(startX + 72 + (v < 2 ? 0 : spacing), startY + 97 + (v % 2) * 35, startX + 75 + (v < 2 ? 0 : spacing), startY + 105 + (v % 2) * 35);
            text(`= ${(values[2][v].toFixed(8) * 1).toPrecision(4)} rad/s`, startX + 133 + (v < 2 ? 0 : spacing), startY + 100 + (v % 2) * 35);
        } else {
            drawSubscript(startX + 25 + (v < 2 ? 0 : spacing), startY + 100 + (v % 2) * 35, vars[2], n, 22, blacka, 13);
            text(`= ${(values[2][v].toFixed(8) * 1).toPrecision(4)} rad/s`, startX + 45 + (v < 2 ? 0 : spacing), startY + 100 + (v % 2) * 35);
        }
    }
    for (let v in values[3]) {
        let n = (v < 2 ? 1 : 2);
        if (!((v * 1) % 2)) {
            drawSubscript(startX + (v < 2 ? 0 : spacing), startY + 200 + (v % 2) * 35, vars[1], `n${n}`, 22, blacka, 13);
            text(`= ${(values[3][v].toFixed(8) * 1).toPrecision(4)} rad/s`, startX + 35 + (v < 2 ? 0 : spacing), startY + 200 + (v % 2) * 35)
        } else {
            drawSubscript(startX + (v < 2 ? 0 : spacing), startY + 200 + (v % 2) * 35, vars[2], `${n}`, 22, blacka, 13);
            text(`= ${(values[3][v].toFixed(8) * 1).toPrecision(4)}`, startX + 30 + (v < 2 ? 0 : spacing), startY + 200 + (v % 2) * 35);
        }
    }
    push();
    textSize(16);
    text('Undamped Values', startX, startY + 290);
    pop();
    for (let v in values[4]) {
        drawSubscript(startX + v * spacing, startY + 320, vars[1], `n${v * 1 + 1}`, 22, blacka, 13);
        text(`= ${(values[4][v].toFixed(8) * 1).toPrecision(4)} rad/s`, startX + 35 + v * spacing, startY + 320)
    }
}

/*
MATH FUNCTIONS
*/

function updateValues() {
    let mat1 = Matrix.create([
        [mInputs[0].value(), 0],
        [0, mInputs[1].value()]]);
    let mat2 = Matrix.create([
        [kInputs[0].value() * 1 + kInputs[1].value() * 1, -kInputs[1].value()],
        [-kInputs[1].value(), kInputs[1].value()]
    ]);
    let mat3 = Matrix.create([
        [cInputs[0].value() * 1 + cInputs[1].value() * 1, -cInputs[1].value()],
        [-cInputs[1].value(), cInputs[1].value()]
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
    values[0] = [es.lr[0], es.lr[1], es.lr[2], es.lr[2]];
    values[1] = [es.li[0], es.li[1], es.li[2], es.li[2]];
    values[2] = [es.li[0], es.lr[0], es.li[2], es.lr[2]];
    let eq1 = Math.sqrt(1 / (1 + sq(es.li[0] / es.lr[0])));
    let eq2 = Math.sqrt(1 / (1 + sq(es.li[2] / es.lr[2])));
    values[3] = [es.lr[0] / Math.sqrt(1 - sq(eq1)), eq1, es.lr[2] / Math.sqrt(1 - sq(eq2)), eq2];
    values[4] = eigenvalues(mat1, mat2).map(x => Math.sqrt(x));
}


/*
                Helper Functions
*/

function massInputBounds() {
    if (this.value() < 0.01 && this.value() !== "") this.value(0.01);
    else if (this.value() > 10) this.value(10);
    else if ((this.value() * 100) % 1 !== 0) this.value((Math.round(this.value() * 100) / 100).toFixed(2));
    else updateValues();
}

function springInputBounds() {
    if (this.value() < 1 && this.value() !== "") this.value(1);
    else if (this.value() > 100) this.value(100);
    else if ((this.value() * 10) % 1 !== 0) this.value((Math.floor(this.value() * 10) / 10).toFixed(1));
    else updateValues();
}

function damperInputBounds() {
    if (this.value() < 0 && this.value() !== "") this.value(0);
    else if (this.value() > 1) this.value(1);
    else if ((this.value() * 1000) % 1 !== 0) this.value((Math.floor(this.value() * 1000) / 1000).toFixed(3));
    else updateValues();
}

