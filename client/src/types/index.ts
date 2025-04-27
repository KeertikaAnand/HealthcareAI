// Message Types
export interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: number;
}

// API Types
export interface SendMessageRequest {
  message: string;
  sessionId: string;
}

export interface SendMessageResponse {
  message: string;
  sessionId: string;
}

// AWS Config Types
export interface AwsConfig {
  region: string;
  apiGateway?: {
    endpoint: string;
  };
  lex?: {
    botId: string;
    botAlias: string;
    localeId: string;
  };
}
