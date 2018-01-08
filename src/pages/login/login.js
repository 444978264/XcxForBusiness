// login.js
import extend from '../../libs/extends.js';
let $app = getApp();
extend({
  /**
   * 页面的初始数据
   */
  data: {
    motto: '进入',
    userInfo: {},
    disabled: true
  },
  loading: false,
  /**
   * 生命周期函数--监听页面加载
   */
  init() {
    if (this.loading) return;
    this.$loading.start({
      title: '正在登录中...'
    })
    this.loading = true;
    wx.showNavigationBarLoading() //在标题栏中显示加载
    $app.login(userInfo => {
      this.loading = false;
      wx.hideNavigationBarLoading() //完成停止加载
      //更新数据
      this.setData({
        userInfo: userInfo,
        disabled: false
      })
      if (getCurrentPages().length > 1) {
        this.goback();
      } else {
        this.$router.redirect('index');
      }
    })
  },
  defaultTap() {
    this.$router.push('index')
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.init();
  }
})