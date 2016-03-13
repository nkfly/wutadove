package com.wutadove.avconv;

import java.io.IOException;



public interface AVConvertable{
	byte [] convert(String sSrcFileName, AVConversionKind kind) throws IOException;
	byte [] convert(byte [] rgSrcDataByte, AVConversionKind kind) throws IOException;
	void convert(String sDestFileName, byte [] rgSrcDataByte, AVConversionKind kind) throws IOException;
	void convert(String sDestFileName, String sSrcFileName, AVConversionKind kind) throws IOException;
}