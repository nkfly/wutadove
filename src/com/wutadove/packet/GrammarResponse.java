package com.wutadove.packet;

import java.util.List;

public class GrammarResponse {
	List <GrammarItem> grammar;
	List <Vocabulary> vocabulary;
	
	public GrammarResponse(List <GrammarItem> matchingGrammar, List <Vocabulary> vocabularyList){
		grammar = matchingGrammar;
		vocabulary = vocabularyList;
	}

}
