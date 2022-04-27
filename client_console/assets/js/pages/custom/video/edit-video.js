$(document).ready(function () {
    const environment = config.env;
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const videoId = urlParams.get("videoId");

    $.ajax({
        url: `${environment}/videos/${videoId}`,
        type: "GET",
        dataType: "json",
        success: function (data) {
            console.log(data);
            $("#edit-video__title").val(data.title);
            $("#edit-video__desc").text(data.description);
            $(`input[name=edit-video__difficulty][value=${Math.floor(data.difficulty)}]`).prop(
                "checked",
                true
            );
            $("#edit-video__videoLink").val(data.videoURI);
        }, //success
        error: function () {
            console.log("error: cannot call api");
        }, //error
    }); //ajax

    $("#edit-video__form").submit(function (e) {
        e.preventDefault();
        showLoader();
        const title = $("#edit-video__title").val();
        const description = $("#edit-video__desc").val();
        const difficulty = $("[name=edit-video__difficulty]:checked").val();
        const videoURI = $("#edit-video__videoLink").val();
        const body = { title, description, difficulty, videoURI };

        $.ajax({
            url: `${environment}/videos/${videoId}`,
            headers: {
                Accept: "/*/",
                "Content-Type": "application/json",
            },
            type: "PATCH",
            dataType: "json",
            data: JSON.stringify(body),
            success: function (data) {
                window.history.back();
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
