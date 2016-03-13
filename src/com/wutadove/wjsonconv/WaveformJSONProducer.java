package com.wutadove.wjsonconv;

import java.io.File;
import java.io.ByteArrayInputStream;
import java.io.FileInputStream;
import java.util.ArrayList;
import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;


public class WaveformJSONProducer implements WaveformJSONProducable{
	public WaveformData produce(String sDestFileName, byte [] rgSrcAudio, int nSamplesPerPixel) throws IOException, WavStreamException{
		return run(WavStream.openWavStream(new ByteArrayInputStream(rgSrcAudio)), sDestFileName , nSamplesPerPixel);
		

	}
	public WaveformData produce(String sDestFileName, String sSrcAudioFileName, int nSamplesPerPixel) throws IOException, WavStreamException{
		return run(WavStream.openWavStream(new FileInputStream(new File(sSrcAudioFileName))), sDestFileName , nSamplesPerPixel);
		

	}
	
	public WaveformData produceWithoutWritingFile(String sSrcAudioFileName, int nSamplesPerPixel) throws IOException, WavStreamException{
		return run(WavStream.openWavStream(new FileInputStream(new File(sSrcAudioFileName))), nSamplesPerPixel);
		

	}
	
	private WaveformData run(WavStream wavStream, int nSamplesPerPixel) throws IOException, WavStreamException{
		int numChannels = wavStream.getNumChannels();
	      if(nSamplesPerPixel%numChannels != 0)throw new IOException("samples per pixel is not the multiply of number of channels");
	      int framesPerRead = nSamplesPerPixel/numChannels;
	      long duration = wavStream.getDuration();
	      //long numFrames = wavStream.getNumFrames();
	      long sampleRate = wavStream.getSampleRate();


	      double[] buffer = new double[nSamplesPerPixel];
	      
	      
	      // Display information about the wav file
	      //wavStream.display();

	      // Get the number of audio channels in the wav file
	      	
	      

	      int framesRead;
	      double min = Double.MAX_VALUE;
	      double max = Double.MIN_VALUE;
	      ArrayList <Integer> maxArray = new ArrayList <Integer> ();
	      ArrayList <Integer> minArray = new ArrayList <Integer> ();
	      int maxCount = 0;
	      int minCount = 0;
	  
	      do
	      {
	        // Read frames into buffer
	        framesRead = wavStream.readFrames(buffer, framesPerRead);
	        // min = Double.MAX_VALUE;
	        // max = Double.MIN_VALUE;
	        min = 0;
	        max = 0;
	        maxCount = 0;
	        minCount = 0;
	        
	        // Loop through frames and look for minimum and maximum value
	        for (int s=0 ; s<framesRead * numChannels ; s++)
	        {
	          
	          // if (buffer[s] > max) max = buffer[s];
	          // if (buffer[s] < min) min = buffer[s];
	          if(buffer[s] > 0){
	            max+= buffer[s];
	            maxCount++;
	          }
	          if(buffer[s] < 0){
	            min+= buffer[s];
	            minCount++;
	          }
	        }
	        // if((int)(max) != (int)Double.MIN_VALUE)maxArray.add((int)(max));
	        // else maxArray.add(0);

	        // if((int)(min) != (int)Double.MAX_VALUE)minArray.add((int)(min));
	        // else minArray.add(0);
	        if(maxCount != 0)maxArray.add((int)(max/maxCount) );
	        else maxArray.add(0);
	        if(minCount != 0)minArray.add((int)(min/minCount) );
	        else minArray.add(0);
	      }
	      while (framesRead != 0);
	      
	      wavStream.close();
	      return new WaveformData(sampleRate, nSamplesPerPixel, numChannels, duration, minArray, maxArray);
		
		
	}

private WaveformData run(WavStream wavStream, String sDestFileName, int nSamplesPerPixel) throws IOException, WavStreamException{

      
      // this is the old output format
      // out.write("{\"sample_rate\":" + sampleRate + ",\"samples_per_pixel\":" + nSamplesPerPixel + ",\"pixel_count\":" + 2*numFrames/nSamplesPerPixel + ",\"start_time\":0,\"duration\":" + duration + ",\"min\":[" );
      // this is the new simplified format
	  WaveformData waveformData = run(wavStream, nSamplesPerPixel);
	  FileWriter fstream = new FileWriter(sDestFileName);
      BufferedWriter out = new BufferedWriter(fstream);
      out.write("{sample_rate:" + waveformData.getSample_rate() + ",samples_per_pixel:" + nSamplesPerPixel + ",number_of_channel:" + waveformData.getNumber_of_channel() + ",duration:" + waveformData.getDuration() + ",min:[" );
      for(Integer i : waveformData.getMin()){
        out.write(i + ",");
      }
      out.write("0], max: [");
      for(Integer i : waveformData.getMax()){
        out.write(i + ",");
      }
      out.write("0]}");
      out.flush();
      out.close();
      
      return waveformData;

  


 }

}