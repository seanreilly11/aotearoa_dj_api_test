"use strict";

// Class Definition
const oldEnvironment = config.oldEnv;
const environment = config.env;

var passport = {
    firstname: "",
    userId: "",
    securityKey: "",
};

var KTLoginV1 = (function () {
    var login = $("#kt_login");
    var test = "admin5@admin.com";

    var showErrorMsg = function (form, type, msg) {
        var alert = $(
            '<div class="alert alert-bold alert-solid-' +
                type +
                ' alert-dismissible" role="alert">\
			<div class="alert-text">' +
                msg +
                '</div>\
			<div class="alert-close">\
                <i class="flaticon2-cross kt-icon-sm" data-dismiss="alert"></i>\
            </div>\
		</div>'
        );

        //form.find('.alert').remove();
        alert.prependTo(form);
        KTUtil.animateClass(alert[0], "fadeIn animated");
    };

    var VerifyLogin = function (form, KTApp) {
        $.ajax({
            headers: {
                Accept: "*/*",
                "Content-Type": "application/json",
            },
            type: "POST",
            dataType: "json",
            contentType: "application/json",
            url: environment + "/users/adminlogin",
            data: JSON.stringify({
                email: $("#UserName").val(),
                password: $("#Password").val(),
            }),
            success: function (data) {
                showErrorMsg(
                    form,
                    "success",
                    "Security token initialisation...."
                );

                //Use LocalStorage to store the user Identity
                passport.firstname = data.firstname;
                passport.userId = data.uid;
                passport.securityKey = data.token;

                localStorage.setItem("passport", JSON.stringify(passport));

                //redirect user with a security token
                window.location.replace(validLoginURL + "?token=" + data.token);
            },
            error: function (xhr, status, error) {
                if (xhr.status === 401)
                    showErrorMsg(
                        form,
                        "danger",
                        "Incorrect username or password. Please try again."
                    );
                else if (xhr.status === 403)
                    showErrorMsg(
                        form,
                        "danger",
                        "Access denied. User is not admin."
                    );
                else if (xhr.status === 404)
                    showErrorMsg(
                        form,
                        "danger",
                        "User not found. Please try again."
                    );
                else
                    showErrorMsg(
                        form,
                        "danger",
                        "An error occurred. Please try again."
                    );
            },
        });
    };

    // Private Functions
    var handleSignInFormSubmit = function () {
        $("#kt_login_signin_submit").click(function (e) {
            e.preventDefault();

            var btn = $(this);
            var form = $("#kt_login_form");

            var info = $("#username").fieldValue();

            form.validate({
                rules: {
                    UserName: {
                        required: true,
                    },
                    Password: {
                        required: true,
                    },
                },
            });

            if (!form.valid()) {
                return;
            }

            KTApp.progress(btn[0]);
            VerifyLogin(form);

            setTimeout(function () {
                KTApp.unprogress(btn[0]);
            }, 1000);
        });
    };

    // Public Functions
    return {
        // public functions
        init: function () {
            handleSignInFormSubmit();
        },
    };
})();

// Class Initialization
jQuery(document).ready(function () {
    KTLoginV1.init();
});
