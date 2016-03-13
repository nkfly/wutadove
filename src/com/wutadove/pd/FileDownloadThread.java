package com.wutadove.pd;

import java.io.File;
import java.io.RandomAccessFile;
import java.io.IOException;

public class FileDownloadThread extends DownloadThread {

    
    private RandomAccessFile osf;

    public FileDownloadThread(ParallelDownloader parallelDownloader,  String sFileUrl,String sFileName,int nStart,int nNumberOfByte) throws IOException{
        super(parallelDownloader, sFileUrl, nStart, nNumberOfByte);
        
        osf = new RandomAccessFile(new File(sFileName), "rw");
        osf.seek(nStart);
        

    }
    @Override
    protected void write(byte [] rgDataByte, int nOff, int nLen ) throws IOException{
        osf.write(rgDataByte, nOff, nLen);
    }

    @Override
    protected void close() throws IOException{
        osf.close();
        osf = null;
    }


}