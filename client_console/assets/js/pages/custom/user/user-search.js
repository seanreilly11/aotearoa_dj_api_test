"use strict";
// Class definition

var KTUserListDatatable = (function () {
    // variables
    var datatable;
    const environment = config.env;
    const passport = JSON.parse(localStorage.getItem("passport"));
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const query = urlParams.get("q");
    const token = urlParams.get("token");
    var searchQuery = query === null ? "" : query;
    $("#userSearch").val(query);

    // init
    var init = function () {
        // init the datatables. Learn more: https://keenthemes.com/metronic/?page=docs&section=datatable
        datatable = $("#kt_apps_user_list_datatable").KTDatatable({
            // datasource definition
            data: {
                type: "remote",
                source: {
                    read: {
                        url: `${environment}/users`,
                        method: "GET",
                    },
                },
                pageSize: 10,
                serverPaging: true,
                serverFiltering: true,
                serverSorting: true,
            },

            // layout definition
            layout: {
                scroll: false, // enable/disable datatable scroll both horizontal and vertical when needed.
                footer: false, // display/hide footer
            },

            pagination: true,

            toolbar: {
                items: {
                    pagination: {
                        pageSizeSelect: [10, 20, 30, 50],
                    },
                },
            },

            // columns definition
            columns: [
                {
                    field: "name",
                    title: "Name",
                    sortable: false,
                    width: 200,
                    template: function (data) {
                        return `<div class="kt-user-card-v2">
                            <div class="kt-user-card-v2__details">
                                <span class="kt-user-card-v2__name">${
                                    data.firstname + " " + data.lastname
                                }</span>
                            </div>
                        </div>`;
                    },
                },
                // <a href="custom/user/overview.html?userId=${
                //     data._id
                // }" class="kt-user-card-v2__name">${data.firstname + " " + data.lastname}</a>
                {
                    field: "email",
                    title: "Email",
                    width: 175,
                    autoHide: false,
                    // sortable: false,
                    template: function (data) {
                        console.log(data);
                        return data.email;
                    },
                },
                {
                    field: "videos",
                    title: "Videos completed",
                    width: "auto",
                    sortable: false,
                    template: function (data) {
                        return `${data.videosCompleted.length}`;
                    },
                },
                {
                    field: "courses",
                    title: "Courses completed",
                    width: "auto",
                    sortable: false,
                    template: function (data) {
                        return `${data.coursesCompleted.length}`;
                    },
                },
                {
                    field: "lastLogin",
                    title: "Last login",
                    width: "auto",
                    sortable: false,
                    template: function (data) {
                        var date = new Date(data.updatedDate);
                        var month = date.getMonth() + 1;
                        var dt = date.getDate();
                        if (dt < 10) dt = "0" + dt;
                        if (month < 10) month = "0" + month;
                        return dt + "/" + month + "/" + date.getFullYear();
                    },
                },
            ],
        });
    };

    var onUpdate = function () {
        datatable.on("kt-datatable--on-layout-updated", function () {
            initTokenSecurity();
            $("#kt_subheader_total").html(datatable.getTotalRows() + " Total");
        });
    };

    // var showStarRatings = function () {
    //     const ratings = $("[id^=rateYo]");
    //     for (let i = 0; i < ratings.length; i++)
    //         $("#" + ratings[i].attributes["id"].value).rateYo({
    //             starWidth: "22px",
    //             rating: ratings[i].attributes["data-rating"].value,
    //             halfStar: true,
    //             readOnly: true,
    //             ratedFill: "gold",
    //         });
    // };

    // $("#kt_subheader_search_form").submit(function (e) {
    //     e.preventDefault();
    //     var search = $("#userSearch").val();
    //     var redirect = `users.html?q=${search}&token=${token}`;
    //     window.location.replace(redirect);
    //     // datatable.reload();
    // });

    return {
        // public functions
        init: function () {
            init();
            onUpdate();
        },
    };
})();

// On document ready
KTUtil.ready(function () {
    KTUserListDatatable.init();
});
