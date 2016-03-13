package com.wutadove.interceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import com.wutadove.controller.IndexController;

public class WWWInterceptor extends HandlerInterceptorAdapter{
	@Override
    public boolean preHandle(HttpServletRequest request,
            HttpServletResponse response, Object handler) throws Exception {
		String url = request.getRequestURL().toString();
		if (!url.startsWith("http://localhost") && !url.startsWith("http://www.wutadove.com")){
			response.setStatus(HttpServletResponse.SC_MOVED_PERMANENTLY);
			if (request.getRequestURI().equals("/"+IndexController.viewPage)) {
				response.setHeader("Location", "http://www.wutadove.com");
			} else {
				response.setHeader("Location", "http://www.wutadove.com"+request.getRequestURI());
			}
			return false;
		}
        return true;
    }
	
	

}
