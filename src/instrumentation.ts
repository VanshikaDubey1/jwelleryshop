import {config} from 'dotenv';
export function register() {
  config({path: '.env'});
}
