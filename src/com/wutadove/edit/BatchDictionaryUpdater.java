package com.wutadove.edit;

import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Queue;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentLinkedQueue;

import org.bson.types.ObjectId;

import com.mongodb.BasicDBObjectBuilder;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;
import com.mongodb.MongoClient;
import com.mongodb.QueryBuilder;
import com.wutadove.database.MongoClientFactory;
import com.wutadove.database.MongoParameter;
import com.wutadove.model.Dictionary;

public class BatchDictionaryUpdater {
	public static final String DELIMITER = "\t"; 
	private static Map <String, Queue <String>> keywordToTranslations = new ConcurrentHashMap <String, Queue <String>>();
	public static void update(List <String> japaneseVocab, List <String> chineseVocab, List <String> readings){	
		for (int i = 0;i < japaneseVocab.size();i++) {
			String translationAndReading = chineseVocab.get(i) + DELIMITER + readings.get(i);
			Queue <String> translations = keywordToTranslations.get(japaneseVocab.get(i));
			if( translations == null) {
				translations = new ConcurrentLinkedQueue<String>();
				keywordToTranslations.put(japaneseVocab.get(i), translations);
			}
			translations.add(translationAndReading);
		}
		overflowCheck();
	}
	
	private static void overflowCheck(){
		if (keywordToTranslations.size() > 32) {
			MongoDictionaryUpdater mongoDictionaryUpdater = new MongoDictionaryUpdater(keywordToTranslations);
			keywordToTranslations = new ConcurrentHashMap <String, Queue <String>>();
			Thread thread = new Thread(mongoDictionaryUpdater);
			thread.start();
		}	
	}
}

class MongoDictionaryUpdater implements Runnable{

	@Override
	public void run() {
		try {
			MongoClient mongoClient = MongoClientFactory.create();
			DB db = mongoClient.getDB(MongoParameter.DATABASE);
			DBCollection coll = db.getCollection(MongoParameter.DICTIONARY_COLLECTION);
			DBObject query = QueryBuilder.start(Dictionary.KEYWORD).in(keywordToTranslations.keySet()).get();
			DBCursor cursor = coll.find(query);
			DBObject entry = null;
			Set <String> newKeywordSet = new HashSet<String>(keywordToTranslations.keySet());
			while(cursor.hasNext()){
				entry = cursor.next();
				String keyword = (String)entry.get(Dictionary.KEYWORD);
				newKeywordSet.remove(keyword);
				
				Queue <String> translations = keywordToTranslations.get(keyword);
				if (translations == null)continue;
				
				List <TranslationAndFrequency> newList = new ArrayList <TranslationAndFrequency>();
				List <String> existTranslations = (List<String>)entry.get(Dictionary.TRANSLATIONS);
				List <Integer> existFrequencys = (List<Integer>)entry.get(Dictionary.FREQUENCYS);
				for (int i = 0;i < existTranslations.size();i++){
					newList.add(new TranslationAndFrequency(existTranslations.get(i), existFrequencys.get(i)));
				}
				
				outerloop:
				for (String translation : translations){
					if (translation.startsWith(BatchDictionaryUpdater.DELIMITER))continue;
					for (TranslationAndFrequency tf : newList){
						if (translation.startsWith(tf.translation)){
							tf.frequency = tf.frequency + 1;
							continue outerloop;
						}
					}
					newList.add(new TranslationAndFrequency(translation.split(BatchDictionaryUpdater.DELIMITER)[0], 1));
				}
				
				Collections.sort(newList);
				
				for (int i = 0;i < newList.size();i++){
					if (i >= existTranslations.size()){
						existTranslations.add(newList.get(i).translation);
						existFrequencys.add(newList.get(i).frequency);
					}else {
						existTranslations.set(i, newList.get(i).translation);
						existFrequencys.set(i,newList.get(i).frequency);
					}
				}
				
				DBObject updateQuery = QueryBuilder.start(Dictionary._ID).is((ObjectId)entry.get(Dictionary._ID)).get();
				entry.put(Dictionary.TRANSLATIONS, existTranslations);
				entry.put(Dictionary.FREQUENCYS, existFrequencys);
				coll.update(updateQuery, entry);
			}
			
			for (String newKeyword : newKeywordSet){
				Queue <String> translations = keywordToTranslations.get(newKeyword);
				if (translations == null)continue;
				List <TranslationAndFrequency> newList = new ArrayList <TranslationAndFrequency>();
				String reading = "";
				oloop:
				for (String translation : translations){
					if (translation.startsWith(BatchDictionaryUpdater.DELIMITER))continue;
					 
					String [] translationAndReading = translation.split(BatchDictionaryUpdater.DELIMITER);
					reading = translationAndReading[1];//just pick one
					for (TranslationAndFrequency tf : newList){
						if (tf.translation.equals(translationAndReading[0])){
							tf.frequency = tf.frequency + 1;
							continue oloop;
						}
					}
					newList.add(new TranslationAndFrequency(translationAndReading[0], 1));
					
				}
				Collections.sort(newList);
				List <String> newTranslations = new ArrayList<String>();
				List <Integer> newFrequencys = new ArrayList<Integer>();
				
				for (int i = 0;i < newList.size();i++){
					newTranslations.add(newList.get(i).translation);
					newFrequencys.add(newList.get(i).frequency);
				}
				DBObject insert = BasicDBObjectBuilder.start(Dictionary.KEYWORD, newKeyword)
						.add(Dictionary.READING, reading).add(Dictionary.TRANSLATIONS, newTranslations)
						.add(Dictionary.FREQUENCYS, newFrequencys).get();
				coll.insert(insert);
				
			}
			keywordToTranslations = null;
		} catch (UnknownHostException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		// TODO Auto-generated method stub
		
	}
	private Map <String, Queue <String>> keywordToTranslations;
	public MongoDictionaryUpdater(Map <String, Queue <String>> keywordToTranslations){
		this.keywordToTranslations = keywordToTranslations;
		
	}
	
}

class TranslationAndFrequency implements Comparable<TranslationAndFrequency>{
	public String translation;
	public Integer frequency;
	public TranslationAndFrequency(String t, Integer f){
		translation = t;
		frequency = f;
	}
	@Override
	public int compareTo(TranslationAndFrequency arg0) {
		if (this.frequency > arg0.frequency)return -1;
		else if (this.frequency < arg0.frequency)return 1;
		
		return this.translation.compareTo(arg0.translation);
	}
	
}
