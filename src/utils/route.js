import { serialize } from './util';

class Router {
    // 防止同时触发多个页面跳转引起报错
    constructor(props) {
        this.loading = false;
        this.go = false;
        this.lazyChange = () => {
            if (this.go) return
            setTimeout(() => {
                this.loading = false;
            }, 1000)
        }
    }
    //跳转页面---保留当前页面，跳转到应用内的某个页面，
    push(path, params, go) {
        this.go = go || false;
        if (this.loading && !this.go) {
            return
        } else {
            this.loading = true;
        }
        let str = this.serialize(params);
        wx.navigateTo({
            url: `/pages/${path}/${path}${str}`,
            complete: (err) => {
                this.lazyChange();
            },
            fail:({errMsg})=>{
                if(errMsg.includes('tabbar')){
                    console.log(errMsg)     
                    this.tab(path, true)
                }
            }
        })
    }
    //跳转页面---保留当前页面，跳转到应用内的某个页面，
    tab(path, go) {
        this.go = go || false;
        if (this.loading && !this.go) {
            return
        } else {
            this.loading = true;
        }
        wx.switchTab({
            url: `/pages/${path}/${path}`,
            complete: (err) => {
                this.lazyChange();
            },
            fail:({errMsg})=>{
                console.log(errMsg)
            }
        })
    }
    //跳转页面---关闭当前页面，跳转到应用内的某个页面，
    redirect(path, params, go) {
        this.go = go || false;
        if (this.loading && !this.go) {
            return
        } else {
            this.loading = true;
        }
        let str = this.serialize(params);
        wx.redirectTo({
            url: `/pages/${path}/${path}${str}`,
            complete: () => {
                this.lazyChange();
            },
            fail:({errMsg})=>{
                if(errMsg.includes('tabbar')){
                    console.log(errMsg)     
                    this.tab(path, true)
                }
            }
        })
    }
    //跳转页面---关闭所有页面，跳转到应用内的某个页面，
    reLaunch(path, params, go) {
        this.go = go || false;
        if (this.loading && !this.go) {
            return
        } else {
            this.loading = true;
        }
        let str = this.serialize(params);
        wx.reLaunch({
            url: `/pages/${path}/${path}${str}`,
            complete: () => {
                this.lazyChange();
            },
            fail:({errMsg})=>{
                if(errMsg.includes('tabbar')){
                    console.log(errMsg)     
                    this.tab(path, true)
                }
            }
        })
    }
    serialize(params) {
        return serialize(params)
    }
};
const $router = new Router();

export default $router