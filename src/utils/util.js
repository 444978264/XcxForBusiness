function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

export const FormatTime = formatTime;

// 显示/隐藏转发按钮
export const $shareMenu = {
  show(params) {
    wx.showShareMenu(params)
  },
  hide(params) {
    wx.hideShareMenu(params)
  }
}

// showToast
export const alert = (title, type, time, success) => {
  switch (type) {
    case 'warn':
      return wx.showToast({
        title: title,
        icon: 'warn',
        image: '../../img/tip.svg',
        duration: 2000
      })
      break;
    default:
      return wx.showToast({
        title: title,
        icon: type || 'success',
        duration: time || 2000
      })
  }
}

// 显示loading
export const $loading = {
  start(params) {
    let init = params || {};
    init.mask = init.mask ? init.mask : true;
    wx.showLoading(init)
  },
  done() {
    wx.hideLoading();
  }
}

// 显示modal
export const $message = (content, { success, cancel, ...other } = {}) => {
  wx.showModal({
    title: "提示",
    content,
    showCancel: cancel ? true : false,
    success: function (res) {
      if (res.confirm) {
        success && success();
      } else if (res.cancel) {
        cancel && cancel();
      }
    },
    ...other
  })
}

// 获取dataset的值
export const dataset = e => e.currentTarget.dataset;

//使用wx.navigateBack可以返回到原页面。
export function serialize(params) {
  if (!params) return "";
  var str = '';
  if (params) {
    const keys = Object.keys(params);
    str = keys.reduce((start, next) => {
      if (start == '') {
        return `?${next}=${params[next]}`
      }
      return `${start}&${next}=${params[next]}`
    }, '')
  }
  return str
}

// 返回页面
export const goback = id => {
  wx.navigateBack({
    delta: id || 1
  })
}

// 数据缓存--sync 同步
export const setItem = (key, data, success) => wx.setStorage({ key, data, success });
export const setItemSync = wx.setStorageSync;
export const getItem = (key, success) => wx.getStorage({ key, success });
export const getItemSync = wx.getStorageSync;
export const getItems = (success, fail) => wx.getStorageInfo({ success, fail });
export const getItemsSync = wx.getStorageInfoSync;
export const removeItem = (key, success) => wx.removeStorage({ key, success });
export const removeItemSync = wx.removeStorageSync;
export const clearStorage = wx.clearStorage;
export const clearStorageSync = wx.clearStorageSync;

export default {
  formatTime,
  $loading,
  $shareMenu,
  $message,
  serialize,
  alert,
  dataset,
  goback,
  setItem,
  setItemSync,
  getItem,
  getItemSync,
  getItems,
  getItemsSync,
  removeItem,
  removeItemSync,
  clearStorage,
  clearStorageSync,
}