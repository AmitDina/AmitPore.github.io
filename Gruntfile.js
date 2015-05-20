module.exports = function (grunt) {
    var matchdep;

    matchdep = require("matchdep");

    matchdep.filterDev("grunt-*").forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        cssDir: "./assets/css",
        imgDir: "./assets/img",

        cssmin:     require("./build_tasks/cssmin/cssmin-task.js"),
        imagemin:   require("./build_tasks/imagemin/imagemin-task.js"),
        sass:       require("./build_tasks/sass/sass-task.js"),
        watch:      require("./build_tasks/watch/watch-task.js")
    });

    grunt.registerTask("build", ["sass", "cssmin", "imagemin"]);

    grunt.registerTask("start", ["build", "watch"]);

    grunt.registerTask("default", ["start"]);
};