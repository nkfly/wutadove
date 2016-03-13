package com.wutadove.model;

public class Grammar {
	public static final String _ID = "_id";
	public static final String PATTERN = "pattern";
	public static final String BASE_FORM = "base_form";
	public static final String EXPLANATION = "explanation";
	
	private String _id;
	public String get_id() {
		return _id;
	}
	public void set_id(String _id) {
		this._id = _id;
	}
	public String getPattern() {
		return pattern;
	}
	public void setPattern(String pattern) {
		this.pattern = pattern;
	}
	public String getBaseForm() {
		return baseForm;
	}
	public void setBaseForm(String baseForm) {
		this.baseForm = baseForm;
	}
	public String getExplanation() {
		return explanation;
	}
	public void setExplanation(String explanation) {
		this.explanation = explanation;
	}
	private String pattern;
	private String baseForm;
	private String explanation;

}
