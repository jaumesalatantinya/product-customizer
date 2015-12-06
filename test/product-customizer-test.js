'use strict';

describe('Product Customizer', function () {

	var productCustomizer;

	describe('Contructor', function () {
  	
		it('Should assign (productCustomizer.isAdmin = true) when new ProductCustomizer({isAdmin:true})', function() {
			productCustomizer = new ProductCustomizer({isAdmin:true});
			expect(productCustomizer.isAdmin).toBeTruthy();
		});

		it('Should assign (productCustomizer.isAdmin = false) when new ProductCustomizer({isAdmin:false})', function() {
			productCustomizer = new ProductCustomizer({isAdmin:false});
			expect(productCustomizer.isAdmin).toBeFalsy();
		});

		it('Should assign (productCustomizer.isAdmin = false) when new ProductCustomizer(what_ever_value)', function() {
			productCustomizer = new ProductCustomizer(50);
			expect(productCustomizer.isAdmin).toBeFalsy();
		});

		it('Should assign (productCustomizer.isAdmin = false) when new ProductCustomizer()', function() {
			productCustomizer = new ProductCustomizer();
			expect(productCustomizer.isAdmin).toBeFalsy();
		});
	});
});

