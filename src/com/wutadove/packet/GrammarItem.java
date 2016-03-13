package com.wutadove.packet;

public class GrammarItem implements Comparable<GrammarItem>{
	private String id;
	private String baseForm;
	private String explanation;
	private int patternCount;
	public GrammarItem(String id, String bs, String exp, int pc){
		this.id = id;
		baseForm = bs;
		explanation = exp;
		patternCount = pc;
		
	}
	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}	
	public String getBaseForm(){
		return baseForm;
	}
	public String getExplanation(){
		return explanation;
	}

	@Override
	public int compareTo(GrammarItem g) {
		// TODO Auto-generated method stub
		if(this.patternCount > g.patternCount)return -1;
		else if(this.patternCount < g.patternCount)return 1;
		return 0;
	}
	
}
