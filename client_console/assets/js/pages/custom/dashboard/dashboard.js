const environment = config.env;

$(document).ready(function () {
    const MIN_DATE = new Date(2020, 05, 01); // yyyy-mm-dd. Month is 0 based
    const rangeToStartMonths = monthDiff(MIN_DATE, new Date()); // show MTD
    const rangeToStartDays = dayDiff(MIN_DATE, new Date()); // show DTD
    // const rangeToStartMonths = 5; // show past 6 months
    // const rangeToStartDays = 90; // show days in the last 3 months
    const defaultFilters = { Range: rangeToStartMonths, Period: "M" };
    var filters = defaultFilters;

    displayStatsData(filters);
    displayOffersData();

    $("#kt_daterangepicker").daterangepicker(
        {
            maxDate: new Date(),
            minDate: MIN_DATE,
            autoApply: true,
        },
        function (start, end, label) {
            filters = {
                TargetDate: end,
                MinimumDate: start,
                Period: $("#dashboard-period-select").val(),
            };
            displayStatsData(filters);
            $("#kt_daterangepicker .form-control").val(
                start.format("DD-MM-YYYY") + " / " + end.format("DD-MM-YYYY")
            );
        }
    );

    $("#datepicker-reset-date").click(function () {
        displayStatsData(defaultFilters);
        $("#kt_daterangepicker .form-control").val("");
        $("#dashboard-period-select").val($("#dashboard-period-select option:first").val());
    });

    $("#dashboard-period-select").change(function () {
        filters = {
            ...filters,
            Range:
                $(this).val() === "D" || $(this).val() === "P"
                    ? rangeToStartDays
                    : rangeToStartMonths,
            Period: $(this).val(),
        };
        displayStatsData(filters);
    });

    function monthDiff(d1, d2) {
        var months = (d2.getFullYear() - d1.getFullYear()) * 12;
        months -= d1.getMonth();
        months += d2.getMonth();
        return months <= 0 ? 0 : months;
    }

    function dayDiff(d1, d2) {
        var diff = d2.getTime() - d1.getTime();
        var days = Math.ceil(diff / (1000 * 3600 * 24));
        return days <= 0 ? 0 : days;
    }

    $(function () {
        $("#rateYo-average-client-rating").rateYo({
            starWidth: "26px",
            spacing: "3px",
            rating: 4,
            halfStar: true,
            readOnly: true,
        });
        $("#rateYo-average-user-rating").rateYo({
            starWidth: "26px",
            spacing: "3px",
            rating: 5,
            halfStar: true,
            readOnly: true,
        });
    });
});

function displayStatsData(filters) {
    var type = ["Users", "Accounts", "Devices"];
    for (let i = 0; i < type.length; i++) {
        $.ajax({
            headers: {
                Accept: "*/*",
                "Content-Type": "application/json",
                Filters: JSON.stringify(filters),
            },
            type: "GET",
            dataType: "json",
            url: `${environment}/api/office/ListStatisticsFor${type[i]}`,
            success: function (data, textStatus, xhr) {
                console.log(data);
                if (type[i] === "Users") {
                    var rawDates = [];
                    var dates = [];
                    var dataset = [];
                    data.reverse();
                    // var currentData = 0; put here if is accumulative

                    for (let i = 0; i < data.length; i++) {
                        if (!rawDates.includes(data[i].period)) rawDates.push(data[i].period);
                        if (!dates.includes(formatDate(data[i].period)))
                            dates.push(formatDate(data[i].period));
                    }
                    for (let i = 0; i < rawDates.length; i++) {
                        var currentData = 0; // leave here if monthly active users
                        const array = data.filter((x) => x.period === rawDates[i]);
                        for (let j = 0; j < array.length; j++) currentData += array[j].count;

                        dataset.push(currentData);
                    }
                    showActiveUsers(dates, dataset);
                } else if (type[i] === "Accounts") {
                    let users = {
                        fb: 0,
                        email: 0,
                    };
                    for (let i = 0; i < data.length; i++) {
                        if (data[i].account === "FACEBOOK") users.fb += data[i].count;
                        if (data[i].account === "EMAIL") users.email += data[i].count;
                    }
                    showUsers(users);
                } else if (type[i] === "Devices") {
                    var rawDates = [];
                    var dates = [];
                    var dataset = [];
                    data.reverse();

                    for (let i = 0; i < data.length; i++) {
                        if (!rawDates.includes(data[i].period)) rawDates.push(data[i].period);
                        if (!dates.includes(formatDate(data[i].period)))
                            dates.push(formatDate(data[i].period));
                    }
                    for (let i = 0; i < rawDates.length; i++) {
                        var currentData = 0;
                        const array = data.filter((x) => x.period === rawDates[i]);
                        for (let j = 0; j < array.length; j++) {
                            currentData += array[j].count;
                        }
                        dataset.push(currentData);
                    }
                    showLeads(dates, dataset);
                }
            }, //success
            error: function () {
                console.log("error: cannot call api");
            }, //error
        }); //ajax
    }
}

function displayOffersData() {
    $.ajax({
        type: "GET",
        dataType: "json",
        url: `${environment}/api/Offer/getofferlist?recordsPerPage=999999&currentPage=1`,
        success: function (data, textStatus, xhr) {
            console.log(data);
            var offers = {
                sales: 0,
                help: 0,
                event: 0,
            };
            for (let i = 0; i < data.length; i++) {
                if (data[i].offerType === 1) offers.sales++;
                else if (data[i].offerType === 2) offers.help++;
                else if (data[i].offerType === 3) offers.event++;
            }
            showOffers(offers);
        }, //success
        error: function (xhr) {
            console.log("error: cannot call api");
        }, //error
    }); //ajax
}

var monthlySales, totalUsers, totalOffers, evoUsers;

function showUsers(users) {
    var total = users.fb + users.email;
    $("#totalUsersNumber").text(total);
    $("#totalUsersFb").text(users.fb);
    $("#totalUsersEmail").text(users.email);

    var config = {
        type: "doughnut",
        data: {
            datasets: [
                {
                    data: [users.email, users.fb],
                    backgroundColor: ["#ff2727", KTApp.getStateColor("brand")],
                },
            ],
            labels: ["Email", "Facebook"],
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

    if (totalUsers) totalUsers.destroy();

    var ctx = document.getElementById("totalUsersChart").getContext("2d");
    totalUsers = new Chart(ctx, config);
}

function showActiveUsers(dates, dataset) {
    var config = {
        type: "line",
        data: {
            labels: dates,
            datasets: [
                {
                    backgroundColor: "#ff0000",
                    borderColor: "#ff0000",
                    data: dataset,
                    fill: false,
                },
            ],
        },
        options: {
            title: {
                display: false,
            },
            tooltips: {
                intersect: false,
                mode: "nearest",
                xPadding: 10,
                yPadding: 10,
                caretPadding: 10,
            },
            legend: {
                display: false,
            },
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                xAxes: [
                    {
                        display: true,
                        gridLines: false,
                    },
                ],
                yAxes: [
                    {
                        display: true,
                    },
                ],
            },
            layout: {
                padding: {
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                },
            },
        },
    };

    if (evoUsers) evoUsers.destroy();

    var ctx = document.getElementById("activeUsersChart").getContext("2d");
    evoUsers = new Chart(ctx, config);
}

function showOffers(offers) {
    var total = offers.sales + offers.help + offers.event;
    $("#totalOffersNumber").text(total);
    $("#totalOffersSales").text(offers.sales);
    $("#totalOffersHelp").text(offers.help);
    $("#totalOffersEvent").text(offers.event);

    var config = {
        type: "doughnut",
        data: {
            datasets: [
                {
                    data: [offers.sales, offers.help, offers.event],
                    backgroundColor: ["#ff2727", "#212121", KTApp.getStateColor("brand")],
                },
            ],
            labels: ["Sales", "Help", "Events"],
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
                text: "Technology",
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

    if (totalOffers) totalOffers.destroy();

    var ctx = document.getElementById("totalOffersChart").getContext("2d");
    totalOffers = new Chart(ctx, config);
}

function showLeads(dates, dataset) {
    var config = {
        type: "line",
        data: {
            labels: dates,
            datasets: [
                {
                    backgroundColor: "#ff0000",
                    borderColor: "#ff0000",
                    data: dataset,
                    fill: false,
                },
            ],
        },
        options: {
            title: {
                display: false,
            },
            tooltips: {
                intersect: false,
                mode: "nearest",
                xPadding: 10,
                yPadding: 10,
                caretPadding: 10,
            },
            legend: {
                display: false,
            },
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                xAxes: [
                    {
                        display: true,
                        gridLines: false,
                    },
                ],
                yAxes: [
                    {
                        display: true,
                    },
                ],
            },
            layout: {
                padding: {
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                },
            },
        },
    };

    if (monthlySales) monthlySales.destroy();

    var ctx = document.getElementById("leadsCompletedChart").getContext("2d");
    monthlySales = new Chart(ctx, config);
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
