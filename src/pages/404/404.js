/**
 * @params :from = from;
 * @params :prop = setMap[prop];
 */

import extend from '../../libs/extends'

const setMap = {
    info: {
        code: 'scope.userInfo',
        title: "未获得用户信息授权",
        icon: '../../img/user_icon.svg'
    },
    location: {
        code: 'scope.userLocation',
        title: '未获得地理位置授权',
        icon: '../../img/no_location.svg'
    },
    record: {
        code: 'scope.record',
        title: '未获得录音功能授权',
        icon: '../../img/voice_icon.svg'
    },
}
let app = getApp();
extend({
    data: {
        iconSize: 100,//默认80
        icon: '../../img/config.svg',//显示tipInfo左边的icon
        title: '未获得授权',
        btnInfo: '获取授权',
    },
    from: null,
    prop: null,
    btnDefault() {
        this.$message('确定要重新获取授权嘛？', {
            success: res => {
                this.getUser();
            },
            showCancel: true
        })
    },
    getUser() {
        this._wxSetting.set().then(res => {
            console.log(res)
            let code = this.prop ? setMap[this.prop].code : setMap.info.code;
            switch (code) {
                case 'scope.userLocation':
                    if (res.authSetting[code]) {
                        app.getLocation({
                            success: () => {
                                this.goback();
                            }
                        })
                    }
                    break
                case 'scope.userInfo':
                    if (this.from && res.authSetting[code]) {
                        this.$router.redirect(this.from);
                    }
                    break
                case 'scope.record':
                    if (res.authSetting[code]) {
                        this.goback();
                    }
                    break
                default:
                    break
            }
        })
    },
    onLoad: function (params) {
        let { from, prop } = params;
        this.from = from;
        this.prop = prop;
        if (setMap[prop]) {
            let { code, ...other } = setMap[prop]
            this.setData({
                ...other
            })
        }
    }
})