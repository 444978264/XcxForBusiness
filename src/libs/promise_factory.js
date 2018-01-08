const PromiseFactory = (fn) => new Promise((resolve, reject) => {
    fn && fn(resolve, reject)
})

export { PromiseFactory as default }