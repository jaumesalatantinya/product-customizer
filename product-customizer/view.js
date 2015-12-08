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
    // if (self.view) { 
    //     self.view.rootE.empty(); 
    // }
    //     self.view.loadViewData()
    //     .done(function() {
    // self.view.loadCustomElements();
    //     });   
}

// View.prototype.loadViewData = function () {

//     var self = this;
//     return $.getJSON(this.pPCustom.apiUrl + 'get-view&IDvie=' + this.idView)
//     .done(function(view) {
//         self.image = view[0].Image;
//     })
//     .fail(function() {
//         self.pPCustom.showMsg('Error', 'loading view');
//     });
// }

// View.prototype.loadCustomElements = function () {

//     var self = this;
//     self.pPCustom.showMsg('INFO', 'Loading Custom Elements of view: ' + self.idView );
//     $.getJSON(this.pPCustom.apiUrl + 'get-custom-elements&IDvie=' + self.idView)
//     .done(function(customElements) {
//         for (var i = customElements.length - 1; i >= 0; i--) {
//             self.loadCustomElement(customElements[i]);
//         };
//     })
//     .fail(function() {
//         self.pPCustom.showMsg('Error', 'loading custom elements');
//     });
// }

// View.prototype.loadCustomElement = function (customElementData) {

//     var self = this;
//     self.pPCustom.showMsg('INFO', 'Loading Custom Element: ' + customElementData.type );
//     switch (customElementData.type) {
//     case 'area':
//         self.customElements.push(new Area(self, customElementData));
//         break;
//     case 'text':
//         self.customElements.push(new Text(self, customElementData));
//         break;
//     }
//     self.customElements[self.customElements.length-1].draw();
// }

// View.prototype.addCustomElement = function() {

//     var self = this;
//     // FRIST get ID from DB
//     // Call loadCustomElement
    
// }
