var baseURL = 'http://ajax.frontend.itheima.net';


$.ajaxPrefilter(function (params) {

    params.url = baseURL + params.url;

    // 对需要权限的接口配置头信息
    if (params.url.indexOf('/my/') !== -1) {
        params.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    // 拦截所有响应
    params.complete = function (res) {
        console.log(res.responseJSON);
        var obj = res.responseJSON;
        if (obj.status == 1 && obj.message == '身份认证失败！') {
            // 清空本地token
            localStorage.removeItem('token');
            // 页面跳转
            location.href = '/login.html';
        }
    }
});