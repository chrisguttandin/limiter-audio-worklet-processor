const { env } = require('process');

module.exports = (config) => {
    config.set({
        basePath: '../../',

        browserNoActivityTimeout: 420000,

        client: {
            mochaWebWorker: {
                evaluate: {
                    // This is basically a part of the functionality which karma-sinon-chai would provide in a Window.
                    beforeRun: `(function(self) {
                        self.expect = self.chai.expect;
                    })(self);`,
                    beforeScripts: `(function(self) {
                        self.AudioWorkletProcessor = class { };
                        self.currentFrame = 0;
                        self.currentTime = 0;
                        self.sampleRate = 44100;
                    })(self);`
                },
                pattern: ['**/chai/**', '**/leche/**', '**/lolex/**', '**/sinon/**', '**/sinon-chai/**', 'test/unit/**/*.js']
            }
        },

        files: [
            {
                included: false,
                pattern: 'src/**',
                served: true,
                watched: true
            },
            {
                included: false,
                pattern: 'test/unit/**/*.js',
                served: true,
                watched: true
            }
        ],

        frameworks: ['mocha-webworker', 'sinon-chai'],

        mime: {
            'text/x-typescript': ['ts', 'tsx']
        },

        preprocessors: {
            'src/**/(!*.d).ts': 'webpack',
            'test/unit/**/*.js': 'webpack'
        },

        webpack: {
            mode: 'development',
            module: {
                rules: [
                    {
                        test: /\.ts?$/,
                        use: {
                            loader: 'ts-loader'
                        }
                    }
                ]
            },
            resolve: {
                extensions: ['.js', '.ts']
            }
        },

        webpackMiddleware: {
            noInfo: true
        }
    });

    if (env.TRAVIS) {
        config.set({
            browsers: [
                'ChromeSauceLabs',
                'FirefoxSauceLabs'
                // @todo Run tests on 'SafariSauceLabs' again when Safari 12 is supported.
            ],

            captureTimeout: 120000,

            customLaunchers: {
                ChromeSauceLabs: {
                    base: 'SauceLabs',
                    browserName: 'chrome',
                    platform: 'OS X 10.13'
                },
                FirefoxSauceLabs: {
                    base: 'SauceLabs',
                    browserName: 'firefox',
                    platform: 'OS X 10.13'
                },
                SafariSauceLabs: {
                    base: 'SauceLabs',
                    browserName: 'safari',
                    platform: 'OS X 10.13'
                }
            },

            tunnelIdentifier: env.TRAVIS_JOB_NUMBER
        });
    } else {
        config.set({
            browsers: ['ChromeHeadless', 'ChromeCanaryHeadless', 'FirefoxHeadless', 'FirefoxDeveloperHeadless', 'Safari'],

            concurrency: 2
        });
    }
};
