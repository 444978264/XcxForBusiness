// test.js
import extend from '../../libs/extends.js';
const wxCharts = require('../../libs/wx-charts.min.js');
extend({
    $openRefresh() {
        this.paramsInit();
        return true;
    },
    data: {
        list: [],
        current: 'today',
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
    getSource(e) {
        let { type } = this.dataset(e);
        if (type == this.data.current) return
        this.setData({
            current: type
        }, () => {
            this.paramsInit();
            this.fetch();
        })
    },
    fetch() {
        return this.$http.performance({
            type: this.data.current
        }).then(res => {
            if (!res) return
            let { list } = this.data;
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
        const w = this._system.windowWidth;
        this.$http.trendOfWeak().then(res => {
            if (!res) return
            console.log(res)
            new wxCharts({
                canvasId: 'chart',
                width: w * 0.85,
                height: 150,
                type: 'line',
                categories: res.map(el => el.date_name.substring(5)),
                series: [{
                    name: '注册人数',
                    data: res.map(el => el.count),
                    format: function (val) {
                        return val + '人';
                    }
                }],
            })
        })
    },
    getMembers() {
        const w = this._system.windowWidth;
        this.$http.members().then(res => {
            if (!res) return
            console.log(res)
            new wxCharts({
                canvasId: 'chart2',
                width: w * 0.85,
                height: 150,
                type: 'column',
                categories: ['活跃人数', '总人数'],
                series: [
                    {
                        name: '活跃人数',
                        data: [res.count_today],
                    },
                    {
                        name: '总人数',
                        data: [res.count_all],
                    }
                ],
                dataLabel: true
            })
        })
    },
    onLoad(){
        this.fetch();
    },
    onShow() {
        this.getTrend();
        this.getMembers();
    }
});