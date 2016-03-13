package com.wutadove.edit;
import java.io.*;
import java.util.Random;

import com.google.gson.Gson;
import com.mongodb.BasicDBObjectBuilder;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBObject;
import com.mongodb.QueryBuilder;
import com.wutadove.model.WaveformJSON;
import com.wutadove.pd.*;
import com.wutadove.avconv.*;
import com.wutadove.database.MongoParameter;
import com.wutadove.wjsonconv.*;

public class YoutubeVideoWaveformConverter {
	
	public static WaveformData stringToWaveformData(String data) {
        return new Gson().fromJson(data, WaveformData.class);
    }

	
	 public static WaveformData fileToWaveformData(File f) {
	        String result = null;
	        DataInputStream in = null;

	        try {
	            byte[] buffer = new byte[(int) f.length()];
	            in = new DataInputStream(new FileInputStream(f));
	            in.readFully(buffer);
	            result = new String(buffer);
	        } catch (IOException e) {
	            throw new RuntimeException("IO problem in fileToString", e);
	        } finally {
	            try {
	                in.close();
	            } catch (IOException e) { /* ignore it */
	            }
	        }
	        return new Gson().fromJson(result, WaveformData.class);
	    }
		
	public static WaveformData run(String directory,String videoId, String videoDirectUrl, String videoType, int lengthSeconds) throws Throwable {
	
		
		
		int randomNum = (new Random()).nextInt();
		
		String outputVideoName = directory + randomNum + videoId+videoType;
		String outputAudioName = directory + randomNum + videoId+".wav";

	    ParallelDownloader pd = new ParallelDownloader();
	    AudioVideoConverter avc = new AudioVideoConverter();
	    WaveformJSONProducer wp = new WaveformJSONProducer();
	    WaveformData returnWaveformData = null;
	    //if(lengthSeconds > 20*60){// 20 minutes
	    	pd.download(outputVideoName, videoDirectUrl, lengthSeconds/60+1, true);
	    	pd = null;
		    avc.convert(outputAudioName, outputVideoName, AVConversionKind.MP4_TO_WAV);
		      //ffmpeg version, but is still slow
		      //Process p = Runtime.getRuntime().exec("ffmpeg-20130630-git-ff130d7-win32-static/bin/ffmpeg -i " + videoId+"."+videoType + " " + videoId+".wav");
		      //p.waitFor();
		    avc = null;
		    /* <MSAR DEMO> 
		    Video returnedVideo = null;
		    if (extract) {
		    	Matlab matlab = new Matlab("rpca_mask_run('"+outputAudioName+"', '"+outputAudioName+"'); ");
				matlab.blockingExec();
				
				String videoImage = "C:/Users/user/Dropbox/subtitle_project/ffmpeg-20130630-git-ff130d7-win32-static/bin/flower.jpg";
				String mergedVideo = outputDirectory + "/" + videoId + "_upload.mp4";
				String command = "C:/Users/user/Dropbox/subtitle_project/ffmpeg-20130630-git-ff130d7-win32-static/bin/ffmpeg -f image2 -loop 1 -i "
						+ videoImage
						+ " -i "
						+ outputAudioName
						+ " -c:v libx264 -tune stillimage -c:a aac -strict experimental -b:a 192k -shortest -y "
						+ mergedVideo;
				
				Process process = Runtime.getRuntime().exec(command);
				new PrintStream(process.getInputStream()).start();
				new PrintStream(process.getErrorStream()).start();
				process.waitFor();
				
				returnedVideo = UploadVideo.upload(new File(mergedVideo));
		    	
		    }
		    
		
			
			/* </MSAR DEMO> */
		    
		    returnWaveformData = wp.produceWithoutWritingFile(outputAudioName, 1764);
		    		    
		    
		    /*<MSAR DEMO>
		    if (extract)returnWaveformData.setId(returnedVideo.getId());
		    /* </MSAR DEMO> */
		    wp = null;
		      //clean
		    File deleteTarget = null;
		    if((deleteTarget = new File(outputVideoName)) != null)deleteTarget.delete();
		    if((deleteTarget = new File(outputAudioName)) != null)deleteTarget.delete();
		    
		      
		/*}else {
			byte [] byteArray = pd.download(videoDirectUrl, lengthSeconds/60+1, true);
		    pd = null;
		    byte [] wavByte = avc.convert(byteArray, AVConversionKind.MP4_TO_WAV);
		    avc = null;
		    byteArray = null;
		    returnWaveformData = wp.produce(outputFileName, wavByte, 1000);
		    }
		*/
		
			
		    
		    
		    return returnWaveformData;
		    	

		  
		
		
		

		
			
		
			
		
		    
		  
  

  
    
  

  
  
 }
	public static void main(String [] argv) {
		WaveformJSONProducer wp = new WaveformJSONProducer();
		String outputAudioName = "C:/Users/user/git/MSAR/matlab/rpca/godKnows_E.wav";
		String outputFileName = "KoThNSYhEUE.json";
		try {
			wp.produce(outputFileName, outputAudioName, 1000);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (WavStreamException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
	}

 

 


 }

class PrintStream extends Thread 
 {
     java.io.InputStream __is = null;
     public PrintStream(java.io.InputStream is) 
     {
         __is = is;
     } 
 
     public void run() 
     {
         try 
         {
             while(this != null) 
             {
                 int _ch = __is.read();
                 if(_ch != -1) 
                     System.out.print((char)_ch); 
                 else break;
             }
         } 
         catch (Exception e) 
         {
             e.printStackTrace();
         } 
     
     }
 }
 
