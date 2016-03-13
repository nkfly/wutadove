package com.wutadove.pd;

import java.net.HttpURLConnection;
import java.net.URL;
import java.io.InputStream;
import java.io.IOException;


public class DownloadThread extends Thread {

    protected ParallelDownloader parallelDownloader;
    protected String sFileUrl;
    protected int nStart;
    protected int nNumberOfByte;
    public static int BUFFER_SIZE = 2048;
    
    public DownloadThread(ParallelDownloader parallelDownloader,  String sFileUrl,int nStart,int nNumberOfByte){
        this.parallelDownloader = parallelDownloader;
        this.sFileUrl = sFileUrl; 
        this.nStart = nStart; 
        this.nNumberOfByte = nNumberOfByte;
    }
    public void run(){
        try {
            URL url = new URL(sFileUrl);
            HttpURLConnection http = (HttpURLConnection) url.openConnection();
            http.setRequestProperty("RANGE", "bytes="+nStart+"-"+nStart+nNumberOfByte);

            InputStream input = http.getInputStream();
            byte bytes[] = new byte[BUFFER_SIZE];
            int total = 0;
            int ret;                

            while ( (ret = input.read(bytes,0,BUFFER_SIZE)) != -1 && total < nNumberOfByte){   
                write(bytes, 0, ret);
                total += ret;
            }
            close();
            
        } catch (IOException e) {
            e.printStackTrace();
        }
        parallelDownloader.threadCompleteNotified();


    }


    protected void write(byte [] rgDataByte, int nOff, int nLen) throws IOException{
        // Child must implement this function!!
    }
    protected void close() throws IOException{
        // Child must implement this function!!        
    }
}