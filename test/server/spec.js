var assert = require('assert');
var request = require('supertest');
var app = require('../../app.js');

describe('Array', function() {
	describe('#indexOf()', function () {
		console.log(1)
		it('should return -1 when the value is not present', function () {
			request(
				app
				)
			.get('/')
			.expect(function(res) {
				console.log(2222)
								assert.equal(-1, [1,2,3].indexOf(5));
				assert.equal(-1, [1,2,3].indexOf(0));
					done();
			})

		});
	});
});
