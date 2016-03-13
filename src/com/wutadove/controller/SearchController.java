package com.wutadove.controller;

import java.io.UnsupportedEncodingException;
import java.net.UnknownHostException;
import java.util.ArrayList;

import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

import com.google.gson.Gson;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;
import com.mongodb.MongoClient;
import com.mongodb.QueryBuilder;
import com.wutadove.database.MongoClientFactory;
import com.wutadove.database.MongoParameter;
import com.wutadove.model.User;
import com.wutadove.model.Video;
import com.wutadove.packet.SearchResponse;
import com.wutadove.service.BadgeService;
import com.wutadove.util.MongoDBConverter;

@Controller
public class SearchController {
	public static final String viewPage = "search";
	private static final String ATTRIBUTE_SEARCH_RESPONSE = "searchResponse";
	private static final String ATTRIBUTE_QUERY = "q";
	private static final String PARAMETER_QUERY = ATTRIBUTE_QUERY;
	private static final String PARAMETER_VIDEO = "v";
	@RequestMapping(value=viewPage, method=RequestMethod.GET)
    public ModelAndView handleRequest(HttpServletRequest request, Model model) throws UnsupportedEncodingException, UnknownHostException{
		MongoClient mongoClient = MongoClientFactory.create();
    	SearchResponse searchResponse = search(mongoClient, request.getParameterValues(PARAMETER_VIDEO));
//    	mongoClient.close();
    	
    	if(searchResponse != null){
    		String json = new Gson().toJson(searchResponse);
    		model.addAttribute(ATTRIBUTE_SEARCH_RESPONSE, json);
    		model.addAttribute(ATTRIBUTE_QUERY, request.getParameter(PARAMETER_QUERY));
    	}
    	
		return new ModelAndView(viewPage);
		
	}
	
	public SearchResponse search(MongoClient mongoClient, String [] videoIdArray) throws UnknownHostException{
		if(videoIdArray == null)return null;
		
    	DB db = mongoClient.getDB( MongoParameter.DATABASE);
    	DBCollection coll = db.getCollection(MongoParameter.VIDEO_COLLECTION);
    	
    	DBObject query = QueryBuilder.start(Video.VIDEO_ID).in(videoIdArray).and(Video.IS_PUBLIC).is(true).get();
		DBCursor cursor = coll.find(query);
		SearchResponse searchResponse = iterate(db, cursor); 
		return searchResponse;
	}
	
	public static SearchResponse iterate(DB db, DBCursor cursor) {
		if (cursor == null) return null;
		ArrayList <String> inDatabase = new ArrayList <String>();		
		ArrayList <String> author = new ArrayList <String>();
		ArrayList <Integer> view = new ArrayList <Integer>();
		ArrayList <Integer> index = new ArrayList <Integer>();
		ArrayList <String> title = new ArrayList <String>();
		ArrayList <String> description = new ArrayList <String>();
		ArrayList <String> duration = new ArrayList <String>();
		System.out.println("before");
		while(cursor.hasNext()) {
			DBObject videoEntry = cursor.next();
			//DBObject userEntry = MongoDBConverter.getDBObjectFromId(db, MongoParameter.USER_COLLECTION, entry.get(Video.AUTHOR).toString() );
			//String userName = (userEntry == null ? "無名氏" : userEntry.get(User.NAME).toString());
			String userName = BadgeService.createUserBadgeDisplay(db, videoEntry);
		   	inDatabase.add(videoEntry.get(Video.VIDEO_ID).toString());
			author.add(userName);
			index.add((Integer)(videoEntry.get(Video.INDEX)) );
			view.add((Integer)(videoEntry.get(Video.VIEW) ));
			title.add((String)videoEntry.get(Video.TITLE));
			description.add((String)videoEntry.get(Video.DESCRIPTION));
			duration.add((String)videoEntry.get(Video.DURATION));
	   }
		cursor.close();
		SearchResponse searchResponse = new SearchResponse(inDatabase, author, view, index,title,description,duration,"success");
		return searchResponse;
		
	}


}
