package com.wutadove.packet;

import java.util.List;


/*
 * subtitleRow.add("uid", rh.getParam("uid"))
    	.add("index", index)
    	.add("startTime", rh.getParam("startTime"))
    	.add("endTime", rh.getParam("endTime"))
    	.add("japaneseSentence", rh.getParam("japaneseSentence"))
    	.add("chineseSentence", rh.getParam("chineseSentence"))
    	.add("japaneseVocab", rh.getStringArrayList("japaneseVocab"))
    	.add("chineseVocab", rh.getStringArrayList("chineseVocab"))
    	.add("matched", rh.getStringArrayList("matched"))
    	.add("checked", rh.getStringArrayList("checked")); 
 * */
public class SubtitleRow {
	private String uid;
	private int index;
	private String startTime;
	private String endTime;
	private String japaneseSentence;
	private String chineseSentence;
	private List <String> japaneseVocab;
	private List <String> chineseVocab;
	private List <GrammarItem> matched;
	private List <String> checked;
	private List <String> reading;
	private List <String> position;
	
	public SubtitleRow(String uid,
			int index,
			String startTime,
			String endTime,
			String japaneseSentence,
			String chineseSentence,
			List <String> japaneseVocab,
			List <String> chineseVocab,
			List <GrammarItem> matched,
			List <String> checked,
			List <String> reading,
			List <String> position){
		this.uid = uid;
		this.index = index;
		this.startTime = startTime;
		this.endTime = endTime;
		this.japaneseSentence = japaneseSentence;
		this.chineseSentence = chineseSentence;
		this.japaneseVocab = japaneseVocab;
		this.chineseVocab = chineseVocab;
		this.matched = matched;
		this.checked = checked;
		this.reading = reading;
		this.position = position;
		
	}
	
	public List<String> getReading() {
		return reading;
	}

	public void setReading(List<String> reading) {
		this.reading = reading;
	}

	public List<String> getPosition() {
		return position;
	}

	public void setPosition(List<String> position) {
		this.position = position;
	}

	public String getUid() {
		return uid;
	}
	public void setUid(String uid) {
		this.uid = uid;
	}
	public int getIndex() {
		return index;
	}
	public void setIndex(int index) {
		this.index = index;
	}
	public String getStartTime() {
		return startTime;
	}
	public void setStartTime(String startTime) {
		this.startTime = startTime;
	}
	public String getEndTime() {
		return endTime;
	}
	public void setEndTime(String endTime) {
		this.endTime = endTime;
	}
	public String getJapaneseSentence() {
		return japaneseSentence;
	}
	public void setJapaneseSentence(String japaneseSentence) {
		this.japaneseSentence = japaneseSentence;
	}
	public String getChineseSentence() {
		return chineseSentence;
	}
	public void setChineseSentence(String chineseSentence) {
		this.chineseSentence = chineseSentence;
	}
	public List<String> getJapaneseVocab() {
		return japaneseVocab;
	}
	public void setJapaneseVocab(List<String> japaneseVocab) {
		this.japaneseVocab = japaneseVocab;
	}
	public List<String> getChineseVocab() {
		return chineseVocab;
	}
	public void setChineseVocab(List<String> chineseVocab) {
		this.chineseVocab = chineseVocab;
	}
	public List<GrammarItem> getMatched() {
		return matched;
	}
	public void setMatched(List<GrammarItem> matched) {
		this.matched = matched;
	}
	public List<String> getChecked() {
		return checked;
	}
	public void setChecked(List<String> checked) {
		this.checked = checked;
	}
	
	

}
