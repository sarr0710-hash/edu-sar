import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, VolumeX, MessageCircle, Loader, Sparkles } from 'lucide-react';
import { useSpeechSynthesis } from 'react-speech-kit';
import { voiceAgent } from '../agents/voiceAgent';

const EduCredAgent: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  
  const { speak, cancel, speaking, supported } = useSpeechSynthesis();

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';
      
      recognitionInstance.onresult = (event) => {
        const speechResult = event.results[0][0].transcript;
        setTranscript(speechResult);
        handleVoiceCommand(speechResult);
      };
      
      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
      
      recognitionInstance.onend = () => {
        setIsListening(false);
      };
      
      setRecognition(recognitionInstance);
    }
  }, []);

  const startListening = () => {
    if (recognition) {
      setIsListening(true);
      setTranscript('');
      setResponse('');
      recognition.start();
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

  const handleVoiceCommand = async (command: string) => {
    setLoading(true);
    try {
      const agentResponse = await voiceAgent.processCommand(command);
      setResponse(agentResponse.message);
      
      if (supported && agentResponse.message) {
        speak({ text: agentResponse.message });
      }
      
      // Execute any actions
      if (agentResponse.action) {
        agentResponse.action();
      }
    } catch (error) {
      const errorMessage = 'Sorry, I encountered an error processing your request.';
      setResponse(errorMessage);
      if (supported) {
        speak({ text: errorMessage });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (transcript.trim()) {
      handleVoiceCommand(transcript);
    }
  };

  const quickCommands = [
    'Show my certificates',
    'Verify certificate token 1',
    'Issue a new certificate',
    'Help me navigate the platform'
  ];

  return (
    <div className="pt-16 min-h-screen bg-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-purple-400 text-sm font-medium">AI Voice Assistant</span>
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-4">
            EduCred Voice Agent
          </h1>
          <p className="text-xl text-slate-400">
            Use voice commands to interact with the EduCred platform
          </p>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8">
          {/* Voice Interface */}
          <div className="text-center mb-8">
            <div className="relative inline-block">
              <button
                onClick={isListening ? stopListening : startListening}
                disabled={!recognition || loading}
                className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isListening
                    ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                    : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
                } disabled:opacity-50 shadow-lg`}
              >
                {loading ? (
                  <Loader className="w-8 h-8 text-white animate-spin" />
                ) : isListening ? (
                  <MicOff className="w-8 h-8 text-white" />
                ) : (
                  <Mic className="w-8 h-8 text-white" />
                )}
              </button>
              
              {isListening && (
                <div className="absolute inset-0 rounded-full border-4 border-red-400 animate-ping"></div>
              )}
            </div>
            
            <p className="text-slate-400 mt-4">
              {isListening ? 'Listening... Speak now' : 'Click to start voice command'}
            </p>
            
            {!recognition && (
              <p className="text-red-400 text-sm mt-2">
                Speech recognition not supported in this browser
              </p>
            )}
          </div>

          {/* Text Input Alternative */}
          <form onSubmit={handleTextSubmit} className="mb-8">
            <div className="flex gap-4">
              <input
                type="text"
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder="Or type your command here..."
                className="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 transition-colors"
              />
              <button
                type="submit"
                disabled={!transcript.trim() || loading}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-200 disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </form>

          {/* Response Display */}
          {(transcript || response) && (
            <div className="space-y-4 mb-8">
              {transcript && (
                <div className="bg-slate-900/50 p-4 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <MessageCircle className="w-5 h-5 text-blue-400 mt-0.5" />
                    <div>
                      <div className="text-blue-400 text-sm font-medium mb-1">You said:</div>
                      <div className="text-white">{transcript}</div>
                    </div>
                  </div>
                </div>
              )}
              
              {response && (
                <div className="bg-purple-500/10 border border-purple-500/30 p-4 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <div className="w-5 h-5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mt-0.5"></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-purple-400 text-sm font-medium">EduCred Agent:</div>
                        <button
                          onClick={() => speaking ? cancel() : speak({ text: response })}
                          className="text-slate-400 hover:text-purple-400 transition-colors"
                          disabled={!supported}
                        >
                          {speaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                        </button>
                      </div>
                      <div className="text-white">{response}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Quick Commands */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Commands:</h3>
            <div className="grid md:grid-cols-2 gap-3">
              {quickCommands.map((command, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setTranscript(command);
                    handleVoiceCommand(command);
                  }}
                  className="text-left p-3 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 hover:border-purple-500/50 rounded-lg transition-all duration-200 text-slate-300 hover:text-white"
                >
                  "{command}"
                </button>
              ))}
            </div>
          </div>

          {/* Capabilities */}
          <div className="mt-8 pt-8 border-t border-slate-700">
            <h3 className="text-white font-semibold mb-4">What I can help you with:</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-400">
              <div>
                <div className="text-purple-400 font-medium mb-2">Certificate Management:</div>
                <ul className="space-y-1">
                  <li>• View your certificates</li>
                  <li>• Issue new certificates</li>
                  <li>• Verify certificate authenticity</li>
                </ul>
              </div>
              <div>
                <div className="text-purple-400 font-medium mb-2">Navigation:</div>
                <ul className="space-y-1">
                  <li>• Navigate to different pages</li>
                  <li>• Get help with features</li>
                  <li>• Platform guidance</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EduCredAgent;