# ElevenLabs Text-to-Speech Setup

## Environment Variables

Add the following to your `.env.local` file:

```bash
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
```

## Getting Your API Key

1. Sign up at [ElevenLabs](https://elevenlabs.io/)
2. Go to your Profile Settings
3. Copy your API Key
4. Add it to your `.env.local` file

## Voice IDs Used

The system uses these pre-configured voices:
- Russian: `ErXwobaYiN019PkySvjV`
- Japanese: `bVMeCyTHy58xNoL34h3p`
- Korean: `EXAVITQu4vr4xnSDxMaL`
- English: `pNInz6obpgDQGcFmaJgB`
- Spanish: `onwK4e9ZLuTAKqWW03F9`
- French: `cjVigY5qzO86Huf0OWal`
- German: `TX3LPaxmHKxFdv7VOQHJ`
- Chinese: `XrExE9yKIg1WjnnlVkGX`

## Fallback

If the ElevenLabs API is unavailable or the API key is missing, the system automatically falls back to the browser's Web Speech API. 