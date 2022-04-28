$(document).ready(function () {
    const environment = config.env;
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const courseId = urlParams.get("courseId");

    $.ajax({
        url: `${environment}/courses/${courseId}?accessLevel=1`,
        type: "GET",
        dataType: "json",
        success: function (data) {
            console.log(data);
            document.title += " | " + data.title;
            $("#coursepage_title").text(data.title);
            $("#coursepage_category").text(data.category);
            $("#coursepage_students").text(data.totalStudents);
            $("#coursepage_difficulty").text(difficulty[data.difficulty].title);
            $("#coursepage_status").text(status[data.status].title);
            $("#coursepage_status").addClass(status[data.status].class);
            $("#coursepage_desc").text(data.description);
            $("#coursepage_editlink").attr(
                "href",
                "custom/course/edit-course.html?courseId=" + data._id
            );
            $("#coursepage_newvideolink").attr(
                "href",
                "custom/video/add-video.html?courseId=" + data._id
            );

            printVideos(data.videos);
        }, //success
        error: function () {
            console.log("error: cannot call api");
        }, //error
    }); //ajax

    function printVideos(data) {
        if (data.length > 0) {
            for (let i = 0; i < data.length; i++) {
                var output = `<li class="kt-widget2__item kt-widget2__item--primary">
                            <div class="kt-widget2__info ml-5">
                                <a href="custom/video/overview.html?videoId=${
                                    data[i]._id
                                }" class="kt-widget2__title">
                                ${data[i].title}
                                </a>
                                <span class="kt-widget2__username">
                                    ${data[i].views} views
                                </span>
                            </div>
                            <div class="kt-widget2__actions">
                            <span class="btn btn-bold btn-sm btn-font-sm ${
                                status[data[i].status].class
                            }">${status[data[i].status].title}</span>
                            </div>
                        </li>`;
                $("#coursepage_videos").append(output);
            }
        } else {
            let output = `<div class="d-flex justify-content-center align-items-center flex-column">
                            <img src="asset/images/empty-folder.png" width="150" />
                            <h5>Looks like you've got no videos in this course</h5>
                            <p>Add a new video to the course to see it here</p>
                        </div>`;
            $("#coursepage_videos").append(output);
        }

        initTokenSecurity();
    }

    // var actionReportedItem = function (itemId, type) {
    //     $.ajax({
    //         headers: {
    //             Accept: "*/*",
    //             "Content-Type": "application/json",
    //         },
    //         type: "PUT",
    //         dataType: "text",
    //         contentType: "application/json",
    //         url: `${environment}/api/office/${type}`,
    //         data: JSON.stringify(itemId),
    //         success: function (data, textStatus, xhr) {
    //             // probably need this below stuff v
    //             if (data === 0) window.location.replace("reported.html");
    //             else {
    //                 var redirect = `custom/apps/user/tribe/overview.html${queries[0]}&${queries[1]}&status=${data}&${queries[3]}`;
    //                 window.location.replace(redirect);
    //             }
    //         }, //success
    //         error: function () {
    //             console.log("error: cannot call api");
    //         }, //error
    //     }); //ajax
    // };

    $(".close-message-image").click(function () {
        $(".message-image-modal-outer").fadeOut();
    });
});
