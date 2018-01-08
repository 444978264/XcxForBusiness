// test.js
import extend from '../../libs/extends.js';
const wxCharts = require('../../libs/wx-charts.min.js');
extend({
    $openRefresh() {
        this.paramsInit();
        return true;
    },
    data: {
        list: []
    },
    page: 1,
    page: 20,
    has_next: true,
    paramsInit() {
        this.setData({
            list: []
        })
        this.page = 1;
    },
    fetch() {
        return this.$http.performance({
            type: 'all'
        }).then(res => {
            if (!res) return
            let { list } = this.data;
            console.log(res)
            list = list.concat(res.rows);
            this.setData({
                list
            }, () => {
                this.has_next = res.has_next;
                this.page++;
            })
        })
    },
    getPerformance() {
        this.$http.performance().then(res => {
            if (!res) return
            let { list } = this.data;
            console.log(res)
            list = list.concat(res.rows);
            this.setData({
                list
            }, () => {
                this.has_next = res.has_next;
                this.page++;
            })
        })
    },
    getTrend() {
        this.$http.trendOfWeak().then(res => {
            if (!res) return
            console.log(res)
            new wxCharts({
                canvasId: 'chart',
                width: 320,
                height: 200,
                type: 'line',
                categories: res.map(el => el.date_name),
                series: [{
                    name: '成交量1',
                    data: res.map(el => el.count),
                    format: function (val) {
                        return val + '人';
                    }
                }],
            })
        })
    },
    getMembers() {
        this.$http.members().then(res => {
            if (!res) return
            let { list } = this.data;
            console.log(res)
            list = list.concat(res.rows);
            this.setData({
                list
            }, () => {
                this.has_next = res.has_next;
                this.page++;
            })
        })
    },
    onShow() {
        this.fetch();
        this.getTrend();
        console.log(wxCharts)
    }
});