package com.wutadove.controller;

import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;

import javax.servlet.http.HttpServletRequest;

import org.bson.types.ObjectId;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;
import com.mongodb.MongoClient;
import com.wutadove.database.MongoClientFactory;
import com.wutadove.database.MongoParameter;
import com.wutadove.model.User;
import com.wutadove.model.Video;
import com.wutadove.util.Lyric;

@Controller
public class LearnController {
	// TODO define constant in another class
	public static final String VIEW_PAGE = "learn";
	public static final String EDIT_PAGE = "editPage";
	public static final String PARAM_VIDEO_ID = "v";
	private static final String ATTRIBUTE_CAPTION_LIST = "captionList";
	private static final String ATTRIBUTE_VIDEO_ID = "videoId";
	private static final String ATTRIBUTE_VIEW_COUNT = "viewCount";
	private static final String ATTRIBUTE_VIDEO_TITLE = "title";
	private static final String ATTRIBUTE_VIDEO_AUTHOR = "author";
	private static final String ATTRIBUTE_VIDEO_COMMENT = "comment";
	
	@RequestMapping(value=VIEW_PAGE+"/{videoId}/{videoIndex}", method=RequestMethod.GET)
    public ModelAndView handleRequest(@PathVariable("videoId") String videoId, @PathVariable("videoIndex") String videoIndex, HttpServletRequest request, Model model) throws UnknownHostException{
		// TODO put MongoClient in context
		int intVideoIndex = 1;
		try {
			intVideoIndex = Integer.parseInt(videoIndex);
		}catch (Exception e){
			return new ModelAndView(ErrorController.viewPage);
		}
		
		MongoClient mongoClient = MongoClientFactory.create();
		DB db = mongoClient.getDB(MongoParameter.DATABASE);
		String videoCollectionName = MongoParameter.getVideoCollectionName(videoId, String.valueOf(intVideoIndex)/* TODO find with integer*/);
		
		// check whether the video exists
		DBCollection videoCollection = db.getCollection(MongoParameter.VIDEO_COLLECTION);
		BasicDBObject query = new BasicDBObject(Video.VIDEO_ID, videoId).append(Video.INDEX, intVideoIndex);
		DBObject video = videoCollection.findOne(query);
		if(video == null){
			// TODO redirect to error page
			return new ModelAndView(ErrorController.viewPage);
		}
		
		// check whether the video is public
		if(((boolean)video.get(Video.IS_PUBLIC)) == false) {
			return new ModelAndView(ErrorController.viewPage);
		}
		
		// update view count
		BasicDBObject update = new BasicDBObject("$inc", new BasicDBObject(Video.VIEW, 1));
		videoCollection.update(query, update);
		
		// get view count
		int viewCount = (int)video.get(Video.VIEW) + 1;
		model.addAttribute(ATTRIBUTE_VIEW_COUNT, viewCount);
		
		// get title
		String title = (String)video.get(Video.TITLE);
		model.addAttribute(ATTRIBUTE_VIDEO_TITLE, title);
		
		// get comment
		String comment = (String)video.get(Video.COMMENT);
		if(comment == null) {
			comment = "";
		}
		model.addAttribute(ATTRIBUTE_VIDEO_COMMENT, comment);
		
		// get author
		String authorId = (String)video.get(Video.AUTHOR);
		DBCollection userCollection = db.getCollection(MongoParameter.USER_COLLECTION);
		BasicDBObject userQuery = new BasicDBObject(Video._ID, new ObjectId(authorId));
		DBObject userEntry = userCollection.findOne(userQuery);
		String author = "無名氏";
		if(userEntry != null) {
			author = (String)userCollection.findOne(userQuery).get(User.NAME);
		}
		model.addAttribute(ATTRIBUTE_VIDEO_AUTHOR, author);

		// construct captionList object
		DBCollection lyricsCollection = db.getCollection(videoCollectionName);
		DBCursor cursor = lyricsCollection.find();
		DBObject entry;
		ArrayList<Lyric> captionList = new ArrayList<Lyric>();
		while(cursor.hasNext()) {
			entry = cursor.next();
			captionList.add(new Lyric(entry));
	    }
		cursor.close();

		//TODO can we make sure the index is correct?
		Collections.sort(captionList, new Comparator<Lyric>() {
	        public int compare(Lyric l1, Lyric l2){
	            if(l1.startTime < l2.startTime) {
	            	return -1;
	            }
	            else if(l1.startTime > l2.startTime) {
	            	return 1;
	            }
	            else {
	            	return 0;
	            }
	        }
	    });
		
		model.addAttribute(ATTRIBUTE_CAPTION_LIST, captionList);
		model.addAttribute(ATTRIBUTE_VIDEO_ID, videoId);
		model.addAttribute(EDIT_PAGE, "http://"+request.getServerName()+"/edit/"+videoId);
		
		return new ModelAndView(VIEW_PAGE);
	}
}
