app.component('display', {
    template:
        /*html*/
        `<div class="display"> 
            <div class="item-right">
                {{last}} &nbsp;
                <button @click="getTemps()">Update</button>
            </div>
            Show: <select v-model="range">
                    <option value="all">all</option>
                    <option value="hour">last hour</option>
                    <option value="2hours">last 2 hours</option>
                    <option value="6hours">last 6 hours</option>
                    <option value="12hours">last 12 hours</option>
                    <option value="day">last 24 hours</option>
                    <option value="2day">last 48 hours</option>
                    <option value="week">last 7 days</option>
                    <option value="month">last 30 days</option>
                    <option value="cold">Cold Room</option>
                </select>         
                &nbsp;&nbsp;&nbsp;&nbsp;Select degrees&nbsp;
                <input type="radio" value="fahrenheit" v-model="degree"><label for="fahrenheit">Fahrenheit</label>
                <input type="radio" value="celsius" v-model="degree"><label for="celsius">Celsius</label>
            <line-chart :data="tempData" height="50vh" :min="min" :max="max" :points="false" :round="1" :colors="['#00FF00', '#0000FF', '#FF0000']" class="chart" empty="loading data ..."></line-chart>
         </div>`,
    data() {
        return {
            temps: null,
            average: 0,
            range: 'cold',
            oldRange: 'all',
            degree: 'fahrenheit'
        }
    },
    methods: {
        async getTemps() {
            NProgress.start()
            var range = (this.range=='cold')?'day':this.range
            var resp = await axios.get('data/' + `?range=${range}`)
            // console.log(resp.data)
            this.temps = resp.data
            console.log("REST service returned: " + this.temps.length + " temperature records")
            NProgress.done()
        },
        format(when) {
            return new Date(when).toString().slice(0, 21)
        }
    },
    computed: {
        tempData() {
            var computedData = {}
            var idealLow = {}
            var idealHigh = {}
            if (this.temps == null || this.range !== this.oldRange) {
                this.getTemps()
                this.oldRange = this.range
            } else {
                var average = 0;
                // console.log(this.temps.length)
                if (this.temps.length > 0) {
                    for (var item of this.temps) {
                        // console.log(item)
                        // console.log(this.temps.length)
                        average += (this.degree == 'celsius' ? item.temp : ((item.temp * 9 / 5) + 32))
                        computedData[this.format(item.when["$date"])] = this.degree == 'celsius' ? item.temp : ((item.temp * 9 / 5) + 32)
                        idealLow[this.format(item.when["$date"])] = this.degree == 'celsius' ? 16.67 : 62.0
                        idealHigh[this.format(item.when["$date"])] = this.degree == 'celsius' ? 18.89 : 66.0
                    }
                    // console.log('recomputed average: ' + average + ', ' + this.temps.length + ', ' + (average/this.temps.length))
                    this.average = average/this.temps.length
                }
            }
            if (this.range.includes('hour')) {
                return [{ name: 'actual', data: computedData }, { name: 'ideal Low', data: idealLow }, { name: 'ideal High', data: idealHigh }]
            } else {
                return [{ name: 'actual', data: computedData }]
            }
        },
        last() {
            if (this.temps == null || this.temps.length == 0) {
                return ""
            } else {
                // console.log(this.temps.length)
                var lastEntry = this.temps[this.temps.length - 1]
                var temp = Math.round((this.degree == 'celsius' ? lastEntry.temp : ((lastEntry.temp * 9 / 5) + 32)) * 10) / 10 + '\xB0'
                var avg = Math.round(this.average * 10) / 10 + '\xB0'
                return temp + "(avg: " + avg + ") at " + this.format(lastEntry.when["$date"])
            }
        },
        min() {
            return this.degree == 'celsius' ? 10 : 50;
        },
        max() {
            return this.degree == 'celsius' ? 38 : 100;
        }
    }
})
