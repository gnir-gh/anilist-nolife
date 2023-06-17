import { inject_styles } from './modules/styles'
import settings from './modules/settings'
import editor_media_search from './modules/editor-media-search';
import { get_page } from "./utils/url"

let currentURL = '';
const main_loop = function() {
	currentURL = document.URL;
	const page = get_page();

	// at_injector(page);
	editor_media_search(page);
	settings(page);
}

// intialise
inject_styles();
main_loop();

setInterval(() => {
	let newURL = document.URL;
	if(currentURL !== newURL) {
		main_loop();
	}
}, 200)
