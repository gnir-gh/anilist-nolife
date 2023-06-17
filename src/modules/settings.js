import logger from "../utils/logger";
import { wait_for_element } from "../utils/waiter";

function main(page) {
	if(page !== 'settings:apps') {
		return
	}

	wait_for_element('.content .apps', (appsSettingsDiv) => {
		document.createElement('div')
	})
}

export default main