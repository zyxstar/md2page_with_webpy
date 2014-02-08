import java.io.*;
import java.util.*;


public class TestJ {

    public static void main(String[] args) {
        try {
            String lines="中文2×2=4 abc 123\ntest line";
            // byte ptext[] = lines.getBytes("GBK");
            // lines = new String(ptext, "UTF-8");
            File temp = new File(System.getProperty("java.io.tmpdir") + "\\aaaa.txt");

            OutputStreamWriter osw = null;
            osw = new OutputStreamWriter(new FileOutputStream(temp), "utf-8");

            osw.write(lines);
            osw.flush();
            osw.close();
            // BufferedWriter bw = new BufferedWriter(new FileWriter(temp));

            // bw.write(lines);
            // bw.close();



        } catch (IOException e) {
            e.printStackTrace();

        }
        //return "";
    }


}