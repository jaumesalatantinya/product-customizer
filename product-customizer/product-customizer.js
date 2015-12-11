'use strict';


var ProductCustomizer = function () {

    this.idCustom;
    this.idProduct;
    this.isTemplate;
    this.rootE = $('#product-customizer');
    this.viewsData = [];
    this.view;
    this.currentView;
    this.apiUrl = 'product-customizer/api/api.php?request=';
    this.imgUrl = 'http://www.sellosyrotulos.com/img/custom/';
    this.mode = 'dev'; //[pro|dev]
}


ProductCustomizer.prototype.init = function () {
    
    var self = this;
    if (self.idCustom) {
        self.showMsg('LOG', 'Init Customization: ' + self.idCustom);
        self.getCustomizationData(self.idCustom);
        self.drawAndUpdateProductCustomizer('default');
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


ProductCustomizer.prototype.drawAndUpdateProductCustomizer = function (idView) {
    
    var self = this;
    self.getviewsData(self.idCustom)
        .done(function(){
            if (self.viewsData && self.viewsData.length > 0 ) {
                if (idView == 'default') { 
                    idView = self.viewsData[0].IDcusvie;
                }
                else{
                    self.currentView = idView;
                }
                self.drawView(idView);
            }
            else { self.showMsg('INFO', 'Por favor añade una vista'); }
            self.drawNavViews();
            self.drawNavMain();
        })
}


ProductCustomizer.prototype.getviewsData = function (idCustom) {

    var self = this;
    if (idCustom) {
        self.showMsg('LOG', 'Get Views Ids from customization: ' + idCustom);
        self.viewsData = [];
        return $.getJSON(this.apiUrl + 'get-views&IDcus=' + idCustom)
        .done(function(views) {
            if (views && views.length > 0) {
                self.viewsData = views;
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
    for (var i = 0; i < self.viewsData.length; i++) {
        var a = $('<a>').data('idView', self.viewsData[i].IDcusvie);
        var img = $('<img/>', { 'src': self.imgUrl+self.viewsData[i].Image} );
        var del = $('<a>del</a>').data('idView', self.viewsData[i].IDcusvie);
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
    <li id="btn-add-view">Añadir vista</li>\
    <li id="btn-add-view-img">Añadir o modificar imagen vista</li>\
    <li id="btn-add-area">Añadir area</li>\
    <li id="btn-add-text">Añadir text</li>\
    <li id="btn-add-image">Añadir imatge</li>\
    <li id="btn-add-svg">Añadir tu imagen</li>\
    <li id="btn-reset">Reset</li>');
    $('#btn-add-view').click(       function (){ self.addView(); });
    $('#btn-add-view-img').click(   function (){ self.showUploadForm('view'); });
    $('#btn-add-area').click(       function (){ self.btnAddCustomElement('area'); });
    $('#btn-add-text').click(       function (){ self.btnAddCustomElement('text'); });
    $('#btn-add-image').click(      function (){ self.btnAddCustomElement('img'); });
    $('#btn-add-svg').click(        function (){ self.btnAddCustomElement('svg'); });
    if (self.viewsData.length == 0){
        $('#btn-add-area, #btn-add-text, #btn-add-image, #btn-add-svg, #btn-reset, #btn-add-view-img').addClass('disabled').unbind('click');
    }
}


ProductCustomizer.prototype.addView = function () {

    var self = this;
    self.showMsg('LOG', 'Adding view');
    if (self.idCustom) {
        $.getJSON(this.apiUrl + 'put-view&IDcus=' + self.idCustom)
        .done(function(newViewId) {
            if (newViewId) {
                self.drawAndUpdateProductCustomizer(newViewId);
            }
            else { self.showMsg('ERROR', 'Add View: No new idView'); }
        })
        .fail(function() {
            self.showMsg('ERROR', 'API Add View: getting View ID');
        });
    }
    else { self.showMsg('ERROR', 'Add View no idCustom'); }
}

ProductCustomizer.prototype.delView = function (idView) {

    var self = this;
    self.showMsg('LOG', 'Deleting view: '+idView);
    if (idView) {
        $.getJSON(this.apiUrl + 'del-view&IDvie=' + idView)
        .done(function(delresponse) {
            if (delresponse) {
                self.view.rootE.empty();
                self.view.rootE.css('background-image', 'none');
                self.drawAndUpdateProductCustomizer('default');
            }
            else { self.showMsg('ERROR', 'Add View: No new idView'); }
        })
        .fail(function() {
            self.showMsg('ERROR', 'API Del View');
        });
    }
    else { self.showMsg('ERROR', 'Del View: No idView passed as param to delete'); }
}


ProductCustomizer.prototype.btnAddCustomElement = function(type) {

    var self = this;
    self.showMsg('LOG', 'Adding custom element' + type);
}


ProductCustomizer.prototype.showUploadForm = function (type) {

    var self = this;
    self.showMsg('LOG', 'Show upload form');
    $('#wrapper-upload-form').show();
    $('#wrapper-upload-form .modal .btn-close').click( function() {
        self.close('upload-form');
    });
    $('#wrapper-upload-form .modal form #btn-submit').click( function(event) {
        event.preventDefault();
        $('#wrapper-upload-form .modal form img.loading').show();
        self.uploadFile(type);
    });
}

ProductCustomizer.prototype.uploadFile = function (type){

    var self = this;
    self.showMsg('LOG', 'Uploading '+ type +' file image');
    var fd = new FormData();    
    fd.append('file-to-upload', document.getElementById('file-to-upload').files[0]);
    $.ajax({
        url: 'product-customizer/file-uploader.php',
        data: fd,
        processData: false,
        contentType: false,
        type: 'POST',
        success: function(response){
            $('#wrapper-upload-form .modal form img.loading').hide();
            if (response.status == 'success'){ 
                self.putImgToView(response.file);
            }
            else{
                self.showMsg('ERROR', response.error);
            }
        }
    });
}

ProductCustomizer.prototype.putImgToView = function (file) {

    var self = this;
    $.getJSON(this.apiUrl + 'put-img-to-view&IDvie=' + self.currentView + '&file='+file)
    .done(function(response) {
        if (response) {
            $('#wrapper-upload-form').hide();
            self.drawAndUpdateProductCustomizer(self.currentView);
        }
        else { self.showMsg('ERROR', 'Put Img View: No new idView'); }
    })
    .fail(function() {
        self.showMsg('ERROR', 'API Put Img View');
    });
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
    $('#wrapper-modal').css('display', 'block');
    $('.modal p').html(msg);
    $('.modal a').click( function() {
        self.close('modal');
    });
};


ProductCustomizer.prototype.close = function(element) {

    $('#wrapper-'+element).css('display', 'none');
};
