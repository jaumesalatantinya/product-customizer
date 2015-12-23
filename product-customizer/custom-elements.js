'use strict';

var CustomElement = function (view, id) {

    this.pView = view;
    this.customE = $();
    this.id = id;
    this.data;
}

CustomElement.prototype.init = function () {

    var self = this;
    self.pView.pPCustom.showMsg('LOG', 'Init Custom Element: ' +self.id);
    self.loadData().done(function(){
        self.draw();
        self.bindings();
    });
}

CustomElement.prototype.loadData = function () {

    var self = this;
    self.pView.pPCustom.showMsg('LOG', 'Loading Custom Element Data: ' + self.id);
    return $.ajax(self.pView.pPCustom.apiUrl + 'get-custom-element&IDcusele=' + self.id)
    .done(function(customElementData) {
        if (customElementData){
            self.data = customElementData[0];
            if (self.data.area_attr) self.data.area_attr = JSON.parse(self.data.area_attr);
            if (self.data.text_attr) self.data.text_attr = JSON.parse(self.data.text_attr);
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

    var self = this;
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
            self.updatePosSizeData(newPosSizeData).done(function() {
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
            self.updatePosSizeData(newPosSizeData).done(function() {
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

CustomElement.prototype.updatePosSizeData = function (newPosSizeData) {

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











function Area (view, id) {

    var self = this;
    CustomElement.call(self, view, id);
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
    self.pView.pPCustom.showMsg('LOG', 'Drawing Area id: ' + self.data.IDcusele);
    CustomElement.prototype.draw.call(this);
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
};

Area.prototype.changeAttr = function (change, value) {

    var self = this;
    self.data.area_attr[change] = value;
    self.updateData(self.data.area_attr);
}

Area.prototype.updateData = function (newData) {

    var self = this;
    $.ajax({
        type: 'POST',
        url: self.pView.pPCustom.apiUrl + 'update-area&IDcusele=' + self.data.IDcusele, 
        data: newData
    })
    .done(function(response) {
        self.draw();
    })
    .fail(function() {
        self.pView.pPCustom.showMsg('ERROR', 'API: Update Custom Element');
    });
}















function Text(view, id) {

    var self = this;
    CustomElement.call(this, view, id);
    self.pView.pPCustom.showMsg('LOG', 'Add Text id:' + self.id);
    self.customE = $('<div class="wrapper-custom-element">\
                        <textarea class="custom-element text"></textarea>\
                        <div class="move-custom-element"></div>\
                        <div class="del-custom-element"></div>\
                      </div>');
    self.pView.rootE.append(self.customE);
};
Text.prototype = Object.create(CustomElement.prototype);
Text.prototype.constructor = Text;

Text.prototype.draw = function(){

    var self = this;
    self.pView.pPCustom.showMsg('LOG', 'Drawing Text: ' + self.id);
    CustomElement.prototype.draw.call(this);
    if (self.data){
        self.customE.find('.text').val(self.data.text);
        self.customE.find('.text').css({
            'font-family': self.data.text_attr.family,
            'font-weight': self.data.text_attr.weight,
            'font-style': self.data.text_attr.style,
            'font-size': self.data.text_attr.size + 'px',
            'text-align': self.data.text_attr.align
        });
    }
};

Text.prototype.bindings = function () {

    var self = this;
    CustomElement.prototype.bindings.call(this);
    self.customE.find('.text').change( function (){
        self.changeText($(this).val()); 
    });
}

Text.prototype.changeText = function (value){

    var self = this;
    self.data.text = value;
    self.updateData('text', {text: value});
}

Text.prototype.changeAttr = function (change, value) {

    var self = this;
    if (change == 'weight' && value == 'toggle'){
        value = (self.data.text_attr[change] == 'normal') ? 'bold': 'normal';
    }
    if (change == 'style' && value == 'toggle'){
        value = (self.data.text_attr[change] == 'normal') ? 'italic': 'normal';
    }
    self.data.text_attr[change] = value;
    self.updateData('text-attr', self.data.text_attr);
}

Text.prototype.updateData = function (type, newData) {

    var self = this;
    $.ajax({
        type: 'POST',
        url: self.pView.pPCustom.apiUrl + 'update-' + type + '&IDcusele=' + self.data.IDcusele, 
        data: newData
    })
    .done(function(response) {
        self.draw();
    })
    .fail(function() {
        self.pView.pPCustom.showMsg('ERROR', 'API: Update Custom Element');
    });
}

