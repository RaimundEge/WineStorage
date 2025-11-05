app.component('display', {
    template:
        /*html*/
        `<div class="display"> 
            <div class="item-right">
                {{last}} &nbsp;
                <button @click="getTemps()">Update</button>
            </div>
            <div class=item-left>
                <div class=line-one>
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
                    </select> &nbsp; 
                    <div class=item-radio>       
                        Select degrees:&nbsp;
                        <input type="radio" value="fahrenheit" v-model="degree"><label for="fahrenheit">Fahrenheit</label>
                        <input type="radio" value="celsius" v-model="degree"><label for="celsius">Celsius</label>
                    </div>
                </div>
                <div class=line-two>
                    Scale:&nbsp;&nbsp;<slider v-model="scale" :min="1" class="w-56"/>&nbsp;&nbsp;&nbsp;({{scale}}%)
                </div>
                <div class=line-three>
                    Smoothness:&nbsp;&nbsp;<slider v-model="interval" :min="1" class="w-56"/>&nbsp;&nbsp;&nbsp;({{interval}})
                </div>
            </div>               
            <line-chart :data="tempData" height="50vh" :min="min" :max="max" :points="false" :round="1" :colors="['#00FF00', '#0000FF', '#FF0000']" class="chart" empty="loading data ..."></line-chart>
        </div>`,
    data() {
        return {
            temps: null,
            average: 0,
            range: 'cold',
            oldRange: 'all',
            degree: 'fahrenheit',
            scale: 100,
            interval: 1
        }
    },
    methods: {
        async getTemps() {
            NProgress.start()
            var range = (this.range=='cold')?'day':this.range
            var resp = await axios.get('http://pione:3000/oldTemps/' + `?range=${range}`)
            // console.log(resp.data)
            this.temps = resp.data
            console.log("REST backend returned: " + this.temps.length + " temperature records")
            NProgress.done()
        },
        format(when) {
            // console.log('format: ', new Date(when).toString().slice(0, 21));
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
                var scaledTemps = [];
                if (this.scale != 100 || this.interval != 1) {
                    var newLength = Math.round(this.temps.length * this.scale / 100);
                    var incr = this.temps.length / newLength;
                    // console.log("scaledTemps length: " + newLength + ", incr: " + incr);
                    // new more dynamic style
                    var step = this.interval;
                    // console.log("scale: " + this.scale + ", step: " + step);
                    for (let i=0; i<newLength; i++) {
                        var oldIndex = Math.round(i * incr);
                        // console.log("averaging at: " + i + " from: " + oldIndex);
                        var start = ((oldIndex-step)<0)?0:(oldIndex-step);
                        var stop = ((oldIndex+step)>=this.temps.length)?this.temps.length-1:(oldIndex+step);
                        // console.log("start: " + start + ", stop: " + stop);
                        var selectedData = { ...this.temps[oldIndex]};
                        var count = 0;
                        var sum = 0;
                        for (let j=start; j<=stop; j++) {
                            sum += this.temps[j].value;
                            count++
                        }
                        selectedData.value = sum / count;
                        // console.log(selectedData);
                        if (i!=0) {
                            if (i==newLength-1) {
                                selectedData.time = this.temps[stop].time;
                            } else {
                                var startTime = new Date(this.temps[start].time).getTime();
                                var stopTime = new Date(this.temps[stop].time).getTime();
                                selectedData.time = (startTime + stopTime)/2;
                                
                            }
                        }
                        // console.log("newTime: " + selectedData.time);
                        scaledTemps.push(selectedData);
                    }
                    console.log("scaledTemps length: " + scaledTemps.length + ", interval: " + this.interval);
                } else {
                    scaledTemps = [...this.temps];
                }
                var average = 0;
                
                if (scaledTemps.length > 0) {
                    for (var item of scaledTemps) {
                        // console.log(item)
                        // console.log(this.temps.length)
                        average += (this.degree == 'celsius' ? item.value : ((item.value * 9 / 5) + 32))
                        computedData[this.format(item.date)] = this.degree == 'celsius' ? item.value : ((item.value * 9 / 5) + 32)
                        idealLow[this.format(item.date)] = this.degree == 'celsius' ? 16.0 : 61.0
                        idealHigh[this.format(item.date)] = this.degree == 'celsius' ? 18.0 : 68.0
                    }
                    // console.log('recomputed average: ' + average + ', ' + this.temps.length + ', ' + (average/this.temps.length))
                    this.average = average/scaledTemps.length
                }
            }
            if (this.range.includes('hour') || this.range.includes('day') || this.range.includes('cold')) {
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
                var lastEntry = this.temps[0]
                var temp = Math.round((this.degree == 'celsius' ? lastEntry.value : ((lastEntry.value * 9 / 5) + 32)) * 10) / 10 + '\xB0'
                var avg = Math.round(this.average * 10) / 10 + '\xB0'
                return temp + "(avg: " + avg + ") at " + this.format(lastEntry.date)
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
