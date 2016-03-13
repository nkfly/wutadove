package com.wutadove.packet;

import java.util.List;

public class SearchResponse{
	private List <String> inDatabase;
	private List <String> author;
	public List<String> getAuthor() {
		return author;
	}
	public void setAuthor(List<String> author) {
		this.author = author;
	}
	public List<Integer> getView() {
		return view;
	}
	public void setView(List<Integer> view) {
		this.view = view;
	}
	public List<Integer> getIndex() {
		return index;
	}
	public void setIndex(List<Integer> index) {
		this.index = index;
	}
	private List <Integer> view;
	private List <Integer> index;
	private List <String> title;
	private List <String> description;
	public List<String> getDescription() {
		return description;
	}
	public void setDescription(List<String> description) {
		this.description = description;
	}
	public List<String> getDuration() {
		return duration;
	}
	public void setDuration(List<String> duration) {
		this.duration = duration;
	}
	private List <String> duration;
	public List<String> getTitle() {
		return title;
	}
	public void setTitle(List<String> title) {
		this.title = title;
	}
	private String statusResponse;
	public SearchResponse(List <String> idb, List <String> a, List <Integer> v, List <Integer> i,List <String> t, List <String> des, List <String> d,String sr){
		setInDatabase(idb);		
		author = a;
		view = v;
		index = i;
		title = t;
		description = des;
		duration = d;
		setStatusResponse(sr);
		
	}
	public String getStatusResponse() {
		return statusResponse;
	}
	public void setStatusResponse(String statusResponse) {
		this.statusResponse = statusResponse;
	}
	public List <String> getInDatabase() {
		return inDatabase;
	}
	public void setInDatabase(List <String> inDatabase) {
		this.inDatabase = inDatabase;
	}
}