export interface iTouchpoint {
  utm_source: string;
  utm_campaign: string;
  utm_medium: string;
  utm_content: string;
  sessionId: string;
  createdAt: string;
}

export interface iJourney {
  sessionId: string;
  touchpoints: Omit<iTouchpoint, 'sessionId'>[];
}