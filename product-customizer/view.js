View = function(productCustomizer, idView) {

    this.pPCustom = productCustomizer;
    this.idView = idView;
    this.image;
    this.customElements = [];

    this.loadView();
}

View.prototype.loadView = function() {

    var self = this;
    $.getJSON(this.pPCustom.apiUrl + 'get-view&IDvie=' + this.idView)
        .done(function(view) {
            self.image = view[0].Image;
            self.loadCustomElements();
        })
        .fail(function() {
            self.pPCustom.showMsg('Error', 'loading view');
        });
}

View.prototype.loadCustomElements = function() {

    var self = this;
    $.getJSON(this.pPCustom.apiUrl + 'get-custom-elements&IDvie=' + this.idView)
        .done(function(customElements) {
            for (var i = customElements.length - 1; i >= 0; i--) {
                self.createCustomElement(customElements[i]);
            };                
        })
        .fail(function() {
            self.pPCustom.showMsg('Error', 'loading custom elements');
        });
}

View.prototype.createCustomElement = function(customElementData) {

    var self = this;
    self.customElements.push(new CustomElement(self, customElementData));
}
