package com.wutadove.controller;

import java.net.UnknownHostException;
import java.util.Date;

import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.MongoClient;
import com.wutadove.database.MongoClientFactory;
import com.wutadove.database.MongoParameter;

@Controller
public class ReportController {
	public static final String REPORT_PAGE = "report";
	public static final String DB_REPORT = "report";
	
	@RequestMapping(value=REPORT_PAGE, method=RequestMethod.POST)
	public @ResponseBody void handleRequest(HttpServletRequest request, Model model) throws UnknownHostException{
		MongoClient mongoClient = MongoClientFactory.create();
		DB db = mongoClient.getDB(MongoParameter.DATABASE);
		DBCollection reportCollection = db.getCollection(DB_REPORT);
		BasicDBObject doc = new BasicDBObject("type", request.getParameter("type"))
				.append("description", request.getParameter("description"))
				.append("user", FBLoginLogoutController.getUserId(request))
				.append("date", new Date());
		
		reportCollection.insert(doc);
	}
}
