const environment = config.env;
const passport = JSON.parse(localStorage.getItem("passport"));
const PARTNER_ID = passport.partnerId;

$(document).ready(function () {
    const Range = $("#dashboard-period-select").val().split("-")[0];
    const Period = $("#dashboard-period-select").val().split("-")[1];

    const defaultFilters = { Range, Period, partnerId: PARTNER_ID };

    var filters = defaultFilters;

    $("#dashboard-period-select").change(function () {
        filters = {
            ...filters,
            Range: $(this).val().split("-")[0],
            Period: $(this).val().split("-")[1],
        };
        displayStatsData(filters);
    });
    displayStatsData(filters);

    function displayStatsData(filters) {
        const ogFilters = { ...filters };
        for (let i = 1; i < 10; i++) {
            filters = { ...ogFilters };
            filters.StatId = i;
            // widget 3 and 9 only accept 12 M. Widget 7 and 8 only accept Period so math to find Range
            if (i === 3 || i === 9) {
                filters.Period = "M";
                filters.Range = 12;
            } else if (i === 7 || i === 8) {
                const _period = ogFilters.Period;
                const _range = ogFilters.Range;
                filters.Period = "P";
                filters.Range = _period === "M" ? Math.ceil(_range * 30.4) : _range;
            }
            filters.Range = parseInt(filters.Range);
            $.ajax({
                headers: {
                    Accept: "*/*",
                    "Content-Type": "application/json",
                    Filters: JSON.stringify(filters),
                },
                type: "GET",
                dataType: "json",
                url: `${environment}/api/lead/ListStatisticsForPartnerLeads `,
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
                        case 6:
                            showWidget6(data);
                            break;
                        case 7:
                            showWidget7(data);
                            break;
                        case 8:
                            showWidget8(data);
                            break;
                        case 9:
                            showWidget9(data);
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

    var widget1, widget2, widget3, widget9;

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

    function showWidget3(_data) {
        _data.reverse();
        if (_data.length > 0) {
            const labels = _data.map((x) => formatDate(x.period));
            const dataset = _data.map((x) => x.count);

            const data = {
                labels: labels,
                datasets: [
                    {
                        label: "Lead achetes",
                        data: dataset,
                        borderColor: "red",
                        backgroundColor: "red",
                        fill: false,
                    },
                ],
            };

            const config = {
                type: "line",
                data: data,
                options: {
                    responsive: true,
                    legend: {
                        display: false,
                    },
                    scales: {
                        yAxes: [
                            {
                                ticks: {
                                    beginAtZero: true,
                                    stepSize: 1, // TODO: will need to change depending on what value range is expected
                                },
                            },
                        ],
                        xAxes: [
                            {
                                gridLines: false,
                            },
                        ],
                    },
                    elements: {
                        line: {
                            tension: 0,
                        },
                    },
                },
            };

            if (widget3) widget3.destroy();

            var ctx = document.getElementById("widget3-chart").getContext("2d");
            widget3 = new Chart(ctx, config);
        }
    }

    const ratedFill = "gold"; // rating color
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
        const rating = data.length > 0 ? data[0].score : 0;
        const reviews = data.length > 0 ? data[0].count : 0;

        // destroy widget before init to reset it
        var $rateYo = $("#widget5-chart").rateYo();
        $rateYo.rateYo("destroy");

        $("#widget5-chart").rateYo({
            starWidth: "26px",
            spacing: "3px",
            rating,
            halfStar: true,
            readOnly: true,
            ratedFill,
        });
        $("#widget5-text").text(reviews + " avis");
    }

    function showWidget6(data) {
        const total = data.length > 0 ? data[0].result : 0;
        $("#widget6-text").html(total + "<span class='budget-symbol'>€</span>");
    }

    function showWidget7(data) {
        const total = data.length > 0 ? data[0].count : 0;
        $("#widget7-text").text(total);
    }

    function showWidget8(data) {
        const total = data.length > 0 ? data[0].total : 0;
        $("#widget8-value").val(total);
        $("#widget8-text").text(total + "%");
    }

    function showWidget9(_data) {
        _data.reverse();
        if (_data.length > 0) {
            const labels = _data.map((x) => formatDate(x.period));
            const dataset = _data.map((x) => x.count);

            const data = {
                labels: labels,
                datasets: [
                    {
                        label: "Lead achetes",
                        data: dataset,
                        borderColor: "red",
                        backgroundColor: "red",
                        fill: false,
                    },
                ],
            };

            const config = {
                type: "line",
                data: data,
                options: {
                    responsive: true,
                    legend: {
                        display: false,
                    },
                    scales: {
                        yAxes: [
                            {
                                ticks: {
                                    beginAtZero: true,
                                    stepSize: 1, // TODO: will need to change depending on what value range is expected
                                },
                            },
                        ],
                    },
                    elements: {
                        line: {
                            tension: 0,
                        },
                    },
                },
            };

            if (widget9) widget9.destroy();

            var ctx = document.getElementById("widget9-chart").getContext("2d");
            widget9 = new Chart(ctx, config);
        }
    }

    function formatDate(date) {
        var month = [
            "Janv.",
            "Févr.",
            "Mars",
            "Avr.",
            "Mai",
            "Juin",
            "Juil.",
            "Août",
            "Sept.",
            "Oct.",
            "Nov.",
            "Déc.",
        ];

        if (date.includes(" - ")) {
            var period = date.split(" - ");
            return (
                period[0].split("-")[2] +
                " " +
                month[parseInt(period[0].split("-")[1]) - 1] +
                " " +
                period[0].split("-")[0] +
                " - " +
                period[1].split("-")[2] +
                " " +
                month[parseInt(period[1].split("-")[1]) - 1] +
                " " +
                period[1].split("-")[0]
            );
        }

        var day = date.split("-")[2] ? date.split("-")[2] : "";

        return day + " " + month[parseInt(date.split("-")[1]) - 1] + " " + date.split("-")[0];
    }
});
