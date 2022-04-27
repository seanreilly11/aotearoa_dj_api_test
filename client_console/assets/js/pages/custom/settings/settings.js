"use strict";

// Class definition
var KTUserProfile = (function () {
    // Base elements
    const environment = config.env;
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const userId = urlParams.get("avatarId");
    const reported = urlParams.get("reported");
    const status = urlParams.get("status");
    const queries = queryString.split("&");

    var showDetails = function () {
        $.ajax({
            url: `${environment}/api/office/GetUserDetails?avatarId=${userId}`,
            type: "GET",
            dataType: "json",
            success: function (data) {
                console.log(data);
                document.title += " | " + data.firstname + " " + data.surname;
                $("#profilepage_name").text(data.firstname + " " + data.surname);
                $("#settings__name").val(data.firstname);
                $("#settings__id-code").val(data.surname);
                $("#settings__surname").val(data.surname);
                $("#settings__firstname").val(data.firstname);
                $("#settings__job").val(data.email);
                $("#settings__email").val(data.mobileNumberFormatted);
                $("#settings__telephone").val(data.deviceOS);
            }, //success
            error: function () {
                console.log("error: cannot call api");
            }, //error
        }); //ajax
    };

    $("#settings__form").submit(function (e) {
        e.preventDefault();
        const firstname = $("#settings__firstname").val();
        const surname = $("#settings__surname").val();
        const job = $("#settings__job").val();
        const email = $("#settings__email").val();
        const telephone = $("#settings__telephone").val();

        var item = { firstname, surname, job, email, telephone };
        console.log(item);
    });

    return {
        // public functions
        init: function () {
            showDetails();
        },
    };
})();

KTUtil.ready(function () {
    KTUserProfile.init();
});
