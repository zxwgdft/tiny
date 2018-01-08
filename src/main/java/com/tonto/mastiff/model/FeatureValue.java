package com.tonto.mastiff.model;

import com.tonto.framework.mybatis.core.generate.annotation.DataColumn;
import com.tonto.framework.mybatis.core.generate.annotation.DataReference;
import com.tonto.framework.mybatis.core.generate.annotation.DataTable;
import org.apache.ibatis.type.JdbcType;

@DataTable("feature_value")
public class FeatureValue {

	private Integer id;

	private Integer featureTypeId;

	private String value;

	private Integer status;

	private Integer sort;

	@DataColumn(name = "id", jdbcType = JdbcType.INTEGER, primary = true)
	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	@DataColumn(name = "feature_type_id", jdbcType = JdbcType.INTEGER, unique = true)
	@DataReference(table = "feature_type", column = "id")
	public Integer getFeatureTypeId() {
		return featureTypeId;
	}

	public void setFeatureTypeId(Integer featureTypeId) {
		this.featureTypeId = featureTypeId;
	}

	@DataColumn(name = "value", jdbcType = JdbcType.VARCHAR)
	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}

	@DataColumn(name = "status", jdbcType = JdbcType.TINYINT)
	public Integer getStatus() {
		return status;
	}

	public void setStatus(Integer status) {
		this.status = status;
	}

	@DataColumn(name = "sort", jdbcType = JdbcType.SMALLINT)
	public Integer getSort() {
		return sort;
	}

	public void setSort(Integer sort) {
		this.sort = sort;
	}

}