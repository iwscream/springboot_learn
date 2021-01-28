package club;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import util.DBUtil;
import util.ServicesDao;
import util.User;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.Date;

@WebServlet(name = "/club/ClubGetAnnouncement.java",urlPatterns = "/club/ClubGetAnnouncement")
public class ClubGetAnnouncement extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        int userid;
        String password;
        int clubid;

        try{
            userid = Integer.parseInt(request.getParameter("id"));
            password = request.getParameter("password");
            clubid = Integer.parseInt(request.getParameter("clubid"));

            PrintWriter out = response.getWriter();

            ServicesDao servicesDao = new ServicesDao();
            User user = servicesDao.getUserById(userid);

            if (!user.getPassword().equals(password)) {
                JSONObject jsonObject = new JSONObject();
                jsonObject.put("code", -1);
                jsonObject.put("status", "fail");
                jsonObject.put("obj", "用户验证失败，请重新登录");
                out.println(jsonObject);
            }else if (!servicesDao.selectClubId(clubid)){
                JSONObject jsonObject = new JSONObject();
                jsonObject.put("code", -2);
                jsonObject.put("status", "fail");
                jsonObject.put("obj", "非法输入");
                out.println(jsonObject);
            }else{
                String sql = "select * from announcement where clubid = " + clubid;
                Connection connection = DBUtil.getConnection();
                PreparedStatement ps = connection.prepareStatement(sql);
                ResultSet rs = ps.executeQuery();
                JSONObject jsonObject = new JSONObject();
                JSONArray jsonArray = new JSONArray();

                while (rs.next()){
                    JSONObject jsonObject1 = new JSONObject();
                    jsonObject1.put("time",new Date());
                    jsonObject1.put("topic",rs.getString("topic"));
                    jsonObject1.put("content",rs.getString("announcement"));
                    jsonArray.add(jsonObject1);
                }
                jsonObject.put("code", 0);
                jsonObject.put("status", "success");
                jsonObject.put("obj",jsonArray);
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
