'use strict';

var CustomElement = function(view, customElementData) {

    this.pView = view;
    this.data = customElementData;
}




function Area(view, customElementData) {

    CustomElement.call(this, view, customElementData);
};
Area.prototype = Object.create(CustomElement.prototype);
Area.prototype.constructor = Area;

Area.prototype.draw = function(){
    if (this.data){
        this.pView.pPCustom.showMsg('INFO', 'Drawing Area');;
        var div = $('<div>',{
            class: 'custom-element area'
        })
        .css({
            'width' : this.data.width+'px',
            'height' : this.data.height+'px',
            'left' : this.data.x+'px',
            'top' : this.data.y+'px',
        });
        this.pView.rootE.append(div);
    }
};




function Text(view, customElementData) {

    CustomElement.call(this, view, customElementData);
};
Text.prototype = Object.create(CustomElement.prototype);
Text.prototype.constructor = Text;

Text.prototype.draw = function(){
    if (this.data){
        this.pView.pPCustom.showMsg('INFO', 'Drawing Text');;
        var div = $('<div>',{
            class: 'custom-element text',
            text: this.data.text
        })
        .css({
            'width' : this.data.width+'px',
            'height' : this.data.height+'px',
            'left' : this.data.x+'px',
            'top' : this.data.y+'px',
        });
        this.pView.rootE.append(div);
    }
};
