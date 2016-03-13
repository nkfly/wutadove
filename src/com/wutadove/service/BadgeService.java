package com.wutadove.service;

import java.util.List;

import com.mongodb.DB;
import com.mongodb.DBObject;
import com.wutadove.database.MongoParameter;
import com.wutadove.model.Badge;
import com.wutadove.model.User;
import com.wutadove.model.Video;
import com.wutadove.util.MongoDBConverter;

public class BadgeService {
	public static String createUserBadgeDisplay(DB db, DBObject videoEntry){		
		DBObject userEntry = MongoDBConverter.getDBObjectFromId(db, MongoParameter.USER_COLLECTION, videoEntry.get(Video.AUTHOR).toString() );		
		String userName = (userEntry == null ? "無名氏" : userEntry.get(User.NAME).toString());		
		String badge = userEntry.get(User.BADGE).toString();
		List <String> badges = (List <String>)userEntry.get(User.BADGES);
		DBObject badgeEntry = MongoDBConverter.getDBObjectFromId(db, MongoParameter.BADGE_COLLECTION, badge );
		return "<span class='badge' title='" + badgeEntry.get(Badge.NAME).toString()+ "' data-badge-effect='" 
				+  badgeEntry.get(Badge.EFFECT).toString() + "' data-badge-count='"+  badges.size() + "'><span class='badge-text' >"+userName + "</span>"+" <i style='color:gold' class='fa fa-certificate'></i>"+badges.size()+"</span>";
		
	}

}
