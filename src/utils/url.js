function get_page() {
	const path = window.location.pathname
	const breadcrumbs = path.split('/')
	let section = breadcrumbs[1]
	if(section === 'forum') {
		if(breadcrumbs?.[2] === 'thread') {
			section = 'thread' 
			if(breadcrumbs?.[4] === 'comment') {
				section += ':comment'
			}
			else if(breadcrumbs?.[3] === 'editor') {
				section += ':editor'
			}
		}
	} else if(section === 'settings') {
		if(breadcrumbs?.[2] !== '') {
			section += `:${breadcrumbs[2]}`
		}
	}
	return section
}

export { 
	get_page
}