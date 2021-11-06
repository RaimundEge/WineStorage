app.component('display', {
    template:
        /*html*/
        `<div class="display"> 
            <button class="item-right" @click="getTemps()">Update</button>
            Show: <select v-model="range">
                    <option value="all">all</option>
                    <option value="today">today</option>
                    <option value="seven">week</option>
                    <option value="thirty">30 days</option>
                </select>            
            <line-chart :data="data"></line-chart>
         </div>`,
    data() {
        return {
            temps: null,
            range: 'all',
            oldRange: 'all'
        }
    },
    methods: {
        async getTemps() {
            var resp = await axios.get('http://192.168.1.23:5000/' + `?range=${this.range}`)
            // console.log(resp.data);
            // this.temps = {}
            // for (var item of resp.data) {
            //     // console.log(item)
            //     this.temps[this.format(item.when["$date"])] = item.temp
            // }  
            this.temps = resp.data         
            console.log(this.temps)
        },
        format(when) {
            return new Date(when).toUTCString().slice(0,22)
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
                    console.log(item)
                    data[this.format(item.when["$date"])] = item.temp
                } 
            }  
            return data
        }
    }
})