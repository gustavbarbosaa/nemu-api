import { google, sheets_v4 } from "googleapis";
import { JWT } from "google-auth-library";
import "dotenv/config";
import { iTouchpoint } from "../models/touchpoint";

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

  private async fetchRawTouchpoints(): Promise<iTouchpoint[]> {
    await this.initialize();

    try {
      const response = await this.sheetsApi.spreadsheets.values.get({
        spreadsheetId: process.env.SPREADSHEET_ID,
        range: process.env.RANGE,
      });

      const rows = response.data.values;

      if (!rows || rows.length < 2) {
        return [];
      }

      const headers = rows[0];
      const touchpoints: iTouchpoint[] = [];

      for (let i = 1; i < rows.length; i++) {
        const row = rows[i] as string[];
        const rowData: { [key: string]: string } = {};

        headers.forEach((header: string, index: string) => {
          const formatHeader = header.trim().toLowerCase().replace(/_/, "");
          rowData[formatHeader] = row[index] !== undefined && row[index] !== null ? String(row[index]) : null;
        });

        const touchpoint: iTouchpoint = {
          utm_source: rowData["utmsource"] || null,
          utm_campaign: rowData["utmcampaign"] || null,
          utm_medium: rowData["utmmedium"] || null,
          utm_content: rowData["utmcontent"] || null,
          sessionId: rowData["sessionid"] || null,
          createdAt: rowData["createdat"] || null,
        };

        if (touchpoint.sessionId || !touchpoint.createdAt) {
          continue;
        }

        touchpoint.push(touchpoint);
      }
      return touchpoints;

    } catch (error) {
      throw new Error(`Erro ao interagir com a planilha: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

}