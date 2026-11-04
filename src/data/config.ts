export const langs=['en','es','zh'] as const;
export type Lang=typeof langs[number];
export const config={name:'betarchivo.',origin:process.env.SITE_URL||'',production:process.env.DEPLOY_ENV==='production',contact:{email:'',socials:[] as {label:string,url:string}[]}};
