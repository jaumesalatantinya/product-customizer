'use strict';

var CustomElement = function (view, id, customElementData) {

    this.pView = view;
    this.customE = $();
    this.id = id;
    this.data = customElementData;
    this.data.area_attr = JSON.parse(this.data.area_attr);
}

CustomElement.prototype.init = function () {

    var self = this;
    self.pView.pPCustom.showMsg('LOG', 'Init Custom Element');
    self.draw();
    self.bindings();
}

CustomElement.prototype.loadData = function () {

    var self = this;
    self.pView.pPCustom.showMsg('LOG', 'Loading Custom Element Data: ' + self.id);
    return $.ajax(self.pView.pPCustom.apiUrl + 'get-custom-element&IDcusele=' + self.id)
    .done(function(customElementData) {
        if (customElementData){
            self.data = customElementData[0];
            self.data.area_attr = JSON.parse(self.data.area_attr);
        }
        else {
            self.pPCustom.showMsg('ERROR', 'API: Load custom elements data return empty');    
        }
    })
    .fail(function() {
        self.pPCustom.showMsg('ERROR', 'API: Load custom elements data return false');
    });
}

CustomElement.prototype.draw = function() {
    //Polymorfism
}

CustomElement.prototype.bindings = function () {

    var self = this;
    
    self.customE.find('.custom-element').click(function(){
        self.edit();
    });
    self.customE.draggable({
        stop: function() {
            var newPosSizeData = {
                x: $(this).position().left, y: $(this).position().top,
                width: $(this).width(), height: $(this).height() 
            };
            self.updatePosSize(newPosSizeData).done(function() {
                self.loadData();
            });
        }
    });
    self.customE.resizable({
        resize: function () {
            self.customE.find('.custom-element').css({
                'width' : ($(this).width() -28)+'px',
                'height' : ($(this).height() -28)+'px',
            });
        },
        stop: function() {
            var newPosSizeData = {
                x: $(this).position().left, y: $(this).position().top,
                width: $(this).width(), height: $(this).height() 
            };
            self.updatePosSize(newPosSizeData).done(function() {
                self.loadData();
            });
        }
    });
    self.customE.find('.del-custom-element').click(function() {
        self.delCustomElement(self.data.IDcusele);
    });
};

CustomElement.prototype.edit = function (newPosSizeData) {

    var self = this;
    self.pView.pPCustom.showAuxMenu(self);
}

CustomElement.prototype.updatePosSize = function (newPosSizeData) {

    var self = this;
    self.pView.pPCustom.showMsg('LOG', 'Update Custom Element');
    return $.ajax({
        type: 'POST',
        url: self.pView.pPCustom.apiUrl + 'update-custom-element-pos-size&IDcusele='+self.data.IDcusele,
        data: newPosSizeData
    })
    .done(function(response) {
        if (!response) {
            self.pView.pPCustom.showMsg('ERROR', 'Update Custom Element: API response false');
        }
    })
    .fail(function() {
        self.pView.pPCustom.showMsg('ERROR', 'API: Update Custom Element');
    });
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











function Area (view, id, customElementData) {

    var self = this;
    CustomElement.call(self, view, id, customElementData);
    self.pView.pPCustom.showMsg('LOG', 'Add Area id:' + self.id);
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
    // CustomElement.prototype.draw.call(this);
    self.pView.pPCustom.showMsg('LOG', 'Drawing Area id:' + self.data.IDcusele);
    if (self.data){
        self.customE.css({
            'width' : self.data.width+'px',
            'height' : self.data.height+'px',
            'left' : self.data.x+'px',
            'top' : self.data.y+'px',
        });
        self.customE.find('.custom-element').css({
            'width' : (self.data.width -28)+'px',
            'height' : (self.data.height -28)+'px',
        });
        if (self.data.area_attr.shape == 'cercle'){
            self.customE.find('.custom-element').addClass('area-circle');
        }
        if (self.data.area_attr.shape == 'rectangle') {
            self.customE.find('.custom-element').removeClass('area-circle');
        }
        if (self.data.area_attr.printable == 'false'){
            self.customE.find('.custom-element').addClass('area-no-printable');
        }
        if (self.data.area_attr.printable == 'true') {
            self.customE.find('.custom-element').removeClass('area-no-printable');
        }
    }
};



Area.prototype.update = function(change, value) {

    var self = this;
    self.data.area_attr[change] = value;
    $.ajax({
        type: 'POST',
        url: self.pView.pPCustom.apiUrl + 'update-area&IDcusele=' + self.data.IDcusele,             
        data: self.data.area_attr
    })
    .done(function(response) {
        self.draw();
    })
    .fail(function() {
        self.pView.pPCustom.showMsg('ERROR', 'API: Update Custom Element');
    });
}















function Text(view, id, customElementData) {

    var self = this;
    CustomElement.call(this, view, id, customElementData);
    self.pView.pPCustom.showMsg('LOG', 'Add Text id:' + self.id);
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
        self.customE.find('.custom-element').css({
            'width' : (self.data.width -28)+'px',
            'height' : (self.data.height -28)+'px',
        });
    }
};

