package com.wutadove.database;

import java.net.UnknownHostException;

import com.mongodb.MongoClient;

public class MongoClientFactory {
	static {
		try {
			mongoClient = new MongoClient("localhost", 27017);
		}catch (UnknownHostException e){
			e.printStackTrace();
		}
	}
	private static MongoClient mongoClient; 
	public static MongoClient create() throws UnknownHostException {
		return mongoClient;
	}

}
