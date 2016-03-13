package com.wutadove.model;

import java.util.Date;

import com.mongodb.DBObject;

public class Video {
	public static final String _ID = "_id";
	public static final String VIDEO_ID = "id";
	public static final String AUTHOR = "author";
	public static final String TITLE = "title";
	public static final String COMMENT = "comment";
	public static final String DESCRIPTION = "description";
	public static final String DURATION = "duration";
	public static final String VIEW = "view";
	public static final String INDEX = "index";
	public static final String CREATE_TIME = "createTime";
	public static final String IS_PUBLIC = "isPublic";
	
	private String _id;
	private String videoId;
	private String title;
	private String comment;	
	private String description;
	private String duration;
	private String author;
	private Integer view;
	private Integer index;
	private Date createTime;
	private boolean isPublic;
	
	public Video(DBObject entry) {
		if (entry.get(_ID) != null)_id = entry.get(_ID).toString();
		if (entry.get(VIDEO_ID) != null)videoId = (String)entry.get(VIDEO_ID);
		if (entry.get(TITLE) != null)title = (String)entry.get(TITLE);
		if (entry.get(COMMENT) != null)comment = (String)entry.get(COMMENT);
		if (entry.get(DESCRIPTION) != null)description = (String)entry.get(DESCRIPTION);
		if (entry.get(DURATION) != null)duration = (String)entry.get(DURATION);
		if (entry.get(AUTHOR) != null)author = (String)entry.get(AUTHOR);
		if (entry.get(VIEW) != null)view = (Integer)entry.get(VIEW);
		if (entry.get(INDEX) != null)setIndex((Integer)entry.get(INDEX));
		if (entry.get(CREATE_TIME) != null)createTime = (Date)entry.get(CREATE_TIME);
		if (entry.get(IS_PUBLIC) != null)setPublic((boolean)entry.get(IS_PUBLIC));
	}
	
	public Video() {
		
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
	
	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}
	
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}
	
	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getDuration() {
		return duration;
	}

	public void setDuration(String duration) {
		this.duration = duration;
	}

	public Integer getView() {
		return view;
	}

	public void setLike(Integer view) {
		this.view = view;
	}

	public Date getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}

	public String getAuthor() {
		return author;
	}

	public void setAuthor(String author) {
		this.author = author;
	}

	public boolean isPublic() {
		return isPublic;
	}

	public void setPublic(boolean isPublic) {
		this.isPublic = isPublic;
	}

	public Integer getIndex() {
		return index;
	}

	public void setIndex(Integer index) {
		this.index = index;
	}
	

}
