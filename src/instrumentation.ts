import {config} from 'dotenv';
import path from 'path';

export function register() {
  config({path: path.resolve(process.cwd(), '.env')});
}
