import { capitalize } from "lodash-es";
import logger from "./logger";

function format_format(formatType) {
	if(['OVA', 'ONA'].includes(formatType)) {
		return formatType
	} else if(formatType === 'TV_SHORT') {
		return 'TV Short'
	} else if(formatType === 'TV') {
		return 'TV'
	}
	else if(formatType === 'ONE_SHOT') {
		return 'Oneshot'
	} else {
		return capitalize(formatType)
	}
}

async function post_json(url, options) {
	try {
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json'	
			},
			...options
		});
		if(!response.ok) {
			throw new Error(response.statusText);
		}
		const body = await response.json();
		return body;
	} catch (error) {
		console.error(error);
	}
}

async function api_request(query, variables) {
	let responseJson = post_json('https://graphql.anilist.co', { 
		body: JSON.stringify({
			query, variables
		})
	});
	return responseJson;
}

async function search_media(searchTerm, mediaTypes, adult) {
	let variables =  {
		search: searchTerm,
		perPage: 8
	}
	let vars = ''
	let filters = ''
	if(mediaTypes?.length === 1) {
		vars += `, $mediaType: MediaType`
		filters += ', type: $mediaType'
		variables.mediaType = mediaTypes[0].toUpperCase().trim()
	}
	if(adult === false) {
		vars += `, $adult: Boolean`
		filters += ', isAdult: $adult'
		variables.adult = adult
	}
	const query = `query ($perPage: Int, $search: String${vars}) {
		Page (page: 1, perPage: $perPage) {
		  pageInfo {
			total
			perPage
		  }
		  media (search: $search${filters}) {
			id
			type,
			title {
			  romaji
			  english
			},
			format,
			coverImage {
			  medium
			}
		  }
		}
	  }`
	const responseJson = await api_request(query, variables)
	return responseJson['data'];
}

export {
	search_media,
	format_format
}