module.exports = function(grunt) {
    require('time-grunt')(grunt);
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        APPID: '<APP ID>',
        GIT_ORIGIN: 'master',
        //JSHint Our JS files
        jshint: {
            options: {
                //Add JSHint options here
                strict: false,
                trailing: true,
                curly: true
            },
            client: {
                files: {
                    src: [
                        'client/default/js/**/*.js',
                        '!client/default/js/libs/**',
                        '!client/default/js/text.js'
                    ]
                }
            },
            cloud: {
                options: {
                    node: true
                },
                files: {
                    src: [
                        'cloud/**/*.js',
                        '!cloud/node_modules/**/*.js'
                    ]
                }
            }
        },
        //Usejs to put files into default dir
        requirejs: {
            compile: {
                options: {
                    removeCombined: true,
                    baseUrl: "client/default/js",
                    mainConfigFile: "client/default/js/main.js",
                    dir: "client/build/js",
                    modules: [{
                        name: "main"
                    }]
                }
            }
        },

        //Remove contents of default folder
        clean: {
            defaultFolders: {
                src: ['client/build']
            }
        },

        //Copy contents of default folder into www folder (ios & android)
        copy: {
            defaultFolder: {
                files: [{
                    expand: true,
                    cwd: 'client/default/',
                    src: ['css/ratchicons/**/*', 'imgs/**/*'],
                    dest: 'client/build'
                }]
            },
        },

        cssmin: {
            combine: {
                files: {
                    'client/build/css/styles.css': ['client/default/css/ratchet.css', 'client/default/css/style.css']
                }
            }
        },

        processhtml: {
            dist: {
                files: {
                    'client/build/index.html': ['client/default/index.html']
                }
            }
        },

        exec: {
            pullApp: {
                command: 'fhc git pull <%= APPID %>',
                stdout: true
            },
            stageApp: {
                command: 'fhc stage <%= APPID %>  --<%= grunt.config.get("deployTarget")%> <%= grunt.config.get("cleanDeploy")%>',
                stdout: true
            },
            commit: {
                command: 'git commit -am <%= grunt.config.get("commit.message")%> && git push origin <%= GIT_ORIGIN %>',
                stdout: true
            }
        },

        gitcommit: {
            task: {
                options: {
                    message: '<%= grunt.config.get("commit.message")%>'
                },
                files: {
                    src: ['**/*']
                }
            }
        },

        prompt: {
            build: {
                options: {
                    questions: [
                        {
                            config: 'commit.push',
                            type: 'confirm',
                            message: 'would you like to push changes?'
                        },
                        {
                            config: 'commit.message',
                            type: 'input',
                            message: 'Enter a commit message',
                            when: function(answers) {
                                return answers['commit.push'];
                            },

                        }
                    ],
                    then: function(results) {
                        if(grunt.config.get('commit.push')) {
                            grunt.task.run('gitcommit:task');
                        }
                    }
                }
            }
        },
        simplemocha: {
            options: {
                globals: ['expect'],
                timeout: 3000,
                ignoreLeaks: false,
                ui: 'bdd',
                reporter: 'Tap'
            },
            all: { src: ['cloud/tests/*.js'] }
        },

        sass: {
            options: {
                style: 'expanded',
                unixNewlines: true
            },
            dist: {
                files: {
                    'client/default/css/ratchet-nwr.css': 'client/default/sass/ratchet.scss',
                    'client/default/css/ratchet-nwr-theme-ios.css': 'client/default/sass/theme-ios.scss',
                    'client/default/css/ratchet-nwr-theme-android.css': 'client/default/sass/theme-android.scss'
                }
            }
        },

        csscomb: {
            options: {
                config: 'client/default/sass/.csscomb.json'
            },
            dist: {
                files: {
                    'client/default/css/ratchet-nwr.css': 'client/default/css/ratchet.css',
                    'client/default/css/ratchet-nwr-theme-android.css': 'client/default/css/ratchet-theme-android.css',
                    'client/default/css/ratchet-nwr-theme-ios.css': 'client/default/css/ratchet-theme-ios.css'
                }
            }
        },

        watch: {
            scripts: {
                files: ['client/default/sass/*.scss'],
                tasks: ['sass'],
                options: {
                    spawn: false
                }
            }
        }
    });


    //load our tasks
    require('load-grunt-tasks')(grunt, {scope: 'devDependencies'});

    var deployTarget = (typeof grunt.option('live') !== 'undefined') ? grunt.option('live') : false;
    var cleanDeploy = (typeof grunt.option('clean') !== 'undefined') ? grunt.option('clean') : false;


    //default tasks to run
    grunt.registerTask('build', ['jshint:client', 'jshint:cloud', 'clean:defaultFolders', 'requirejs', 'copy:defaultFolder', 'cssmin:combine', 'processhtml']);


    grunt.registerTask('stage', 'Stage App to FeedHenry', function() {
        grunt.config.set('deployTarget', 'dev');
        if(deployTarget === true) {
            grunt.config.set('deployTarget', 'live');
        }
        grunt.config.set('cleanDeploy', '');
        if(cleanDeploy === true) {
            grunt.config.set('cleanDeploy', '--clean');
        }
        grunt.task.run('exec:pullApp');
        if(deployTarget === true) {
            grunt.task.run('exec:stageApp');
        }
    });

    grunt.registerTask('test', ['simplemocha']);

    grunt.registerTask('dist-css', ['sass', 'csscomb']);

    grunt.event.on('watch', function(action, filepath, target) {
        grunt.log.writeln(target + ': ' + filepath + ' has ' + action);
    });
};

