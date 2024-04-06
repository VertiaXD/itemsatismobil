var API = "https://www.itemsatis.com/";
var AppHome = "https://www.itemsatis.com/data/app/"; 
var storage = window.localStorage;

var fcmTokenGlobal = "";
var CONST_CDN_URL = "https://cdn.itemsatis.com/";
var CONST_NEWS_URL = "https://cdn.itemsatis.com/uploads/news/";
var CONST_AVATAR_URL = "https://cdn.itemsatis.com/avatar/";
var myDatasEnc = storage.getItem("SocketToken");
var myDatas = {
	userID : storage.getItem("UserId"),
	userName : storage.getItem("UserName"),
	PhoneVerify : storage.getItem("PhoneVerify"),
	Avatar : CONST_AVATAR_URL + storage.getItem("Avatar")
};

(function( $ ){
	$.fn.popup = function() {
		return this;
	};

	$('.view.view-main').append('<button class="tawkto-chat-button"><i class="icon ion-ios-help-buoy"></i></button>');
	$('.view.view-main').append('<div class="popup popup-chat panel-tawkto">\n' +
		'<div class="appHeader chatHeader">\n' +
		'<div class="left"><a href="#" class="icon goBack"><i class="icon ion-ios-arrow-back"></i></a></div>\n' +
		'<div class="pageTitle">CanlÄ± Destek</div>\n' +
		'</div>\n' +
		'<iframe src="https://tawk.to/chat/5e8e0b2c35bcbb0c9aaf2bd2/default" class="mobileFrame"></iframe>\n' +
		'</div>');

})( jQuery );

const Push = {
	create: function (userId,Array) {
		var notificationFull = myApp.notification.create({
			icon: '<i class="icon demo-icon">7</i>',
			title: 'Mesaj Bildirimi',
			titleRightText: 'ÅŸimdi',
			subtitle: userId,
			text: Array.body,
			closeTimeout: 3000,
		});
		notificationFull.open();
		return true;
	}
};

var deviceIsMobile = true;

var myApp = new Framework7({
	root: '#app',
	name: 'Ä°tem SatÄ±ÅŸ',
	id: 'com.itemsatis.mobil',
	pushState: true,
	initOnDeviceReady:true,
	view: {
        pushState: true,
	},
	lazy: {
		threshold: 50,
		sequential: false,
	},
	dialog: {
		title: 'Ä°temSatÄ±ÅŸ',
		buttonOk: 'Evet',
		buttonCancel: 'HayÄ±r',
	},
	smartSelect: {
		pageTitle: 'SeÃ§im yapÄ±nÄ±z',
		openIn: 'popup',
		closeOnSelect: true,
		popupCloseLinkText: "Geri",
	},
	on: {
		init() {
			FirebasePlugin.onMessageReceived(function(message) {
				FirebasePlugin.getBadgeNumber(function(n) {
					n = n + 1;
					FirebasePlugin.setBadgeNumber(n);
				});

				if(message.messageType === "notification"){
					if(message.tap != "background"){
						var notificationFull = myApp.notification.create({
							icon: '<i class="icon demo-icon">7</i>',
							title: "Ä°temSatÄ±ÅŸ Bildirim",
							titleRightText: 'ÅŸimdi',
							subtitle: message.title,
							text: message.body,
							closeTimeout: 10000,
						});
						notificationFull.open();
					}
					else
					{

					}
				}
				console.dir(message);
			}, function(error) {
				console.error(error);
			});

			$("#chatPageButton").data("popup","");
			$("#chatPageButton").removeClass("popup-open");

			if(storage.getItem("UserName") !== null)
			{
				$.getScript("https://www.itemsatis.com/dist/js/SocketChat.js?ver=" + Math.random(), function(data, textStatus, jqxhr){
					//app.initialize();
				});

				$(".panel-chat .chatHeader").remove();
				$(".panel-chat").prepend('' +
					'<div class="appHeader chatHeader">\n' +
					'<div class="left">\n' +
					'<a href="#" class="icon goBack">\n' +
					'<i class="icon ion-ios-arrow-back"></i>\n' +
					'</a>\n' +
					'</div>\n' +
					'<div class="pageTitle">\n' +
					'Sohbet\n' +
					'</div>\n' +
					'<div class="right">' +
					'<a href="#" class="icon newMessageBtn">\n' +
					'<i class="icon ion-md-add-circle-outline"></i>\n' +
					'</a>' +
					'</div>\n' +
					'</div>');

				$("ul.userListMessage li").on("click",function(){
					var userName = $(this).data("title");
					$(".chatHeader .pageTitle").html(userName);
				});

				$(".panel-chat .chatHeader .left a.icon.goBack").on("click",function(){
					if($(this).hasClass("goChatList"))
					{
						$(".chatMessagePanel").css("display","none");
						$(".newMessageBtn").css("display","block");
						$(this).removeClass("goChatList");
						$(".panel-chat .appHeader .pageTitle").html("Sohbet");
						$(".appHeader .right").css("display","block");
					}
					else
					{
						myApp.popup.close(".panel-chat", true);
					}
				});
			}

			$(".panel-tawkto .chatHeader .left a.icon.goBack").on("click",function(){
				myApp.popup.close(".panel-tawkto", true);
			});

			//?ver=1587130417

			$(".sidebar .profilebox").remove();
			$.ajax({
				type: "POST",
				url: API + "api/popularProductCategories",
				data: "data=Fetch", // serializes the form's elements.
				success: function (data) {
					var data = JSON.parse(data);
					var htmlData = "<li><span class='butunKategoriler'>PopÃ¼ler Kategoriler</span></li>";

					$.each( data.datas , function( key, value ) {
						htmlData += '' +
							'<li><a href="/categories/' + value.Id + '/">\n' +
							'<img src="' + value.Image + '" alt="image">' +
								value.Title +
							'</a></li>';
					});

					$("ul.sidebarMenu").html(htmlData);
					/*
					if (device.platform == "iOS") {
						$('<link/>', {
							rel: 'stylesheet',
							type: 'text/css',
							href: 'https://www.itemsatis.com/data/app/css/IOS.css?v=' + Math.random()
						}).appendTo('head');
					}

					*/
				}
			});

		},
		pageInit: function (page) {

			myApp.dialog.alert("Mobil uygulamamÄ±z yeni versiyonu ile Ã§ok yakÄ±nda sizlerle olacak.", "Ä°temSatÄ±ÅŸ", function(){
				window.location.href = "https://www.itemsatis.com";
				window.navigator.app.exitApp();
			});

			leftPanel.close();

			if (device.platform == "iOS") {
				$$(".item-link.item-content.productData .item-after").css("display","none");
			}
		},
	}
});

var mainView = myApp.view.create('.view-main', {
	dynamicNavbar: true,
	pushState: true,
	routes : [
		/* Home */
		{
			name: 'home',
			path: '/home/',
			url: AppHome + 'html/home.php',
			on: {
				pageInit: function () {
					/* Slider */
					$(".cardOverlayCarousel").owlCarousel({
						'margin': 14,
						'loop': !![],
						'stagePadding': 28,
						'items': 1,
						'dots': ![]
					});

					$(".buttonCarousel").owlCarousel({
						'margin': 0,
						'loop': true,
						'stagePadding': 28,
						'items': 3,
						'dots': ![]
					});

					$(".homeNewsIlans").owlCarousel({
						'margin': 50,
						'loop': true,
						'stagePadding': 0,
						'items': 3,
						'dots': ![]
					});

					/* PopÃ¼ler Ä°lanlar */
					$.ajax({
						type: "POST",
						url: API + "api/getHomeSlider",
						data: "data=Fetch", // serializes the form's elements.
						success: function (data) {
							var data = JSON.parse(data);
							//console.log("Fetched");
							var htmlData = "";

							$.each( data.sliders , function( key, value ) {
								htmlData += '' +
									'<div class="item">\n' +
									'<a href="blog-post.html" class="card card-overlay text-white image-slider-card">\n' +
									'<img src="https://cdn.itemsatis.com/uploads/slider/'+value+'" class="card-img img-fluid" alt="image">\n' +
									'</a>\n' +
									'</div>';
							});

							$(".cardOverlayCarousel").owlCarousel('destroy');
							$(".cardOverlayCarousel").html(htmlData);
							$(".cardOverlayCarousel").owlCarousel({
								'margin': 28,
								'loop': !![],
								'stagePadding': 14,
								'autoplay':true,
								'autoplayTimeout':4000,
								'items': 1,
								'dots': ![]
							});
							$(".cardOverlayCarousel").removeClass("skeleton-text");
							$(".cardOverlayCarousel").removeClass("skeleton-effect-blink");
						}
					});

					/* Yeni Ä°lanlar */
					$.ajax({
						type: "POST",
						url: API + "api/homeNewPosts",
						data: "data=Fetch&Limit=15", // serializes the form's elements.
						success: function (data) {
							var data = JSON.parse(data);
							//console.log("Fetched");
							var htmlData = "";

							$.each( data.datas , function( key, value ) {
								htmlData += '' +
									'<div class="item">' +
									'<div class="col-12">' +
									'<a href="/post/' + value.Id + '/" class="postItem routerLink">' +
									'<div class="imageWrapper">' +
									'<img src="' + value.Image + '" alt="image" class="image">' +
									'<span class="ilanPriceSpan">' + value.Price + ' TL</span>' +
									'</div>' +
									'<h2 class="title">' + value.Title + '</h2>' +
									'<footer>' +
									value.categoryName +
									'</footer>' +
									'</a>' +
									'</div>'+
									'</div>';
							});

							$(".homeNewsIlans").owlCarousel('destroy');
							$(".homeNewsIlans").html(htmlData);


							$(".homeNewsIlans").owlCarousel({
								'margin': 0,
								'loop': true,
								'stagePadding': 28,
								'items': 3,
								'dots': ![]
							});
							$(".homeNewsIlans").removeClass("skeleton-text");
							$(".homeNewsIlans").removeClass("skeleton-effect-blink");
						}
					});

					/* Vitrin Ä°lanlar */
					$.ajax({
						type: "POST",
						url: API + "api/homePinnedPosts",
						data: "data=Fetch&Limit=40", // serializes the form's elements.
						success: function (data) {
							var data = JSON.parse(data);
							//console.log("Fetched");
							var htmlData = '<div class="item"><div class="row">';

							var i = 0;
							$.each( data.datas , function( key, value ) {
								if(i % 6 == 0 && i != 0)
									htmlData += '</div></div><div class="item"><div class="row">';

								htmlData += '' +
									'<div class="col-4">' +
									'<a href="/post/' + value.Id + '/" class="postItem routerLink">' +
									'<div class="imageWrapper">' +
									'<img src="' + value.Image + '" alt="image" class="image">' +
									'<span class="ilanPriceSpan">' + value.Price + ' TL</span>' +
									'</div>' +
									'<h2 class="title">' + value.Title + '</h2>' +
									'<footer>' +
									value.categoryName +
									'</footer>' +
									'</a>' +
									'</div>';

								i++;
							});
							htmlData += '</div></div>';

							$(".homePinnedIlans").html(htmlData);


							$(".homePinnedIlans").owlCarousel({
								'margin': 0,
								'loop': true,
								'stagePadding': 28,
								'items': 1,
								'dots': ![]
							});
							$(".homePinnedIlans").removeClass("skeleton-text");
							$(".homePinnedIlans").removeClass("skeleton-effect-blink");
						}
					});

					/* PopÃ¼ler Kategoriler */
					$.ajax({
						type: "POST",
						url: API + "api/popularProductCategories",
						data: "data=Fetch", // serializes the form's elements.
						success: function (data) {
							var data = JSON.parse(data);
							//console.log("Fetched");
							var htmlData = "";

							$.each( data.datas , function( key, value ) {
								htmlData += '' +
									'<div class="item">' +
									'<a href="/categories/' + value.Id + '/" class="routerLink">' +
									'<div class="imgWrapper">' +
									'<img src="' + value.Image + '" alt="image">' +
									'</div>' +
									'<strong>' + value.Title + '</strong>' +
									'</a>' +
									'</div>';
							});

							$(".buttonCarousel").owlCarousel('destroy');
							$(".buttonCarousel").html(htmlData);
							$(".buttonCarousel").removeClass("skeleton-text");
							$(".buttonCarousel").removeClass("skeleton-effect-blink");

							$(".buttonCarousel").owlCarousel({
								'margin': 0,
								'loop': true,
								'stagePadding': 28,
								'items': 3,
								'dots': ![]
							});
						}
					});

					/* Haberler */
					$.ajax({
						type: "POST",
						url: API + "api/getNews",
						data: "Limit=4", // serializes the form's elements.
						success: function (data) {
							var data = JSON.parse(data);
							//console.log("Fetched");
							var htmlData = "";

							$.each( data.datas , function( key, value ) {
								htmlData += '' +
									'<div class="col-6">' +
									'<a href="/newsdetail/' + value.Id + '/" class="postItem routerLink">' +
									'<div class="imageWrapper">' +
									'<img src="' + value.Image + '" alt="image" class="image">' +
									'</div>' +
									'<h2 class="title">' + value.Title + '</h2>' +
									'<footer>' +
									value.Datetime +
									'</footer>' +
									'</a>' +
									'</div>';
							});

							$(".homeNews").html(htmlData);
							$(".homeNews").removeClass("skeleton-text");
							$(".homeNews").removeClass("skeleton-effect-blink");
						}
					});
				}
			}
		},
		/* Categories */
		{
			name: "categories",
			path: '/categories/:id/',
			url: AppHome + 'html/categories.php',
			on: {
				pageInit: function () {
					var categoryID = myApp.views.main.router.currentRoute.params.id;
					console.log("Kategori ID : " + categoryID);

					$.ajax({
						type: "POST",
						url: API + "api/getFullCategory",
						data: "Id=" + categoryID, // serializes the form's elements.
						success: function (data) {
							var data = JSON.parse(data);
							//console.log("Fetched");
							var htmlData = "";

							$.each( data.special , function( key, value ) {
								if(value.Type == "advert")
									var tempLink = '/posts/'+ value.Id +'/1/';
								else
									var tempLink = '/products/'+ value.Id +'/';

								htmlData += '' +
									'<a href="' + tempLink + '" class="listItem routerLink">' +
									'<div class="image">' +
									'<img src="https://cdn.itemsatis.com/uploads/category_images/' + value.Image + '" alt="avatar">' +
									'</div>' +
									'<div class="text">' +
									'<div>' +
									'<strong class="categoryName">' + value.Title + '</strong>' +
									'</div>' +
									'</div>' +
									'</a>';
							});

							$.each( data.results , function( key, value ) {
								htmlData += '' +
									'<a href="/categories/' + value.value + '/" class="listItem routerLink">' +
									'<div class="image">' +
									'<img src="https://cdn.itemsatis.com/uploads/category_images/' + value.image + '"alt="avatar" loading="lazy">' +
									'</div>' +
									'<div class="text">' +
									'<div>' +
									'<strong class="categoryName">' + value.text + '</strong>' +
									'</div>' +
									'</div>' +
									'</a>';
							});

							$$(".listView").html(htmlData);
							$$(".listView").removeClass("skeleton-text");
							$$(".listView").removeClass("skeleton-effect-blink");

						}
					});

					$$(".categorySearch").on("keyup search change click",function(){
						console.log($(this).val());
						var value = $(this).val().toLowerCase();
						$$(".listView .listItem").filter(function() {
							$(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
						});
					});
				}
			}
		},
		/* Products */
		{
			name: "products",
			path: '/products/:id/',
			url: AppHome + 'html/products.php',
			on: {
				pageInit: function () {
					myApp.preloader.show();
					var categoryID = myApp.views.main.router.currentRoute.params.id;
					console.log("Kategori ID : " + categoryID);

					$.ajax({
						type: "POST",
						url: API + "api/getProductCategory",
						data: "Id=" + categoryID, // serializes the form's elements.
						success: function (data) {
							var data = JSON.parse(data);
							var htmlData = "";

							$(".CoverImage").attr("src","https://cdn.itemsatis.com/uploads/category_images/" + data.data.Background);
							$(".ProfileImage").attr("src","https://cdn.itemsatis.com/uploads/category_images/" + data.data.Logo);
							$(".productTitle").text(data.data.Title);
							$(".ProductDesc p").text(data.data.ShortDescription);
							$(".product-description").html(data.data.Description);
							$(".productHeader").removeClass("skeleton-text");
							$(".product-description").removeClass("skeleton-text");
							$(".ProductDesc button").removeClass("btn-default");
							$(".ProductDesc button").addClass("btn-primary");

							if(data.reviews_state == true)
							{
								var htmlData = "";
								$.each( data.reviews , function( key, value ) {
									htmlData += '' +
										'<div class="item">\n' +
										'<div class="image">\n' +
										'<img src="'+value.Avatar+'" alt="avatar" class="avatar">\n' +
										'</div>\n' +
										'<div class="content">\n' +
										'<strong>'+value.UserName+'</strong>\n' +
										'<div class="text">'+value.Message+'</div>\n' +
										'<footer>'+value.Datetime+'</footer>\n' +
										'</div>\n' +
										'</div>';
								});
								$("#yorumlar .block .comments").html(htmlData);
							}
							else
							{
								$("#yorumlar .block .comments").html('<br><center>' +
									'<img src="https://cdn.itemsatis.com/global/icons/customer-review.svg" width="80" class="mb-1"/>' +
									'<h4>Yorum bulunamadÄ±.</h3>' +
									'<p>Bu Ã¼rÃ¼n kategorisi iÃ§in yorum bulunamadÄ±.<br>Bir Ã¼rÃ¼n satÄ±n alÄ±p hemen yorum bÄ±rakabilirsiniz.</p>' +
									'</center>');
							}

							myApp.preloader.hide();
						}
					});

					$.ajax({
						type: "POST",
						url: API + "api/getProducts",
						data: "Id=" + categoryID, // serializes the form's elements.
						success: function (data) {
							var data = JSON.parse(data);
							var htmlData = "";

							$.each( data.datas , function( key, value ) {
								htmlData += '' +
									'<li>' +
									'<div class="item-link item-content productData" data-id="'+value.Id+'" data-name="'+value.Name+'" data-price="'+value.Price+'">' +
									'<div class="item-inner">' +
									'<div class="item-title-row">' +
									'<div class="item-title"><strong>' + value.Name + '</strong></div>' +
									'<div class="item-after"><strong>' + value.Price + 'â‚º</strong></div>' +
									'</div>' +
									'<div class="item-text">' + value.Description + '</div>' +
									'</div>	' +
									'</div>' +
									'</li>';
							});

							$$(".product-list ul").html(htmlData);
						}
					});

					$$(document).on("click",".product-list ul li .productData",function(){

						if(device.platform == "iOS")
						{
							myApp.dialog.alert('App Store politikalarÄ± nedeniyle uygulamada herhangi bir satÄ±n alma iÅŸlemi yapÄ±lamamaktadÄ±r.');
						}
						else
						{
							Swal.fire({
								type: 'info',
								width: '50em',
								title: 'SatÄ±n alma onayÄ±',
								html: 'Bu Ã¼rÃ¼nÃ¼ satÄ±n almak istediÄŸinize emin misiniz?<br>Dijital etkinleÅŸtirilebilir Ã¼rÃ¼nler iade edilemez.',
								showCancelButton: true,
								cancelButtonText: 'Ä°ptal',
								confirmButtonText: 'Evet, SatÄ±n Al!',
							}).then((result) => {
								if (result.value) {
									var thisBtn = this;
									myApp.preloader.show();
									$(this).prop("disabled", true);

									Swal.fire({
										type: 'warning',
										title: 'Bekleyiniz.',
										html: "Ä°ÅŸlem gerÃ§ekleÅŸtiriliyor lÃ¼tfen bekleyiniz.",
										showCancelButton: false,
										showConfirmButton: false,
										showCancelButton: false,
										allowOutsideClick: false,
										allowEscapeKey: false
									});

									$.ajax({
										type: "POST",
										url: API + "api/buyProduct",
										data: "Buy=" + $(this).data("id"),
										success: function (data) {
											$(thisBtn).prop("disabled", false);
											myApp.preloader.hide();

											data = JSON.parse(data);
											if (data.success) {
												storage.setItem("Balance", data.newBalance);
												Swal.fire({
													type: 'success',
													width: '50em',
													title: 'SatÄ±n alma iÅŸlemi baÅŸarÄ±lÄ±',
													allowOutsideClick: false,
													html: 'ÃœrÃ¼nÃ¼ baÅŸarÄ±yla satÄ±n aldÄ±nÄ±z.<br>Altta bulunan "SipariÅŸlerim SayfasÄ±na Git" butonuna tÄ±klayarak satÄ±n aldÄ±ÄŸÄ±nÄ±z Ã¼rÃ¼nÃ¼n detaylarÄ±nÄ± gÃ¶rebilirsiniz.<br><br>',
													showCancelButton: true,
													cancelButtonText: '<i class="fas fa-undo"></i>&nbsp; Geri DÃ¶n',
													confirmButtonText: '<i class="fas fa-shopping-basket"></i>&nbsp; SipariÅŸlerim SayfasÄ±na Git',
													reverseButtons: true,
												}).then((result) => {
													if (result.value)
														myApp.views.main.router.navigate({name: 'mypurchases'});
												});
											} else {
												Swal.fire({
													type: "warning",
													title: 'ÃœzgÃ¼nÃ¼z..',
													confirmButtonText: "AnladÄ±m",
													allowOutsideClick: false,
													html: data.message
												});

											}
											console.log(data.post);
										}
									});
								}
							});
						}
					});
				}
			}
		},
		/* Posts */
		{
			name: "posts",
			path: '/posts/:id/:page/',
			url: AppHome + 'html/posts.php',
			on: {
				pageInit: function () {
					myApp.preloader.show();
					var categoryID = myApp.views.main.router.currentRoute.params.id;
					var page = myApp.views.main.router.currentRoute.params.page;
					console.log("Kategori ID : " + categoryID);

					$.ajax({
						type: "POST",
						url: API + "api/getPostCategory",
						data: "Id=" + categoryID + "&page=" + page, // serializes the form's elements.
						success: function (data) {
							var data = JSON.parse(data);
							var htmlData = "";

							$(".CoverImage").attr("src","https://cdn.itemsatis.com/uploads/category_images/" + data.data.Background);
							$(".postTitle").text(data.data.Title);
							$(".PostDesc p").text(data.data.Description);
							$(".productHeader").removeClass("skeleton-text");

							var htmlData = "";

							$.each( data.pagination , function( key, value ) {

								if(value.Disabled === true)
									htmlData += '<li class="page-item disabled"><a class="page-link" href="#">' + value.Text + '</a></li>';
								else if(value.Active === true)
									htmlData += '<li class="page-item active"><a class="page-link" href="#">' + value.Text + '</a></li>';
								else
									htmlData += '<li class="page-item"><a class="page-link" href="' + value.Url + '">' + value.Text + '</a></li>';

							});
							$$(".pagination").html(htmlData);

							myApp.preloader.hide();
						}
					});

					$.ajax({
						type: "POST",
						url: API + "api/getPosts",
						data: "categoryID=" + categoryID + "&page=" + page, // serializes the form's elements.
						success: function (data) {
							var data = JSON.parse(data);
							var htmlData = "";

							htmlData += '<div class="itemList postNewList">';
							$.each( data.posts , function( key, value ) {
								htmlData += '' +
									'<div class="item">\n';

								if(value.Pinned == true)
									htmlData += '<span class="postPinnedBadge">Vitrin</span>';
								if(value.Featured == true)
									htmlData += '<span class="postFeaturedBadge">Ã–ne Ã‡Ä±kan</span>';

								htmlData +=
									'<div class="image">\n' +
									'<a href="/post/' + value.Id + '/">' +
									'<img src="https://cdn.itemsatis.com/' + value.Url+ '?height=250" alt="image" style="height: 100px;object-fit: cover;">\n' +
									'</a>' +
									'</div>\n' +
									'<div class="text">\n' +
									'<a href="/post/' + value.Id + '/">' +
									'<h4 class="title">' + value.Title + '</h4>\n' +
									'<div class="text-muted">' + value.Description+ '</div>\n' +
									'<div class="postDetails">' +
									'<span class="pull-left postPrice">' + value.Price + ' <small>TL</small></span> ' +
									'</div>\n' +
									'</a>' +
									'</div>\n' +

									'</div>';
									// '' +
									// '<div class="col-50">' +
									//
									// '<div class="card demo-card-header-pic">' +
									// '<div style="background-image:url()" class="card-header align-items-flex-end">' +
									// '<div class="AdvertBox-Price">' + value.Price + ' <small>TL</small></div>' +
									// '</div>' +
									// '<div class="card-content card-content-padding">' +
									// '<h4></h4>' +
									// '<p></p>' +
									// '</div>' +
									// '</div>' +
									// '</a>' +
									// '</div>';
							});
							htmlData += '</div>';

							if(typeof data.posts === "undefined")
							{
								htmlData = '<div class="col-100 mt-2"><center><img src="https://cdn.itemsatis.com/global/icons/164409.svg" width="110" class="mb-1"/><h4>Ä°lan bulunamadÄ±</h3><p>Bu kategoride gÃ¶rÃ¼ntÃ¼lenecek ilan bulunamadÄ±. Ä°lk ilanÄ± sen yayÄ±nlamak istiyorsan hemen altta bulunan "Ä°lan OluÅŸtur" butonuna tÄ±klayarak ilanÄ±nÄ± yayÄ±nla.</p></center></div>';
								$(".pagination").fadeOut();
							}

							$$(".postList").removeClass("skeleton-text");
							$$(".postList").removeClass("skeleton-effect-blink");
							$$(".postList").html(htmlData);
						}
					});

					$$(document).on("click",".product-list ul li .productData",function(){
						// console.log("Click triggered");
						// myApp.dialog.confirm('Bu Ã¼rÃ¼nÃ¼ ' + $(this).data("price") + "â‚º karÅŸÄ±lÄ±ÄŸÄ±nda satÄ±n almak istediÄŸine emin misin ?",$(this).data("name"), function () {
						// 	myApp.dialog.alert('Great!');
						// });

						Swal.fire({
							type: 'info',
							width : '50em',
							title: 'SatÄ±n alma onayÄ±',
							html: 'Bu Ã¼rÃ¼nÃ¼ satÄ±n almak istediÄŸinize emin misiniz?<br>Dijital etkinleÅŸtirilebilir Ã¼rÃ¼nler iade edilemez.',
							showCancelButton: true,
							cancelButtonText: 'Ä°ptal',
							confirmButtonText: 'Evet, SatÄ±n Al!',
						}).then((result) => {
							if (result.value)
							{
								var thisBtn = this;
								$(this).prop("disabled", true);

								Swal.fire({
									type: 'warning',
									title: 'Bekleyiniz.',
									html: "Ä°ÅŸlem gerÃ§ekleÅŸtiriliyor lÃ¼tfen bekleyiniz.",
									showCancelButton: false,
									showConfirmButton: false,
									showCancelButton: false,
									allowOutsideClick: false,
									allowEscapeKey: false
								});

								$.ajax({
									type: "POST",
									url: API + "api/buyProduct",
									data: "Buy=" + $(this).data("id"),
									success: function (data) {
										$(thisBtn).prop("disabled", false);

										data = JSON.parse(data);
										if(data.success)
										{
											storage.setItem("Balance", data.newBalance);
											Swal.fire({
												type: 'success',
												width : '50em',
												title: 'SatÄ±n alma iÅŸlemi baÅŸarÄ±lÄ±',
												allowOutsideClick: false,
												html: 'ÃœrÃ¼nÃ¼ baÅŸarÄ±yla satÄ±n aldÄ±nÄ±z.<br>Altta bulunan "SipariÅŸlerim SayfasÄ±na Git" butonuna tÄ±klayarak satÄ±n aldÄ±ÄŸÄ±nÄ±z Ã¼rÃ¼nÃ¼n detaylarÄ±nÄ± gÃ¶rebilirsiniz.<br><br>',
												showCancelButton: true,
												cancelButtonText: '<i class="fas fa-undo"></i>&nbsp; Geri DÃ¶n',
												confirmButtonText: '<i class="fas fa-shopping-basket"></i>&nbsp; SipariÅŸlerim SayfasÄ±na Git',
												reverseButtons: true,
											}).then((result) => {
												if (result.value)
													myApp.views.main.router.navigate({name: 'mypurchases'});
											});
										}
										else
										{
											Swal.fire({
												type: "warning",
												title: 'ÃœzgÃ¼nÃ¼z..',
												confirmButtonText: "AnladÄ±m",
												allowOutsideClick: false,
												html: data.message
											});

										}
										console.log(data.post);
									}
								});
							}
						});
					});
				}
			}
		},
		/* Post Detail */
		{
			name: "postdetail",
			path: '/post/:id/',
			url: AppHome + 'html/post.php',
			on: {
				pageInit: function () {
					var postID = myApp.views.main.router.currentRoute.params.id;
					var globalHtmlData = "";
					console.log("Ä°lan ID : " + postID);

					$.ajax({
						type: "POST",
						url: API + "api/getPostDetail",
						data: "Id=" + postID, // serializes the form's elements.
						success: function (data) {
							var data = JSON.parse(data);

							var htmlData = "";
							$.each( data.data.images , function( key, value ) {
								htmlData += '' +
									'<div class="item">' +
									'<img src="' + value + '" alt="image" class="imageBlock img-fluid rounded">' +
									'</div>';
							});

							if(data.isFav == true)
								$("button.btn.btn-block.btn-fav").html('<i class="icon ion-ios-heart-dislike"></i>');

							$("button.btn.btn-block.btn-fav").data("id",postID);

							globalHtmlData = data.htmlData;

							if(data.data.State != "1")
							{
								$(".fiyatPanel").fadeOut();
							}

							if(data.data.State == "2")
								$(".appContent").prepend('<div class="postStateMessage"><i class="icon ion-ios-cloudy-night"></i><h4 class="">Ä°lan satÄ±ldÄ±!</h4></div>');
							else if(data.data.State == "3")
								$(".appContent").prepend('<div class="postStateMessage"><i class="icon ion-ios-cloudy-night"></i><h4 class="">YayÄ±n sÃ¼resi doldu!</h4></div>');
							else if(data.data.State == "4")
								$(".appContent").prepend('<div class="postStateMessage"><i class="icon ion-ios-cloudy-night"></i><h4 class="">Ä°lan iÅŸlemde!</h4></div>');
							else if(data.data.State == "5")
								$(".appContent").prepend('<div class="postStateMessage"><i class="icon ion-ios-cloudy-night"></i><h4 class="">Ä°lan iÅŸlemde!</h4></div>');
							else if(data.data.State == "6")
								$(".appContent").prepend('<div class="postStateMessage"><i class="icon ion-ios-cloudy-night"></i><h4 class="">Ä°lan yayÄ±ndan kaldÄ±rÄ±ldÄ±!</h4></div>');

							if(data.chatID != false)
								$('<button class="btn btn-chat btn-block" onclick="startChat(\''+data.data.UserData.UserId+'\',\''+data.data.UserData.UserName+'\',\''+data.data.UserData.Avatar+'\',\''+data.chatID+'\')"><i class="icon ion-md-chatboxes"></i> SatÄ±cÄ± ile sohbet et</button>').insertAfter(".profileDetail.postSellerDetail");

							$(".basicCarousel").html(htmlData);
							$(".basicCarousel").owlCarousel({
								'margin': 14,
								'loop': !![],
								'stagePadding': 28,
								'items': 1,
								'dots': ![]
							});
							$(".postTitle").html(data.data.Title + ' <small class="text-muted">#' + data.data.Id + '</small>');
							$("#aciklama p").html(data.data.Description);

							$(".postSellerDetail .profileBox .image img").attr("src",data.data.UserData.Avatar);
							$(".postSellerDetail .info strong").text(data.data.UserData.UserName);
							$(".postSellerDetail .ekYazilar").html('<span class="text-success">'+data.data.UserData.PositiveRep+' baÅŸarÄ±lÄ± iÅŸlem</span><span class="text-danger">'+data.data.UserData.NegativeRep+' baÅŸarÄ±sÄ±z iÅŸlem</span>');

							$(".ratingPanel .genelortalama").text(data.data.review.genelortalama);
							$(".ratingPanel .degerlendirmesayisi").text(data.data.review.count);
							$(".ratingPanel .p1").text(data.data.review.p1);
							$(".ratingPanel .p2").text(data.data.review.p2);
							$(".ratingPanel .p3").text(data.data.review.p3);
							$(".ratingPanel .p4").text(data.data.review.p4);

							$(".userProfileLink").attr("href","/profile/"+data.data.UserData.UserId+"/");
							$("button.btn.btn-block.btn-buy").data("id",postID);
							$("button.btn.btn-block.btn-buy").data("price",data.data.Price);
							$("button.btn.btn-block.btn-buy").html('<i class="icon ion-md-cart"></i> SatÄ±n Al '+data.data.Price+'â‚º');

							var htmlData = "";
							$.each( data.data.benzer , function( key, value ) {
								htmlData += '' +
									'<div class="col-6 postBox">' +
									'<a href="/post/'+value.Id+'/" class="postItem routerLink">' +
									'<div class="imageWrapper">' +
									'<img src="' + value.Image + '" alt="image" class="image">' +
									'</div>' +
									'<h2 class="title">' + value.Title + '</h2>' +
									'<footer>' + value.Price + ' â‚º</footer>' +
									'</a>' +
									'</div>';
							});
							$(".BenzerIlanlar").html(htmlData);
							$(".BenzerIlanlar").removeClass("skeleton-text");
							$(".BenzerIlanlar").removeClass("skeleton-effect-blink");

							var htmlData = "";
							$.each( data.data.review.datas , function( key, value ) {
								htmlData += '' +
									'<div class="card demo-facebook-card">' +
									'<div class="card-header">' +
									'<div class="demo-facebook-avatar"><img src="' + value.Avatar + '" width="34" height="34" class=""></div>' +
									'<div class="demo-facebook-name">' + value.UserName + '</div>' +
									'<div class="demo-facebook-date">' + value.Datetime + '</div>' +
									'</div>' +
									'<div class="card-content card-content-padding">' +
									'<p>' + value.Message + '</p>' +
									'</div>' +
									'<div class="card-footer">' +
									'<div class="row" style="width: 100%;margin: 0px;">' +
									'<div class="col-3">' +
									'<b>' + value.P1 + '</b>' +
									'<span>GÃ¼venilirlik</span>' +
									'</div>' +
									'<div class="col-3">' +
									'<b>' + value.P2 + '</b>' +
									'<span>Memnuniyet</span>' +
									'</div>' +
									'<div class="col-3">' +
									'<b>' + value.P3 + '</b>' +
									'<span>Ä°letiÅŸim</span>' +
									'</div>' +
									'<div class="col-3">' +
									'<b>' + value.P4 + '</b>' +
									'<span>Teslimat</span>' +
									'</div>' +
									'</div>' +
									'</div>' +
									'</div>';
							});
							$$("#sellerRatings").html(htmlData);

							var imageSlider = [];
							$.each( data.data.images , function( key, value ) {
								imageSlider.push(value);
							});
							console.log(imageSlider);

							var myPhotoBrowserStandalone = myApp.photoBrowser.create({
								photos : imageSlider
							});

							$$('.basicCarousel img').on('click', function () {
								myPhotoBrowserStandalone.open();
							});
						}
					});

					$$(".btn-fav").on("click",function (event) {
						event.preventDefault();

						var postValue = $(this).data("value");
						var advertID = $(this).data("id");

						$.post(API + 'api/postFavorite', "Id=" + advertID, function( data ) {
							var data = JSON.parse(data);
							if(data.success === false)
							{
								if(data.login_required === true)
								{
									$(".navbar-itemsatis2 .UserSection ul li.LoginButton").trigger("click");
								}
								else
								{
									Swal.fire({
										type: 'error',
										title: 'Oops...',
										html: data.message,
										confirmButtonText: "Tamam"
									});
								}
							}

							if(data.success)
							{
								Swal.fire({
									type: 'success',
									title: 'BaÅŸarÄ±lÄ±!',
									html: data.message,
									confirmButtonText: "Tamam"
								});

								if(data.Now == "fav")
								{
									$('.btn-fav').removeAttr("data-tooltip");
									$('.btn-fav').popup('hide');
									$('.btn-fav').popup('destroy');
									$(".btn-fav").html('<i class="icon ion-ios-heart-dislike"></i>');
									$('.btn-fav').popup({
										content  : 'Ä°lanÄ± favorilerden Ã§Ä±kartmak iÃ§in tÄ±klayÄ±n.'
									});
								}
								else
								{
									$('.btn-fav').removeAttr("data-tooltip");
									$('.btn-fav').popup('hide');
									$('.btn-fav').popup('destroy');
									$(".btn-fav").html('<i class="icon ion-ios-heart"></i>');
									$('.btn-fav').popup({
										content  : 'Ä°lanÄ± favori ilanlarÄ±n listesine eklemek iÃ§in tÄ±kla.'
									});
								}
							}
						});
					});

					$$(".btn-buy").on("click",function(){
						var advertID = $(this).data("id");
						var Price = $(this).data("price");
						console.log(globalHtmlData);

						Swal.fire({
							title: 'SatÄ±n alma iÅŸlemi',
							type: 'question',
							html:
								'Bu ilanÄ± '+Price+'â‚º karÅŸÄ±lÄ±ÄŸÄ±nda satÄ±n almak iÃ§in lÃ¼tfen onaylayÄ±n.<br>' +
								'<form class="ui form buyPostForm" id="buyPostForm" method="POST" action="" data-id="'+advertID+'" data-value="'+Price+'" data-category="<?=$AdvertData->categoryName?>">' +
								'<div class="postResponse"></div>' +
								'<input type="hidden" name="Id" value="'+advertID+'"/>' +
									globalHtmlData +

								'<div class="custom-control custom-checkbox mb-1">\n' +
								'<input type="checkbox" class="custom-control-input" id="sozlesmeInput" name="Sozlesme" value="1">\n' +
								'<label class="custom-control-label" for="sozlesmeInput"><a class="popupPage" data-href="35">Ä°lan aÃ§Ä±klamasÄ±nÄ± ve KullanÄ±cÄ±lar arasÄ± mesafeli satÄ±ÅŸ sÃ¶zleÅŸmesi</a>\'ni okudum kabul ediyorum.</label>\n' +
								'</div>' +

								'<center>' +
								'<button type="submit" class="buyPostReal swal2-confirm swal2-styled" aria-label="Thumbs up, great!" style="display: inline-block; border-left-color: rgb(48, 133, 214); border-right-color: rgb(48, 133, 214);">SatÄ±n Al</button>\n' +
								'<button type="button" class="cancelPost swal2-cancel swal2-styled" aria-label="Thumbs up, great!" style="display: inline-block; border-left-color: rgb(48, 133, 214); border-right-color: rgb(48, 133, 214);">VazgeÃ§</button>\n' +
								'</center>' +
								'</form>',
							showCancelButton: false,
							showConfirmButton: false,
							showCloseButton: true,
							focusConfirm: false,
							customClass: {
								container: 'satinal-post-container',
							}
						});
					});

					$(document).on("click",".cancelPost",function () {
						Swal.close();
					});

					$(document).on("submit",".buyPostForm",function (event) {
						event.preventDefault();
						myApp.preloader.show();

						Swal.close();

						$(".postResponse").css("display","none");
						$(".postResponse").html(" ");
						console.log($(this).serialize());

						var postID = $(this).data("id");
						var postValue = $(this).data("value");
						var postCategory = $(this).data("category");

						var advertID = getUrlParameter("Id");
						$.post(API + 'api/buyPost', $(this).serialize(), function( data ) {
							myApp.preloader.hide();

							var data = JSON.parse(data);
							if(data.success === false)
							{
								Swal.fire({
									type: 'error',
									width : '50em',
									title: 'SatÄ±n alma iÅŸlemi baÅŸarÄ±sÄ±z',
									html: data.message,
									showCancelButton:false,
									showConfirmButton: false
								});
								// $(".postResponse").fadeIn();
								// $(".postResponse").html();
							}

							if(data.success)
							{
								Swal.fire({
									type: 'success',
									width : '50em',
									title: 'SatÄ±n alma iÅŸlemi baÅŸarÄ±lÄ±',
									html: 'Ä°lanÄ± baÅŸarÄ±yla satÄ±n aldÄ±nÄ±z, sizin iÃ§in bildirimleri ve satÄ±cÄ± ile sohbetinizi oluÅŸturduk.AÅŸaÄŸÄ±daki butonlardan iÅŸlem yapabilirsiniz.<br><br>',
									showCancelButton: true,
									cancelButtonText: '<i class="fas fa-undo"></i>&nbsp; Geri DÃ¶n',
									confirmButtonText: '<i class="fas fa-shopping-basket"></i>&nbsp; Bildirimlerim SayfasÄ±na Git',
									reverseButtons: true,
								}).then((result) => {
									if (result.value)
									{
										myApp.views.main.router.navigate('/notifications/', {force: true, ignoreCache: true, reload: true});
										window.location.href = 'index.html#!/notifications/';
										window.location.reload();
									}
								});
							}
						});
					});
				}
			}
		},
		/* Search */
		{
			name: "search",
			path: '/search/',
			url: AppHome + 'html/search.php',
			on: {
				pageInit: function () {
					$(".postCarousel").owlCarousel({
						'margin': 14,
						'loop': true,
						'stagePadding': 38,
						'items': 2,
						'dots': ![]
					});

					/* PopÃ¼ler Kategoriler */
					$.ajax({
						type: "POST",
						url: API + "api/popularProductCategories",
						data: "data=Fetch", // serializes the form's elements.
						success: function (data) {
							var data = JSON.parse(data);
							//console.log("Fetched");
							var htmlData = "";

							$.each( data.datas , function( key, value ) {
								htmlData += '' +
									'<div class="item">' +
									'<a href="/categories/' + value.Id + '/" class="routerLink">' +
									'<div class="imgWrapper">' +
									'<img src="' + value.Image + '" alt="image">' +
									'</div>' +
									'<strong>' + value.Title + '</strong>' +
									'</a>' +
									'</div>';
							});

							$(".buttonCarousel").owlCarousel('destroy');
							$(".buttonCarousel").html(htmlData);
							$(".buttonCarousel").removeClass("skeleton-text");
							$(".buttonCarousel").removeClass("skeleton-effect-blink");

							$(".buttonCarousel").owlCarousel({
								'margin': 0,
								'loop': false,
								'stagePadding': 28,
								'items': 3,
								'dots': ![]
							});
						}
					});

					/* Ajax Arama */
					$$(".searchInput").on("keyup",function(){
						var SearchText = $(this).val();
						if(SearchText.length == 0)
						{
							$(".searchResult").html(" ");
						}
						if(SearchText.length > 3)
						{
							console.log(SearchText + " --> " + SearchText.length);
							$.ajax({
								type: "GET",
								url: API + "api/searchData/q=" + SearchText,
								success: function (data) {
									var data = JSON.parse(data);
									console.log("Length: " + data.data.length);
									if(data.data.length == 0)
									{
										$(".searchResult").html('<div class="noresultsearch">'+
											'<img src="https://cdn.itemsatis.com/global/illustrations/undraw_empty_xct9.png"/>'+
											'<b>SonuÃ§ bulunamadÄ±</b>'+
											'<p>AramanÄ±zÄ±n sonucu kalbiniz kadar temiz...</p>'+
											'</div>');
										return false;
									}

									var productList = [];
									var categoryList = [];
									var postList = [];
									$.each( data.data , function( key, value ) {
										if(value.category == "product")
										{
											productList.push({
												id: value.id,
												title: value.title,
												url:  value.url,
												description:  value.description,
												image:  value.image,
												categoryid:  value.categoryid,
											});
										}
										else if(value.category == "category")
										{
											categoryList.push({
												id: value.id,
												title: value.title,
												url:  value.url,
												description:  value.description,
												image:  value.image,
											});
										}
										else if(value.category == "adverts")
										{
											postList.push({
												id: value.id,
												title: value.title,
												url:  value.url,
												description:  value.description,
												image:  value.image,
											});
										}
									});

									$(".searchResult").html(" ");
									var tempHTML = "";
									if(categoryList.length > 0)
									{
										tempHTML = tempHTML + '<h5>Kategoriler</h5><div class="listView">';
										$.each( categoryList , function( key, value ) {
											tempHTML = tempHTML + '' +
												'<a href="/categories/' + value.id + '/" class="listItem routerLink">' +
												'<div class="image">' +
												'<img src="' + value.image + '" alt="avatar">' +
												'</div>' +
												'<div class="text">' +
												'<div><strong>' + value.title + '</strong></div>' +
												'</div>' +
												'</a>';
										});
										tempHTML = tempHTML + '</div>';
									}
									if(productList.length > 0)
									{
										tempHTML = tempHTML + '<h5>ÃœrÃ¼nler</h5><div class="listView">';
										$.each( productList , function( key, value ) {
											tempHTML = tempHTML + '' +
												'<a href="/products/' + value.categoryid + '/" class="listItem routerLink">' +
												'<div class="image">' +
												'<img src="' + value.image + '" alt="avatar">' +
												'</div>' +
												'<div class="text">' +
												'<div><strong>' + value.title + '</strong></div>' +
												'</div>' +
												'</a>';
										});
										tempHTML = tempHTML + '</div>';
									}
									if(postList.length > 0)
									{
										tempHTML = tempHTML + '<h5>Ãœye Ä°lanlarÄ±</h5><div class="listView">';
										$.each( postList , function( key, value ) {
											tempHTML = tempHTML + '' +
												'<a href="/post/' + value.id + '/" class="listItem routerLink">' +
												'<div class="image">' +
												'<img src="' + value.image + '" alt="avatar">' +
												'</div>' +
												'<div class="text">' +
												'<div><strong>' + value.title + '</strong></div>' +
												'</div>' +
												'</a>';
										});
										tempHTML = tempHTML + '</div>';
									}

									$(".searchResult").html(tempHTML);

									// console.log(productList);
									// console.log(categoryList);
									// console.log(postList);
								}
							});
						}
					});
				}
			}
		},
		/* News */
		{
			name: "news",
			path: '/news/',
			url: AppHome + 'html/news.php',
			on: {
				pageInit: function () {
					/* Haberler */
					$.ajax({
						type: "POST",
						url: API + "api/getNews",
						data: "Limit=50", // serializes the form's elements.
						success: function (data) {
							var data = JSON.parse(data);
							//console.log("Fetched");
							var htmlData = "";

							$.each( data.datas , function( key, value ) {
								htmlData += '' +
									'<div class="col-6">' +
									'<a href="/newsdetail/' + value.Id + '/" class="postItem routerLink">' +
									'<div class="imageWrapper">' +
									'<img src="' + value.Image + '" alt="image" class="image">' +
									'</div>' +
									'<h2 class="title">' + value.Title + '</h2>' +
									'<footer>' +
									value.Datetime +
									'</footer>' +
									'</a>' +
									'</div>';
							});

							$(".homeNews").html(htmlData);
							$(".homeNews").removeClass("skeleton-text");
							$(".homeNews").removeClass("skeleton-effect-blink");
						}
					});
				}
			}
		},
		/* Vitrin Ä°lanlarÄ± */
		{
			name: "vitrin",
			path: '/vitrin/',
			url: AppHome + 'html/vitrin.php',
			on: {
				pageInit: function () {
					/* Vitrin */
					$.ajax({
						type: "POST",
						url: API + "api/homePinnedPosts",
						data: "Limit=500", // serializes the form's elements.
						success: function (data) {
							var data = JSON.parse(data);
							//console.log("Fetched");
							var htmlData = "";

							$.each( data.datas , function( key, value ) {
								htmlData += '' +
									'<div class="col-6">' +
									'<a href="/post/' + value.Id + '/" class="postItem routerLink">' +
									'<div class="imageWrapper" style="position:relative;">' +
									'<img src="' + value.Image + '" alt="image" class="image">' +
									'<span class="ilanPriceSpan">' + value.Price + ' TL</span>' +
									'</div>' +
									'<h2 class="title">' + value.Title + '</h2>' +
									'<footer>' +
									value.categoryName +
									'</footer>' +
									'</a>' +
									'</div>';
							});

							$(".PinnedIlans").html(htmlData);
							$(".PinnedIlans").removeClass("skeleton-text");
							$(".PinnedIlans").removeClass("skeleton-effect-blink");
						}
					});
				}
			}
		},
		/* Yeni Ä°lanlar */
		{
			name: "yeniilanlar",
			path: '/yeniilanlar/',
			url: AppHome + 'html/yeniilanlar.php',
			on: {
				pageInit: function () {
					/* Vitrin */
					$.ajax({
						type: "POST",
						url: API + "api/homeNewPosts",
						data: "Limit=50", // serializes the form's elements.
						success: function (data) {
							var data = JSON.parse(data);
							//console.log("Fetched");
							var htmlData = "";

							$.each( data.datas , function( key, value ) {
								htmlData += '' +
									'<div class="col-6">' +
									'<a href="/post/' + value.Id + '/" class="postItem routerLink">' +
									'<div class="imageWrapper" style="position:relative;">' +
									'<img src="' + value.Image + '" alt="image" class="image">' +
									'<span class="ilanPriceSpan">' + value.Price + ' TL</span>' +
									'</div>' +
									'<h2 class="title">' + value.Title + '</h2>' +
									'<footer>' +
									value.categoryName +
									'</footer>' +
									'</a>' +
									'</div>';
							});

							$(".PinnedIlans").html(htmlData);
							$(".PinnedIlans").removeClass("skeleton-text");
							$(".PinnedIlans").removeClass("skeleton-effect-blink");
						}
					});
				}
			}
		},
		/* News Detail */
		{
			name: "newsdetail",
			path: '/newsdetail/:id/',
			url: AppHome + 'html/newsdetail.php',
			on: {
				pageInit: function () {
					myApp.preloader.show();
					var newsID = myApp.views.main.router.currentRoute.params.id;
					console.log("Kategori ID : " + newsID);

					$.ajax({
						type: "POST",
						url: API + "api/getNewsDetail",
						data: "Id=" + newsID, // serializes the form's elements.
						success: function (data) {
							var data = JSON.parse(data);
							$("#newsDetail h1").text(data.data.Title);
							$("#newsDetail .postBody figure img").attr("src",data.data.Image);
							$("#newsDetail .postBody p").html(data.data.Content);


							myApp.preloader.hide();
						}
					});
				}
			}
		},
		/* Forgot Password */
		{
			name: 'forgot-password',
			path: '/forgot-password/',
			url: AppHome + 'html/forgot-password.php',
			on: {
				pageInit: function () {
					if (storage.getItem("UserName") !== null) {
						myApp.views.main.router.navigate({name: 'controlpanel'});
					}

					$(document).on("change","input[name=Yontem]",function () {
						myApp.preloader.show();
						if($(this).val() == "SMS")
						{
							$("#UnuttumForm input[name=UserName]").val("");
							$("#UnuttumForm input[name=UserName]").attr("type","tel");
							$("#UnuttumForm input[name=UserName]").attr("placeholder","___ ___ __ __");
							$("#UnuttumForm input[name=UserName]").attr("pattern","[0-9]{3} [0-9]{3} [0-9]{2} [0-9]{2}");
							// $("#UnuttumForm input[name=UserName]").inputmask("999 999 99 99");
						}
						else
						{
							$("#UnuttumForm input[name=UserName]").val("");
							$("#UnuttumForm input[name=UserName]").attr("type","email");
							$("#UnuttumForm input[name=UserName]").attr("placeholder","LÃ¼tfen mail adresinizi giriniz.");
							$("#UnuttumForm input[name=UserName]").removeAttr("pattern");
							// $("#UnuttumForm input[name=UserName]").inputmask("*{1,20}[.*{1,20}][.*{1,20}][.*{1,20}]@*{1,20}[.*{2,6}][.*{1,2}]");
						}
						myApp.preloader.hide();
					});

					$(document).on("submit","#UnuttumForm",function(event){
						event.preventDefault();
						myApp.preloader.show();

						var form = $(this);

						$.ajax({
							type: "POST",
							url: API + "api/ForgetPassword",
							data: form.serialize(), // serializes the form's elements.
							success: function(data)
							{
								myApp.preloader.hide();
								var data = JSON.parse(data);
								if(data.success === false)
								{
									Swal.fire({
										type: 'danger',
										title: 'BaÅŸarÄ±sÄ±z!',
										html: data.message,
										confirmButtonText: "Tamam"
									});
								}

								if(data.success)
								{
									async function guvenlikKodu(){
										const { value: UserName } = await Swal.fire({
											title: 'GÃ¼velik kodu onayÄ±',
											html: data.message,
											input: 'text',
											allowOutsideClick: false,
											showCancelButton: true,
											cancelButtonText: "Ä°ptal",
											confirmButtonText: "Kodu onayla",
											inputPlaceholder: '6 Haneli gÃ¼venlik kodunu giriniz.',
											inputValidator: (value) => {
												return new Promise((resolve) => {
													if (!value) {
														resolve('LÃ¼tfen 6 haneli gÃ¼venlik kodunu giriniz.');
													}
													if (value.length != 6) {
														resolve('LÃ¼tfen 6 haneli gÃ¼venlik kodunu giriniz.');
													}

													myApp.preloader.show();
													$.ajax({
														type: 'POST',
														url: API + 'api/ForgetPassword',
														data: "securityCode=" + value,
														success: function (data) {
															myApp.preloader.hide();
															data = JSON.parse(data);
															if (data.success === false) {
																resolve(data.message);
															}
															if (data.success === true) {
																Swal.fire({
																	type: 'success',
																	title: 'BaÅŸarÄ±lÄ±!',
																	html: data.message,
																	confirmButtonText: "Tamam"
																});
															}
														}
													});
												});
											},
											customClass: {
												container: 'container-class special-message',
											}
										});
									}
									guvenlikKodu();
								}
							}
						});
					});
				}
			}
		},
		/* Register */
		{
			name: 'register',
			path: '/register/',
			url: AppHome + 'html/register.php',
			on: {
				pageInit: function () {
					if (storage.getItem("UserName") !== null) {
						myApp.views.main.router.navigate({name: 'controlpanel'});
					}

					$(".registerUserBtn").on("click",function (event) {
						event.preventDefault();
						myApp.preloader.show();
						var form = $('#registerForm')[0];
						var data = new FormData(form);

						var thisBtn = this;
						$(this).prop("disabled", true);

						$.ajax({
							type: "POST",
							enctype: 'multipart/form-data',
							url: API + "api/Register",
							data: data,
							processData: false,
							contentType: false,
							cache: false,
							timeout: 600000,
							success: function (data) {
								myApp.preloader.hide();
								$(thisBtn).prop("disabled", false);

								data = JSON.parse(data);
								if(data.success)
								{
									Swal.fire({
										type: 'success',
										width : '50em',
										title: 'ÃœyeliÄŸiniz oluÅŸturuldu!',
										html: data.message,
										showCancelButton: false,
										confirmButtonText: '<i class=\"fas fa-users-cog\"></i>&nbsp; GiriÅŸ yapmak iÃ§in tÄ±klayÄ±nÄ±z',
										reverseButtons: true,
									}).then((result) => {
										if (result.value)
											myApp.views.main.router.navigate({name: 'login'});
									});
								}
								else
								{
									Swal.fire({
										type: "warning",
										title: 'ÃœzgÃ¼nÃ¼z..',
										confirmButtonText: "AnladÄ±m",
										html: data.message
									});

								}
							}
						});
					});
				}
			}
		},
		/* Login */
		{
			name: 'login',
			path: '/login/',
			url: AppHome + 'html/login.php',
			on: {
				pageInit: function () {

					console.log(storage.getItem("UserName"));
					if(storage.getItem("UserName") !== null)
					{
						myApp.views.main.router.navigate({ name: 'controlpanel'});
					}

					$$(".loginBtn").on("click",function(){
						myApp.preloader.show();
						$.ajax({
							type: "POST",
							url: API + "api/Login",
							data: "UserName=" + $$(".UserNameLogin").val() + "&Password=" + $$(".PasswordLogin").val(), // serializes the form's elements.
							success: function(data)
							{
								myApp.preloader.hide();
								var data = JSON.parse(data);
								if(data.success === false)
								{
									Swal.fire({
										type: 'error',
										title: 'Oops...',
										html: data.message,
										confirmButtonText: "Tamam"
									});
								}

								if(data.success)
								{
									storage.setItem("token", data.token);
									storage.setItem("SocketToken", data.SocketToken);
									storage.setItem("UserId", data.result.Id);
									storage.setItem("UserName", data.result.UserName);
									storage.setItem("MailAddress", data.result.MailAddress);
									storage.setItem("Avatar", data.result.Avatar);
									storage.setItem("Cover", data.result.Cover);
									storage.setItem("Balance", data.result.Balance);
									storage.setItem("Phone", data.result.Phone);
									storage.setItem("Name", data.result.Name);
									storage.setItem("SurName", data.result.SurName);
									storage.setItem("PhoneVerify", data.result.PhoneVerify);

									// Swal.fire({
									// 	type: 'success',
									// 	title: 'BaÅŸarÄ±lÄ±!',
									// 	html: data.message,
									// 	confirmButtonText: "Tamam"
									// });

									myApp.views.main.router.navigate({ name: 'controlpanel' });
									setTimeout(function(){location.reload(true);} , 500);
								}

								if(data.smsonay)
								{
									Swal.fire({
										title: 'SMS OnayÄ±',
										icon: 'info',
										html:
											'LÃ¼tfen <b>**** *** '+data.phone2+'</b> numaralÄ± cep telefonunuza gÃ¶nderilen onay kodunu girin.<br>Kod geÃ§erliliÄŸinin sona ermesine <span id="leftTime">5:00</span> kaldÄ±. <div id="smsResponseDiv"></div><input type="text" name="smsOnayKodu" class="smsOnayControl" maxlength="6"/><button class="ui blue fluid button smsOnayBtn" type="submit">Kodu Onayla</button>',
										showCloseButton: true,
										showCancelButton: false,
										showConfirmButton: false,
										allowOutsideClick: false,
										allowEscapeKey: false,
										focusConfirm: false,
										confirmButtonText: 'Kodu Onayla',
									});

									var timer2 = "5:00";
									var interval = setInterval(function() {


										var timer = timer2.split(':');
										//by parsing integer, I avoid all extra string processing
										var minutes = parseInt(timer[0], 10);
										var seconds = parseInt(timer[1], 10);
										--seconds;
										minutes = (seconds < 0) ? --minutes : minutes;
										if (minutes < 0) clearInterval(interval);
										seconds = (seconds < 0) ? 59 : seconds;
										seconds = (seconds < 10) ? '0' + seconds : seconds;
										//minutes = (minutes < 10) ?  minutes : minutes;
										$('#leftTime').html(minutes + ':' + seconds);
										timer2 = minutes + ':' + seconds;

										if(minutes == 0 && seconds == 0)
											location.reload(true);
									}, 1000);
								}

								if(data.mailonay)
								{
									Swal.fire({
										title: 'Mail OnayÄ±',
										icon: 'info',
										html:
											'LÃ¼tfen <b>'+data.mail1+'@'+data.mail2+'</b> mail adresinize gÃ¶nderilen onay kodunu girin.<br>Kod geÃ§erliliÄŸinin sona ermesine <span id="leftTime">5:00</span> kaldÄ±. <div id="mailResponseDiv"></div><input type="text" name="mailOnayKodu" class="smsOnayControl" maxlength="6"/><button class="ui blue fluid button mailOnayBtn" type="submit">Kodu Onayla</button>',
										showCloseButton: true,
										showCancelButton: false,
										showConfirmButton: false,
										allowOutsideClick: false,
										allowEscapeKey: false,
										focusConfirm: false,
										confirmButtonText: 'Kodu Onayla',
									});

									var timer2 = "5:00";
									var interval = setInterval(function() {


										var timer = timer2.split(':');
										//by parsing integer, I avoid all extra string processing
										var minutes = parseInt(timer[0], 10);
										var seconds = parseInt(timer[1], 10);
										--seconds;
										minutes = (seconds < 0) ? --minutes : minutes;
										if (minutes < 0) clearInterval(interval);
										seconds = (seconds < 0) ? 59 : seconds;
										seconds = (seconds < 10) ? '0' + seconds : seconds;
										//minutes = (minutes < 10) ?  minutes : minutes;
										$('#leftTime').html(minutes + ':' + seconds);
										timer2 = minutes + ':' + seconds;

										if(minutes == 0 && seconds == 0)
											location.reload(true);
									}, 1000);
								}
							}
						});

					});

					$("body").on("click",".smsOnayBtn",function () {
						myApp.preloader.show();
						$.ajax({
							type: "POST",
							url: API + "api/Login",
							data: "OnayKodu=" + $("input[name=smsOnayKodu]").val(), // serializes the form's elements.
							success: function (data) {
								myApp.preloader.hide();
								var data = JSON.parse(data);
								if(data.success === false)
								{
									$$("#smsResponseDiv").html(data.message);
								}
								if(data.success)
								{
									// location.reload(true);
									storage.setItem("token", data.token);
									storage.setItem("SocketToken", data.SocketToken);
									storage.setItem("UserId", data.result.Id);
									storage.setItem("UserName", data.result.UserName);
									storage.setItem("MailAddress", data.result.MailAddress);
									storage.setItem("Avatar", data.result.Avatar);
									storage.setItem("Cover", data.result.Cover);
									storage.setItem("Balance", data.result.Balance);
									storage.setItem("Phone", data.result.Phone);
									storage.setItem("Name", data.result.Name);
									storage.setItem("SurName", data.result.SurName);
									storage.setItem("PhoneVerify", data.result.PhoneVerify);

									myApp.views.main.router.navigate({ name: 'controlpanel' });
									setTimeout(function(){location.reload(true);} , 500);
								}
							}
						});
					});

					$("body").on("click",".mailOnayBtn",function () {
						myApp.preloader.show();
						$.ajax({
							type: "POST",
							url: API + "api/Login",
							data: "MailOnayKodu=" + $("input[name=mailOnayKodu]").val(), // serializes the form's elements.
							success: function (data) {
								myApp.preloader.hide();
								var data = JSON.parse(data);
								if(data.success === false)
								{
									$$("#mailResponseDiv").html(data.message);
								}
								if(data.success)
								{
									storage.setItem("token", data.token);
									storage.setItem("SocketToken", data.SocketToken);
									storage.setItem("UserId", data.result.Id);
									storage.setItem("UserName", data.result.UserName);
									storage.setItem("MailAddress", data.result.MailAddress);
									storage.setItem("Avatar", data.result.Avatar);
									storage.setItem("Cover", data.result.Cover);
									storage.setItem("Balance", data.result.Balance);
									storage.setItem("Phone", data.result.Phone);
									storage.setItem("Name", data.result.Name);
									storage.setItem("SurName", data.result.SurName);
									storage.setItem("PhoneVerify", data.result.PhoneVerify);

									myApp.views.main.router.navigate({ name: 'controlpanel' });
									setTimeout(function(){location.reload(true);} , 500);
								}
							}
						});
					});

				}
			}
		},
		/* Control Panel */
		{
			name: 'controlpanel',
			path: '/controlpanel/',
			url: AppHome + 'html/controlpanel.php',
			on: {
				pageMounted: function test (e, page) {
					if(storage.getItem("token") == null)
						requiredLogin();
				},
				pageInit: function () {
					//debugger;
					if(storage.getItem("token") == null)
						myApp.views.main.router.navigate({ name: 'login' });

					$$("#UserAvatar").attr("src",CONST_AVATAR_URL + storage.getItem("Avatar"));
					$$("#UserName").text(storage.getItem("UserName"));
					$$("#UserBalance").text(storage.getItem("Balance") + " â‚º");

					$$(".profileURL").attr("href","/profile/"+storage.getItem("UserId")+"/");

					if(storage.getItem("PhoneVerify") == "0")
					{
						$(".list.settingMenuList ul").prepend('<li>\n' +
							'<a href="/verifyphone/" class="item-link item-content">\n' +
							'<div class="item-media"><i class="icon ion-ios-phone-portrait" style="color: #fb8520;"></i></div>\n' +
							'<div class="item-inner"><div class="item-title" style="color: #fb8520;">Telefon NumaranÄ± DoÄŸrula</div></div>\n' +
							'</a>\n' +
							'</li>');
					}

					$(".logoutUser").on("click",function(){
						Swal.fire({
							title: 'emin misiniz?',
							text: "HesabÄ±nÄ±zdan Ã§Ä±kmak istediÄŸinizden emin misiniz?",
							type: 'warning',
							showCancelButton: true,
							confirmButtonColor: '#3085d6',
							cancelButtonColor: '#d33',
							confirmButtonText: 'Evet, Ã‡Ä±k!',
							cancelButtonText: 'VazgeÃ§'
						}).then((result) => {
							if (result.value) {
								myApp.preloader.show();

								$.ajax({
									type: "POST",
									url: API + "api/Logout",
									data: "Islem=Logout", // serializes the form's elements.
									success: function(data)
									{
										myApp.preloader.hide();
										var data = JSON.parse(data);
										if(data.success === false)
										{
											Swal.fire({
												type: 'error',
												title: 'Oops...',
												html: data.message,
												confirmButtonText: "Tamam"
											});
										}
										else if(data.success === true)
										{
											storage.removeItem("token");
											storage.removeItem("SocketToken");
											storage.removeItem("UserId");
											storage.removeItem("UserName");
											storage.removeItem("MailAddress");
											storage.removeItem("Avatar");
											storage.removeItem("Cover");
											storage.removeItem("Balance");
											storage.removeItem("Phone");
											storage.removeItem("Name");
											storage.removeItem("SurName");

											myApp.views.main.router.navigate({ name: 'home' });

											Swal.fire({
												type: 'success',
												title: 'Ã‡Ä±kÄ±ÅŸ baÅŸarÄ±lÄ±!',
												html: "BaÅŸarÄ±yla Ã§Ä±kÄ±ÅŸ yaptÄ±nÄ±z. Anasayfaya yÃ¶nlendiriliyorsunuz.",
												confirmButtonText: "Tamam"
											});

											setTimeout(function(){location.reload(true);} , 50);

											// location.reload(true);
										}
									}
								});
							}
						})
					});
				}
			}
		},
		/* Notifications */
		{
			name: "notifications",
			path: '/notifications/',
			url: AppHome + 'html/notifications.php',
			on: {
				pageMounted: function test (e, page) {
					if(storage.getItem("token") == null)
						requiredLogin();
				},
				pageInit: function () {

					$.ajax({
						type: "POST",
						url: API + "api/MyNotifications",
						success: function (data) {
							var data = JSON.parse(data);
							//console.log("Fetched");
							var htmlData = "";

							if(data.notification_state == true)
							{
								$.each( data.notifications , function( key, value ) {
									if(value.seen == "1")
									{
										htmlData += ''+
											'<li>' +
											'<a href="/notification/'+value.id+'/" class="item-link item-content">' +
											'<div class="item-media"><img src="'+ value.image +'" width="45" class=""></div>' +
											'<div class="item-inner">' +
											'<div class="item-title-row">' +
											'<div class="item-title">' + value.sender + '</div>' +
											'</div>' +
											'<div class="item-subtitle">' + value.message + '</div>' +
											'</div>' +
											'</a>' +
											'</li>';
									}
									else
									{
										htmlData += ''+
											'<li>' +
											'<a href="/notification/'+value.id+'/" class="item-link item-content">' +
											'<div class="item-media"><img src="'+ value.image +'" width="45" class=""></div>' +
											'<div class="item-inner">' +
											'<div class="item-title-row">' +
											'<div class="item-title"><b>' + value.sender + '</b></div>' +
											'</div>' +
											'<div class="item-subtitle"><b>' + value.message + '</b></div>' +
											'</div>' +
											'</a>' +
											'</li>';
									}

								});
								$$("#notificationList ul").html(htmlData);
							}
							else
							{
								htmlData = '<br><center>' +
									'<img src="https://cdn.itemsatis.com/global/icons/newsletter.svg" width="80" class="mb-1"/>' +
									'<h4>Bildirim bulunmuyor</h3>' +
									'<p>Bildirim merkezinizde ÅŸuan iÃ§in hiÃ§ bildirim bulunmuyor.</p>' +
									'</center>';
								$$("#notificationList").html(htmlData);
							}

							$$("#notificationList").removeClass("skeleton-text");
							$$("#notificationList").removeClass("skeleton-effect-blink");
							console.log("Skeleton cleared.");
						}
					});
				}
			}
		},
		/* Notifications Detail */
		{
			name: "notifitacionsdetail",
			path: '/notification/:id/',
			url: AppHome + 'html/notificationdetail.php',
			on: {
				pageInit: function () {
					myApp.preloader.show();
					var newsID = myApp.views.main.router.currentRoute.params.id;
					console.log("Kategori ID : " + newsID);

					$.ajax({
						type: "POST",
						url: API + "api/getNotificationDetail",
						data: "Id=" + newsID, // serializes the form's elements.
						success: function (data) {
							var data = JSON.parse(data);
							var htmlData = "";

							if(data.success == true)
							{
								var htmlData = '<ul>\n' +
									'<li>\n' +
									'<div class="item-content">\n' +
									'<div class="item-media">\n' +
									'<img src="'+data.detail.Image+'" width="45" class="">\n' +
									'</div>\n' +
									'<div class="item-inner">\n' +
									'<div class="item-title-row">\n' +
									'<div class="item-title">'+data.detail.Name+'</div>\n' +
									'</div>\n' +
									'<div class="item-subtitle">'+data.detail.Datetime+'</div>\n' +
									'</div>\n' +
									'</div>\n' +
									'</li>\n' +
									'</ul>\n' +
									'<br>\n' +
									'<h4>'+data.detail.Title+'</h4>\n' +
									'<p>'+data.detail.Message+'</p>';
							}

							$("#notificationDetail").html(htmlData);

							// $(".CoverImage").attr("src",API + data.data.Background);
							// $(".ProfileImage").attr("src",API + data.data.Logo);
							// $(".productTitle").text(data.data.Title);
							// $(".ProductDesc p").text(data.data.ShortDescription);
							// $(".product-description").html(data.data.Description);
							// $(".productHeader").removeClass("skeleton-text");
							// $(".product-description").removeClass("skeleton-text");
							// $(".ProductDesc button").removeClass("btn-default");
							// $(".ProductDesc button").addClass("btn-primary");

							myApp.preloader.hide();
						}
					});
				}
			}
		},
		/* Withdraw Money */
		{
			name: "withdrawmoney",
			path: '/withdrawmoney/',
			url: AppHome + 'html/withdrawmoney.php',
			on: {
				pageMounted: function test (e, page) {
					if(storage.getItem("token") == null)
						requiredLogin();
				},
				pageInit: function () {
					// myApp.dataTable.create({
					// 	el : ".data-table-collapsible"
					// });
					if(storage.getItem("token") == null)
						myApp.views.main.router.navigate({ name: 'login' });

					WithdrawableBalance = 0;
					IslemUcreti = 3;

					$.ajax({
						type: "POST",
						url: API + "api/getWithdrawMoney",
						success: function (data) {
							var data = JSON.parse(data);
							//console.log("Fetched");
							var htmlData = "";
							$.each( data.BankList , function( key, value ) {
								htmlData += '<option value="'+value.Id+'">'+value.Owner+' , '+value.BankName+' , '+value.IBAN+'</option>';
							});
							$$("select[name=BankaId]").html(htmlData);

							var MaxData = data.WithdrawableBalance - data.IslemUcreti;
							if(MaxData < 0)
								MaxData = 0;

							$$("#islemUcreti").val(data.IslemUcreti.toFixed(2)+"â‚º");
							$$("#dusecekBakiye").val(data.WithdrawableBalance+"â‚º");
							$$("input[name=Price]").val(MaxData);
							$$("input[name=Price]").attr("max",MaxData);
							WithdrawableBalance = data.WithdrawableBalance;
							IslemUcreti = data.IslemUcreti;

							var htmlData = "";
							$.each( data.Gecmis , function( key, value ) {
								htmlData += ''+
									'<tr>'+
									'<td class="numeric-cell">' + value.Id + '</td>'+
									'<td>' + value.Price + 'â‚º</td>'+
									'<td>' + value.Datetime + '</td>'+
									'<td>' + value.State + '</td>'+
									'<td>' + value.IBAN + '</td>'+
									'<td>' + value.Name + '</td>'+
									'<td>' + value.Islem + '</td>'+
									'</tr>';
							});
							console.log(htmlData);
							$$(".card table tbody").html(htmlData);

							//
						}
					});

					$$("input[name=Price]").on('keyup', function () {
						var Amount = parseFloat($(this).val());
						// if(Amount < 10)
						// {
						// 	Amount = 10;
						// 	$(this).val(10);
						// }
						// if(Amount > WithdrawableBalance)
						// {
						// 	$(this).val(WithdrawableBalance);
						// 	Amount = WithdrawableBalance;
						// }

						var dusecekBakiye = Amount + IslemUcreti;
						var kalanBakiye = WithdrawableBalance - dusecekBakiye;
						$$("#dusecekBakiye").val(dusecekBakiye.toFixed(2));
						$$("#kalanBakiye").val(kalanBakiye.toFixed(2));
					});

					$$("input[name=Price]").on('change click', function () {
						var Amount = parseFloat($(this).val());
						if(Amount < 10)
						{
							Amount = 10;
							$(this).val(10);
						}
						if(Amount > WithdrawableBalance)
						{
							$(this).val(WithdrawableBalance);
							Amount = WithdrawableBalance;
						}

						var dusecekBakiye = Amount + IslemUcreti;
						var kalanBakiye = WithdrawableBalance - dusecekBakiye;
						$$("#dusecekBakiye").val(dusecekBakiye.toFixed(2));
						$$("#kalanBakiye").val(kalanBakiye.toFixed(2));
					});

					$$("#withdrawForm").on("submit",function(e) {
						e.preventDefault();
						var form = $(this);

						Swal.fire({
							title: 'emin misiniz?',
							html: "Para Ã§ekme talebi gÃ¶ndermek istediÄŸinize emin misiniz ?",
							type: 'warning',
							showCancelButton: true,
							confirmButtonColor: '#3085d6',
							cancelButtonColor: '#d33',
							cancelButtonText: 'VazgeÃ§',
							confirmButtonText: 'Evet, Kaydet!'
						}).then((result) => {
							if (result.value) {
								$.ajax({
									type: "POST",
									url: API + "api/withdrawMoney",
									data: form.serialize(),
									success: function(data)
									{
										var data = JSON.parse(data);
										if(data.success === false)
										{
											Swal.fire({
												title: 'Hata!',
												html: data.message,
												type: 'error',
												confirmButtonText: 'Tamam'
											});
										}
										else
										{
											Swal.fire({
												title: 'BaÅŸarÄ±lÄ±!',
												html: data.message,
												type: 'success',
												confirmButtonText: 'Tamam'
											}).then((result) => {
												if (result.value) {
													location.reload(true);
												}
											});
										}
									}
								});
							}
						});
					});

					$(document).on("click",".iptalEt",function () {
						var dataID = $(this).data("id");

						Swal.fire({
							title: 'emin misiniz?',
							html: "Para Ã§ekim talebini iptal etmek istediÄŸine emin misin ?",
							type: 'warning',
							showCancelButton: true,
							confirmButtonColor: '#3085d6',
							cancelButtonColor: '#d33',
							cancelButtonText: 'VazgeÃ§',
							confirmButtonText: 'Evet!'
						}).then((result) => {
							if (result.value) {
								$.ajax({
									type: "POST",
									url: API + "api/cancelWithdraw",
									data: "dataID=" + dataID,
									success: function(data)
									{
										var data = JSON.parse(data);
										if(data.success === false)
										{
											Swal.fire({
												title: 'Hata!',
												html: data.message,
												type: 'error',
												confirmButtonText: 'Tamam'
											});
										}
										else
										{
											Swal.fire({
												title: 'BaÅŸarÄ±lÄ±!',
												html: data.message,
												type: 'success',
												confirmButtonText: 'Tamam'
											}).then((result) => {
												if (result.value) {
													location.reload(true);
												}
											});
										}
									}
								});
							}
						});
					});
				}
			}
		},
		/* Change Password */
		{
			name: 'changepassword',
			path: '/changepassword/',
			url: AppHome + 'html/changepassword.php',
			on: {
				pageMounted: function test (e, page) {
					if(storage.getItem("token") == null)
						requiredLogin();
				},
				pageInit: function () {
					if(storage.getItem("token") == null)
						myApp.views.main.router.navigate({ name: 'login' });

					$(".changePasswordBtn").on("click",function () {
						$.ajax({
							type: 'POST',
							url: API + 'api/changePassword',
							data: $("#changePasswordForm").serialize(),
							success: function (data) {
								data = JSON.parse(data);
								if (data.success === false) {
									Swal.fire({
										title: 'Hata!',
										html: data.message,
										type: 'error',
										confirmButtonText: 'Tamam'
									});
								}
								if (data.success === true) {
									Swal.fire({
										title: 'BaÅŸarÄ±lÄ±!',
										html: data.message,
										type: 'success',
										confirmButtonText: 'Tamam'
									});

									$('#changePasswordForm')[0].reset();
									$(':input','#changePasswordForm')
										.not(':button, :submit, :reset, :hidden')
										.val('')
										.prop('checked', false)
										.prop('selected', false);
								}
							}
						});
					});
				}
			}
		},
		/* Change Mail */
		{
			name: 'changemail',
			path: '/changemail/',
			url: AppHome + 'html/changemail.php',
			on: {
				pageMounted: function test (e, page) {
					if(storage.getItem("token") == null)
						requiredLogin();
				},
				pageInit: function () {
					if(storage.getItem("token") == null)
						myApp.views.main.router.navigate({ name: 'login' });

					$("input[name=SuankiMail]").val(storage.getItem("MailAddress"));
					$(".changeMailBtn").on("click",function () {
						$.ajax({
							type: 'POST',
							url: API + 'api/changeMail',
							data: $("#changeMailForm").serialize(),
							success: function (data) {
								data = JSON.parse(data);
								if (data.success === false) {
									Swal.fire({
										title: 'Hata!',
										html: data.message,
										type: 'error',
										confirmButtonText: 'Tamam'
									});
								}
								if (data.success === true) {
									Swal.fire({
										title: 'BaÅŸarÄ±lÄ±!',
										html: data.message,
										type: 'success',
										confirmButtonText: 'Tamam'
									});

									$('#changeMailForm')[0].reset();
									$(':input','#changeMailForm')
										.not(':button, :submit, :reset, :hidden')
										.val('')
										.prop('checked', false)
										.prop('selected', false);
								}
							}
						});
					});
				}
			}
		},
		/* Change Profile Datas */
		{
			name: 'profiledata',
			path: '/profiledata/',
			url: AppHome + 'html/profiledata.php',
			on: {
				pageMounted: function test (e, page) {
					if(storage.getItem("token") == null)
						requiredLogin();
				},
				pageInit: function () {
					if(storage.getItem("token") == null)
						myApp.views.main.router.navigate({ name: 'login' });

					$.ajax({
						type: 'POST',
						url: API + 'api/getUserProfileDatas',
						data: "",
						success: function (data) {
							data = JSON.parse(data);
							console.log(data);

							$("textarea[name=Hakkinda]").val(data.datas.Bio);
							$("input[name=Discord]").val(data.datas.Discord);
							$("input[name=Skype]").val(data.datas.Skype);
							$("input[name=Twitch]").val(data.datas.Twitch);
							$("input[name=Youtube]").val(data.datas.Youtube);
							$("input[name=Facebook]").val(data.datas.Facebook);
							$("input[name=Instagram]").val(data.datas.Instagram);

							var htmlData = "";
							$.each( data.cities , function( key, value ) {
								if(value.selected)
									htmlData += '<option value="' + value.key + '" selected>' + value.title + '</option>';
								else
									htmlData += '<option value="' + value.key + '">' + value.title + '</option>';
							});
							$("select[name=Sehir]").html(htmlData);
						}
					});

					$(".changeProfileDatas").on("click",function () {
						$.ajax({
							type: 'POST',
							url: API + 'api/changeProfileDatas',
							data: $("#ProfilBilgileri").serialize(),
							success: function (data) {
								data = JSON.parse(data);
								if (data.success === false) {
									Swal.fire({
										title: 'Hata!',
										html: data.message,
										type: 'error',
										confirmButtonText: 'Tamam'
									});
								}
								if (data.success === true) {
									Swal.fire({
										title: 'BaÅŸarÄ±lÄ±!',
										html: data.message,
										type: 'success',
										confirmButtonText: 'Tamam'
									});
								}
							}
						});
					});
				}
			}
		},
		/* Account Security */
		{
			name: 'accountsecurity',
			path: '/accountsecurity/',
			url: AppHome + 'html/accountsecurity.php',
			on: {
				pageMounted: function test (e, page) {
					if(storage.getItem("token") == null)
						requiredLogin();
				},
				pageInit: function () {
					if(storage.getItem("token") == null)
						myApp.views.main.router.navigate({ name: 'login' });

					$.ajax({
						type: 'POST',
						url: API + 'api/getAccountSecurity',
						data: "",
						success: function (data) {
							data = JSON.parse(data);
							console.log(data);

							if(data.datas.MailSecurity == "Aktif")
								$('input[name=mail-guvenligi]').prop('checked', true);
							if(data.datas.SmsGuvenligi == "Aktif")
								$('input[name=sms-guvenligi]').prop('checked', true);
							if(data.datas.AbroadSecurity == "Aktif")
								$('input[name=yurtdisi-koruma]').prop('checked', true);
						}
					});

					$(".updateSecurity").on("click",function () {
						$.ajax({
							type: 'POST',
							url: API + 'api/accountSecurity',
							data: $("#AccountSecurity").serialize(),
							success: function (data) {
								data = JSON.parse(data);
								if (data.success === false) {
									Swal.fire({
										title: 'Hata!',
										html: data.message,
										type: 'error',
										confirmButtonText: 'Tamam'
									});
								}
								if (data.success === true) {
									Swal.fire({
										title: 'BaÅŸarÄ±lÄ±!',
										html: data.message,
										type: 'success',
										confirmButtonText: 'Tamam'
									});
								}
							}
						});
					});
				}
			}
		},
		/* User Login Logs */
		{
			name: 'loginlogs',
			path: '/loginlogs/',
			url: AppHome + 'html/loginlogs.php',
			on: {
				pageMounted: function test (e, page) {
					if(storage.getItem("token") == null)
						requiredLogin();
				},
				pageInit: function () {
					if(storage.getItem("token") == null)
						myApp.views.main.router.navigate({ name: 'login' });

					$.ajax({
						type: 'POST',
						url: API + 'api/getLoginLogs',
						data: "",
						success: function (data) {
							data = JSON.parse(data);
							console.log(data);

							var htmlData = "";
							$.each( data.datas , function( key, value ) {
								htmlData += ''+
									'<tr>'+
									'<td>' + value.Id + '</td>'+
									'<td>' + value.IPAddress + '</td>'+
									'<td>' + value.Datetime + '</td>'+
									'<td>' + value.Details + '</td>'+
									'</tr>';
							});
							console.log(htmlData);
							$$(".card table tbody").html(htmlData);
						}
					});
				}
			}
		},
		/* Money Transfer */
		{
			name: 'transfermoney',
			path: '/transfermoney/',
			url: AppHome + 'html/transfermoney.php',
			on: {
				pageMounted: function test (e, page) {
					if(storage.getItem("token") == null)
						requiredLogin();
				},
				pageInit: function () {
					if(storage.getItem("token") == null)
						myApp.views.main.router.navigate({ name: 'login' });

					$.ajax({
						type: 'POST',
						url: API + 'api/getYourCoupons',
						data: "",
						success: function (data) {
							data = JSON.parse(data);
							console.log(data);

							var htmlData = "";
							$.each( data.datas , function( key, value ) {
								htmlData += ''+
									'<tr>'+
									'<td>' + value.Id + '</td>'+
									'<td>' + value.UserName + '</td>'+
									'<td>' + value.Price + '</td>'+
									'<td>' + value.CreateDatetime + '</td>'+
									'<td>' + value.FinishDatetime + '</td>'+
									'<td>' + value.State + '</td>'+
									'<td>' + value.Detail + '</td>'+
									'</tr>';
							});
							console.log(htmlData);
							$$(".card table tbody").html(htmlData);
						}
					});

					$("#bakiyeTransferForm").on("submit",function (event) {
						event.preventDefault();
						myApp.preloader.show();

						$.ajax({
							type: 'POST',
							url: API + 'api/generateCoupon',
							data: $("#bakiyeTransferForm").serialize(),
							success: function (data) {
								myApp.preloader.hide();
								data = JSON.parse(data);
								if (data.success === false) {
									Swal.fire({
										title: 'Hata!',
										html: data.message,
										type: 'error',
										confirmButtonText: 'Tamam'
									});
								}
								if (data.success === true) {
									Swal.fire({
										title: 'BaÅŸarÄ±lÄ±!',
										html: data.message,
										type: 'success',
										confirmButtonText: 'Tamam'
									});
									location.reload(true);
								}
							}
						});
					});

					$(document).on("click",".kuponDetayBtn",function(){
						Swal.fire({
							title: 'Kupon Bilgilendirme',
							html: $(this).data("tooltip"),
							type: 'info',
							confirmButtonText: 'Tamam'
						});
					});
				}
			}
		},
		/* My Favorite Posts */
		{
			name: 'myfavoriteposts',
			path: '/myfavoriteposts/',
			url: AppHome + 'html/myfavoriteposts.php',
			on: {
				pageMounted: function test (e, page) {
					if(storage.getItem("token") == null)
						requiredLogin();
				},
				pageInit: function () {
					if(storage.getItem("token") == null)
						myApp.views.main.router.navigate({ name: 'login' });

					myApp.preloader.show();
					$.ajax({
						type: 'POST',
						url: API + 'api/getMyFavoritePosts',
						data: "",
						success: function (data) {
							data = JSON.parse(data);

							var htmlData = '<div class="row BenzerIlanlar">';
							$.each( data.datas , function( key, value ) {
								htmlData += '' +
									'<div class="col-6 postBox">' +
									'<a href="/post/'+value.Id+'/" class="postItem routerLink">' +
									'<div class="imageWrapper">' +
									'<img src="' + value.Url + '" alt="image" class="image">' +
									'</div>' +
									'<h2 class="title">' + value.Title + '</h2>' +
									'<footer>' + value.Price + ' â‚º</footer>' +
									'</a>' +
									'</div>';
							});
							htmlData += '</div>';

							if(typeof data.datas === "undefined")
							{
								htmlData += '' +
									'<div class="col-100 mt-2">' +
									'<center>' +
									'<img src="https://cdn.itemsatis.com/global/icons/favoriteList.svg" width="80" class="mb-1"/>' +
									'<h4>Favori ilan bulunamadÄ±.</h3>' +
									'<p>Favorilerinize eklediÄŸiniz hiÃ§bir ilan bulunamadÄ±.<br>Ä°lanlarÄ± yakÄ±ndan takip edebilmek iÃ§in hemen bir kaÃ§ tane ilanÄ± favorilerinize ekleyin.</p>' +
									'</center>' +
									'</div>';
							}

							$(".card-content").html(htmlData);
							myApp.preloader.hide();
						}
					});
				}
			}
		},
		/* Add Balance */
		{
			name: 'addbalance',
			path: '/addbalance/',
			url: AppHome + 'html/addbalance.php',
			on: {
				pageMounted: function test (e, page) {
					if(storage.getItem("token") == null)
						requiredLogin();
				},
				pageInit: function () {
					if(storage.getItem("token") == null)
						myApp.views.main.router.navigate({ name: 'login' });

					$("select[name=odeme-yontemi]").on("change",function(){
						var selectedValue = $(this).children("option:selected").val();
						$(".card-odeme-panel").css("display","none");
						$("#" + selectedValue).css("display","block");
					});

					$(document).on("click",".useCoupon",function () {
						var Code = $(this).data("code");
						$("input[name=BakiyeKuponu]").val(Code);
					});

					$(document).on("click",".messageOrder",function(){
						var html = $(this).data("html");
						Swal.fire({
							title: 'Bilgilendirme',
							html: html,
							type: 'info',
							confirmButtonText: 'Tamam'
						});
					});

					$(document).on("submit","#bakiyeKuponuForm",function (event) {
						event.preventDefault();
						pageLoading();

						$.ajax({
							type: 'POST',
							url: 'api/useBalanceCoupon',
							data: $("#bakiyeKuponuForm").serialize(),
							success: function (data) {
								pageLoaded();
								data = JSON.parse(data);
								if (data.success === false) {
									Swal.fire({
										title: 'Hata!',
										html: data.message,
										type: 'error',
										confirmButtonText: 'Tamam'
									});
								}
								if (data.success === true) {
									fbq('track', 'AddPaymentInfo');
									Swal.fire({
										title: 'BaÅŸarÄ±lÄ±!',
										html: data.message,
										type: 'success',
										confirmButtonText: 'Tamam'
									});
								}
							}
						});
					});

					$(document).on("submit",".bakiyeForm",function(event){
						event.preventDefault();
						myApp.preloader.show();

						$.ajax({
							type: 'POST',
							url: API + 'api/addBalance',
							data: $(this).serialize(),
							success: function (data) {
								myApp.preloader.hide();
								data = JSON.parse(data);
								if (data.success === false) {
									Swal.fire({
										title: 'Hata!',
										html: data.message,
										type: 'error',
										confirmButtonText: 'Tamam'
									});
								}
								if (data.success === true) {
									if(data.redirect === true)
									{
										window.location.href = data.link;
									}
									else
									{
										Swal.fire({
											title: 'BaÅŸarÄ±lÄ±!',
											html: data.message,
											type: 'success',
											confirmButtonText: 'Tamam'
										});
									}
								}
							}
						});
					});

					//$(".pricemask").inputmask({regex: "^[0-9]{1,4}(\\.\\d{1,2})?$"});

					$(document).on("click",".gpay-banks",function () {
						Swal.fire({
							html: '' +
								'<img src="'+ $(this).data("image") +'" width="150"/><br>' +
								'<div class="bank-text-left">' +
								'<center><b>' + $(this).data("bankname") + '</b></center><br><br>' +
								'<ul>' +
								'<li><b>IBAN</b><br>' + $(this).data("iban") + '</li>' +
								'<li><b>Åube Kodu</b><br>' + $(this).data("sube") + '</li>' +
								'<li><b>Hesap NumarasÄ±</b><br>' + $(this).data("hesap") + '</li>' +
								'<li><b>AlÄ±cÄ± AdÄ±</b><br>' + $(this).data("alici") + '</li>' +
								'</ul>' +
								'<br><form action="" method="POST" class="ui form bakiyeForm">' +
								'<input type="hidden" name="BankaId" value="'+$(this).data("id")+'"/>' +
								'<div class="field">\n' +
								'<label>YÃ¼klemek istediÄŸiniz tutar</label>\n' +
								'<input type="text" name="GPayBanka" class="pricemask">\n' +
								'</div>\n' +
								'<button class="ui button btn-block blue" type="submit">Ã–deme bildir</button>\n' +
								'</form>' +
								'</div><br><br>',
							showCloseButton: true,
							showConfirmButton: false
						}).then((result) => {
							if (result.value) {
								//window.location.href = "index.php?go=Settings#MailDegistir";
							}
						});
					});

				}
			}
		},
		/* My Posts */
		{
			name: 'myposts',
			path: '/myposts/',
			url: AppHome + 'html/myposts.php',
			on: {
				pageMounted: function test (e, page) {
					if(storage.getItem("token") == null)
						requiredLogin();
				},
				pageInit: function () {
					if(storage.getItem("token") == null)
						myApp.views.main.router.navigate({ name: 'login' });

					myApp.preloader.show();
					$.ajax({
						type: 'POST',
						url: API + 'api/getMyPosts',
						data: "",
						success: function (data) {
							data = JSON.parse(data);

							var htmlData = '<div class="row BenzerIlanlar">';
							$.each( data.datas.aktif , function( key, value ) {
								htmlData += '' +
									'<div class="col-6 postBox">' +
									'<a class="postItem routerLink" data-id="' + value.Id + '">' +
									'<div class="imageWrapper">' +
									'<img src="' + value.Url + '" alt="image" class="image">' +
									'</div>' +
									'<h2 class="title">' + value.Title + '</h2>' +
									'<footer>' + value.Price + ' â‚º</footer>' +
									'</a>' +
									'</div>';
							});
							htmlData += '</div>';

							if(typeof data.datas.aktif === "undefined")
							{
								htmlData = '' +
									'<div class="col-100 mt-2">' +
									'<center>' +
									'<img src="https://www.itemsatis.com/dist/img/search.png" width="80" class="mb-1"/>' +
									'<h4>Aktif ilan bulunamadÄ±.</h3>' +
									'<p>Åuan yayÄ±nda olan hiÃ§bir ilanÄ±nÄ±z yok.</p>' +
									'</center>' +
									'</div>';
							}

							$("#aktifIlanlar").html(htmlData);

							var htmlData = '<div class="row BenzerIlanlar">';
							$.each( data.datas.pasif , function( key, value ) {
								htmlData += '' +
									'<div class="col-6 postBox">' +
									'<a class="postItem routerLink" data-id="' + value.Id + '" data-state="' + value.State + '">' +
									'<div class="imageWrapper">' +
									'<img src="' + value.Url + '" alt="image" class="image">' +
									'</div>' +
									'<h2 class="title">' + value.Title + '</h2>' +
									'<footer>' + value.Price + ' â‚º</footer>' +
									'</a>' +
									'</div>';
							});
							htmlData += '</div>';

							if(typeof data.datas.pasif === "undefined")
							{
								htmlData = '' +
									'<div class="col-100 mt-2">' +
									'<center>' +
									'<img src="https://www.itemsatis.com/dist/img/search.png" width="80" class="mb-1"/>' +
									'<h4>Pasif ilan bulunamadÄ±.</h3>' +
									'<p>Åuan yayÄ±nda olmayan hiÃ§bir ilanÄ±nÄ±z yok.</p>' +
									'</center>' +
									'</div>';
							}

							$("#pasifIlanlar").html(htmlData);

							myApp.preloader.hide();
						}
					});

					$(document).on("click","#aktifIlanlar .postItem",function () {
						var postID = $(this).data("id");
						var ac5 = myApp.actions.create({
							buttons: [
								{
									text: 'Ä°lanÄ± GÃ¶rÃ¼ntÃ¼le',
									onClick: function () {
										myApp.views.main.router.navigate("/post/"+postID+"/");
									}
								},
								{
									text: 'Ä°lanÄ± DÃ¼zenle',
									onClick: function () {
										myApp.views.main.router.navigate("/editpost/"+postID+"/");
									}
								},
								{
									text: 'Ä°lanÄ± yayÄ±ndan kaldÄ±r',
									color: 'red',
									onClick: function () {
										Swal.fire({
											type: 'warning',
											title: 'Onay iÅŸlemi',
											html: "Ä°lanÄ±nÄ±zÄ± yayÄ±ndan almak istediÄŸinize emin misiniz?<br>Pasif ilanlarÄ±nÄ±zÄ± tekrardan yayÄ±na alabilirsiniz.",
											showCancelButton: true,
											cancelButtonText: 'Ä°ptal',
											confirmButtonText: 'YayÄ±ndan kaldÄ±r',
										}).then((result) => {
											if (result.value)
											{
												myApp.preloader.show();
												$.ajax({
													type: "POST",
													url: API + "api/unPublishPost",
													data: "Id=" + postID,
													success: function(data)
													{
														var data = JSON.parse(data);
														myApp.preloader.hide();
														if(data.success === false)
														{
															Swal.fire({
																title: 'Hata!',
																html: data.message,
																type: 'error',
																confirmButtonText: 'Tamam'
															});
														}
														else
														{
															Swal.fire({
																title: 'BaÅŸarÄ±lÄ±!',
																html: data.message,
																type: 'success',
																confirmButtonText: 'Tamam'
															});

															setInterval('window.location.reload()', 3000);
														}
													}
												});
											}
										});
									}
								},
							]
						});
						ac5.open();
					});

					$(document).on("click","#pasifIlanlar .postItem",function () {
						var postID = $(this).data("id");
						var postState = $(this).data("state");
						if(postState != 1 && postState != 3 && postState != 6)
						{
							var ac5 = myApp.actions.create({
								buttons: [
									{
										text: 'Ä°lanÄ± DÃ¼zenle',
										onClick: function () {
											myApp.dialog.alert('SatÄ±lmÄ±ÅŸ veya satÄ±lma sÃ¼recine girmiÅŸ bir ilanÄ± dÃ¼zenleyemezsiniz.');
										}
									},
									{
										text: 'Ä°lanÄ± tekrar yayÄ±nla',
										color: 'red',
										onClick: function () {
											myApp.dialog.alert('SatÄ±lmÄ±ÅŸ veya satÄ±lma sÃ¼recine girmiÅŸ bir ilanÄ± tekrardan yayÄ±nlayamazsÄ±nÄ±z.');
										}
									},
								]
							});
							ac5.open();
						}
						else
						{
							var ac5 = myApp.actions.create({
								buttons: [
									{
										text: 'Ä°lanÄ± DÃ¼zenle',
										onClick: function () {
											myApp.views.main.router.navigate("/editpost/"+postID+"/");
										}
									},
									{
										text: 'Ä°lanÄ± tekrar yayÄ±nla',
										color: 'green',
										onClick: function () {
											Swal.fire({
												type: 'warning',
												title: 'Onay iÅŸlemi',
												html: "Ä°lanÄ±nÄ±zÄ± tekrardan yayÄ±na almak istediÄŸinize emin misiniz ?<br>Ä°lan ÅŸuandan itibaren 14 gÃ¼nlÃ¼k olarak yayÄ±na alÄ±nacaktÄ±r.",
												showCancelButton: true,
												cancelButtonText: 'Ä°ptal',
												confirmButtonText: 'Tekrar yayÄ±nla!',
											}).then((result) => {
												if (result.value)
												{
													myApp.preloader.show();
													$.ajax({
														type: "POST",
														url: API + "api/rePublishPost",
														data: "Id=" + postID,
														success: function(data)
														{
															var data = JSON.parse(data);
															myApp.preloader.hide();
															if(data.success === false)
															{
																Swal.fire({
																	title: 'Hata!',
																	html: data.message,
																	type: 'error',
																	confirmButtonText: 'Tamam'
																});
															}
															else
															{
																Swal.fire({
																	title: 'BaÅŸarÄ±lÄ±!',
																	html: data.message,
																	type: 'success',
																	confirmButtonText: 'Tamam'
																});

																setInterval('window.location.reload()', 3000);
															}
														}
													});
												}
											});
										}
									},
								]
							});
							ac5.open();
						}

					});
				}
			}
		},
		/* Verify Phone */
		{
			name: 'verifyphone',
			path: '/verifyphone/',
			url: AppHome + 'html/verifyphone.php',
			on: {
				pageMounted: function test (e, page) {
					if(storage.getItem("token") == null)
						requiredLogin();
				},
				pageInit: function () {
					if(storage.getItem("token") == null)
						myApp.views.main.router.navigate({ name: 'login' });

					$("input[name=telefonNumaraniz]").val(storage.getItem("Phone"));
					// $("input[name=telefonNumaraniz]").inputmask("999 999 99 99");

					$(".dogrulamaOnay").on("click",function(){
						pageLoading();
						$.ajax({
							type: 'POST',
							url: API + 'api/phoneVerify',
							data: $("#phoneVerify").serialize(),
							success: function (data) {
								pageLoaded();
								data = JSON.parse(data);
								if (data.success === false) {
									Swal.fire({
										title: 'Hata!',
										html: data.message,
										type: 'error',
										confirmButtonText: 'Tamam'
									});
								}
								if (data.success === true) {
									Swal.fire({
										title: 'BaÅŸarÄ±lÄ±!',
										html: data.message,
										type: 'success',
										confirmButtonText: 'Tamam'
									});

									var html = '<p class="text-danger">DoÄŸrulama kodunu 6 kez yanlÄ±ÅŸ girdiÄŸinizde hesabÄ±nÄ±z bloke olacaktÄ±r.</p>' +
										'<div class="list no-hairlines-md">\n' +
										'<ul>\n' +
										'<li class="item-content item-input item-input-with-value">\n' +
										'<div class="item-inner">\n' +
										'<div class="item-title item-label">DoÄŸrulama Kodu</div>\n' +
										'<div class="item-input-wrap">\n' +
										'<input type="text" pattern="[0-9]{6}" name="onayKodunuz" inputmode="text">\n' +
										'</div>\n' +
										'</div>\n' +
										'</li>\n' +
										'<li class="item-content">\n' +
										'<button class="col button button-fill color-blue onayGerceklestir" type="submit">DoÄŸrula</button>\n' +
										'</li>\n' +
										'</ul>\n' +
										'</div>';
									$("#phoneVerify").html(html);

									// $("input[name=onayKodunuz]").inputmask("999999");
								}
							}
						});
					});

					$(document).on("click",".onayGerceklestir",function(){
						pageLoading();
						$.ajax({
							type: 'POST',
							url: API + 'api/phoneVerifyCode',
							data: $("#phoneVerify").serialize(),
							success: function (data) {
								pageLoaded();
								data = JSON.parse(data);
								if (data.success === false) {
									Swal.fire({
										title: 'Hata!',
										html: data.message,
										type: 'error',
										confirmButtonText: 'Tamam'
									});
									$("input[name=onayKodunuz]").val("");
									$("input[name=onayKodunuz]").focus();

									if(data.cikis === true)
									{
										location.reload(true);
									}
								}
								if (data.success === true) {
									Swal.fire({
										title: 'BaÅŸarÄ±lÄ±!',
										html: data.message,
										type: 'success',
										confirmButtonText: 'Tamam'
									}).then((result) => {
										if (result.value) {
											location.reload(true);
										}
									});
								}
							}
						});
					});
				}
			}
		},
		/* My Purchases */
		{
			name: 'mypurchases',
			path: '/mypurchases/',
			url: AppHome + 'html/mypurchases.php',
			on: {
				pageMounted: function test (e, page) {
					if(storage.getItem("token") == null)
						requiredLogin();
				},
				pageInit: function () {
					if(storage.getItem("token") == null)
						myApp.views.main.router.navigate({ name: 'login' });

					myApp.preloader.show();
					$.ajax({
						type: 'POST',
						url: API + 'api/getMyPurchases',
						data: "",
						success: function (data) {
							data = JSON.parse(data);
							myApp.preloader.hide();
							var htmlData = "";
							$.each( data.datas , function( key, value ) {
								htmlData += '' +
									'<div class="card demo-card-header-pic">' +
									'<div style="background-image:url(' + value.Background + ')" class="card-header align-items-flex-end">' + value.Title + '</div>' +
									'<div class="card-content card-content-padding">' +
									'<p class="date">' + value.Date + '</p>' +
									'<p><input type="password" class="valueInput" value="' + value.Value + '" readonly/></p>' +
									'</div>';
								if(value.Rated == "0")
									htmlData += '<div class="card-footer"><a href="#" class="link popover-open" data-popover=".popover-degerlendir-'+value.Id+'">DeÄŸerlendir</a></div>';
								htmlData +=	'</div>';

								if(value.Rated == "0")
								{
									htmlData += '' +
										'<div class="popover popover-degerlendirme popover-degerlendir-'+value.Id+'">\n' +
										'<div class="popover-inner">\n' +
										'<form action="" method="POST" id="" class="DegerlendirmeFormNotify">' +
										'<input type="hidden" name="UrunID_Degerlendirme" value="128">' +
										'<input type="hidden" name="UrunID_Product" value="1248">' +
										'<input type="hidden" name="UrunID_ProductCategory" value="128">' +
										'<p><b>ÃœrÃ¼n DeÄŸerlendirme</b><br>GerÃ§ekleÅŸtirmiÅŸ olduÄŸunuz bu satÄ±n alma iÅŸlemini diÄŸer kullanÄ±cÄ±lara tavsiye edermisiniz? Bu satÄ±n alma iÅŸleminden ne kadar memnun kaldÄ±nÄ±z?</p>\n' +
										'<b>Memnuniyet:</b><p class="float-right" id="Memnuniyet_Puan_'+value.Id+'"><b>1</b><small> / 10</small></p><br>' +
										'<input type="range" min="1" max="10" value="10" class="slider" data-id="'+value.Id+'" name="Memnuniyet">' +
										'<br><b>Yorumunuz:</b><br>' +
										'<textarea name="Yorum" class="form-control" maxlength="150" required=""></textarea><br>' +
										'<button type="submit" class="btn btn-primary btn-block">DeÄŸerlendirmeyi GÃ¶nder</button>' +
										'</form>' +
										'</div>\n' +
										'</div>' +
										'';
								}
							});

							if(typeof data.datas === "undefined")
							{
								htmlData += '' +
									'<div class="card">' +
									'<div class="card-content card-content-padding">' +
									'<center>' +
									'<img src="https://cdn.itemsatis.com/global/icons/favoriteList.svg" width="80" class="mb-1"/>' +
									'<h4>SatÄ±n alma bulunamadÄ±.</h3>' +
									'<p>Åuana kadar hiÃ§bir Ã¼rÃ¼n satÄ±n almadÄ±nÄ±z.</p>' +
									'</center>' +
									'</div>' +
									'</div>';
							}

							$(".PurchasesList").html(htmlData);
						}
					});

					$(document).on("click","input.valueInput",function(){
						if($(this).prop("type") == "text")
							$(this).prop("type", "password");
						else
							$(this).prop("type", "text");
					});

					$(document).on("change start slide input","input[type=range]",function(){
						var name = $(this).attr("name");
						var id = $(this).data("id");
						var value = $(this).val();

						document.getElementById(name + "_Puan_" + id).innerHTML = "<b>" +value + "</b><small> / 10</small>";
					});

					$(document).on("submit",".DegerlendirmeFormNotify",function (event) {
						event.preventDefault();
						myApp.preloader.show();
						$.ajax({
							type: 'POST',
							url: API + 'api/productReviewPost',
							data: $(this).serialize(),
							success: function (data) {
								data = JSON.parse(data);
								myApp.preloader.hide();
								if (data.success === false) {
									Swal.fire({
										title: 'Hata!',
										html: data.message,
										type: 'error',
										confirmButtonText: 'Tamam'
									});
								}
								if (data.success === true) {
									Swal.fire({
										title: 'BaÅŸarÄ±lÄ±!',
										html: data.message,
										type: 'success',
										confirmButtonText: 'Tamam'
									}).then((result) => {
										if (result.value) {
											location.reload(true);
										}
									});

								}
							}
						});
					});
				}
			}
		},
		/* My Purchase Posts */
		{
			name: 'mypurchaseposts',
			path: '/mypurchaseposts/',
			url: AppHome + 'html/mypurchaseposts.php',
			on: {
				pageMounted: function test (e, page) {
					if(storage.getItem("token") == null)
						requiredLogin();
				},
				pageInit: function () {
					if(storage.getItem("token") == null)
						myApp.views.main.router.navigate({ name: 'login' });

					myApp.preloader.show();
					$.ajax({
						type: 'POST',
						url: API + 'api/getMyPurchasePosts',
						data: "",
						success: function (data) {
							data = JSON.parse(data);
							myApp.preloader.hide();
							var htmlData = "";
							$.each( data.datas , function( key, value ) {
								console.log(value);
								htmlData += '' +
									'<div class="card">' +
									'<div class="card-content card-content-padding">' +
									'<div class="PostHeaderPurchase" data-toggle="collapse" data-target="#Detail_'+value.Id+'">' +
									'<img src="'+value.Url+'" class="AdvertImage"/>' +
									'<span class="AdvertDate">' + value.Datetime + '</span> ' +
									'<span class="AdvertState">' + value.StateText + '</span> ' +
									'<button class="collapse-btn"><i class="icon ion-ios-arrow-down"></i></button>' +
									'</div>\n' +
									'<div id="Detail_'+value.Id+'" class="collapse">' +
									'<div class="satici-panel-mini">\n' +
									'<img src="'+value.Avatar+'">\n' +
									'<span class="satici-adi">'+value.UserName+'</span>\n' +
									'<span class="satici-oran-resim"><span class="satici-gercek-oran-resim" style="width:'+value.Positive+'%;"></span></span>\n' +
									'<span class="satici-oran">'+value.Positive+'%</span>\n' +
									'</div>' +
									'<a href="/post/'+value.AdvertId+'/" class="btn btn-primary btn-block">Ä°lan detaylarÄ±nÄ± gÃ¶r</a>' +
									'<a onclick="startChat(\''+value.saticiID+'\',\''+value.UserName+'\',\''+value.Avatar+'\',\''+value.chatID+'\')" class="btn btn-primary btn-block">SatÄ±cÄ±ya mesaj gÃ¶nder</a>' +
									'<a data-href="35" class="btn btn-default btn-block popupPage">Mesafeli satÄ±ÅŸ sÃ¶zleÅŸmesi</a>'+
									'<div class="timeline">';

								$.each( value.Logs , function( keyLog, valueLog ) {
									htmlData += '' +
										'<div class="timeline-item">' +
										'<div class="timeline-item-date"><img src="'+valueLog.Image+'"/></div>' +
										'<div class="timeline-item-divider"></div>' +
										'<div class="timeline-item-content">' +
										'<div class="timeline-item-time">'+valueLog.Datetime+'</div>' +
										'<div class="timeline-item-title"><b>'+valueLog.State+'</b></div>' +
										'<div class="timeline-item-text">'+valueLog.Text+'</div>' +
										'</div>' +
										'</div>';
								});

								htmlData += ''+
									'</div>' +
									'</div>' +
									'</div>' +
									'</div>';
							});

							$(".PurchasePostsList").html(htmlData);
						}
					});
				}
			}
		},
		/* Support */
		{
			name: 'support',
			path: '/support/',
			url: AppHome + 'html/support.php',
			on: {
				pageMounted: function test (e, page) {
					if(storage.getItem("token") == null)
						requiredLogin();
				},
				pageInit: function () {
					if(storage.getItem("token") == null)
						myApp.views.main.router.navigate({ name: 'login' });

					$.ajax({
						type: 'POST',
						url: API + 'api/getTickets',
						data: "",
						success: function (data) {
							data = JSON.parse(data);

							var htmlData = '<div class="list media-list"><ul>';
							$.each( data.datas , function( key, value ) {
								htmlData += '' +
									'<li>\n' +
									'<a href="/supportdetail/'+value.Id+'/" class="item-link item-content">\n' +
									'<div class="item-media"><img src="https://cdn.itemsatis.com/global/icons/ticket'+value.State+'.svg" width="44"></div>\n' +
									'<div class="item-inner">\n' +
									'<div class="item-title-row">\n' +
									'<div class="item-title"><b>' + value.Title + '</b></div>\n' +
									'</div>\n' +
									'<div class="item-subtitle">' + value.StateText + '</div>\n' +
									'</div>\n' +
									'</a>\n' +
									'</li>';
							});
							htmlData += '</ul></div>';

							if(typeof data.datas === "undefined")
							{
								htmlData = '' +
									'<div class="col-100 mt-2">' +
									'<center>' +
									'<img src="https://cdn.itemsatis.com/global/icons/favoriteList.svg" width="80" class="mb-1"/>' +
									'<h4>Destek talebi bulunamadÄ±.</h3>' +
									'<p>ÃœyeliÄŸinize kayÄ±tlÄ± oluÅŸturulmuÅŸ bir destek talebi bulunamadÄ±.</p>' +
									'</center>' +
									'</div>';
							}

							$(".ticketDatas").html(htmlData);


						}
					});
				}
			}
		},
		/* Support Detail */
		{
			path: '/supportdetail/:id/',
			url: AppHome + 'html/supportdetail.php',
			on: {
				pageMounted: function test (e, page) {
					if(storage.getItem("token") == null)
						requiredLogin();
				},
				pageInit: function () {
					if(storage.getItem("token") == null)
						myApp.views.main.router.navigate({ name: 'login' });

					var ticketID = 0;
					myApp.preloader.show();
					var ticketID = myApp.views.main.router.currentRoute.params.id;

					$.ajax({
						type: "POST",
						url: API + "api/getTicketDetails",
						data: "Id=" + ticketID, // serializes the form's elements.
						success: function (data) {
							var data = JSON.parse(data);
							ticketID = data.details.Id;
							var htmlData = "";
							htmlData += '' +
								'<div class="list">\n' +
								'<ul>\n' +
								'<li>\n' +
								'<div class="item-content">\n' +
								'<div class="item-inner">\n' +
								'<div class="item-title">\n' +
								'<div class="item-header">Talep BaÅŸlÄ±ÄŸÄ±</div>'+ data.details.Title +
								'</div>\n' +
								'</div>\n' +
								'</div>\n' +
								'</li>\n' +
								'<li>\n' +
								'<div class="item-content">\n' +
								'<div class="item-inner">\n' +
								'<div class="item-title">\n' +
								'<div class="item-header">Talep Kategorisi</div>'+ data.details.Name +
								'</div>\n' +
								'</div>\n' +
								'</div>\n' +
								'</li>\n' +
								'<li>\n' +
								'<div class="item-content">\n' +
								'<div class="item-inner">\n' +
								'<div class="item-title">\n' +
								'<div class="item-header">OluÅŸturma Tarihi</div>'+ data.details.CreatedDatetime +
								'</div>\n' +
								'</div>\n' +
								'</div>\n' +
								'</li>\n' +
								'</ul>\n' +
								'</div>';

							$(".ticketDatas").html(htmlData);

							var htmlData = '';
							$.each( data.messages , function( key, value ) {
								htmlData += '' +
									'<div class="card demo-facebook-card">\n' +
									'<div class="card-header">\n' +
									'<div class="demo-facebook-avatar"><img src="'+ value.Avatar +'" width="40" height="40"></div>\n' +
									'<div class="demo-facebook-name">'+ value.UserName +'</div>\n' +
									'<div class="demo-facebook-date">'+ value.Datetime +'</div>\n' +
									'</div>\n' +
									'<div class="card-content card-content-padding">\n' +
									'<p>'+ value.Message +'</p>';

								$.each( value.images , function( keyimage, valueimage ) {
									htmlData += '<img src="'+valueimage.Image+'" class="TicketImage"/>';
								});

								htmlData += '' +
									'</div>\n' +
									'</div>';
							});

							if(data.details.State != "3")
							{
								htmlData += '' +
									'<div class="card">\n' +
									'<div class="card-content card-content-padding ticketDatas">\n' +
									'<form id="replyForm" action="" method="POST" enctype="multipart/form-data">' +
									'<div class="list no-hairlines-md">' +
									'<ul>' +

									'<li class="item-content item-input">\n' +
									'<div class="item-inner">\n' +
									'<div class="item-title item-label">MesajÄ±nÄ±z</div>\n' +
									'<div class="item-input-wrap">\n' +
									'<textarea name="message" placeholder="MesajÄ±nÄ±zÄ± yazÄ±nÄ±z.." class=""></textarea>\n' +
									'</div>\n' +
									'</div>\n' +
									'</li>' +

									'</ul>' +
									'</div>' +
									'<div class="ticket-buttons">\n' +
									'<div class="previewImage"></div>\n' +
									'<input id="ticketImages" name="ticketImages" type="file" accept="image/*" multiple="" style="display:none;">\n' +
									'<button type="button" class="btn btn-default pull-left btnAttachment" data-inverted="" data-tooltip="MesajÄ±nÄ±za ek olarak gÃ¶rsel gÃ¶nderebilirsiniz." data-position="top left">Ek GÃ¶nder\n' +
									'</button>\n' +
									'<button type="button" class="btn btn-primary pull-right sendReply">MesajÄ± GÃ¶nder\n' +
									'</button>\n' +
									'</div>\n' +
									'</form>\n' +
									'</div>\n' +
									'</div>';
							}


							$(".messageList").html(htmlData);

							myApp.preloader.hide();

						}
					});


					$(document).on('click',"img.TicketImage", function () {
						var myPhotoBrowserStandalone = myApp.photoBrowser.create({
							photos : [$(this).attr("src")]
						});
						myPhotoBrowserStandalone.open();
					});

					$(document).on("click",".btnAttachment",function () {
						$('#ticketImages').trigger('click');
					});

					var imagesPreview = function(input, placeToInsertImagePreview) {

						if (input.files) {
							var filesAmount = input.files.length;
							$$("div.previewImage").html(" ");

							for (i = 0; i < filesAmount; i++) {
								var reader = new FileReader();

								reader.onload = function(event) {
									$($.parseHTML('<img>')).attr('src', event.target.result).appendTo(placeToInsertImagePreview);
								}

								reader.readAsDataURL(input.files[i]);
							}
						}

					};

					$(document).on("change","#ticketImages",function() {
						if ($("#ticketImages")[0].files.length > 5) {
							alert("En fazla 5 adet resim ekleyebilirsiniz.");
							$("div.previewImage").html(" ");
							$(".btnAttachment").text("Ek GÃ¶nder");
						}
						else {
							var seciliResim = $("#ticketImages")[0].files.length;
							$(".btnAttachment").text(seciliResim + " adet resim seÃ§ildi (deÄŸiÅŸtirmek iÃ§in tÄ±klayÄ±nÄ±z)");
							imagesPreview(this, 'div.previewImage');
						}

					});

					$(document).on("click",".sendReply",function(){
						var thisBtn = this;
						if($("textarea[name=message]").val().length < 2)
						{
							Swal.fire({
								type: 'warning',
								title: 'Bilgilendirme!',
								html: "LÃ¼tfen mesaj iÃ§eriÄŸini boÅŸ bÄ±rakmayÄ±nÄ±z.",
								confirmButtonText: "Tamam"
							});
							return;
						}

						$(thisBtn).prop("disabled",true);
						var formData = new FormData($('#replyForm')[0]);
						formData.append("ticketID",ticketID);

						var ins = document.getElementById('ticketImages').files.length;
						for (var x = 0; x < ins; x++) {
							formData.append("ticketImages[]", document.getElementById('ticketImages').files[x]);
						}

						myApp.preloader.show();

						$.ajax({
							type: "POST",
							url: API + "api/replyTicket",
							processData: false,
							cache: false,
							contentType: false,
							data: formData, // serializes the form's elements.
							success: function (data) {
								$(thisBtn).prop("disabled",false);
								var data = JSON.parse(data);
								myApp.preloader.hide();
								if(data.success == false)
								{
									Swal.fire({
										type: 'warning',
										title: 'Bilgilendirme!',
										html: data.message,
										confirmButtonText: "Tamam"
									});
								}
								else
								{
									Swal.fire({
										type: 'success',
										title: 'BaÅŸarÄ±lÄ±',
										html: "YazdÄ±ÄŸÄ±nÄ±z cevap talebinize eklendi.",
										confirmButtonText: "Tamam"
									});
									location.reload();
								}
							}
						});
					});
				}
			}
		},
		/* Add Post */
		{
			name: 'addpost',
			path: '/addpost/',
			url: AppHome + 'html/addpost.php',
			on: {
				pageMounted: function test (e, page) {
					if(storage.getItem("token") == null)
						requiredLogin();
				},
				pageInit: function () {
					if(storage.getItem("token") != null) {

						myApp.preloader.show();
						$.post(API + 'api/getCategory', "Id=0", function (data) {
							var items = [];
							var data = JSON.parse(data);
							var htmlData = '<option value="0" selected disabled>LÃ¼tfen seÃ§im yapÄ±nÄ±z.</option>';
							console.log(data);
							$.each(data.results, function (key, value) {
								htmlData += '<option value="' + value.value + '">' + value.text + '</option>';
							});
							$("select[name=category_1]").html(htmlData);
							myApp.preloader.hide();
						});

						$(".step-btn").on("click", function () {
							categoryBreadcumb();

							var step = $(this).data("step");
							console.log(step);
							$(".steps .step").removeClass("active");
							$(".step-" + step).addClass("active");

							$(".step-area").css("display", "none");
							$(".step-area-" + step).fadeIn();
						});

						$("body").on("click", ".image-post-delete", function (e) {
							var dataID = $(this).data("id");
							$(".image-post-detail[data-id=" + dataID + "]").fadeIn();
							$(".image-post-detail[data-id=" + dataID + "]").remove();
						});

						$("body").on("change", ".post-file-upload", function (e) {

							var randomID = makeRandom(10);
							var dataID = $(this).data("id");

							var reader = new FileReader();
							reader.onload = function () {
								$(".image-post-detail img[data-id=" + dataID + "]").prop("src", reader.result);
							};
							reader.readAsDataURL(e.target.files[0]);
							//console.log(this.target);

							$(this).removeClass("post-file-upload");
							$(".image-post-detail[data-id=" + dataID + "]").removeClass("active");
							$(".images-post").append('<div class="image-post-detail active" data-id="' + randomID + '"><input type="radio" name="gender" value="' + randomID + '"><span class="image-post-delete" data-id="' + randomID + '"><i class="icon ion-md-close"></i></span> <img src="" data-id="' + randomID + '"/> <input type="file" data-id="' + randomID + '" name="Images[]" accept="image/*" class="post-file-upload"/> </div>');

						});

						$(".finish-btn").on("click", function (event) {
							event.preventDefault();

							/*
                            var html = document.querySelector(".ql-editor").innerHTML
                            document.querySelector("#IcerikInput").value = html;
                            */

							var form = $('#postForm')[0];
							var data = new FormData(form);
							var thisBtn = this;
							$(this).prop("disabled", true);

							Swal.fire({
								type: 'warning',
								title: 'Bekleyiniz.',
								html: "Ä°lanÄ±nÄ±z oluÅŸturuluyor lÃ¼tfen bekleyiniz.",
								showCancelButton: false,
								showConfirmButton: false,
								showCancelButton: false,
								allowOutsideClick: false,
								allowEscapeKey: false
							});

							$.ajax({
								type: "POST",
								enctype: 'multipart/form-data',
								url: API + "api/AddPost",
								data: data,
								processData: false,
								contentType: false,
								cache: false,
								timeout: 600000,
								success: function (data) {
									$(thisBtn).prop("disabled", false);

									data = JSON.parse(data);
									if (data.success) {
										Swal.fire({
											type: 'success',
											width: '50em',
											title: 'Ä°lan kuruldu!',
											html: data.message,
											showCancelButton: false,
											confirmButtonText: '<i class=\"fas fa-eye\"></i>&nbsp; Ä°lanÄ± GÃ¶rÃ¼ntÃ¼le',
											reverseButtons: true,
										}).then((result) => {
											if (result.value)
												myApp.views.main.router.navigate("/post/"+data.postid+"/");
										});
									} else {
										Swal.fire({
											type: "warning",
											title: 'ÃœzgÃ¼nÃ¼z..',
											confirmButtonText: "AnladÄ±m",
											html: data.message
										});

										$(".step-2-btn").trigger("click");
									}


								},
								error: function (e) {
									console.log("ERROR : ", e);
									$(thisBtn).prop("disabled", false);
								}
							});
						});
					}
				}
			}
		},
		/* Edit Post */
		{
			name: 'editpost',
			path: '/editpost/:id/',
			url: AppHome + 'html/editpost.php',
			on: {
				pageMounted: function test (e, page) {
					if(storage.getItem("token") == null)
						requiredLogin();
				},
				pageInit: function () {
					if(storage.getItem("token") != null) {

						var arrDeleted = [];
						myApp.preloader.show();
						var postID = myApp.views.main.router.currentRoute.params.id;
						$.ajax({
							type: 'POST',
							url: API + 'api/getEditPost',
							data: "Id=" + postID,
							success: function (data) {
								var data = JSON.parse(data);
								if(data.success == false)
								{
									Swal.fire({
										type: 'warning',
										title: 'Bilgilendirme!',
										html: data.message,
										confirmButtonText: "Tamam"
									});
								}
								else
								{
									$("#postForm").prepend('<input type="hidden" name="postID" value="'+postID+'"/>');
									$(".step-area-1 .list ul").html("");
									$.each( data.active_categories , function( key, value ) {
										DataCategory[value.Id] = value.Name;
									});

									$.each( data.categorylist , function( key, value ) {
										$(".step-area-1 .list ul").append(value);
									});

									$(".step-area-1 .list ul").append(data.typedata);

									$("input[name=IlanBasligi]").val(data.datas.Title);
									$("textarea[name=IlanIcerigi]").val(data.datas.Description);
									$("input[name=IlanUcreti]").val(data.datas.Price);
									$("input[name=IlanTeslimati]").val(data.datas.Delivery);
									$(".ui.breadcrumb.categoryBreadcrumb").html(data.datas.breadcrumb);

									$(".images-post").html(data.imagedatas);

									if(data.Featured == true)
									{
										$("#OneCikartma").html("<span class='DopingVar'>Bu ilan <b>"+data.FeaturedDate+"</b> tarihine kadar Ã¶ne Ã§Ä±kartÄ±lmÄ±ÅŸtÄ±r.</span>");
									}
									if(data.Pinned == true)
									{
										$("#VitrinIlani").html("<span class='DopingVar'>Bu ilan <b>"+data.PinnedDate+"</b> tarihine kadar Ã¶ne Ã§Ä±kartÄ±lmÄ±ÅŸtÄ±r.</span>");
									}
								}
							}
						});

						$(".step-btn").on("click", function () {
							categoryBreadcumb();

							var step = $(this).data("step");
							console.log(step);
							$(".steps .step").removeClass("active");
							$(".step-" + step).addClass("active");

							$(".step-area").css("display", "none");
							$(".step-area-" + step).fadeIn();
						});

						$("body").on("click", ".image-post-delete", function (e) {
							var dataID = $(this).data("id");
							arrDeleted.push(dataID);
							$(".image-post-detail[data-id=" + dataID + "]").fadeIn();
							$(".image-post-detail[data-id=" + dataID + "]").remove();
						});

						$("body").on("change", ".post-file-upload", function (e) {

							var randomID = makeRandom(10);
							var dataID = $(this).data("id");

							var reader = new FileReader();
							reader.onload = function () {
								$(".image-post-detail img[data-id=" + dataID + "]").prop("src", reader.result);
							};
							reader.readAsDataURL(e.target.files[0]);
							//console.log(this.target);

							$(this).removeClass("post-file-upload");
							$(".image-post-detail[data-id=" + dataID + "]").removeClass("active");
							$(".images-post").append('<div class="image-post-detail active" data-id="' + randomID + '"><input type="radio" name="gender" value="' + randomID + '"><span class="image-post-delete" data-id="' + randomID + '"><i class="icon ion-md-close"></i></span> <img src="" data-id="' + randomID + '"/> <input type="file" data-id="' + randomID + '" name="Images[]" accept="image/*" class="post-file-upload"/> </div>');

						});

						$(".finish-btn").on("click", function (event) {
							event.preventDefault();

							/*
                            var html = document.querySelector(".ql-editor").innerHTML
                            document.querySelector("#IcerikInput").value = html;
                            */

							var form = $('#postForm')[0];
							var data = new FormData(form);
							var deletedImagesArr = arrDeleted.join("<#>");
							data.append ('deletedImages', deletedImagesArr);
							var thisBtn = this;
							$(this).prop("disabled", true);

							Swal.fire({
								type: 'warning',
								title: 'Bekleyiniz.',
								html: "Ä°lanÄ±nÄ±z gÃ¼ncelleniyor lÃ¼tfen bekleyiniz.",
								showCancelButton: false,
								showConfirmButton: false,
								showCancelButton: false,
								allowOutsideClick: false,
								allowEscapeKey: false
							});

							$.ajax({
								type: "POST",
								enctype: 'multipart/form-data',
								url: API + "api/EditPost",
								data: data,
								processData: false,
								contentType: false,
								cache: false,
								timeout: 600000,
								success: function (data) {
									$(thisBtn).prop("disabled", false);

									data = JSON.parse(data);
									if (data.success) {
										Swal.fire({
											type: 'success',
											width: '50em',
											title: 'Ä°lan gÃ¼ncellendi!',
											html: data.message,
											showCancelButton: false,
											confirmButtonText: '<i class=\"fas fa-eye\"></i>&nbsp; Ä°lanÄ± GÃ¶rÃ¼ntÃ¼le',
											reverseButtons: true,
										}).then((result) => {
											if (result.value)
												myApp.views.main.router.navigate("/post/"+postID+"/");
										});
									} else {
										Swal.fire({
											type: "warning",
											title: 'ÃœzgÃ¼nÃ¼z..',
											confirmButtonText: "AnladÄ±m",
											html: data.message
										});

										$(".step-2-btn").trigger("click");
									}


								},
								error: function (e) {
									console.log("ERROR : ", e);
									$(thisBtn).prop("disabled", false);
								}
							});
						});
					}
				}
			}
		},
		/* Profile Detail */
		{
			name: "profiledetail",
			path: '/profile/:id/',
			url: AppHome + 'html/profile.php',
			on: {
				pageInit: function () {
					$("#pageContent").css("display","none");
					myApp.preloader.show();
					var profileID = myApp.views.main.router.currentRoute.params.id;

					$.ajax({
						type: "POST",
						url: API + "api/getProfileDatas",
						data: "Id=" + profileID, // serializes the form's elements.
						success: function (data) {
							var data = JSON.parse(data);
							var htmlData = "";

							if(data.success == true)
							{
								$$("#pageContent .profileDetail .profileBox .image .avatar").attr("src",data.userdatas.Avatar);
								$$("#pageContent .profileDetail .profileBox .info strong").text(data.userdatas.UserName);
								$$("#pageContent .profileDetail .profileBox .info .text-muted").html(data.userdatas.LastLogin + " aktifti");
								$$("#pageContent .profileDetail .bio").html(data.userdatas.Bio);
								$$("#pageContent .stats .row").html('<div class="col-6">Ä°lan<strong>'+data.IlanSayisi+'</strong></div>' +
									'<div class="col-6">TakipÃ§i<strong>'+data.AboneSayisi+'</strong></div>');

								$$("#pageContent .btnChat").attr("onclick","startChat('"+data.userdatas.Id+"','"+data.userdatas.UserName+"','"+data.userdatas.Avatar+"','"+data.ChatId+"')");

								if(data.itsMe == true)
								{
									$$("#pageContent .buttonsList").css("display","none"); // Sonradan kaldÄ±rÄ±lacak.
									$$("#pageContent .buttonsList").html('<div class="col-12"><a href="/editprofile/" class="btn btn-primary btn-sm btn-block"><i class="icon ion-ios-create"></i>Profilini DÃ¼zenle</a></div>');
								}
								else
								{
									if(data.Followed == "0")
									{
										$$("#pageContent .btnTakip").addClass("btn-follow");
										$("#pageContent .btnTakip").data("id",data.userdatas.Id);
										$$("#pageContent .btnTakip").html('<i class="icon ion-ios-add"></i> Takip Et');
									}
									else
									{
										$$("#pageContent .btnTakip").addClass("btn-unfollow");
										$("#pageContent .btnTakip").data("id",data.userdatas.Id);
										$$("#pageContent .btnTakip").html('<i class="icon ion-ios-remove"></i> Takibi BÄ±rak');
									}

								}

								$(".ratingPanel .p1").text(data.ReviewData.P1);
								$(".ratingPanel .p2").text(data.ReviewData.P2);
								$(".ratingPanel .p3").text(data.ReviewData.P3);
								$(".ratingPanel .p4").text(data.ReviewData.P4);

								var htmlData = '<div class="comments">';
								$.each( data.ReviewsDatas , function( key, value ) {
									htmlData += '' +
										'<div class="item">\n' +
										'<div class="image">\n' +
										'<a href="/profile/' + value.UserId + '/"><img src="' + CONST_AVATAR_URL + value.Avatar + '" alt="avatar" class="avatar"></a>\n' +
										'</div>\n' +
										'<div class="content">\n' +
										'<a href="/profile/' + value.UserId + '/"><strong>' + value.UserName + '</strong></a>\n' +
										'<div class="text">' + value.Message + '</div>\n' +
										'<footer>' + value.Datetime + '</footer>\n' +
										'<footer>' +
										'<span class="badge badge-outline-secondary mb-1">GÃ¼ven: ' + value.P1 + '</span>' +
										'<span class="badge badge-outline-secondary mb-1">Memnu..: ' + value.P2 + '</span>' +
										'<span class="badge badge-outline-secondary mb-1">Ä°letiÅŸim: ' + value.P3 + '</span>' +
										'<span class="badge badge-outline-secondary mb-1">Teslimat: ' + value.P4 + '</span>' +
										'</footer>\n' +
										'</div>\n' +
										'</div>';
								});
								htmlData += '</div>';
								$$("#sellerRatings").html(htmlData);

								var htmlData = "";
								$.each( data.Posts , function( key, value ) {
									htmlData += '' +
										'<div class="col-6 postBox">' +
										'<a href="/post/'+value.Id+'/" class="postItem routerLink">' +
										'<div class="imageWrapper">' +
										'<img src="' + value.Image + '" alt="image" class="image">' +
										'</div>' +
										'<h2 class="title">' + value.Title + '</h2>' +
										'<footer>' + value.Price + ' â‚º</footer>' +
										'</a>' +
										'</div>';
								});
								$(".BenzerIlanlar").html(htmlData);

								var htmlData = "";
								console.log(data.userdatas.Facebook);
								if(data.userdatas.Facebook != null && typeof data.userdatas.Facebook != "undefined" && data.userdatas.Facebook.length > 3)
								{
									htmlData += '<a href="#" class="listItem">\n' +
										'<div class="image">\n' +
										'<div class="iconBox bg-facebook"><i class="icon ion-logo-facebook"></i></div>\n' +
										'</div>\n' +
										'<div class="text"><div><strong>'+data.userdatas.Facebook+'</strong></div></div>\n' +
										'</a>';
								}
								if(data.userdatas.Facebook != null && typeof data.userdatas.Twitter != "undefined" && data.userdatas.Twitter.length > 3)
								{
									htmlData += '<a href="#" class="listItem">\n' +
										'<div class="image">\n' +
										'<div class="iconBox bg-twitter"><i class="icon ion-logo-twitter"></i></div>\n' +
										'</div>\n' +
										'<div class="text"><div><strong>'+data.userdatas.Twitter+'</strong></div></div>\n' +
										'</a>';
								}
								if(data.userdatas.Facebook != null && typeof data.userdatas.Discord != "undefined" && data.userdatas.Discord.length > 3)
								{
									htmlData += '<a href="#" class="listItem">\n' +
										'<div class="image">\n' +
										'<div class="iconBox bg-discord"><img src="https://cdn.itemsatis.com/global/icons/discord-brands-white.svg" style="width: 20px;height: 20px;"/></div>\n' +
										'</div>\n' +
										'<div class="text"><div><strong>'+data.userdatas.Discord+'</strong></div></div>\n' +
										'</a>';
								}
								if(data.userdatas.Facebook != null && typeof data.userdatas.Instagram != "undefined" && data.userdatas.Instagram.length > 3)
								{
									htmlData += '<a href="#" class="listItem">\n' +
										'<div class="image">\n' +
										'<div class="iconBox bg-instagram"><i class="icon ion-logo-instagram"></i></div>\n' +
										'</div>\n' +
										'<div class="text"><div><strong>'+data.userdatas.Instagram+'</strong></div></div>\n' +
										'</a>';
								}
								if(data.userdatas.Facebook != null && typeof data.userdatas.Skype != "undefined" && data.userdatas.Skype.length > 3)
								{
									htmlData += '<a href="#" class="listItem">\n' +
										'<div class="image">\n' +
										'<div class="iconBox bg-skype"><i class="icon ion-logo-skype"></i></div>\n' +
										'</div>\n' +
										'<div class="text"><div><strong>'+data.userdatas.Skype+'</strong></div></div>\n' +
										'</a>';
								}
								if(data.userdatas.Facebook != null && typeof data.userdatas.Youtube != "undefined" && data.userdatas.Youtube.length > 3)
								{
									htmlData += '<a href="#" class="listItem">\n' +
										'<div class="image">\n' +
										'<div class="iconBox bg-youtube"><i class="icon ion-logo-youtube"></i></div>\n' +
										'</div>\n' +
										'<div class="text"><div><strong>'+data.userdatas.Youtube+'</strong></div></div>\n' +
										'</a>';
								}
								if(data.userdatas.Facebook != null && typeof data.userdatas.Twitch != "undefined" && data.userdatas.Twitch.length > 3)
								{
									htmlData += '<a href="#" class="listItem">\n' +
										'<div class="image">\n' +
										'<div class="iconBox bg-twich"><i class="icon ion-logo-twitch"></i></div>\n' +
										'</div>\n' +
										'<div class="text"><div><strong>'+data.userdatas.Twitch+'</strong></div></div>\n' +
										'</a>';
								}

								$(".socialList").html(htmlData);
							}
							else
							{
								htmlData = '<br><center>' +
									'<img src="https://cdn.itemsatis.com/global/icons/user-not-found.png" width="80" class="mb-1"/>' +
									'<h4>Ãœye bulunamadÄ±</h3>' +
									'<p>UlaÅŸmaya Ã§alÄ±ÅŸtÄ±ÄŸÄ±nÄ±z Ã¼ye bulunamadÄ±.</p>' +
									'</center>';
								$("#pageContent").html(htmlData);
							}

							$("#pageContent").fadeIn();
							myApp.preloader.hide();
						}
					});

					$(document).on("click",".btn-follow",function () {
						var userID = $(this).data("id");
						myApp.preloader.show();
						$.ajax({
							type: 'POST',
							url: API + 'api/followUser',
							data: "userID=" + userID,
							success: function (data) {
								myApp.preloader.hide();
								data = JSON.parse(data);
								if (data.success === false) {
									Swal.fire({
										title: 'Hata!',
										html: data.message,
										type: 'error',
										confirmButtonText: 'Tamam'
									});
								}
								if (data.success === true) {
									//startChat(data.datas.Id,data.datas.UserName,data.datas.Avatar,data.datas.chatID);
									$(".btn-follow").html('<i class="fas fa-user-minus"></i> Takibi BÄ±rak');
									$(".btn-follow").addClass("btn-unfollow");
									$(".btn-follow").removeClass("btn-follow");
								}
							}
						});
					});

					$(document).on("click",".btn-unfollow",function () {
						var userID = $(this).data("id");
						Swal.fire({
							title: 'Ä°ÅŸlem onayÄ±',
							html: "KullanÄ±cÄ±yÄ± takipten Ã§Ä±kartmak istediÄŸinize emin misiniz?",
							type: 'warning',
							showCloseButton: true,
							showCancelButton: true,
							confirmButtonText: 'Evet, Ã‡Ä±kart!'
						}).then((result) => {
							if (result.value) {
								myApp.preloader.show();
								$.ajax({
									type: 'POST',
									url: API + 'api/unfollowUser',
									data: "userID=" + userID,
									success: function (data) {
										myApp.preloader.hide();
										data = JSON.parse(data);
										if (data.success === false) {
											Swal.fire({
												title: 'Hata!',
												html: data.message,
												type: 'error',
												confirmButtonText: 'Tamam'
											});
										}
										if (data.success === true) {
											$(".btn-unfollow").html('<i class="fas fa-user-check"></i> Takip Et');
											$(".btn-unfollow").addClass("btn-follow");
											$(".btn-unfollow").removeClass("btn-unfollow");

										}
									}
								});
							}
						});
					});
				}
			}
		},
	]
});
var leftPanel = myApp.panel.create({
	el: '.panel-left',
	swipe: true,
	swipeOnlyClose: true,
	on: {
		opened: function () {
			console.log('Panel opened')
		}
	}
})
var rightPanel = myApp.panel.create({
	el: '.panel-right',
	swipe: false,
	on: {
		opened: function () {
			console.log('Panel opened')
		}
	}
});

var $$ = Dom7;

$$(document).on('backbutton',function(e){
	if (1==2) return false; //do nothing on condition

	if($(".panel-chat").hasClass("modal-in"))
	{
		if($(".panel-chat .chatHeader .left a.icon.goBack").hasClass("goChatList"))
		{
			$(".chatMessagePanel").css("display","none");
			$(".newMessageBtn").css("display","block");
			$(".panel-chat .chatHeader .left a.icon.goBack").removeClass("goChatList");
			$(".panel-chat .appHeader .pageTitle").html("Sohbet");
			$(".appHeader .right").css("display","block");
		}
		else
		{
			myApp.popup.close(".panel-chat", true);
		}
	}
	else
	{
		var view=	myApp.views.current;
		var comp=['actions','popover','picker','sheet','panel'].filter(function(itm){
			if(myApp[itm].get()){
				myApp[itm].close();
				return itm;
			}
		});
		if (!comp.length && view.history.length) {
			view.router.back();
		}
	}
});

$(".closeChatPanel").on("click",function(){
	myApp.panel.close(".panel-chat", true);
});

$(".routerLink a").on("click",function(){
	var RouterData = $(this).data("router");
	storage.setItem("page", RouterData);
	myApp.views.main.router.navigate("/" + RouterData + "/");
});

var app = {
	initialize: function() {
		var token = storage.getItem("token");
		if(storage.getItem("UserName") != null)
		{
			var fcmTokenGlobal = "";
			FirebasePlugin.getToken(function(fcmToken) {
				$.ajax({
					type: "POST",
					url: API + "api/checkLogin",
					data: "token=" + token + "&fcmToken=" + fcmToken, // serializes the form's elements.
					success: function(data)
					{
						data = JSON.parse(data);
						if(data.success == true)
						{
							storage.setItem("token", data.token);
							storage.setItem("SocketToken", data.SocketToken);
							storage.setItem("UserId", data.result.Id);
							storage.setItem("UserName", data.result.UserName);
							storage.setItem("MailAddress", data.result.MailAddress);
							storage.setItem("Avatar", data.result.Avatar);
							storage.setItem("Cover", data.result.Cover);
							storage.setItem("Balance", data.result.Balance);
							storage.setItem("Phone", data.result.Phone);
							storage.setItem("Name", data.result.Name);
							storage.setItem("SurName", data.result.SurName);
							storage.setItem("MailVerify", data.result.MailVerify);
							storage.setItem("PhoneVerify", data.result.PhoneVerify);

							console.log("Link changed");
							$("a.tab-link.routerLink.hesabimLink").attr("href","/controlpanel/");
							$(".notificationButton").fadeIn();

							if(data.result.MailVerify == "0")
							{
								async function newMailMaybe(){
									const { value: UserName } = await Swal.fire({
										title: 'Mail DoÄŸrulama',
										html: "Ä°temsatÄ±ÅŸ'a devam edebilmek iÃ§in mail adresinizi doÄŸrulamanÄ±z gerekmektedir.<br>AÅŸaÄŸÄ±da yer alan kutuya mail adresinizi yazarak devam ediniz.",
										input: 'text',
										allowOutsideClick: false,
										showCloseButton: false,
										showCancelButton: false,
										cancelButtonText: "Ä°ptal",
										confirmButtonText: "Mail adresimi doÄŸrula",
										inputPlaceholder: 'Mail adresinizi giriniz.',
										inputValue: data.result.MailAddress,
										inputValidator: (value) => {
											return new Promise((resolve) => {
												if (!value) {
													resolve('LÃ¼tfen geÃ§erli bir mail adresi giriniz.');
												}

												pageLoading();
												$.ajax({
													type: 'POST',
													url: API + 'api/mailVerifyRequest',
													data: "newMailAddress=" + value,
													success: function (data) {
														pageLoaded();
														data = JSON.parse(data);
														if(data.NewMailRequired === true)
														{
															Swal.fire({
																title: 'Hata!',
																html: data.message,
																type: 'error',
																showCloseButton: true,
																confirmButtonText: 'Tamam'
															}).then((result) => {
																if (result.value) {
																	window.location.href = "index.php?go=Settings#MailDegistir";
																}
															});
															return;
														}
														else if (data.success === false) {
															resolve(data.message);
														}
														else if (data.success === true) {

															async function verifyMail(){
																const { value: UserName } = await Swal.fire({
																	title: 'Mail DoÄŸrulama',
																	html: data.message,
																	input: 'text',
																	allowOutsideClick: false,
																	showCloseButton: false,
																	showCancelButton: false,
																	cancelButtonText: "Ä°ptal",
																	confirmButtonText: "Kodu onayla",
																	inputPlaceholder: '6 Haneli gÃ¼venlik kodunu giriniz.',
																	inputValidator: (value) => {
																		return new Promise((resolve) => {
																			if (!value) {
																				resolve('LÃ¼tfen 6 haneli gÃ¼venlik kodunu giriniz.');
																			}
																			if (value.length != 6) {
																				resolve('LÃ¼tfen 6 haneli gÃ¼venlik kodunu giriniz.');
																			}

																			pageLoading();
																			$.ajax({
																				type: 'POST',
																				url: API + 'api/mailVerifyRequest',
																				data: "mailCode=" + value,
																				success: function (data) {
																					pageLoaded();
																					data = JSON.parse(data);
																					if (data.success === false) {
																						resolve(data.message);
																					}
																					if (data.success === true) {
																						Swal.fire({
																							title: 'BaÅŸarÄ±lÄ±!',
																							html: data.message,
																							showCloseButton: true,
																							type: 'success',
																							confirmButtonText: 'Tamam'
																						});
																						setTimeout(function(){ location.reload(true); }, 3000);
																					}
																				}
																			});
																		});
																	},
																	customClass: {
																		container: 'container-class special-message',
																	}
																});
															}
															verifyMail();
														}
													}
												});
											});
										},
										customClass: {
											container: 'container-class special-message',
										}
									});
								}
								newMailMaybe();
							}
						}
						else
						{
							myApp.dialog.alert(data.message);

							storage.removeItem("token");
							storage.removeItem("SocketToken");
							storage.removeItem("UserName");
						}
					}
				});
			}, function(error) {
				$.ajax({
					type: "POST",
					url: API + "api/checkLogin",
					data: "token=" + token + "&fcmToken=BOS", // serializes the form's elements.
					success: function(data)
					{
						data = JSON.parse(data);
						if(data.success == true)
						{
							storage.setItem("token", data.token);
							storage.setItem("SocketToken", data.SocketToken);
							storage.setItem("UserId", data.result.Id);
							storage.setItem("UserName", data.result.UserName);
							storage.setItem("MailAddress", data.result.MailAddress);
							storage.setItem("Avatar", data.result.Avatar);
							storage.setItem("Cover", data.result.Cover);
							storage.setItem("Balance", data.result.Balance);
							storage.setItem("Phone", data.result.Phone);
							storage.setItem("Name", data.result.Name);
							storage.setItem("SurName", data.result.SurName);
							storage.setItem("PhoneVerify", data.result.PhoneVerify);

							console.log("Link changed");
							$("a.tab-link.routerLink.hesabimLink").attr("href","/controlpanel/");
							$(".notificationButton").fadeIn();
						}
						else
						{
							storage.removeItem("token");
							storage.removeItem("SocketToken");
							storage.removeItem("UserName");
						}
					}
				});
			});
		}
		console.log("App initialize");
		myApp.views.main.router.navigate("/home/");
		if(device.platform == "iOS")
		{
			myApp.dialog.alert('App Store politikalarÄ± nedeniyle uygulamada herhangi bir satÄ±n alma iÅŸlemi yapÄ±lamamaktadÄ±r.');
		}
	},
};

$(".appBottomMenu .item").on("click",function(){
	$(".appBottomMenu .item").removeClass("active");
	$(this).addClass("active");
});

$$(document).on('page:mounted', function (e) {
	myApp.preloader.show();
	if(storage.getItem("UserName") == null)
		$(".notificationButton").css("display","none");
	else
		$(".notificationButton").css("display","block");
});

$$(document).on('page:afterin', function (e) {
	myApp.preloader.hide();
});

$$(document).on('page:init', function (e) {
	// console.log("page:init");
	myApp.preloader.hide();
});

function startChat(UserId,UserName,Avatar,ChatID)
{
	if(storage.getItem("PhoneVerify") == "0")
	{
		myApp.dialog.alert('Telefon numaranÄ±z doÄŸrulanmadan sohbet penceresi gÃ¶rÃ¼ntÃ¼lenemez.');
	}
	else
	{
		if($(".rightMessages .userListMessage").length)
		{
			if(myDatas.userID == UserId)
				return;

			if($(".rightMessages .userListMessage .chat-user-" + UserId).length)
				$(".rightMessages .userListMessage .chat-user-" + UserId).trigger("click");
			else
			{
				$(".rightMessages .userListMessage").prepend('<li class="chat-user-' + UserId + '" data-username="' + UserName + '" data-avatar="' + Avatar + '" data-chat-id="' + ChatID + '" data-id="' + UserId + '">\n' +
					'<img data-tooltip="' + UserName + '" data-position="left center" src="' + Avatar + '">\n' +
					'<span class="chat-username">' + UserName + '</span>\n' +
					'<span class="chat-message"></span>\n' +
					'<span class="chat-message-time"></span>\n' +
					'</li>');
				$(".rightMessages .userListMessage .chat-user-" + UserId).trigger("click");
			}

			$("#chatPageButton").trigger("click");
			//chatPanel.open(true);
			myApp.popup.open(".popup-chat", true);
		}
	}
}

function layerCategoryChange(inputdata)
{
	$(".step-2-btn").prop("disabled",true);
	var layerID = $(inputdata).data("layer");
	var layerIDPlus = layerID + 1;
	var selectedValue = $(inputdata).children("option:selected").val();

	if(layerID == 1)
		DataCategory = [];

	DataCategory[layerID] = $(inputdata).children("option:selected").text();


	for(var fakeID = layerID + 1;fakeID < 10;fakeID++)
	{
		$("[data-category-layer="+fakeID+"]").remove();
	}

	$.post(API + 'api/getCategory', "Id=" + selectedValue,function( data ) {
		var items = [];
		var data = JSON.parse(data);
		if(data.success == true)
		{
			$("[data-category-layer="+layerID+"]").after('' +
				'<li class="category_'+layerIDPlus+'" data-category-layer="'+layerIDPlus+'">\n' +
				'<a class="item-link smart-select smart-select-init" data-open-in="popup"  data-searchbar="true" data-searchbar-placeholder="Kategori ara">\n' +
				'<select name="category_'+layerIDPlus+'" onchange="layerCategoryChange(this)" data-layer="'+layerIDPlus+'">\n' +
				'<option value="0" selected disabled>LÃ¼tfen seÃ§im yapÄ±nÄ±z.</option>\n' +
				'</select>\n' +
				'<div class="item-content">\n' +
				'<div class="item-inner">\n' +
				'<div class="item-title">Kategori SeÃ§in</div>\n' +
				'</div>\n' +
				'</div>\n' +
				'</a>\n' +
				'</li>');

			items.push('<option value="0" selected disabled>LÃ¼tfen seÃ§im yapÄ±nÄ±z.</option>');
			$.each( data.results, function( key, val ) {
				items.push('<option value="' + val.value + '">' + val.text + '</option>');
			});

			$$("select[name=category_"+layerIDPlus+"]").html(items.join(""));

			$("[data-category-layer="+layerIDPlus+"]").fadeIn();
		}
		else if(data.advert)
		{
			layerTypesChange(inputdata);
			console.log("Ä°lan tipleri geliyor..");
		}
	});
}

function makeRandom(length)
{
	var result           = '';
	var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	var charactersLength = characters.length;
	for ( var i = 0; i < length; i++ ) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}

function layerTypesChange(inputdata)
{
	$(".step-2-btn").prop("disabled",true);
	var layerID = $(inputdata).data("layer");
	var layerIDPlus = layerID + 1;
	var selectedValue = $(inputdata).children("option:selected").val();

	DataCategory[layerID] = $(inputdata).children("option:selected").text();

	for(var fakeID = layerID + 1;fakeID < 10;fakeID++)
	{
		$("[data-category-layer="+fakeID+"]").remove();
	}

	$.post(API + 'api/getTypes', "Id=" + selectedValue, function( data ) {
		var data = JSON.parse(data);
		var items = [];
		if(data.success)
		{

			$("[data-category-layer="+layerID+"]").after('' +
				'<li class="category_'+layerIDPlus+'" data-category-layer="'+layerIDPlus+'">\n' +
				'<a class="item-link smart-select smart-select-init" data-open-in="popup"  data-searchbar="true" data-searchbar-placeholder="Kategori ara">\n' +
				'<select name="type" onchange="typeSelect(this)" data-layer="'+layerIDPlus+'">\n' +
				'<option value="0" selected disabled>LÃ¼tfen seÃ§im yapÄ±nÄ±z.</option>\n' +
				'</select>\n' +
				'<div class="item-content">\n' +
				'<div class="item-inner">\n' +
				'<div class="item-title">Ä°lan Tipi SeÃ§in</div>\n' +
				'</div>\n' +
				'</div>\n' +
				'</a>\n' +
				'</li>');

			items.push('<option value="0" selected disabled>LÃ¼tfen seÃ§im yapÄ±nÄ±z.</option>');
			$.each( data.results, function( key, val ) {
				items.push('<option value="' + val.value + '">' + val.text + '</option>');
			});

			$$("select[name=type]").html(items.join(""));

			$("[data-category-layer="+layerIDPlus+"]").fadeIn();
		}
		else if(data.advert)
		{
			//console.log("Ã„Â°lan tipleri geliyor..");
		}
	});
}

function typeSelect(divdata)
{
	DataCategory[$(divdata).children("option:selected").val()] = $(divdata).children("option:selected").text();

	$(".step-2-btn").prop("disabled",false);
}

var DataCategory = [];

function categoryBreadcumb()
{
	$.each(DataCategory, function(key, value) {
		if(value == "" || value == null) {
			delete DataCategory.key;
		}
	});
	//.categoryBreadcrumb
	var TempText = JSON.parse(JSON.stringify(DataCategory));
	var html = "";
	$.each( TempText, function( key, value ) {
		//console.log(key + "-->" + value);
		if(value == "null" || value === null || value == "")
		{
			//console.log(key + "-->" + value);
		}
		else
		{
			if(key > 0 && typeof value != "undefined" && value != "null")
			{
				if(Object.keys(TempText).length == (key-1))
					html += '<a class="section">'+ value +'xx</a><div class="divider"> / </div>';
				else
					html += '<a class="section">'+ value +'</a><div class="divider"> / </div>';
			}
		}
	});
	$(".categoryBreadcrumb").html(html);
}

$("#chatPageButton").on("click",function(event){
	event.preventDefault();
	if(storage.getItem("UserName") == null)
		requiredLogin();
	else
	{
		if(storage.getItem("PhoneVerify") == "0")
		{
			myApp.dialog.alert('Telefon numaranÄ±z doÄŸrulanmadan sohbet penceresi gÃ¶rÃ¼ntÃ¼lenemez.');
		}
		else
		{
			myApp.popup.open(".panel-chat", true);
		}
	}
});

$(document).on("click","button.tawkto-chat-button",function(event){
	console.log("asdasdasd");
	myApp.popup.open(".panel-tawkto", true);
});

$(document).on("click",".popupPage",function(event)
{
	myApp.preloader.show();
	var Id = $(this).data("href");
	$.post(API + 'api/getPageDetail', "Id=" + Id, function( data ) {
		var data = JSON.parse(data);
		var items = [];
		if (data.success) {
			myApp.preloader.hide();

			Swal.fire({
				icon: 'error',
				title: data.title,
				html: data.content,
				showConfirmButton: false,
				showCloseButton: true,
				customClass: {
					container: 'container-class sozlesme-class',
				}
			});
			// var dynamicPopup = myApp.popup.create({
			// 	content: '' +
			// 		'<div class="popup">' +
			// 		'<div class="block">' +
			// 		'<p><a href="#" class="link popup-close"><i class="icon ion-md-close-circle"></i></a></p>' +
			// 		'<div class="overflow-content">' +
			// 		'<h3></h3>' +
			// 		'<p>'+ data.content +'</p>' +
			// 		'</div>' +
			// 		'</div>' +
			// 		'</div>',
			// });
			// dynamicPopup.open();
		}
	});

});

$(document).on("click","a",function(event)
{
	var href = $(this).attr("href");
	console.log($(this).attr("href"));
	if(storage.getItem("UserName") == null)
	{
		if(href == "/addpost/")
			requiredLogin();
		else if(href == "/notifications/")
			requiredLogin();
	}

});

function requiredLogin()
{
	myApp.views.main.router.navigate('/login/', {force: true, ignoreCache: true, reload: true});
	window.location.href = 'index.html#!/login/';
	window.location.reload();
}

function pageLoading()
{
	myApp.preloader.show();
}

function pageLoaded()
{
	myApp.preloader.hide();
}
