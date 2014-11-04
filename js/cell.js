

function Cell(x, y, populated){
	this.px = x;
	this.py = y;
	this.isGoner = false;
	this.isPregned = false;


	if(populated)
		this.populated = populated;
	else
		this.populated = false;
}

Cell.prototype.setPopulate = function (val){
	this.populated = val;
}

Cell.prototype.isPopulated = function(){
	return this.populated;
};

Cell.prototype.willDie = function(){
	this.isGoner = true;
	this.isPregned = false;
};

Cell.prototype.resetState = function(){
	this.isGoner = false;
	this.isPregned = false;
};

Cell.prototype.fertilize = function(){
	this.isGoner = false;
	this.isPregned = true;
};



