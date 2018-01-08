export default {
    edit(e) {
        let { id } = this.dataset(e);
        this.addressEdit(({ userName, postalCode, provinceName, cityName, countyName, detailInfo, telNumber, ...other }) => {
            this.$http.addressUpdate({
                accept_name: userName,
                province: provinceName,
                city: cityName,
                area: countyName,
                address: detailInfo,
                zip: postalCode,
                mobile: telNumber,
                id: id
            })
        })
    },
    add() {
        this.addressEdit(({ userName, postalCode, provinceName, cityName, countyName, detailInfo, telNumber, ...other }) => {
            this.$http.addressAdd({
                accept_name: userName,
                province: provinceName,
                city: cityName,
                area: countyName,
                address: detailInfo,
                zip: postalCode,
                mobile: telNumber,
            })
        })
    },
    del(e) {
        let { id } = this.dataset(e);
        wx.showActionSheet({
            itemList: ['删除'],
            itemColor: '#fb5353',
            success: res => {
                this.$http.addressDel({
                    id: id
                }).then(res => {
                    if (!res) return
                    this.fetch()
                })
            },
            fail: function (res) {
                console.log(res.errMsg)
            }
        })
    },
    addressEdit(cbk) {
        function chooseAddress() {
            wx.chooseAddress({
                success: res => {
                    cbk && cbk(res)
                },
                fail(err) {
                    console.log(err)
                }
            })
        }
        wx.getSetting({
            success: ({ authSetting }) => {
                console.log(authSetting)
                if (!('scope.address' in authSetting)) {
                    wx.authorize({
                        scope: 'scope.address',
                        success() {
                            chooseAddress()
                        }
                    })
                } else if (authSetting['scope.address']) {
                    chooseAddress()
                } else {
                    this.$message("请前往设置，重新获取授权")
                }
            }
        })
    },
}