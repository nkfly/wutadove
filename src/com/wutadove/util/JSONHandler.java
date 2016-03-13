package com.wutadove.util;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class JSONHandler {
	private JSONObject requestJsonObject;
	public JSONHandler(String json) throws JSONException, IOException{
		requestJsonObject  = new JSONObject( new org.json.JSONTokener(json));
		
	}
	
	public JSONArray getJSONArray(String key) throws JSONException{
		return requestJsonObject.getJSONArray(key);
	}
	
	public String getParam(String key) throws JSONException{
		return requestJsonObject.getString(key);
	}
	
	public ArrayList<String> getStringArrayList(String key) throws JSONException{
		ArrayList<String> stringArrayList = new ArrayList<String>();
		JSONArray jsonArray = requestJsonObject.getJSONArray(key);
		for(int i = 0;jsonArray != null && i < jsonArray.length();i++){
			stringArrayList.add(XSSFilter.stripXSS( jsonArray.getString(i)));
		}
		return stringArrayList;
	}
	
	public static String toJavascriptArray(List<String> videos){
	    StringBuffer sb = new StringBuffer();
	    sb.append("[");
	    for(int i=0; i<videos.size(); i++){
	        sb.append("\"").append(videos.get(i)).append("\"");
	        if(i+1 < videos.size()){
	            sb.append(",");
	        }
	    }
	    sb.append("]");
	    return sb.toString();
	}

}
