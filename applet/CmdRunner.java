import java.applet.*;
import java.awt.*;
import java.io.*;
import java.util.regex.*;
public class CmdRunner extends Applet {
    public void paint(Graphics g) {
        g.drawRect(0, 0, 49, 29);
        g.drawString("Applet", 5, 19);
    }

    public String writeFile(String filename, String lines, String pageEncode, String fileEncode) {
        try {
            byte ptext[] = lines.getBytes(pageEncode);//webpage already used with utf-8
            lines = new String(ptext, fileEncode);

            File temp = new File(System.getProperty("java.io.tmpdir") + "\\" + filename);

            OutputStreamWriter osw = new OutputStreamWriter(new FileOutputStream(temp), fileEncode);

            osw.write(lines);
            osw.flush();
            osw.close();

            // BufferedWriter bw = new BufferedWriter(new FileWriter(temp));

            // bw.write(lines);
            // bw.close();

            return temp.getAbsolutePath();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return "";
    }

    public String runCmd(String cmdline,String sysEncode,String pageEncode) {
        StringBuilder sb = new StringBuilder("");

        try {
            Process pro = Runtime.getRuntime().exec(cmdline);

            BufferedReader br = new BufferedReader (new InputStreamReader(pro.getInputStream()));

            BufferedReader br2 = new BufferedReader (new InputStreamReader(pro.getErrorStream()));

            String msg = null;
            while ((msg = br.readLine()) != null) {
                sb.append(msg + "\n");
            }
            while ((msg = br2.readLine()) != null) {
                sb.append(msg + "\n");
            }

            // system use with gbk
            byte ptext[] = sb.toString().getBytes(sysEncode);
            return new String(ptext, pageEncode);

        } catch (IOException e) {
            e.printStackTrace();
        }
        return "error";
    }
}