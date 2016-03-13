package com.wutadove.database;

public class MongoParameter {
	public static String DATABASE = "wutadove";
	public static String VIDEO_COLLECTION = "video";
	public static String USER_COLLECTION = "user";
	public static String WAVEFORM_JSON_COLLECTION = "waveform_json";
	public static String DICTIONARY_COLLECTION = "dictionary";
	public static String GRAMMAR_COLLECTION = "grammar";
	public static String BADGE_COLLECTION = "badge";
	
	public static String getVideoCollectionName(String videoId, String videoIndex) {
		return "v_" + videoId + "_" + videoIndex; 
	}

}
