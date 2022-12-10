import fetch from 'node-fetch';
import {Dropbox} from 'dropbox';

const accessToken = process.env.DROPBOX;
const clientId = process.env.DROPBOXCLIENT;
const clientSecret = process.env.DROPBOXSECRET;
const refreshToken = process.env.REFRESHTOKEN;
const pathRoot = 'Snipe-bot/';

if (!accessToken || !clientId || !clientSecret || !refreshToken) throw Error('DROPBOX environment variable not defined!');

const dbx = new Dropbox({ accessToken, clientId, clientSecret,refreshToken,fetch});
const UPLOAD_FILE_SIZE_LIMIT = 150 * 1024 * 1024;

export async function uploadFile(file: string, content: string): Promise<void> {
  if (content.length >= UPLOAD_FILE_SIZE_LIMIT) return;
  await dbx.filesUpload({ path: `/${file}`, contents: content, mode: { '.tag': 'overwrite' } });
}

export async function downloadFile<T>(file: string): Promise<T> {

  var response = await dbx.filesDownload({ path: `/${file}` });
  var binary = response.result as { fileBinary?: Buffer }
  console.log(binary.fileBinary);
  if (!binary.fileBinary) {
    throw new Error(`File not found: ${file}`);
  }

  return JSON.parse(binary.fileBinary.toString('utf8')) as T;
}