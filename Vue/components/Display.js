app.component('display', {
    template:
        /*html*/
        `<div class="display"> 
            <button class="item-right" @click="getTemps()">Update</button>
            Show: <select v-model="range">
                    <option value="all">all</option>
                    <option value="hour">last 12 hours</option>
                    <option value="day">last 24 hours</option>
                    <option value="week">last 7 days</option>
                    <option value="month">last 30 days</option>
                </select>         
                &nbsp;&nbsp;&nbsp;&nbsp;Select degrees&nbsp;
                <input type="radio" value="fahrenheit" v-model="degree"><label for="fahrenheit">Fahrenheit</label>
                <input type="radio" value="celsius" v-model="degree"><label for="celsius">Celsius</label>
            <line-chart :data="data" :points="false" :round="1" class="chart" empty="loading data ..."></line-chart>
         </div>`,
    data() {
        return {
            temps: null,
            range: 'hour',
            oldRange: 'all',
		degree: 'fahrenheit'
        }
    },
    methods: {
        async getTemps() {
            NProgress.start()
            var resp = await axios.get('data/' + `?range=${this.range}`)
            this.temps = resp.data         
            // console.log(this.temps)
            NProgress.done()
        },
        format(when) {
            return new Date(when).toString().slice(0,22)
        }
    },
    computed: {
        data() {            
            var data = {}
            if (this.temps == null || this.range !== this.oldRange) {
                this.getTemps()
                this.oldRange = this.range
            } else {
                for (var item of this.temps) {
                    // console.log(item)
                    data[this.format(item.when["$date"])] = this.degree == 'celsius'?item.temp:((item.temp*9/5)+32)
                } 
            }             
            return data
        }
    }
})
