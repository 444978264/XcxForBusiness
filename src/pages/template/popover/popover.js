export default {
    data: {
        sourceOfPop: null,
        titleOfPop: '',
        rich: null,
        winner: null
    },
    _removePop(e) {
        this.setData({
            sourceOfPop: null
        })
    },
    getRich() {
        if (this.data.rich != null) {
            this.setData({
                sourceOfPop: this.data.rich,
                titleOfPop: {
                    text:"今日土豪榜TOP10",
                    type:'rich'
                }
            })
            return
        }
    },
    getWinner() {
        if (this.data.winner != null) {
            this.setData({
                sourceOfPop: this.data.winner,
                titleOfPop: {
                    text:"今日手气最佳TOP10",
                    type:'winner'
                }
            })
            return
        }
    },
    getDataSource() {
        this.$http.rich().then(rich => {
            if (!rich) return
            this.setData({
                rich
            })
        })
        this.$http.winner().then(winner => {
            if (!winner) return
            this.setData({
                winner
            })
        })
    }
}