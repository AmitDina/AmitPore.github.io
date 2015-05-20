var watch;

watch = {
    dist: {
        files: [
            "./assets/**/*",
            "!<%= cssDir %>/style.css",
            "!<%= cssDir %>/style.min.css",
            "!<%= imgDir %>/public/**/*",
        ],
        tasks: ["build"]
    }
};

module.exports = watch;