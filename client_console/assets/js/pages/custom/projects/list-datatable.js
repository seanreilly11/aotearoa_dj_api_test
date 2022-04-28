"use strict";
// Class definition

var KTUserListDatatable = (function () {
    // variables
    var datatable;
    const environment = config.env;
    // const passport = JSON.parse(localStorage.getItem("passport"));

    // init
    var init = function () {
        // init the datatables. Learn more: https://keenthemes.com/metronic/?page=docs&section=datatable
        datatable = $("#kt_apps_user_list_datatable").KTDatatable({
            // datasource definition
            data: {
                type: "remote",
                source: {
                    read: {
                        url: `${environment}/courses?accessLevel=1`,
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

            sortable: true,
            pagination: true,

            search: {
                input: $("#generalSearch"),
                delay: 400,
            },

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
                    field: "title",
                    title: "Title",
                    width: 180,
                    autoHide: false,
                    sortable: false,
                    template: function (data) {
                        console.log(data);
                        var output = `
                        <div class="kt-user-card-v2 kt-user-card-v2--uncircle">
                            <div class="kt-user-card-v2__details">
                                <a class="kt-user-card-v2__name" href="custom/course/overview.html?courseId=${data._id}">${data.title}</a>
                            </div>
                        </div>`;

                        return output;
                    },
                },
                {
                    field: "description",
                    title: "Description",
                    sortable: false,
                    template: function (data) {
                        return data.description.length > 100
                            ? data.description.substr(0, 100) + "..."
                            : data.description;
                    },
                },
                {
                    field: "category",
                    title: "Category",
                    width: 100,
                    sortable: false,
                    autoHide: false,
                    template: function (data) {
                        const status = {
                            DJ: {
                                class: "btn-label-info",
                            },
                            Production: {
                                class: "btn-label-warning",
                            },
                        };

                        return `<span class="btn btn-bold btn-sm btn-font-sm btn-block ${
                            status[data.category].class
                        }">${data.category}</span>`;
                    },
                },
                {
                    field: "videos",
                    title: "Videos",
                    width: 100,
                    sortable: false,
                    autoHide: false,
                    template: function (data) {
                        var output = `<div class="kt-user-card-v2">
							<div class="kt-user-card-v2__details">
								<span class="kt-user-card-v2__name">${data.videos.length}</span>
							</div>
						</div>`;

                        return output;
                    },
                },
                {
                    field: "totalStudents",
                    title: "Students",
                    width: 100,
                    sortable: false,
                    autoHide: false,
                    template: function (data) {
                        var output = `<div class="kt-user-card-v2">
							<div class="kt-user-card-v2__details">
								<span class="kt-user-card-v2__name">${data.totalStudents}</span>
							</div>
						</div>`;

                        return output;
                    },
                },
                {
                    field: "difficulty",
                    title: "Difficulty",
                    width: 100,
                    sortable: false,
                    autoHide: false,
                    template: function (data) {
                        var output = `<div class="kt-user-card-v2">
							<div class="kt-user-card-v2__details">
								<span class="kt-user-card-v2__name">${difficulty[data.difficulty].title || 0}</span>
							</div>
						</div>`;

                        return output;
                    },
                },
                // {
                //     field: "createdDate",
                //     title: "Upload date",
                //     width: 120,
                //     sortable: false,
                //     template: function (data) {
                //         var date = new Date(data.createdDate);
                //         var month = date.getMonth() + 1;
                //         var dt = date.getDate();
                //         if (dt < 10) dt = "0" + dt;
                //         if (month < 10) month = "0" + month;
                //         return dt + "/" + month + "/" + date.getFullYear();
                //     },
                // },
                {
                    field: "offerStatus",
                    title: "Statut",
                    width: 100,
                    sortable: false,
                    template: function (data) {
                        const status = {
                            0: {
                                title: "Nouveau",
                                class: "btn-status-new",
                            },
                            1: {
                                title: "Active",
                                class: "btn-label-success",
                            },
                            2: {
                                title: "Removed",
                                class: "btn-label-danger",
                            },
                            3: {
                                title: "En cours",
                                class: "btn-status-encours",
                            },
                        };
                        return `<span class="btn btn-bold btn-sm btn-font-sm btn-block ${
                            status[data.status].class
                        }">${status[data.status].title}</span>`;
                    },
                },
            ],
        });
    };

    var updateTotal = function () {
        datatable.on("kt-datatable--on-layout-updated", function () {
            $("#kt_subheader_total").html(datatable.getTotalRows() + " Total");
        });
    };

    var addEvent = function () {
        datatable.on("kt-datatable--on-layout-updated", function () {
            initTokenSecurity();
        });
    };

    $("#edit-course-order").click(function () {
        $.ajax({
            url: `${environment}/courses?accessLevel=1`,
            type: "GET",
            dataType: "json",
            success: function (data) {
                console.log(data);
                for (let i = 0; i < data.length; i++) {
                    let output = `<div class="p-2">${data[i].title}</div>`;
                    $("#course-list").append(output);
                }
                $("#modal").css("display", "flex");
            }, //success
            error: function () {
                console.log("error: cannot call api");
            }, //error
        }); //ajax
    });

    $("#close-modal").click(function () {
        $("#modal").css("display", "none");
    });

    return {
        // public functions
        init: function () {
            init();
            updateTotal();
            addEvent();
        },
    };
})();

// On document ready
KTUtil.ready(function () {
    KTUserListDatatable.init();
});
