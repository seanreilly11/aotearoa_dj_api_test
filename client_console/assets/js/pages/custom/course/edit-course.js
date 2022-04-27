$(document).ready(function () {
    const environment = config.env;
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const courseId = urlParams.get("courseId");
    const token = urlParams.get("token");

    // $("#coursepage_videos").sortable({
    //     start: function (event, ui) {
    //         console.log("sort statrt");
    //     },
    //     stop: function (event, ui) {
    //         console.log(ui);
    //     },
    // });

    $.ajax({
        url: `${environment}/courses/${courseId}`,
        type: "GET",
        dataType: "json",
        success: function (data) {
            console.log(data);
            $("#edit-course__title").val(data.title);
            $("#edit-course__desc").val(data.description);
            $(`input[name=edit-course__difficulty][value=${data.difficulty}]`).prop(
                "checked",
                true
            );
            $("#edit-course__category").val(data.category);

            printVideos(data.videos);
        }, //success
        error: function () {
            console.log("error: cannot call api");
        }, //error
    }); //ajax

    function printVideos(data) {
        for (let i = 0; i < data.length; i++) {
            var output = `<div class="edit-course--video">
                            <h6>${data[i].title}</h6>
                        </div>`;

            $("#edit-course__videos").append(output);
        }
        initTokenSecurity();
    }

    $("#edit-course__form").submit(function (e) {
        e.preventDefault();
        showLoader();
        const title = $("#edit-course__title").val();
        const description = $("#edit-course__desc").val();
        const difficulty = $("[name=edit-course__difficulty]:checked").val();
        const category = $("#edit-course__category").val();
        const body = { title, description, difficulty, category };

        $.ajax({
            url: `${environment}/courses/${courseId}`,
            headers: {
                Accept: "/*/",
                "Content-Type": "application/json",
            },
            type: "PATCH",
            dataType: "json",
            data: JSON.stringify(body),
            success: function (data) {
                window.location.replace(
                    `custom/course/overview.html?courseId=${courseId}&token=${token}`
                );
            }, //success
            error: function () {
                console.log("error: cannot call api");
            }, //error
        }); //ajax
    });

    const showLoader = () => $("#loader").css("display", "flex");
    const hideLoader = () => $("#loader").css("display", "none");

    $(".close-message-image").click(function () {
        $(".message-image-modal-outer").fadeOut();
    });
});
