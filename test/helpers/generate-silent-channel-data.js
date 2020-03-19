import { generateCustomChannelData } from './generate-custom-channel-data';

export const generateSilentChannelData = () => generateCustomChannelData(() => 0);
