HTMLElement.prototype.appendChilds = function() {
	for(var $i = 0; $i < arguments.length; $i++) {
		this.appendChild(arguments[$i]);
	}

	return this;
};

HTMLElement.prototype.text = function() {
	for(var $i = 0; $i < arguments.length; $i++) {
		this.appendChild(document.createTextNode(arguments[$i]));
	}

	return this;
};

$trace = {

	number: null,
	zipcode: null,

	/**
	 * Init
	 */
	init : function() {

		var hash = document.location.hash.substr(1).split('/');

		this.number = hash[0];
		this.zipcode = hash[1];

		navigator.registerProtocolHandler('web+tracking',
			'chrome-extension://' + chrome.runtime.id + '/trace.html#blablabla-%s',
			'DHL Tracking'
		);

		this.getTrace();
	},

	/**
	 * Get trace
	 */
	getTrace : function() {
		chrome.runtime.sendMessage({
			type: 'get-trace',
			trackTraceNumber: this.number,
			zipcode: this.zipcode
		}, (data) => {

			if(!data) {
				chrome.runtime.sendMessage({
					type: 'notify',
					title: 'DHL Tracking',
					message: 'The provided barcode was not found'
				});
				window.close();
				return false;
			}

			this.parseTrace(data);
		});
	},

	/**
	 * Parse trace
	 */
	parseTrace : function(data) {

		console.log(data);

		document.title += ' - ' + data.barcode;

	// barcode
		var barcode = document.getElementById('barcode');
		barcode.text(data.barcode);

	// pickup
		var pickup = data.shipper.address;

		var address = document.getElementById('address-pickup');

		var name = document.createElement('b');
		name.text(data.shipper.name);

		address.appendChild(name);

	// delivery
		var delivery = data.receiver.address;

		var address = document.getElementById('address-delivery');

		var name = document.createElement('b');
		name.text(data.receiver.name);

		address.appendChild(name);

		address.text(
			"\n",
			data.receiver.contactName + "\n",
			delivery.street + ' ' + delivery.houseNumber + ' ' + delivery.addition + "\n",
			delivery.postalCode + ' ' + delivery.city + "\n",
			delivery.countryCode
		);

	// service
		var scanService = document.getElementById('info-scan-service');
		scanService.text(data.product.description);

	// scan
		if(data.events && data.events.length > 0) {
			var event = data.events[0];

			var scanDateInstance = new Date(event.timestamp);

			var scanDate = document.getElementById('info-scan-date');
			scanDate.text(scanDateInstance.toLocaleDateString('en-US', {
				weekday: 'long',
				year: 'numeric',
				month: 'long',
				day: 'numeric'
			}));

			var scanDimensions = document.getElementById('info-scan-dimensions');
			scanDimensions.text([
				event.length,
				event.width,
				event.height
			].join(' × '));

			var scanWeight = document.getElementById('info-scan-weight');
			scanWeight.text(event.weight);
		}

	// signature
		var signature = document.getElementById('info-signature');

		var signatureImage = document.createElement('img');
		signature.appendChild(signatureImage);

		var signedBy = document.getElementById('info-signed-by');

		if(data.view && data.view.mainProofOfDelivery) {
			signatureImage.setAttribute('src', data.view.mainProofOfDelivery.signatureUrl);
			signedBy.text(data.view.mainProofOfDelivery.signedBy);
		}

		//window.print();
	}

};

$trace.init();