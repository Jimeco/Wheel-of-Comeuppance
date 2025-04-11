export async function initDiscordSDK() {
  try {
    await window.discordSdk.ready();
    console.log('Discord SDK is ready');
  } catch (err) {
    console.error('Discord SDK failed:', err);
  }
}
