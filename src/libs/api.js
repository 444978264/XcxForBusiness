import bmap from './bmap-wx.min.js';
import { $loading, removeItemSync, getItemSync, setItemSync } from '../utils/util';
import Factory from './promise_factory';
import config from '../config/config';
import dev from '../is_develop';
export let TOKEN = getItemSync('token');
export let SXSID = '';
const INFO = getItemSync('localInfo') || {};
const host = dev ? config.local : config.host;
/* 新建百度地图对象 */
  export const BMap = new bmap.BMapWX({
    ak: config.secret
  });
/* 获取位置--百度地图 */
  export const $Location = {
    el: BMap,
    info(success, fail) {
      this.el.regeocoding({
        fail: fail,
        success: success,
        // iconPath: '../../img/marker_red.png',
        // iconTapPath: '../../img/marker_red.png'
      });
    }
  }
/*设置全局token&sxs_id*/
  export const setToken = token => TOKEN = token;
  export const setSxsID = sxs_id => SXSID = sxs_id;
/*新的fetch---Promise封装2017-12-25*/
  let collections = [];
  let lock = false;
  const ajax = (url, params, config) => {
    console.log(url)
    let promise = Factory((resolve, reject) => {
      let result = Object.assign({
        url: url,
        method: 'POST',
        dataType: 'json',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          token: TOKEN,
          sxs_id:SXSID,
          ...params
        },
        success: res => {
          $loading.done();
          if (lock) return
          // 从队列中删除这次请求
          collections.splice(task.idx, 1);
          if (res.data.code <= -9999||res.data.code <= -98) {
            lock = true;
            removeItemSync('token');
            removeItemSync('userInfo');
            /***请求队列处理***/
            // 防止一个页面 多个请求 token失效 同时打开login页面 引起的错误  
            collections.forEach(function (t) {
              // 取消后面的所有请求
              t.abort();
            })
            collections = [];
            /**********************/
            wx.navigateTo({
              url: '/pages/login/login',
              success: function (data) {
                lock = false;
              },
              fail: function (err) {
                console.log(err)
              }
            })
            return false
          }
          resolve(res.data)
        },
        fail: err => reject(err)
      }, config);
      //显示loading
      $loading.start();
      let task = wx.request(result);
      // 请求队列
      collections.push(task);
      //设置对应的队列下标
      task.idx = collections.length - 1;
    });
    return promise.then(res => {
      if (res.code < 0) {
        wx.showToast({
          title: res.msg,
          image: '../../img/warn.png',
          duration: 2000
        })
        return false
      }
      if (res.simple_client && typeof res.result == 'object') {
        setItemSync('g_info',res.simple_client)
        // res.result.g_info = res.simple_client;
      }
      return res.result
    }).catch(err => console.log(err, url, 'fail'))
  }
/*获取接口地址*/
  export const getUrl = (c, a) => {
    return `${host}/adm.php/${c}/${a}`
  }
/* 获取图片地址 */
  export const getImg = path => {
    return `${host}/static/red/${path}`
  }
/*上传文件地址&方法*/
  let uploadUrl = getUrl('index', 'ai_do');

  let uploadImg = getUrl('index', 'upload');
  // 文件上传---(暂时不用)
  const upload = function (url, tempFilePath, data) {
    Factory(function (resolve, reject) {
        wx.uploadFile({
            url: url,
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
                    removeItemSync('token');
                    wx.navigateTo({
                        url: '/pages/login/login',
                    })
                    return
                }
                resolve(result);
            },
            fail: err => {
                console.log(err)
            }
        })
    })
  }
/* 所有api 接口 */
  // 登录
  export const login = (params, config) => ajax(getUrl('iwx', 'auth_from_xcx'), params, config);
  // formid
  export const formid = (params, config) => ajax(getUrl('index', 'notify_queue'), params, config);
  //订单详情
  export const ordDetail = (params,config)=>ajax(getUrl("iorder","get_one"), params, config)
  // 订单列表
  export const orderLst = (params,config)=>ajax(getUrl("xorder","lst"), params, config)
  // 业绩
  export const performance = (params,config)=>ajax(getUrl("xreport","sell_top"), params, config)
  // 会员总数统计和活跃数
  export const members = (params,config)=>ajax(getUrl("xreport","member_total"), params, config)
  // 业绩
  export const trendOfWeak = (params,config)=>ajax(getUrl("xreport","member_trend"), params, config)
  // // 业绩
  // export const performance = (params,config)=>ajax(getUrl("xreport","sell_top"), params, config)
  // // 业绩
  // export const performance = (params,config)=>ajax(getUrl("xreport","sell_top"), params, config)
  // // 业绩
  // export const performance = (params,config)=>ajax(getUrl("xreport","sell_top"), params, config)

/* export default */
  export default {
    TOKEN,
    setSxsID,
    setToken,
    uploadUrl,
    uploadImg,
    getImg,
    $Location,
    //接口
    formid,
    orderLst,
    login,
    performance,
    members,
    trendOfWeak
  }