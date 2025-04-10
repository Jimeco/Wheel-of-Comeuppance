import { discord } from '@discord/embedded-app-sdk';

export async function initDiscordSDK() {
  try {
    await discord.ready();
    console.log('Discord SDK is ready');
  } catch (err) {
    console.error('Discord SDK failed:', err);
  }
}
