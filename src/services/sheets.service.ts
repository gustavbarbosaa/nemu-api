import { google, sheets_v4 } from "googleapis";
import { JWT } from "google-auth-library";
import "dotenv/config";

export class SheetsServce {
  private authClient: JWT | null | undefined = null;
  private sheetsApi: sheets_v4.Sheets | null | undefined = null;

  const SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"];

  constructor() {}

  private async initialize(): Promise<void> {
    if (this.authClient && this.sheetsApi) return;

    try {
      const auth = new google.auth.GoogleAuth({
        keyFile: process.envKEY,
        scopes: SCOPES,
      });

      this.authClient = (await auth.getClient()) as JWT;
      this.sheetsApi = google.sheets({ version: "v4", auth: this.authClient });
    } catch (error) {
      throw new Error(`Falha na autenticação com o Google Sheets API: ${error}`);
    }
  }

}