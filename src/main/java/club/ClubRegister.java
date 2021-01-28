package club;

import net.sf.json.JSONObject;
import sun.misc.BASE64Decoder;
import util.DBUtil;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Random;

@WebServlet(name = "/club/ClubRegister.java",urlPatterns = "/club/ClubRegister")
public class ClubRegister extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        int id = -1;
        String password;
        String clubname;
        String intro;
        byte[] img;

        try{
            request.setCharacterEncoding("utf-8");
            response.setCharacterEncoding("utf-8");

            id = Integer.parseInt(request.getParameter("id"));
            password = request.getParameter("password");
            clubname = request.getParameter("clubname");
            intro = request.getParameter("intro");

            getRequestBase64Img(getRandomFileName(),request);
            DBUtil.insert("insert into club(password,clubname,introduce) value (" + id + "," + password + "," + clubname + "," + intro + ")");
            PrintWriter out = response.getWriter();
            JSONObject jsonObject = new JSONObject();
            jsonObject.put("code",0);
            jsonObject.put("status","success");
            jsonObject.put("obj","注册成功");
            out.println(jsonObject);
        }catch (Exception e){
            e.printStackTrace();
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doGet(request, response);
    }

    /**
     * 上传图片(前台为Base64格式)
     * @param fileName 上传图片的属性名
     * @return
     * @throws Exception
     */
    public String getRequestBase64Img(String fileName,HttpServletRequest request) throws Exception{
        return getRequestBase64File(fileName, "/resources/templates/", request);//ROOT_PATH + "/SJYS_IMG/"
    }

    /**
     * 上传文件(前台为Base64格式)
     * @param fileName 上传文件的名字(前台的属性名称)
     * @param filePath 文件保存的目标路径
     * @return
     * @throws Exception
     */
    public String getRequestBase64File(String fileName, String filePath,HttpServletRequest request) throws Exception{
        //得到前台传递过来的Base64格式的字符串

        String fileStr = request.getParameter("img");
//        this.getRequest().getParamValue(fileName);
        if (fileStr == null){
            return null;
        }

        if(filePath == null || "".equals(filePath)){
            filePath = "/resources/templates/";//ROOT_PATH + "/uploadTemplates/";
        }

        //前台生成base64时，是以   ABCDEFWWFE.jpg　这种格式传过来的 .jpg是文件的后缀名
        String suffix = fileStr.substring(fileStr.lastIndexOf("."));  //后缀名
        fileStr = fileStr.substring(0,fileStr.lastIndexOf(".")); //文件的真正base64内容

        //产生的文件名称
        String name = getRandomFileName()+suffix;

        BASE64Decoder decoder = new BASE64Decoder();
        try {
            // Base64解码
            byte[] b = decoder.decodeBuffer(fileStr);
            for (int i = 0; i < b.length; ++i) {
                if (b[i] < 0) {// 调整异常数据
                    b[i] += 256;
                }
            }
            // 生成文件
            OutputStream out = new FileOutputStream(filePath+name);
            out.write(b);
            out.flush();
            out.close();
            return name;
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * 生成随机名字
     */
    public String getRandomFileName() {
        Random r = new Random();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd_HHmmssSSS");
        StringBuffer sb = new StringBuffer();
        sb.append(r.nextInt(100));
        sb.append(r.nextInt(100));
        sb.append("_");
        sb.append(sdf.format(new Date()));
        sb.append("_");
        sb.append(r.nextInt(100));
        sb.append(r.nextInt(100));
        return sb.toString();
    }

}
