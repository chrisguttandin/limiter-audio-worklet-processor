import { generateCustomChannelData } from './generate-custom-channel-data';
import { generateRandomSample } from './generate-random-sample';

export const generateRandomChannelDataAboveThreshold = () => generateCustomChannelData(() => (10 ** -0.1) + (generateRandomSample() * (1 - (10 ** -0.1))));
