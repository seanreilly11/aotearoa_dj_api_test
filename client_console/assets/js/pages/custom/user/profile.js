"use strict";

// Class definition
var KTUserProfile = (function () {
    // Base elements
    var avatar, offcanvas;
    const environment = config.env;
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const courseId = urlParams.get("courseId");

    // Private functions
    var initAside = function () {
        // Mobile offcanvas for mobile mode
        offcanvas = new KTOffcanvas("kt_user_profile_aside", {
            overlay: true,
            baseClass: "kt-app__aside",
            closeBy: "kt_user_profile_aside_close",
            toggleBy: "kt_subheader_mobile_toggle",
        });
    };

    var initUserForm = function () {
        avatar = new KTAvatar("kt_user_avatar");
    };

    var showDetails = function () {
        $.ajax({
            url: `${environment}/courses/${courseId}`,
            type: "GET",
            dataType: "json",
            success: function (data) {
                console.log(data);
                // document.title += " | " + data.nickname;
                // $("#profilepage_name").text(data.nickname);

                // $("#signup-date").text(formatDateDDMMYYY(data.createdDate));
                // $("#last-connection-date").text(formatDateDDMMYYY(data.updatedDate));
            }, //success
            error: function () {
                console.log("error: cannot call api");
            }, //error
        }); //ajax
    };

    $(".nav-link[href='#kt_portlet_tab_1_1']").click(function () {
        if (!$(this).attr("class").includes("active")) {
            widget1.destroy();
            widget2.destroy();
            displayStatsData();
        }
    });

    function displayStatsData() {
        const filters = { Range: 30, Period: "D", CandidateId: userId };
        for (let i = 1; i < 1; i++) {
            filters.StatId = i;
            $.ajax({
                headers: {
                    Accept: "*/*",
                    "Content-Type": "application/json",
                    Filters: JSON.stringify(filters),
                },
                type: "GET",
                dataType: "json",
                url: `${environment}/api/partner/ListStatisticsForPartnerCandidate`,
                success: function (data) {
                    switch (i) {
                        case 1:
                            showWidget1(data);
                            break;
                        case 2:
                            showWidget2(data);
                            break;
                        case 3:
                            showWidget3(data);
                            break;
                        case 4:
                            showWidget4(data);
                            break;
                        case 5:
                            showWidget5(data);
                            break;
                        default:
                            break;
                    }
                }, //success
                error: function () {
                    console.log("error: cannot call api");
                }, //error
            }); //ajax
        }
    }

    var widget1, widget2;

    function showWidget1(data) {
        const total = data.length > 0 ? data[0].result : 0;
        const clos = data.find((x) => x.item === "Lead clos");
        const encours = data.find((x) => x.item === "Lead en cours");
        const closVal = clos ? clos.total : 0;
        const encoursVal = encours ? encours.total : 0;

        $("#widget1-number").text(total);
        $("#widget1-clos").text(closVal);
        $("#widget1-encours").text(encoursVal);

        var config = {
            type: "doughnut",
            data: {
                datasets: [
                    {
                        data: [closVal, encoursVal],
                        backgroundColor: ["limegreen", "lightgrey"],
                    },
                ],
                labels: ["Lead clos", "Lead en cours"],
            },
            options: {
                cutoutPercentage: 75,
                responsive: true,
                maintainAspectRatio: false,
                legend: {
                    display: false,
                    position: "top",
                },
                title: {
                    display: false,
                    text: "",
                },
                animation: {
                    animateScale: true,
                    animateRotate: true,
                },
                tooltips: {
                    enabled: true,
                    intersect: false,
                    mode: "nearest",
                    bodySpacing: 5,
                    yPadding: 10,
                    xPadding: 10,
                    caretPadding: 0,
                    displayColors: false,
                    backgroundColor: "#ff2727",
                    titleFontColor: "#ffffff",
                    cornerRadius: 4,
                    footerSpacing: 0,
                    titleSpacing: 0,
                },
            },
        };

        if (widget1) widget1.destroy();

        var ctx = document.getElementById("widget1-chart").getContext("2d");
        widget1 = new Chart(ctx, config);
    }

    function showWidget2(data) {
        const total = data.length > 0 ? data[0].result : 0;
        const terminees = data.find((x) => x.item === "Enquetes terminees");
        const enattente = data.find((x) => x.item === "Enquetes en attente");
        const nonrealises = data.find((x) => x.item === "Enquetes non realises");
        const termineesVal = terminees ? terminees.total : 0;
        const enattenteVal = enattente ? enattente.total : 0;
        const nonrealisesVal = nonrealises ? nonrealises.total : 0;

        $("#widget2-number").text(total);
        $("#widget2-terminees").text(termineesVal);
        $("#widget2-enattente").text(enattenteVal);
        $("#widget2-nonrealises").text(nonrealisesVal);

        var config = {
            type: "doughnut",
            data: {
                datasets: [
                    {
                        data: [termineesVal, enattenteVal, nonrealisesVal],
                        backgroundColor: ["gold", "navy", "lightgrey"],
                    },
                ],
                labels: ["Enquetes terminees", "Enquetes en attente", "Enquetes non realises"],
            },
            options: {
                cutoutPercentage: 75,
                responsive: true,
                maintainAspectRatio: false,
                legend: {
                    display: false,
                    position: "top",
                },
                title: {
                    display: false,
                    text: "",
                },
                animation: {
                    animateScale: true,
                    animateRotate: true,
                },
                tooltips: {
                    enabled: true,
                    intersect: false,
                    mode: "nearest",
                    bodySpacing: 5,
                    yPadding: 10,
                    xPadding: 10,
                    caretPadding: 0,
                    displayColors: false,
                    backgroundColor: "#ff2727",
                    titleFontColor: "#ffffff",
                    cornerRadius: 4,
                    footerSpacing: 0,
                    titleSpacing: 0,
                },
            },
        };

        if (widget2) widget2.destroy();

        var ctx = document.getElementById("widget2-chart").getContext("2d");
        widget2 = new Chart(ctx, config);
    }

    const ratedFill = "gold"; // rating color
    function showWidget3(data) {
        const rating = data.length > 0 ? data[0].score : 0;
        const reviews = data.length > 0 ? data[0].count : 0;

        // destroy widget before init to reset it
        var $rateYo = $("#widget3-chart").rateYo();
        $rateYo.rateYo("destroy");

        $("#widget3-chart").rateYo({
            starWidth: "26px",
            spacing: "3px",
            rating,
            halfStar: true,
            readOnly: true,
            ratedFill,
        });
        $("#widget3-text").text(reviews + " avis");
    }

    function showWidget4(data) {
        const rating = data.length > 0 ? data[0].score : 0;
        const reviews = data.length > 0 ? data[0].count : 0;

        // destroy widget before init to reset it
        var $rateYo = $("#widget4-chart").rateYo();
        $rateYo.rateYo("destroy");

        $("#widget4-chart").rateYo({
            starWidth: "26px",
            spacing: "3px",
            rating,
            halfStar: true,
            readOnly: true,
            ratedFill,
        });
        $("#widget4-text").text(reviews + " avis");
    }

    function showWidget5(data) {
        const total = data.length > 0 ? data[0].result : 0;
        $("#widget5-text").html(total + "<span class='budget-symbol'>€</span>");
    }

    return {
        // public functions
        init: function () {
            initAside();
            initUserForm();
            showDetails();
            displayStatsData();
        },
    };
})();

KTUtil.ready(function () {
    KTUserProfile.init();
});
