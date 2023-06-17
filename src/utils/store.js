import logger from "./logger";

class Store {
	constructor(prefix='gnir__') {
		this.prefix= prefix
	}

	_p(s) {
		return `${this.prefix}${s}`
	}

	save(name, obj) {
		return localStorage.setItem(this._p(name), JSON.stringify(obj))
	}

	load(name) {
		const loaded = localStorage.getItem(this._p(name))
		if(loaded === null) {
			throw new Error(`localStorage cannot find item with key = ${name}`)
		}
		return JSON.parse(name)
	}

	remove(name) {
		localStorage.removeItem(name)
	}
}

export default Store