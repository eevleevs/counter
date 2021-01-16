<!-- <svelte:head>
	<script src="https://cdn.jsdelivr.net/npm/gun/gun.js"></script>
	<script src="https://cdn.jsdelivr.net/npm/gun/sea.js"></script>
	<script src="https://cdn.jsdelivr.net/npm/gun/lib/open.js"></script>
	<script src="https://cdn.jsdelivr.net/npm/gun/lib/load.js"></script>
	<script src="https://cdn.jsdelivr.net/npm/gun/lib/webrtc.js"></script>
</svelte:head> -->

<script>	
	import { gun } from "./gun.js"
	let counters = gun.get('counters').map()
</script>

<div class="container-fluid">
	<div class="row">
		<div class="col-sm-8">
			<div><canvas id="chart"></canvas></div>
		</div>
		<div class="col">
			<div class="mt-2">
				<button type="button" class="period btn btn-outline-secondary">d</button>
				<button type="button" class="period btn btn-outline-secondary">w</button>
				<button type="button" class="period btn btn-outline-secondary">m</button>
				<button type="button" class="period btn btn-outline-secondary">y</button>
			</div>
			<table id="counters" class="mt-2">
				{#each $counters as [key, name]}
					<tr id="{key}">
						<td>{name}</td>
						<td><button class="increase btn btn-primary btn-floating"><i class="fas fa-plus"></i></button></td>
						<td><button class="decrease btn btn-primary btn-floating"><i class="fas fa-minus"></i></button></td>
						<td><button class="remove btn btn-primary btn-floating"><i class="fas fa-times"></i></button></td>
					</tr>					
				{/each}
			</table>
			<button type="button" class="btn btn-secondary m-3" id="new">new</button>
		</div>
	</div>
</div>