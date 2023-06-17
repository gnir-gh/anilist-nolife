// import MediaQuery from './graphql/media.gql';

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
	let data = post_json('https://graphql.anilist.co', { 
		body: JSON.stringify({
			query, variables
		})
	});
	return data;
}

async function get_relations(id) {
	const MediaQuery = `query ($id: Int) {
	Media (id: $id) {
		id
		title {
			romaji
			english
			native
		}
	}
}`
	return await api_request(MediaQuery, {
		id
	});
}

module.exports = {
	get_relations
}