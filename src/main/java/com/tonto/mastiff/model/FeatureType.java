package com.tonto.mastiff.model;

import com.tonto.framework.mybatis.core.generate.annotation.DataColumn;
import com.tonto.framework.mybatis.core.generate.annotation.DataReference;
import com.tonto.framework.mybatis.core.generate.annotation.DataTable;
import org.apache.ibatis.type.JdbcType;

@DataTable("feature_type")
public class FeatureType {

	private Integer id;

	private String name;

	private Integer parentId;

	private Integer status;

	private Integer sort;

	@DataColumn(name = "id", jdbcType = JdbcType.INTEGER, primary = true)
	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	@DataColumn(name = "name", jdbcType = JdbcType.VARCHAR)
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@DataColumn(name = "parent_id", jdbcType = JdbcType.INTEGER, unique = true)
	@DataReference(table = "feature_type", column = "id")
	public Integer getParentId() {
		return parentId;
	}

	public void setParentId(Integer parentId) {
		this.parentId = parentId;
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