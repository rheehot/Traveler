$(document).ready(function() {
	var sigungu = $("#sigunguCode").val();
	var contentType = $("#contentTypeId").val();
	var reco_markers=[];	//관광지 추천 마크 
	var bmk_positions=[];	//북마크 마커에 들어갈 포지션 데이터 
	var map = initTmap();	// 맵 불러오기 
	var ex_markers=[];		//북마크 , 관광지 추천, 내여행 클릭시 마커 지우기 위한 담아놓는 마커 배열 
	var param = { pageNo : 1, numOfRow : 5 };

	var flag = true;
	//첫데이터 불러오기 
	$.ajax({
		url : "/spot/information",
		type : "get",
		dataType : "json",
		data : param,
		success : function(data){
			reco_markers=setListItems(data,reco_markers,map,param.pageNo);
			ex_markers=reco_markers;
		},
		error : function(error){
			alert("에러")
		}
	});

	//무한 스크롤 
	$('.sidebar-content').scroll(function() {
//		alert($('.sidebar-content').scrollTop());
		// 맨 밑으로 스크롤이 갔을경우 if문을 탑니다.
		console.log($('.sidebar-content').scrollTop() + $('.sidebar-content').height());
		console.log($('.sidebar-content').prop('scrollHeight'));
		if($('.sidebar-content').prop('scrollHeight')==Math.ceil($('.sidebar-content').scrollTop()+$('.sidebar-content').height())) { 
			if(flag){
				param.pageNo++; // 현재 페이지에서 +1 처리.
				reco_markers=callAjaxRecommend(param,reco_markers,map); //ajax 호출
				ex_markers=reco_markers;
			}
		} 
	}); 
	//북마크 버튼 클릭
	$("#bookmark").click(function(){
		flag = false;
		$("#bookmark").attr("disabled",true);
		$("#recommend").attr("disabled",false);
		console.log(ex_markers);
		if(ex_markers != false) deleteMarkers(ex_markers);
		bmk_positions = loadBookmark();
		$("#ul-recommend").hide();
		$("#ul-bookmark").show();
		ex_markers = addMarkers(map,bmk_positions); 
	});
	//관광지 추천 버튼 클릭 
	$("#recommend").click(function(){
		flag = true;
		$("#bookmark").attr("disabled",false);
		$("#recommend").attr("disabled",true);
		console.log(ex_markers);
		if(ex_markers != false) deleteMarkers(ex_markers);
		$(".book-ul").remove();
		$("#ul-recommend").show();
		$("#ul-bookmark").hide();
		ex_markers = reco_markers;
		for(var i=0;i<reco_markers.length;i++){
			reco_markers[i].setMap(map);
		}
	});
	$("#myplan").click(function(){
		if(ex_markers != false) deleteMarkers(ex_markers);
	});

});
function test(marker){
	marker.setVisible(true);
}
function callAjaxRecommend(param,reco_markers,map) {
	$.ajax({	
		url : "/spot/information",
		type : "get",
		dataType : "json",
		data : param,
		success : function(data){
			if(data.length == 0 ){
				alert("더이상 표시할 항목이 없습니다.");
			} 
			if(data.length != 0){
				//testLoading.show(); //로딩 on(로딩바가 있을경우만 넣습니다. 없을경우 빼셔도 상관 없습니다.)
				reco_markers=setListItems(data,reco_markers,map,param.pageNo);  //테스트 데이터 리스트 입니다.
				//testLoading.hide(); //로딩 off(로딩바가 있을경우만 넣습니다. 없을경우 빼셔도 상관 없습니다.)
			}   
		},
		error : function(error) {
			alert("실패");
		}
	});
	return reco_markers;
}
//무한 스크롤 데이터 추가 및 클릭이벤트 
function setListItems(data,markers,map,pageNo){
	var positions=[];
	$.each(data, function(i, result) {
		var position = {title : result.title, lonlat : new Tmapv2.LatLng(result.mapX, result.mapY), addr : result.addr1 , overview : result.overview, img :  result.firstImage2, contentId : result.contentId, contentTypeId : result.contentTypeId };
		// 부모 엘리먼트에 append 할 데이터를 셋팅한다.

		var content='<li><hr><div class="row spot_info'+pageNo+'">'
		+'<div class="col-lg-5"><img class="img-responsive" class="r_photo"'
		+'style="cursor: pointer;" src="'+result.firstImage2+'" alt="" width="150" height="100">'
		+'</div><div class="col-lg-7">'
		+'<h5 class="r_title">'+result.title+'</h5>'
		+'<h6 class="r_addr">+'+result.addr1+'</h6>'
		+'</div></div></li>';

		positions.push(position);
		$('#imgForm').append(content);
	});
	// 페이지 별 영역별로 클릭이벤트 주기위함
	$('.spot_info'+pageNo).each(function(i){
		var lonlat = positions[i].lonlat;
		var title = positions[i].title;	
		if(positions[i].addr== null) positions[i].addr="주소 없음";
		var marker = new Tmapv2.Marker({
			position : lonlat,
			map : map,
			visible : false,
			title : title
		});			
		markerClick(map,marker,lonlat,title,positions[i]);
		$(this).click(function(){
			for(var i=0;i<markers.length;i++){
				markers[i].setVisible(false);	//이미지 클릭 시클릭한 데이터만 마커 표시 
			}
			map.setMap
			marker.setVisible(true);
		});
		markers.push(marker);
	});
	
	return markers;
}

//북마크 마커 추가 
function addMarkers(map,positions){

	var markers = [];
	for (var i = 0; i< positions.length; i++){//for문을 통하여 배열 안에 있는 값을 마커 생성
		var lonlat = positions[i].lonlat;
		var title = positions[i].title;

		if(positions[i].addr == null) {
			positions[i].addr="주소 없음";
		}

		//Marker 객체 생성.
		var marker = new Tmapv2.Marker({
			position : lonlat, //Marker의 중심좌표 설정.
			map : map, //Marker가 표시될 Map 설정.
			title : title //Marker 타이틀.
		});
		markerClick(map,marker,lonlat,title,positions[i]);
		markers.push(marker);
	}
	return markers;
}

function deleteMarkers(markers){
	for (var i=0;i<markers.length; i++) {
		markers[i].setMap(null);
	}
}
function markerLeave(map){
	map.addListener("click",function(evt){
		infoWindow.setVisible(false);
		$(".cid").remove();
		$(".ctid").remove();
	});
}

function markerClick(map,marker,latlng,title,position){
	marker.addListener("click",function(evt){
		var content= "<div style='position: static; display: flex; flex-direction: column; font-size: 14px; box-shadow: 5px 5px 5px #00000040; border-radius: 10px; top: 410px; left : 800px; width : 250px; background: #FFFFFF 0% 0% no-repeat padding-box;'>"+
		"<div class='img-box' style='position: relative; width: 100%; height: 150px; border-radius: 10px 10px 0 0 ;no-repeat center;'>"+
		"<img src='"+position.img+"' style='width:100%; height:150px;'>"+
		"</div>"+
		"<div class='info-box' style='padding: 10px;'>"+
		"<p style='margin-bottom: 7px; overflow: hidden;'>"+
		"<span class='title' style=' font-size: 16px; font-weight: bold;'>"+title+"</span>"+
		"<a href='http://tmapapi.sktelecom.com/' target='_blank' class='link' style='color: #3D6DCC; font-size: 13px; float: right;'>홈페이지</a>"+
		"</p>"+
		"<ul class='ul-info' style='list-style-type:none; padding:0px;'>"+
		"<li class='li-addr' style='padding-left: 20px; margin-bottom: 5px; no-repeat top 3px left;'>"+
		"<p class='new-addr'><i class='fas fa-map-marker-alt' style='padding-right:3%'></i>"+position.addr+"</p>"+
		/*		"<p class='old-addr' style='color: #707070;'>(우)04539 (지번)을지로 2가 11</p>"+*/
		"</li>"+
		"<li class='li-overview' style='padding-left: 20px; no-repeat top 4px left;'>"+
		"<p class='overview' style='overflow: hidden;text-overflow: ellipsis;display: -webkit-box;-webkit-line-clamp: 4; -webkit-box-orient: vertical;'>"+
		"<i class='far fa-sticky-note' style='padding-right:3%'></i>"+position.overview+"</p>"+
		"</li>"+
		"</ul>"+
		"<ul class='btn-group' style='display: table; width: 100%; padding:0; border-radius: 3px; height: 30px; border: 1px solid #EFEFEF; margin-top: 10px; text-align: center;'>"+
		"<li style='display: table-cell; vertical-align: middle; width: 50%; height: 100%; border-right: 1px solid #EFEFEF;' onclick='detailModal("+position.contentId+","+position.contentTypeId+");'>"+
		"<a href='javascript:void(0)' title='더 보기'><i class='fas fa-1x fa-info-circle'></i></a>"+
		"</li>"+
		"<li style='display: table-cell; vertical-align: middle; width: 50%; height: 100%; border-right: 1px solid #EFEFEF;''>"+
		"<a href='#' title='공유하기'><i class='fas fa-1x fa-plus-circle'></i></a>"+
		"</li>"+
		/*	"<li style='display: table-cell; vertical-align: middle; width: 33.333%; height: 100%;'>"+
		"<a href='#' title='길찾기'><img src='resources/images/sample/ico-road.svg'></a>"+
		"</li>"+*/
		"</ul>"+
		"</div>"+
		"<a href='javascript:void(0)' onclick='onClose()' class='btn-close' style='position: absolute; top: 10px; right: 10px; display: block; width: 15px; height: 15px; no-repeat center;'><i class='fas fa-times'></i></a>"+
		"</div>";
		infoWindow = new Tmapv2.InfoWindow({
			position: latlng, //Popup 이 표출될 맵 좌표
			content: content, //Popup 표시될 text
			border :'0px solid #FF0000', //Popup의 테두리 border 설정.
			type: 2, //Popup의 type 설정.
			map: map //Popup이 표시될 맵 객체
		});
	});
}
function detailModal(contentId,contentTypeId){
	$("#modalForm").append("<input id='modal-cid' class='cid' type='hidden' name='contentId' value="+contentId+">");
	$("#modalForm").append("<input id='modal-ctId' class='ctid' type='hidden' name='contentTypeId' value="+contentTypeId+">");
	document.modalForm.target = "guide";
	document.modalForm.submit();
	$("#modal-Guide").modal();
}

//닫기 아이콘 클릭시 호출되는 함수.
function onClose(popup){
	$(".cid").remove();
	$(".ctid").remove();
	infoWindow.setVisible(false);
}
function initTmap() {
	var map = new Tmapv2.Map("map_div", {
		center : new Tmapv2.LatLng(33.38260485180545, 126.57321166992229), // 지도 초기 좌표
		width : "100%",
		height : "925px",
//		zoomControl : false,
		zoom : 11,
		zIndexInfoWindow : 999
	});
	markerLeave(map);
	return map;
}

function loadBookmark(){
	var positions=[];
	$.ajax({
		url : "/plan/bookmark",
		type : "get",
		dataType : "json",
		async : false,
		data : { "userId" : $("#userId").val() },
		success : function(data) {
			$.each(data, function(key, val){
				$("#ul-bookmark").append('<li class="book-ul"><hr><div class="row spot_info">'+
						'<div class="col-lg-5"><img class="img-responsive" id="b_photo'+key+'" onclick=""style="cursor: pointer;" src="" alt="" width="150" height="100"></div>'+
						'<div class="col-lg-7">'+
						'<h5 id="b_title'+key+'"></h5>'+
						'<h6 id="b_addr'+key+'"></h6></div></div></li>');

				$("#b_photo"+key).attr("src",data[key].img_src);
				$("#b_title"+key).text(data[key].title);
				$("#title-Guide").text(data[key].title);

				$("#b_addr"+key).text(data[key].addr);

				positions.push({title : data[key].title, lonlat : new Tmapv2.LatLng(data[key].mapX, data[key].mapY),addr : data[key].addr , overview : data[key].overview, img :  data[key].img_src, contentId : data[key].contentId, contentTypeId : data[key].contentTypeId });
				$(".totalCount").text(data[key].totalCount);
			});				
		},
		error : function(error) {
			alert("첫페이지 에러");
		}
	});
	return positions;
}