import { GoogleGenAI, Modality, Type, FunctionDeclaration, LiveServerMessage } from '@google/genai';
import { BusinessConfig } from '../types';
import { createPcmBlob, decode, decodeAudioData } from './audioUtils';

const CONFIRM_BOOKING_DECLARATION: FunctionDeclaration = {
  name: 'confirmBooking',
  parameters: {
    type: Type.OBJECT,
    description: 'Save the confirmed booking details to the database once the name, email, and employee are confirmed.',
    properties: {
      customerName: { type: Type.STRING, description: 'The name of the client.' },
      customerEmail: { type: Type.STRING, description: 'The email of the client.' },
      employeeName: { type: Type.STRING, description: 'The name of the employee selected.' },
      service: { type: Type.STRING, description: 'The service being booked.' },
      time: { type: Type.STRING, description: 'The scheduled time.' },
    },
    required: ['customerName', 'customerEmail', 'employeeName', 'service', 'time'],
  },
};

const TRANSFER_FUNCTION_DECLARATION: FunctionDeclaration = {
  name: 'transferToManager',
  parameters: {
    type: Type.OBJECT,
    description: 'Transfer to a human manager if requested or if the AI cannot handle the query.',
    properties: { reason: { type: Type.STRING } },
    required: ['reason'],
  },
};

export class VoiceSession {
  private session: any;
  private audioContextIn: AudioContext | null = null;
  private audioContextOut: AudioContext | null = null;
  private scriptProcessor: ScriptProcessorNode | null = null;
  private nextStartTime = 0;
  private activeSources: Set<AudioBufferSourceNode> = new Set();
  private currentInputTranscription = '';
  private currentOutputTranscription = '';

  constructor(private business: BusinessConfig) {}

  async start(callbacks: {
    onTranscription: (speaker: 'user' | 'ai', text: string, isFinal: boolean) => void;
    onTransfer: (reason: string) => void;
    onBookingSaved: (data: any) => void;
    onError: (err: any) => void;
    onClose: () => void;
  }) {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

      this.audioContextIn = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      this.audioContextOut = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      await this.audioContextIn.resume();
      await this.audioContextOut.resume();

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const source = this.audioContextIn.createMediaStreamSource(stream);
      this.scriptProcessor = this.audioContextIn.createScriptProcessor(4096, 1, 1);

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction: this.business.systemInstruction + "\nIMPORTANT: Start the conversation immediately by greeting the user. Do not wait for them to speak first.",
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } },
          },
          tools: [{ functionDeclarations: [CONFIRM_BOOKING_DECLARATION, TRANSFER_FUNCTION_DECLARATION] }],
          inputAudioTranscription: {},
          outputAudioTranscription: {},
        },
        callbacks: {
          onopen: () => {
            console.log("Session Opened");
            this.scriptProcessor!.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createPcmBlob(inputData);
              sessionPromise.then((session: any) => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };
            source.connect(this.scriptProcessor!);
            this.scriptProcessor!.connect(this.audioContextIn!.destination);

            // Correct way to trigger the first response if the model doesn't start automatically
            sessionPromise.then((session: any) => {
              // We use a text part to nudge the model to follow its system instruction greeting
              try {
                session.send({ parts: [{ text: "The call has started. Please greet the customer now." }] });
              } catch (err) {
                console.warn("Nudge failed, relying on audio stream start.", err);
              }
            });
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.outputTranscription) {
              this.currentOutputTranscription += message.serverContent.outputTranscription.text;
              callbacks.onTranscription('ai', this.currentOutputTranscription, false);
            } else if (message.serverContent?.inputTranscription) {
              this.currentInputTranscription += message.serverContent.inputTranscription.text;
              callbacks.onTranscription('user', this.currentInputTranscription, false);
            }

            if (message.serverContent?.turnComplete) {
              if (this.currentOutputTranscription) callbacks.onTranscription('ai', this.currentOutputTranscription, true);
              if (this.currentInputTranscription) callbacks.onTranscription('user', this.currentInputTranscription, true);
              this.currentOutputTranscription = '';
              this.currentInputTranscription = '';
            }

            if (message.toolCall) {
              for (const fc of message.toolCall.functionCalls) {
                if (fc.name === 'transferToManager') {
                  callbacks.onTransfer(fc.args.reason as string);
                } else if (fc.name === 'confirmBooking') {
                  callbacks.onBookingSaved(fc.args);
                }
                sessionPromise.then((session: any) => {
                  session.sendToolResponse({
                    functionResponses: [{ id: fc.id, name: fc.name, response: { status: 'ok' } }]
                  });
                });
              }
            }

            const parts = message.serverContent?.modelTurn?.parts || [];
            for (const part of parts) {
              const base64Audio = part.inlineData?.data;
              if (base64Audio && this.audioContextOut) {
                this.nextStartTime = Math.max(this.nextStartTime, this.audioContextOut.currentTime);
                const audioBuffer = await decodeAudioData(decode(base64Audio as string), this.audioContextOut, 24000, 1);
                const audioSource = this.audioContextOut.createBufferSource();
                audioSource.buffer = audioBuffer;
                audioSource.connect(this.audioContextOut.destination);
                audioSource.onended = () => this.activeSources.delete(audioSource);
                audioSource.start(this.nextStartTime);
                this.nextStartTime += audioBuffer.duration;
                this.activeSources.add(audioSource);
              }
            }

            if (message.serverContent?.interrupted) {
              this.activeSources.forEach(s => { try { s.stop(); } catch(e) {} });
              this.activeSources.clear();
              this.nextStartTime = 0;
            }
          },
          onerror: (e: any) => {
            console.error("Session Error:", e);
            callbacks.onError(e);
          },
          onclose: (e: any) => {
            console.log("Session Closed:", e);
            callbacks.onClose();
          },
        },
      });

      this.session = await sessionPromise;
    } catch (err) {
      console.error("Start Error:", err);
      callbacks.onError(err);
    }
  }

  stop() {
    if (this.session) {
      try { this.session.close(); } catch(e) {}
    }
    if (this.scriptProcessor) {
      this.scriptProcessor.disconnect();
    }
    this.activeSources.forEach(s => { try { s.stop(); } catch(e) {} });
    this.activeSources.clear();
    if (this.audioContextIn) this.audioContextIn.close();
    if (this.audioContextOut) this.audioContextOut.close();
  }
}
