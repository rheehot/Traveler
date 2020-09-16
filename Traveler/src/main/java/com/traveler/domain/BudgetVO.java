package com.traveler.domain;

import lombok.Data;

@Data
public class BudgetVO {
	private int bno;
	private int planNo;
	private String userId;
	private String title;
	private String cat;
	private int income;
	private int expend;
	private int total;
	private String planDate;
	private String descript;
	private PlannerVO plannerVO;
}