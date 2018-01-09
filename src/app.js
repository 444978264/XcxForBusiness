//app.js
import { login, setToken, recmd, $Location } from 'libs/api'
import { setItemSync, getItemSync, alert } from 'utils/util'
import { _wxlogin, _wxSetting, _wxUserInfo } from 'libs/wx_api'

import router from 'utils/route'

App({
  onLaunch: function (res) {
    console.log('this is launch', res)
    let { query } = res;
    this.globalData.page = query;
  },
  // 获取 定位
  getLocation({ success, fail }) {
    $Location.info((res) => {
      let { result } = res.originalData;
      this.globalData.location = result;
      success && success(res);
    }, (err) => {
      fail && fail(err);
    })
  },
  loading: false,
  login(fn) {
    this.checkLogin((code, { encryptedData, iv }) => {
      let params = {
        code: code,
        encryptedData,
        iv,
      };
      if (this.loading) return
      this.loading = true;
      //更新数据
      wx.showNavigationBarLoading() //在标题栏中显示加载
      login(params).then((res) => {
        wx.hideNavigationBarLoading(); //完成停止加载
        this.loading = false;
        if (!res) return
        setToken(res.token);
        setItemSync("userid", res.userid);
        setItemSync("token", res.token);
        fn && fn(res);
        let { recmd_userid } = this.globalData.page;
      });
    })
  },
  checkLogin: function (cb) {
    var that = this;
    let token = getItemSync('token');
    if (token) {
      // token存在就直接跳转index页面
      router.redirect('index')
    } else {
      //调用登录接口
      _wxlogin().then(code => {
        console.log(code)
        this.getUserInfo(code, cb);
      })
    }
  },
  getUserInfo(code, cb) {
    _wxUserInfo().then(res => {
      if (!res) {
        router.redirect('404', {
          from: 'login',
          prop: 'info'
        })
        return
      }
      this.globalData.userInfo = res.userInfo;
      setItemSync('userInfo', res.userInfo)
      typeof cb == "function" && cb(code, res)
    })
  },
  globalData: {
    userInfo: null,
    page: null,
    location: null
  },
})