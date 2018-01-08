/*
*@录音 & 播放配置
*/

// 全局录音--唯一
export const recorderManager = wx.getRecorderManager();
// 全局播放--唯一
export const innerAudioContext = wx.createInnerAudioContext();

export let needImport = false;

let config = {
    // 播放    
    $play(url) {
        url = `${url}?time=${+new Date()}`;
        this.innerAudioContext.autoplay = true;
        this.innerAudioContext.src = url;
        this.innerAudioContext.onPlay(() => {
            console.log('开始播放')
        })
        this.innerAudioContext.onError((res) => {
            console.log(res.errCode, res.errMsg)
        })
    },
    // 上传文件
    uploadFile(tempFilePath, data, cbk) {
        console.log('开始上传文件', "upload")
        wx.uploadFile({
            url: this.$http.uploadUrl,
            filePath: tempFilePath,
            name: 'file',
            formData: {
                ...data,
                token: TOKEN
            },
            success: res => {
                let result = JSON.parse(res.data);
                console.log(result)
                if (result.code <= -9999) {
                    this.removeItemSync('token');
                    this.$push('login');
                    return
                }
                if (result.code < 0) {
                    this.alert(result.msg)
                    return
                }
                console.log('上传成功，开始识别语音')
                cbk && cbk(result)
            },
            fail: err => {
                console.log(err)
            }
        })
    },
    // 录音
    $recordStart(id, cbk) {
        const options = {
            duration: 15000,
            sampleRate: 16000,
            numberOfChannels: 1,
            encodeBitRate: 24000,
            format: 'aac',//'mp3',
            frameSize: 50
        }
        this.recorderManager.onStart(() => {
            console.log(this.$http.getImg('voice2.svg'))
            wx.showToast({
                title: '正在录音...',
                mask: true,
                icon: 'loading',
                image: '../../img/voice.png',
                duration: options.duration
            })
        })
        // 停止事件回调
        this.recorderManager.onStop((res) => {
            console.log('recorder stop', res)
            wx.hideToast();
            this.$loading.start({
                title: '开始识别语音'
            })
            const { tempFilePath } = res;
            this.uploadFile(tempFilePath, id, cbk)
        })

        // 检查是否获得录音权限
        wx.getSetting({
            success: res => {
                console.log(res);
                if (!res.authSetting['scope.record']) {
                    wx.authorize({
                        scope: 'scope.record',
                        success: () => {
                            // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
                            // this.recorderManager.start(options)
                        },
                        fail: err => {
                            this.$message("未开启录音授权，无法进行录音", {
                                confirmText: '去开启',
                                success: () => {
                                    $router.push('404', {
                                        prop: 'record'
                                    })
                                },
                                showCancel: true
                            })
                        }
                    })
                } else {
                    this.recorderManager.start(options)
                }
            }
        })
    },
}

export default config