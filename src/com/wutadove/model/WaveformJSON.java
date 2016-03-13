package com.wutadove.model;

public class WaveformJSON {
	public static final String _ID = "_id";
	public static final String VIDEO_ID = "id";
	public static final String DATA = "data";
	
	private String _id;
	private String videoId;
	private String data;
	public String getData() {
		return data;
	}
	public void setData(String data) {
		this.data = data;
	}
	public String get_id() {
		return _id;
	}
	public void set_id(String _id) {
		this._id = _id;
	}
	public String getVideoId() {
		return videoId;
	}
	public void setVideoId(String videoId) {
		this.videoId = videoId;
	}
	
	
	

}
