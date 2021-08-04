let gold = '#DAA520', cblue = '#5F9EA0', rblue = '#4169E1';
let t = 0, dt = 1 / 80;

function setup() {
    createCanvas(430, 220).parent('canvas');
}

function draw() {
    background(255);

    push();
    let mp = calcPoints();
    line(150, 80, 225, 80 + mp.m1[0]);
    line(225, 80 + mp.m1[0], 300, 80 + mp.m1[1]);
    line(300, 80 + mp.m1[1], 375, 80);
    line(150, 160, 225, 160 + mp.m2[0]);
    line(225, 160 + mp.m2[0], 300, 160 + mp.m2[1]);
    line(300, 160 + mp.m2[1], 375, 160);
    fill(gold);
    stroke(gold);
    rect(120, 50, 30, 60);
    rect(120, 130, 30, 60);
    rect(375, 50, 30, 60);
    rect(375, 130, 30, 60);
    fill(rblue);
    stroke(rblue);
    circle(225, 80 + mp.m1[0], 20);
    circle(300, 80 + mp.m1[1], 20);
    circle(225, 160 + mp.m2[0], 20);
    circle(300, 160 + mp.m2[1], 20);
    pop();

    if (focused) t += dt;

}

function calcPoints() {
    let w = [1, 2].map(x => Math.sin(x * (HALF_PI / 3)));
    let m1 = [1, 2].map(x => 20 * Math.sin(x * (Math.PI / 3)) * Math.sin(w[0] * t * TWO_PI));
    let m2 = [1, 2].map(x => 20 * Math.sin(2 * x * (Math.PI / 3)) * Math.sin(w[1] * t * TWO_PI));
    return {
        m1: m1,
        m2: m2
    }
}