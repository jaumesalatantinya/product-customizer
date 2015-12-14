'use strict';

var View = function (productCustomizer, idView) {

    this.pPCustom = productCustomizer;
    this.rootE = $('#view');
    this.idView = idView;
    this.image;
    this.customElements = [];
}


View.prototype.init = function () {

    var self = this;
    self.pPCustom.showMsg('LOG', 'Init View: ' + self.idView);
    self.loadViewData(self.idView)
        .done(function() {
            self.drawAndUpdateView();
        });   
}


View.prototype.loadViewData = function (idView) {

    var self = this;
    self.pPCustom.showMsg('LOG', 'Load View Data: ' + self.idView);
    return $.getJSON(this.pPCustom.apiUrl + 'get-view&IDvie=' + this.idView)
    .done(function(view) {
        self.image = view[0].Image;
    })
    .fail(function() {
        self.pPCustom.showMsg('Error', 'loading view');
    });
}


View.prototype.drawAndUpdateView = function () {

    var self = this;
    if (self.view) { 
        self.rootE.empty();
    }
    self.rootE.css('background-image', 'url('+self.pPCustom.imgUrl+self.image+')');
    self.loadCustomElements(self.idView);
}


View.prototype.loadCustomElements = function (idView) {

    var self = this;
    self.pPCustom.showMsg('LOG', 'Loading Custom Elements of view: ' + idView );
    $.getJSON(this.pPCustom.apiUrl + 'get-custom-elements&IDvie=' + idView)
    .done(function(customElements) {
        for (var i = customElements.length - 1; i >= 0; i--) {
            self.loadCustomElement(customElements[i]);
        };
    })
    .fail(function() {
        self.pPCustom.showMsg('ERROR', 'API: Load custom elements');
    });
}


View.prototype.loadCustomElement = function (customElementData) {

    var self = this;
    self.pPCustom.showMsg('LOG', 'Load Custom Element: ' + customElementData.type );
    switch (customElementData.type) {
    case 'area':
        self.customElements.push(new Area(self, customElementData));
        break;
    case 'text':
        self.customElements.push(new Text(self, customElementData));
        break;
    }
    self.customElements[self.customElements.length-1].draw();
}


// View.prototype.addCustomElement = function() {

//     var self = this;
//     // FRIST get ID from DB
//     // Call loadCustomElement
    
// }
