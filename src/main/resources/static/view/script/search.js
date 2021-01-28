$(function() {
    const searchURL = root + "/club/ClubSearch.java";
    const joinURL = root + "/club/ClubJoin.java";

    msgBox.init();
    const searchInput = $(".search-input");

    var isPost = false;

    searchInput.on("search", ()=>search(showResult));

    function search(call) {
        const val = searchInput.val();
        searchInput.blur();
        isPost = true;
        let success = (data, status, xhr)=> {

            if (data.status === "success") {
                // 获取信息成功
               
                call(data.obj);
            } else {
                msgBox.show(data.obj, "出错啦！");
            }
            isPost = false;
        };
        if (debug) {
            success({
                status: "success",
                obj: [{
                    clubid: 2,
                    clubname: "微软学生俱乐部",
                    intro: "“微软学生俱乐部”(Microsoft Student Club, 简称 MSC)是微软亚洲研究院与高校合作培养人才的一种探索。",
                    img: "msc.png"
                }]
            });
            return;
        }
        $.post(searchURL, {
            clubname: val
        }).done(
            success
        ).fail((xhr)=>{
            msgBox.show(`查询俱乐部失败`, "错误");
        }).always(()=>isPost = false);
    }

    function joinClub(clubid) {
        
        isPost = true;
        let success = (data, status, xhr)=> {
            if (data.status === "success") {
                // 获取信息成功
                msgBox.show(data.obj, "OK！");
            } else {
                msgBox.show(data.obj, "出错啦！");
            }
            isPost = false;
        };
        if (debug) {
            
            success({
                status: "fail",
                obj: "哎呀，你已经在这个社团里了。"
            });
            return;
        }
        $.post(joinURL, {
            clubid: clubid,
            id: $.cookie('id'),
            password: $.cookie('password')
        }).done(
            success
        ).fail((xhr)=>{
            msgBox.show(`加入俱乐部失败`, "错误");
        }).always(()=>isPost = false);
    }
    class SearchResult extends Component {
        constructor(props) {
            super("div", {class: "card-row"});
            this.avatar = new ImageView({class: "avatar", src: props.img});
            const d = new DivView("", {class: "club-info"});
            this.clubName = new DivView(props.clubname, {class: "name"});
            this.clubIntro = new DivView(props.intro, {class: "info"});
            this.join = new SpanView("加入", {class: "button"});
            this.join.on("click", ()=>joinClub(props.clubid));
            this.add(this.avatar).add(d.add(this.clubName).add(this.clubIntro).add(this.join));
        }
    }

    function showResult(obj) {
        const result = $('.search-result');
        result.empty();
        for (let x of obj) {       
            const r = new SearchResult(x);
            result.append(r.e);
        }
    }
});