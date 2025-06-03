import { google, sheets_v4 } from "googleapis";
import { JWT } from "google-auth-library";
import "dotenv/config";
import { iTouchpoint } from "../models/touchpoint";

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"];
export class SheetsService {
  private authClient: JWT | null | undefined = null;
  private sheetsApi: sheets_v4.Sheets | null | undefined = null;

  constructor() {}

  private async initialize(): Promise<void> {
    if (this.authClient && this.sheetsApi) return;

    try {
      const auth = new google.auth.GoogleAuth({
        keyFile: process.env.KEY,
        scopes: SCOPES,
      });

      this.authClient = (await auth.getClient()) as JWT;
      this.sheetsApi = google.sheets({ version: "v4", auth: this.authClient });
    } catch (error) {
      throw new Error(`Falha na autenticação com o Google Sheets: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

private async fetchRawTouchpoints(): Promise<iTouchpoint[]> {
    await this.initialize();

    try {
      const response = await this.sheetsApi.spreadsheets.values.get({
        spreadsheetId: process.env.SPREADSHEET_ID,
        range: process.env.RANGE
      });

      const rows = response.data.values;

      if (!rows || rows.length < 2) {
        return [];
      }

      const headers = rows[0] as string;
      const touchPoints: iTouchpoint[] = [];

      for (let i = 1; i < rows.length; i++) {
        const row = rows[i] as string[];
        const rowData: { [key: string]: string | null } = {};

        headers.forEach((header, index) => {
          const normalizedHeader = header.trim().toLowerCase().replace(/_/g, '');
          rowData[normalizedHeader] = row[index] !== undefined && row[index] !== null ? String(row[index]) : null;
        });
        
        const touchpoint: iTouchpoint = {
          utm_source: rowData['utmsource'] || null,
          utm_campaign: rowData['utmcampaign'] || null,
          utm_medium: rowData['utmmedium'] || null,
          utm_content: rowData['utmcontent'] || null,
          sessionId: rowData['sessionid'] || '', 
          createdAt: rowData['createdat'] || '', 
        };

        if (!touchpoint.sessionId || !touchpoint.createdAt) {
          continue; 
        }

        touchPoints.push(touchpoint);
      }
      
      return touchPoints;
    } catch (error) {
      throw new Error(`Erro ao interagir com a planilha: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}