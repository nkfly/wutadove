package com.wutadove.edit;

import java.net.UnknownHostException;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;


import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBObject;
import com.mongodb.QueryBuilder;
import com.wutadove.database.MongoParameter;
import com.wutadove.model.Video;

class LockInfo{
	private String userId;
	private Date lockReceiveTime;
	
	public LockInfo(String u,  Date l){
		userId = u;
		lockReceiveTime = l;
	}

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public Date getLockReceiveTime() {
		return lockReceiveTime;
	}

	public void setLockReceiveTime(Date lockReceiveTime) {
		this.lockReceiveTime = lockReceiveTime;
	}
	
	
}

public class EditLockHandler {
	private static final Long LOCK_TIME_LIMIT = (long) 600000;// mili seconds
	private static Map <String, LockInfo> lock = Collections.synchronizedMap(new HashMap<String, LockInfo>());
	
	public static Integer getVideoIndex(DB db, String userId, String videoId) {
    	DBCollection coll = db.getCollection(MongoParameter.VIDEO_COLLECTION);
    	
    	DBObject query = QueryBuilder.start(Video.AUTHOR).is(userId).and(Video.VIDEO_ID).is(videoId).get();
    	DBObject match = coll.findOne(query);
    	if (match != null) {
    		return (Integer)match.get(Video.INDEX); 
    	}
		return -1;		
	}
	
	public static synchronized void releaseLock(String videoId){
		lock.remove(videoId);
	}
	
	public static synchronized boolean isWriteAllowed(String userId, String videoId) throws UnknownHostException{
		
		LockInfo lockInfo  = null;
		if ( (lockInfo = lock.get(videoId)) != null) {
			if (lockInfo.getUserId().equals(userId)){
				lockInfo.setLockReceiveTime(new Date());
				lock.put(videoId, lockInfo);
				return true;
			} else if( (new Date()).getTime() - lockInfo.getLockReceiveTime().getTime() >= LOCK_TIME_LIMIT) {
				lockInfo.setUserId(userId);
				lockInfo.setLockReceiveTime(new Date());
				lock.put(videoId, lockInfo);
				return true;
			} else {
				return false;
			}
		} else {
			lock.put(videoId, new LockInfo(userId, new Date()));
			return true; 
		}
		
//		MongoClient mongoClient = MongoClientFactory.create();
//		DBCollection collection =  mongoClient.getDB(MongoParameter.DATABASE).getCollection(MongoParameter.VIDEO_COLLECTION);
//		DBObject query = QueryBuilder.start(Video.VIDEO_ID).is(videoId).get();
//		boolean allow = false;
//		String userId = FBLoginLogoutController.getUserId(request);
//		synchronized (queryLock) {
//			DBObject match = collection.findOne(query);
//	    	if(match != null){
//	    		Video video = new Video(match);
//	    		if (video.getLockReceiver() == null 
//	    				|| userId.equals(video.getLockReceiver())
//	    				|| (new Date()).getTime() - video.getLockReceiveTime().getTime() >= LOCK_TIME_LIMIT) {
//	    			match.put(Video.LOCK_RECEIVER, userId);
//	    			match.put(Video.LOCK_RECEIVE_TIME, new Date());
//	    			match.put(Video.LOCK_TAB_ID, request.getParameter(PARAM_TAB_ID));
//	    			BasicDBObject keys = new BasicDBObject();
//	    	    	keys.put(Video.VIDEO_ID, video.getVideoId());
//	    	    	collection.findAndModify(keys, null, null, false, match, true, true);
//	    			allow = true;
//	    		}
//	    	}
//		}
//		mongoClient.close();
//		return allow;
//		String videoLock = request.getParameter(videoId+"_lock");
//		if (videoLock == null) {
//			
//		}
//		String userId = FBLoginLogoutController.getUserId(request);
//		System.out.println(new Date().getTime());
		//return true;
		

		
	}

}
