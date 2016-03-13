package com.wutadove.controller;

import java.net.UnknownHostException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.google.gson.Gson;
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

@Controller
public class IndexController {
	public static final String viewPage = "index";
	public static final String ATTRIBUTE_SEARCH_RESPONSE = "searchResponse";
	
	private SearchResponse skipAndSearch(int offset, int count) throws UnknownHostException{
    	MongoClient mongoClient = MongoClientFactory.create();
    	DB db = mongoClient.getDB( MongoParameter.DATABASE );
    	DBCollection coll = db.getCollection(MongoParameter.VIDEO_COLLECTION);
    	
    	DBObject query = QueryBuilder.start(Video.IS_PUBLIC).is(true).get();
		DBCursor cursor = coll.find(query).sort(new BasicDBObject(Video.CREATE_TIME,-1)).skip(offset).limit(count);
		SearchResponse searchResponse = SearchController.iterate(db, cursor);
    	if(searchResponse.getInDatabase().size() > 0)searchResponse.setStatusResponse("success");
    	else searchResponse.setStatusResponse("end");
    	return searchResponse;
    	
    }

	
	
	@RequestMapping(value=viewPage, method=RequestMethod.GET)
    public ModelAndView handleRequest(HttpServletRequest request, HttpServletResponse response, Model model) throws NumberFormatException, UnknownHostException{
		model.addAttribute(ATTRIBUTE_SEARCH_RESPONSE, skipAndSearch(0, 9));
		return new ModelAndView(viewPage);
		
	}
	
	@ResponseBody
	@RequestMapping(value=viewPage+"/video", produces="text/plain;charset=UTF-8", method=RequestMethod.GET)
    public String getVideo(HttpServletRequest request, HttpServletResponse response) throws NumberFormatException, UnknownHostException{
		SearchResponse indexResponse = skipAndSearch(Integer.parseInt(request.getParameter("offset")), Integer.parseInt(request.getParameter("count")));
		String json = new Gson().toJson(indexResponse); // anyObject = List<Bean>, Map<K, Bean>, Bean, String, etc..
		return json;
		
	}

}
