package com.wutadove.packet;

import java.util.List;

public class Vocabulary {
	private String surfaceForm;
	private String reading;
	private List <String> translations;
	
	public Vocabulary(String s, String r, List <String> t){
		surfaceForm = s;
		reading = r;
		translations = t;
		
	}
	public String getSurfaceForm() {
		return surfaceForm;
	}
	public void setSurfaceForm(String surfaceForm) {
		this.surfaceForm = surfaceForm;
	}
	public String getReading() {
		return reading;
	}
	public void setReading(String reading) {
		this.reading = reading;
	}
	public List <String> getTranslations() {
		return translations;
	}
	public void setTranslations(List <String> translations) {
		this.translations = translations;
	}
	
	

}
