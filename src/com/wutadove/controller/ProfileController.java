package com.wutadove.controller;

import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.bson.types.ObjectId;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.view.RedirectView;

import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;
import com.mongodb.MongoClient;
import com.mongodb.QueryBuilder;
import com.wutadove.database.MongoClientFactory;
import com.wutadove.database.MongoParameter;
import com.wutadove.form.ProfileForm;
import com.wutadove.model.Badge;
import com.wutadove.model.User;
import com.wutadove.util.XSSFilter;


@Controller
public class ProfileController {
	public static final String viewPage = "profile";
	public static final String ATTRIBUTE_ID = "id";
	public static final String ATTRIBUTE_PROFILE_FORM = "profileForm";
	public static final String ATTRIBUTE_MY_WORK_COUNT = "myWorkCount";
	public static final String ATTRIBUTE_BADGE_LIST = "badgeList";
	public static final String ATTRIBUTE_BADGE = "badge";
	
	@RequestMapping(value=viewPage, method=RequestMethod.POST)
	public ModelAndView save(@ModelAttribute(ATTRIBUTE_PROFILE_FORM) ProfileForm profileForm, HttpServletRequest request, Model model) throws UnknownHostException{
		String userId = FBLoginLogoutController.getUserId(request);
		if (userId == null)return new ModelAndView(new RedirectView("/"));
		
		DBObject query = QueryBuilder.start(User._ID).is(new ObjectId(userId)).get();
		
		MongoClient mongoClient = MongoClientFactory.create();
		DB db = mongoClient.getDB(MongoParameter.DATABASE);
		DBCollection coll = db.getCollection(MongoParameter.USER_COLLECTION);
		DBObject match = coll.findOne(query);
		profileForm.setName(XSSFilter.stripXSS( profileForm.getName()));
		profileForm.setEmail(XSSFilter.stripXSS( profileForm.getEmail()));
		if (match != null) {
			match.put(User.NAME, profileForm.getName());
			match.put(User.EMAIL, profileForm.getEmail());
			match.put(User.BADGE, profileForm.getBadge());
			FBLoginLogoutController.setUserName(request, profileForm.getName());
			coll.findAndModify(query,null, null, false, match, false, false);
		}
		model.addAttribute(ATTRIBUTE_MY_WORK_COUNT, ReviewController.getMyWorkCount(db, userId));
		model.addAttribute(ATTRIBUTE_PROFILE_FORM, profileForm);
		return new ModelAndView(new RedirectView(viewPage,false, true, false));
		
	}
	
	@RequestMapping(value=viewPage, method=RequestMethod.GET)
    public ModelAndView handleRequest(HttpServletRequest request, Model model) throws UnknownHostException{
		
		String userId = FBLoginLogoutController.getUserId(request);
		if (userId == null)return new ModelAndView(new RedirectView("/"));
		
		ProfileForm profileForm = new ProfileForm();
		
		MongoClient mongoClient = MongoClientFactory.create();
		DB db = mongoClient.getDB(MongoParameter.DATABASE);
		DBCollection coll = db.getCollection(MongoParameter.USER_COLLECTION);
		DBObject query = QueryBuilder.start(User._ID).is(new ObjectId(userId)).get();
		DBObject match = coll.findOne(query);
		if (match != null) {
			profileForm.setName((String)match.get(User.NAME));
			profileForm.setEmail((String)match.get(User.EMAIL));
			List <String> badges = (List<String>)match.get(User.BADGES);
			List <ObjectId> badgeIds = new ArrayList<ObjectId>();
			for (String b : badges)badgeIds.add(new ObjectId(b));
			
			DBObject badgesQuery = QueryBuilder.start(Badge._ID).in(badgeIds.toArray()).get();
			DBCollection badgeCollection = db.getCollection(MongoParameter.BADGE_COLLECTION);
			DBCursor cursor = badgeCollection.find(badgesQuery);
			List <Badge> badgeList = new ArrayList<Badge>();
			while(cursor.hasNext()){
				DBObject entry = cursor.next();
				Badge badge = new Badge(entry);
				badgeList.add(badge);
			}
			model.addAttribute(ATTRIBUTE_BADGE_LIST, badgeList);
			
			DBObject badgeQuery = QueryBuilder.start(Badge._ID).is(new ObjectId(match.get(User.BADGE).toString())).get();
			DBObject entry = badgeCollection.findOne(badgeQuery);
			model.addAttribute(ATTRIBUTE_BADGE, new Badge(entry));
			
			
		}
		model.addAttribute(ATTRIBUTE_MY_WORK_COUNT, ReviewController.getMyWorkCount(db, userId));
		
		model.addAttribute(ATTRIBUTE_PROFILE_FORM, profileForm);
		
		return new ModelAndView(viewPage);
		
	}
	
	
		

}
