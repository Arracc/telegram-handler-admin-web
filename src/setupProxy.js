const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function(app) {
    app.use(
        //可以配置多个proxy
        createProxyMiddleware('/api1', {
            //api1是需要转发的请求(所有带/api1前缀的请求都会转发给5000)
            target: 'http://telegram.345555.xyz', //配置转发目标地址（能返回数据的服务器地址）
            changeOrigin: true, //控制服务器接收到的请求头中的host字段的值
            pathRewrite: { '^/api1': '' } //去除请求前缀，保证交给后台服务器的是正常请求地址（必须配置）
        }),
        //可以配置多个proxy
        createProxyMiddleware('/api2', {
            target: 'http://localhost:10305',
            changeOrigin: true,
            pathRewrite: { '^/api2': '' }
        })
    )
}
