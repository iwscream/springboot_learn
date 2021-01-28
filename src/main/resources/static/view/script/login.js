
$(function() {
    // 初始化msgbox
    msgBox.init();

    const loginURL = root + "/user/UserLogin.java";
    const registerURL = root + "/user/UserRegister.java";


    const avatar = $("#avatar");
    const phone = $("#phone");
    const password = $("#password");
    const loginButton = $(".login-button");
    const noAccount = $("#no-account");
    const findPass = $("#find-password");
    const title = $(".title-bar-name");

    // 是否为登录页面
    let isLogin = false;

    function changePageStatus() {
        isLogin = !isLogin;
        let setPage = (t, b, n)=> {
            title.text(t);
            loginButton.text(b);
            noAccount.text(n);
        };
        isLogin ? setPage("登录", "下一步", "没有账号") : setPage("注册", "注册", "已有账号？");
    }

    // 确保开始为登录界面
    isLogin = false;
    changePageStatus();

    // 点击状态按钮切换
    noAccount.click(changePageStatus);

    var isPost = false;

    // 登录
    function login(user, passwd) {
        if (debug) {
            console.log("登录成功");
            $.cookie('id', user, {expires: 365, path: '/'});
            $.cookie('password', passwd, {expires: 365, path: '/'});
            $.cookie('token', "data.obj.token");
            window.location.href = "/view/main.html";
            return;
        }

        isPost = true;
        console.log(user);
        $.post(loginURL, {
            id: user,
            password: passwd
        }).done((data, status, xhr)=> {
            if (data.status === "success") {
                console.log("登录成功");
                $.cookie('id', user, {expires: 365, path: '/'});
                $.cookie('password', passwd, {expires: 365, path: '/'});
                $.cookie('token', data.obj.token);
                window.location.href = "/view/main.html";
            } else {
                msgBox.show(data.obj, "出错啦！");
            }
            
        }).fail((xhr)=>{
            msgBox.show(`${xhr.statusText}: ${xhr.status === 200 ? "跨域访问限制，请确保root域名正确服务器正确配置" : xhr.status}`, "错误");
        }).always(()=>isPost = false);
    }

    // 注册
    function register(user, passwd) {
        if (debug) {
            msgBox.show("注册成功", "欢迎加入");
            login(user, passwd);
            return;
        }
        isPost = true;
        $.post(registerURL, {
            id: user,
            password: passwd
        }).done((data, status, xhr)=> {
            if (data.status === "success") {
                msgBox.show("注册成功", "欢迎加入");
                login(user, passwd);
            } else {
                msgBox.show(data.obj, "出错啦！");
            }
        }).fail((xhr)=>{
            msgBox.show(`${xhr.statusText}: ${xhr.status === 200 ? "跨域访问限制，请确保root域名正确服务器正确配置" : xhr.status}`, "错误");
        }).always(()=>isPost = false);
    }

    loginButton.click(()=>{if (!isPost) {isLogin ? login(phone.val(), $.md5(password.val())) : register(phone.val(), $.md5(password.val()))}});

});
