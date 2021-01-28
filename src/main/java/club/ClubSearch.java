package club;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import util.Club;
import util.ServicesDao;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;

@WebServlet(name = "/club/ClubSearch.java",urlPatterns = "/club/ClubSearch")
public class ClubSearch extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setCharacterEncoding("utf-8");
        response.setCharacterEncoding("utf-8");

        int clubName;
        ArrayList<Club> list;

        try {
            clubName = Integer.parseInt(request.getParameter("clubname"));

            ServicesDao servicesDao = new ServicesDao();
            PrintWriter out = response.getWriter();
            if (servicesDao.selectId(clubName)) {
                list = servicesDao.getUser("clubname", String.valueOf(clubName), "club");

                int clubId = servicesDao.selectIdFromClubname(clubName);

                JSONArray jsonArray = new JSONArray();
                for (int i = 0; i < list.size(); i++) {
                    JSONObject jsonObject1 = new JSONObject();
                    Club club = list.get(i);
                    jsonObject1.put("clubid",club.getId());
                    jsonObject1.put("clubname",club.getClubname());
                    jsonObject1.put("intro",club.getIntroduce());
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
                jsonObject.put("obj","没有找到相应的结果");
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
