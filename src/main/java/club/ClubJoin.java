package club;

import net.sf.json.JSONObject;
import util.ServicesDao;
import util.User;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

@WebServlet(name = "/club/ClubJoin.java",urlPatterns = "/club/ClubJoin")
public class ClubJoin extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        int id;
        String password;
        int clubid;

        request.setCharacterEncoding("utf-8");
        response.setCharacterEncoding("utf-8");

        try{
            id = Integer.parseInt(request.getParameter("id"));
            password = request.getParameter("password");
            clubid = Integer.parseInt(request.getParameter("clubid"));

            ServicesDao servicesDao = new ServicesDao();
            User user = servicesDao.getUserById(id);
            PrintWriter out = response.getWriter();

            if (!user.getPassword().equals(password)){
                JSONObject jsonObject = new JSONObject();
                jsonObject.put("code",-1);
                jsonObject.put("status","fail");
                jsonObject.put("obj","用户验证失败，请重新登录");
                out.println(jsonObject);
            }else if(clubid == user.getClubid()){
                JSONObject jsonObject = new JSONObject();
                jsonObject.put("code",-2);
                jsonObject.put("status","fail");
                jsonObject.put("obj","您已加入该社团");
                out.println(jsonObject);
            }else {
                JSONObject jsonObject = new JSONObject();
                jsonObject.put("code",0);
                jsonObject.put("status","success");
                jsonObject.put("obj","等待管理员验证");
                out.println(jsonObject);
            }
        }catch (Exception e){
            e.printStackTrace();
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doGet(request, response);
    }
}
