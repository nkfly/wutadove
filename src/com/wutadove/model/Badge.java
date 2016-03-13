package com.wutadove.model;

import com.mongodb.DBObject;

public class Badge {
	public static String _ID = "_id";
	public static String NAME = "name";
	public static String EFFECT = "effect";
	
	private String _id;
	private String name;
	private String effect;
	
	public Badge(DBObject entry){
		if (entry.get(_ID) != null) _id = entry.get(_ID).toString();
		if (entry.get(NAME) != null) name = entry.get(NAME).toString();
		if (entry.get(EFFECT) != null) effect = entry.get(EFFECT).toString();
	}
	public String get_id() {
		return _id;
	}
	public void set_id(String _id) {
		this._id = _id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getEffect() {
		return effect;
	}
	public void setEffect(String effect) {
		this.effect = effect;
	}
	
	

}
