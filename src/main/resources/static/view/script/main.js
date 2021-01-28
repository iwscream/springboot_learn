var fragmentManager;
$(function() {
    const userInfoURL = root + "/user/UserInfo.java";
    const clubListURL = root + "/club/MyClub.java"
    const activityListURL = root + "/Club/ClubGetNewAnnouncement.java";

    // 一堆初始化的东西
    msgBox.init();
    const fragmentContainer = new Component($('.fragment-container'));
    const pullView = $('.refresh-container');
    const myClub = new Fragment();
    const activity = new Fragment();
    const userPanel = new Fragment();

    // 获取用户信息
    const user = $.cookie('id');
    const password = $.cookie('password');

    // debug模式输出
    if (debug) console.log(`id is ${user} and md5 pass is ${password}`);

    // 碎片管理器
     fragmentManager = new FragmentManager(fragmentContainer, setSelected);
    fragmentManager.add(myClub);
    fragmentManager.add(activity);
    fragmentManager.add(userPanel);

    var isPost = false;

    /**
     * 用户资料碎片
     */
    // 获取用户资料
    function getUserInfo(user, call) {
        isPost = true;
        let success = (data, status, xhr)=> {
            if (data.status === "success") {
                // 获取信息成功
                call(data.obj.username, data.obj.realname, data.obj.img);
            } else {
                msgBox.show(data.obj, "出错啦！");
            }
        };
        if (debug) {
            success({
                status: "success",
                obj: {
                    username: "Grapes",
                    realname: "吴彦祖",
                    img: "msc.png"
                }
            });
            return;
        }
        $.post(userInfoURL, {
            id: user
        }).done(
            success
        ).fail((xhr)=>{
            msgBox.show(`获取用户信息失败`, "错误");
        }).always(()=>isPost = false);
    }

    // 创建用户卡界面
    let userDiv = new DivView("", {class: "user-panel"});
    const ads = new ImageView({class: "user-ads", src: "ads.png"});
    const userCard = new UserCard({
        src: "msc.png",
        name: "加载中..."
    });

    /************* 这里应该跳转到用户资料更新界面，但我还没做******************/
    userCard.on("click", ()=>msgBox.show("由于前端小哥哥太帅了，所以暂时还不能修改资料~", "哇呜"));    //
    // 获取并更新用户信息
    let updateUserCard = ()=>getUserInfo(user, (u, r, i)=> {
        userCard.userName.text(u);
        userCard.avatar.setSrc(i);
    });

    updateUserCard();

    // 创建社团按钮
    const createClubButton = new Button("创建社团", {class: "create-club", style: "width: 70%"});
    // 进入创建社团界面
    createClubButton.on("click", ()=>setTimeout(()=>window.location.href = "create-club.html", 200));
    // 用户资料页完成创建
    userDiv.add(ads).add(userCard).add(createClubButton);
    userPanel.add(userDiv);
    
    /**
     * 主界面碎片
    */

    var clubList = [];
    function getClubList(call) {
        isPost = true;
        let success = (data, status, xhr)=> {
            if (data.status === "success") {
                call(data.obj);
            } else {
                msgBox.show(data.obj, "出错啦！");
            }
        };
        if (debug) {
            setTimeout(success({
                status: "success",
                obj: [
                    {
                        clubname: "我的社团助手",
                        clubid: 1,
                        img: "msc.png",
                        msgcount: 0
                    }, {
                        clubname: "微软学生俱乐部",
                        clubid: 2,
                        img: "msc.png",
                        msgcount: 0
                    }
                ]
            }), 500);
            return;
        }
        $.post(clubListURL, {
            id: user,
            password: password
        }).done(
            success
        ).fail(xhr=>{
            msgBox.show(`获取社团信息出错`, "错误");
        }).always(()=>isPost = false);
    }

    
    /**
     * 活动碎片
     */
    function getActivityList(clubid, call) {
        isPost = true;
        let success = (data, status, xhr)=> {
            if (data.status === "success") {
                call(data.obj);
            } else {
                msgBox.show(data.obj, "出错啦！");
            }
        };
        if (debug) {
            if (clubid === 2) {
                setTimeout(()=>success({
                    status: "success",
                    obj: [{
                        time: 1550326898885,
                        topic: "微软学生俱乐部的活动",
                        content: "@寒假期间要求每人做一个项目，可以选择以下项目：<script>alert('屏蔽脚本标签测试')</script></br><ul style='padding-left:25px'><li>坦克小游戏</li><li>社团管理微信小程序</li><li>社团管理APP</li><li>其他</li></ul>"
                    }]
                }), 500);    
            } else if (clubid === 1) {
                setTimeout(()=>success({
                    status: "success",
                    obj: [{
                        time: 1550328682580,
                        topic: "来自社团助手的任务",
                        content: "@<h3>任务一</h3>添加任意一个社团"
                    }]
                }), 500);
            }
            return;
        }
        $.post(activityListURL, {
            clubid: clubid,
            id: user,
            password: password
        }).done(
            success
        ).fail(xhr=>{
            msgBox.show(`获取活动信息失败`, "错误");
        }).always(()=>isPost = false);
    }

    let updateActivity = ()=>{
        let addActivityCard = (club, obj)=> {
            for (let i of obj) {
                let a = new Activity({
                    src: club.img,
                    title: i.topic,
                    info: i.content,
                    time: new Date(i.time).toLocaleDateString()
                });
                activity.add(a);
            }
        }
        for (let x of clubList) {
            getActivityList(x.clubid, obj=>addActivityCard(x, obj));
        }
    }

    let updateClubCard = ()=> getClubList((list)=> {
        clubList = list;
        myClub.clear();
        for (let x of clubList) {
            let club = new Club({
                src: x.img,
                clubName: x.clubname,
                msgCount: x.msgcount
            });
            club.on("click", ()=>setTimeout(()=>window.location.href = `club.html?clubid=${x.clubid}`, 200));
            myClub.add(club);
        }
        updateActivity();
    });
    updateClubCard();

    // 搜索按钮
    const search = $(".search-box");
    search.click(()=>setTimeout(()=>window.location.href = "search.html", 200));
    // there is a bug, i will fixed it;
    // i can't remember what is the bug.
    const pull = new PullView($('.fragment'), pullView, {
    });

    // 底部导航栏
    var nav = [], nac = [];
    nav[0] = $("#home");
    nac[0] = `iconfont icon-home `;
    nav[1] = $("#activity");
    nac[1] = `iconfont icon-local-activity `
    nav[2] = $("#user");
    nac[2] = `iconfont icon-user `
    const selected = `navigation-item-selected`;
    const unselected = `navigation-item-unselected`;

    function setSelected(index) {
        for (let i in nav) {
            nav[i].attr("class", nac[i] + unselected);
        }
        nav[index].attr("class", nac[index] + selected);
    }

    let navHandler = index=> {
        fragmentManager.setFragment(index);
        setSelected(index);
    }

    for (let i in nav) {
        nav[i].click(()=>navHandler(parseInt(i)));
    }

    navHandler(0);

    ////////////////////////////////////////////
    // 资料卡

});