import {config} from '../data/config';
export function GET(){return new Response(config.production&&config.origin?`User-agent: *\nAllow: /\nSitemap: ${config.origin.replace(/\/$/,'')}/sitemap.xml\n`:'User-agent: *\nDisallow: /\n');}
