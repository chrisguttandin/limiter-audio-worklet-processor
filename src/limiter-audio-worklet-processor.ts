import { ConstantMemoryDeque } from './classes/constant-memory-deque';
import { readFromRingBuffer } from './functions/read-from-ring-buffer';
import { writeToRingBuffer } from './functions/write-to-ring-buffer';
import { IAudioWorkletProcessor } from './interfaces';

const RELEASE_TIME_SECONDS = 0.5;
const RELEASE_GAIN = Math.exp(-1 / (sampleRate * RELEASE_TIME_SECONDS));
const THRESHOLD = 10 ** -0.1;

const computeEnvelope = (
    envelopeBuffer: Float32Array,
    delayBuffer: Float32Array,
    offset: number,
    constantMemoryDeque: null | ConstantMemoryDeque
): void => {
    let previousEnvelopeValue = envelopeBuffer[127];

    for (let i = 0; i < 128; i += 1) {
        const readOffset = (offset + i) % delayBuffer.length;
        const absoluteValue = Math.abs(delayBuffer[readOffset]);

        let maximumValue;
        let remainingSteps;

        if (constantMemoryDeque !== null) {
            while (constantMemoryDeque.size > 0 && absoluteValue >= Math.abs(delayBuffer[constantMemoryDeque.first()])) {
                constantMemoryDeque.shift();
            }

            if (constantMemoryDeque.size === 0 || absoluteValue < Math.abs(delayBuffer[constantMemoryDeque.first()])) {
                constantMemoryDeque.unshift(readOffset);
            }

            const dropOffset = (offset + i + 128) % delayBuffer.length;

            if (constantMemoryDeque.last() === dropOffset) {
                constantMemoryDeque.pop();
            }

            const indexOfMaximum = constantMemoryDeque.last();

            maximumValue = Math.abs(delayBuffer[indexOfMaximum]);
            remainingSteps =
                indexOfMaximum < readOffset ? readOffset - indexOfMaximum + 1 : readOffset + delayBuffer.length - indexOfMaximum + 1;
        } else {
            maximumValue = absoluteValue;
            remainingSteps = 1;
        }

        const difference = previousEnvelopeValue - maximumValue;

        if (previousEnvelopeValue < maximumValue) {
            previousEnvelopeValue = previousEnvelopeValue - difference / remainingSteps;
        } else {
            previousEnvelopeValue = maximumValue + RELEASE_GAIN * difference;
        }

        envelopeBuffer[i] = previousEnvelopeValue;
    }
};

export class LimiterAudioWorkletProcessor extends AudioWorkletProcessor implements IAudioWorkletProcessor {
    public static parameterDescriptors = [];

    private _constantMemoryDeques: null | ConstantMemoryDeque[];

    private _delayBuffers: Float32Array[];

    private _envelopeBuffers: Float32Array[];

    private _writeOffset: number;

    constructor({
        channelCount,
        channelCountMode,
        numberOfInputs,
        numberOfOutputs,
        outputChannelCount,
        processorOptions
    }: AudioWorkletNodeOptions) {
        const attack =
            typeof processorOptions === 'object' && processorOptions !== null && 'attack' in processorOptions ? processorOptions.attack : 0;

        if (typeof attack !== 'number') {
            throw new Error('The attack needs to be of type "number".');
        }

        if (attack < 0) {
            throw new Error("The attack can't be negative.");
        }

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

        const attackSamples = sampleRate * attack;
        const delaySize = Math.round(attackSamples);
        const delayBufferSize = delaySize + 128;

        this._constantMemoryDeques =
            delaySize === 0 ? null : Array.from({ length: channelCount }, () => new ConstantMemoryDeque(new Uint16Array(delaySize + 1)));
        this._delayBuffers = Array.from({ length: channelCount }, () => new Float32Array(delayBufferSize));
        this._envelopeBuffers = Array.from({ length: channelCount }, () => new Float32Array(128));
        this._writeOffset = 0;
    }

    public process([input]: Float32Array[][], [output]: Float32Array[][]): boolean {
        const numberOfChannels = input.length;
        const writeOffset = this._writeOffset;

        for (let channel = 0; channel < numberOfChannels; channel += 1) {
            const constantMemoryDeque = this._constantMemoryDeques === null ? null : this._constantMemoryDeques[channel];
            const delayBuffer = this._delayBuffers[channel];
            const envelopeBuffer = this._envelopeBuffers[channel];
            const inputChannelData = input[channel];
            const outputChannelData = output[channel];

            this._writeOffset = writeToRingBuffer(delayBuffer, inputChannelData, writeOffset);

            computeEnvelope(envelopeBuffer, delayBuffer, writeOffset, constantMemoryDeque);

            readFromRingBuffer(delayBuffer, outputChannelData, this._writeOffset);

            for (let i = 0; i < 128; i += 1) {
                const gain = Math.min(1, THRESHOLD / envelopeBuffer[i]);

                outputChannelData[i] *= gain;
            }
        }

        return true;
    }
}
