package club;

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

@WebServlet(name = "/club/ClubVerification.java",urlPatterns = "/club/ClubVerification")
public class ClubVerification extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        int id;
        String password;
        int clubid;

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
            }else if (user.getManager() == 0){
                JSONObject jsonObject = new JSONObject();
                jsonObject.put("code",-2);
                jsonObject.put("status","fail");
                jsonObject.put("obj","你不是该社团的管理员");
                out.println(jsonObject);
            }else {
                JSONObject jsonObject = new JSONObject();
                JSONObject jsonObject1 = new JSONObject();

                String sql = "select * from joined_mapping where clubid = " + clubid;
                String sql1 = "";
                Connection connection = DBUtil.getConnection();
                PreparedStatement ps = connection.prepareStatement(sql);
                ResultSet rs = ps.executeQuery();

                jsonObject1.put("username",rs.getString("username"));
                jsonObject1.put("realname","xxx");
                jsonObject1.put("img","avater.png");

                jsonObject.put("code",0);
                jsonObject.put("status","success");
                jsonObject.put("obj","等待管理员验证");
                out.println(jsonObject);
                rs.close();
                ps.close();
                connection.close();
            }
        }catch (Exception e){
            e.printStackTrace();
        }
    }

    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doGet(request, response);
    }
}
