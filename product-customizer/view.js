'use strict';

var View = function () {

    this.pPCustom;
    this.rootE = $('#view');
    this.idView;
    this.image;
    this.customElements = [];
}


View.prototype.init = function (productCustomizer, idView) {

    var self = this;
    self.pPCustom = productCustomizer;
    self.idView = idView;
    self.pPCustom.showMsg('LOG', 'Init View: ' + self.idView);
    self.loadViewData(self.idView)
        .done(function() {
            self.drawView();
            self.loadCustomElementsData(self.idView)
                .done(function(){
                    self.initCustomElements();
                })
        });
}


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
}


View.prototype.drawView = function () {

    var self = this;
    self.rootE.empty();
    self.rootE.css('background-image', 'url('+self.pPCustom.imgUrl+self.image+')');
}


View.prototype.loadCustomElementsData = function (idView) {

    var self = this;
    self.pPCustom.showMsg('LOG', 'Loading Custom Elements Data of view: ' + idView );
    return $.ajax(self.pPCustom.apiUrl + 'get-custom-elements&IDvie=' + idView)
    .done(function(customElementsData) {
        for (var i = 0; i < customElementsData.length; i++) {
            self.addCustomElement(customElementsData[i]);
        };
    })
    .fail(function() {
        self.pPCustom.showMsg('ERROR', 'API: Load custom elements data');
    });
}


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
    }
}


View.prototype.initCustomElements = function () {

    var self = this;
    for (var i = 0; i < self.customElements.length; i++) {
        self.customElements[i].init();
    };
}
