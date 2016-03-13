package com.wutadove.controller;



import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;


@Controller
public class ErrorController {
	public static final String viewPage = "error";
	
	@RequestMapping(value=viewPage, method=RequestMethod.GET)
    public ModelAndView handleRequest(HttpServletRequest request, HttpServletResponse response){

		return new ModelAndView(viewPage);
		
	}
	
	
}
