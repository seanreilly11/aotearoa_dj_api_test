"use strict";

const environment = config.newEnv;
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const currentToken = urlParams.get("token");
let submitted = false;

$("#add_user__generate-password").click(function () {
    generatePassword();
    $(this).hide();
    $(".add_user__password-row").show();
});

$("#add_user__password-hide").click(function () {
    $("#add_user__password").attr("type", "password");
});

$("#add_user__password-cancel").click(function () {
    $("#add_user__generate-password").show();
    $(".add_user__password-row").hide();
    $("#add_user__password").attr("type", "text");
});

$("#add_user__form").submit(function (e) {
    e.preventDefault();
    const Firstname = $("#add_user__firstname").val();
    const Surname = $("#add_user__lastname").val();
    const Email = $("#add_user__email").val();
    const MobileNumber = $("#add_user__telephone").val();
    const AddressLine1 = $("#add_user__address").val();
    const Postcode = $("#add_user__postcode").val();
    const Town = $("#add_user__city").val();
    const Password = $("#add_user__password").val();

    var item = {
        Firstname,
        Surname,
        Email,
        MobileNumber,
        AddressLine1,
        Postcode,
        Town,
        Password,
        CompanyName: "Default",
    };

    $.ajax({
        headers: {
            Accept: "*/*",
            "Content-Type": "application/json",
            Data: JSON.stringify(item),
        },
        type: "POST",
        dataType: "text",
        contentType: "application/json",
        url: `${environment}/api/partner/RegisterUserEx`,
        data: JSON.stringify("text"),
        success: function () {
            $("#error-message--user-added .error-message").text(
                "Un nouvel utilisateur a été ajouté"
            );
            $("#error-message--user-added .error-message").addClass("error-message--success");
            $("#error-message--user-added").css("opacity", "1");
            submitted = true;
            setTimeout(() => window.location.replace("users.html?token=" + currentToken), 2000);
        }, //success
        error: function (xhr) {
            // if conflict show uh oh message
            if (xhr.status === 409) {
                $("#error-message--user-added .error-message").text(
                    "Cet email est déjà enregistré"
                );
                $("#error-message--user-added .error-message").addClass("error-message--error");
                $("#error-message--user-added").css("opacity", "1");
                $("#add_user__email").addClass("is-invalid");
                setTimeout(() => $("#error-message--user-added").css("opacity", "0"), 5000);
            } else console.log("error: cannot call api");
        }, //error
    }); //ajax
});

function generatePassword() {
    var length = 20,
        charset =
            "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789~!@#$%^&*()_-+{}:?><;",
        pwd = "";

    for (var i = 0, n = charset.length; i < length; ++i)
        pwd += charset.charAt(Math.floor(Math.random() * n));

    $("#add_user__password").val(pwd);
}

// confirm leave or update if any fields filled
window.onbeforeunload = function () {
    if (
        ($("#add_user__firstname").val() ||
            $("#add_user__lastname").val() ||
            $("#add_user__email").val() ||
            $("#add_user__telephone").val() ||
            $("#add_user__address").val() ||
            $("#add_user__postcode").val() ||
            $("#add_user__city").val()) &&
        !submitted
    )
        return true;
};
