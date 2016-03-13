package com.wutadove.model;

public class Dictionary {
	public static final String _ID = "_id";
	public static final String KEYWORD = "keyword";
	public static final String READING = "reading";
	public static final String TRANSLATIONS = "translations";
	public static final String FREQUENCYS = "frequencys";
	
	private String _id;
	private String keyword;
	private String translation;
	public String get_id() {
		return _id;
	}
	public void set_id(String _id) {
		this._id = _id;
	}
	public String getKeyword() {
		return keyword;
	}
	public void setKeyword(String keyword) {
		this.keyword = keyword;
	}
	public String getTranslation() {
		return translation;
	}
	public void setTranslation(String translation) {
		this.translation = translation;
	}

}
