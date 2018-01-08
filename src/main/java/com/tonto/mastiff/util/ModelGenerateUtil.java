package com.tonto.mastiff.util;

import com.tonto.data.database.DataBaseConfig;
import com.tonto.data.database.DataBaseType;
import com.tonto.framework.mybatis.generate.BaseGenerateUtil;

public class ModelGenerateUtil {

	static String name = "ORANGE";
	static String url = "jdbc:mysql://localhost:3306/mastiff";
	static String username = "root";
	static String password = "";
	static DataBaseType type = DataBaseType.MYSQL;

	public static void main(String[] args) {

		DataBaseConfig config = new DataBaseConfig();

		config.setName(name);
		config.setUrl(url);
		config.setUsername(username);
		config.setPassword(password);
		config.setType(type);

		String path = "D://";//System.getProperty("user.dir") + "\\src\\main\\java";
		String packageName = "com.tonto.mastiff.model";
		BaseGenerateUtil.generateMode(config, DataBaseType.MYSQL, path, packageName);

	}

}
