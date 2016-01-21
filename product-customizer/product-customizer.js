'use strict';


var ProductCustomizer = function () {

    this.idCustom;
    this.idProduct;
    this.isTemplate;
    this.rootE = $('#product-customizer');
    this.viewsData = [];
    this.view;
    this.currentViewId;
    this.apiUrl = 'product-customizer/api/api.php?request=';
    this.imgUrl = 'http://www.sellosyrotulos.com/img/custom/';
    this.svgUrl = 'http://www.sellosyrotulos.com/img/customSVG/';
    this.fonts = [];
    this.svgs = [];
    this.mode = 'dev'; //[pro|dev]
};


ProductCustomizer.prototype.init = function () {
    
    var self = this;
    if (self.idCustom) {
        self.showMsg('LOG', 'Init Customization: ' + self.idCustom);
        self.getCustomizationData(self.idCustom);
        self.loadFonts();
        self.loadSvgs();
        self.drawAndUpdateProductCustomizer('default');
    }
    else { self.showMsg('ERROR', 'No id customization to init'); }
};


ProductCustomizer.prototype.getCustomizationData = function (idCustom) {

    var self = this;
    if (idCustom) {
        self.showMsg('LOG', 'Get Customization Data from customization: ' + idCustom);
        $.ajax(this.apiUrl + 'get-custom&IDcus=' + idCustom)
        .done(function(customData) {
            self.idProduct = customData[0].ID_pro;
            self.isTemplate = customData[0].Is_Template;
        })
        .fail(function() {
            self.showMsg('ERROR', 'loading Customization Data');
        });
    }
    else { self.showMsg('ERROR', 'loading Customization Data No idCustom passed'); }
};


ProductCustomizer.prototype.loadFonts = function () {

    var self = this;
    self.showMsg('LOG', 'Get fonts');
    $.ajax(this.apiUrl + 'get-fonts')
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
    $.ajax(this.apiUrl + 'get-svgs')
    .done(function(svgs) {
        self.svgs = svgs;
    })
    .fail(function() {
        self.showMsg('ERROR', 'Getting Svgs');
    });
};


ProductCustomizer.prototype.drawAndUpdateProductCustomizer = function (idView) {
    
    var self = this;
    self.getviewsData(self.idCustom)
        .done(function(){
            if (self.viewsData && self.viewsData.length > 0 ) {
                self.currentViewId = (idView == 'default') ? self.viewsData[0].IDcusvie : idView;
                self.drawView(self.currentViewId);
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
        return $.ajax(this.apiUrl + 'get-views&IDcus=' + idCustom)
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
        self.view = new View();
        self.view.init(self, idView);
    }
    else { self.showMsg('ERROR', 'Draw View: No idView passed as param'); }
}


ProductCustomizer.prototype.drawNavViews = function () {

    var self = this;
    self.showMsg('LOG', 'Drawing Navigation Views');
    $('#nav-views').empty();
    $('#nav-views').css('right', (420 - (self.viewsData.length*60)) + 'px');
    for (var i = 0; i < self.viewsData.length; i++) {
        var a = $('<a>').data('idView', self.viewsData[i].IDcusvie);
        var img = $('<img />', { 'src': self.imgUrl+self.viewsData[i].Image} );
        var del = $('<a class="btn-fancy-close nav-views-close" style="display: inline;"></a>').data('idView', self.viewsData[i].IDcusvie);
        var li = $('<li>');
        if (self.viewsData[i].IDcusvie == self.currentViewId){
            img.addClass('active');
        }
        a.click( function(){
            self.drawAndUpdateProductCustomizer($(this).data('idView'));
        });
        del.click( function(){
            self.delView($(this).data('idView'));
        });
        a.append(img);
        li.append(del, a)
        $('#nav-views').append(li);
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
        if (self.viewsData.length == 0)
            $('#btn-add-area, #btn-add-text, #btn-add-image, #btn-add-svg, #btn-reset, #btn-add-view-img, #btn-add-img').hide();
        if (self.isTemplate == "true")
            $('#btn-reset').hide();
    });
};


ProductCustomizer.prototype.addView = function () {

    var self = this;
    if (self.idCustom) {
        $.ajax(this.apiUrl + 'put-view&IDcus=' + self.idCustom)
        .done(function(newViewId) {
            if (newViewId) {
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
        $.ajax(this.apiUrl + 'del-view&IDvie=' + idView)
        .done(function(response) {
            if (response) {
                self.view.rootE.empty();
                self.view.rootE.css('background-image', 'none');
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
    $.ajax(this.apiUrl + 'put-area&IDvie=' + idView)
    .done(function(response) {
        if (response) {
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
    $.ajax(this.apiUrl + 'put-text&IDvie=' + idView + '&Zindex=' + self.view.getHighestZindex())
    .done(function(response) {
        if (response) {
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
    $.ajax(this.apiUrl + 'put-img&IDvie=' + idView + '&file=' + file + '&Zindex=' + self.view.getHighestZindex())
    .done(function(response) {
        if (response) {
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
    $.ajax(this.apiUrl + 'put-svg&IDvie=' + idView + '&IDcussvg=' + idSvg + '&Zindex=' + self.view.getHighestZindex())
    .done(function(response) {
        if (response) {
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
            $('#wrapper-upload-form .modal form img.loading').hide();
            if (response.status == 'success'){
                $('#wrapper-upload-form').hide();
                if (type == 'view')
                    self.putImgToView(response.file);
                if (type == 'img')
                    self.addImg(self.currentViewId, response.file);
            }
            else{
                self.showMsg('ERROR', response.error);
            }
        }
    });
};


ProductCustomizer.prototype.putImgToView = function (file) {

    var self = this;
    $.ajax(self.apiUrl + 'put-img-to-view&IDvie=' + self.currentViewId + '&file='+file)
    .done(function(response) {
        if (response) {
            self.drawAndUpdateProductCustomizer(self.currentViewId);
        }
        else { self.showMsg('ERROR', 'Put Img View: No new idView'); }
    })
    .fail(function() {
        self.showMsg('ERROR', 'API Put Img View');
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
    if (self.mode == 'dev')
        console.log(type + ' -> ' + msg);
    if (type != 'LOG')
        self.showMsgModal(type, msg);
};


ProductCustomizer.prototype.showMsgModal = function(type, msg) {

    var self = this;
    $('#wrapper-msg-modal').show();
    $('#wrapper-msg-modal').load('product-customizer/msg-modal.html', function() {
        $('#wrapper-msg-modal .modal p').html(msg);
        $('#wrapper-msg-modal .modal .btn-close').click( function() {
            self.close('msg-modal');
        });
    });
};


ProductCustomizer.prototype.close = function(element) {

    $('#wrapper-'+element).hide();
};
