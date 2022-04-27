"use strict";

$("#edit_user__form").submit(function (e) {
    e.preventDefault();
    const firstname = $("#edit_user__firstname").val();
    const surname = $("#edit_user__lastname").val();
    const email = $("#edit_user__email").val();
    const telephone = $("#edit_user__telephone").val();
    const address = $("#edit_user__address").val();
    const postcode = $("#edit_user__postcode").val();
    const city = $("#edit_user__city").val();

    var item = { firstname, surname, email, telephone, address, postcode, city };
    console.log(item);
});
