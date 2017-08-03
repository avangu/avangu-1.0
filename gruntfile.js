
var env = process.env;
    
// get build version
function getBuildVersion(packageInfo) {
    // Build Version: {major.minor.revision}
    var metadata = '';

    if (env.BUILD_NUMBER) {
        var branch = env.GIT_BRANCH;
        metadata = 'opensource';
        if (branch) {
            metadata += '_' + branch.replace(/^origin\//, '').replace(/[^0-9A-Za-z-]/g, '-');
        }
        metadata += '.' + env.BUILD_NUMBER;
    } else {
        var now = new Date();
        now.setTime(now.getTime()-now.getTimezoneOffset()*60000);
        metadata = 'local.' + now.toISOString().replace(/[\.\-:T]/g, '-').replace(/Z|\.\d/g, '');
    }
    return packageInfo.version +'+'+ metadata;
}

module.exports = function(grunt) {

    // require('load-grunt-tasks')(grunt);

    var packageInfo = grunt.file.readJSON('package.json');
    var buildVersion = getBuildVersion(packageInfo);

    //console.log('%s v%s', packageInfo.name, buildVersion);

    // Project configuration.
    grunt.initConfig({
        pkg: packageInfo,

        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
                '* Copyright (c) <%= grunt.template.today("yyyy") %> */\n',
        
        // testing task [karma, jsint etc]
        
        // sass to css
        sass: {
            dist: {
                options: {
                    style: 'expanded'
                },
                files: {
                    'src/css/skins/default/avangu.css': 'src/sass/skins/default/avangu.scss',
                    'src/css/skins/test/avangu.css': 'src/sass/skins/test/avangu.scss'
                }
            }
        },
        
        // css minify task
        cssmin: {
            css: {
                files: {
                    'src/css/skins/default/avangu.min.css' : 'src/css/skins/default/avangu.css',
                    'src/css/skins/test/avangu.min.css' : 'src/css/skins/test/avangu.css'
                }
            }      
        },

        // concat js files
        concat: {
            avangu: {
                src: [ 'src/js/avangu.js',
                       'src/js/avangu.controller.js',
                       'src/js/avangu.directive.js',
                       'src/js/avangu-player.js'
                ],
                dest:  'dist/avangu/js/avangu.js'
            },
            avanguPluginsControls: {
                src: [ 'src/js/plugins/avangu-controls/avangu-controls.js',
                       'src/js/plugins/avangu-controls/buttons/*.js',
                       'src/js/plugins/avangu-controls/widgets/*.js'
                ],
                dest:  'dist/avangu/js/plugins/avangu-controls.js'                
            },
            avanguPoster: {
                src: [ 'src/js/plugins/avangu-poster/avangu-poster.js'
                ],
                dest:  'dist/avangu/js/plugins/avangu-poster.js'                
            },
        },
        // uglify/minify js files
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
                        '* Copyright (c) <%= grunt.template.today("yyyy") %> */\n'
              },
            js: {
                files: {
                    'dist/avangu/js/avangu.min.js' : ['dist/avangu/js/avangu.js'],
                    'dist/avangu/js/plugins/avangu-controls.min.js' : ['dist/avangu/js/plugins/avangu-controls.js'],
                    'dist/avangu/js/plugins/avangu-poster.min.js' : ['dist/avangu/js/plugins/avangu-poster.js']
                }
            }

        },

        copy: {
            main: {
                files: [
                    // copy fonts
                    {
                        expand: true,
                        cwd: 'src/css/fonts',
                        src: ['*'],
                        dest: 'dist/avangu/css/fonts',
                        filter: 'isFile'
                    },  
                    // copy skins 
                    {
                        expand: true,
                        cwd: 'src/css/skins/',
                        src: ['**'],
                        dest: 'dist/avangu/css/skins/'
                    }
                ]
            },
            release: {
                files: [
                    // copy avangu to app
                    {
                        expand: true,
                        cwd: 'dist/avangu',
                        src: ['**'],
                        dest: 'dist/avangu-' + packageInfo.version + '/',
                        filter: 'isFile'
                    }
                ]
            },
            app: {
                files: [
                    // copy avangu to app
                    {
                        expand: true,
                        cwd: 'dist/avangu',
                        src: ['**'],
                        dest: 'app/components/avangu'
                    },  
                ]
            }
        },
        
        clean: {
            build: [
                "build"
            ],
            docs: [
                "docs"
            ]
        },
        
        ngdocs: {
            options: {
                dest: 'docs',
                html5Mode: false
            },
            api: {
                title: "API Reference",
                src: [
                    'src/js/**/*.js'
                ]
            }
        }
    });

    // Load the plugin that provides the "sass to css" task.
    // grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-sass');
    // Load the plugin that provides the "css min" task.
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    // Load the plugin that provides the "concat" task.
    grunt.loadNpmTasks('grunt-contrib-concat');
    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    // Load the plugin that provides the "copy" task.    
    grunt.loadNpmTasks('grunt-contrib-copy');
    // Load the plugin that provides the "clean" task.
    grunt.loadNpmTasks('grunt-contrib-clean');
    // Load the plugin that provides the "ng-docs" task.
    grunt.loadNpmTasks('grunt-ngdocs');
    // Load the plugin that provides the "watch" task.
    grunt.loadNpmTasks('grunt-contrib-watch');
    
    // default task(s).
    grunt.registerTask('default', ['clean:build', 'sass', 'cssmin:css', 'concat', 'uglify:js', 'copy:main', 'copy:release', 'copy:app']);
    // docs task(s).
    grunt.registerTask('docs', ['clean:docs', 'ngdocs']);
    // test task(s).
    grunt.registerTask('test', ['karma:test']);
};