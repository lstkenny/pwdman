export function findPrimes(max, min = 1) {
	const k = Math.floor((max - 1) / 2)
	const l = Math.ceil((min - 1) / 2)
	const ks = Math.ceil(Math.sqrt(k))
	const a = {}
	for (let i = 1; i < ks; i++) {
		let j = i
		let x
		while ((x = i + j + 2 * i * j) <= k) {
			a[x] = 1
			j++
		}
	}
	const p = []
	for (let i = l; i < k; i++) {
		if (!a[i]) {
			p.push(i * 2 + 1)
		}
	}
	return p
}

export function isPrime(num) {
	if (num <= 3) return num > 1
	if ((num % 2 === 0) || (num % 3 === 0)) return false
	let count = 5
	while (Math.pow(count, 2) <= num) {
		if (num % count === 0 || num % (count + 2) === 0) return false
		count += 6
	}
	return true
}

export function findPrime(num, dir = 1) {
	while (!isPrime(num)) {
		num = num + dir
	}
	return num
}

export function findPrimeLesser(num) {
	return findPrime(num, -1)
}