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