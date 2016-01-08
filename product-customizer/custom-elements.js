'use strict';

var CustomElement = function (view, id) {

    this.pView = view;
    this.customE = $();
    this.id = id;
    this.mode = 'draw';
    this.isInCorrectPosition;
    this.isInsidePrintableArea;
    this.isInsideNoPrintableArea;
    this.intersectsWithNoPrintableArea;
    this.data;
};

CustomElement.prototype.init = function () {

    var self = this;
    self.pView.pPCustom.showMsg('LOG', 'Init Custom Element: ' +self.id);
    return new Promise (function(resolve, reject) {
        self.loadData().done(function(){
            self.draw();
            self.bindings();
            resolve();
        });
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
        'width' : (self.data.width - 30)+'px',
        'height' : (self.data.height - 30)+'px',
    });
    if (self.mode == 'edit') {
        self.customE.find('.custom-element').addClass('custom-element-edit');
        self.customE.find('.btn-move-custom-element, .btn-del-custom-element, .btn-to-front-custom-element, .ui-resizable-handle').show();
    }
    else {
        self.customE.find('.custom-element').removeClass('custom-element-edit');
        self.customE.find('.btn-move-custom-element, .btn-del-custom-element, .btn-to-front-custom-element, .ui-resizable-handle').hide();
    }
    if (self.data.type != 'area' && self.isInCorrectPosition)
        self.customE.find('.custom-element').removeClass('custom-element-bad-position');
    if (self.data.type != 'area' && !self.isInCorrectPosition)
        self.customE.find('.custom-element').addClass('custom-element-bad-position');
};

CustomElement.prototype.bindings = function () {

    var self = this;
    
    self.customE.find('.custom-element').click(function(e){
        e.stopPropagation();
        self.editCustomElement();
        self.pView.updateViewAndCustomElements();
    });
    self.customE.draggable({
        stop: function() {
            var newPosSizeData = {
                x: $(this).position().left, y: $(this).position().top,
                width: $(this).width(), height: $(this).height() 
            };
            self.updatePosSizeData(newPosSizeData);
            self.pView.updateViewAndCustomElements();
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
            self.updatePosSizeData(newPosSizeData);
            self.pView.updateViewAndCustomElements();
        }
    });
    self.customE.find('.btn-del-custom-element').click(function() {
        self.delCustomElement(self.data.IDcusele).done(function(){
            self.pView.pPCustom.drawAndUpdateProductCustomizer(self.pView.pPCustom.currentViewId);
        });
    });
    self.customE.find('.btn-to-front-custom-element').click(function (){
        self.bringToFrontCustomElement();
        self.pView.updateViewAndCustomElements();
    });
};

CustomElement.prototype.editCustomElement = function (newPosSizeData) {

    var self = this;
    if (self.pView.currentElementEditing)
        self.pView.currentElementEditing.mode = 'draw';
    self.mode = 'edit';
    self.pView.currentElementEditing = self;
};

CustomElement.prototype.updatePosSizeData = function (newPosSizeData) {

    var self = this;
    self.pView.pPCustom.showMsg('LOG', 'Update Custom Element');
    self.data.x = newPosSizeData.x; self.data.y = newPosSizeData.y;
    self.data.width = newPosSizeData.width; self.data.height = newPosSizeData.height;
    $.ajax({
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
    var highestZindex = self.pView.getHighestZindex();
    self.data.Zindex = highestZindex;
    $.ajax(self.pView.pPCustom.apiUrl + 'update-custom-element-zindex&IDcusele=' + self.data.IDcusele + '&Zindex=' + highestZindex)
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
    self.pView.updateViewAndCustomElements();
};

Area.prototype.updateData = function (newData) {

    var self = this;
    $.ajax({
        type: 'POST',
        url: self.pView.pPCustom.apiUrl + 'update-area&IDcusele=' + self.data.IDcusele, 
        data: newData
    })
    .done(function(response) {
        if (!response) 
            self.pView.pPCustom.showMsg('ERROR', 'API: Update Area');
    });
};

Area.prototype.contains = function (element) {

    var self = this;
    var isContained = false;
    if (self.data.area_attr.shape == 'rectangle') {
        var a = {x:0, y:0, w: 0, h:0}, r = {x:0, y:0, w: 0, h:0};
        a.x = self.customE.position().left + 15;     a.w = self.customE.width() - 30; 
        a.y = self.customE.position().top + 15;      a.h = self.customE.height() - 30;
        r.x = element.customE.position().left + 15;  r.w = element.customE.width() - 30;
        r.y = element.customE.position().top + 15;   r.h = element.customE.height() - 30;
        if ( ((r.x+r.w) < (a.x+a.w)) && (r.x > a.x) && (r.y > a.y) && ((r.y+r.h) < (a.y+a.h)) )
            isContained = true;
    }
    if (self.data.area_attr.shape == 'ellipse') {
        var r = self.ellipseCalc(element);
        if (r[0] <= 1 && r[1] <= 1 && r[2] <= 1 && r[3] <= 1)
            isContained = true;
    }
    return isContained;
};

Area.prototype.intersects = function (element) {

    var self = this;
    var intersects = false;
    if (self.data.area_attr.shape == 'rectangle'){
        var a = {x1:0, x2:0, y1: 0, y2:0}, r = {x1:0, x2:0, y1: 0, y2:0};
        a.x1 = self.customE.position().left+15;    a.x2 = a.x1 + (self.customE.width()-30); 
        a.y1 = self.customE.position().top+15;     a.y2 = a.y1 + (self.customE.height()-30);
        r.x1 = element.customE.position().left+15; r.x2 = r.x1 + (element.customE.width()-30);
        r.y1 = element.customE.position().top+15;  r.y2 = r.y1 + (element.customE.height()-30);
        if (a.x1 < r.x2 && a.x2 > r.x1 && a.y1 < r.y2 && a.y2 > r.y1)
            intersects = true;
    }
    if (self.data.area_attr.shape == 'ellipse') {
        var r = self.ellipseCalc(element);
        if (r[0] <= 1 || r[1] <= 1 || r[2] <= 1 || r[3] <= 1)
            intersects = true;
    } 
    return intersects;
};

Area.prototype.ellipseCalc = function (element){

    var self = this;
    var x = [   element.customE.position().left+15,
                (element.customE.position().left+15) + (element.customE.width()-30),
                (element.customE.position().left+15) + (element.customE.width()-30),
                element.customE.position().left+15 ];
    var y = [   element.customE.position().top+15,
                element.customE.position().top+15,
                (element.customE.position().top+15) + (element.customE.height()-30), 
                (element.customE.position().top+15) + (element.customE.height()-30) ];
    var a = (self.customE.width()-30) / 2;
    var b = (self.customE.height()-30) / 2;
    var h = (self.customE.position().left+15) + a;
    var k = (self.customE.position().top+15) + b;
    var r = x.map(function(obj,i){
        return ( (Math.pow(x[i]-h,2)/Math.pow(a,2)) + (Math.pow(y[i]-k,2)/Math.pow(b,2)) );
    });
    return r;
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
    self.pView.updateViewAndCustomElements();
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
    self.pView.updateViewAndCustomElements();
};

Text.prototype.updateData = function (type, newData) {

    var self = this;
    $.ajax({
        type: 'POST',
        url: self.pView.pPCustom.apiUrl + 'update-' + type + '&IDcusele=' + self.data.IDcusele, 
        data: newData
    })
    .done(function(response) {
        if (!response)
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
