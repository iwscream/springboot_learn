$(function() {
    msgBox.init();
    const createURL = root + "/club/ClubRegister.java";

    const user = $.cookie("id");
    const password = $.cookie("password");

    var isPost = false;
    function create() {
        
        const name = $("#club-name").val();
        if (name.length < 2 || name.length > 12) {
            msgBox.show("社团名称非法，请重新输入", "格式错啦");
            return;
        }
        const intro = $("#intro").val();

        isPost = true;
        let success = (data, status, xhr)=> {
            if (data.status === "success") {
                // 获取信息成功
                msgBox.show(data.obj, "OK!");
            } else {
                msgBox.show(data.obj, "出错啦！");
            }
        };
        if (debug) {
            success({
                status: "fail",
                obj: "创建失败。因为该网络接口被关闭。"
            });
            return;
        }
        $.post(createURL, {
            id: user,
            password: password,
            clubname: name,
            intro: intro
        }).done(
            success
        ).fail((xhr)=>{
            msgBox.show(`创建社团失败`, "错误");
        }).always(()=>isPost = false);
    }
    $(".create-club").click(create);
});