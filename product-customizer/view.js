'use strict';

var View = function () {

    this.pPCustom;
    this.rootE = $('#view');
    this.idView;
    this.image;
    this.customElements = [];
    this.currentElementEditing;
};


View.prototype.init = function (productCustomizer, idView) {

    var self = this;
    self.pPCustom = productCustomizer;
    self.idView = idView;
    self.pPCustom.showMsg('LOG', 'Init View: ' + self.idView);
    self.loadViewData(self.idView)
        .done(function() {
            self.drawView();
            self.bindingsView();
            self.loadCustomElementsData(self.idView)
                .done(function(){
                    self.initCustomElements()
                        .then(function(){
                            self.updateViewAndCustomElements();
                        });
                });
        });
};


View.prototype.loadViewData = function (idView) {

    var self = this;
    if (idView){
        self.pPCustom.showMsg('LOG', 'Load View Data: ' + self.idView);
        return $.ajax(this.pPCustom.apiUrl + 'get-view&IDvie=' + this.idView)
        .done(function(view) {
            self.image = view[0].Image;
        })
        .fail(function() {
            self.pPCustom.showMsg('Error', 'loading view');
        });
    }
    else{
        self.pPCustom.showMsg('ERROR', 'Load View Data no idView');
        return $.Deferred().reject();
    }
};


View.prototype.drawView = function () {

    var self = this;
    self.rootE.empty();
    self.rootE.css({
        'background-image': 'url('+self.pPCustom.imgUrl+self.image+')',
        'height': self.pPCustom.height+'px'
    });
};


View.prototype.bindingsView = function () {

    var self = this;
    $('#wrapper-view').click(function(){
        if (self.currentElementEditing) {
            self.currentElementEditing.mode = 'draw';
        }
        self.currentElementEditing = undefined;
        self.updateViewAndCustomElements();
    });
};


View.prototype.loadCustomElementsData = function (idView) {

    var self = this;
    self.pPCustom.showMsg('LOG', 'Loading Custom Elements Data of view: ' + idView );
    return $.ajax(self.pPCustom.apiUrl + 'get-custom-elements&IDvie=' + idView)
    .done(function(customElementsData) {
        for (var i = 0; i < customElementsData.length; i++) {
            self.addCustomElement(customElementsData[i]);
        }
    })
    .fail(function() {
        self.pPCustom.showMsg('ERROR', 'API: Load custom elements data');
    });
};


View.prototype.addCustomElement = function(customElementData) {

    var self = this;
    self.pPCustom.showMsg('LOG', 'Add Custom Element: ' + customElementData.type );
    switch (customElementData.type) {
    case 'area':
        self.customElements.push(new Area(self, customElementData.IDcusele));
        break;
    case 'text':
        self.customElements.push(new Text(self, customElementData.IDcusele));
        break;
    case 'svg':
        self.customElements.push(new Svg(self, customElementData.IDcusele));
        break;
    case 'img':
        self.customElements.push(new Img(self, customElementData.IDcusele));
        break;
    }
};


View.prototype.initCustomElements = function () {

    var self = this;
    var promises = [];
    return new Promise (function (resolve, reject) {
        for (var i = 0; i < self.customElements.length; i++) {
            promises.push(self.customElements[i].init());
        }
        Promise.all(promises).then(function(promise){
            resolve();
        });
    });
};


View.prototype.updateViewAndCustomElements = function() {

    var self = this;
    self.manageCollisions();
    self.drawCustomElements();
    self.manageAuxMenu();
    self.manageToastAndBtnAddToCart();
};


View.prototype.manageCollisions = function() {

    var self = this;
    for (var i = 0; i < self.customElements.length; i++) {
        self.customElements[i].isInCorrectPosition = false;
        self.customElements[i].isInsidePrintableArea = false;
        self.customElements[i].isInsideNoPrintableArea = false;
        self.customElements[i].intersectsWithNoPrintableArea = false;
    }
    self.customElements.forEach(function(area) {
        if (area.data.type === 'area' && area.data.area_attr.detectcol === 'true'){
            self.customElements.forEach(function(element) {
                if (element.data.type !== 'area'){
                    if (area.data.area_attr.printable === 'true') {
                        if (area.contains(element)) {
                            element.isInsidePrintableArea = true;
                        }
                    }
                    if (area.data.area_attr.printable === 'false') {
                        if (area.contains(element)) {
                            element.isInsideNoPrintableArea = true;
                        }
                        if (area.intersects(element)) {
                            element.intersectsWithNoPrintableArea = true;
                        }
                    }
                }
            });
        }
    });
    for (i = 0; i < self.customElements.length; i++) {
        if (self.customElements[i].data.type !== 'area') {
            if (self.customElements[i].isInsidePrintableArea) {
                self.customElements[i].isInCorrectPosition = true;
            }
            if (!self.customElements[i].isInsidePrintableArea && !self.customElements[i].isInsideNoPrintableArea) {
                self.customElements[i].isInCorrectPosition = false;
            }
            if (self.customElements[i].isInsideNoPrintableArea || self.customElements[i].intersectsWithNoPrintableArea) {
                self.customElements[i].isInCorrectPosition = false;
            }
        }
    }
    if (self.areAllAreasDetectColDisabled()) {
        for (i = 0; i < self.customElements.length; i++) {
            if (self.customElements[i].data.type !== 'area') {
                self.customElements[i].isInCorrectPosition = true;
            }
        }
    }
};

View.prototype.areAllAreasDetectColDisabled = function () {

    var self = this;
    var bool = false;
    var numTotalAreas = 0;
    var numAreasDetecColDisabled = 0;

    for (var i = 0; i < self.customElements.length; i++) {
        if (self.customElements[i].data.type === 'area'){
            numTotalAreas++;
            if (self.customElements[i].data.area_attr.detectcol === 'false') {
                numAreasDetecColDisabled++;
            }
        }
    }

    if (numTotalAreas === numAreasDetecColDisabled && numTotalAreas > 0) {
        bool = true;
    }

    return bool;
};


View.prototype.drawCustomElements = function() {

    var self = this;
    for (var i = 0; i < self.customElements.length; i++) {
        self.customElements[i].draw();
    }
};


View.prototype.manageAuxMenu = function() {

    var self = this;
    if (self.currentElementEditing) {
        self.showAndLoadAuxMenu(self.currentElementEditing);
    }
    else {
        $('#aux-menu').hide();
    }
};


View.prototype.manageToastAndBtnAddToCart = function() {

    var self = this;
    $('#toast').hide();
    $('#btn-add-to-cart').show();
    var showToast = false;
    for (var i = 0; i < self.customElements.length; i++) {
        if (self.customElements[i].data.type !== 'area' && !self.customElements[i].isInCorrectPosition) {
            showToast = true;
        }
    }
    if (showToast){        
        $('#toast').show();
        $('#btn-add-to-cart').hide();
        $('#toast').html('El diseño está fuera de la área de impresión');
        $('#saved').hide();
    }
    if (self.pPCustom.env === 'webmaster') {
        $('#btn-add-to-cart').hide();
    }
    if (self.pPCustom.hideAddToCart === 'true'){
        $('#btn-add-to-cart').hide();
    }
};


View.prototype.showAndLoadAuxMenu = function(customElementEditing) {

    var self = this;
    if (customElementEditing.data.type === 'area' || customElementEditing.data.type === 'text') {
        $('#aux-menu').show();
        $('#aux-menu').load('product-customizer/aux-menu-'+customElementEditing.data.type+'.html', function() {
            if (customElementEditing.data.type === 'area') {
                $('#aux-menu').css('width', '760px');
                $('#btn-rectangle').click(     function (){ customElementEditing.changeAttr('shape', 'rectangle'); });
                $('#btn-circle').click(        function (){ customElementEditing.changeAttr('shape', 'ellipse');   });
                $('#btn-printable').click(     function (){ customElementEditing.changeAttr('printable', 'true');  });
                $('#btn-no-printable').click(  function (){ customElementEditing.changeAttr('printable', 'false'); });
                $('#btn-detect-col').click(    function (){ customElementEditing.changeAttr('detectcol', 'true');  });
                $('#btn-no-detect-col').click( function (){ customElementEditing.changeAttr('detectcol', 'false'); });
                $('#btn-visible').click(       function (){ customElementEditing.changeAttr('visible', 'true');    });
                $('#btn-no-visible').click(    function (){ customElementEditing.changeAttr('visible', 'false');   });
                $('#btn-change-size').click(   function (){ customElementEditing.changeSize($('#inp-width').val(), $('#inp-height').val()); });
            }
            if (customElementEditing.data.type === 'text'){
                $('#aux-menu').css('width', '680px');
                $('#btn-toggle-weight').click( function (){ customElementEditing.changeAttr('weight', 'toggle');    });
                $('#btn-toggle-style').click(  function (){ customElementEditing.changeAttr('style', 'toggle');     });
                $('#btn-align-l').click(       function (){ customElementEditing.changeAttr('align', 'left');       });
                $('#btn-align-c').click(       function (){ customElementEditing.changeAttr('align', 'center');     });
                $('#btn-align-r').click(       function (){ customElementEditing.changeAttr('align', 'right');      });
                $('#inp-size').change(         function (){ customElementEditing.changeAttr('size', $(this).val()); });
                $('.cp-alt').colorpicker({     altField: '.cp-alt-target', ok: function(event, color) { customElementEditing.changeAttr('color', color.formatted); }});
                if (!self.pPCustom.isMulticolor()) {
                    $('.cp-alt-target, .cp-alt').hide();
                }
                self.loadAuxMenuTextData(customElementEditing);
            }
            self.manageAuxMenuButtons(customElementEditing);
        });
    }
};


View.prototype.loadAuxMenuTextData = function(customElementTextEditing) {

    var self = this;
    var text_attr = customElementTextEditing.data.text_attr;
    $('#inp-size').val(text_attr.size);
    $('.cp-alt').val(text_attr.color);
    $('.cp-alt-target').css('background-color', '#'+text_attr.color);
    self.populateFontsToSelector(text_attr.family);
};


View.prototype.populateFontsToSelector = function(currentFont) {

    var self = this;
    if (self.pPCustom.fonts.length > 0){
        self.pPCustom.fonts.forEach(function(val) {
            var option = $('<option></option>');
            option.attr('value',val.Font);
            option.text(val.Font);
            if (currentFont === val.Font) {
                option.attr('selected', 'selected');
            }
            $('#sel-family').append(option);
        });
        $('#sel-family').selectmenu({
            change: function(event, data) {
                self.currentElementEditing.changeAttr('family', data.item.value);
            },
            open: function() {
                $('#sel-family-menu').find('li').each(function(i) {
                    $(this).css('font-family', self.pPCustom.fonts[i].Font);
                });
            }
        });    
    }
    else { self.pPCustom.showMsg('ERROR', 'Populate Fonts to font selector: No fonts loaded'); }
};


View.prototype.manageAuxMenuButtons = function (customElementEditing){

    var self = this;
    if (customElementEditing.data.type === 'text'){
        var text_attr = customElementEditing.data.text_attr;
        $('#btn-toggle-weight #btn-toggle-style #btn-align-l #btn-align-m #btn-align-r').removeClass('active');
        if (text_attr.weight === 'bold')   { $('#btn-toggle-weight').addClass('active'); }
        if (text_attr.style === 'italic')  { $('#btn-toggle-style').addClass('active');  }
        if (text_attr.align === 'left')    { $('#btn-align-l').addClass('active');       }
        if (text_attr.align === 'center')  { $('#btn-align-c').addClass('active');       }
        if (text_attr.align === 'right')   { $('#btn-align-r').addClass('active');       }
    }
    if (customElementEditing.data.type === 'area'){
        var area_attr = customElementEditing.data.area_attr;
        $('#btn-rectangle, #btn-circle, #btn-printable, #btn-no-printable, #btn-detect-col, #btn-no-detect-col, #btn-visible').removeClass('active');
        if (area_attr.shape === 'rectangle') { $('#btn-rectangle').addClass('active');     }
        if (area_attr.shape === 'ellipse')   { $('#btn-circle').addClass('active');        }
        if (area_attr.printable === 'true')  { $('#btn-printable').addClass('active');     }
        if (area_attr.printable === 'false') { $('#btn-no-printable').addClass('active');  }
        if (area_attr.detectcol === 'true')  { $('#btn-detect-col').addClass('active');    }
        if (area_attr.detectcol === 'false') { $('#btn-no-detect-col').addClass('active'); }
        if (area_attr.visible === 'true')    { $('#btn-visible').addClass('active');       }
        if (area_attr.visible === 'false')   { $('#btn-no-visible').addClass('active');    }
    }
};


View.prototype.getHighestZindex = function() {

    var self = this;
    var highestZIndex = 0;
    for (var i = 0; i < self.customElements.length; i++) {
        if (self.customElements[i].data.Zindex > highestZIndex){
            highestZIndex = self.customElements[i].data.Zindex;
        }
    }
    return parseInt(highestZIndex) + 1;
};


View.prototype.resetView = function() {

    var self = this;
    self.pPCustom.showMsg('LOG', 'Reset View');
    self.rootE.empty();
    self.rootE.css('background-image', 'none');
    self.currentElementEditing = undefined;
    self.manageAuxMenu();
    $('#toast').hide();
};
