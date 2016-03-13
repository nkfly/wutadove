package com.wutadove.pd;

public class ByteArrayDownloadThread extends DownloadThread {

    private byte [] rgBuffer;
    
    
    public ByteArrayDownloadThread(ParallelDownloader parallelDownloader,  String sFileUrl,byte [] rgBuffer,int nStart,int nNumberOfByte){
        super(parallelDownloader, sFileUrl, nStart, nNumberOfByte);
        this.rgBuffer = rgBuffer;

    }

    @Override
    protected void write(byte [] rgDataByte, int nOff, int nLen ){
        nStart += nOff;
        for(int i = 0;i < nLen;i++){
            rgBuffer[nStart+i] = rgDataByte[i];
        }
        nStart += nLen;
    }
    @Override
    protected void close(){
        rgBuffer = null;
    }

}