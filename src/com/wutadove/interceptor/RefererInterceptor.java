package com.wutadove.interceptor;

import javax.servlet.http.HttpServletRequest;

import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

public class RefererInterceptor extends HandlerInterceptorAdapter{
	private static final String SESSION_REFERER = "referer";
//	@Override
//    public boolean preHandle(HttpServletRequest request,
//            HttpServletResponse response, Object handler) throws Exception {
//		if (request.getRequestURI() != null) {
//			request.getSession().setAttribute(SESSION_REFERER, request.getRequestURI());
//		}
//        return true;
//    }
	
	public static void setReferer(HttpServletRequest request) {		
		request.getSession().setAttribute(SESSION_REFERER, request.getRequestURI());
	}
	
	public static String getReferer(HttpServletRequest request) {
		return (String)request.getSession().getAttribute(SESSION_REFERER);
	}
	
	public static void releaseReferer(HttpServletRequest request) {
		request.getSession().removeAttribute(SESSION_REFERER);
	}

}
