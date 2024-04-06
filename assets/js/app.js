
$(document).ready(function() {
	var networkState = navigator.connection.type;
	if (networkState == "none"){
		window.location = "pages/noconnection.html";
		return false;
	}
	
	setTimeout(() => {
		$('.loading').fadeToggle(200);
	}, 500);
	$.getScript("https://www.itemsatis.com/data/app/js/ItemSatis.js?ver=" + Math.random(), function(data, textStatus, jqxhr){
		app.initialize();
	});
	$('<link/>', {
		rel: 'stylesheet',
		type: 'text/css',
		href: 'https://www.itemsatis.com/data/app/css/ItemSatis.css?v=' + Math.random()
	 }).appendTo('head');
	 $('<link/>', {
		rel: 'stylesheet',
		type: 'text/css',
		href: 'https://www.itemsatis.com/data/app/css/Chat.css?v=' + Math.random()
	 }).appendTo('head');


});

$(".basicCarousel").owlCarousel({
	'margin': 14,
	'loop': !![],
	'stagePadding': 28,
	'items': 1,
	'dots': ![]
});
$(".sliderCarousel").owlCarousel({
	'loop': ![],
	'items': 1,
	'dots': !![]
});

$(".toggleSidebar").click(function() {
	$('.sidebarWrapper').fadeToggle(200);
	if ($("body").hasClass('sidebarActive')) {
		$('body').removeClass("sidebarActive");
	} else {
		$("body").addClass("sidebarActive");
	}
	if ($(".sidebarWrapper .sidebar").hasClass("is-active")) {
		$(".sidebarWrapper .sidebar").removeClass("is-active");
		$(".sidebarWrapper .sidebar").addClass("is-passive");
	} else {
		$(".sidebarWrapper .sidebar").addClass("is-active");
	}
});
$('.toggleSearchbox').click(function() {
	$('.searchBox').fadeToggle(200);
});