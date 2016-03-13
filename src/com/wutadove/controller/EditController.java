package com.wutadove.controller;

import java.io.IOException;
import java.net.UnknownHostException;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.atilika.kuromoji.Token;
import org.atilika.kuromoji.Tokenizer;
import org.atilika.kuromoji.Tokenizer.Mode;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.google.gson.Gson;
import com.mongodb.BasicDBObject;
import com.mongodb.BasicDBObjectBuilder;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;
import com.mongodb.MongoClient;
import com.mongodb.QueryBuilder;
import com.wutadove.database.MongoClientFactory;
import com.wutadove.database.MongoParameter;
import com.wutadove.edit.BatchDictionaryUpdater;
import com.wutadove.edit.EditLockHandler;
import com.wutadove.edit.JapaneseAnnotator;
import com.wutadove.interceptor.RefererInterceptor;
import com.wutadove.model.Video;
import com.wutadove.packet.ReadingAndTranslations;
import com.wutadove.util.JSONHandler;
import com.wutadove.util.XSSFilter;


@Controller
public class EditController {
	public static final String viewPage = "edit";
	public static final String ATTRIBUTE_VIDEO_ID = "videoId";
	public static final String ATTRIBUTE_SHOW_USE = "showUse";
	public static final String ATTRIBUTE_COMMENT = "comment";
	public static final int ATTRIBUTE_MAX_LENGTH = 20;
	
	
	@RequestMapping(value=viewPage+"/{videoId}", method=RequestMethod.GET)
    public ModelAndView handleRequest(@PathVariable("videoId") String videoId, HttpServletRequest request, Model model) throws IOException{
		String userId = FBLoginLogoutController.getUserId(request);
    	if(userId == null){// not login
    		RefererInterceptor.setReferer(request);
    		return FBLoginLogoutController.loginRedirect(request);
    	}
    	MongoClient mongoClient = MongoClientFactory.create();
    	DB db = mongoClient.getDB( MongoParameter.DATABASE );
    	if ( ReviewController.getMyWorkCount(db, userId) == 0 ){
    		model.addAttribute(ATTRIBUTE_SHOW_USE, true);
    	} else {
    		model.addAttribute(ATTRIBUTE_SHOW_USE, false);
    	}
    	
    	model.addAttribute(ATTRIBUTE_VIDEO_ID, videoId);
    	model.addAttribute(ATTRIBUTE_COMMENT, getComment(db, userId, videoId));
    	model.addAttribute("maxLength", ATTRIBUTE_MAX_LENGTH);
		return new ModelAndView(viewPage);
		
	}
	
	private String getComment(DB db, String userId, String videoId){
		DBCollection coll = db.getCollection(MongoParameter.VIDEO_COLLECTION);
		DBObject query = QueryBuilder.start(Video.AUTHOR).is(userId).and(Video.VIDEO_ID).is(videoId).get();
		DBObject match = coll.findOne(query);
		if (match == null) {
			return "";
		}
		
		return match.get(Video.COMMENT).toString();
		
	}
	
	/*@ResponseBody
	@RequestMapping(value="release/{videoId}",  produces="text/html;charset=UTF-8",method=RequestMethod.POST)
    public String release(@PathVariable("videoId") String videoId) throws IOException{
		EditLockHandler.releaseLock(videoId);
		return (new JSONObject()).put("status", "success").toString();
	}*/
	
	private String setVideoPublic(HttpServletRequest request, String videoId, boolean isPublic) throws UnknownHostException{
		String userId = FBLoginLogoutController.getUserId(request);
    	if(userId == null){
    		return (new JSONObject()).put("status", "fail").put("reason", "not login").toString();
    	}
    	MongoClient mongoClient = MongoClientFactory.create();
    	DB db = mongoClient.getDB( MongoParameter.DATABASE );
    	
    	DBCollection coll = db.getCollection(MongoParameter.VIDEO_COLLECTION);
    	DBObject query = QueryBuilder.start(Video.VIDEO_ID).is(videoId).and(Video.AUTHOR).is(userId).get();
    	
    	DBObject match = coll.findOne(query);
    	if (match != null) {
    		match.put(Video.IS_PUBLIC, isPublic);
    		coll.findAndModify(query, null, null, false, match, false, true);
    	}
		
		return (new JSONObject()).put("status", "success").toString();
		
	}
	
	@ResponseBody
	@RequestMapping(value=viewPage+"/getindex/{videoId}", produces="text/html;charset=UTF-8", method=RequestMethod.GET)
	public String getVideoIndex(HttpServletRequest request, @PathVariable("videoId") String videoId) throws UnknownHostException {
		String userId = FBLoginLogoutController.getUserId(request);
    	if(userId == null){
    		return (new JSONObject()).put("status", "fail").put("reason", "not login").toString();
    	}
    	
    	MongoClient mongoClient = MongoClientFactory.create();
    	DB db = mongoClient.getDB( MongoParameter.DATABASE );
    	
    	return (new JSONObject()).put("status", "success").put("index", EditLockHandler.getVideoIndex(db, userId, videoId)).toString();
	}
	
	
	@ResponseBody
	@RequestMapping(value=viewPage+"/unpublish/{videoId}", produces="text/html;charset=UTF-8", method=RequestMethod.POST)
	public String unpublish(HttpServletRequest request, @PathVariable("videoId") String videoId) throws UnknownHostException {
		return setVideoPublic(request, videoId, false);
	}
	@ResponseBody
	@RequestMapping(value=viewPage+"/publish/{videoId}", produces="text/html;charset=UTF-8", method=RequestMethod.POST)
	public String publish(HttpServletRequest request, @PathVariable("videoId") String videoId) throws UnknownHostException {
		return setVideoPublic(request, videoId, true);
	}
	
	@ResponseBody
	@RequestMapping(value=viewPage+"/update/comment/{videoId}", produces="text/html;charset=UTF-8", method=RequestMethod.POST)
	public String updateComment(HttpServletRequest request, @PathVariable("videoId") String videoId) throws UnknownHostException {
		String userId = FBLoginLogoutController.getUserId(request);
    	if(userId == null){
    		return (new JSONObject()).put("status", "fail").put("reason", "not login").toString();
    	}
    	
    	String comment = request.getParameter("comment");
    	
    	if (comment == null){
    		return (new JSONObject()).put("status", "fail").put("reason", "no comment").toString();
    	}
    	MongoClient mongoClient = MongoClientFactory.create();
    	DB db = mongoClient.getDB( MongoParameter.DATABASE );
    	
    	DBCollection coll = db.getCollection(MongoParameter.VIDEO_COLLECTION);
    	DBObject query = QueryBuilder.start(Video.VIDEO_ID).is(videoId).and(Video.AUTHOR).is(userId).get();
    	
    	DBObject match = coll.findOne(query);
    	if (match != null) {
    		match.put(Video.COMMENT, XSSFilter.stripXSS(comment));
    		coll.findAndModify(query, null, null, false, match, false, true);
    	}
		
		return (new JSONObject()).put("status", "success").toString();
	}
	
	@ResponseBody
	@RequestMapping(value=viewPage+"/update/{videoId}/{index}", produces="text/html;charset=UTF-8", method=RequestMethod.POST)
	public String update(HttpServletRequest request, @PathVariable("videoId") String videoId, @PathVariable("index") String index) throws JSONException, IOException{
		String userId = FBLoginLogoutController.getUserId(request);
    	if(userId == null){
    		return (new JSONObject()).put("status", "fail").put("reason", "not login").toString();
    	}
    	
    	MongoClient mongoClient = MongoClientFactory.create();
    	DB db = mongoClient.getDB( MongoParameter.DATABASE );
    	
    	Integer videoIndex = EditLockHandler.getVideoIndex(db, userId, videoId);
		if (videoIndex == -1) {
			return (new JSONObject()).put("status", "fail").put("reason", "video collection has not been created").toString();
		}
		
    	DBCollection coll = null;
    	String collectionName = MongoParameter.getVideoCollectionName(videoId, String.valueOf(videoIndex));
    	if(db.collectionExists(collectionName)) {
    		coll = db.getCollection(collectionName);
    	} else {
    		coll = db.createCollection(collectionName, null);
    	}
    	
    	JSONHandler jh = new JSONHandler((String)request.getParameter("data"));
    	ArrayList <String> japaneseVocab = jh.getStringArrayList("japaneseVocab");
    	ArrayList <String> chineseVocab = jh.getStringArrayList("chineseVocab");
    	String japaneseSentence = XSSFilter.stripXSS(jh.getParam("japaneseSentence"));
    	japaneseSentence = japaneseSentence.substring(0, japaneseSentence.length() > ATTRIBUTE_MAX_LENGTH ? ATTRIBUTE_MAX_LENGTH : japaneseSentence.length());
    	
    	String chineseSentence = XSSFilter.stripXSS(jh.getParam("chineseSentence"));
    	chineseSentence = chineseSentence.substring(0, chineseSentence.length() > ATTRIBUTE_MAX_LENGTH ? ATTRIBUTE_MAX_LENGTH : chineseSentence.length());
    	
    	BasicDBObjectBuilder subtitleRow = new BasicDBObjectBuilder();
    	subtitleRow.add("uid", userId)
    	.add("index", Integer.parseInt(index))
    	.add("startTime", jh.getParam("startTime"))
    	.add("endTime", jh.getParam("endTime"))
    	.add("japaneseSentence", japaneseSentence)
    	.add("chineseSentence", chineseSentence)
    	.add("japaneseVocab", japaneseVocab)
    	.add("chineseVocab", chineseVocab)
    	.add("matched", jh.getStringArrayList("matched"))
    	.add("checked", jh.getStringArrayList("checked"))
    	.add("reading", jh.getStringArrayList("reading"))
    	.add("position", jh.getStringArrayList("position"));
    	
    	BasicDBObject keys = new BasicDBObject();
    	keys.put("index", Integer.parseInt(index));
    	
    	coll.findAndModify(keys, null, null, false, subtitleRow.get(), false, true);
    	
    	BatchDictionaryUpdater.update(japaneseVocab, chineseVocab, jh.getStringArrayList("readings"));
    	
		return (new JSONObject()).put("status", "success").toString();
    }
		
	
	@ResponseBody
	@RequestMapping(value=viewPage+"/delete/{videoId}/{index}", produces="text/html;charset=UTF-8", method=RequestMethod.POST)
	public String delete(HttpServletRequest request, @PathVariable("videoId") String videoId, @PathVariable("index") String index) throws JSONException, IOException{
		String userId = FBLoginLogoutController.getUserId(request);
    	if(userId == null){
    		return (new JSONObject()).put("status", "fail").put("reason", "not login").toString();
    	}
		
		MongoClient mongoClient = MongoClientFactory.create();
    	DB db = mongoClient.getDB( MongoParameter.DATABASE );
    	
    	Integer videoIndex = EditLockHandler.getVideoIndex(db, userId, videoId);
    	
    	String collectionName = MongoParameter.getVideoCollectionName(videoId, String.valueOf(videoIndex));
    	if(!db.collectionExists(collectionName)){
    		return (new JSONObject()).put("status", "fail").put("reason", "no such video content exists").toString();
    	}
    	DBCollection coll = db.getCollection(collectionName);
    	
    	BasicDBObject keys = new BasicDBObject();
    	keys.put("index", Integer.parseInt(index));
    	
    	coll.remove(keys);
    	
    	
		return (new JSONObject()).put("status", "success").toString();
    	
    	
    }
	
	@ResponseBody
	@RequestMapping(value=viewPage+"/lookup/{keyword}", produces="text/html;charset=UTF-8", method=RequestMethod.GET)
	public String lookupInDictionary(@PathVariable("keyword") String keyword, HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException, SQLException, ClassNotFoundException {
		Tokenizer tokenizer = Tokenizer.builder().mode(Mode.SEARCH).build();
		List<Token> result = tokenizer.tokenize(keyword);
		String reading = "?";
		if (result.size() == 1) {// if there're more than 1 token, just use the original multiple-token keyword to lookup
			keyword = result.get(0).getBaseForm();
			reading = result.get(0).getReading();
		}
		
		MongoClient mongoClient = MongoClientFactory.create();
		DB db = mongoClient.getDB(MongoParameter.DATABASE);
		DBCollection coll = db.getCollection(MongoParameter.DICTIONARY_COLLECTION);
		ReadingAndTranslations readingAndTranslations = JapaneseAnnotator.lookupForTranslation(coll, keyword);
		readingAndTranslations.reading = reading == null ? readingAndTranslations.reading : reading.equals("?") ? readingAndTranslations.reading : reading;  
		
		return (new Gson()).toJson(readingAndTranslations);
	}
	
	
	
	/*@ResponseBody
	@RequestMapping(value=viewPage+"/update/{videoId}/{index}/{field}", produces="text/html;charset=UTF-8", method=RequestMethod.POST)
	public String updateField(HttpServletRequest request, @PathVariable("videoId") String videoId, 
			@PathVariable("index") String index,
			@PathVariable("field") String field) throws JSONException, IOException{
		String userId = FBLoginLogoutController.getUserId(request);
    	if(userId == null){
    		return (new JSONObject()).put("status", "fail").put("reason", "not login").toString();
    	}
    	if (!EditLockHandler.isWriteAllowed(userId, videoId)){
    		return (new JSONObject()).put("status", "fail").put("reason", "lock is used by another person").toString();
		}
		
    	JSONHandler jh = new JSONHandler((String)request.getParameter("data"));
    	if (jh.getParam(field) == null) {
    		return (new JSONObject()).put("status", "fail").put("reason", "attribute content not in data").toString();
    	}
    	
    	BasicDBObject query = new BasicDBObject();
    	query.put("index", Integer.parseInt(index));
    	DBObject queryResult = null;
    	
		MongoClient mongoClient = MongoClientFactory.create();
    	DB db = mongoClient.getDB( MongoParameter.DATABASE );
    	DBCollection coll = null;
    	if(db.collectionExists(videoId)){
    		coll = db.getCollection(videoId);
    	}else {
    		checkAndSetAuthor(mongoClient, videoId, userId);    
    		coll = db.createCollection(videoId, null);
    	}
    	
    	if ((queryResult = coll.findOne(query)) != null && queryResult.get(field) != null) {
    		queryResult.put(field, jh.getParam(field));
    		coll.findAndModify(query, null, null, false, queryResult, false, true);
    	}
    	    	
    	mongoClient.close();
		return (new JSONObject()).put("status", "success").toString();
    }*/
}
