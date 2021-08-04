let blackp = '#000000';

function Plot(drawX, drawY, w, h) {
    if (typeof drawX === "number") {
        this.drawX = drawX;
    } else throw TypeError("drawX not a number");
    if (typeof drawY === "number") {
        this.drawY = drawY;
    } else throw TypeError("drawY not a number");
    if (typeof w === "number") {
        this.plotWidth = w;
    } else throw TypeError("w is not a number");
    if (typeof h === "number") {
        this.plotHeight = h;
    } else throw TypeError("h is not a number");

    this.playing = false;
    this.xPosition = 0;
    this.dataSources = [];
}

//TODO: make pregen function (currently pregen outside of object and pass thru as point array datasource)
//TODO: Axes labels


Plot.prototype.addSecondYAxis = function () {
    this.secondY = true;
};

Plot.prototype.stopAt = function (stopAt) {
    if (!this.hasOwnProperty("stopPoint") || this.stopPoint > stopAt) {
        this.stopPoint = stopAt;
    }
};

Plot.prototype.stopCheck = function () {
    if (this.hasOwnProperty("stopPoint")) {
        this.stopPoint--;
        if (this.stopPoint < 1) {
            this.playing = false;
            this.ended = true;
        }
    }
};

Plot.prototype.play = function () {
    this.playing = true;
};

Plot.prototype.pause = function () {
    this.playing = false;
};

Plot.prototype.update = function (funcParams = [], func2Params = []) {
    if (!Array.isArray(funcParams) && funcParams.length !== this.yFunc.length) {
        throw TypeError("funcParams must be array and of same length as yFunc");
    }
    if (!Array.isArray(func2Params) && func2Params.length !== this.y2Func.length) {
        throw TypeError("funcParams must be array and of same length as yFunc");
    }

    if (this.playing && focused) {
        for (let data in this.dataSources) {
            switch (this.dataSources[data].type) {
                case 0: //eq
                    this.updateType1(data, funcParams, func2Params);
                    break;
                case 1:
                    this.updateType2(data);
                    break;
            }
            if (!this.hasScrollBar) {
                if (this.dataSources[data].points.length > this.plotWidth) {
                    this.dataSources[data].points.splice(0, 1);
                }
            } else {
                if (this.dataSources[data].points.length > this.plotWidth * this.scrollScaleX) {
                    this.dataSources[data].points.splice(0, 1);
                }
            }
        }
        if (this.hasScrollBar) {
            if (this.xPosition <= this.plotWidth * this.scrollScaleX) this.xPosition++;
        } //else if (this.xPosition <= this.plotWidth) this.xPosition++;
        this.stopCheck();
    }

    if (this.hasScrollBar && this.hasPlayed()) {
        this.drawScrollBar();
        this.scroll();
    }
    if (this.hasGrid) this.drawGrid();
    this.drawPlot();
};

Plot.prototype.updateType1 = function (index, funcParams) {
    this.dataSources[index].points.push(this.dataSources[index].yFunc(...funcParams));
};

Plot.prototype.updateType2 = function (index) {
    this.dataSources[index].points.push(this.dataSources[index].preloaded.shift());
};

Plot.prototype.getLatestDataValue = function (index) {
    return this.dataSources[index].points[this.dataSources[index].points.length - 1];
};

Plot.prototype.deleteData = function (index) {
    this.dataSources.splice(index, 1);
};

Plot.prototype.addScrollBar = function (yOffset, scrollScaleX, scrollScaleY) {
    if (typeof yOffset === "number") {
        this.yOffset = yOffset;
    } else throw TypeError("yOffset is not a number");
    if (typeof scrollScaleX === "number") {
        this.scrollScaleX = scrollScaleX;
    } else throw TypeError("scrollScaleX is not a number");
    if (typeof scrollScaleY === "number") {
        this.scrollScaleY = scrollScaleY;
    } else throw TypeError("scrollScaleY is not a number");
    this.hasScrollBar = true;
};

Plot.prototype.drawScrollBar = function () {
    if (!this.hasScrollBar) throw Error("scrollBar not initialised");

    //makes scrollbar start prettier
    this.nanOffset = 0;
    for (let i = 0; i < this.plotWidth; i++) {
        if (Number.isNaN(this.dataSources[0].points[i])) {
            this.nanOffset = i;
        } else {
            break;
        }
    }

    if (this.playing) this.xPosition = this.dataSources[0].points.length - this.nanOffset;
    if (this.xPosition > this.dataSources[0].points.length - this.plotWidth + 1) this.xPosition = this.dataSources[0].points.length - this.plotWidth + 1;
    //if (this.xPosition < this.nanOffset) this.xPosition = this.nanOffset;


    //Draws scrollbar
    if (this.hasPlayed()) {
        let scrollBarY = this.drawY + this.plotHeight + this.yOffset;
        let scrollBarH = this.plotHeight / this.scrollScaleY;
        this.scrollerW = this.plotWidth / this.scrollScaleX;


        //Draws bar
        push();
        noFill();
        strokeWeight(2);
        stroke(blackp);
        rect(this.drawX, scrollBarY, this.plotWidth, scrollBarH);
        stroke('red');
        //Draws Scroller
        if (this.dataSources[0].points.length < this.plotWidth * 2) {
            rect(this.drawX, scrollBarY, this.scrollerW, scrollBarH);
        } else {
            rect(this.drawX + ((this.xPosition - this.nanOffset) / this.scrollScaleX), scrollBarY, this.scrollerW, scrollBarH);
        }
        pop();


        //draws plot inside scrollbar
        for (let data of this.dataSources) {
            push();
            noFill();
            stroke(data.color);
            strokeWeight(data.size);
            beginShape();
            if (this.secondY) {
                for (let i = 0; i < data.points.length - 1; i++) {
                    if (isNaN(data.points[i])) continue;
                    if (data.yaxis === 1) vertex(this.drawX + ((i - this.nanOffset) / this.scrollScaleX),
                        (scrollBarY + (0.25 * scrollBarH)) + (data.points[i] / this.scrollScaleY));
                    else if (data.yaxis === 2) vertex(this.drawX + ((i - this.nanOffset) / this.scrollScaleX),
                        (scrollBarY + (0.75 * scrollBarH)) + (data.points[i] / this.scrollScaleY));
                }
            } else {
                for (let i = 0; i < data.points.length - 1; i++) {
                    if (isNaN(data.points[i])) continue;
                    vertex(this.drawX + ((i - this.nanOffset) / this.scrollScaleX),
                        (scrollBarY + (0.5 * scrollBarH)) + (data.points[i] / this.scrollScaleY));
                }
            }
            endShape();
            pop();
        }
    }
};

Plot.prototype.scroll = function () {
    let scrollBarY = this.drawY + this.plotHeight + this.yOffset;

    if (!this.playing && mouseIsPressed && this.hasPlayed(2)) {
        if (mouseButton === LEFT && mouseX > this.drawX &&
            mouseX < this.drawX + this.plotWidth &&
            scrollBarY < mouseY && mouseY < scrollBarY + (this.plotHeight / this.scrollScaleY)) {
            let test = lerp(-this.scrollerW / 2, this.scrollerW / 2, this.nanOffset / (this.plotWidth - 1));
            if (this.xPosition + this.plotWidth === this.plotWidth * this.scrollScaleX) {
                this.xPosition = (mouseX - this.drawX - (this.plotWidth / (this.scrollScaleX * 2))) * this.scrollScaleX;
            } else {
                this.xPosition = ((mouseX - this.drawX + test) * this.scrollScaleX);
            }
            if (this.xPosition < this.nanOffset) this.xPosition = this.nanOffset;
        }
    }
    if (this.xPosition > this.dataSources[0].points.length - this.plotWidth + 1) this.xPosition = this.dataSources[0].points.length - this.plotWidth + 1;
};

Plot.prototype.drawPlot = function () {
    //box and y axis
    if (!this.secondY) {
        push();
        noFill();
        strokeWeight(2);
        rect(this.drawX - 2, this.drawY - 2, this.plotWidth + 2, this.plotHeight + 2);
        stroke('gray');
        line(this.drawX, this.drawY + (this.plotHeight / 2), this.drawX + this.plotWidth - 2, this.drawY + (this.plotHeight / 2));
        pop();
    } else if (this.secondY) {
        push();
        noFill();
        strokeWeight(2);
        rect(this.drawX - 2, this.drawY - 2, this.plotWidth + 2, this.plotHeight + 2);
        stroke('gray');
        line(this.drawX, this.drawY + (this.plotHeight / 4), this.drawX + this.plotWidth - 2, this.drawY + (this.plotHeight / 4));
        line(this.drawX, this.drawY + (3 * this.plotHeight / 4), this.drawX + this.plotWidth - 2, this.drawY + (3 * this.plotHeight / 4));
        pop();
    }
    for (let data of this.dataSources) {
        push();
        stroke(data.color);
        strokeWeight(data.size);
        noFill();
        beginShape();
        if (this.secondY) {
            for (let i = 0; i < this.plotWidth; i++) {
                if (Number.isNaN(data.points[this.xPosition + i])) continue;
                if (data.yaxis === 1) vertex(this.drawX + i, this.drawY + (this.plotHeight / 4) + data.points[Math.ceil(this.xPosition) + i]);
                if (data.yaxis === 2) vertex(this.drawX + i, this.drawY + (3 * this.plotHeight / 4) + data.points[Math.ceil(this.xPosition) + i]);
            }
        } else {
            for (let i = 0; i < this.plotWidth; i++) {
                if (Number.isNaN(data.points[this.xPosition + i])) continue;
                vertex(this.drawX + i, this.drawY + (this.plotHeight / 2) + data.points[Math.ceil(this.xPosition) + i]);
            }
        }
        endShape();
        pop();
    }
};

Plot.prototype.addGrid = function (xWidth, yWidth) {
    this.hasGrid = true;
    this.gridXWidth = xWidth;
    this.gridYWidth = yWidth;
    this.gridXCounter = 0;
};

Plot.prototype.drawGrid = function () {
    if (!this.hasGrid) throw Error("Can't draw grid if you have yet to add one.");

    if (this.gridXCounter > this.gridXWidth) this.gridXCounter = 0;
    if (!this.playing) this.gridXCounter = this.xPosition;


    //xgrid
    if (this.gridXWidth !== 0) {
        for (let i = 0; i < this.plotWidth + this.gridXCounter; i++) {
            if (i === 0) {
                push();
                stroke('gray');
                strokeWeight(2);
                //line(this.drawX, this.drawY, this.drawX, this.drawY + this.plotHeight);
                pop();
            } else if (!(i % this.gridXWidth) && (i - this.gridXCounter) > 0) {
                push();
                stroke('gray');
                strokeWeight(1);
                line(this.drawX + (i - this.gridXCounter), this.drawY, this.drawX + (i - this.gridXCounter), this.drawY + this.plotHeight);
                pop();
            }
        }
    }
    if (focused) this.gridXCounter++;
    //TODO: ADD Y GRID
    if (this.gridYWidth !== 0) {
        for (let i = 0; i < this.plotHeight - 1; i++) {
            if (this.points.length > this.plotWidth) {

            }
        }
    }
};


Plot.prototype.clear = function () {
    this.xPosition = 0;
    this.ended = false;
    for (let data of this.dataSources) {
        if (data.type === 1) {
            let nanOffset = 0;
            for (let i = 0; i < this.plotWidth; i++) {
                if (Number.isNaN(data.points[i])) nanOffset = i;
                else break;
            }
            data.preloaded.unshift(...data.points.splice(nanOffset+1));
            this.stopPoint = data.preloaded.length-1;
        }
        data.points = [];
        for (let i = 0; i < this.plotWidth; i++) {
            data.points.push(NaN);
        }
    }
};

Plot.prototype.reset = function () {
    this.xPosition = 0;
    this.ended = false;
    this.dataSources.splice(0);
    delete this.stopPoint;
};

Plot.prototype.hasPlayed = function (factor = 1) {
    if (this.dataSources.length > 0) {
        //return !Number.isNaN(this.dataSources[0].points[((this.dataSources[0].points.length-1)/factor).toFixed(0)]);
        return (this.dataSources[0].points.length > this.plotWidth / factor);
    } else return false;
};

Plot.prototype.addNewDataSource = function (type, ...args) {
    this.dataSources.push(new Data(type, ...args));
    for (let i = 0; i < this.plotWidth; i++) {
        this.dataSources[this.dataSources.length - 1].points.push(NaN)
    }
    if (type === 1) this.stopAt(args[0].length - 1);
};

//0 for eq
//1 for arr
//args = [yfunc/pointarray, color, size, yaxis]
function Data(type, ...args) {
    this.type = type;
    this.points = [];
    switch (this.type) {
        case 0:
            this.yFunc = args.shift();
            if (typeof this.yFunc !== "function") throw TypeError("y2Func is not a function");
            break;
        case 1:
            this.preloaded = args.shift();
            break;
        default:
            throw TypeError("invalid type");
    }
    if (args.length > 0) this.color = args.shift();
    else this.color = blackp;
    if (args.length > 0) this.size = args.shift();
    else this.size = 1;
    if (args.length > 0) this.yaxis = args.shift();
}

//TODO Implement animation slider?
//TODO ADD positive x Log Scale bounds
//TODO Add negative log scale bounds
//TODO fix exponent ticks for log scale
//TODO Add second graph/y axis log scale
//TODO Make axis object?
//TODO Add axis Labels
function StaticGraph(startX, startY, graphWidth, graphHeight, xBounds, yBounds, xTickSpace = 0, yTickSpace = 0) {
    for (let s in arguments) {
        if (s === "4" || s === "5") {
            if (!Array.isArray(arguments[s]) || arguments[s].length !== 2) {
                throw TypeError(`${arguments[s]} must be an Array of size 2`);
            }
            for (let t of arguments[s]) {
                if (typeof t !== 'number') throw TypeError(`${s},${typeof t} ,bound arrays must contain only numbers`)
            }
        } else if (typeof arguments[s] !== "number") {
            if (s === "6" && typeof arguments[s] === "string") {
                if (arguments[s] === 'log') this.xLog = true;
                else throw TypeError(`${typeof s},${s},${arguments[s]} must be a number or log for log10`);
            } else if (s === "7" && typeof arguments[s] === "string") {
                if (arguments[s] === 'log') this.yLog = true;
                else throw TypeError(`${typeof s},${s},${arguments[s]} must be a number or log for log10`);
            } else throw TypeError(`${typeof s},${s},${arguments[s]} must be a number`);
        }
    }
    //axes calcs
    this.noXTicksNos = false;
    this.axisLabels = [];
    this.pointObjects = [];
    this.analysisObjects = [];
    this.startX = startX;
    this.startY = startY;
    this.xBounds = xBounds.sort(function (a, b) {
        return a - b
    });
    let xWidth = abs(xBounds[0]) + abs(xBounds[1]);
    this.xDens = graphWidth / xWidth;
    this.xZero = ((0 - xBounds[0]) * this.xDens) + startX;
    this.yBounds = yBounds.sort(function (a, b) {
        return a - b
    });
    let yWidth = yBounds[1] - yBounds[0];
    this.yDens = graphHeight / yWidth;
    this.graphWidth = graphWidth;
    this.graphHeight = graphHeight;
    this.secondOffset = 0;
    //axes tick calcs
    this.tickColour = blackp;

    this.xTicks = [];
    if (this.xLog === true) {

    } else if (xTickSpace !== 0) {
        for (let i = xTickSpace; i <= abs(this.xBounds[0]) || i <= this.xBounds[1]; i += xTickSpace) {
            if (i <= this.xBounds[1]) this.xTicks.push(i);
            if (i <= abs(this.xBounds[0])) this.xTicks.push(-1 * i);
        }
        if (this.yLog) this.xTicks.push(0);
    } else {
        this.xTicks.push(...xBounds);
        this.xTicks = this.xTicks.filter(e => e !== 0);
    }
    this.xTicks.sort(function (a, b) {
        return a - b
    });

    this.yAxisC = blackp;
    this.yTicks = [];
    if (this.yLog === true) {
        for (let i = this.yBounds[0]; i <= this.yBounds[1]; i++) {
            if (i === 0) {
                this.yTicks.push(0);
            }
            if (i >= 0) this.yTicks.push(Math.pow(10, i));
            else this.yTicks.push(Math.pow(10, i).toFixed(abs(i)));
        }
        this.yBounds = [(this.yTicks.includes(0) ? 0 : Math.pow(10, yBounds[0])).toFixed(abs(yBounds[0])), Math.pow(10, yBounds[1]).toFixed(abs(yBounds[1]))];
        this.yTicks.splice(this.yTicks.indexOf(0), 1);
    } else if (yTickSpace !== 0) {
        for (let i = yTickSpace; i <= abs(this.yBounds[0]) || i <= this.yBounds[1]; i += yTickSpace) {
            if (i <= this.yBounds[1]) this.yTicks.push(i);
            if (i <= abs(this.yBounds[0])) this.yTicks.push(-1 * i);
        }
    } else {
        this.yTicks.push(...yBounds);
        this.yTicks = this.yTicks.filter(e => e !== 0);
    }
    this.yTicks.sort(function (a, b) {
        return a - b
    });
    this.yZero = graphHeight + startY - ((0 - this.yBounds[0]) * this.yDens);

}

//TODO: fix 0 tick
//TODO:split up draw func into different parts and types
StaticGraph.prototype.draw = function () {
    let graph = this;
    push();
    strokeWeight(1);
    textSize(12);
    //draw axes

    line(this.startX - 5, this.yZero, this.startX + this.graphWidth + 5, this.yZero);
    line(this.xZero, this.startY - 5, this.xZero, this.startY + this.graphHeight + 5);

    //draw axes ticks
    fill(this.tickColour);

    let xpos = this.yZero > (this.startY + this.graphHeight / 2); //true x axis ticks go underneath false above
    let ypos = this.xZero > (this.startX + this.graphWidth / 2); //true RHS false LHS

    //TODO MAKE LOG GRAPH YTICK EXPONENT CUSTOMISABLE
    if (this.yLog) {
        drawXTicks();
        for (let t in graph.yTicks) {
            line(graph.xZero, graph.yZero - (t * graph.yDens), graph.xZero + (ypos ? 3 : -3), graph.yZero - (t * graph.yDens));
            if (graph.yTicks[t] <= 2E-4) {
                text('10', graph.xZero + (ypos ? 6 : (textWidth(10) * -1) - 20), graph.yZero - (t * graph.yDens) + 3);
                push();
                textSize(11);
                text(`${Math.log10(graph.yTicks[t] * 1)}`, graph.xZero + textWidth(10) - 30, graph.yZero - (t * graph.yDens) - 7);
                pop();
            } else text(`${graph.yTicks[t]}`, graph.xZero + (ypos ? 6 : (textWidth(graph.yTicks[t]) * -1) - 5), graph.yZero - (t * graph.yDens) + 3);
        }
    } else if (this.secondGraph) {
        drawSecondGraphTicks();
    } else {
        drawXTicks();
        drawYTicks();
        if (this.yBounds.includes(0) && !this.xBounds.includes(0)) {
            text(0, this.xZero - textWidth("0") / 2, this.yZero + (xpos ? 10 : -10));
        } else if (this.xBounds.includes(0) && !this.yBounds.includes(0)) {
            text(0, this.xZero + (ypos ? 15 : -15), this.yZero + 3);
        } else {
            text(0, this.xZero + (ypos ? 10 : -10), this.yZero + (xpos ? 10 : -10));
        }
    }
    if (this.secondYAxis) this.drawSecondYAxis();
    pop();

    for (let p of this.pointObjects) {
        push();
        if (p.graph === 1) translate(this.xZero, this.yZero);
        else if (this.secondYAxis && p.graph === 2) translate(this.xZero, this.y2Zero);
        else if (this.type === 'x') translate(this.xZero, this.y2Zero);
        else if (this.type === 'y') translate(this.x2Zero, this.yZero);
        strokeWeight(p.size);
        stroke(p.colour);
        noFill();
        //TODO ADD POINTS BOUND CHECKS
        if (p.type === "array") {
            if (this.yLog && p.graph === 1) {
                let yBounds = this.yBounds.map(x => Math.log10(x));
                if (yBounds[0] === -Infinity) yBounds[0] = Math.log10(this.yTicks[0]);
                for (let i = 0; i < p.xPoints.length; i++) {
                    point(p.xPoints[i] * this.xDens, (yBounds[0] - Math.log10(p.yPoints[i])) * this.yDens);
                }
            } else if (p.graph === 1) {
                for (let i = 0; i < p.xPoints.length; i++) {
                    point(p.xPoints[i] * this.xDens, -1 * p.yPoints[i] * this.yDens);
                }
            } else if (p.graph === 2 && this.secondYAxis) {
                for (let i = 0; i < p.xPoints.length; i++) {
                    point(p.xPoints[i] * this.xDens, -1 * p.yPoints[i] * this.y2Dens);
                }
            } else if (this.type === 'x') {
                for (let i = 0; i < p.xPoints.length; i++) {
                    point(p.xPoints[i] * this.xDens, abs(p.yPoints[i]) * this.secDens);
                }
            } else if (this.type === 'y') {
                for (let i = 0; i < p.xPoints.length; i++) {
                    point(-1 * abs(p.xPoints[i]) * this.secDens, -1 * abs(p.yPoints[i]) * this.yDens);
                }
            }
        } else if (p.type === "function") {
            if (p.xPoints.length === 0) {
                if (p.graph === 1 || (this.secondYAxis && p.graph === 2)) {
                    beginShape();
                    let shape = true;
                    let bound = false;
                    for (let i = this.xBounds[0] * this.xDens; i < this.xBounds[1] * this.xDens; i += p.dens) {
                        let y, yBounds, yDens;
                        if (this.yLog && p.graph === 1) {
                            yBounds = this.yBounds.map(x => Math.log10(x));
                            yDens = this.yDens;
                            if (yBounds[0] === -Infinity) yBounds[0] = Math.log10(this.yTicks[0]);
                            y = yBounds[0] - Math.log10(p.yFunc(i / this.xDens));
                            y *= -1;
                            yBounds[1] = Math.abs(yBounds[0] - yBounds[1]);
                            yBounds[0] = 0;
                        } else if (this.secondYAxis && p.graph === 2) {
                            yBounds = this.y2Bounds;
                            y = p.yFunc(i / this.xDens);
                            yDens = this.y2Dens;
                        } else {
                            yBounds = this.yBounds;
                            y = p.yFunc(i / this.xDens);
                            yDens = this.yDens;
                        }
                        if (y <= yBounds[0]) {
                            if (shape) {
                                vertex(i, -1 * yBounds[0] * yDens);
                                bound = false;
                                shape = false;
                                endShape();
                            }
                        } else if (y >= yBounds[1]) {
                            if (shape) {
                                vertex(i, -1 * yBounds[1] * yDens);
                                bound = true;
                                shape = false;
                                endShape();
                            }
                        } else {
                            if (!shape) {
                                beginShape();
                                vertex(i, -1 * (abs(yBounds[1] - y) < abs(yBounds[0] - y) ? yBounds[1] : yBounds[0]) * yDens);
                                shape = true;
                            }
                            vertex(i, -1 * y * yDens);
                        }
                    }
                    endShape();
                } else if (this.type === 'x') {
                    beginShape();
                    for (let i = this.xBounds[0] * this.xDens; i < this.xBounds[1] * this.xDens; i++) {
                        let y = p.yFunc(i / this.xDens);
                        if (y < this.secondBounds[0]) {
                            vertex(abs(i), abs(this.secondBounds[0]) * this.secDens);
                        } else if (y > this.secondBounds[1]) {
                            vertex(abs(i), abs(this.secondBounds[1]) * this.secDens);
                        } else {
                            vertex(abs(i), abs(y) * this.secDens);
                        }
                    }
                    endShape();
                } else if (this.type === 'y') {
                    beginShape();
                    for (let i = this.secondBounds[0] * this.secDens; i < this.secondBounds[1] * this.secDens; i++) {
                        let y = p.yFunc(i / this.secDens);
                        if (y < this.yBounds[0]) {
                            vertex(-1 * abs(i), -1 * abs(this.yBounds[0]) * this.yDens);
                        } else if (y > this.yBounds[1]) {
                            vertex(-1 * abs(i), -1 * abs(this.yBounds[1]) * this.yDens);
                        } else {
                            vertex(-1 * abs(i), -1 * abs(y) * this.yDens);
                        }
                    }
                    endShape();
                }
            } else {
                if (p.graph === 1) {
                    beginShape();
                    for (let i = 0; i < p.xPoints.length; i++) {
                        vertex(p.xPoints[i] * this.xDens, -1 * p.yFunc(p.xPoints[i]) * this.yDens);
                    }
                    endShape();
                } else if (this.type === 'x') {
                    beginShape();
                    for (let i = 0; i < p.xPoints.length; i++) {
                        vertex(abs(p.xPoints[i]) * this.xDens, abs(p.yFunc(p.xPoints[i])) * this.secDens);
                    }
                    endShape();
                } else if (this.type === 'y') {
                    beginShape();
                    for (let i = 0; i < p.xPoints.length; i++) {
                        vertex(-1 * abs(p.xPoints[i]) * this.xDens, -1 * abs(p.yFunc(p.xPoints[i])) * this.yDens);
                    }
                    endShape();
                }
            }
        }
        pop();
    }

    function drawXTicks() {
        for (let t of graph.xTicks) {
            line(graph.xZero + (t * graph.xDens), graph.yZero, graph.xZero + (t * graph.xDens), graph.yZero + (xpos ? 3 : -3));
            if (!graph.noXTicksNos) text(`${t}`, graph.xZero + (t * (graph.xDens)) - (textWidth(t) / 2), graph.yZero + (xpos ? 14 : -6));
        }
    }

    function drawYTicks() {
        for (let t of graph.yTicks) {
            line(graph.xZero, graph.yZero - (t * graph.yDens), graph.xZero + (ypos ? 3 : -3), graph.yZero - (t * graph.yDens));
            text(`${t}`, graph.xZero + (ypos ? 6 : (textWidth(t) * -1) - 5), graph.yZero - (t * graph.yDens) + 3)
        }
    }

    function drawSecondGraphTicks() {
        if (graph.type === 'x') {
            line(graph.x2Zero, graph.y2Zero - 5, graph.x2Zero, graph.y2Zero + graph.secSize + 5);
            line(graph.x2Zero - 5, graph.y2Zero, graph.x2Zero + graph.graphWidth + 5, graph.y2Zero);
            for (let t of graph.xTicks) {
                line(graph.xZero + (t * graph.xDens), graph.yZero, graph.xZero + (t * graph.xDens), graph.yZero + 3);
                line(graph.xZero + (t * graph.xDens), graph.y2Zero, graph.xZero + (t * graph.xDens), graph.y2Zero - 3);
                text(`${t}`, graph.xZero + (t * (graph.xDens)) - (textWidth(t) / 2), graph.yZero + 3 + graph.secondOffset / 2);
            }
            drawYTicks();
            for (let t of graph.secondTicks) {//y
                line(graph.xZero, graph.y2Zero + (abs(t) * graph.secDens), graph.xZero + (ypos ? 3 : -3), graph.y2Zero + (abs(t) * graph.secDens));
                text(`${t}`, graph.xZero + (ypos ? 6 : (textWidth(t) * -1) - 5), graph.y2Zero + (abs(t) * graph.secDens) + 3);
            }
            text(0, graph.xZero - 3, graph.yZero + 3 + (graph.secondOffset / 2));
            text(0, graph.xZero - 13, graph.yZero + 3);
            text(0, graph.x2Zero - 13, graph.y2Zero + 3);
        }
        if (graph.type === 'y') {
            line(graph.x2Zero, graph.y2Zero + 3, graph.x2Zero, graph.y2Zero - graph.graphHeight - 3);
            line(graph.x2Zero + 3, graph.y2Zero, graph.x2Zero - graph.secSize - 3, graph.y2Zero);
            drawXTicks();
            for (let t of graph.yTicks) {
                line(graph.xZero, graph.yZero - (t * graph.yDens), graph.xZero + (ypos ? 3 : -3), graph.yZero - (t * graph.yDens));
                line(graph.x2Zero, graph.yZero - (t * graph.yDens), graph.x2Zero + 3, graph.yZero - (t * graph.yDens));
                text(`${t}`, graph.xZero - (graph.secondOffset / 2) - textWidth(t) / 2, graph.yZero - (t * graph.yDens) + 3);
            }
            for (let t of graph.secondTicks) {
                line(graph.x2Zero - (abs(t) * graph.secDens), graph.yZero, graph.x2Zero - (abs(t) * graph.secDens), graph.yZero + (xpos ? 3 : -3));
                text(`${t}`, graph.x2Zero - (abs(t) * (graph.secDens)) - (textWidth(t) / 2), graph.yZero + (xpos ? 14 : -6));
            }
            text(0, graph.xZero - textWidth("0") / 2 - graph.secondOffset / 2, graph.yZero + 3);
            text(0, graph.xZero - textWidth("0") / 2, graph.yZero + 13);
            text(0, graph.x2Zero - textWidth("0") / 2, graph.yZero + 13);
        }
    }
};


//type: x to share x axis, y to share y axis (only works if axis lowerbound == 0)
//bounds, label and ticks refer to unshared axis
//makes total graph 2 x plotheight/width
StaticGraph.prototype.addSecondGraph = function (type, bounds, ticks, offset, size = 0) {
    if (this.secondYAxis) throw Error("Cannot add second graph AND second Y axis");
    this.secondGraph = true;
    this.secondBounds = bounds.sort(function (a, b) {
        return a - b
    });

    this.secSize = size;
    this.secondOffset = offset;
    if (type === 'x' && this.yBounds[0] === 0) { //below
        this.y2Zero = this.yZero + offset;
        this.x2Zero = this.xZero;
        if (size === 0) this.secSize = this.graphHeight;
        this.secDens = this.secSize / (abs(bounds[0]) + abs(bounds[1]));
    } else if (type === 'y' && this.xBounds[0] === 0) { //LHS
        this.x2Zero = this.xZero - offset;
        this.y2Zero = this.yZero;
        if (size === 0) this.secSize = this.graphWidth;
        this.secDens = this.secSize / (abs(bounds[0]) + abs(bounds[1]));
    } else throw Error(`type: ${type}, type must refer to shared axis x or y with bound == 0`);

    this.type = type;
    this.secondTicks = [];
    if (ticks !== 0) {
        for (let i = ticks; i <= abs(this.secondBounds[0]) || i <= this.secondBounds[1]; i += ticks) {
            if (i <= this.secondBounds[1]) this.secondTicks.push(i);
            if (i <= abs(this.secondBounds[0])) this.secondTicks.push(-1 * i);
        }
    } else {
        this.secondTicks.push(...this.secondBounds);
        this.secondTicks = this.secondTicks.filter(e => e !== 0);
    }
    this.secondTicks.sort(function (a, b) {
        return a - b
    });
};

//TODO
StaticGraph.prototype.setAxisLabels = function (x, y, second = null) {
    this.xTicks.push(x);
    this.yTicks.push(y);
    if (second !== null && this.secondGraph) this.secondTicks.push(second);
};

StaticGraph.prototype.addPointsArray = function (name, xPoints, yPoints, graph = 1, colour = blackp, size = 4) {
    if (!Array.isArray(xPoints) && !Array.isArray(yPoints)) throw TypeError("points supplied must be in an array");
    if (xPoints.length !== yPoints.length) throw Error("Point arrays must be same length!!");
    let pointObject = {
        name: name,
        type: 'array',
        xPoints: xPoints,
        yPoints: yPoints,
        graph: graph,
        colour: colour,
        size: size
    };
    this.pointObjects.push(pointObject);
};

//input empty array [] for line from left x bound to right x bound
StaticGraph.prototype.addPointsFunction = function (name, xPoints, yFunc, graph = 1, colour = blackp, size = 1) {
    if (!Array.isArray(xPoints)) throw TypeError("points supplied must be in an array");
    if (typeof yFunc !== "function") throw TypeError("yFunc is not a function");
    let pointObject = {
        name: name,
        type: 'function',
        xPoints: xPoints,
        yFunc: yFunc,
        graph: graph,
        colour: colour,
        size: size,
        dens: 0.25,
        cross: false
    };
    this.pointObjects.push(pointObject);
};

StaticGraph.prototype.addAnalysisLine = function (colour, graph, yFunc, bound) {
    let analysisObject = {
        yFunc: yFunc,
        bound: bound,
        graph: graph,
        colour: colour
    };
    this.analysisObjects.push(analysisObject);
};


//TODO Add text(y) option
StaticGraph.prototype.drawAnalysisLine = function (x) {
    let results = [];
    for (let t of this.analysisObjects) {
        let y, yBounds, yDens;
        if (this.yLog && t.graph === 1) {
            yBounds = this.yBounds.map(x => Math.log10(x));
            yDens = this.yDens;
            if (yBounds[0] === -Infinity) yBounds[0] = Math.log10(this.yTicks[0]);
            y = yBounds[0] - Math.log10(t.yFunc(x));
        } else if (this.secondYAxis && t.graph === 2) {
            yBounds = this.y2Bounds;
            y = t.yFunc(x / this.xDens);
            yDens = this.y2Dens;
            stroke(this.yAxis2C);
        } else {
            yBounds = this.yBounds;
            y = t.yFunc(x);
            yDens = this.yDens;
        }
        if (t.graph === 1) {
            push();
            stroke(t.colour);
            translate(this.xZero, this.yZero);
            if (y > this.yBounds[1]) {
                line(x * this.xDens, t.bound * yDens, x * this.xDens, ((this.yLog ? 1 : -1) * yBounds[1] * yDens) + 2);
            } else {
                line(x * this.xDens, t.bound * yDens, x * this.xDens, ((this.yLog ? 1 : -1) * (y) * yDens) + 2);
            }
            pop();
            results.push(y);
        } else if (t.graph === 2) {
            if (this.type === 'x') {
                push();
                stroke(t.colour);
                translate(this.x2Zero, this.y2Zero);
                if (y > abs(this.yBounds[1])) {
                    line(x * this.xDens, abs(t.bound) * this.secDens, x * this.xDens, abs(this.yBounds[1]) * this.secDens);
                } else {
                    line(x * this.xDens, abs(t.bound) * this.secDens, x * this.xDens, abs(y) * this.secDens);
                }
                pop();
                results.push(y);
            } else if (this.type === 'y') {
                push();
                stroke(t.colour);
                translate(this.x2Zero, this.y2Zero);
                line(abs(x) * this.secDens, t.bound * this.yDens, abs(x) * this.secDens, t.yFunc(x) * this.yDens);
                pop();
                results.push(t.yFunc(x));
            }
        }
    }
    return results;
};


//TODO
StaticGraph.prototype.addGrid = function () {

};


StaticGraph.prototype.addSecondYAxis = function (bounds, tickSpace) {
    if (this.secondGraph) throw Error("Cannot add second graph AND second Y axis");
    if (!this.xBounds.includes(0)) throw Error("xBound must include 0");
    if (Array.isArray(bounds) && bounds.length === 2) {
        if (typeof bounds[0] === 'number' && typeof bounds[1] === 'number') this.y2Bounds = bounds;
        else throw TypeError("addSecondYAxis: bounds must be numbers");
    } else throw TypeError("addSecondYAxis: bounds must be array of length 2");
    if (typeof tickSpace === 'number') this.y2TickSpace = tickSpace;
    else throw TypeError("tickspace must be number");
    this.secondYAxis = true;
    this.yAxis2C = 'orange';
    let y2Width = abs(bounds[0]) + abs(bounds[1]);
    this.y2Height = this.graphHeight;
    this.y2Dens = this.y2Height / y2Width;
    this.y2Ticks = [];
    if (tickSpace !== 0) {
        let tsd = tickSpace / y2Width;
        for (let i = 0; i <= 1; i += tsd) {
            this.y2Ticks.push(lerp(bounds[0], bounds[1], i))//TODO Change depending on tick draw code
        }
    } else {
        this.y2Ticks.push(...bounds);
    }
    this.y2Zero = this.yZero - (this.y2Ticks.indexOf(0) * this.y2Dens * this.y2TickSpace);
};

StaticGraph.prototype.drawSecondYAxis = function () {
    push();
    fill(this.yAxis2C);
    let ypos = this.xZero < (this.startX + this.graphWidth / 2);
    for (let t in this.y2Ticks) {
        text(`${this.y2Ticks[t]}`, this.xZero + this.graphWidth + (ypos ? 6 : (textWidth(this.y2Ticks[t]) * -1) - 5), this.yZero - (t * this.y2Dens * this.y2TickSpace) + 3);
    }
    stroke(this.yAxis2C);
    line(this.xZero + this.graphWidth, this.yZero, this.xZero + this.graphWidth, this.yZero - this.y2Height);
    for (let t in this.y2Ticks) {
        line(this.xZero + this.graphWidth, this.yZero - (t * this.y2Dens * this.y2TickSpace), this.xZero + this.graphWidth + (ypos ? 3 : -3), this.yZero - (t * this.y2Dens * this.y2TickSpace));
    }
    pop();
};

StaticGraph.prototype.changeY2Height = function (height) {
    this.y2Height = height;
    this.y2Dens = this.y2Height / (abs(this.y2Bounds[0]) + abs(this.y2Bounds[1]));
    this.y2Zero = this.yZero - (this.y2Ticks.indexOf(0) * this.y2Dens * this.y2TickSpace);
};
