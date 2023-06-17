import logger from "./logger"

function nodes_added(parentSelector, mutation) {
	return (mutation.type === 'childList') &&
		(mutation.addedNodes.length > 0) &&
		(mutation.target.matches(parentSelector))
}

function nodes_removed(parentSelector, mutation) {
	return (mutation.type === 'childList') &&
		(mutation.removedNodes.length > 0) &&
		(mutation.target.matches(parentSelector))
}

function run_on_added_nodes(parentSelector, mutation, func, ...args) {
	if(nodes_added(parentSelector, mutation)) {
		for(const node of mutation.addedNodes) {
			if(node.nodeName.startsWith('#')) {
				continue
			}
			func(node, mutation.target, ...args)
		}
	}
}

function run_on_removed_nodes(parentSelector, mutation, func, ...args) {
	if(nodes_removed(parentSelector, mutation)) {
		for(const node of mutation.removedNodes) {
			if(node.nodeName.startsWith('#')) {
				continue
			}
			func(node, mutation.target, ...args)
		}
	}
}

export {
	nodes_added,
	run_on_added_nodes,
	run_on_removed_nodes
}