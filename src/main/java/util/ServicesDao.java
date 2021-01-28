package util;

import com.mysql.jdbc.Statement;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;


public class ServicesDao {

    public ArrayList<Club> getUser(String s, String value, String table) throws Exception {
        ArrayList<Club> list = new ArrayList<>();
        PreparedStatement ps = null;
        ResultSet rs = null;
        Connection connection = null;
        try {
            connection = DBUtil.getConnection();
            String sql = "select * from " + table +" where " + s + "  = " + value;
            ps = connection.prepareStatement(sql);
            rs = ps.executeQuery();

            while (rs.next()){
                list.add(selectClub(rs));
            }
        }catch (Exception e){
            e.printStackTrace();
        }finally {
            finalClose(connection,ps,rs);
        }
        return list;
    }
    public ArrayList<User> getUser(String table) throws Exception {
        ArrayList<User> list = new ArrayList<>();
        PreparedStatement ps = null;
        ResultSet rs = null;
        Connection connection = null;
        try {
            connection = DBUtil.getConnection();
            String sql = "select * from " + table;
            ps = connection.prepareStatement(sql);
            rs = ps.executeQuery();

            while (rs.next()){
                list.add(selectUser(rs));
            }
        }catch (Exception e){
            e.printStackTrace();
        }finally {
            finalClose(connection,ps,rs);
        }
        return list;
    }
    public ArrayList<User> getUser(String getValue,String column, String value, String table) throws Exception {
        ArrayList<User> list = new ArrayList<>();
        PreparedStatement ps = null;
        ResultSet rs = null;
        Connection connection = null;
        try {
            connection = DBUtil.getConnection();
            String sql = "select " + getValue +" from " + table +" where " + column + " = " + value;
            ps = connection.prepareStatement(sql);
            rs = ps.executeQuery();

            while (rs.next()){
                list.add(selectUser(rs));
            }
        }catch (Exception e){
            e.printStackTrace();
        }finally {
            finalClose(connection,ps,rs);
        }
        return list;
    }

    public User getUserById (int id) throws Exception {
        Connection connection = null;
        PreparedStatement ps = null;
        ResultSet rs = null;

        try{
            connection = DBUtil.getConnection();
            String sql = "select * from userclub where id =" + id;
            ps = connection.prepareStatement(sql);
            rs = ps.executeQuery();

            if (rs.next()){
                return selectUser(rs);
            }else {
                return null;
            }
        }catch (Exception e){

        }finally {
            finalClose(connection,ps,rs);
        }
        return null;
    }

    public Club getClubById (int id) throws Exception{
        Connection connection = null;
        PreparedStatement ps = null;
        ResultSet rs = null;

        try{
            connection = DBUtil.getConnection();
            String sql = "select * from userclub where id =" + id;
            ps = connection.prepareStatement(sql);
            rs = ps.executeQuery();

            if (rs.next()){
                return selectClub(rs);
            }else {
                return null;
            }
        }catch (Exception e){

        }finally {
            finalClose(connection,ps,rs);
        }
        return null;
    }


    public int addClub (User push) throws Exception {
        Connection connection = null;

        try {
            connection = DBUtil.getConnection();

            String sql = "insert into userclub (username,password,clubid,ismanager)" + "value (?,?,?,?)";
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);

            ps.setString(1,push.getUsername());
            ps.setString(2,push.getPassword());
            ps.setString(3,String.valueOf(push.getClubid()));
            ps.setString(4, String.valueOf(push.getManager()));
            ps.executeUpdate();

//            String sql1 = "select last_insert_id()";
            ResultSet rs = ps.getGeneratedKeys();
            int id = 0;
            while (rs.next()){
                id = rs.getInt(1);
            }
            return id;
        }catch (SQLException e) {
            e.printStackTrace();
            return -1;
        }finally {
            try {
                if (connection != null){
                    connection.close();
                }
            }catch (Exception e){
                e.printStackTrace();
            }
        }
    }

    public void addUCMapping(int userid, int clubid){
        Connection connection = null;
        PreparedStatement ps = null;

        try{
            String sql = "insert into joined_mapping (userid,clubid,isjoined) value (?,?,?)";

            connection = DBUtil.getConnection();
            ps = connection.prepareStatement(sql);

            ps.setInt(1,userid);
            ps.setInt(2,clubid);
            ps.setInt(3,0);
            ps.executeQuery();
        }catch (Exception e){
            e.printStackTrace();
        }finally {
            try {
                connection.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
            try {
                ps.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }

    public void deleteItemsById(String id) throws Exception {
        Connection connection = null;
        PreparedStatement ps = null;

        try {
            connection = DBUtil.getConnection();

            String sql = "delete from userclub where id = " + id;
            ps = connection.prepareStatement(sql);
            ps.execute();
            ps.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }finally {
            try {
                if (connection != null){
                    connection.close();
                }
            }catch (Exception e){
                e.printStackTrace();
            }

        }
    }

    public ArrayList<User> selectPageNumber(int pageNumber){
        ArrayList<User> list = new ArrayList<>();
        Connection connection = null;
        PreparedStatement ps = null;
        ResultSet rs = null;

        try{
            String sql = "select * from userclub limit " + 10 *(pageNumber - 1) + "," + 10;//开始位置，每次条数

            connection = DBUtil.getConnection();
            ps = connection.prepareStatement(sql);
            rs = ps.executeQuery();

            while (rs.next()){
                list.add(selectUser(rs));
            }
        }catch (Exception e){
            e.printStackTrace();
        }
        return list;
    }

    public boolean selectId(int id){
        Connection connection = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        boolean temp = false;

        try{
            String sql = "select id from userclub";

            connection = DBUtil.getConnection();
            ps = connection.prepareStatement(sql);
            rs = ps.executeQuery();

            while (rs.next()){
                temp = rs.getInt("id") == id;
            }
        }catch (Exception e){
            e.printStackTrace();
        }finally {
            finalClose(connection,ps,rs);
        }
        return temp;
    }
    public boolean selectClubId(int clubid){
        Connection connection = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        boolean temp = false;

        try{
            String sql = "select clubname from club";

            connection = DBUtil.getConnection();
            ps = connection.prepareStatement(sql);
            rs = ps.executeQuery();

            while (rs.next()){
                temp = rs.getInt("clubid") == clubid;
            }
        }catch (Exception e){
            e.printStackTrace();
        }finally {
            finalClose(connection,ps,rs);
        }
        return temp;
    }

    public int selectIdFromClubname(int clubid){
        Connection connection = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        int id = -1;

        try{
            String sql = "select id from club where clubid = " + clubid;

            connection = DBUtil.getConnection();
            ps = connection.prepareStatement(sql);
            rs = ps.executeQuery();

            while(rs.next()){
                id = rs.getInt("id");
            }
        }catch (Exception e){
            e.printStackTrace();
        }finally {
            finalClose(connection,ps,rs);
        }
        return id;
    }

    public int selectMSCCountFromAnnouncement(String clubname){
        Connection connection = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        int isRead = -1;

        try{
            String sql = "select isread from announcement where clubname = " + clubname;

            connection = DBUtil.getConnection();
            ps = connection.prepareStatement(sql);
            rs = ps.executeQuery();

            while (rs.next()){
                isRead = rs.getInt("isread");
            }
        }catch (Exception e){
            e.printStackTrace();
        }finally {
            finalClose(connection,ps,rs);
        }
        return isRead;
    }

    public User selectPasswordGetArticle(String password){
        Connection connection = null;
        PreparedStatement ps = null;
        ResultSet rs = null;

        try{
            String sql = "select * from userclub where password = \"" + password + "\"";

            connection = DBUtil.getConnection();
            ps = connection.prepareStatement(sql);
            rs = ps.executeQuery();

            if (rs.next()){
                return selectUser(rs);
            }else {
                return null;
            }
        }catch (Exception e){
            e.printStackTrace();
        }finally {
            finalClose(connection,ps,rs);
        }
        return null;
    }

    private void finalClose(Connection connection, PreparedStatement ps, ResultSet rs){
        try {
            if (rs != null){
                rs.close();
            }
        }catch (Exception e){
            e.printStackTrace();
        }
        try {
            if (ps != null){
                ps.close();
            }
        }catch (Exception e){
            e.printStackTrace();
        }
        try {
            if (connection != null){
                connection.close();
            }
        }catch (Exception e){
            e.printStackTrace();
        }
    }

    private User selectUser(ResultSet rs){
        User push = new User();

        try {
            push.setUsername(rs.getString("username"));
            push.setPassword(rs.getString("password"));
            push.setClubid(Integer.parseInt(rs.getString("clubid")));
            push.setManager(rs.getInt("ismanager"));
        } catch (SQLException e) {
            e.printStackTrace();
        }

        return push;
    }

    private Club selectClub(ResultSet rs){
        Club push = new Club();

        try {
            push.setCreator(rs.getString("creator"));
            push.setClubname(rs.getString("clubname"));
            push.setIntroduce(rs.getString("introduce"));
            push.setImg(rs.getString("img"));
        } catch (SQLException e) {
            e.printStackTrace();
        }

        return push;
    }
}

