package club;

import net.sf.json.JSONArray;
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
import java.util.ArrayList;

@WebServlet(name = "/club/MyClub.java",urlPatterns = "/club/MyClub")
public class MyClub extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        request.setCharacterEncoding("utf-8");
        response.setCharacterEncoding("utf-8");

        String userId;
        ArrayList<User> list;

        try {
            userId = request.getParameter("id");

            ServicesDao servicesDao = new ServicesDao();
            PrintWriter out = response.getWriter();
            if (servicesDao.selectId(Integer.parseInt(userId))) {
                int clubid = servicesDao.getUser("clubname", "username", userId, "userclub")
                        .get(0)
                        .getClubid();
                int clubId = servicesDao.selectIdFromClubname(clubid);

                list = servicesDao.getUser("*", "clubid", String.valueOf(clubid), "userclub");

                JSONArray jsonArray = new JSONArray();
                for (int i = 0; i < list.size(); i++) {
                    JSONObject jsonObject1 = new JSONObject();
                    User user = list.get(i);
                    jsonObject1.put("clubname",user.getClubid());
                    jsonObject1.put("clubid",clubId);
                    jsonObject1.put("msgcount",servicesDao.selectMSCCountFromAnnouncement(String.valueOf(clubid)));
                    jsonObject1.put("img","avatar.png");
                    jsonArray.add(jsonObject1);
                }
                JSONObject jsonObject = new JSONObject();
                jsonObject.put("code",0);
                jsonObject.put("status","success");
                jsonObject.put("obj",jsonArray);
                out.println(jsonObject);
            }else {
                JSONObject jsonObject = new JSONObject();
                jsonObject.put("code",-1);
                jsonObject.put("status","fail");
                jsonObject.put("obj","用户不存在");
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
