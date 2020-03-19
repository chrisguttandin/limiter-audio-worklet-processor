import { generateCustomChannelData } from './generate-custom-channel-data';
import { generateRandomSample } from './generate-random-sample';

export const generateRandomChannelDataOutsideNominalRange = () => generateCustomChannelData(() => generateRandomSample() * 10);
