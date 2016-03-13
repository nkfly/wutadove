package com.wutadove.edit;

import java.util.ArrayList;
import java.util.List;

import org.atilika.kuromoji.Token;
import org.atilika.kuromoji.Tokenizer;
import org.atilika.kuromoji.Tokenizer.Mode;

import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBObject;
import com.mongodb.QueryBuilder;
import com.wutadove.database.MongoParameter;
import com.wutadove.model.Dictionary;
import com.wutadove.packet.ReadingAndTranslations;
import com.wutadove.packet.Vocabulary;

public class JapaneseAnnotator {
	public static List <Vocabulary> parse(DB db,String text) {
		
		DBCollection coll = db.getCollection(MongoParameter.DICTIONARY_COLLECTION);
		Tokenizer tokenizer = Tokenizer.builder().mode(Mode.SEARCH).build();
		List<Token> result = tokenizer.tokenize(text);
		
		List <Vocabulary> vocabularyList = new ArrayList<Vocabulary>();
		for (Token token : result) {
			ReadingAndTranslations readingAndTranslations = lookupForTranslation(coll, token.getBaseForm());
			//String reading = token.getSurfaceForm().equals(token.getReading()) ? token.getReading() : JapaneseCharacter.toHiragana(token.getReading());
			String reading = token.getReading() == null ? readingAndTranslations.reading : token.getReading().equals("?") ? readingAndTranslations.reading : token.getReading();
			vocabularyList.add(new Vocabulary(token.getSurfaceForm(), reading, readingAndTranslations.translations));
		}
		
		
		return vocabularyList;
	}
	
	public static ReadingAndTranslations lookupForTranslation(DBCollection coll, String keyword){
		DBObject query = QueryBuilder.start(Dictionary.KEYWORD).is(keyword).get();
		DBObject match = coll.findOne(query);		
		
		ReadingAndTranslations readingAndTranslations = new ReadingAndTranslations();
		if (match != null) {
			readingAndTranslations.translations = (List <String>)match.get( Dictionary.TRANSLATIONS);
			readingAndTranslations.reading = (String)match.get(Dictionary.READING);
			return readingAndTranslations;
		} else {
			readingAndTranslations.translations = new ArrayList <String>();
			readingAndTranslations.reading = "";
			return readingAndTranslations;
		}		
	}

}

