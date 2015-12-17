'use strict';

var CustomElement = function (view, customElementData) {

    this.pView = view;
    this.customE = $();
    this.data = customElementData;
}

CustomElement.prototype.delCustomElement = function (idCusele) {

    var self = this;
    self.pView.pPCustom.showMsg('LOG', 'Del Cutom Element: ' + idCusele);
    if (idCusele) {
        $.ajax(self.pView.pPCustom.apiUrl + 'del-custom-element&IDcusele=' + idCusele)
        .done(function(response) {
            if (response) {
                self.pView.pPCustom.drawAndUpdateProductCustomizer(self.pView.pPCustom.currentView);
            }
            else { self.pView.pPCustom.showMsg('ERROR', 'Del Cutom Element: API response false'); }
        })
        .fail(function() {
            self.pPCustom.showMsg('ERROR', 'API: Deleting custom elements');
        });
    }
    else { self.showMsg('ERROR', 'Del CustomElement: No idCusele passed as param'); }
}








function Area (view, customElementData) {

    var self = this;
    CustomElement.call(self, view, customElementData);
    self.pView.pPCustom.showMsg('LOG', 'Add Area id:' + self.data.IDcusele);
    self.customE = $('<div class="wrapper-custom-element">\
                        <div class="custom-element area"></div>\
                        <div class="move-custom-element"></div>\
                        <div class="del-custom-element"></div>\
                      </div>');
    self.pView.rootE.append(self.customE);
};
Area.prototype = Object.create(CustomElement.prototype);
Area.prototype.constructor = Area;

Area.prototype.draw = function() {

    var self = this;
    self.pView.pPCustom.showMsg('LOG', 'Drawing Area id:' + self.data.IDcusele);
    if (self.data){
        self.customE.css({
            'width' : this.data.width+'px',
            'height' : this.data.height+'px',
            'left' : this.data.x+'px',
            'top' : this.data.y+'px',
        });
    }
};

Area.prototype.binding = function() {

    var self = this;
    self.customE.find('.del-custom-element').click(function() {
        self.delCustomElement(self.data.IDcusele);
    });
    self.customE.draggable({
        stop: function() {
            console.log('Stop position left: ' + $(this).position().left + ' top: ' + $(this).position().top);
        }
    }).resizable({
        stop: function() {
            console.log('Width: ' + $(this).width() + ' Height: ' + $(this).height());
        }
    });
};







function Text(view, customElementData) {

    CustomElement.call(this, view, customElementData);
};
Text.prototype = Object.create(CustomElement.prototype);
Text.prototype.constructor = Text;

Text.prototype.draw = function(){

    var self = this;
    if (self.data){
        self.pView.pPCustom.showMsg('INFO', 'Drawing Text');
        var div = $('<div>',{
            class: 'custom-element text',
            text: self.data.text
        })
        .css({
            'width' : self.data.width+'px',
            'height' : self.data.height+'px',
            'left' : self.data.x+'px',
            'top' : self.data.y+'px',
        });
        self.pView.rootE.append(div);
    }
};
