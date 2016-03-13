package com.wutadove.packet;

import java.util.ArrayList;

import com.wutadove.wjsonconv.WaveformData;

public class EditResponse{
	private String status;
	private String reason;
	private WaveformData data;
	private ArrayList <SubtitleRow> subtitles;
	private boolean isPublic;
	public EditResponse(String s, String r, WaveformData wd, ArrayList <SubtitleRow> subtitles){
		status = s;
		reason = r;
		data = wd;
		this.subtitles = subtitles;
	}
	public void setData(WaveformData data){
		this.data = data;
	}
	public void setSubtitles(ArrayList<SubtitleRow> subs){
		subtitles = subs;
	}
	public void setStatus(String stat){
		status = stat;
	}
	public void setReason(String reason){
		this.reason = reason;
	}
	public void setPublic(boolean isPublic) {
		this.isPublic = isPublic;
	}
	
	
}