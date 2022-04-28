function isValidAvatarImage(img) {
    return img.startsWith("avatar") || img.startsWith("Neutral") || img.startsWith("expert");
}

function formatRemainingTime(time) {
    time = time.replace(/:/g, ".");
    var array = time.split(".");
    var string = array[array.length - 1] + "s";
    if (array.length >= 2) string = array[array.length - 2] + "m " + string;
    if (array.length >= 3) string = array[array.length - 3] + "h " + string;
    if (array.length >= 4) string = array[array.length - 4] + "j " + string;

    return string;
}

function formatDateDDMMYYY(_date) {
    if (_date) {
        const date = new Date(_date);
        const properMonth = date.getMonth() + 1;

        const day = date.getDate() >= 10 ? date.getDate() : "0" + date.getDate();
        const month = properMonth >= 10 ? properMonth : "0" + properMonth;

        return day + "/" + month + "/" + date.getFullYear();
    }
}

function getTimeAgo(time) {
    const date = new Date(time);
    const DAY_IN_MS = 86400000;
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    // comparison values
    const today = new Date();
    const yesterday = new Date(today - DAY_IN_MS);
    const seconds = Math.round((today - date) / 1000);
    const minutes2 = Math.round(seconds / 60);
    const isToday = today.toDateString() === date.toDateString();
    const isYesterday = yesterday.toDateString() === date.toDateString();

    if (minutes < 10) minutes = `0${minutes}`;

    if (seconds < 10) return "à l'instant";
    else if (seconds < 60) return `Il y a ${seconds} secondes`;
    else if (seconds < 100) return "Il y a vers une minute";
    else if (minutes2 < 60) return `Il y a ${minutes2} minutes`;
    else if (isToday) return `Aujourd'hui à ${hours}:${minutes}`;
    else if (isYesterday) return `Hier à ${hours}:${minutes}`;
    else return `${day}/${month}/${year} ${hours}:${minutes}`;
}

function getIconBgColor(status) {
    return status === 0
        ? "darkOrange"
        : status === 3
        ? "deepSkyBlue"
        : status === 4 || status === 5
        ? "steelBlue"
        : "limeGreen";
}

const status = {
    0: {
        title: "Unknown",
        class: "btn-status-new",
    },
    1: {
        title: "Active",
        class: "btn-label-success",
    },
    2: {
        title: "Removed",
        class: "btn-label-danger",
    },
    3: {
        title: "En cours",
        class: "btn-status-encours",
    },
};

const difficulty = {
    0: {
        title: "Unknown",
        class: "btn-status-new",
    },
    1: {
        title: "Beginner",
        class: "btn-label-success",
    },
    2: {
        title: "Intermediate",
        class: "btn-label-danger",
    },
    3: {
        title: "Advanced",
        class: "btn-status-encours",
    },
};
