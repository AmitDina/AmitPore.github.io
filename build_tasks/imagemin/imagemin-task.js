var imagemin;

imagemin = {
    dynamic: {
        files: [{
            expand: true,
            cwd: "<%= imgDir %>/raw",
            src: ["**/*.{png,jpg,gif}"],
            dest: "<%= imgDir %>/public"
        }]
    }
};

module.exports = imagemin;