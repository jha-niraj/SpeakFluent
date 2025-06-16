import { NextRequest, NextResponse } from 'next/server';

// For now, we'll use the Web Speech API as a fallback
// You can replace this with Google Cloud Text-to-Speech when you get API keys
export async function POST(request: NextRequest) {
    try {
        const { text, languageCode } = await request.json();
        console.log(text, languageCode);

        // Validate input
        if (!text) {
            return NextResponse.json(
                { error: 'Text is required' },
                { status: 400 }
            );
        }

        // Check if ElevenLabs API key is available
        if (!process.env.ELEVENLABS_API_KEY) {
            return NextResponse.json({
                success: true,
                message: 'Using Web Speech API fallback',
                audioUrl: null // This signals the client to use Web Speech API
            });
        }

        try {
            // Map language codes to ElevenLabs voice IDs
            const voiceMap: Record<string, string> = {
                'ru-RU': 'ErXwobaYiN019PkySvjV', // Russian voice
                'ja-JP': 'bVMeCyTHy58xNoL34h3p', // Japanese voice
                'ko-KR': 'EXAVITQu4vr4xnSDxMaL', // Korean voice
                'en-US': 'pNInz6obpgDQGcFmaJgB', // Default English voice
                'es-ES': 'onwK4e9ZLuTAKqWW03F9', // Spanish voice
                'fr-FR': 'cjVigY5qzO86Huf0OWal', // French voice
                'de-DE': 'TX3LPaxmHKxFdv7VOQHJ', // German voice
                'zh-CN': 'XrExE9yKIg1WjnnlVkGX'  // Chinese voice
            };

            console.log(voiceMap[languageCode]);
            const voiceId = voiceMap[languageCode] || voiceMap['en-US'];

            // Call ElevenLabs API
            const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
                method: 'POST',
                headers: {
                    'Accept': 'audio/mpeg',
                    'Content-Type': 'application/json',
                    'xi-api-key': process.env.ELEVENLABS_API_KEY!
                },
                body: JSON.stringify({
                    text: text,
                    model_id: 'eleven_multilingual_v2',
                    voice_settings: {
                        stability: 0.5,
                        similarity_boost: 0.5,
                        style: 0.0,
                        use_speaker_boost: true
                    }
                })
            });

            if (!response.ok) {
                throw new Error(`ElevenLabs API error: ${response.status}`);
            }

            const audioBuffer = await response.arrayBuffer();
            
            return new NextResponse(audioBuffer, {
                headers: {
                    'Content-Type': 'audio/mpeg',
                    'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
                    'Content-Length': audioBuffer.byteLength.toString()
                }
            });

        } catch (apiError) {
            console.error('ElevenLabs API error:', apiError);
            
            // Fallback to Web Speech API
            return NextResponse.json({
                success: true,
                message: 'Using Web Speech API fallback',
                audioUrl: null
            });
        }

    } catch (error) {
        console.error('Text-to-speech error:', error);
        return NextResponse.json(
            { error: 'Failed to generate speech' },
            { status: 500 }
        );
    }
} 