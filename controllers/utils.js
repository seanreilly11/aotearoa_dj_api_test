function isActive() {
    return { $ne: 2 };
}

module.exports = { isActive };
