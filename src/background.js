var info = {};

var base = 'https://api-gw.dhlparcel.nl/track-trace';

chrome.runtime.onMessage.addListener((data, sender, reply) => {

	console.log(data, sender);

	if(data.type == 'notify') {
		chrome.notifications.create(null, {
			type: 'basic',
			message: data.message,
			title: data.title,
			iconUrl: 'dhl-icon128.png',
		});
	}

	if(data.type == 'get-trace') {
		var trace = fetchTrace(data.trackTraceNumber, data.zipcode);

		trace.then(json => reply(json[0]));
	}

	if(data.type == 'set-tt') {
		info.trackTraceNumber = data.value;
	}

	if(data.type == 'set-zipcode') {
		info.zipcode = data.value;
	}

	if(data.type == 'get-info') {
		reply({
			trackTraceNumber: info.trackTraceNumber,
			zipcode: info.zipcode
		});
	}

	if(data.type == 'check-page') {
		chrome.tabs.query({
			active: true,
			currentWindow: true
		}, function(tabs) {
			chrome.tabs.sendMessage(tabs[0].id, p, function(response) {
				console.log(`message from background: ${JSON.stringify(response)}`);
			});
		});
	}

	return true;
});

const fetchTrace = async(trackTraceNumber, zipcode) => {
	var response = await fetch(base + '?key=' + encodeURIComponent(trackTraceNumber + '+' + zipcode), {
		headers: {
			'Content-Type' : 'application/json'
		}
	});

	if(response.status !== 200) {
		return false;
	}

	return response.json();
};