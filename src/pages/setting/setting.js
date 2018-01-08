// test.js
import extend from '../../libs/extends.js';
const app = getApp();
extend({
    data: {
        mobile: null,
    },
    getAuth() {
        wx.openSetting({
            success: (res) => {
                this.alert('设置成功')
            }
        })
    },
    clearStorage() {
        this.clearStorageSync();
        this.$http.setToken();
        this.$message('清除成功,需要重新登录', {
            success: () => {
                this.goback();
            }
        })
    },
    onShow() {
        this.$http.balance().then(res => {
            if (!res) return
            if (res.g_info.mobile) {
                this.setData({
                    mobile: res.g_info.mobile
                })
            }
        })
    }
});