package com.wutadove.controller;


import java.io.IOException;
import java.sql.SQLException;
import java.util.Collections;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.google.gson.Gson;
import com.mongodb.DB;
import com.mongodb.MongoClient;
import com.wutadove.database.MongoClientFactory;
import com.wutadove.database.MongoParameter;
import com.wutadove.edit.GrammarEvaluator;
import com.wutadove.edit.JapaneseAnnotator;
import com.wutadove.packet.GrammarItem;
import com.wutadove.packet.GrammarResponse;
import com.wutadove.packet.Vocabulary;

/**
 * Servlet implementation class GrammarEvaluator
 */
@Controller
public class GrammarController{
	
	@RequestMapping(value="/grammar", method=RequestMethod.GET)
	public void handleRequest(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException, SQLException, ClassNotFoundException {
		String sentence = java.net.URLDecoder.decode((request.getParameter("sentence")), "UTF-8");
		MongoClient mongoClient = MongoClientFactory.create();
		DB db = mongoClient.getDB(MongoParameter.DATABASE);
		List <GrammarItem> matchingGrammar = GrammarEvaluator.compareGrammar(db,sentence);
		List <Vocabulary> vocabularyList = JapaneseAnnotator.parse(db, sentence);
		
		
		Collections.sort(matchingGrammar);

		GrammarResponse grammarResponse = new GrammarResponse(matchingGrammar, vocabularyList);
		String json = new Gson().toJson(grammarResponse);
		
		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		response.getWriter().write(json);		
	}
		
}