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

CustomElement.prototype.binding = function () {

    var self = this;
    self.customE.find('.del-custom-element').click(function() {
        self.delCustomElement(self.data.IDcusele);
    });
    self.customE.draggable({
        stop: function() {
            var newPosSizeData = {
                IDcusele: self.data.IDcusele,
                x: $(this).position().left, y: $(this).position().top,
                width: $(this).width(), height: $(this).height() 
            };
            self.update(newPosSizeData);
        }
    }).resizable({
        stop: function() {
            var newPosSizeData = {
                IDcusele: self.data.IDcusele,
                x: $(this).position().left, y: $(this).position().top,
                width: $(this).width(), height: $(this).height() 
            };
            self.update(newPosSizeData);
        }
    });
};

CustomElement.prototype.update = function (newPosSizeData) {

    var self = this;
    self.pView.pPCustom.showMsg('LOG', 'Update Custom Element');
    $.ajax({
        url: self.pView.pPCustom.apiUrl + 'update-area',
        data: newPosSizeData
    })
    .done(function(response) {
        if (response) {
            // self.draw();
        }
        else {
            self.pView.pPCustom.showMsg('ERROR', 'Update Custom Element: API response false');
        }
    })
    .fail(function() {
        self.pView.pPCustom.showMsg('ERROR', 'API: Update Custom Element');
    });
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
            'width' : self.data.width+'px',
            'height' : self.data.height+'px',
            'left' : self.data.x+'px',
            'top' : self.data.y+'px',
        });
    }
};







function Text(view, customElementData) {

    var self = this;
    CustomElement.call(this, view, customElementData);
    self.pView.pPCustom.showMsg('LOG', 'Add Text id:' + self.data.IDcusele);
    self.customE = $('<div class="wrapper-custom-element">\
                        <div class="custom-element text">'+self.data.text+'</div>\
                        <div class="move-custom-element"></div>\
                        <div class="del-custom-element"></div>\
                      </div>');
    self.pView.rootE.append(self.customE);
};
Text.prototype = Object.create(CustomElement.prototype);
Text.prototype.constructor = Text;

Text.prototype.draw = function(){

    var self = this;
    self.pView.pPCustom.showMsg('LOG', 'Drawing Area');
    if (self.data){
        self.customE.css({
            'width' : self.data.width+'px',
            'height' : self.data.height+'px',
            'left' : self.data.x+'px',
            'top' : self.data.y+'px',
        });
        self.data.font_attr = JSON.parse(self.data.font_attr);
        self.customE.find('.text').css({
            'font-family': self.data.font_attr.family,
            'font-weight': self.data.font_attr.weight,
            'font-style': self.data.font_attr.style,
            'font-size': self.data.font_attr.size,
            'text-align': self.data.font_attr.align
        });
    }
};

