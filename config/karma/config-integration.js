const { env } = require('process');

module.exports = (config) => {

    config.set({

        basePath: '../../',

        browserNoActivityTimeout: 20000,

        files: [
            {
                included: false,
                pattern: 'src/**',
                served: true,
                watched: true
            },
            'test/integration/**/*.js'
        ],

        frameworks: [
            'mocha',
            'sinon-chai'
        ],

        mime: {
            'text/x-typescript': [ 'ts', 'tsx' ]
        },

        preprocessors: {
            'src/**/!(*.d).ts': 'webpack',
            'test/integration/**/*.js': 'webpack'
        },

        webpack: {
            mode: 'development',
            module: {
                rules: [ {
                    test: /\.ts?$/,
                    use: {
                        loader: 'ts-loader'
                    }
                } ]
            },
            resolve: {
                extensions: [ '.js', '.ts' ]
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

            browsers: [
                'ChromeHeadless',
                'ChromeCanaryHeadless',
                'FirefoxHeadless',
                'FirefoxDeveloperHeadless',
                'Safari'
            ],

            concurrency: 2

        });

    }

};
