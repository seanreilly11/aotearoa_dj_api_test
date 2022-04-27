var gbIpClient;
var redirectURL = "https://www.aotearoadjacadmey.com";
const validLoginURL = "map.html";

var urlParam = function (name) {
    var results = new RegExp("[?&]" + name + "=([^&#]*)").exec(window.location.href);
    if (results == null) {
        return null;
    }
    return decodeURI(results[1]) || 0;
};

function initTokenSecurity() {
    //Check if session is set
    if (urlParam("token") == "" || urlParam("token") == null) window.location.replace("./");

    //check localstorage
    if (!localStorage.hasOwnProperty("passport")) window.location.replace("./");

    // retrieve passport object
    var fetchedPassport = localStorage.getItem("passport");
    var userPassport = JSON.parse(fetchedPassport);

    //verify security token vs URL
    if (urlParam("token") != userPassport.securityKey) window.location.replace("./");

    //set user information
    $("#userId").text(userPassport.firstname);
    $("#userLetter").text(userPassport.firstname.charAt(0).toUpperCase());
    $("#userLetter1").text(userPassport.firstname.charAt(0).toUpperCase());
    $("#userFullId").text(userPassport.firstname);

    //Initiate Security : Menu
    $("a[href]:not(.no-token").each(function () {
        var oldUrl = $(this).attr("href"); // Get current url
        const char = oldUrl.endsWith(".html") ? "?" : "&";
        if (
            oldUrl &&
            !oldUrl.includes("token=") &&
            !oldUrl.startsWith("#") &&
            oldUrl !== "index.html"
        ) {
            var newUrl = oldUrl + char + "token=" + urlParam("token"); // Create new url
            $(this).attr("href", newUrl); // Set herf value
        }
    });
}
