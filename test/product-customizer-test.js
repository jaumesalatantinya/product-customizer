'use strict';

describe('Product Customizer: ', function () {

	describe('Init', function () {
		it('Should showMsg Error if self.idcustom dont have value', function() {
			var productCustomizer = new ProductCustomizer();
			spyOn(productCustomizer, 'showMsg');	
			productCustomizer.init();
			expect(productCustomizer.showMsg).toHaveBeenCalled();
		});
	});

	describe('Get Customization Data', function () {
 
		var productCustomizer;
		beforeEach(function(){
			productCustomizer = new ProductCustomizer();
			productCustomizer.idCustom = 1;
		});

		it('Should call showMsg ERROR when NO idcustom is passed as parameter', function() {
			spyOn(productCustomizer, 'showMsg');
			productCustomizer.getCustomizationData();
			expect(productCustomizer.showMsg).toHaveBeenCalled();
		});

		it('Should get idProduct&isTemplate from API when idCustom is pass as parameter', function() {
			var data = [{"IDcus":"1","ID_pro":"1","Is_Template":"1"}];
			var d = $.Deferred();
			d.resolve(data);
			spyOn($, "getJSON").and.returnValue(d.promise());	
			productCustomizer.getCustomizationData(1);
			expect(productCustomizer.idProduct).toBe("1");
			expect(productCustomizer.isTemplate).toBe("1");
		});

		it('Should call showMsg ERROR when API fails', function() {
			var d = $.Deferred();
			d.reject();
			spyOn($, "getJSON").and.returnValue(d.promise());
			spyOn(productCustomizer, 'showMsg');
			productCustomizer.getCustomizationData(1);
			expect(productCustomizer.showMsg).toHaveBeenCalled();
		});		
	});

	describe('Draw And Update Product Customizer', function () {
 
		var productCustomizer;
		beforeEach(function(){
			productCustomizer = new ProductCustomizer();
			productCustomizer.idCustom = 1;
		});

		// it('Should call showMsg INFO -> Add view when customization have no views', function() {
		// 	var d = $.Deferred();
		// 	d.reject();
		// 	spyOn(productCustomizer, 'getviewsData').and.returnValue(d.promise());
		// 	productCustomizer.drawAndUpdateProductCustomizer(1);
		// 	spyOn(productCustomizer, 'showMsg');
		// 	expect(productCustomizer.showMsg).toHaveBeenCalledWith('INFO', 'Siusplau afegeix una vista');
		// });
	});

	describe('Get Views Data', function () {
 
		var productCustomizer;
		beforeEach(function(){
			productCustomizer = new ProductCustomizer();
			productCustomizer.idCustom = 1;
		});

		it('Should call showMsg ERROR when NO idcustom is passed as parameter', function() {
			spyOn(productCustomizer, 'showMsg');
			productCustomizer.getviewsData();
			expect(productCustomizer.showMsg).toHaveBeenCalledWith('ERROR', 'Get Views no idCustom');
		});

		it('Should return a rejected promise when NO idcustom is passed as parameter', function() {
			var b = false;
			var d = $.Deferred();
			d.reject();
			spyOn(productCustomizer, 'getviewsData').and.returnValue(d.promise());
			var p = productCustomizer.getviewsData();
			p.fail ( function(){
				b = true;
			});
			expect(b).toBeTruthy();
		});
	});
});

