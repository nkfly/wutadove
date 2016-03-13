package com.wutadove.util;

import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBObject;
import com.mongodb.MongoClient;
import com.wutadove.database.MongoClientFactory;
import com.wutadove.database.MongoParameter;

import java.net.UnknownHostException;
import java.util.ArrayList;

import org.bson.types.ObjectId;

public class Lyric {
	private static final String DB_GRAMMAR = "grammar";
	
	public String japanese;
	public String chinese;
	public ArrayList<String> japaneseVocabulary;
	public ArrayList<String> chineseVocabulary;
	public ArrayList<Grammar> grammars = new ArrayList<Grammar>();
	public double startTime;
	public double endTime;
	
	private class PronunciationPosition {
		public int vocabularyIndex;
		public int startIndex;
		public int endIndex;
		
		public PronunciationPosition(int vocabularyIndex, int startIndex, int endIndex) {
			this.vocabularyIndex = vocabularyIndex;
			this.startIndex = startIndex;
			this.endIndex = endIndex;
		}
	}
	
	public class Grammar {
        public String baseForm;
		public String explanation;
		
		public Grammar(DBObject grammar) {
			this.baseForm = (String)grammar.get("base_form");
			this.explanation = (String)grammar.get("explanation");
		}
	}
	
	@SuppressWarnings("unchecked")
	public Lyric(DBObject entry) throws UnknownHostException {
		japanese = entry.get("japaneseSentence").toString();
		chinese = entry.get("chineseSentence").toString();
		japaneseVocabulary = (ArrayList<String>)entry.get("japaneseVocab");
		chineseVocabulary = (ArrayList<String>)entry.get("chineseVocab");
		startTime = timeStringToNumber(entry.get("startTime").toString());
		endTime = timeStringToNumber(entry.get("endTime").toString());
		ArrayList<String> positionStrings = (ArrayList<String>)entry.get("position");
		ArrayList<String> pronunciations = (ArrayList<String>)entry.get("reading");
		ArrayList<String> grammarIds = (ArrayList<String>)entry.get("checked");
		
		/* get grammars */
		MongoClient mongoClient = MongoClientFactory.create();
		DB db = mongoClient.getDB(MongoParameter.DATABASE);
		DBCollection grammarCollection = db.getCollection(DB_GRAMMAR);
		for(String grammarId : grammarIds) {
			DBObject grammar = grammarCollection.findOne(new BasicDBObject("_id", new ObjectId(grammarId)));
			grammars.add(new Grammar(grammar));
		}
		
		/* add ruby structure */
		ArrayList<PronunciationPosition> positions = new ArrayList<PronunciationPosition>();
		
		/* TODO change data storage for easier operation */
		if(positionStrings != null) {
			for(int i = 0; i < positionStrings.size(); i++) {
				String positionString = positionStrings.get(i);
				String[] positionStringArray = positionString.split("-");
				PronunciationPosition position = new PronunciationPosition(Integer.parseInt(positionStringArray[0])/*vocabularyIndex*/,
																		   Integer.parseInt(positionStringArray[1])/*startIndex*/,
																		   Integer.parseInt(positionStringArray[2])/*endIndex*/);
				positions.add(position);
			}
		}
		
		int positionIndex = 0;
		for(int i = 0; i < japaneseVocabulary.size(); i++) {
			if(japaneseVocabulary.get(i).equals("は")) {
				String ruby = "<div class=\"ruby\">"
						+ "<span class=\"addHiragana wa\">"+japaneseVocabulary.get(i)+"</span>"
						+ "</div>";
				japaneseVocabulary.set(i, ruby);
				
				continue;
			}
			

			ArrayList<String> taggedVocabulary = new ArrayList<String>();
			int j = 0;
			char[] vocabulary = japaneseVocabulary.get(i).toCharArray();
			while(j < vocabulary.length) {
				while(positionIndex < positions.size() &&
				      pronunciations.get(positionIndex).equals("") /* this should be checked at edit time */) {
					positionIndex++;
				}
				
				if(positionIndex < positions.size() &&
				   i == positions.get(positionIndex).vocabularyIndex &&
				   j == positions.get(positionIndex).startIndex) {
					int startIndex = positions.get(positionIndex).startIndex;
					int endIndex = positions.get(positionIndex).endIndex;
					
					String ruby = "<div class=\"ruby\">"
							+ "<span class=\"hiragana\">"+pronunciations.get(positionIndex)+"</span>"
							+ "<br>"
							+ "<span>"+String.valueOf(vocabulary, startIndex, endIndex - startIndex)+"</span>"
							+ "</div>";
					taggedVocabulary.add(ruby);
					
					positionIndex++;
					j = endIndex;
				}
				else if(j != vocabulary.length - 1 && isYouon(vocabulary[j+1])) {
					String ruby = "<div class=\"ruby\">"
							+ "<span class=\"addHiragana\">"+String.valueOf(vocabulary, j, 2)+"</span>"
							+ "</div>";
					taggedVocabulary.add(ruby);
					
					j += 2;
				}
				else {
					String ruby = "<div class=\"ruby\">"
							+ "<span class=\"addHiragana\">"+String.valueOf(vocabulary[j])+"</span>"
							+ "</div>";
					taggedVocabulary.add(ruby);
					
					j++;
				}
			}
			
			StringBuilder builder = new StringBuilder();
			for(String s : taggedVocabulary) {
				builder.append(s);
			}
			
			japaneseVocabulary.set(i, builder.toString());
		}
	}
	
	private boolean isYouon(char c) {
		final String smallLetters = "ぁぃぅぇぉゃゅょァィゥェォャュョ";
		if(smallLetters.indexOf(c) == -1) {
			return false;
		}
		else {
			return true;
		}
	}
	
	private double timeStringToNumber(String time) {
		String [] timeAry = time.split(":");
		double result = Double.parseDouble(timeAry[0])*3600;
		result += Double.parseDouble(timeAry[1])*60;
		result += Double.parseDouble(timeAry[2].replace(',', '.'));
		
		return result;
	}
	
	public String toString() {
		return "{japanese:\"" + japanese + "\", chinese:\"" + chinese + "\", startTime:" + startTime + ", endTime:" + endTime + "}";
	}
}
