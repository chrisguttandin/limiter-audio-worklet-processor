const { env } = require('process');
const { DefinePlugin } = require('webpack');

module.exports = (config) => {
    config.set({
        basePath: '../../',

        browserDisconnectTimeout: 100000,

        browserNoActivityTimeout: 100000,

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
                        self.registerProcessor = () => { };
                        self.sampleRate = 44100;
                    })(self);`
                },
                mocha: {
                    bail: true,
                    timeout: 20000
                },
                pattern: [
                    '/absolute**',
                    '/absolute/**',
                    '**/chai/**',
                    '**/leche/**',
                    '**/lolex/**',
                    '**/mocha/**',
                    '**/sinon/**',
                    '**/sinon-chai/**',
                    'test/unit/**/*.js'
                ]
            }
        },

        concurrency: 1,

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

        frameworks: ['mocha-webworker', 'sinon-chai', 'webpack'],

        preprocessors: {
            'src/**/!(*.d).ts': 'webpack',
            'test/unit/**/*.js': 'webpack'
        },

        reporters: ['dots'],

        webpack: {
            mode: 'development',
            module: {
                rules: [
                    {
                        test: /\.ts?$/,
                        use: {
                            loader: 'ts-loader',
                            options: {
                                compilerOptions: {
                                    declaration: false,
                                    declarationMap: false
                                }
                            }
                        }
                    }
                ]
            },
            plugins: [
                new DefinePlugin({
                    'process.env': {
                        CI: JSON.stringify(env.CI)
                    }
                })
            ],
            resolve: {
                extensions: ['.js', '.ts'],
                fallback: { util: false }
            }
        },

        webpackMiddleware: {
            noInfo: true
        }
    });

    if (env.CI) {
        config.set({
            browsers:
                env.TARGET === 'chrome'
                    ? ['ChromeSauceLabs']
                    : env.TARGET === 'firefox'
                    ? ['FirefoxSauceLabs']
                    : env.TARGET === 'safari'
                    ? ['SafariSauceLabs']
                    : ['ChromeSauceLabs', 'FirefoxSauceLabs', 'SafariSauceLabs'],

            captureTimeout: 300000,

            customLaunchers: {
                ChromeSauceLabs: {
                    base: 'SauceLabs',
                    browserName: 'chrome',
                    captureTimeout: 300,
                    platform: 'macOS 12'
                },
                FirefoxSauceLabs: {
                    base: 'SauceLabs',
                    browserName: 'firefox',
                    captureTimeout: 300,
                    geckodriverVersion: '0.30.0',
                    platform: 'macOS 12'
                },
                SafariSauceLabs: {
                    base: 'SauceLabs',
                    browserName: 'safari',
                    captureTimeout: 300,
                    platform: 'macOS 12'
                }
            },

            sauceLabs: {
                recordVideo: false
            }
        });
    } else {
        config.set({
            browsers: ['ChromeCanaryHeadless', 'ChromeHeadless', 'FirefoxDeveloperHeadless', 'FirefoxHeadless', 'Safari']
        });
    }
};
