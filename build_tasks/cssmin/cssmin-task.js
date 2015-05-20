var cssmin;

cssmin = {
    dist: {
        files: {
            "<%= cssDir %>/style.min.css": "<%= cssDir %>/style.css"
        }
    }
};

module.exports = cssmin;