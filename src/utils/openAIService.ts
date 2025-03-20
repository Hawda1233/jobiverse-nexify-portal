
/**
 * OpenAI Service - Handles API calls to OpenAI for text-to-speech and other services
 */

type TTSVoice = 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';

interface TTSOptions {
  voice?: TTSVoice;
  model?: string;
}

export const generateSpeech = async (
  text: string, 
  apiKey: string,
  options: TTSOptions = {}
): Promise<ArrayBuffer> => {
  try {
    const { voice = 'nova', model = 'tts-1' } = options;
    
    const response = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model,
        voice,
        input: text,
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`OpenAI TTS API error: ${response.statusText} ${JSON.stringify(errorData)}`);
    }
    
    const audioData = await response.arrayBuffer();
    return audioData;
  } catch (error) {
    console.error("Error generating speech:", error);
    throw error;
  }
};

export const playAudioBuffer = async (audioBuffer: ArrayBuffer): Promise<void> => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const audioSource = audioContext.createBufferSource();
    
    // Convert ArrayBuffer to AudioBuffer
    const decodedData = await audioContext.decodeAudioData(audioBuffer);
    audioSource.buffer = decodedData;
    audioSource.connect(audioContext.destination);
    audioSource.start(0);
    
    return new Promise((resolve) => {
      audioSource.onended = () => {
        resolve();
      };
    });
  } catch (error) {
    console.error("Error playing audio:", error);
    throw error;
  }
};

// Enhanced API call for OpenAI chat completion with advanced features
export const getAdvancedChatCompletion = async (
  messages: any[],
  apiKey: string,
  options: {
    model?: string;
    temperature?: number;
    max_tokens?: number;
    adaptive?: boolean;
    skillLevel?: 'beginner' | 'intermediate' | 'expert';
  } = {}
) => {
  try {
    const {
      model = 'gpt-4o-mini',
      temperature = 0.7,
      max_tokens = 800,
      adaptive = true,
      skillLevel = 'intermediate'
    } = options;
    
    // If adaptive is true, adjust the system message based on skill level
    if (adaptive && messages.length > 0 && messages[0].role === 'system') {
      let adaptiveGuidance = '';
      
      switch (skillLevel) {
        case 'beginner':
          adaptiveGuidance = 'The candidate appears to be at a beginner level. Provide simpler questions and more guidance in your responses. Be encouraging and offer hints when needed.';
          break;
        case 'expert':
          adaptiveGuidance = 'The candidate appears to be at an expert level. Ask more challenging, in-depth questions that test nuanced understanding. Expect comprehensive answers.';
          break;
        default:
          adaptiveGuidance = 'The candidate appears to be at an intermediate level. Provide moderately challenging questions and occasional guidance when appropriate.';
      }
      
      messages[0].content += ' ' + adaptiveGuidance;
    }
    
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens,
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`OpenAI API error: ${response.statusText} ${JSON.stringify(errorData)}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error with OpenAI chat completion:", error);
    throw error;
  }
};

export const analyzeInterviewResponse = async (
  question: string,
  answer: string,
  apiKey: string,
  options: {
    skillLevel?: 'beginner' | 'intermediate' | 'expert';
    jobRole?: string;
  } = {}
) => {
  const { skillLevel = 'intermediate', jobRole = 'professional' } = options;
  
  const systemPrompt = `You are an expert interview coach specializing in ${jobRole} roles. 
  Analyze the candidate's response to the interview question and provide detailed feedback in the following JSON format:
  {
    "score": number from 0-100,
    "strengths": [list of specific strengths in the answer],
    "weaknesses": [list of specific weaknesses or areas for improvement],
    "keyPoints": [important points that were covered well],
    "missedPoints": [important points that should have been included],
    "improvementTips": [specific actionable suggestions],
    "improvedAnswer": "A better version of the answer that addresses all weaknesses",
    "skillLevel": "beginner", "intermediate", or "expert" based on answer quality,
    "followUpQuestions": [2-3 relevant follow-up questions based on their response]
  }
  
  Be thorough but fair in your assessment. Consider communication style, relevance, specificity, and overall impression.`;
  
  try {
    const result = await getAdvancedChatCompletion(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Question: "${question}"\n\nCandidate's answer: "${answer}"` }
      ],
      apiKey,
      { skillLevel }
    );
    
    // Parse the content to extract JSON
    const content = result.choices[0].message.content;
    let feedbackData;
    
    try {
      // Try to parse directly if it's valid JSON
      feedbackData = JSON.parse(content);
    } catch (error) {
      // If not, try to extract JSON from text
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        feedbackData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Could not parse feedback data");
      }
    }
    
    return feedbackData;
  } catch (error) {
    console.error("Error analyzing interview response:", error);
    throw error;
  }
};
