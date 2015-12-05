View = function (productCustomizer, idView) {

	this.pCustom = productCustomizer;
	this.id = idView;
	this.image;
    this.areas = [];
    this.customElements = [];

    this.loadView();
}

View.prototype.loadView = function (){

	var self = this;
	$.getJSON(this.pCustom.apiUrl+'get-view&IDcus='+this.idCus)
        .done(function(data) {
            self.idCus = data[0].IDcus;
        })
        .fail( function() {
            self.pCustom.showMsg('Yes');
        });
}

View.prototype.loadAreas = function (idCus) {

    var self = this;
}

View.prototype.createArea = function () {

}

View.prototype.loadCustomElements = function () {

}

View.prototype.createCustomElement = function () {

}
