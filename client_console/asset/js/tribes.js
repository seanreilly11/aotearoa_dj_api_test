var gbIpClient;
var redirectURL = "https://www.crosscall.com";
const validLoginURL = "map.html";

//To add into the db
const ListIp = [
    "86.206.81.199",
    "77.196.142.90",
    "92.184.110.105",
    "195.200.183.178",
    "222.153.55.42",
];

var urlParam = function (name) {
    var results = new RegExp("[?&]" + name + "=([^&#]*)").exec(
        window.location.href
    );
    if (results == null) {
        return null;
    }
    return decodeURI(results[1]) || 0;
};

function getValue() {
    var ipValue;
    var json_data = $.ajax({
        url: "http://www.geoplugin.net/json.gp",
        async: false,
    }).responseText;

    json_data = json_data.replace("{", "");
    json_data = json_data.replace("}", "");
    const searchRegExp = /\"/g;
    json_data = json_data.replace(searchRegExp, "");
    json_data = json_data.replace(/\n/g, "");
    json_data = json_data.replace(/ /g, "");

    var results = json_data.split(",");

    for (var i in results) {
        var item = results[i].split(":");
        var cpt = item.findIndex((fruit) => fruit === "geoplugin_request");

        if (cpt != -1) ipValue = item[1];
    }

    return ipValue;
}

function checkSecurity(ipClient) {
    //alert(ipClient);
    //Need API Call - for now a hard value is sufficient
    var isIpAuthorised = ListIp.includes(ipClient);
    isIpAuthorised = true;

    if (isIpAuthorised) {
        gbIpClient = ipClient;

        $("mainBoard").addClass("kt-grid kt-grid--ver kt-grid--root");
        $("#ipMarker").text(gbIpClient);
    } else {
        $("#mainBoard").css("display", "none");
        $("#ipMarker").text("Please wait...");
        window.location.replace(redirectURL);
    }
}

function initTokenSecurity() {
    //Check if session is set
    if (urlParam("token") == "" || urlParam("token") == null)
        window.location.replace("./");

    //check localstorage
    if (!localStorage.hasOwnProperty("passport")) window.location.replace("./");

    // retrieve passport object
    var fetchedPassport = localStorage.getItem("passport");
    var userPassport = JSON.parse(fetchedPassport);

    //verify security token vs URL
    if (urlParam("token") != userPassport.securityKey)
        window.location.replace("./");

    //set user information
    $("#userId").text(userPassport.firstname);
    $("#userLetter").text(userPassport.firstname.charAt(0).toUpperCase());
    $("#userLetter1").text(userPassport.firstname.charAt(0).toUpperCase());
    $("#userFullId").text(userPassport.firstname + " " + userPassport.surname);

    //Initiate Security : Menu
    $("a[href]:not(.no-token").each(function () {
        var oldUrl = $(this).attr("href"); // Get current url
        const char = oldUrl.endsWith(".html") ? "?" : "&";
        if (oldUrl && !oldUrl.includes("token=") && !oldUrl.startsWith("#")) {
            var newUrl = oldUrl + char + "token=" + urlParam("token"); // Create new url
            $(this).attr("href", newUrl); // Set herf value
        }
    });
}
