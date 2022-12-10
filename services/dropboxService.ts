import fetch from 'node-fetch';
import { Dropbox } from 'dropbox';
import * as https from "https";

const accessToken = process.env.DROPBOX;
const clientId = process.env.DROPBOXCLIENT;
const clientSecret = process.env.DROPBOXSECRET;
const refreshToken = process.env.REFRESHTOKEN

if (!accessToken || !clientId || !clientSecret || !refreshToken) throw Error('DROPBOX environment variable not defined!');

type RefreshToken = {
  access_token: string;
  token_type: string;
  expires_in: string;
};

const dbx = new Dropbox({ accessToken, clientId, clientSecret,refreshToken,fetch });
const UPLOAD_FILE_SIZE_LIMIT = 150 * 1024 * 1024;

export async function uploadFile(file: string, content: string): Promise<void> {
  if (content.length >= UPLOAD_FILE_SIZE_LIMIT) return;
  const response = await dbx.filesUpload({ path: `/${file}`, contents: content, mode: { '.tag': 'overwrite' } });
}

export async function downloadFile<T>(file: string): Promise<T> {

  var response = await dbx.filesDownload({ path: `/${file}` }) as { fileBinary?: Buffer };
  if (!response.fileBinary) {
    throw new Error(`File not found: ${file}`);
  }

  return JSON.parse(response.fileBinary.toString('utf8')) as T;
}