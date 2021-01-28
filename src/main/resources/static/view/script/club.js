$(function() {
    msgBox.init();
    const getNewURL = root + "/Club/ClubGetNewAnnouncement.java";
    const clubURL = root + "/club/ClubInfo.java";
    const postURL = root + "/Club/ClubReleaseAnnouncement.java";
    
    function getQueryVariable(variable) {
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
    }
    const clubid = getQueryVariable("clubid");
    $.post(getNewURL, {
        clubid: clubid,
        id: $.cookie("id"),
        password: $.cookie("password")
    }).done(update).fail(()=>msgBox.show("网络似乎出了点问题", "鸭鸭鸭"));
    
    function update(data) {
        if (data.status === "success") {
            var obj = data.obj;
            obj.sort((a, b)=>a.time > b.time);
            $(".title").text(obj.topic);
            $(obj.content).find("script").remove();
            var html = md(obj.content);
            $(".content").html(html);
            $(".activity-time").text(new Date(obj.time).toLocaleTimeString());
        }
    }

    $.post(clubURL, {
        clubid: clubid,
        id: $.cookie("id"),
        password: $.cookie("password")
    }).done(title).fail(()=>msgBox.show("网络似乎出了点问题", "鸭鸭鸭"));

    function title(data) {
        if (data.status === "success") {
            $(".title-bar-name").text(data.obj.clubname);
        }
    }

    const postP = $(".post-panel");
    postP.click(e=> {
        if (postP.is(e.target)) {
            postP.hide(200);
        }
    });

    postP.hide();
    $(".icon-huodong").click(()=>msgBox.show("帅气的Grapes咕掉了活动的功能", "不服憋着"));
    $(".icon-youxi").click(()=>msgBox.show("帅气的Grapes咕掉了游戏的功能", "不服憋着"));
    $(".icon-lang").click(()=>msgBox.show("帅气的Grapes咕掉了狼人杀的功能", "不服憋着"));
    $(".icon-kaochakechengkaohefangshishenpi").click(()=>msgBox.show("帅气的Grapes咕掉了社团考核的功能", "不服憋着"));
    $(".icon-zuoye").click(()=>msgBox.show("帅气的Grapes咕掉了作业的功能", "不服憋着"));
    $(".icon-gonggao1").click(()=>postP.show(200));

    $("#post-button").click(post);

    const titleI = $("#title");
    const contentI = $("#content");
    function post() {
        if (titleI.val().length < 1 || titleI.val() > 20 || contentI.val().length < 1 || contentI.val().length > 10000) {
            msgBox.show("输入非法", "格式错误");
            return ;
        }
        $.post(postURL, {
            id: $.cookie("id"),
            password: $.cookie("password"),
            clubid: clubid,
            topic: titleI.val(),
            content: contentI.val()
        }).done(()=>msgBox.show("发布成功", "YES！")).fail(msgBox.show("网络出现错误", "50%的概率是我的锅"));
    }

});