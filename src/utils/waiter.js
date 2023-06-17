import logger from "./logger"

function wait_for_element(selector, callback, interval=200, scope=document) {
	const targetElement = scope.querySelector(selector)
	if(targetElement !== null) {
		callback(targetElement)
	} else {
		setTimeout(function() {
			wait_for_element(selector, callback, interval, scope)
		}, interval)
	}
}

export {
	wait_for_element
}