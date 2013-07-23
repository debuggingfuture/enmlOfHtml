var enmlOfHtml = require('../enmlOfHtml');

var html = '<html><p>put html here</p></html>';

describe('ENMLOfHTML', function() {
	it('should convert to ENML', function(cb) {
		this.timeout(10 * 1000);
		enmlOfHtml.ENMLOfHTML(html, function(err, ENML) {
			console.log(ENML);
			cb();
		});

	});

	it('should inline css ', function(cb) {
		//TODO

	});
});