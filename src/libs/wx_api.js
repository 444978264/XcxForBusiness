import Factory from './promise_factory';

const setMap = {
    info: "scope.userInfo",	//wx.getUserInfo	用户信息
    location: "scope.userLocation",	//wx.getLocation, wx.chooseLocation	地理位置
    address: "scope.address",//wx.chooseAddress	通讯地址
    invoice: "scope.invoiceTitle",//wx.chooseInvoiceTitle	发票抬头
    run: "scope.werun",//wx.getWeRunData	微信运动步数
    record: "scope.record",	//wx.startRecord	录音功能
    photo: "scope.writePhotosAlbum",//wx.saveImageToPhotosAlbum, wx.saveVideoToPhotosAlbum	保存到相册
    camera: "scope.camera",	//摄像头
}

// 微信登录
export const _wxlogin = () => Factory((resolve, reject) => {
    wx.login({
        success: ({ code, errMsg }) => {
            if (code) {
                resolve(code)
            } else {
                console.log('获取用户登录态失败', errMsg)
                resolve(false)
            }
        },
        fail: err => reject(err)
    })
})
// 检查登录态
export const _checkSession = () => Factory((resolve, reject) => {
    wx.checkSession({
        success: res => resolve(true),
        fail: err => {
            resolve(false)
            // reject(err)
        }
    })
}).then(res => {
    if (!res) {
        //登录态过期
        return wxlogin()
    }
})
// 微信授权
export const _wxAuth = code => {
    let scope = setMap[code];
    return Factory((resolve, reject) => {
        wx.authorize({
            scope: scope,
            success: res => resolve(res),
            fail: err => reject(err)
        })
    })
}
export const _wxSetting = {
    get: code => {
        let scope = setMap[code];
        let p = Factory((resolve, reject) => {
            wx.getSetting({
                success: res => resolve(res),
                fail: err => reject(err)
            })
        })
        return p.then(res => {
            //未授权，重新获取授权
            if (!res.authSetting[scope]) {
                return wxAuth(code)
            }
            return true
        })
    },
    set: () => {
        return Factory((resolve, reject) => {
            wx.openSetting({
                success: res => resolve(res),
                fail: err => reject(err)
            })
        })
    }
}
// 获取个人信息
export const _wxUserInfo = () => Factory((resolve, reject) => {
    wx.getUserInfo({
        success: res => resolve(res),
        fail: err => {
            console.log(err)
            resolve(false);
            // reject(err)
        }
    })
})
//微信支付
export const _wxPay = ({ success, fail, complete, ...params }) => {
    return Factory((resolve, reject) => {
        wx.requestPayment({
            ...params,
            success: res => resolve(res),
            fail: err => reject(err)
        })
    })
}

export default {
    _checkSession,
    _wxSetting,
    _wxUserInfo,
    _wxlogin,
    _wxPay,
    _wxAuth
}