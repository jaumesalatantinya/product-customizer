'use strict';

var CustomElement = function (view, id) {

    this.pView = view;
    this.customE = $();
    this.id = id;
    this.mode = 'draw';
    this.isInCorrectPosition;
    this.data;
};

CustomElement.prototype.init = function () {

    var self = this;
    self.pView.pPCustom.showMsg('LOG', 'Init Custom Element: ' +self.id);
    self.loadData().done(function(){
        self.draw();
        self.bindings();
        // self.pView.updateViewAndCustomElements();
    });
};

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
};

CustomElement.prototype.draw = function() {

    var self = this;
    var isIn
    self.customE.css({
        'width' : self.data.width+'px',
        'height' : self.data.height+'px',
        'left' : self.data.x+'px',
        'top' : self.data.y+'px',
        'z-index' : self.data.Zindex
    });
    self.customE.find('.custom-element').css({
        'width' : (self.data.width -30)+'px',
        'height' : (self.data.height -30)+'px',
    });
    if (self.mode == 'edit') {
        self.customE.find('.custom-element').addClass('custom-element-edit');
        self.customE.find('.btn-move-custom-element, .btn-del-custom-element, .btn-to-front-custom-element, .ui-resizable-handle').show();
    }
    else {
        self.customE.find('.custom-element').removeClass('custom-element-edit');
        self.customE.find('.btn-move-custom-element, .btn-del-custom-element, .btn-to-front-custom-element, .ui-resizable-handle').hide();
    }
    if (self.data.type != 'area') { 
        if (self.isInCorrectPosition)
            self.customE.find('.custom-element').removeClass('custom-element-bad-position');
        else
            self.customE.find('.custom-element').addClass('custom-element-bad-position');
    }
};

CustomElement.prototype.bindings = function () {

    var self = this;
    
    self.customE.find('.custom-element').click(function(e){
        e.stopPropagation();
        if (self.pView.currentElementEditing) {
            self.pView.currentElementEditing.mode = 'draw';
        }
        self.mode = 'edit';
        self.pView.currentElementEditing = self;
        self.pView.updateViewAndCustomElements();
    });
    self.customE.find('.btn-to-front-custom-element').click(function (){
        self.bringToFrontCustomElement().done(function(){
            self.loadData().done(function() {
                self.pView.updateViewAndCustomElements();
            });
        });
    });
    self.customE.draggable({
        stop: function() {
            var newPosSizeData = {
                x: $(this).position().left, y: $(this).position().top,
                width: $(this).width(), height: $(this).height() 
            };
            self.updatePosSizeData(newPosSizeData).done(function() {
                self.loadData().done(function() {
                    self.pView.updateViewAndCustomElements();
                });
            });
        }
    });
    self.customE.resizable({
        resize: function () {
            self.customE.find('.custom-element').css({
                'width' : ($(this).width() - 30)+'px',
                'height' : ($(this).height() - 30)+'px',
            });
        },
        stop: function() {
            var newPosSizeData = {
                x: $(this).position().left, y: $(this).position().top,
                width: $(this).width(), height: $(this).height() 
            };
            self.updatePosSizeData(newPosSizeData).done(function() {
                self.loadData().done(function() {
                    self.pView.updateViewAndCustomElements();
                });
            });
        }
    });
    self.customE.find('.btn-del-custom-element').click(function() {
        self.delCustomElement(self.data.IDcusele).done(function(){
            // self.pView.updateViewAndCustomElements();
            self.pView.pPCustom.drawAndUpdateProductCustomizer(self.pView.pPCustom.currentViewId);
        });
    });
};

CustomElement.prototype.updatePosSizeData = function (newPosSizeData) {

    var self = this;
    self.pView.pPCustom.showMsg('LOG', 'Update Custom Element');
    return $.ajax({
        type: 'POST',
        url: self.pView.pPCustom.apiUrl + 'update-custom-element-pos-size&IDcusele=' + self.data.IDcusele,
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
};

CustomElement.prototype.delCustomElement = function (idCusele) {

    var self = this;
    self.pView.pPCustom.showMsg('LOG', 'Del Cutom Element: ' + idCusele);
    if (idCusele) {
        return $.ajax(self.pView.pPCustom.apiUrl + 'del-custom-element&IDcusele=' + idCusele)
        .done(function(response) {
            if (!response) {
                self.pView.pPCustom.showMsg('ERROR', 'Del Cutom Element: API response false');
            }
        })
        .fail(function() {
            self.pPCustom.showMsg('ERROR', 'API: Deleting custom elements');
        });
    }
    else { 
        self.showMsg('ERROR', 'Del CustomElement: No idCusele passed as param');
        return $.Deferred().reject();
    }
};

CustomElement.prototype.bringToFrontCustomElement = function () {

    var self = this;
    self.pView.pPCustom.showMsg('LOG', 'Bring to front Cutom Element: ' + self.data.IDcusele);
    return $.ajax(self.pView.pPCustom.apiUrl + 'update-custom-element-zindex&IDcusele=' + self.data.IDcusele + '&Zindex=' + self.pView.getHighestZindex())
    .done(function(response) {
        if (!response) {
            self.pView.pPCustom.showMsg('ERROR', 'Bring to front Cutom Element: API response false');
        }
    })
    .fail(function() {
        self.pPCustom.showMsg('ERROR', 'API: Bring to front custom element');
    });
};











function Area (view, id) {

    var self = this;
    CustomElement.call(self, view, id);
    self.pView.pPCustom.showMsg('LOG', 'Add Area id:' + self.id);
    self.customE = $('<div class="wrapper-custom-element">\
                        <div class="custom-element area"></div>\
                        <div class="btn-move-custom-element"></div>\
                        <div class="btn-del-custom-element"></div>\
                      </div>');
    self.pView.rootE.append(self.customE);
};
Area.prototype = Object.create(CustomElement.prototype);
Area.prototype.constructor = Area;

Area.prototype.draw = function() {

    var self = this;
    self.pView.pPCustom.showMsg('LOG', 'Drawing Area id: ' + self.data.IDcusele);
    CustomElement.prototype.draw.call(this);
    if (self.data.area_attr.shape == 'ellipse'){
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
};

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
};

Area.prototype.contains = function (element) {

    var self = this;
    var isContained = false;
    if (self.data.area_attr.shape == 'rectangle'){
        var a = {x:0, y:0, w: 0, h:0}, r = {x:0, y:0, w: 0, h:0};
        a.x = self.customE.position().left;     a.w = self.customE.width(); 
        a.y = self.customE.position().top;      a.h = self.customE.height();
        r.x = element.customE.position().left;  r.w = element.customE.width();
        r.y = element.customE.position().top;   r.h = element.customE.height();
        if ( ((r.x+r.w) < (a.x+a.w)) && (r.x > a.x) && (r.y > a.y) && ((r.y+r.h) < (a.y+a.h)) )
            isContained = true;
    }
    // if area.shape == ellipse 
    return isContained;
};











function Text(view, id) {

    var self = this;
    CustomElement.call(this, view, id);
    self.pView.pPCustom.showMsg('LOG', 'Add Text id:' + self.id);
    self.customE = $('<div class="wrapper-custom-element">\
                        <textarea class="custom-element text"></textarea>\
                        <div class="btn-move-custom-element"></div>\
                        <div class="btn-del-custom-element"></div>\
                        <div class="btn-to-front-custom-element"></div>\
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
};

Text.prototype.changeText = function (value){

    var self = this;
    self.data.text = value;
    self.updateData('text', {text: value});
};

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
};

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
};











function Svg(view, id) {

    var self = this;
    CustomElement.call(this, view, id);
    self.pView.pPCustom.showMsg('LOG', 'Add svg id:' + self.id);
    self.customE = $('<div class="wrapper-custom-element">\
                        <div class="custom-element svg">\
                            <img src="" />\
                        </div>\
                        <div class="btn-move-custom-element"></div>\
                        <div class="btn-del-custom-element"></div>\
                        <div class="btn-to-front-custom-element"></div>\
                      </div>');
    self.pView.rootE.append(self.customE);
};
Svg.prototype = Object.create(CustomElement.prototype);
Svg.prototype.constructor = Svg;

Svg.prototype.draw = function(){

    var self = this;
    self.pView.pPCustom.showMsg('LOG', 'Drawing Svg: ' + self.id);
    CustomElement.prototype.draw.call(this);

    if (self.data){
        self.customE.find('.svg img').attr("src", self.pView.pPCustom.svgUrl+self.data.Svg_file)
    }
};











function Img(view, id) {

    var self = this;
    CustomElement.call(this, view, id);
    self.pView.pPCustom.showMsg('LOG', 'Add img id:' + self.id);
    self.customE = $('<div class="wrapper-custom-element">\
                        <div class="custom-element img">\
                            <img src="" />\
                        </div>\
                        <div class="btn-move-custom-element"></div>\
                        <div class="btn-del-custom-element"></div>\
                        <div class="btn-to-front-custom-element"></div>\
                      </div>');
    self.pView.rootE.append(self.customE);
};
Img.prototype = Object.create(CustomElement.prototype);
Img.prototype.constructor = Img;

Img.prototype.draw = function(){

    var self = this;
    self.pView.pPCustom.showMsg('LOG', 'Drawing Img: ' + self.id);
    CustomElement.prototype.draw.call(this);

    if (self.data){
        self.customE.find('.img img').attr("src", self.pView.pPCustom.imgUrl+self.data.Img_file)
    }
};
