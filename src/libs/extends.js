import { options, $router } from "../utils/index"
import $http, { TOKEN, getImg } from './api';
import wxApi from './wx_api';
import _ from './deepcopy';
import shareConfig from '../config/share.config';
import config_audio, { recorderManager, innerAudioContext, needImport } from "./config_audio";
import './polyfill'

console.log(wxApi)

var config = {
    data: {
        has_next: true
    },
    // 通用方法
    ...options,

    //微信的一些通用api
    ...wxApi,
    // 录音&播放配置
    // ...config_audio,

    //接口
    $http,

    //初次渲染开关，防止onLoad 和 onShow 中事件多次触发，在onReady 中 关闭
    $firstRender: true,

    // 预加载---未实现
    $preLoad(path) {

    },

    // 发送formid
    $sendFormId(e) {
        let data = e.detail;
        this.$http.formid({
            form_id: data.formId
        }).then(res => {
            if (!res) return
            console.log(res)
        })
    },

    // 设置导航
    $setBar(params) {
        wx.setNavigationBarColor({
            ...params,
            animation: {
                duration: 300,
                timingFunc: 'linear'
            }
        })
    },

    onReady: function () {
        this.$firstRender = false;
    },

    // 需要下拉刷新的函数需写在fetch中  并 由 $openRefresh=>true函数 来开启
    onPullDownRefresh: function () {
        if (!this.$openRefresh || !this.$openRefresh()) return;
        wx.showNavigationBarLoading() //在标题栏中显示加载
        this.fetch().then(() => {
            wx.hideNavigationBarLoading() //完成停止加载
            wx.stopPullDownRefresh() //停止下拉刷新
        });
    },

    // 用户点击右上角分享
    $shareParams: {
        title: '云锐商城',
        desc: '云锐商城，想你所想!',
        params: null,
        // imageUrl: getImg('share_now.png'),
        path: '/pages/index/index',
        success: function (res) {
            console.log(res)
        },
    },
    onShareAppMessage: function () {
        wx.updateShareMenu({
            withShareTicket: true,
            success() {
                console.log("更新转发配置成功")
            }
        });
        let router = getCurrentPages();
        let len = router.length - 1;
        const route = router[len].route;
        let { title, desc, params, path, ...other } = this.$shareParams;
        // 当前页面是否在允许转发的配置里
        if (shareConfig.includes(route)) {
            path = route;
        }
        if (params) {
            params.recmd_userid = this.getItemSync('userid')
        } else {
            params = {};
            params.recmd_userid = this.getItemSync('userid')
        }
        let str = this.serialize(params);
        console.log(`${path}${str}`)
        return {
            title,
            desc,
            path: `${path}${str}`,
            ...other
        }
    }
}
export default function Init(params) {
    let init = _.extend(true, {}, config, params);
    // 不可放进config中，深拷贝会复制多个全局对象
    if (needImport) {
        init.recorderManager = recorderManager;
        init.innerAudioContext = innerAudioContext;
    }
    init.$router = $router;
    Page(init);
}