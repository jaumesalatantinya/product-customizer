//import {Area} from './area';

ProductCustomizer = function() {

    var self = this;
    this.rootE = $('#product-customizer');
    this.idCus;
    this.views = [];
    this.currentView = 0;
    this.apiUrl = 'product-customizer/api/api.php?request=';
    this.isAdmin = true;

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
    var self = this;
    self.views.push(new View(self, idView));
    //TODO append view to navigation view
}

ProductCustomizer.prototype.drawView = function() {

}

ProductCustomizer.prototype.bindings = function() {

    var self = this;
    $('#add-text-btn').click(self.btnAddCustomElement('text'));
    $('#add-image-btn').click(self.btnAddCustomElement('img'));
    $('#add-svg-btn').click(self.btnAddCustomElement('svg'));
}

ProductCustomizer.prototype.btnAddCustomElement = function(type) {

    var self = this;
}

ProductCustomizer.prototype.showMsg = function(type, msg) {

    // TODO show modal warrning or error
    console.log(type + ' ' + msg)
}
