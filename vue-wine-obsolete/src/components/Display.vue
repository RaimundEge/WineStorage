<script>
import axios from 'axios';

export default {
    props: {
        msg: String
    },
    data() {
        return {
            temps: null,
            average: 0,
            range: 'cold',
            oldRange: 'all',
            degree: 'fahrenheit',
            scale: 100,
            progress: 0
        }
    },
    methods: {
        async getTemps() {
            this.progress = 10;
            var range = (this.range=='cold')?'day':this.range
            var resp = await axios.get('https://wine.ege.com/data/' + `?range=${range}`)
            this.progress = 50;
            // console.log(resp.data)
            this.temps = resp.data
            console.log("REST service returned: " + this.temps.length + " temperature records")
            this.progress = 100;
        },
        format(when) {
            return new Date(when).toString().slice(0, 21)
        }
    },
    computed: {
        tempData() {
            var computedData = []
            var labels = []
            var idealLow = []
            var idealHigh = []
            if (this.temps == null || this.range !== this.oldRange) {
                this.getTemps()
                this.oldRange = this.range
            } else {
                var scaledTemps = [];
                if (this.scale != 100) {
                    var newLength = Math.round(this.temps.length * this.scale / 100);
                    
                    // fill resized target array with data "around" computed key
                    var incr = this.temps.length / newLength;
                    scaledTemps.push(this.temps[0]);
                    for (let i=1; i<newLength-1; i++) {
                        var oldIndex = Math.round(i * incr);
                        var selectedData = { ...this.temps[oldIndex]};
                        // compute average of adjacent data
                        var count = 1;
                        var sum = selectedData.value;
                        if (oldIndex > 1) {
                            sum += this.temps[oldIndex-1].value;
                            count++;
                        }
                        if (oldIndex < oldIndex-2) {
                            sum += this.temps[oldIndex+1].value;
                            count++;
                        }
                        selectedData.value = sum / count;
                        scaledTemps.push(selectedData);
                    }
                    scaledTemps.push(this.temps[this.temps.length-1]);
                } else {
                    scaledTemps = [...this.temps];
                }
                var average = 0;
                console.log("scaledTemps length: " + scaledTemps.length)
                if (scaledTemps.length > 0) {
                    for (var item of scaledTemps) {
                        // console.log(item)
                        // console.log(this.temps.length)
                        average += (this.degree == 'celsius' ? item.value : ((item.value * 9 / 5) + 32))
                        labels.push(this.format(item.time))
                        computedData.push(this.degree == 'celsius' ? item.value : ((item.value * 9 / 5) + 32))
                        idealLow.push(this.degree == 'celsius' ? 16.67 : 62.0)
                        idealHigh.push(this.degree == 'celsius' ? 18.89 : 66.0)
                    }
                    // console.log('recomputed average: ' + average + ', ' + this.temps.length + ', ' + (average/this.temps.length))
                    this.average = average/scaledTemps.length;
                    console.log(computedData)
                }
            }
            if (this.range.includes('hour')) {
                return [{ name: 'actual', data: computedData }, { name: 'ideal Low', data: idealLow }, { name: 'ideal High', data: idealHigh }]
            } else {
                return {labels: labels, datasets: [{ label: 'actual', data: computedData } ]}
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
                return temp + "(avg: " + avg + ") at " + this.format(lastEntry.time)
            }
        },
        min() {
            return this.degree == 'celsius' ? 10 : 50;
        },
        max() {
            return this.degree == 'celsius' ? 38 : 100;
        }
    }
}
</script>

<template>
        <div class="display"> 
            <div class="item-right">
                {{last}} &nbsp;
                <button @click="getTemps()">Update {{ msg }}</button>
            </div>
            <div class=item-left>
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
                &nbsp;&nbsp;&nbsp;&nbsp;Select degrees:&nbsp;
                <input type="radio" value="fahrenheit" v-model="degree"><label for="fahrenheit">Fahrenheit</label>
                <input type="radio" value="celsius" v-model="degree"><label for="celsius">Celsius</label>
                &nbsp;&nbsp;&nbsp;&nbsp;Scale:&nbsp;&nbsp;<input type="range" v-model="scale" :min="1"/>&nbsp;&nbsp;&nbsp;({{scale}}%)
            </div>               
            <Chart type="line" :data="tempData" ></Chart>
            <progress :value="progress" max="100" />
        </div>
</template>

