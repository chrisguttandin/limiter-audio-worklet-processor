import { generateCustomChannelData } from './generate-custom-channel-data';
import { generateRandomSample } from './generate-random-sample';

export const generateRandomChannelDataBelowThreshold = () => generateCustomChannelData(() => generateRandomSample() * (10 ** -0.1));
