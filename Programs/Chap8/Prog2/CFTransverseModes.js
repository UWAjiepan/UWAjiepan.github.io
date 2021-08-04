let t = 0, dt = 1 / 30;
let blue = '#5F9EA0', orange = '#ffb403';
let wn = [3.52, 22.03, 61.7, 120.9, 199.9, 298.6];
let str = ["First", "Second", "Third", "Fourth", "Fifth", "Sixth"];

function setup() {
    createCanvas(400, 600).parent('canvas');
    frameRate(30);
    stroke(blue);
    noFill();
}

function draw() {
    background(255);


    for (let i = 0; i < 6; i++) {
        let l = Math.sqrt(wn[i]);
        let s = Math.sin(l) + Math.sinh(l);
        let c = Math.cos(l) + Math.cosh(l);
        let yp = [], max = 0;
        for (let x = 0; x < 200; x++) {
            let lx = l * x * 0.005;
            yp.push(s * (Math.cos(lx) - Math.cosh(lx)) - c * (Math.sin(lx) - Math.sinh(lx)));
            if (Math.abs(yp[x]) > max) max = Math.abs(yp[x]);
        }
        yp = yp.map(x => x * 20 / max);
        beginShape();
        for (let x in yp) {
            vertex(50 + x * 1, 50 + 100 * i - (yp[x] * Math.cos(0.025 * t * wn[i])));
        }
        endShape();
        push();
        noStroke();
        fill('#000000');
        text(`${str[i]} mode`, 275, 50 + 100 * i);
        fill(orange);
        stroke(orange);
        rect(25, 20 + 100 * i, 25, 60);
        pop();
    }

    if (focused) t += dt;
}
