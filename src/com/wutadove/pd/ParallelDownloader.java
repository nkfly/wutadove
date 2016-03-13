package com.wutadove.pd;

import java.io.File;
import java.io.IOException;
import java.io.RandomAccessFile;
import java.net.HttpURLConnection;
import java.net.URL;


public class ParallelDownloader implements Downloadable{

    private int nNumberOfWorkingThread;
    private int nContentLength;
    private int nPieceLength;

    private void init(String sFileUrl, int nNumberOfConnection) throws IOException{
        if(nNumberOfConnection < 1)throw new IOException("nNumberOfConnection < 1");

        nNumberOfWorkingThread = nNumberOfConnection;
        URL url = new URL(sFileUrl);
        HttpURLConnection http = (HttpURLConnection) url.openConnection();
        if( (nContentLength = http.getContentLength()) == -1 )throw new IOException("connection cannot be established");
        nPieceLength = nContentLength/nNumberOfConnection;
        
    }
    
    @Override
    public void download(String sFileName, String sFileUrl, int nNumberOfConnection, boolean bIsBlocking) throws IOException{
        init(sFileUrl, nNumberOfConnection);

        File file = new File(sFileName);
        if (file.exists())file.delete();

        RandomAccessFile osf = new RandomAccessFile(file, "rw");
        osf.seek(nContentLength-1);
        osf.write(0);
        osf.close();
        
        for (int i = 0; i < nNumberOfConnection; i++) {
            int numberOfByte = (i+1 == nNumberOfConnection) ? nPieceLength + nContentLength%nNumberOfConnection: nPieceLength;
            DownloadThread downloadToFile = new FileDownloadThread(this, sFileUrl, sFileName, nPieceLength*i, numberOfByte);
            downloadToFile.start();
        }

        if(bIsBlocking)waitThread();
    }

    @Override 
    public byte [] download(String sFileUrl, int nNumberOfConnection, boolean bIsBlocking) throws IOException{
        init(sFileUrl, nNumberOfConnection);

        byte [] byteArray = new byte[nContentLength];
        
        for (int i = 0; i < nNumberOfConnection; i++) {
            int numberOfByte = (i+1 == nNumberOfConnection) ? nPieceLength + nContentLength%nNumberOfConnection: nPieceLength;
            DownloadThread downloadToByteArray = new ByteArrayDownloadThread(this, sFileUrl, byteArray, nPieceLength*i, numberOfByte);
            downloadToByteArray.start();
        }
        if(bIsBlocking)waitThread();
        return byteArray;
        
    }

    public synchronized void threadCompleteNotified(){
        nNumberOfWorkingThread--;
        notify();
    }

    private synchronized void waitThread(){
        while(nNumberOfWorkingThread > 0) {
            try { 
                wait(); 
            } 
            catch(InterruptedException e) { 
                e.printStackTrace(); 
            } 
        }
    }

    

}



