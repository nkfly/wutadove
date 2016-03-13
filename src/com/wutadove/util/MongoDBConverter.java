package com.wutadove.util;

import java.util.ArrayList;

import org.bson.types.ObjectId;

import com.mongodb.BasicDBList;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;
import com.mongodb.QueryBuilder;
import com.wutadove.packet.GrammarItem;

public class MongoDBConverter {
	public static ArrayList<String> basicDBListToArrayList(BasicDBList basicDBList){
		ArrayList <String> arrayList = new ArrayList <String>();
		if (basicDBList != null){
			for(int i = 0;i < basicDBList.size();i++){
				arrayList.add(basicDBList.get(i).toString());
			}
		}
		
		
		return arrayList;
		
	}
	
	public static ObjectId[] getObjectIdArray(ArrayList <String> gids){
		ObjectId [] objectIdArray = new ObjectId[gids.size()];
		for(int i = 0 ;i < objectIdArray.length;i++){
			objectIdArray[i] = new ObjectId(gids.get(i));
		}
		return objectIdArray;
		
	}
	
	public static ArrayList <GrammarItem> queryGrammarFromId(DB db, ArrayList <String> gids){
		ArrayList <GrammarItem> matchingGrammar = new ArrayList <GrammarItem>();
		DBCollection coll = db.getCollection("grammar");
		DBObject query = QueryBuilder.start("_id").in(getObjectIdArray(gids)).get();
		DBCursor cursor = coll.find(query);
		
		
		while(cursor.hasNext()) {
			DBObject entry = cursor.next();
			matchingGrammar.add(new GrammarItem(entry.get("_id").toString(),(String) entry.get("base_form"),
					(String) entry.get("explanation"), 0 ));
 		   
 	   }
		
		return matchingGrammar;
		
	}
	
	public static DBObject getDBObjectFromId(DB db, String collection, String _id){
		DBCollection coll = db.getCollection(collection);
		System.out.println(collection);
		return getDBObjectFromId(coll, _id);
		
	}
	
	public static DBObject getDBObjectFromId(DBCollection coll, String _id){
		System.out.println("beforeddd");
		System.out.println("_id is " + _id);
		DBObject query = QueryBuilder.start("_id").is(new ObjectId(_id)).get();
		System.out.println("ahahaa");
		return coll.findOne(query);
		
	}
	
	
	

}
