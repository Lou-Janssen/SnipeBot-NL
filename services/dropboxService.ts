import fetch from 'node-fetch';
import { Dropbox } from 'dropbox';

const accessToken = process.env.DROPBOX;
const clientId = process.env.DROPBOXSECRET;
const clientSecret = process.env.DROPBOXSECRET;
if (!accessToken || !clientId || !clientSecret) throw Error('DROPBOX environment variable not defined!');

const dbx = new Dropbox({ accessToken, clientId,fetch });
const UPLOAD_FILE_SIZE_LIMIT = 150 * 1024 * 1024;

dbx.setClientSecret("0elv17z6nr1oixk");

export async function uploadFile(file: string, content: string): Promise<void> {
  if (content.length >= UPLOAD_FILE_SIZE_LIMIT) return;

  await dbx.filesUpload({ path: `/${file}`, contents: content, mode: { '.tag': 'overwrite' } });
}

export async function downloadFile<T>(file: string): Promise<T> {
  
  const response = await dbx.filesDownload({ path: `/${file}` }) as { fileBinary?: Buffer };
  if (!response.fileBinary) {
    throw new Error(`File not found: ${file}`);
  }

  return JSON.parse(response.fileBinary.toString('utf8')) as T;
}
