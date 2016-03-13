package com.wutadove.avconv;

import net.sourceforge.jaad.aac.Decoder;
import net.sourceforge.jaad.aac.SampleBuffer;
import net.sourceforge.jaad.mp4.MP4Container;
import net.sourceforge.jaad.mp4.api.AudioTrack;
import net.sourceforge.jaad.mp4.api.Frame;
import net.sourceforge.jaad.util.wav.WaveFileWriter;
import java.io.File;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.RandomAccessFile;


public class AudioVideoConverter implements AVConvertable{
	public byte [] convert(String sSrcFileName, AVConversionKind kind) throws IOException{
		if(kind == AVConversionKind.MP4_TO_WAV){
			MP4Container container = new MP4Container( new RandomAccessFile(new File(sSrcFileName) ,"rw") );
			AudioTrack track = container.getAudioTrack();
			WaveFileWriter wav = new WaveFileWriter(new ByteArrayOutputStream(), track.getSampleRate(), track.getChannelCount(), track.getSampleSize());
			decode(track, wav);
			container.close();
			wav.close();
			return wav.toByteArray();
		}else {
			throw new IOException("unknown conversion type!");	
		}
		
	}
	public byte [] convert(byte [] rgSrcDataByte, AVConversionKind kind) throws IOException{
		if(kind == AVConversionKind.MP4_TO_WAV){
			MP4Container container = new MP4Container(new ByteArrayInputStream(rgSrcDataByte));
			AudioTrack track = container.getAudioTrack();
			WaveFileWriter wav = new WaveFileWriter(new ByteArrayOutputStream(), track.getSampleRate(), track.getChannelCount(), track.getSampleSize());
			decode(track, wav);
			container.close();
			wav.close();
			return wav.toByteArray();
		}else {
			throw new IOException("unknown conversion type!");	
		}
	}
	public void convert(String sDestFileName, byte [] rgSrcDataByte, AVConversionKind kind) throws IOException{
		if(kind == AVConversionKind.MP4_TO_WAV){
			MP4Container container = new MP4Container(new ByteArrayInputStream(rgSrcDataByte));
			AudioTrack track = container.getAudioTrack();
			WaveFileWriter wav = new WaveFileWriter(new File(sDestFileName), track.getSampleRate(), track.getChannelCount(), track.getSampleSize());
			decode(track, wav);
			container.close();
			wav.close();
		}else {
			throw new IOException("unknown conversion type!");	
		}

	}
	public void convert(String sDestFileName, String sSrcFileName, AVConversionKind kind) throws IOException{
		if(kind == AVConversionKind.MP4_TO_WAV){
			MP4Container container = new MP4Container( new RandomAccessFile(new File(sSrcFileName) ,"rw") );
			AudioTrack track = container.getAudioTrack();
			WaveFileWriter wav = new WaveFileWriter(new File(sDestFileName), track.getSampleRate(), track.getChannelCount(), track.getSampleSize());
			decode(track, wav);
			container.close();
			wav.close();
		}else {
			throw new IOException("unknown conversion type!");
		}
		

	}





	private static void decode(AudioTrack track, WaveFileWriter wav) {
		try{
			final Decoder dec = new Decoder(track.getDecoderSpecificInfo());
			Frame frame;

			final SampleBuffer buf = new SampleBuffer();
			while(track.hasMoreFrames()) {
				frame = track.readNextFrame();
				dec.decodeFrame(frame.getData(), buf);
				wav.write(buf.getData());
		  	}

		}catch(Exception e){
			e.printStackTrace();
		}
		
	}

	

}