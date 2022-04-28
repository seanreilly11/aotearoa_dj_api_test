$(document).ready(function () {
    const environment = config.env;
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const courseId = urlParams.get("courseId");
    const token = urlParams.get("token");
    const userId = JSON.parse(localStorage.getItem("passport")).userId;

    $("#add-video__form").submit(function (e) {
        e.preventDefault();
        showLoader();
        const title = $("#add-video__title").val();
        const description = $("#add-video__desc").val();
        const difficulty = $("[name=add-video__difficulty]:checked").val();
        const videoURI = $("#add-video__videoLink").val();

        const body = {
            title,
            description,
            difficulty,
            courseId,
            videoURI,
            creatorId: userId,
        };

        $.ajax({
            url: `${environment}/videos`,
            headers: {
                Accept: "/*/",
                "Content-Type": "application/json",
            },
            type: "POST",
            dataType: "json",
            data: JSON.stringify(body),
            success: function (data) {
                Swal.fire({
                    title: "Video created successfully",
                    text: "You will now be redirected to the video page",
                    icon: "success",
                    confirmButtonColor: "#3085d6",
                    confirmButtonText: "Okay",
                    timer: 2500,
                }).then(() =>
                    window.location.replace(
                        `custom/video/overview.html?videoId=${data._id}&token=` + token
                    )
                );
            }, //success
            error: function () {
                console.log("error: cannot call api");
                Swal.fire({
                    title: "Sorry an error occurred",
                    text: "Please try again later",
                    icon: "danger",
                    confirmButtonColor: "#3085d6",
                    confirmButtonText: "Okay",
                    timer: 2500,
                }).then(() => window.location.replace(`courses.html?token=` + token));
            }, //error
        }); //ajax
    });

    const showLoader = () => $("#loader").css("display", "flex");
    const hideLoader = () => $("#loader").css("display", "none");

    // $("#add-video__form").submit(function (e) {
    //     e.preventDefault();
    //     const title = $("#add-video__title").val();
    //     const description = $("#add-video__desc").val();
    //     const difficulty = $("#add-video__difficulty").val();
    //     const file = $("#add-video__videofile")[0].files[0];

    //     var formData = new FormData();
    //     formData.append("uploaded_file", file);
    //     formData.append("title", title);
    //     formData.append("description", description);
    //     formData.append("difficulty", difficulty);
    //     formData.append("courseId", courseId);
    //     formData.append("creatorId", userId);

    //     console.log(formData.get("uploaded_file"));

    //     $.ajax({
    //         url: `${environment}/videos`,
    //         headers: {
    //             Accept: "/*/",
    //         },
    //         type: "POST",
    //         data: formData,
    //         processData: false,
    //         contentType: false,
    //         success: function (data) {
    //             console.log(data);
    //             // window.location.replace(
    //             //     "custom/course/overview.html?courseId=" + courseId + "&token=" + token
    //             // ;
    //         }, //success
    //         error: function (a, b, c) {
    //             console.log("error: cannot call api");
    //             console.log(a);
    //             console.log(b);
    //             console.log(c);
    //         }, //error
    //     }); //ajax
    // });
});
