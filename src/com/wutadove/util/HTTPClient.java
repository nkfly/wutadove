package com.wutadove.util;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


public class HTTPClient {
	public static String getHTML(String urlToRead) throws IOException{
	      URL url;
	      HttpURLConnection conn;
	      BufferedReader rd;
	      String line;
	      String result = "";
	      again:
	      try {
	         url = new URL(urlToRead);
	         conn = (HttpURLConnection) url.openConnection();
	         conn.setRequestMethod("GET");
	         rd = new BufferedReader(new InputStreamReader(conn.getInputStream()));
	         while ((line = rd.readLine()) != null) {
	            result += line;
	         }
	         rd.close();
	      } catch (IOException e) {
	         e.printStackTrace();
	         break again;
	      } catch (Exception e) {
	         e.printStackTrace();
	      }
	      return result;
	   }
	public static Map<String, List<String>> getUrlParameters(String query)
	        throws UnsupportedEncodingException {
	    Map<String, List<String>> params = new HashMap<String, List<String>>();
        for (String param : query.split("&")) {
            String pair[] = param.split("=");
            String key = URLDecoder.decode(pair[0], "UTF-8");
            String value = "";
            if (pair.length > 1) {
                value = URLDecoder.decode(pair[1], "UTF-8");
            }
            List<String> values = params.get(key);
            if (values == null) {
                values = new ArrayList<String>();
            }
            values.add(value);
            params.put(key, values);
        }
	   
	    return params;
	}
	
	public static String getRelativeUrl(String refererUrl){
		return refererUrl.substring("http://www.wutadove.com".length());
		
	}
	
	public static String convertWebContainerString(String input) throws UnsupportedEncodingException{
		if (input != null)return new String(input.getBytes("ISO-8859-1"), "UTF-8");
		return "";
		
	}

}
