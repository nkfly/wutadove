package com.wutadove.controller;

import java.net.UnknownHostException;

import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.view.RedirectView;

import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;
import com.mongodb.MongoClient;
import com.mongodb.QueryBuilder;
import com.wutadove.database.MongoClientFactory;
import com.wutadove.database.MongoParameter;
import com.wutadove.model.Video;
import com.wutadove.packet.SearchResponse;
import com.wutadove.util.JSONHandler;

@Controller
public class ReviewController {
	public static final String viewPage = "review";
	private static final String ATTRIBUTE_PAGE_MAX = "pageMax";
	private static final String ATTRIBUTE_PAGE_RANGE = "pageRange";
	private static final String ATTRIBUTE_VIDEOS_JSON = "videosJSON";
	private static final String ATTRIBUTE_SEARCH_RESPONSE = "searchResponse";	
	private static final String ATTRIBUTE_PAGE = "page";
	private static final int VIDEO_NUMBER_IN_PAGE = 10;
	private static final int PAGE_RANGE = 5;
	
	@RequestMapping(value=viewPage+"/{page}", method=RequestMethod.GET)
    public ModelAndView handleRequest(HttpServletRequest request, @PathVariable("page") String page, Model model) throws UnknownHostException{
		
		String userId = FBLoginLogoutController.getUserId(request);
		if (userId == null)return new ModelAndView(new RedirectView("/"));
		
		int pageNumber = 0 ;
		try {
			pageNumber = Integer.valueOf(page) - 1 < 0 ? 0 : Integer.valueOf(page) - 1 ;// change to 0-based index
		}catch (Exception e) {
			return new ModelAndView(ErrorController.viewPage);
		}
		
		int offset = pageNumber * VIDEO_NUMBER_IN_PAGE;
		
		BasicDBObject query = new BasicDBObject();
    	query.put(Video.AUTHOR, userId);
    	
		MongoClient mongoClient = MongoClientFactory.create();
		DB db = mongoClient.getDB( MongoParameter.DATABASE );
    	DBCollection coll = db.getCollection(MongoParameter.VIDEO_COLLECTION);
    	
    	DBCursor cursor = coll.find(query);
    	int videoNumber = cursor.count();
    	cursor = cursor.sort(new BasicDBObject(Video.CREATE_TIME,-1)).skip(offset).limit(VIDEO_NUMBER_IN_PAGE);
    	SearchResponse searchResponse = SearchController.iterate(db, cursor);
    	
    	
		
		model.addAttribute(ATTRIBUTE_PAGE_MAX, videoNumber/VIDEO_NUMBER_IN_PAGE+1);
		model.addAttribute(ATTRIBUTE_PAGE, pageNumber+1);// normalize back to 1-based index
		model.addAttribute(ATTRIBUTE_PAGE_RANGE, PAGE_RANGE);
		model.addAttribute(ATTRIBUTE_VIDEOS_JSON, JSONHandler.toJavascriptArray(searchResponse.getInDatabase()));
		model.addAttribute(ATTRIBUTE_SEARCH_RESPONSE, searchResponse);
		return new ModelAndView(viewPage);
		
	}
	
	public static int getMyWorkCount(DB db, String userId){
		DBCollection coll = db.getCollection(MongoParameter.VIDEO_COLLECTION);
		DBObject query = QueryBuilder.start(Video.AUTHOR).is(userId).get();
		DBCursor cursor = coll.find(query);
    	int myWorkCount = cursor.count();
    	cursor.close();
    	return myWorkCount;
		
	}
	
		

}
