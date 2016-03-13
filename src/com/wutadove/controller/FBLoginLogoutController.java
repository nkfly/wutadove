package com.wutadove.controller;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.json.JSONException;
import org.json.JSONObject;
import org.json.JSONTokener;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.view.RedirectView;

import com.mongodb.BasicDBObjectBuilder;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBObject;
import com.mongodb.MongoClient;
import com.mongodb.QueryBuilder;
import com.wutadove.database.MongoClientFactory;
import com.wutadove.database.MongoParameter;
import com.wutadove.interceptor.RefererInterceptor;
import com.wutadove.model.User;
import com.wutadove.util.HTTPClient;

@Controller
public class FBLoginLogoutController {
	private static final String SESSION_USER = "user";
	private static final String SESSION_USER_FB_ID = "userFbId";
	private static final String SESSION_USER_NAME = "userName";
	private static final String TEST_CLIENT_ID = "491270377673854";
	private static final String TEST_CLIENT_SECRET = "97e331719310d7e8f0144a945d7db115";
	private static final String TEST_REDIRECT_URI = "http://localhost:8080/oauth/authorize/facebook/test";
	private static final String PRODUCTION_CLIENT_ID = "396120470510136";
	private static final String PRODUCTION_CLIENT_SECRET = "9392853ceac25931b96dd0b96b52ac1b";
	private static final String PRODUCTION_REDIRECT_URI = "http://www.wutadove.com/oauth/authorize/facebook";
	
	public static ModelAndView loginRedirect(HttpServletRequest request) throws UnsupportedEncodingException {		
		if (request.getRequestURL().toString().contains("localhost")) {
			return new ModelAndView(new RedirectView("https://www.facebook.com/dialog/oauth?client_id="
					+ TEST_CLIENT_ID + "&scope=email&redirect_uri="
					+ URLEncoder.encode(TEST_REDIRECT_URI,"UTF-8")));
		} else {
			return new ModelAndView(new RedirectView("https://www.facebook.com/dialog/oauth?client_id="
					+ PRODUCTION_CLIENT_ID + "&scope=email&redirect_uri="
					+ URLEncoder.encode(PRODUCTION_REDIRECT_URI,"UTF-8")));
		}
		
		
	}
	
	public static void setUserName(HttpServletRequest request,String userName){
		request.getSession().setAttribute(SESSION_USER_NAME, userName);
		
	}
	
	public static String getUserId(HttpServletRequest request){
		return (String)request.getSession().getAttribute(SESSION_USER);
		
	}
	
	private JSONObject getUserInfoFromFacebook(String clientAccessToken) throws JSONException, IOException{
    	String userInfoUrl = "https://graph.facebook.com/me?fields=name,email&access_token=" + clientAccessToken;
    	String reponseFromFacebook = HTTPClient.getHTML(userInfoUrl);
    	return new JSONObject( new JSONTokener(reponseFromFacebook));    	        
    	
    }
    
    private SessionBundle checkAndSetRegistration(DB db, String clientAccessToken, String id, String loginType) throws JSONException, IOException{
    	
    	DBCollection coll = db.getCollection(MongoParameter.USER_COLLECTION);
    	QueryBuilder queryBuilder = QueryBuilder.start(User.USER_ID).is(id).and(User.TYPE).is(loginType);
    	DBObject query = queryBuilder.get();
    	
    	DBObject userObject = coll.findOne(query);
    	if(userObject == null){
    		JSONObject userInfo = getUserInfoFromFacebook(clientAccessToken);
    		String email = userInfo.get(User.EMAIL) == null ? "" : userInfo.get(User.EMAIL).toString(); 
    		String userName = userInfo.get(User.NAME) == null ? "" : userInfo.get(User.NAME).toString();
    		String badge = "548dc50e3ce140a00f31508c";
    		List <String> badges = new ArrayList<String>();
    		badges.add(badge);
    		userObject = BasicDBObjectBuilder.start(User.NAME, userName)
    				.add(User.USER_ID, id)
    				.add(User.TYPE, loginType)
    				.add(User.EMAIL, email)
    				.add(User.BADGE, badge)
    				.add(User.BADGES, badges).get()
    				;
    		coll.insert(userObject);
    	}
    	
    	SessionBundle sessionValue = new SessionBundle();
    	sessionValue.userId = userObject.get(User._ID).toString();
    	sessionValue.userFbId = userObject.get(User.USER_ID).toString();
    	sessionValue.userName = userObject.get(User.NAME).toString();

    	return sessionValue;
    }
    
    @RequestMapping(value="/oauth/authorize/facebook/test", method=RequestMethod.GET)
    public ModelAndView loginTest(HttpServletRequest request, HttpServletResponse response, Model model) throws IOException {
    	return loginMain(TEST_CLIENT_ID,TEST_CLIENT_SECRET,TEST_REDIRECT_URI,request, response, model);
    }
    
    private ModelAndView loginMain(String clientId, String clientSecret, String redirectUri,HttpServletRequest request, HttpServletResponse response, Model model) throws IOException{
    	if(request.getParameter("error") == null){// login or register
			String urlToRead = "https://graph.facebook.com/oauth/access_token?client_id="
					+ clientId + "&redirect_uri="
				+ URLEncoder.encode(redirectUri, "UTF-8")+"&client_secret="
				+clientSecret + "&code="+request.getParameter("code");
			String responseFromFBOauth = HTTPClient.getHTML(urlToRead);
			
			Map <String, List<String>> clientAccessTokenParams = HTTPClient.getUrlParameters(responseFromFBOauth);
			
			String appAccessTokenUrl = "https://graph.facebook.com/oauth/access_token?client_id="
					+ clientId + "&client_secret="
					+ clientSecret + "&grant_type=client_credentials";
			String responseHtml = HTTPClient.getHTML(appAccessTokenUrl);
			
			Map <String, List<String>> appAccessTokenParams = HTTPClient.getUrlParameters(responseHtml);
			if (clientAccessTokenParams.get("access_token") == null) {
				return refererRedirect(request, model);
			}
			String clientAccessToken = clientAccessTokenParams.get("access_token").get(0);

			
			String tokenInspectorUrl = "https://graph.facebook.com/debug_token?input_token="+clientAccessToken
					+"&access_token="+appAccessTokenParams.get("access_token").get(0);
			
			String reponseFromTokenInspector = HTTPClient.getHTML(tokenInspectorUrl);
			JSONObject jsonObj = new JSONObject( new org.json.JSONTokener(reponseFromTokenInspector));
			
			MongoClient mongoClient = MongoClientFactory.create();
	    	DB db = mongoClient.getDB( MongoParameter.DATABASE );
			SessionBundle sessionBundle = checkAndSetRegistration(db, clientAccessToken, jsonObj.getJSONObject("data").get("user_id").toString(), "facebook");
			
//			mongoClient.close();
			int expireSeconds = (Integer)jsonObj.getJSONObject("data").get("expires_at") - (Integer)jsonObj.getJSONObject("data").get("issued_at");
			
			
			HttpSession session = request.getSession();
			session.setAttribute("access_token", clientAccessToken);
			session.setAttribute(SESSION_USER, sessionBundle.userId);
			session.setAttribute(SESSION_USER_FB_ID, sessionBundle.userFbId);
			session.setAttribute(SESSION_USER_NAME, sessionBundle.userName);
			session.setMaxInactiveInterval(expireSeconds);
			
//			Cookie accessTokenCookie = new Cookie("access_token", clientAccessTokenParams.get("access_token").get(0));
//			accessTokenCookie.setMaxAge(expireSeconds); //Store cookie for 1 year
//			response.addCookie(accessTokenCookie);
			
			
		}else {// user deny permission
			System.out.println("user deny permission");
		}
    	return refererRedirect(request, model);
		
    	
    }

	
	@RequestMapping(value="/oauth/authorize/facebook", method=RequestMethod.GET)
    public ModelAndView login(HttpServletRequest request, HttpServletResponse response, Model model) throws IOException{
		return loginMain(PRODUCTION_CLIENT_ID,PRODUCTION_CLIENT_SECRET,PRODUCTION_REDIRECT_URI,request, response, model);
		
	}
	
	private ModelAndView refererRedirect(HttpServletRequest request, Model model) throws UnsupportedEncodingException{
		String referer = request.getHeader("Referer");
		if (RefererInterceptor.getReferer(request) != null) {
			referer = RefererInterceptor.getReferer(request);
			RefererInterceptor.releaseReferer(request);
			
		}
		if(referer != null) {
			int indexOfQuestionMark = referer.indexOf('?');
			RedirectView view = null;
			if (indexOfQuestionMark == -1) {
				view = new RedirectView(referer, false, true, true);
			} else {
				view = new RedirectView(referer.substring(0,indexOfQuestionMark), false, true, true);
				model.addAllAttributes(HTTPClient.getUrlParameters(referer.substring(indexOfQuestionMark+1)));
			}				
			return new ModelAndView(view);
		}
		return new ModelAndView(new RedirectView("/"));
		
	}
	
	@RequestMapping(value="logout", method=RequestMethod.GET)
    public void logout(HttpServletRequest request, HttpServletResponse response) throws IOException{
		request.getSession().invalidate();
//		String previousPage = request.getHeader("Referer");
//		if(previousPage != null)response.sendRedirect(previousPage);
//		else response.sendRedirect("/wutadove"); 
		response.sendRedirect("/");
		
	}

}

class SessionBundle{
	String userId;
	String userFbId;
	String userName;
}
