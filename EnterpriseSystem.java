import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.sql.*;

public class EnterpriseSystem extends JFrame {
    String url = "jdbc:sqlite:podnik.db";

    public EnterpriseSystem() {
        setTitle("System");
        setSize(600, 400);
        setDefaultCloseOperation(3);
        
        try (Connection c = DriverManager.getConnection(url)) {
            Statement s = c.createStatement();
            s.execute("CREATE TABLE IF NOT EXISTS data (id INTEGER PRIMARY KEY, txt TEXT)");
        } catch (Exception e) {}

        DefaultTableModel m = new DefaultTableModel(new String[]{"ID", "Text"}, 0);
        JTable t = new JTable(m);
        
        JButton add = new JButton("Přidat");
        add.addActionListener(e -> {
            String val = JOptionPane.showInputDialog("Text:");
            try (Connection c = DriverManager.getConnection(url);
                 PreparedStatement p = c.prepareStatement("INSERT INTO data (txt) VALUES (?)")) {
                p.setString(1, val); p.executeUpdate();
                refresh(m);
            } catch (Exception ex) {}
        });

        add(new JScrollPane(t), "Center");
        add(add, "South");
        refresh(m);
        setVisible(true);
    }

    void refresh(DefaultTableModel m) {
        m.setRowCount(0);
        try (Connection c = DriverManager.getConnection(url);
             ResultSet rs = c.createStatement().executeQuery("SELECT * FROM data")) {
            while (rs.next()) m.addRow(new Object[]{rs.getInt(1), rs.getString(2)});
        } catch (Exception e) {}
    }

    public static void main(String[] args) { new EnterpriseSystem(); }
}