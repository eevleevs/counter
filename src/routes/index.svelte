<script>
	import { Chart } from 'chart.js'
	import { onMount } from 'svelte'
	import { get } from 'svelte/store'
	import { writable } from 'svelte-persistent-store/dist/local'

	// globals
	let starting = true
	let ms_day = 86400000
	let ms_period = null
	let values = {}

	// chart
	let chart 
	let chartColors = {
		red: 'rgb(255, 99, 132)',
		orange: 'rgb(255, 159, 64)',
		yellow: 'rgb(255, 205, 86)',
		green: 'rgb(75, 192, 192)',
		blue: 'rgb(54, 162, 235)',
		purple: 'rgb(153, 102, 255)',
		grey: 'rgb(201, 203, 207)'
	}

	// business
	let gun
	let period
	let periodValue = 'd'
	let counters
	let countersDict = {}

	// login
	let user = {}
	let credentials = writable('credentials', [])
	let [username, password] = get(credentials)
	let loginMessage = 'User will be created if not existing<br>There is <u>no</u> password recovery'


	function decreaseCounter(key) {
		var counter = counters.get(key)
		counter.once(items => {
			for (let key of Object.keys(items).splice(1).reverse())
				if (items[key]) {
					counter.get(key).put(null)
					break
				}
		})
	}


	function initDB() {
		starting = false
		user = user

		period = user.get('period')
		period.once(v => {
			if (typeof v == 'undefined')
				period.put({value: 'd'})
		})
		period.on(v => {
			periodValue = v.value
			ms_period = ms_day * {
				d: 1,
				w: 7,
				m: 30,
				y: 365
			}[v.value]
			updateChart()
		})
		
		counters = user.get('counters')
		counters.map().on((v,k) => {
			if (v && v.name) {
				countersDict[k] = v.name
				values[v.name] = Object.values(v).splice(1).filter(v => v || null)
			} else {
				delete countersDict[k]
				countersDict = countersDict
			}
			updateChart()
		})		
	}


	function logIn() {
		user.auth(username, password, at => {
			if (at.ack) 
				initDB()
			else
				user.create(username, password, initDB)
		})
		credentials.set([username, password])
	}


	function logOut() {
		user.leave()
		user = user
		credentials.set([])
		countersDict = {}
		values = {}
		updateChart()
	}


	function newCounter(name) {
		var name = prompt('enter name of the counter')
		if (!name)
			return
		if (Object.values(countersDict).includes(name)) {
			alert('already present')
			return
		}
		counters.set({name: name})
	}


	function removeCounter(key) {
		var counter = counters.get(key)
		counter.get('name').once(name => delete values[name])
		counter.put(null)
	}


	function updateChart() {
		if (!chart || !ms_period)
			return

		let range = (s, e) => Array.from('x'.repeat(e - s), (_, i) => s + i);

		var colors = Object.values(chartColors)
		var nextDay = Math.ceil(Date.now() / ms_day) * ms_day
		var items = 10

		chart.data.labels = range(-items+1, 1)
		chart.data.datasets = []

		for (let name of Object.keys(values).sort()) {
			let dataset = {
				borderColor: colors.shift(),
				data: new Array(items).fill(0),
				fill: false,
				label: name
			}
			for (let value of values[name]) {
				let index = Math.floor((nextDay-value) / ms_period)
				if (index<items)
				dataset.data[items-1-index] += 1
			}
			chart.data.datasets.push(dataset)
		}
		
		chart.update(0)
	}


	onMount(() => {
		chart = new Chart('chart', {
			type: 'line',
			data: {},
			options: {
				aspectRatio: 1.5,
				scales: {
					yAxes: [{
						ticks: {
							min: 0,
							precision: 0,
						}
					}]
				}
			}
		})
		
		gun = Gun(`${window.location.origin}/gun`)
		user = gun.user()
		if (username && password)
			logIn()
		else
			starting = false
	})
</script>


<div class="container-fluid m-3">
	<div class="row" class:hidden="{!user.is}">
		<div class="col-sm-7">
			<div><canvas id="chart"></canvas></div>
		</div>
		<div class="col" align="center">
			<div class="mt-2">
				{#each ['d', 'w', 'm', 'y'] as value}
					<button 
						on:click="{period.put({value: value})}" 
						class="btn btn-floating m-1"
						class:btn-primary="{periodValue == value}"
						class:btn-outline-primary="{periodValue != value}"
					>{value}</button>
				{/each}
			</div>
			<table id="counters" class="m-2">
				{#each Object.entries(countersDict) as [key, name]}
					<tr id="{key}">
						<td>{name}</td>
						<td><button on:click="{counters.get(key).set(Date.now())}" class="btn btn-secondary btn-floating"><i class="fas fa-plus"></i></button></td>
						<td><button on:click="{decreaseCounter(key)}" class="btn btn-secondary btn-floating"><i class="fas fa-minus"></i></button></td>
						<td><button on:click="{removeCounter(key)}" class="btn btn-secondary btn-floating"><i class="fas fa-times"></i></button></td>
					</tr>					
				{/each}
			</table>
			<button on:click="{newCounter}" class="btn btn-primary m-1">new</button>
			<button on:click="{logOut}" class="btn btn-primary m-1">log out</button>
		</div>
	</div>
	{#if !starting && !user.is}
		<div class="row">
			<div class="col mt-3">
				<form on:submit|preventDefault="{logIn}">
					<input class="m-1" type="text" bind:value="{username}" placeholder="user name"><br>
					<input class="m-1" type="password" bind:value="{password}" placeholder="password"><br>
					<div class="m-3">{@html loginMessage}</div>
					<button type="submit" class="btn btn-primary">log in</button>
				</form>
			</div>
		</div>
	{/if}
</div>