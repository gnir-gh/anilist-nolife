function string_to_html_element(s) {
	let n = document.createElement('div');
	n.innerHTML = s
	return n.firstElementChild
}

function computed_style(element, property) {
	const computedStyle = window.getComputedStyle(element)
	return computedStyle.getPropertyValue(property)
}

function insert_at_cursor(inputElement, text, prepend=false, simulateInput=true) {
	const oldValueBefore = inputElement.value.slice(0, inputElement.selectionStart);;
    const valueAfter = inputElement.value.slice(inputElement.selectionEnd);
    if(prepend !== false && ![' ', '\n'].includes(oldValueBefore.slice(-1)) && oldValueBefore.length > 0) {
		if(typeof prepend !== 'string') {
			prepend = ' '
		}
        text = prepend + text;
    }
    const newValueBefore = oldValueBefore + text
    inputElement.value = newValueBefore + valueAfter;
    inputElement.focus();
    inputElement.selectionEnd = newValueBefore.length;
    if(simulateInput) {
        inputElement.dispatchEvent(new Event('input', {cancelable: false, composed: true}));
    }	
}

const spinner = '<div class="lds-ripple"><div></div><div></div></div>'

export {
	string_to_html_element,
	insert_at_cursor,
	computed_style,
	spinner
}