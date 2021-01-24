const counterChart = {
extends: Line,
props: {
    period: null,
    colors: {},
    counters: {},
},
watch: {
    period() { this.update() },
    counters: {
        handler() { this.update() },
        deep: true,
    }
},
methods: {
    update() {
        let range = (s, e) => Array.from('x'.repeat(e - s), (_, i) => s + i);
    
        let ms_day = 86400000
        let ms_period = ms_day * {
            d: 1,
            w: 7,
            m: 30,
            y: 365
        }[this.period]
    
        let colors = [...this.colors]
        let nextDay = Math.ceil(Date.now() / ms_day) * ms_day
        let items = 10
        
        let data = {
            datasets: [],
            labels: range(-items+1, 1),
        }
    
        for (let [key,counter] of Object.entries(this.counters)) {
            let dataset = {
                borderColor: colors.shift(),
                data: new Array(items).fill(0),
                fill: false,
                label: counter.name
            }
            for (let value of Object.values(counter.values)) {
                let index = Math.floor((nextDay-value) / ms_period)
                if (index<items)
                dataset.data[items-1-index] += 1
            }
            data.datasets.push(dataset)
        }
        console.log(data)
        this.renderChart(data, {
            animation: false,
            aspectRatio: 1.5,
            legend: {
                display: false,
            },
            scales: {
                yAxes: [{
                    ticks: {
                        min: 0,
                        precision: 0,
                    }
                }]
            }
        })
    },
},
}