/*
 *  Copyright (C) 2011 in-somnia
 * 
 *  This file is part of JAAD.
 * 
 *  JAAD is free software; you can redistribute it and/or modify it 
 *  under the terms of the GNU Lesser General Public License as 
 *  published by the Free Software Foundation; either version 3 of the 
 *  License, or (at your option) any later version.
 *
 *  JAAD is distributed in the hope that it will be useful, but WITHOUT 
 *  ANY WARRANTY; without even the implied warranty of MERCHANTABILITY 
 *  or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Lesser General 
 *  Public License for more details.
 *
 *  You should have received a copy of the GNU Lesser General Public
 *  License along with this library.
 *  If not, see <http://www.gnu.org/licenses/>.
 */
package net.sourceforge.jaad.util.wav;

import java.io.File;
import java.io.IOException;
import java.io.RandomAccessFile;
import java.io.*;
import java.nio.ByteBuffer;


public class WaveFileWriter {

	private static final int HEADER_LENGTH = 44;
	private static final int RIFF = 1380533830; //'RIFF'
	private static final long WAVE_FMT = 6287401410857104416l; //'WAVEfmt '
	private static final int DATA = 1684108385; //'data'
	private static final int BYTE_MASK = 0xFF;
	private RandomAccessFile outFile;
	private ByteArrayOutputStream outstream;
	private final int sampleRate;
	private final int channels;
	private final int bitsPerSample;
	private int bytesWritten;

	public WaveFileWriter(ByteArrayOutputStream outstream, int sampleRate, int channels, int bitsPerSample) throws IOException {
		this(sampleRate, channels, bitsPerSample);
		this.outstream  = outstream;
		
	}


	public WaveFileWriter(File output, int sampleRate, int channels, int bitsPerSample) throws IOException {
		this(sampleRate, channels, bitsPerSample);

		outFile = new RandomAccessFile(output, "rw");
		outFile.write(new byte[HEADER_LENGTH]); //space for the header
	}
		private WaveFileWriter(int sampleRate, int channels, int bitsPerSample){
		this.sampleRate = sampleRate;
		this.channels = channels;
		this.bitsPerSample = bitsPerSample;
		bytesWritten = 0;
	}

	public void write(byte[] data) throws IOException {
		write(data, 0, data.length);
	}

	public void write(byte[] data, int off, int len) throws IOException {
		//convert to little endian
		byte tmp;
		for(int i = off; i<off+data.length; i += 2) {
			tmp = data[i+1];
			data[i+1] = data[i];
			data[i] = tmp;
		}
		if(outstream != null)outstream.write(data, off, len);
		if(outFile != null)outFile.write(data, off, len);

		bytesWritten += data.length;
	}

	public void write(short[] data) throws IOException {
		write(data, 0, data.length);
	}

	public void write(short[] data, int off, int len) throws IOException {
		
		for(int i = off; i<off+data.length; i++) {
			if(outstream != null){
				outstream.write(data[i]&BYTE_MASK);
				outstream.write((data[i]>>8)&BYTE_MASK);
			}
			if(outFile != null){
				outFile.write(data[i]&BYTE_MASK);
				outFile.write((data[i]>>8)&BYTE_MASK);
			}
			bytesWritten += 2;
		}
	}

	public void close() throws IOException {
		if(outFile != null){
			writeWaveHeader();
			outFile.close();
		}
		if(outstream != null){
			outstream.close();
		}
	}

	public byte [] toByteArray() throws IOException{
		if(outstream == null)throw new IOException("outstream cannot be converted to byte array");
		byte [] wavAudioData = outstream.toByteArray();
		byte [] wavFile = new byte[wavAudioData.length +44];//44 is the header of wav file
		
		writeWaveHeader(wavFile);

		for(int i = 0; i < bytesWritten;i++){
			wavFile[44+i] = wavAudioData[i];
		}

		return wavFile;

	}

	private void writeWaveHeader(byte [] wavFile) throws IOException {
		//out.seek(0);
		final int bytesPerSec = (bitsPerSample+7)/8;

		ByteBuffer header = ByteBuffer.allocate(44);

		header.putInt(RIFF); //wave label
		header.putInt(Integer.reverseBytes(bytesWritten+36)); //length in bytes without header
		header.putLong(WAVE_FMT);
		header.putInt(Integer.reverseBytes(16)); //length of pcm format declaration area
		header.putShort(Short.reverseBytes((short) 1)); //is PCM
		header.putShort(Short.reverseBytes((short) channels)); //number of channels
		header.putInt(Integer.reverseBytes(sampleRate)); //sample rate
		header.putInt(Integer.reverseBytes(sampleRate*channels*bytesPerSec)); //bytes per second
		header.putShort(Short.reverseBytes((short) (channels*bytesPerSec))); //bytes per sample time
		header.putShort(Short.reverseBytes((short) bitsPerSample)); //bits per sample
		header.putInt(DATA); //data section label
		header.putInt(Integer.reverseBytes(bytesWritten)); //length of raw pcm data in bytes

		byte [] headerBytes = header.array();
		for(int i = 0;i < headerBytes.length;i++){
			wavFile[i] = headerBytes[i];
		}
	}

	private void writeWaveHeader() throws IOException {
		outFile.seek(0);
		final int bytesPerSec = (bitsPerSample+7)/8;

		outFile.writeInt(RIFF); //wave label
		outFile.writeInt(Integer.reverseBytes(bytesWritten+36)); //length in bytes without header
		outFile.writeLong(WAVE_FMT);
		outFile.writeInt(Integer.reverseBytes(16)); //length of pcm format declaration area
		outFile.writeShort(Short.reverseBytes((short) 1)); //is PCM
		outFile.writeShort(Short.reverseBytes((short) channels)); //number of channels
		outFile.writeInt(Integer.reverseBytes(sampleRate)); //sample rate
		outFile.writeInt(Integer.reverseBytes(sampleRate*channels*bytesPerSec)); //bytes per second
		outFile.writeShort(Short.reverseBytes((short) (channels*bytesPerSec))); //bytes per sample time
		outFile.writeShort(Short.reverseBytes((short) bitsPerSample)); //bits per sample
		outFile.writeInt(DATA); //data section label
		outFile.writeInt(Integer.reverseBytes(bytesWritten)); //length of raw pcm data in bytes
	}
}
