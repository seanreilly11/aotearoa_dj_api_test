$(document).ready(function () {
    const environment = config.env;
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const token = urlParams.get("token");
    const userId = JSON.parse(localStorage.getItem("passport")).userId;

    $("#add-course__form").submit(function (e) {
        e.preventDefault();
        showLoader();
        const title = $("#add-course__title").val();
        const description = $("#add-course__desc").val();
        const difficulty = $("[name=add-course__difficulty]:checked").val();
        const category = $("#add-course__category").val();
        const body = {
            title,
            description,
            difficulty,
            category,
            creatorId: userId,
        };

        $.ajax({
            url: `${environment}/courses`,
            headers: {
                Accept: "/*/",
                "Content-Type": "application/json",
            },
            type: "POST",
            dataType: "json",
            data: JSON.stringify(body),
            success: function (data) {
                Swal.fire({
                    title: "Course created successfully",
                    text: "You will now be redirected to the course page",
                    icon: "success",
                    confirmButtonColor: "#3085d6",
                    confirmButtonText: "Okay",
                    timer: 2500,
                }).then(() =>
                    window.location.replace(
                        `custom/course/overview.html?courseId=${data._id}&token=` + token
                    )
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
