import logger from "../utils/logger";

const __main_styles = `
.reply .header .gn_at-button {
	margin-top: 0.5em;
	vertical-align: top;
}
.forum-thread .body .gn_at-button {
	height: 2.5em;
}

.activity-edit .gn_media-search {
	margin-bottom: 1rem;
}
.activity-edit .gn_media-search {
	margin-top: -1rem;
}
.gn_media-search__searchbar {
	display: grid;
	grid-template-columns: 1fr auto;
	column-gap: 1rem;
	font-size: 1.3rem;
	place-items: center;
}

.gn_media-search__input {
	font-size: 1.3rem;
	max-height: 36px;
}

.thread .body .gn_media-search__input,
.review .body .gn_media-search__input,
.forum-thread .gn_media-search__input {
	box-shadow: none !important;
}
.gn_media-search__options label {
	margin-right: 0.5rem;
}
.gn_media-search__results label:last-child {
	margin-right: 0;
}
.gn_media-search__results {
	margin-top: 1rem;
	box-sizing: border-box;
}
.gn_media-search__infobar {
	font-size: 1rem;
}
.gn_media-search__results ul {
	margin: 0;
	padding: 0;
}
.gn_media-search__results li {
	background-position: 50%;
	background-size: cover;
	cursor: pointer;
	border-radius: 3px;
	display: inline-block;
	width: 4rem;
	height: 4rem;
	margin-right: 1rem;
}
.gn_media-search__reslts li:last-child {
	margin-right: 0;
}
`

function inject_styles() {
	let style = document.createElement('style');
	style.textContent = __main_styles
	document.head.append(style)
	logger.info('injected style')
}

export {
	inject_styles
}