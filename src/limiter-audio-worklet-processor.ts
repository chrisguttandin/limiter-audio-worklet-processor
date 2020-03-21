import { IAudioWorkletProcessor } from './interfaces';

const ATTACK_TIME_SECONDS = 0;
const ATTACK_GAIN = Math.exp(-1 / (sampleRate * ATTACK_TIME_SECONDS));
const RELEASE_TIME_SECONDS = 0.5;
const RELEASE_GAIN = Math.exp(-1 / (sampleRate * RELEASE_TIME_SECONDS));
const THRESHOLD = 10 ** -0.1;

const computeEnvelope = (channelData: Float32Array, envelopeBuffer: Float32Array): void => {
    let previousEnvelopeValue = envelopeBuffer[127];

    for (let i = 0; i < 128; i += 1) {
        const absoluteValue = Math.abs(channelData[i]);
        const difference = previousEnvelopeValue - absoluteValue;

        if (previousEnvelopeValue < absoluteValue) {
            previousEnvelopeValue = absoluteValue + (ATTACK_GAIN * difference);
        } else {
            previousEnvelopeValue = absoluteValue + (RELEASE_GAIN * difference);
        }

        envelopeBuffer[i] = previousEnvelopeValue;
    }
};

export class LimiterAudioWorkletProcessor extends AudioWorkletProcessor implements IAudioWorkletProcessor {

    public static parameterDescriptors = [ ];

    private _envelopeBuffers: Float32Array[];

    constructor ({ channelCount, channelCountMode, numberOfInputs, numberOfOutputs, outputChannelCount }: AudioWorkletNodeOptions) {
        if (channelCountMode !== 'explicit') {
            throw new Error('The channelCountMode needs to be "explicit".');
        }

        if (numberOfInputs !== 1) {
            throw new Error('The numberOfInputs must be 1.');
        }

        if (numberOfOutputs !== 1) {
            throw new Error('The numberOfOutputs must be 1.');
        }

        if (outputChannelCount === undefined || channelCount !== outputChannelCount[0]) {
            throw new Error('The channelCount must be the same as the outputChannelCount of the first output.');
        }

        super();

        this._envelopeBuffers = Array.from({ length: channelCount }, () => new Float32Array(128));
    }

    public process ([ input ]: Float32Array[][], [ output ]: Float32Array[][]): boolean {
        const numberOfChannels = input.length;

        for (let channel = 0; channel < numberOfChannels; channel += 1) {
            const envelopeBuffer = this._envelopeBuffers[channel];
            const inputChannelData = input[channel];
            const outputChannelData = output[channel];

            outputChannelData.set(inputChannelData);

            computeEnvelope(inputChannelData, envelopeBuffer);

            for (let i = 0; i < 128; i += 1) {
                const gain = Math.min(1, (THRESHOLD / envelopeBuffer[i]));

                outputChannelData[i] *= gain;
            }
        }

        return true;
    }

}
