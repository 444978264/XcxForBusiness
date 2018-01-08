// test.js
import extend from '../../libs/extends.js';
import _ from '../../libs/deepcopy';
import { modal } from '../template/template'
let init = _.extend(true, {
    $openRefresh() {
        this.paramsInit();
        return true
    },
    data: {
        list: [],
        navs: ['全部', '待付款', '待发货', '待收货', '已完成'],
        active: 0,
    },
    page: 1,
    pagesize: 20,
    has_next: true,
    loading: false,
    paramsInit() {
        this.page = 1;
        this.has_next = true;
        let list = [];
        this.setData({ list })
    },
    order_status: null,
    fetch() {
        if (this.loading) return
        this.loading = true;
        return this.$http.orderLst({
            page: this.page,
            pagesize: this.pagesize,
            ...this.order_status
        }).then(res => {
            this.loading = false;
            if (!res) return
            this.has_next = res.has_next;
            this.page++;
            let { list } = this.data;
            res.rows.forEach(function (elem) {
                elem.goods_id_s = elem.goods_id_s.split(',');
                elem.img_s = elem.img_s.split(',');
                elem.name_s = elem.name_s.split(',');
                elem.real_price_s = elem.real_price_s.split(',');
                elem.goods_num_s = elem.goods_num_s.split(',');
                elem._goods = [];
                for (let i = 0; i < elem.goods_num_s.length; i++) {
                    elem._goods.push({
                        img: elem.img_s[i],
                        goods_id_s: elem.goods_id_s[i],
                        name_s: elem.name_s[i],
                        real_price_s: elem.real_price_s[i],
                        goods_num_s: elem.goods_num_s[i],
                    })
                }
            })
            list = list.concat(res.rows);
            this.setData({
                list,
                has_next:res.has_next
            })
            console.log(res)
        })
    },
    selectNav(e) {
        if (this.loading) return
        let { active, status } = this.dataset(e);
        switch (status) {
            case '待付款':
                this.order_status = {
                    pay: 0,
                    dist: 0
                }
                break
            case '待发货':
                this.order_status = {
                    pay: 1,
                    dist: 0
                }
                break
            case '待收货':
                this.order_status = {
                    pay: 1,
                    dist: 1
                }
                break
            case '已完成':
                this.order_status = {
                    status: 5
                }
                break
            default:
                this.order_status = null;
                break
        }
        this.setData({ active }, () => {
            this.paramsInit();
            this.fetch();
        })
    },
    cancel(e) {
        let { id, no, idx } = this.dataset(e);
        this.$message(`确定取消"${no}"订单嘛?`, {
            success: res => {
                this.$http.cancelOrder({
                    id
                }).then(res => {
                    if (!res) return
                    let { list } = this.data;
                    list.splice(idx, 1);
                    this.setData({ list })
                    console.log(res)
                })
            },
            showCancel: true
        })
    },
    confirm(e) {
        let { id, idx } = this.dataset(e);
        this.$http.confirmOrder({
            id
        }).then(res => {
            if (!res) return
            let { list } = this.data;
            list.splice(idx, 1);
            this.setData({ list })
            console.log(res)
        })
    },
    onLoad({ pay, dist, type }) {
        if(pay>=0&&dist>=0){
            this.order_status = {
                pay,
                dist
            }
        }
        let idx = this.data.navs.indexOf(type);
        let active = idx > -1 ? idx : 0;
        this.setData({
            active
        })
        this.fetch();
    },
    onShow() {
        this._getPayments();
    },
    onReachBottom() {
        if (!this.has_next) return;
        this.fetch()
    }
}, modal)
extend(init);