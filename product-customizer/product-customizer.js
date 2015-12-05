//import {Area} from './area';

ProductCustomizer = function() {

    var self = this;
    this.rootE = $('#product-customizer');
    this.idCus;
    this.views = [];
    this.currentView = 0;
    this.apiUrl = 'product-customizer/api/api.php?request=';

    this.loadCustomization()
        // .done(self.loadViews());
    this.bindings();
}

ProductCustomizer.prototype.loadCustomization = function() {

    var self = this;
    return $.getJSON(this.apiUrl + 'get-custom&IDpro=1')
        .done(function(custom) {
            self.idCus = custom[0].IDcus;
            self.loadViews();
        })
        .fail(function() {
            self.showMsg('Error', 'loading Customization Data');
        });
}

ProductCustomizer.prototype.loadViews = function() {

    var self = this;
    $.getJSON(this.apiUrl + 'get-views-ids&IDcus=' + this.idCus)
        .done(function(views) {
            if (views && views.length > 0) {
                for (var i = views.length - 1; i >= 0; i--) {
                    self.createView(views[i].IDcusvie);
                };
            } else {
                // TODO REQUEST USER TO ADD VIEW
                self.showMsg('Warn', 'Please first add a view');
            }
        })
        .fail(function() {
            self.showMsg('Error', 'loading Views');
        });
}
ProductCustomizer.prototype.createView = function(idView) {

    //TODO CHEK IF idView is null that means that we have request to DB
    self.views.push(new View(self, idView));
}

ProductCustomizer.prototype.renderView = function() {

}

ProductCustomizer.prototype.bindings = function() {

    var self = this;
    $('#add-text-btn').click(self.addCustomElement('text'));
    $('#add-image-btn').click(self.addCustomElement('img'));
    $('#add-svg-btn').click(self.addCustomElement('svg'));
}

ProductCustomizer.prototype.addCustomElement = function(type) {

    var self = this;
}

ProductCustomizer.prototype.showMsg = function(type, msg) {

    // TODO showMsgModal with msgError
    console.log(type + ' ' + msg)
}




















// ProductCustomizer.prototype.addText = function() {

//     var self = this;
//     // TODO check is AREA is initalized
//     //appendText
// }

// ProductCustomizer.prototype.addImage = function() {

//     var self = this;
//     // TODO check is AREA is initalized
//     //appendImage
// }

// ProductCustomizer.prototype.addSvg = function() {

//     var self = this;
//     // TODO check is AREA is initalized
//     //appendImage
// }
