const counterApp = {
components: {
	counterChart,
	counterLogin,
},
data() { return {
	colors: [
		'rgb(255, 99, 132)',  // red
		'rgb(255, 159, 64)',  // orange
		'rgb(255, 205, 86)',  // yellow
		'rgb(75, 192, 192)',  // green
		'rgb(54, 162, 235)',  // blue
		'rgb(153, 102, 255)',  // purple
		'rgb(201, 203, 207)'  // grey
	],
	counters: {},
	loggedIn: false,
	period: 'd',
}},
watch: {
	period() {
		this.$user.get('period').put({value: this.period})
	},
},
created() {
	this.$user = Gun(`${window.location.origin}/gun`).user()
},
methods: {
	decreaseCounter(key) {
		let entries = Object.entries(this.counters[key].values)
		if (entries.length)
			this.$user.get('counters').get(key).get('values')
				.get(entries.pop()[0])
				.put(null)
	},
	increaseCounter(key) {
		this.$user.get('counters').get(key).get('values').set(Date.now())
	},
	initDB() {
		this.loggedIn = true
		this.$user.get('period').on(v => {
			this.period = v.value
		})
		let counters = this.$user.get('counters')
		counters.map().once((v,k) => {
			counters.get(k).open(v => {
				if (v)
					this.counters[k] = {
						name: v.name,
						values: Object.fromEntries(
							Object.entries(v.values).filter(v=>v[1])
						)
					}
				else
					delete this.counters[k]
			})
		})		
	},
	logOut() {
		this.loggedIn = false
		this.$user.leave()
		localStorage.setItem('credentials', '')
		this.counters = {}
	},
	newCounter() {
		let name = prompt('enter name of the counter')
		if (!name)
			return
		if (Object.values(this.counters).map(v=>v.name).includes(name)) {
			alert('already present')
			return
		}
		this.$user.get('counters').set({name: name, values: {}})
	},
	removeCounter(key) {
		if (confirm(`remove ${this.counters[key].name}?`))
			this.$user.get('counters').get(key).put(null)
	},
},
}