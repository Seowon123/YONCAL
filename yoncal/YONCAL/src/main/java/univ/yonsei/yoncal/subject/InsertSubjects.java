package univ.yonsei.yoncal.subject;

import java.io.*;
import java.sql.*;

public class InsertSubjects {
    private static final String JDBC_URL = "jdbc:mysql://127.0.0.1:3306/mydb";
    private static final String JDBC_USER = "root";
    private static final String JDBC_PASSWORD = "root1234";
    public static void main(String[] args) {
        String dir = "YONCAL/src/main/resources/static/text";
        String filePath = dir + "/subjects.txt";
        Connection conn = null;
        try {
            conn = DriverManager.getConnection(JDBC_URL, JDBC_USER, JDBC_PASSWORD);

            try (BufferedReader reader = new BufferedReader(new FileReader(filePath))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    String[] parts = line.split(", ");

                    if (parts.length == 4) {
                        int id = Integer.parseInt(parts[0]);
                        String name = parts[1];
                        String credits = parts[2];
                        String category = parts[3];

                        String sql = "INSERT INTO subject (name, credits, category) VALUES (?, ?, ?)";

                        try (PreparedStatement pstmt = conn.prepareStatement(sql)) {
                            pstmt.setString(1, name);
                            pstmt.setString(2, credits);
                            pstmt.setString(3, category);
                            pstmt.executeUpdate();
                            }
                    }
                }
            }
        } catch (SQLException | IOException e) {
            e.printStackTrace();
        } finally {
            if (conn != null) {
                try {
                    conn.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
        }
    }
}
