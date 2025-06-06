import { group } from "console";
import { iJourney } from "../models/touchpoint";

export class ProccessDataService {
  constructor() {}

  private orderTouchpointsByCreatedAt(touchpoints: iJourney[]) {
    return touchpoints.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  private removeDuplicateTouchpoints(touchpoinsts: iJourney[]) {
    if (touchpoinsts.length <= 2) return touchpoinsts;

    const first = touchpoinsts[0];
    const last = touchpoinsts[touchpoinsts.length - 1];
    const seen = new Set<string>();
    seen.add(first.utm_source);
    seen.add(last.utm_source);

    const middle = touchpoinsts.slice(1, -1).filter(touch => {
      if (seen.has(touch.utm_source)) return false;
      seen.add(touch.utm_source);
      return true;
    });

    return [first, ...middle, last];
  }

  private groupTouchpointsBySessionId(touchpoints: iJourney[]): iJourney[] {
    const grouped: iJourney[] = [];
    touchpoints.forEach(({ sessionId, ...touchpoint }) => {
      if (!grouped[sessionId]) grouped[sessionId] = [];

      grouped[sessionId].push(touchpoint);
    });

    return Object.entries(grouped).map(([sessionId, touchpoints]) => {
      const ordered = this.orderTouchpointsByCreatedAt(touchpoints);
      const cleaned = this.removeDuplicateTouchpoints(ordered);
      return {
        sessionId,
        touchpoints: cleaned,
      };
    });
  }
}