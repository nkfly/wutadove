package com.wutadove.controller;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URL;
import java.net.URLConnection;
import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.google.gson.Gson;
import com.mongodb.BasicDBList;
import com.mongodb.BasicDBObjectBuilder;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;
import com.mongodb.MongoClient;
import com.mongodb.QueryBuilder;
import com.wutadove.database.MongoClientFactory;
import com.wutadove.database.MongoParameter;
import com.wutadove.edit.EditLockHandler;
import com.wutadove.edit.YoutubeVideoWaveformConverter;
import com.wutadove.model.Video;
import com.wutadove.model.WaveformJSON;
import com.wutadove.packet.EditResponse;
import com.wutadove.packet.SubtitleRow;
import com.wutadove.util.HTTPClient;
import com.wutadove.util.MongoDBConverter;
import com.wutadove.wjsonconv.WaveformData;



/**
 * Servlet implementation class YoutubeUrlController
 */

@Controller
public class YoutubeUrlController {
	private static final Object videoIndexDispatcherLock = new Object();
    /**
     * @see HttpServlet#HttpServlet()
     */
    public YoutubeUrlController() {
        super();
        // TODO Auto-generated constructor stub
    }

	
	private String getContentFromUrl(String url) throws IOException{
		URL getVideoInfo = new URL(url);
        URLConnection connection = getVideoInfo.openConnection();
        BufferedReader in = new BufferedReader(
                                new InputStreamReader(
                                connection.getInputStream()));
        StringBuilder content = new StringBuilder();
        int value = 0;

        while ((value = in.read()) != -1){
        	content.append((char)value);
        } 
        in.close();
        return content.toString();
		
	}
	
	
	
	public ArrayList <VideoInfo>  getLinksFromYoutube(String videoId, EditResponse editResponse) throws IOException{
	    String videoInfoUrl = "http://www.youtube.com/get_video_info?video_id=" +  videoId;	    
	    
	    String videoInfo = "";
	    while (videoInfo.equals("")) {
	    	videoInfo = getContentFromUrl(videoInfoUrl);	    	
	    }
	    Map <String, List<String>> params =  HTTPClient.getUrlParameters(videoInfo);
	    List <String> links = params.get("url_encoded_fmt_stream_map");
	    ArrayList <VideoInfo> videoInfoList = new ArrayList <VideoInfo>(); 
	    if(links != null && links.size() > 0){
	    	for(String link : links.get(0).split(",")){
	    		Map <String, List<String>> videoParams = HTTPClient.getUrlParameters(link);
	    		String signature = null;
	    		if(videoParams.get("sig")!= null && videoParams.get("s") == null ){
	    			signature = videoParams.get("sig").get(0);
	    		}else if(videoParams.get("sig")== null && videoParams.get("s") != null){
	    			signature = signalHandler(videoParams.get("s").get(0));
	    		}
	    		VideoInfo videoInfoInstance = new VideoInfo(videoParams.get("quality").get(0),
	    				videoParams.get("type").get(0).split(";")[0], 
	    				videoParams.get("url").get(0) + "&signature=" + signature);
	    		videoInfoInstance.setLengthSeconds(params.get("length_seconds").get(0));
	    		videoInfoList.add(videoInfoInstance);
		    }
	    	
	    }else if (params.get("status") != null && params.get("reason") != null){
	    	editResponse.setStatus(params.get("status").get(0));
	    	editResponse.setReason(params.get("reason").get(0));	    	
	    }
	    
	    return videoInfoList;

		
	}
	
	private static String signalHandler(String s){
		StringBuilder trueSignal = new StringBuilder(s);
		trueSignal.setCharAt(0, s.charAt(52));
		trueSignal.setCharAt(52, s.charAt(0));
		
		trueSignal.setCharAt(83, s.charAt(62));
		trueSignal.setCharAt(62, s.charAt(83));
		
		trueSignal = new StringBuilder(trueSignal.substring(3)).reverse();
		
		return trueSignal.substring(3);
				
	}
	
	
	
	private ArrayList <SubtitleRow> getSubtitles(DB db,String videoId, String userId) throws UnknownHostException{
		ArrayList <SubtitleRow> subtitles = new ArrayList <SubtitleRow>();
    	Integer videoIndex = EditLockHandler.getVideoIndex(db, userId, videoId);
    	String collectionName = MongoParameter.getVideoCollectionName(videoId, String.valueOf(videoIndex));
    	if(db.collectionExists(collectionName)){
    		DBCollection coll = db.getCollection(collectionName);
    		DBCursor cursor = coll.find();
    		try {
        		DBObject entry = null;
        		while(cursor.hasNext()) {
        		   entry = cursor.next();
        		   SubtitleRow subtitleRow = new SubtitleRow(entry.get("uid").toString(), Integer.parseInt(entry.get("index").toString()), 
        				   entry.get("startTime").toString(), entry.get("endTime").toString(),
        				   entry.get("japaneseSentence").toString(), entry.get("chineseSentence").toString(),
        				   MongoDBConverter.basicDBListToArrayList((BasicDBList)entry.get("japaneseVocab")) ,
        				   MongoDBConverter.basicDBListToArrayList((BasicDBList)entry.get("chineseVocab")),
        				   MongoDBConverter.queryGrammarFromId(db, MongoDBConverter.basicDBListToArrayList((BasicDBList)entry.get("matched"))),
        				   MongoDBConverter.basicDBListToArrayList((BasicDBList)entry.get("checked")),
        				   MongoDBConverter.basicDBListToArrayList((BasicDBList)entry.get("reading")),
        				   MongoDBConverter.basicDBListToArrayList((BasicDBList)entry.get("position")));
        		   subtitles.add(subtitleRow);
        	   }
        	} finally {
        	   cursor.close();
        	}
    		
    	}
    	
		
		return subtitles;
		
	}
	
	private boolean getVideoPublishStatus(DB db, String videoId, String userId){
		DBCollection coll = db.getCollection(MongoParameter.VIDEO_COLLECTION);
		DBObject query = QueryBuilder.start(Video.VIDEO_ID).is(videoId).and(Video.AUTHOR).is(userId).get();
		DBObject match = coll.findOne(query);
		if (match != null) {
			return (boolean)match.get(Video.IS_PUBLIC);
		}
		return false;
	}
	
	public int checkAndSetAuthor(DB db, String videoId, String userId, String title, String description, String duration){
    	DBCollection coll = db.getCollection(MongoParameter.VIDEO_COLLECTION);
    	DBObject query = QueryBuilder.start(Video.VIDEO_ID).is(videoId).get();
    	synchronized (videoIndexDispatcherLock) {
    		DBCursor cursor = coll.find(query);
	    	int videoIndex = cursor.count()+1;
	    	boolean isOneOfTheAuthors = false;
	    	while (cursor.hasNext()) {
	    		DBObject entry = cursor.next();
	    		if (entry.get(Video.AUTHOR).equals(userId)) {
	    			isOneOfTheAuthors = true;
	    			break;
	    		}
	    	}
	    	cursor.close();
	    	if(!isOneOfTheAuthors){
	    		BasicDBObjectBuilder video = new BasicDBObjectBuilder();
	        	video.add(Video.VIDEO_ID, videoId)
	        	.add(Video.TITLE, title)
	        	.add(Video.AUTHOR, userId)
	        	.add(Video.VIEW, 0)
	        	.add(Video.INDEX, videoIndex)
	        	.add(Video.DESCRIPTION, description)
	        	.add(Video.DURATION, duration)
	        	.add(Video.CREATE_TIME,new Date())
	        	.add(Video.IS_PUBLIC,false)
	        	.add(Video.COMMENT, "");
	        	coll.save(video.get());
	    	}
	    	return videoIndex;
    	}
}

	/**
	 * @throws Throwable 
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	@ResponseBody
	@RequestMapping(value="/youtubeurl", produces="text/html;charset=UTF-8", method=RequestMethod.POST)
	public String doPost(HttpServletRequest request, HttpServletResponse response) throws Throwable {
		String userId = FBLoginLogoutController.getUserId(request);
    	if(userId == null){
    		return new Gson().toJson(new EditResponse("fail", "not login", null, null));
    	}
		String videoId = request.getParameter("videoId");
		if(videoId == null)return new Gson().toJson(new EditResponse("fail", "wrong video id", null, null));
		
		String title = request.getParameter("title");
		if(title == null)return new Gson().toJson(new EditResponse("fail", "no title", null, null));
		
		String description = request.getParameter("description");
		if(description == null)return new Gson().toJson(new EditResponse("fail", "no description", null, null));
		
		String duration = request.getParameter("duration");
		if(duration == null)return new Gson().toJson(new EditResponse("fail", "no duration", null, null));

		
		EditResponse editResponse = new EditResponse("success", "", null, null);
		
				
		WaveformData data = null;
		MongoClient mongoClient = MongoClientFactory.create();
		DB db = mongoClient.getDB(MongoParameter.DATABASE);
		Integer videoIndex = EditLockHandler.getVideoIndex(db, userId, videoId);
		if (videoIndex == -1) {
			videoIndex = checkAndSetAuthor(db, videoId, userId, title, description, duration);
		}
			
		DBCollection coll = db.getCollection(MongoParameter.WAVEFORM_JSON_COLLECTION);
		if (coll != null) {
			DBObject query = QueryBuilder.start(WaveformJSON.VIDEO_ID).is(videoId).get();
			DBObject match = coll.findOne(query);
			if (match != null) {
				data = YoutubeVideoWaveformConverter.stringToWaveformData((String)match.get(WaveformJSON.DATA));
			}else {
				ArrayList <VideoInfo> links = getLinksFromYoutube(videoId, editResponse);

				if (links.size() == 0) {
					return new Gson().toJson(editResponse);
				}
				
				VideoInfo videoInfoInstance = null;
				for(VideoInfo video : links){
					if(video.getType().equals("video/mp4")){
						if(videoInfoInstance == null){
							videoInfoInstance = video;					
						}else {
							if(video.getQuality() < videoInfoInstance.getQuality()){
								videoInfoInstance = video;
							}
						}
					}
				}				
				int lengthSeconds = Integer.parseInt(videoInfoInstance.getLengthSeconds());
				
				if (lengthSeconds > 60*10) {
					editResponse = new EditResponse("fail", "too long", null, null);
					return new Gson().toJson(editResponse);
				}


				data = YoutubeVideoWaveformConverter.run(request.getServletContext().getRealPath("/video")+"/" ,videoId, videoInfoInstance.getUrl(), videoInfoInstance.getType().replace('/', '.'), 
						lengthSeconds);
				
				BasicDBObjectBuilder videoWaveformJson = new BasicDBObjectBuilder();
			    videoWaveformJson.add(WaveformJSON.VIDEO_ID, videoId).add(WaveformJSON.DATA, new Gson().toJson(data));
			    coll.insert(videoWaveformJson.get());
			    
			}
		}			
				
		
		ArrayList <SubtitleRow> subtitles = getSubtitles(db, videoId, userId);
		boolean isPublic = getVideoPublishStatus(db, videoId, userId);
		editResponse.setPublic(isPublic);
		editResponse.setData(data);
		editResponse.setSubtitles(subtitles);
		return new Gson().toJson(editResponse);
	}	

}



class VideoInfo{
	private int quality;
	private String type;
	private String url;
	private static String lengthSeconds;
	
	public void setLengthSeconds(String ls){
		lengthSeconds = ls;
	}
	
	public String getLengthSeconds(){
		return lengthSeconds;
	}
	
	public String getUrl(){
		return url;	
	}
	
	public int getQuality(){
		return quality;	
	}
	
	public String getType(){
		return type;	
	}
	
	public VideoInfo(String q, String t, String u){		
		quality = qualityMapping(q);
		type = t;
		url = u;
		
	}
	
	private static int qualityMapping(String quality){
		if(quality.equals("small"))return 0;
		else if(quality.equals("medium"))return 1;
		else if(quality.equals("large"))return 2;
		return -1;
		
	}

}
