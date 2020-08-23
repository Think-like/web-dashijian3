$(function () {

    // 为 art-template 定义时间过滤器
    template.defaults.imports.dateFormat = function (dtStr) {
        var dt = new Date(dtStr)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 在个位数的左侧填充 0
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    // 定义提交的参数
    var q = {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: '',
    };

    // 初始化
    initTable();
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                var str = template('tpl-table', res);
                $('tbody').html(str);

                renderPage(res.total);
            }
        })
    }

    var form = layui.form;
    initCate();
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                form.render();
            }
        })
    }

    // 为筛选表单绑定subit事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault();
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()

        q.state = state;
        q.cate_id = cate_id;

        initTable();
    })

    // 
    var laypage = layui.laypage;
    function renderPage(total) {
        //执行一个laypage实例
        laypage.render({
            elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: q.pagesize,
            curr: q.pagenum,
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            jump: function (obj, first) {
                //obj包含了当前分页的所有参数，比如：
                console.log(first, obj.curr, obj.limit); //得到当前页，以便向服务端请求对应页的数据。
                // 赋值页面
                q.pagenum = obj.curr;
                q.pagesize = obj.limit;
                //首次不执行
                if (!first) {
                    //do something
                    initTable();
                }
            }
        });
    }

    // 删除
    $("tbody").on("click", '.btn-delete', function () {
        var Id = $(this).attr("data-id");
        layer.confirm('是否删除?', { icon: 3, title: '提示' },
            function (index) {
                $.ajax({
                    method: 'GET',
                    url: '/my/article/delete/' + Id,
                    success: function (res) {
                        if (res.status !== 0) {
                            return layer.msg(res.message);
                        }

                        layer.msg("恭喜你，文章删除成功！");

                        if ($('.btn-delete').length == 1 && q.pagenum > 1) q.pagenum--;

                        initTable();

                    }
                })
                layer.close(index);
            });

    });
})