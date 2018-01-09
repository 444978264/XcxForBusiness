// login.js
import extend from '../../libs/extends.js';
let $app = getApp();
extend({
  /**
   * 页面的初始数据
   */
  data: {
    motto: '登录',
    userInfo: {},
    disabled: false,
    sxs_id: 'c1'
  },
  loading: false,
  inp_val:'c1',
  setVal({ detail ,...other}) {
    this.inp_val = detail.value;
    this.$http.setSxsID(this.inp_val);
    return detail.value
  },
  init() {
    this.$loading.start({
      title: '正在登录中...'
    })
    this.setItemSync('sxs_id',this.inp_val)
    $app.login(userInfo => {
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
  onLoad(){
    
  },
  onShow: function () {
    let token = this.getItemSync('token');
    let id = this.getItemSync('sxs_id');
    if(token&&id){
      this.$http.setSxsID(id);
      this.init();
    }else{
      this.$http.setSxsID(this.inp_val);
    }
  }
})