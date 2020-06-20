import { LimiterAudioWorkletProcessor } from '../../src/limiter-audio-worklet-processor';
import { generateRandomChannelDataAboveThreshold } from '../helpers/generate-random-channel-data-above-threshold';
import { generateRandomChannelDataBelowThreshold } from '../helpers/generate-random-channel-data-below-threshold';
import { generateRandomChannelDataOutsideNominalRange } from '../helpers/generate-random-channel-data-outside-nominal-range';
import { generateSilentChannelData } from '../helpers/generate-silent-channel-data';

describe('LimiterAudioWorkletProcessor', () => {
    describe('constructor()', () => {
        let options;

        beforeEach(() => {
            options = {
                channelCount: 2,
                channelCountMode: 'explicit',
                numberOfInputs: 1,
                numberOfOutputs: 1,
                outputChannelCount: [2]
            };
        });

        describe('with an attack that is not a number', () => {
            beforeEach(() => {
                options.processorOptions = { attack: 'something other than a number' };
            });

            it('should throw an error', () => {
                expect(() => new LimiterAudioWorkletProcessor(options)).to.throw(Error, 'The attack needs to be of type "number".');
            });
        });

        describe('with an attack that is below zero', () => {
            beforeEach(() => {
                options.processorOptions = { attack: -3 };
            });

            it('should throw an error', () => {
                expect(() => new LimiterAudioWorkletProcessor(options)).to.throw(Error, "The attack can't be negative.");
            });
        });

        describe('without a matching channelCount', () => {
            beforeEach(() => {
                options.channelCount = 1;
            });

            it('should throw an error', () => {
                expect(() => new LimiterAudioWorkletProcessor(options)).to.throw(
                    Error,
                    'The channelCount must be the same as the outputChannelCount of the first output.'
                );
            });
        });

        describe('with an channelCountMode other the explicit', () => {
            beforeEach(() => {
                options.channelCountMode = 'max';
            });

            it('should throw an error', () => {
                expect(() => new LimiterAudioWorkletProcessor(options)).to.throw(Error, 'The channelCountMode needs to be "explicit".');
            });
        });

        describe('with a numberOfInputs other than 1', () => {
            beforeEach(() => {
                options.numberOfInputs = 2;
            });

            it('should throw an error', () => {
                expect(() => new LimiterAudioWorkletProcessor(options)).to.throw(Error, 'The numberOfInputs must be 1.');
            });
        });

        describe('with a numberOfOutputs other than 1', () => {
            beforeEach(() => {
                options.numberOfOutputs = 0;
            });

            it('should throw an error', () => {
                expect(() => new LimiterAudioWorkletProcessor(options)).to.throw(Error, 'The numberOfOutputs must be 1.');
            });
        });

        describe('without a defined outputChannelCount', () => {
            beforeEach(() => {
                delete options.outputChannelCount;
            });

            it('should throw an error', () => {
                expect(() => new LimiterAudioWorkletProcessor(options)).to.throw(
                    Error,
                    'The channelCount must be the same as the outputChannelCount of the first output.'
                );
            });
        });

        describe('without a matching outputChannelCount', () => {
            beforeEach(() => {
                options.outputChannelCount = [3];
            });

            it('should throw an error', () => {
                expect(() => new LimiterAudioWorkletProcessor(options)).to.throw(
                    Error,
                    'The channelCount must be the same as the outputChannelCount of the first output.'
                );
            });
        });
    });

    describe('process()', () => {
        describe('without a specified attack', () => {
            let limiterAudioWorkletProcessor;

            beforeEach(() => {
                limiterAudioWorkletProcessor = new LimiterAudioWorkletProcessor({
                    channelCount: 1,
                    channelCountMode: 'explicit',
                    numberOfInputs: 1,
                    numberOfOutputs: 1,
                    outputChannelCount: [1]
                });
            });

            it('should return true', () => {
                expect(limiterAudioWorkletProcessor.process([[]], [[]])).to.be.true;
            });

            it('should pass through a signal below the threshold', () => {
                const inputs = [[generateRandomChannelDataBelowThreshold()]];
                const outputs = [[generateSilentChannelData()]];

                limiterAudioWorkletProcessor.process(inputs, outputs);

                expect(outputs).to.deep.equal(inputs);
            });

            it('should limit a signal above the threshold', () => {
                const inputs = [[generateRandomChannelDataAboveThreshold()]];
                const outputs = [[new Float32Array(inputs[0][0])]];

                limiterAudioWorkletProcessor.process(inputs, outputs);

                expect(outputs).to.not.deep.equal(inputs);
            });

            it('should limit a signal outside the nominal range', () => {
                const inputs = [[generateRandomChannelDataOutsideNominalRange()]];
                const outputs = [[new Float32Array(inputs[0][0])]];

                limiterAudioWorkletProcessor.process(inputs, outputs);

                for (const sample of outputs[0][0]) {
                    expect(sample).to.be.within(-1, 1);
                }
            });
        });

        describe('with a specified attack', () => {
            let limiterAudioWorkletProcessor;

            beforeEach(() => {
                limiterAudioWorkletProcessor = new LimiterAudioWorkletProcessor({
                    channelCount: 1,
                    channelCountMode: 'explicit',
                    numberOfInputs: 1,
                    numberOfOutputs: 1,
                    outputChannelCount: [1],
                    processorOptions: {
                        attack: 128 / sampleRate // eslint-disable-line no-undef
                    }
                });
            });

            it('should return true', () => {
                expect(limiterAudioWorkletProcessor.process([[]], [[]])).to.be.true;
            });

            it('should delay the signal by 128 samples', () => {
                const inputs = [[generateRandomChannelDataBelowThreshold()]];
                const outputs = [[new Float32Array(inputs[0][0])]];

                limiterAudioWorkletProcessor.process(inputs, outputs);

                expect(outputs).to.deep.equal([[generateSilentChannelData()]]);

                limiterAudioWorkletProcessor.process([[generateRandomChannelDataBelowThreshold()]], outputs);

                expect(outputs).to.deep.equal(inputs);
            });

            it('should limit a signal above the threshold', () => {
                const inputs = [[generateRandomChannelDataAboveThreshold()]];
                const outputs = [[new Float32Array(inputs[0][0])]];

                limiterAudioWorkletProcessor.process(inputs, [[generateSilentChannelData()]]);
                limiterAudioWorkletProcessor.process([[generateRandomChannelDataAboveThreshold()]], outputs);

                expect(outputs).to.not.deep.equal(inputs);
            });

            it('should limit a signal outside the nominal range', () => {
                const inputs = [[generateRandomChannelDataOutsideNominalRange()]];
                const outputs = [[new Float32Array(inputs[0][0])]];

                limiterAudioWorkletProcessor.process(inputs, [[generateSilentChannelData()]]);
                limiterAudioWorkletProcessor.process([[generateRandomChannelDataOutsideNominalRange()]], outputs);

                for (const sample of outputs[0][0]) {
                    expect(sample).to.be.within(-1, 1);
                }
            });
        });
    });
});
