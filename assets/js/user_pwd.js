$(function () {
    // 自定义验证规则
    var form = layui.form;
    form.verify({
        // 密码不为空
        pwd: [
            /^[\S]{6,16}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        // 新旧密码不能相同
        samePwd: function (value) {
            if (value == $('[name=oldPwd]').val()) {
                return "新旧密码不能相同";
            }
        },
        // 新密码和确认密码相同
        rePwd: function (value) {
            if (value !== $('[name=newPwd]').val()) {
                return "新密码和确认密码不相同";
            }
        }
    });

    // 表单提交
    $('.layui-form').on('submit', function (e) {
        // 阻止表单提交
        e.preventDefault();
        // 发送ajax
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function (res) {
                // 返回状态判断
                if (res.status != 0) {
                    return layer.msg(res.message);
                }
                // 提交成功后处理代码
                layui.layer.msg("修改密码成功");

                // 重置form表单
                $(".layui-form")[0].reset();
            }
        })
    })
})