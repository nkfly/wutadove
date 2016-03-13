package com.wutadove.wjsonconv;

import java.io.IOException;
public interface WaveformJSONProducable{
	WaveformData produce(String sDestFileName, byte [] rgSrcAudio, int nSamplesPerPixel) throws IOException, WavStreamException;
	WaveformData produce(String sDestFileName, String sSrcAudioFileName, int nSamplesPerPixel)throws IOException, WavStreamException;
}