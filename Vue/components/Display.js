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
            <line-chart :data="data" class="chart" empty="loading data ..."></line-chart>
         </div>`,
    data() {
        return {
            temps: null,
            range: 'hour',
            oldRange: 'all'
        }
    },
    methods: {
        async getTemps() {
            NProgress.start()
            var resp = await axios.get('http://192.168.1.23:5000/' + `?range=${this.range}`)
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
                    data[this.format(item.when["$date"])] = item.temp
                } 
            }             
            return data
        }
    }
})