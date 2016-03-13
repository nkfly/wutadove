package com.wutadove.pd;

import java.io.IOException;

public abstract interface Downloadable{
    public void download(String sFileName,String sFileUrl, int nNumberOfConnection, boolean bIsBlocking) throws IOException;
    public byte [] download(String sFileUrl, int nNumberOfConnection,boolean bIsBlocking) throws IOException;
    
}