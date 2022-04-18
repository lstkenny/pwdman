import { SRand } from "./srand.js"
import { Storage } from "./storage.js"
export { EncryptedStorage }

class EncryptedStorage {
	constructor(options) {
		this.key = options.key || {}
		this.namespace = options.namespace || "pwd"
		this.keyphrase = options.keyphrase || Date.now()
		this.range = options.range || 256
		this.storage = new Storage()
		this.data = {}
	}
	async setKeyphrase(keyphrase) {
		this.keyphrase = keyphrase
		await this.loadData()
	}
	transform(input, dir = 1) {
		if (!input) {
			return input
		}
		const rand = new SRand(this.keyphrase, this.key)
		let output = ""
		for (let i = 0; i < input.length; i++) {
			const code = input.charCodeAt(i) + rand.rndInteger(0, this.range) * dir
			output += String.fromCharCode(code)
		}
		return output
	}
	encrypt(decoded) {
		return this.transform(decoded, 1)
	}
	decrypt(encoded) {
		return this.transform(encoded, -1)
	}
	async loadData() {
		try {
			this.data = JSON.parse(
				this.decrypt(
					await this.storage.get(this.namespace)
				)
			) || {}
		} catch(e) {
			throw "Wrong keyphrase"
		}
	}
	async saveData() {
		return await this.storage.set(
			this.namespace, 
			this.encrypt(
				JSON.stringify(this.data)
			)
		)
	}
	get(key, dflt = null) {
		if (!key) {
			return this.data
		}
		if (typeof this.data[key] === "undefined") {
			return dflt
		}
		return this.data[key]
	}
	async set(key, value) {
		this.data[key] = value
		await this.saveData()
	}
	async remove(key) {
		if (typeof this.data[key] === "undefined") {
			return
		}
		delete this.data[key]
		await this.saveData()
	}
	async clear() {
		this.data = {}
		await this.storage.clear()
	}
}