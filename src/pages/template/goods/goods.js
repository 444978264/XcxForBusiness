export default {
    data:{
        waterfallStyle:{},
    },
    _count:0,
    waterfulView: [0, 0],
    imgIsLoad:false,
    _siteComputed(h, fn) {
        let min = Math.min.apply(this, this.waterfulView);
        let idx = this.waterfulView.indexOf(min);
        fn && fn(`${50 * idx}%`, `${min}px`);
        this.waterfulView[idx] += h;
    },
    _imgLoad(e) {
        let { parent,id } = this.dataset(e);
        wx.createSelectorQuery().selectAll(`.${parent}`).boundingClientRect(rects => {
            let { height } = rects[0];
            this._siteComputed(height, (left, top) => {
                // console.log(left, top)
                let {waterfallStyle,viewHeight} = this.data;
                waterfallStyle[id] = {
                    left,
                    top,
                    opacity:1
                }
                this.setData({
                    waterfallStyle,
                });
                this._count++;
                // 判断本次的数据包括商品图片是否已经加载完毕
                if(this._count==this.pagesize||!this.has_next){
                    this.imgIsLoad = false;
                    this._count = 0;
                }
            })
        }).exec()
    },
    _getDetail(e){
        let {id} = this.dataset(e);
        this.$router.push('goods_detail',{
            id:id
        })
    }
}