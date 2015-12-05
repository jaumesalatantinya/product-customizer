CustomElement = function(view, customElementData) {

    this.pView = view;
    this.data = customElementData;

    this.draw();
}

CustomElement.prototype.draw = function (){

    var self = this;
    console.log(self.data);
}
