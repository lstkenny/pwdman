import { SRand } from "./srand.js"
import { EncryptedStorage } from "./encryptedstorage.js"
import { findPrime } from "./primes.js"
import md5 from "./md5.js"

function encodeKey(decoded) {
	return btoa(JSON.stringify(decoded))
}

function decodeKey(encoded) {
	return JSON.parse(atob(encoded))
}

function getKey(keyphrase) {
	const chunks = md5(keyphrase).match(/.{4}/g);
	const key = {}
	key.p = findPrime(parseInt(chunks[0], 16) + 1009)
	let i = 0
	do {
		key.q = findPrime(parseInt(chunks[++i], 16) + 1009)
	} while (key.p === key.q)
	return key
}

async function loadData(keyphrase) {
	const key = getKey(keyphrase)
	const eStorage = new EncryptedStorage({ key })
	await eStorage.setKeyphrase(keyphrase)
	return eStorage
}

function renderTable(data) {
	const table = document.getElementById("pwdlist") || document.createElement("table")
	table.textContent = ""
	table.classList.add("panel")
	const tbody = document.createElement("tbody")
	table.appendChild(tbody)
	data.forEach(item => {
		const tr = document.createElement("tr")
		tr.classList.add("control")

		const td1 = document.createElement("td")
		td1.textContent = item.domain
		tr.appendChild(td1)

		const td2 = document.createElement("td")
		td2.textContent = item.username
		tr.appendChild(td2)

		const td3 = document.createElement("td")
		td3.textContent = item.password
		tr.appendChild(td3)

		tbody.appendChild(tr)
	})
	document.body.appendChild(table)
}

let storage,
	inputSearch,
	controlSearch,
	inputKeyphrase,
	controlKeyphrase

document.addEventListener("DOMContentLoaded", e => {
	inputSearch = document.querySelector("input[name='search']")
	controlSearch = inputSearch.parentNode
	inputKeyphrase = document.querySelector("input[name='keyphrase']")
	controlKeyphrase = inputKeyphrase.parentNode
	inputSearch.addEventListener("input", e => {
		if (storage) {
			const data = storage.get()
			const domains = Object.keys(data).filter(item => item.indexOf(inputSearch.value) >= 0).map(domain => ({ domain, ...data[domain] }))
			renderTable(domains)
		}
	})
	inputKeyphrase.addEventListener("input", async e => {
		try {
			storage = await loadData(inputKeyphrase.value)
			controlKeyphrase.classList.remove("error")
		} catch (e) {
			controlKeyphrase.classList.add("error")
		}
	})
})