<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Insert title here</title>
<link href="/resources/budget/css/recommend.css" rel="stylesheet">
<link rel="stylesheet"
	href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css">
<%@ include file="../includes/sidebar_setting.jsp"%>
<script src="/resources/budget/js/recommend.js"></script>
<script src="https://cdn.jsdelivr.net/npm/flatpickr"></script>
<script type="text/javascript"
	src="https://www.gstatic.com/charts/loader.js"></script>
</head>
<body>
	<%@ include file="../includes/sidebar.jsp"%>
	<main class="page-content">
		<section class="notice">
			<div class="page-title">
				<div class="container">
					<%-- <c:if test="${countUserPlan eq 0 }">
						<a href="/plan/plan"><h6 style="text-align: center;">
								생성할 예산이 존재하지 않습니다.<br> 새로운 계획 만들러 가기!
							</h6></a>
						<h3 id="index-title" style="margin-top: 5%;">다른 회원들의 예산</h3>
					</c:if>
					<c:if test="${countUserPlan ne 0 }">
						<h3>다른 회원들의 예산</h3>
					</c:if> --%>

					<h3 id="index-title" style="margin-top: 5%;">다른 x일간의 여행 예산</h3>
				</div>
			</div>

			<!-- board seach area -->
			<div id="recommend-list">
				<div class="container">
					<div class="search-window">
						<table class="board-table">
							<thead>
								<tr>
									<th scope="col" class="th-rec">추천 구분</th>
									<th scope="col" class="th-num">번호</th>
									<th scope="col" class="th-title">작성자</th>
									<th scope="col" class="th-uid">여행 제목</th>
									<th scope="col" class="th-day">여행 일수</th>
									<th scope="col" class="th-total">총액</th>
									<th scope="col" class="th-regdate">등록일자</th>
								</tr>
							</thead>
							<tbody>
								<c:if test="${maxPlan ne null }">
									<tr>
										<td class="recommend-standard">총계 최대</td>
										<td class="recommend-planno"><c:out
												value="${maxPlan.planNo }"></c:out></td>
										<td class="recommend-userid"><c:out
												value="${maxPlan.userId }"></c:out></td>
										<th class="recommend-plantitle"><a href="#!"><c:out
													value="${maxPlan.planTitle }"></c:out></a></th>
										<td class="recommend-totaldate"><c:out
												value="${planTotalDate}일간 여행"></c:out></td> 
										<td class="recommend-total"><c:out
												value="${maxBudget.total}"></c:out></td> 
										<td class="recommend-regdate"><c:out
												value="${maxBudget.reg_date}"></c:out></td> 
									</tr>
								</c:if>
								<c:if test="${minPlan ne null }">
									<tr>
										<td class="recommend-standard">총계 최소</td>
										<td class="recommend-planno"><c:out
												value="${minPlan.planNo }"></c:out></td>
										<td class="recommend-userid"><c:out
												value="${minPlan.userId }"></c:out></td>
										<th class="recommend-plantitle"><a href="#!"><c:out
													value="${minPlan.planTitle }"></c:out></a></th>
										<td class="recommend-totaldate"><c:out
												value="${planTotalDate}일간 여행"></c:out></td>
										<td class="recommend-total"><c:out
												value="${minBudget.total}"></c:out></td> 
										<td class="recommend-regdate"><c:out
												value="${minBudget.reg_date}"></c:out></td>
									</tr>
								</c:if>
								<c:if test="${maxPlan eq null }">
									<tr>
										<td colspan="5" class="none">아직 생성된 예산이 없습니다.</td>
									</tr>
								</c:if>
							</tbody>
						</table>
					</div>
				</div>
			</div>

			<!-- board list area -->
			<div id="board-list">
				<div class="container">
					<table class="board-table">
						<thead>
							<tr>
								<th scope="col" class="th-num">번호</th>
								<th scope="col" class="th-title">작성자</th>
								<th scope="col" class="th-uid">여행 제목</th>
								<th scope="col" class="th-day">여행 일수</th>
							</tr>
						</thead>
						<c:if test="${allPlan eq null }">
							<tr>
								<td colspan="4" class="none">아직 생성된 예산이 없습니다.</td>
							</tr>
						</c:if>
						<c:if test="${allPlan ne null }">
							<tbody>
								<c:forEach items="${allPlan}" var="list" varStatus="status">
									<tr>
										<td class="planno"><c:out value="${list.planNo }"></c:out></td>
										<td class="userid"><c:out value="${list.userId }"></c:out></td>
										<th class="plan-title"><a href="#!"><c:out
													value="${list.planTitle }"></c:out></a></th>
										<td class="planTotalDay"><c:out
												value="${planTotalDate}일간 여행"></c:out></td>
									</tr>
								</c:forEach>
							</tbody>
						</c:if>
					</table>
					<button type="button" class="btn btn-dark" id="btn-mybudget"
						style="float: right; margin-top: 2%;" onclick="history.go(-1)">돌아가기</button>
					<button type="button" class="btn btn-dark" id="btn-graph"
						style="float: right; margin-top: 2%; margin-right: 2%;" value="${ planTotalDate}">
						<c:out value="${planTotalDate }일간 예산 그래프"></c:out>
					</button>
				</div>
			</div>
			<div id="budget-stastic" style="display: none;">
				<div class="container ">

					<div class="row">
						<div id="budget-chart" style="width: 50%; height: 500px;"
							class="ml-auto"></div>
						<div id="cat-chart" style="width: 50%; height: 500px;"></div>
					</div>
					<button type="button" id="btn-back-budget" class="btn btn-dark"
						style="float: right;">돌아가기</button>
					
				</div>
			</div>
		</section>
	</main>
</body>
</html>