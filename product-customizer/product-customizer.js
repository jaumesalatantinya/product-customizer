'use strict';


var ProductCustomizer = function () {

    this.idCustom;
    this.idPro;
    this.idProvar;
    this.idCart;
    this.idProType;
    this.idClient;
    this.borderColor;
    this.colors = [];
    this.idColor;
    this.isTemplate;
    this.height;
    this.rootE = $('#product-customizer');
    this.viewsData = [];
    this.view;
    this.env; // [webmaster|front]
    this.currentViewId;
    this.apiUrl = 'product-customizer/api/api.php?request=';
    this.imgUrl = 'http://www.sellosyrotulos.com/img/custom/';
    this.svgUrl = 'http://www.sellosyrotulos.com/img/customSVG/';
    this.fonts = [];
    this.svgs = [];
    this.mode = 'dev'; //[pro|dev]
    this.showingAutoSaved = false;
    this.hideAddToCart;
};


ProductCustomizer.prototype.init = function () {
    
    var self = this;
    if (self.idCustom) {
        self.showMsg('LOG', 'Init Customization: ' + self.idCustom);
        self.getCustomizationData(self.idCustom).done(function (){
            self.getProductData(self.idPro).done(function (){
                self.getColors().done(function() {
                    self.setBorderColor(self.borderColor);
                    self.loadFonts();
                    self.loadSvgs();
                    self.drawAndUpdateProductCustomizer('default');
                });
            });
        });
    }
    else { self.showMsg('ERROR', 'No id customization to init'); }    
};


ProductCustomizer.prototype.getCustomizationData = function (idCustom) {

    var self = this;
    if (idCustom) {
        self.showMsg('LOG', 'Get Customization Data from customization: ' + idCustom);
        return $.ajax(self.apiUrl + 'get-custom&IDcus=' + idCustom)
        .done(function(customData) {
            if (customData) {
                self.idPro = customData[0].ID_pro;
                self.isTemplate = customData[0].Is_Template;
                self.idColor = customData[0].ID_procol;
                self.height = customData[0].Height;
            }
            else { self.showMsg('ERROR', 'No data for custom:' + idCustom); }
        })
        .fail(function() {
            self.showMsg('ERROR', 'loading Customization Data');
        });
    }
    else { 
        self.showMsg('ERROR', 'loading Customization Data No idCustom passed');
        return $.Deferred().reject();
    }
};


ProductCustomizer.prototype.getProductData = function (idPro) {

    var self = this;
    if (idPro) {
        self.showMsg('LOG', 'Get Product Data from: ' + idPro);
        return $.ajax(self.apiUrl + 'get-product&IDpro=' + idPro)
        .done(function(proData) {
            if (proData) {
                self.idProType = proData[0].ID_protip;
                self.borderColor = proData[0].Colorea;
            }
            else {
                self.showMsg('ERROR', 'API: Getting Product Data return empty');
            }
        })
        .fail(function() {
            self.showMsg('ERROR', 'API: Getting Product Data');
        });
    }
    else { 
        self.showMsg('ERROR', 'Getting Product No idPro passed');
        return $.Deferred().reject();
    }
};


ProductCustomizer.prototype.setBorderColor = function (borderColor) {

    var self = this;
    self.showMsg('LOG', 'Set border color ');
    if (borderColor) {
        $('head').append('<style type="text/css"></style>');
        var newStylesheet = $('head').children(':last');
        var style = '.custom-element-edit{border-color:' + borderColor + ' !important;}';
        style += '.area{border-color:' + borderColor + '}';
        newStylesheet.html(style);
    }
    else {
        self.showMsg('ERROR', 'Setting border color no border color passed');
    }
};


ProductCustomizer.prototype.getColors = function () {

    var self = this;
    if (!self.isMulticolor()) {
        self.showMsg('LOG', 'Get Colors');
        return $.ajax(self.apiUrl + 'get-colors&IDprotip=' + self.idProType)
        .done(function(colors) {
            if (colors) {
                for (var i = 0; i < colors.length; i++) {
                    self.colors.push(colors[i]);
                }
            }
            else { self.showMsg('ERROR', 'Get Colors: no colors from API'); }
        })
        .fail(function() {
            self.showMsg('ERROR', 'API Get Colors');
        });
    }
    else { return $.Deferred().resolve(); }
};


ProductCustomizer.prototype.loadFonts = function () {

    var self = this;
    self.showMsg('LOG', 'Get fonts');
    $.ajax(self.apiUrl + 'get-fonts')
    .done(function(fonts) {
        self.fonts = fonts;
        var fontFamilies = self.fonts.map(function(font){
            return font.Font;
        });
        WebFont.load({
            google: {
                families: fontFamilies
            }
        });
    })
    .fail(function() {
        self.showMsg('ERROR', 'Getting Fonts');
    });
};


ProductCustomizer.prototype.loadSvgs = function () {

    var self = this;
    self.showMsg('LOG', 'Get Svgs');
    $.ajax(self.apiUrl + 'get-svgs')
    .done(function(svgs) {
        self.svgs = svgs;
    })
    .fail(function() {
        self.showMsg('ERROR', 'Getting Svgs');
    });
};

ProductCustomizer.prototype.updateIsModifiedFromTemplate = function (){

    var self = this;
    $.ajax(self.apiUrl + 'update-is-modified-from-template&IDcus=' + self.idCustom)
    .done(function(newViewId) {
        if (newViewId) {
            self.showMsg('LOG', 'API is modified from template: ' + self.idCustom);
        }
        else { self.showMsg('ERROR', 'API is modified from template'); }
    })
    .fail(function() {
        self.showMsg('ERROR', 'API is modified from template');
    });
}

ProductCustomizer.prototype.drawAndUpdateProductCustomizer = function (idView) {
    
    var self = this;
    self.getviewsData(self.idCustom)
        .done(function(){
            if (self.viewsData && self.viewsData.length > 0 ) {
                self.currentViewId = (idView === 'default') ? self.viewsData[0].IDcusvie : idView;
                self.drawView(self.currentViewId);
            }
            else { self.showMsg('INFO', 'Por favor añade una vista'); }
            self.drawNavViews();
            self.drawNavMain();
        });
};


ProductCustomizer.prototype.getviewsData = function (idCustom) {

    var self = this;
    if (idCustom) {
        self.showMsg('LOG', 'Get Views Ids from customization: ' + idCustom);
        self.viewsData = [];
        return $.ajax(self.apiUrl + 'get-views&IDcus=' + idCustom)
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
};


ProductCustomizer.prototype.drawView = function (idView) {

    var self = this;
    if (idView){
        self.showMsg('LOG', 'Drawing view: ' + idView);
        self.view = new View();
        self.view.init(self, idView);
    }
    else { self.showMsg('ERROR', 'Draw View: No idView passed as param'); }
};


ProductCustomizer.prototype.drawNavViews = function () {

    var self = this;
    $('#nav-views').empty();
    if (self.viewsData.length > 1) {
        self.showMsg('LOG', 'Drawing Navigation Views');
        for (var i = 0; i < self.viewsData.length; i++) {
            var a = $('<a>').data('idView', self.viewsData[i].IDcusvie);
            var img = $('<img />', { 'src': self.imgUrl+self.viewsData[i].Image} );
            var del = $('<a class="btn-fancy-close nav-views-close" style="display: inline;"></a>').data('idView', self.viewsData[i].IDcusvie);
            var li = $('<li>');
            if (self.viewsData[i].IDcusvie === self.currentViewId){
                img.addClass('active');
            }
            a.click( function(){
                self.drawAndUpdateProductCustomizer($(this).data('idView'));
            });
            del.click( function(){
                self.delView($(this).data('idView'));
            });
            if (self.isTemplate === 'false'){
                del.hide();
            }
            a.append(img);
            li.append(del, a);
            $('#nav-views').append(li);
        }
    }
};


ProductCustomizer.prototype.drawNavMain = function() {

    var self = this;
    $('#nav-main').load('product-customizer/nav-main.html', function() {
        $('#btn-add-view').click(     function () { self.addView();                   });
        $('#btn-add-view-img').click( function () { self.showUploadForm('view');      });
        $('#btn-add-area').click(     function () { self.addArea(self.currentViewId); });
        $('#btn-add-text').click(     function () { self.addText(self.currentViewId); });
        $('#btn-add-svg').click(      function () { self.showSvgPicker();             });
        $('#btn-add-img').click(      function () { self.showUploadForm('img');       });
        $('#btn-reset').click(        function () { self.showResetModal();            });
        $('#btn-color').click(        function () { self.showColorPicker();           });
        $('#btn-add-to-cart').click(  function () { self.addToCart();                 });
        if (self.viewsData.length === 0) {
            $('#btn-add-area, #btn-add-text, #btn-add-image, #btn-add-svg, #btn-reset, #btn-add-view-img, #btn-add-img, #btn-color').hide();
        }
        if (self.env === 'webmaster') {
            $('#btn-reset, #btn-add-to-cart').hide();
        }
        if (self.isTemplate === 'false') {
            $('#btn-add-view, #btn-add-view-img, #btn-add-area').hide();
        }
        if (self.isMulticolor()) {
            $('#btn-color').hide();
        }
        else {
            var currentColor = self.getColor(self.idColor);
            $('#btn-color .icon-color').css('background-color', currentColor.Color);
            $('#btn-color .nav-main-item-label').html(currentColor.Nombre_c)
        }
    });
};


ProductCustomizer.prototype.addView = function () {

    var self = this;
    if (self.idCustom) {
        $.ajax(self.apiUrl + 'put-view&IDcus=' + self.idCustom)
        .done(function(newViewId) {
            if (newViewId) {
                self.showAutoSaved();
                self.updateIsModifiedFromTemplate();
                self.showMsg('LOG', 'Adding view: ' + newViewId);
                self.drawAndUpdateProductCustomizer(newViewId);
            }
            else { self.showMsg('ERROR', 'Add View: No new idView'); }
        })
        .fail(function() {
            self.showMsg('ERROR', 'API Add View: getting View ID');
        });
    }
    else { self.showMsg('ERROR', 'Add View no idCustom'); }
};


ProductCustomizer.prototype.delView = function (idView) {

    var self = this;
    self.showMsg('LOG', 'Deleting view: '+idView);
    if (idView) {
        $.ajax(self.apiUrl + 'del-view&IDvie=' + idView)
        .done(function(response) {
            if (response) {
                self.showAutoSaved();
                self.updateIsModifiedFromTemplate();
                self.view.resetView();
                self.drawAndUpdateProductCustomizer('default');
            }
            else { self.showMsg('ERROR', 'Del View: Response false'); }
        })
        .fail(function() {
            self.showMsg('ERROR', 'API Del View');
        });
    }
    else { self.showMsg('ERROR', 'Del View: No idView passed as param'); }
};


ProductCustomizer.prototype.addArea = function(idView) {

    var self = this;
    self.showMsg('LOG', 'Adding Area as custom element to DB');
    $.ajax(self.apiUrl + 'put-area&IDvie=' + idView)
    .done(function(response) {
        if (response) {
            self.showAutoSaved();
            self.updateIsModifiedFromTemplate();
            self.drawAndUpdateProductCustomizer(idView);
        }
        else { self.showMsg('ERROR', 'Add Area: No new id custom element area'); }
    })
    .fail(function() {
        self.showMsg('ERROR', 'API Add Area');
    });
};


ProductCustomizer.prototype.addText = function(idView) {

    var self = this;
    self.showMsg('LOG', 'Adding Text as custom element to DB');
    $.ajax(self.apiUrl + 'put-text&IDvie=' + idView + '&Zindex=' + self.view.getHighestZindex())
    .done(function(response) {
        if (response) {
            self.showAutoSaved();
            self.updateIsModifiedFromTemplate();
            self.drawAndUpdateProductCustomizer(idView);
        }
        else { self.showMsg('ERROR', 'Add Text: No new id custom element text'); }
    })
    .fail(function() {
        self.showMsg('ERROR', 'API Add Text');
    });
};

ProductCustomizer.prototype.addImg = function(idView, file) {

    var self = this;
    self.showMsg('LOG', 'Adding Img as custom element to DB');
    $.ajax(self.apiUrl + 'put-img&IDvie=' + idView + '&file=' + file + '&Zindex=' + self.view.getHighestZindex())
    .done(function(response) {
        if (response) {
            self.showAutoSaved();
            self.updateIsModifiedFromTemplate();
            self.drawAndUpdateProductCustomizer(idView);
        }
        else { self.showMsg('ERROR', 'Add Img: No new id custom element img'); }
    })
    .fail(function() {
        self.showMsg('ERROR', 'API Add Img');
    });
};

ProductCustomizer.prototype.addSvg = function(idView, idSvg) {

    var self = this;
    self.showMsg('LOG', 'Adding Svg as custom element to DB');
    $.ajax(self.apiUrl + 'put-svg&IDvie=' + idView + '&IDcussvg=' + idSvg + '&Zindex=' + self.view.getHighestZindex())
    .done(function(response) {
        if (response) {
            self.showAutoSaved();
            self.updateIsModifiedFromTemplate();
            self.drawAndUpdateProductCustomizer(idView);
        }
        else { self.showMsg('ERROR', 'Add Svg: No new id custom element svg'); }
    })
    .fail(function() {
        self.showMsg('ERROR', 'API Add Svg');
    });
};


ProductCustomizer.prototype.showUploadForm = function (type) {

    var self = this;
    self.showMsg('LOG', 'Show upload form');
    $('#wrapper-upload-form').show();
    $('#wrapper-upload-form').load('product-customizer/upload-form.html', function() {
        $('#wrapper-upload-form .modal .btn-close').click( function() {
            self.close('upload-form');
        });
        $('#wrapper-upload-form .modal form #btn-submit').click( function(event) {
            event.preventDefault();
            $('#wrapper-upload-form .modal form img.loading').show();
            $('#wrapper-upload-form .modal form #btn-submit').hide();
            self.uploadFile(type);
        });
    });
};


ProductCustomizer.prototype.uploadFile = function (type){

    var self = this;
    self.showMsg('LOG', 'Uploading '+ type +' file image');
    var fd = new FormData();    
    fd.append('file-to-upload', document.getElementById('file-to-upload').files[0]);
    $.ajax({
        url: 'product-customizer/file-uploader.php?type=' + type,
        data: fd,
        processData: false,
        contentType: false,
        type: 'POST',
        success: function(response){
            self.showAutoSaved();
            self.updateIsModifiedFromTemplate();
            $('#wrapper-upload-form .modal form img.loading').hide();
            $('#wrapper-upload-form .modal form #btn-submit').show();
            if (response.status === 'success') {
                $('#wrapper-upload-form').hide();
                if (type === 'view') {
                    self.putImgToView(response.file, response.height);
                }
                if (type === 'img') {
                    self.addImg(self.currentViewId, response.file);
                }
            }
            else{
                self.showMsg('ERROR', response.error);
            }
        }
    });
};


ProductCustomizer.prototype.showResetModal = function () {

    var self = this;
    self.showMsg('LOG', 'Show Reset Modal');
    $('#wrapper-reset').show();
    $('#wrapper-reset').load('product-customizer/reset-modal.html', function() {
        $('#wrapper-reset .btn-close, #wrapper-reset .btn-cancel').click( function() {
            self.close('reset');
        });
        $('#wrapper-reset .btn-ok').click( function() {
            $.ajax(self.apiUrl + 'del-custom&IDcus=' + self.idCustom)
            .done(function(response) {
                if (response) {
                    self.createNewCustomFromTemplate(self.idPro);
                }
                else { self.showMsg('ERROR', 'Delete Custom: no response from API'); }
            })
            .fail(function() {
                self.showMsg('ERROR', 'API Delete Custom');
            });
        });
    });
};


ProductCustomizer.prototype.getColor = function (idColor) {

    var self = this;
    var color;
    self.showMsg('LOG', 'Get Color');
    for (var i = 0; i < self.colors.length; i++) {
        if (idColor === self.colors[i].IDprocol) {
            color = self.colors[i]; 
            break;
        }
    }
    return color;
};


ProductCustomizer.prototype.showColorPicker = function () {

    var self = this;
    self.showMsg('LOG', 'Show Color Picker');
    $('#wrapper-nav-main-colors').show();
    $('.nav-main-colors-close').click (function () { $('#wrapper-nav-main-colors').hide(); });
    $('#nav-main-colors').empty();
    for (var i = 0; i < self.colors.length; i++) {
        var li = $('<li>').data('idColor', self.colors[i].IDprocol).css('background-color', self.colors[i].Color);
        li.click(function(){
            self.changeColor($(this).data('idColor'));
        });
        $('#nav-main-colors').append(li);
    }
};


ProductCustomizer.prototype.addToCart = function () {

    var self = this;
    self.showMsg('LOG', 'Add to cart');
    var addToCartUrl = 'beta/ecommerce_add.php?IDpro='+self.idPro+'&IDprovar='+self.idProvar+'&unit=1';
    parent.window.location.href = addToCartUrl;
};


ProductCustomizer.prototype.changeColor = function (idColor) {

    var self = this;
    self.showMsg('LOG', 'Update Color: ' + idColor);
    $('#wrapper-nav-main-colors').hide();
    self.idColor = idColor;
    $.ajax(self.apiUrl + 'update-color&IDcus=' + self.idCustom + '&IDprocol=' + idColor)
    .done(function(response) {
        if (response) {
            self.showAutoSaved();
            self.updateIsModifiedFromTemplate();
            self.drawAndUpdateProductCustomizer(self.currentViewId);
        }
        else { self.showMsg('ERROR', 'Update color: no response from API'); }
    })
    .fail(function() {
        self.showMsg('ERROR', 'API Update color');
    });
};


ProductCustomizer.prototype.createNewCustomFromTemplate = function (idPro){

    var self = this;
    self.showMsg('LOG', 'Creating new customziation from template custom: ' + idPro);
    $.ajax(self.apiUrl + 'put-custom&IDpro=' + idPro + '&IDcart=' + self.idCart + '&IDprovar=' + self.idProvar +'&IDCli=' + self.idClient)
    .done(function(idCustomNew) {
        if (idCustomNew) {
            $('#wrapper-reset').hide();
            self.idCustom = idCustomNew;
            self.init();
        }
        else { self.showMsg('ERROR', 'Create new Custom: no new id custom retruned from API'); }
    })
    .fail(function() {
        self.showMsg('ERROR', 'API Create New Custom');
    });
};


ProductCustomizer.prototype.putImgToView = function (file, height) {

    var self = this;
    $.ajax(self.apiUrl + 'put-img-to-view&IDvie=' + self.currentViewId + '&file=' + file)
    .done(function(response) {
        if (response) {
            self.showAutoSaved();
            self.updateIsModifiedFromTemplate();
            self.height = height;
            self.updateHeight(height).done( function() {
                self.drawAndUpdateProductCustomizer(self.currentViewId);                
            });
        }
        else { self.showMsg('ERROR', 'Put Img View: No new idView'); }
    })
    .fail(function() {
        self.showMsg('ERROR', 'API Put Img View');
    });
};

ProductCustomizer.prototype.updateHeight = function (height) {

    var self = this;
    return $.ajax({
        type: 'POST',
        url: self.apiUrl + 'update-height&IDcus=' + self.idCustom,
        data: {height: height}
    });
};


ProductCustomizer.prototype.showSvgPicker = function () {

    var self = this;
    self.showMsg('LOG', 'Picking Svg');
    $('#wrapper-svg-picker').show();
    $('#wrapper-svg-picker').load('product-customizer/svg-picker.html', function() {
        $('#wrapper-svg-picker .modal .btn-close').click( function() {
            self.close('svg-picker');
        });
        for (var i = 0; i < self.svgs.length; i++) {
            var img = $('<img />', { 'src': self.svgUrl+self.svgs[i].Svg_file} );
            var li = $('<li>').data('idSvg', self.svgs[i].IDcussvg);
            li.click( function(){
                self.addSvg(self.currentViewId, $(this).data('idSvg'));
                $('#wrapper-svg-picker').hide();
            });
            $('#ul-svgs').append(li.append(img));
        }
    });
};


ProductCustomizer.prototype.showMsg = function(type, msg) {

    var self = this;
    if (self.mode === 'dev') {
        console.log(type + ' -> ' + msg);
    }
    if (type !== 'LOG') {
        self.showMsgModal(type, msg);
    }
};


ProductCustomizer.prototype.showMsgModal = function(type, msg) {

    var self = this;
    $('#wrapper-msg-modal').show();
    $('#wrapper-msg-modal').load('product-customizer/msg-modal.html', function() {
        $('#wrapper-msg-modal .modal p').html(msg);
        $('#wrapper-msg-modal .btn-close, #wrapper-msg-modal .btn-ok').click( function() {
            self.close('msg-modal');
        });
    });
};


ProductCustomizer.prototype.close = function(element) {

    $('#wrapper-'+element).hide();
};

ProductCustomizer.prototype.showAutoSaved = function () {

    var self = this;
    if (self.showingAutoSaved == false && $('#toast').is(":visible") == false){
        $('#saved').show();
        self.showingAutoSaved = true;
        setTimeout(function(){
            $('#saved').hide();
            self.showingAutoSaved = false;
        }, 1500);
    }
};

ProductCustomizer.prototype.isMulticolor = function () {

    var self = this;
    if ( $.inArray(self.idProType, ['1', '4', '5', '6']) !== -1 ) {
        return true;
    }
    else {
        return false;
    }
};
