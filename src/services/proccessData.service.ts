import { iJourney } from "../models/touchpoint";

export class ProccessDataService {
  constructor() {}

  private orderTouchpointsByCreatedAt(touchpoints: iJourney[]) {
    return touchpoints.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }
}