import logger from "../utils/logger";
import { wait_for_element } from "../utils/waiter";
import { run_on_added_nodes, run_on_removed_nodes } from '../utils/mutations';
import { insert_at_cursor, string_to_html_element } from "../utils/html";
import { search_media, format_format } from "../utils/anilist";
import { debounce, capitalize } from "lodash-es";

function main(page) {
	const pageGroup = {
		'thread': ['thread', 'thread:comment'],
		'activityFeed': ['home', 'user', 'activity'],
		'bigEditor': ['thread:editor', 'review']
	}

	const media_search_html = `<div class="gn_media-search">
			<div class="gn_media-search__searchbar">
				<div class="gn_media-search__input-wrapper el-input">
					<input class="el-input__inner gn_media-search__input" placeholder="Search for media ..." />
				</div>
				<div class="gn_media-search__options">
					<label><input type="checkbox" class="gn_media-search__format" value="ANIME" checked> Anime</label>
					<label><input type="checkbox" class="gn_media-search__format" value="MANGA" checked> Manga</label>
					<label><input type="checkbox" class="gn_media-search__adult" value="18+"> 18+</label>
				</div>
			</div>
			<div class="gn_media-search__results">
			</div>
		</div>`
	
	function insert_media(event, target, textareaDiv, textLink=false) {
		event.preventDefault?.()
		const textarea = textareaDiv.firstElementChild
		const url = target.getAttribute('data-url')
		const romaji = target.getAttribute('data-romaji')
		if(textLink) {
			insert_at_cursor(textarea, `[${romaji}](${url})`, ' ', true)
		} else{
			insert_at_cursor(textarea, url + '\n', '\n', true)
		}
	}

	function set_not_found(resultArea) {
		resultArea.innerHTML = '<span style="font-size: 1.2rem; padding: 1rem;">No anime/manga found.</span>'
	}

	function reset_info_bar(infoBar) {
		infoBar.innerHTML = 'Click on the cover image to insert link. Right-click to insert linked title.'
	}

	function update_info_bar(event, target, infoBar) {
		const format = format_format(target.getAttribute('data-format'))
		const romaji = target.getAttribute('data-romaji')
		const english = target.getAttribute('data-english')
		infoBar.innerHTML = `[${format}] ${romaji}`
		if(english !== 'null') {
			infoBar.innerHTML += ` (${english})`
		}
	}

	async function perform_search(searchInput, searchOptions, searchArea, textareaDiv) {
		const searchTerm = searchInput.value
		const resultArea = searchArea.querySelector('.gn_media-search__results')
		if(searchTerm === '') {
			resultArea.innerHTML = ''
			return
		}
		let mediaTypes = []
		let adult = false
		const formatCheckboxes = searchOptions.querySelectorAll('input[type="checkbox"]')
		for(const checkbox of formatCheckboxes) {
			if(checkbox.classList.contains('gn_media-search__format') && checkbox?.checked) {
				mediaTypes.push(checkbox.value)
			} else if(checkbox.classList.contains('gn_media-search__adult')) {
				adult = checkbox.checked
			}
		}
		if(mediaTypes.length === 0) {
			set_not_found(resultArea)
			return
		}
		const queryResults = await search_media(searchTerm, mediaTypes, adult)
		if(queryResults['Page']['pageInfo']['total'] > 0) {
			resultArea.innerHTML = ''
			const mediaList = queryResults['Page']['media']
			const infoBar = document.createElement('div')
			infoBar.classList.add('gn_media-search__infobar')
			resultArea.append(infoBar)			
			reset_info_bar(infoBar)
			
			const ul = document.createElement('ul')
			for(const media of mediaList) {
				let li = document.createElement('li')
				li.setAttribute('style', `background-image: url("${media.coverImage.medium}")`)
				li.setAttribute('data-romaji', media.title.romaji)
				li.setAttribute('data-type', media.type)
				li.setAttribute('data-format', media.format)
				li.setAttribute('data-english', media.title.english)
				li.setAttribute('data-url', `https://anilist.co/${media.type.toLowerCase()}/${media.id}`)
				ul.append(li)
				li.addEventListener('click', (event) => { 
					insert_media(event, event.currentTarget, textareaDiv) 
				})
				li.addEventListener('contextmenu', (event) => {
					insert_media(event, event.currentTarget, textareaDiv, true)
				})
				li.addEventListener('mouseover', (event) => {
					update_info_bar(event, event.currentTarget, infoBar)
				})
				li.addEventListener('mouseout', (event) => {
					reset_info_bar(infoBar)
				})
			}
			resultArea.prepend(ul)
		} else {
			set_not_found(resultArea)
		}
	}

	function injected(mdEditor) {
		return mdEditor.parentElement.querySelector('.gn_media-search') !== null
	}

	function inject_search_area(mdEditor) {
		//mdEditor = the bar above textarea div
		if(mdEditor === null) {
			return;
		}
		if(injected(mdEditor)) {
			return;
		}
		const textareaDiv = mdEditor.nextElementSibling
		const searchArea = string_to_html_element(media_search_html)
		textareaDiv.after(searchArea)
		const searchInput = searchArea.querySelector('.gn_media-search__input')
		const searchOptions = searchArea.querySelector('.gn_media-search__options')
		const debounced = debounce(perform_search, 250, { maxWait: 500 })
		searchInput.addEventListener('keyup', (event) => {
			debounced(searchInput, searchOptions, searchArea, textareaDiv)
		})
		searchOptions.addEventListener('change', (event) => {
			debounced(searchInput, searchOptions, searchArea, textareaDiv)
		})
	}

	function remove_search_area(searchAreaParent) {
		searchAreaParent.querySelector('.gn_media-search')?.remove()
	}

	if(pageGroup['thread'].includes(page)) {
		const scopeSelector = '.comment-editor'
		wait_for_element(scopeSelector, function(scopeElement) {
			const _mdEditor = document.querySelector('.comment-editor .markdown-editor')
			if(_mdEditor !== null){
				inject_search_area(_mdEditor)
			}
			let observer = new MutationObserver((mutationList, observer) => {
				for(const m of mutationList) {
					run_on_added_nodes('.comment-editor', m, (node, mutationTarget) => {
						const mdEditor = mutationTarget.querySelector('.markdown-editor')
						inject_search_area(mdEditor)
					})
				}
			})
			observer.observe(scopeElement, {
				childList: true,
				subtree: true
			})
		});
	} else if(pageGroup['activityFeed'].includes(page)) {
		let scopeSelector = '.activity-feed-wrap'
		if(page === 'activity') {
			scopeSelector = '.activity-entry'
		}
		wait_for_element(scopeSelector, function(scopeElement) {
			const _mdEditors = document.querySelectorAll('.activity-edit .markdown-editor, .activity-entry .markdown-editor')
			for(const el of _mdEditors) {
				const action = el.parentElement.querySelector('.actions')
				if(action !== null) {
					inject_search_area(el)
				}
			}
			let observer = new MutationObserver((mutationList, observer) => {
				for(const m of mutationList) {
					run_on_added_nodes('.activity-edit, .activity-entry', m, (node, mutationTarget) => {
						const mdEditor = mutationTarget.querySelector('.markdown-editor')
						inject_search_area(mdEditor)
					})
					run_on_removed_nodes('.activity-edit, .activity-entry', m, (node, mutationTarget) => {
						if(node.classList.contains('actions')) {
							remove_search_area(mutationTarget)
						}
					}) 
				}
			})
			observer.observe(scopeElement, {
				childList: true,
				subtree: true
			})
		})
	} else if(pageGroup['bigEditor'].includes(page)) {
		wait_for_element('.body .markdown-editor', function(scopeElement) {
			inject_search_area(scopeElement)
		})
	}
}

export default main