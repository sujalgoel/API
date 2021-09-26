/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

(function(doc) {
	[].forEach.call(doc.querySelectorAll('input.json__value--string'), function(
		input,
	) {
		const wrapper = doc.createElement('span');
		wrapper.className = 'json__value--string';
		input.parentNode.insertBefore(wrapper, input);
		wrapper.appendChild(input);
		fit.call(input);
		input.addEventListener('input', fit);
	});
	function fit() {
		this.style.width = this.value.length * 0.6 + 'em';
	}
})(document);

function copy() {
	const copyText = document.getElementById('token');
	copyText.select();
	copyText.setSelectionRange(0, 99999);
	document.execCommand('copy');
}
