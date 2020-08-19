$(function () {
    getUserInof();

    // 退出
    var layer = layui.layer;
    $('#btnLogout').on('click', function () {
        layer.confirm('是否确认退出?', { icon: 3, title: '提示' }, function (index) {
            //do something
            // 清空本地token
            localStorage.removeItem('token');
            // 页面跳转
            location.href = '/login.html';
            // 关闭询问框
            layer.close(index);
        });
    })

});

// 获取用于信息
function getUserInof() {
    $.ajax({
        url: '/my/userinfo',
        // headers: {
        //     // 重新登录
        //     Authorization: localStorage.getItem
        //         ("token") || ""
        // },
        success: function (res) {
            console.log(res);
            if (res.status !== 0) {
                return layui.layer.msg(res.message);
            }
            renderAvatar(res.data);
        }
    });

}

// 封装用户头像渲染函数
function renderAvatar(user) {
    var name = user.nickname || user.username;
    $('#welcome').html('欢迎 &nbsp;&nbsp;' + name);
    if (user.user_pic !== null) {
        $('.layui-nav-img').show().atter('src', user.user_pic);
        $('.user-avatar').hide();
    } else {
        $('.layui-nav-img').hide();
        var text = name[0].toUpperCase();
        $('.user-avatar').show().html(text);
    }
}
