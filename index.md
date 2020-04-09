conwayslife
===========

Conway's life implementation

The Game of Life is not your typical computer game. It is a 'cellular automaton', and was invented by Cambridge mathematician John Conway.

The Rules
For a space that is 'populated':

    Each cell with one or no neighbors dies, as if by loneliness.
    Each cell with four or more neighbors dies, as if by overpopulation.
    Each cell with two or three neighbors survives.

For a space that is 'empty' or 'unpopulated'

    Each cell with three neighbors becomes populated.
    
Whatch live [Demo](http://jsfiddle.net/emsedano/4835jcnm/7/ "Live demo")
                   

 ```
//====================== Cell object ================================

function Cell(x, y, populated) {
    this.px = x;
    this.py = y;
    this.isGoner = false;
    this.isPregned = false;


    if (populated) this.populated = populated;
    else this.populated = false;
}

Cell.prototype.setPopulate = function (val) {
    this.populated = val;
};

Cell.prototype.isPopulated = function () {
    return this.populated;
};

Cell.prototype.willDie = function () {
    this.isGoner = true;
    this.isPregned = false;
};

Cell.prototype.resetState = function () {
    this.isGoner = false;
    this.isPregned = false;
};

Cell.prototype.fertilize = function () {
    this.isGoner = false;
    this.isPregned = true;
};


//================================= ENVIRONMENT =================================

function Environment(w, h, target) {
    this.target = $(target);
    this.w = w;
    this.h = h;

    this.fields = new Array(w);

    for (var i = 0; i < w; i++) {
        //define cada elemento como una matriz de longitud w
        this.fields[i] = new Array(h);
        for (var j = 0; j < h; j++) {
            /* asigna a cada elemento de la matriz bidimensional 
             * los valores de i y j */
            this.fields[i][j] = new Cell(i, j);
        }
    }
}

Environment.prototype.NORTH = 'N';
Environment.prototype.NOREAST = 'NE';
Environment.prototype.NORWEST = 'NW';
Environment.prototype.SOUTH = 'S';
Environment.prototype.SOUTHEAST = 'SE';
Environment.prototype.SOUTHWEST = 'SW';
Environment.prototype.EAST = 'E';
Environment.prototype.WEST = 'W';

Environment.prototype.init = function () {

    var tr = "";
    var td = "";
    var css = "";
    for (i = 0; i < this.w; i++) {

        tr = "<tr id='row_" + i + "'>";
        td = "";

        for (j = 0; j < this.h; j++) {
            css = "";
            if (this.getCell(i, j) !== null && this.getCell(i, j).isPopulated()) css = "alive";
            td += "<td class='" + css + "' ondblclick='ConwaysLifeGame.togglePopulated(" + i + "," + j + ");'></td>";

        }

        tr += td;
        tr += "</tr>";

        this.target.append(tr);
    }
};

Environment.prototype.refreshEnvironment = function () {
    this.target.html("");
    this.init();
};

Environment.prototype.setCell = function (Cell) {
    if (this.fields[Cell.px][Cell.py] === null) this.fields[Cell.px][Cell.py] = Cell;
};

Environment.prototype.getCell = function (x, y) {
    return this.fields[x][y];
};

Environment.prototype.hasNeighborAt = function (Cell, DIR) {

    var neighborgCell = this.doesCellExist(Cell, DIR);

    if (neighborgCell) return neighborgCell.isPopulated();

    return false;

};

Environment.prototype.doesCellExist = function (Cell, DIR) {

    if (Cell) {

        if (DIR === this.NORTH && Cell.px > 0) {
            //NORTH
            return this.getCell(Cell.px - 1, Cell.py);

        } else if (DIR === this.SOUTH && Cell.px < this.h - 1) {
            //SOUTH
            return this.getCell(Cell.px + 1, Cell.py);

        } else if (DIR === this.EAST && Cell.py < this.w - 1) {
            //EAST
            return this.getCell(Cell.px, Cell.py + 1);

        } else if (DIR === this.WEST && Cell.py > 0) { /// West default
            //WEST
            return this.getCell(Cell.px, Cell.py - 1);

        } else if (DIR === this.NOREAST) {
            //NOREAST
            return this.doesCellExist(this.doesCellExist(Cell, this.NORTH), this.EAST);

        } else if (DIR === this.NORWEST) {
            //NORWEST
            return this.doesCellExist(this.doesCellExist(Cell, this.NORTH), this.WEST);

        } else if (DIR === this.SOUTHEAST) {
            //SOUTHEAST
            return this.doesCellExist(this.doesCellExist(Cell, this.SOUTH), this.EAST);

        } else if (DIR === this.SOUTHWEST) {
            //SOUTHWEST
            return this.doesCellExist(this.doesCellExist(Cell, this.SOUTH), this.WEST);
        } else {
            return false;
        }

    } else {
        return false;
    }


};

Environment.prototype.countNeighbors = function (Cell) {
    var neighborgs = 0;
    if (this.hasNeighborAt(Cell, this.NORTH)) neighborgs++;
    if (this.hasNeighborAt(Cell, this.NOREAST)) neighborgs++;
    if (this.hasNeighborAt(Cell, this.NORWEST)) neighborgs++;
    if (this.hasNeighborAt(Cell, this.SOUTH)) neighborgs++;
    if (this.hasNeighborAt(Cell, this.SOUTHEAST)) neighborgs++;
    if (this.hasNeighborAt(Cell, this.SOUTHWEST)) neighborgs++;
    if (this.hasNeighborAt(Cell, this.EAST)) neighborgs++;
    if (this.hasNeighborAt(Cell, this.WEST)) neighborgs++;

    return neighborgs;
};


//================= Conways life object ========================

var ConwaysLifeGame = {

    environment: null,
    daysGoBy: null,
    running: false,
    lifeCycles: 0,

    setUp: function () {
        ConwaysLifeGame.environment = new Environment(50, 50, "#environment");
        ConwaysLifeGame.environment.init();
    },

    start: function () {
        ConwaysLifeGame.running = true;
        if (ConwaysLifeGame.daysGoBy === null) ConwaysLifeGame.daysGoBy = setInterval(function () {
            ConwaysLifeGame.executeLifeCicle();
        }, 500);
    },

    pause: function () {
        ConwaysLifeGame.running = false;
    },

    stop: function () {
        clearInterval(ConwaysLifeGame.daysGoBy);
        ConwaysLifeGame.pause();
        ConwaysLifeGame.daysGoBy = null;
    },

    isNotZeroGeneration: function () {
        if (ConwaysLifeGame.lifeCycles > 0) return true;
        else return false;
    },

    executeLifeCicle: function () {

        if (ConwaysLifeGame.running) {

            if (ConwaysLifeGame.isNotZeroGeneration()) ConwaysLifeGame.prepareEnvironment();


            var _env = ConwaysLifeGame.environment;
            var cell = null;

            var i, j;
            for (i = 0; i < _env.fields.length; i++) {
                for (j = 0; j < _env.fields[i].length; j++) {

                    cell = _env.getCell(i, j);

                    if (cell.isPopulated()) {
                        ConwaysLifeGame.evaluatePopulatedCell(cell);
                    } else {
                        ConwaysLifeGame.evaluateUnpopulatedCell(cell);
                    }
                }
            }

            _env.refreshEnvironment();

        }

        ConwaysLifeGame.lifeCycles++;
    },

    prepareEnvironment: function () {
        var _env = ConwaysLifeGame.environment;
        var cell = null;
        var i, j;
        for (i = 0; i < _env.fields.length; i++) {
            for (j = 0; j < _env.fields[i].length; j++) {

                cell = _env.getCell(i, j);

                if (cell.isGoner) cell.setPopulate(false);
                else if (cell.isPregned) cell.setPopulate(true);

            }
        }
    },

    evaluatePopulatedCell: function (cell) {

        var neighbors = ConwaysLifeGame.environment.countNeighbors(cell);

        if (neighbors <= 1) { // Each cell with one or no neighbors dies, as if by loneliness.
            cell.willDie();
        } else if (neighbors >= 4) {
            // Each cell with four or more neighbors dies, as if by overpopulation.
            cell.willDie(false);
        }
        // else Each cell with two or three neighbors survives.
    },

    evaluateUnpopulatedCell: function (cell) {
        // Each cell with three neighbors becomes populated.																						   		   
        if (ConwaysLifeGame.environment.countNeighbors(cell) == 3) { // Each cell with one or no neighbors dies, as if by loneliness.
            cell.fertilize();
        }
    },

    togglePopulated: function (x, y) {
        if (ConwaysLifeGame.environment.getCell(x, y).isPopulated()) ConwaysLifeGame.environment.getCell(x, y).setPopulate(false);
        else ConwaysLifeGame.environment.getCell(x, y).setPopulate(true);

        ConwaysLifeGame.environment.refreshEnvironment();
    }
};

 ```



