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