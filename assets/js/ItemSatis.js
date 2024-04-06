var API = "https://www.itemsatis.com/BETAxx/";
/*
var app = new Framework7({
    root: '#app',
    name: 'İtem Satış',
    id: 'com.itemsatis.mobil',
    // Enable swipe panel
    panel: {
        swipe: 'left',
    },
    routes: [
        {
            name: 'about',
            url: 'pages/page-about.html',
        },
    ],
});

var mainView = app.views.create('.view-main');

var leftPanel = app.panel.create({
    el: '.panel-left',
    swipe: true,
    on: {
        opened: function () {
            console.log('Panel opened')
        }
    }
})

var $$ = Dom7;

var notificationFull = app.notification.create({
    icon: '<i class="icon demo-icon">7</i>',
    title: 'Framework7',
    titleRightText: 'now',
    subtitle: 'This is a subtitle',
    text: 'This is a simple notification message',
    closeTimeout: 10000,
});
*/

$(document).ready(function() {
    // notificationFull.open();

    $.ajax({
        type: "POST",
        url: API + "api/homePopularPosts",
        data: "data=Fetch", // serializes the form's elements.
        success: function (data) {
            var data = JSON.parse(data);
            console.log("Fetched");
            // $("span.ui.userNotifyDropdown .menu .loading-item").fadeOut();
            // var htmlData = "";

            // $.each( data.notifications , function( key, value ) {
            //     htmlData += '' +
            //         '<div class="item notify-item">' +
            //         '<a href="index.php?go=Notification">' +
            //         '<div class="notify-icon"><img src="' + value.image + '"></div>' +
            //         '<div class="notify-feed">' +
            //         '<span class="feed-date">' + value.datetime + '</span>' +
            //         '<p>' + value.message + '..</p>' +
            //         '</div>' +
            //         '</a>' +
            //         '</div>';
            // });

            // $("span.ui.userNotifyDropdown .menu").html(htmlData);
        }
    });
});