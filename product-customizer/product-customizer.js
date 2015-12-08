'use strict';

var ProductCustomizer = function () {

    this.idCustom;
    this.idProduct;
    this.isTemplate;
    this.rootE = $('#product-customizer');
    this.viewsIds = [];
    this.view;
    this.currentView;
    this.apiUrl = 'product-customizer/api/api.php?request=';
    this.mode = 'dev'; //[pro|dev]
}

ProductCustomizer.prototype.init = function () {
    
    var self = this;
    if (self.idCustom) {
        self.showMsg('LOG', 'Init Customization: ' + self.idCustom);
        self.getCustomizationData(self.idCustom);
        self.getViewsIds(self.idCustom)
            .done(function(){
                self.drawAndUpdateProductCustomizer('default');
            });
    }
    else { self.showMsg('ERROR', 'No id customization to init'); }
}

ProductCustomizer.prototype.getCustomizationData = function (idCustom) {

    var self = this;
    if (idCustom) {
        self.showMsg('LOG', 'Get Customization Data from customization: ' + idCustom);
        $.getJSON(this.apiUrl + 'get-custom&IDcus=' + idCustom)
        .done(function(customData) {
            self.idProduct = customData[0].ID_pro;
            self.isTemplate = customData[0].Is_Template;
        })
        .fail(function() {
            self.showMsg('ERROR', 'loading Customization Data');
        });
    }
    else { self.showMsg('ERROR', 'loading Customization Data No idCustom passed'); }
}

ProductCustomizer.prototype.getViewsIds = function (idCustom) {

    var self = this;
    if (idCustom) {
        self.showMsg('LOG', 'Get Views Ids from customization: ' + idCustom);
        return $.getJSON(this.apiUrl + 'get-views-ids&IDcus=' + idCustom)
        .done(function(views) {
            if (views && views.length > 0) {
                self.viewsIds = views;
            }
        })
        .fail(function() {
            self.showMsg('ERROR', 'Getting Views Ids from' + idCustom);
        });
    }
    else { 
        self.showMsg('ERROR', 'Get Views no idCustom');
        return $.Deferred().reject();
    }
}

ProductCustomizer.prototype.drawAndUpdateProductCustomizer = function (idView) {
    
    var self = this;
    if (self.viewsIds && self.viewsIds.length > 0 ) {
        if (idView == 'default') { 
            idView = self.viewsIds[0].IDcusvie;
        }
        self.drawView(idView);
        self.drawNavViews();
    }
    else { self.showMsg('INFO', 'Siusplau afegeix una vista'); }
    this.drawNavMain();
}

ProductCustomizer.prototype.drawView = function (idView) {

    var self = this;
    if (idView){
        self.showMsg('LOG', 'Drawing view: ' + idView);
        self.view = new View(self, idView);
        self.view.init();
    }
    else { self.showMsg('ERROR', 'Draw View: No idView passed as param'); }
}

ProductCustomizer.prototype.drawNavViews = function () {

    var self = this;
    self.showMsg('LOG', 'Drawing Navigation Views');
    $('#nav-views').empty();
    for (var i = 0; i < self.viewsIds.length; i++) {
        var a = $('<a>').data('idView', self.viewsIds[i].IDcusvie);
        var img = $('<img/>', { src:'product-customizer/thumb.png'} );
        var del = $('<a>del</a>').data('idView', self.viewsIds[i].IDcusvie);
        var li = $('<li>');
        a.click( function(){
            self.drawAndUpdateProductCustomizer($(this).data('idView'));
        });
        del.click( function(){
            self.delView($(this).data('idView'));
        });
        a.append(img);
        li.append(del, a)
        $('#nav-views').append(li);
    };
}

ProductCustomizer.prototype.drawNavMain = function() {

    var self = this;
    $('#nav-main').html('\
    <li id="btn-add-view">Afegir vista</li>\
    <li id="btn-add-area">Afegir area</li>\
    <li id="btn-add-text">Afegir text</li>\
    <li id="btn-add-image">Afegir imatge</li>\
    <li id="btn-add-svg">Afegir la teva imatge</li>\
    <li id="btn-reset">Reset</li>');
    $('#btn-add-view').click(   function (){ self.addView(); });
    $('#btn-add-area').click(   function (){ self.btnAddCustomElement('area'); });
    $('#btn-add-text').click(   function (){ self.btnAddCustomElement('text'); });
    $('#btn-add-image').click(  function (){ self.btnAddCustomElement('img'); });
    $('#btn-add-svg').click(    function (){ self.btnAddCustomElement('svg'); });
    self.checkNavMain();
}

ProductCustomizer.prototype.checkNavMain = function() {

    var self = this;
    if (self.viewsIds.length == 0){
        $('#btn-add-area, #btn-add-text, #btn-add-image, #btn-add-svg, #btn-reset').addClass('disabled').unbind('click');
    }
}

ProductCustomizer.prototype.addView = function () {

    //TODO CHEK IF idView is null that means that we havent load from to DB    
    var self = this;
    self.showMsg('LOG', 'Adding view');
    // First we create de view in DB ant then we call to loadView
    // self.getViewsIds(self.idCustom)
    //         .done(function(){
    //             self.drawAndUpdateProductCustomizer('default');
    //         });
}

ProductCustomizer.prototype.delView = function (idView) {

    var self = this;
    self.showMsg('LOG', 'Deleting view: '+idView);
    // Del view from DB
    // self.getViewsIds(self.idCustom)
    //         .done(function(){
    //             self.drawAndUpdateProductCustomizer('default');
    //         });
}

ProductCustomizer.prototype.btnAddCustomElement = function(type) {

    var self = this;
    self.showMsg('LOG', 'Adding custom element' + type);
}

ProductCustomizer.prototype.showMsg = function(type, msg) {

    var self = this;
    if (self.mode == 'dev')
        console.log(type + ' -> ' + msg);
    if (type != 'LOG')
        self.showModal(type, msg);
};

ProductCustomizer.prototype.showModal = function(type, msg) {

    var self = this;
    $('.overlay').css('display', 'block');
    $('.modal p').html(msg);
    $('.modal a').bind('click', function(){
        self.closeModal();
    });
};

ProductCustomizer.prototype.closeModal = function() {

    $('.overlay').css('display', 'none');
};
