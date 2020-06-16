var form = document.getElementById('form');

form.addEventListener('submit', (e) => {

	var tt = form.elements['trackTraceNumber'].value;
	var zipcode = form.elements['zipcode'].value;

	window.open(e.target.action + '#' + (tt + '/' + zipcode).toUpperCase(), '_dhl_tracking')

	e.preventDefault();
	return false;
});

form.elements['trackTraceNumber'].addEventListener('change', e => {
	chrome.runtime.sendMessage({
		type: 'set-tt',
		value: e.target.value
	});
});

form.elements['zipcode'].addEventListener('change', e => {
	chrome.runtime.sendMessage({
		type: 'set-zipcode',
		value: e.target.value
	});
});

chrome.runtime.sendMessage({
		type: 'get-info'
	},
	(response) => {
		form.elements['trackTraceNumber'].value = response.trackTraceNumber || '';
		form.elements['zipcode'].value = response.zipcode || '';
	}
);