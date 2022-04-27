"use strict";

// Class definition
var KTDashboard = (function () {
    // var fetchedPassport = localStorage.getItem('passport');
    var userPassport = JSON.parse(localStorage.getItem("passport"));
    $("#userId").text(userPassport.firstname);
    $("#userId1").text(userPassport.firstname + " " + userPassport.surname);
    $("#userLetter").text(userPassport.firstname.charAt(0).toUpperCase());
    $("#userLetter1").text(userPassport.firstname.charAt(0).toUpperCase());

    $("#close-aside").click(function () {
        $(".aside-wrapper").css("left", "-100%");
    });

    $("#kt_subheader_mobile_toggle").click(function () {
        $(".aside-wrapper").css("left", "0");
    });

    return {
        // Init demos
        init: function () {
            // demo loading
            var loading = new KTDialog({
                type: "loader",
                placement: "top center",
                message: "Loading...",
            });
            loading.show();

            setTimeout(function () {
                loading.hide();
            }, 3000);
        },
    };
})();

// Class initialization on page load
jQuery(document).ready(function () {
    KTDashboard.init();
});
