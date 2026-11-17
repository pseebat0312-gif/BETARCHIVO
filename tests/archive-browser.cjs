// Optional local browser verification. Playwright is supplied outside the project.
const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert=require('node:assert/strict');
const base=process.env.ARCHIVE_BASE_URL || 'http://127.0.0.1:4321/';
const mapping={
 featured:['entre-flores','student-hub-spain','playground-lab','interactive-phone'],
 digital:['student-hub-spain','playground-lab'],
 visual:['entre-flores'],
 games:['interactive-phone','merge-game','squish-toy'],
};

async function ready(page,state){
 await page.waitForFunction(expected=>{
  const archive=document.querySelector('[data-archive]');
  return archive?.dataset.state===expected&&archive.getAttribute('aria-busy')==='false';
 },state,{timeout:12000});
}

async function run(){
 const browser=await chromium.launch({
  executablePath:process.env.CHROMIUM_PATH,
  headless:true,args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'],
 });
 try{
  for(const mode of ['desktop','tablet','mobile','reduced']){
   const touch=mode==='tablet'||mode==='mobile';
   const viewport=mode==='mobile'?{width:390,height:844}:mode==='tablet'?{width:820,height:1180}:{width:1440,height:1000};
   const lang=mode==='tablet'?'es':mode==='mobile'?'zh':'en';
   const page=await browser.newPage({viewport,hasTouch:touch,reducedMotion:mode==='reduced'?'reduce':'no-preference'});
   const errors=[];
   page.on('pageerror',error=>errors.push(error.message));
   page.on('console',message=>{if(message.type()==='error')errors.push(message.location().url+' '+message.text());});
   await page.addInitScript(()=>{
    window.drawerAudioStarts=0;
    window.addEventListener('pagereveal',event=>{
     window.archiveTransitionReady=false;
     event.viewTransition?.ready.then(()=>{window.archiveTransitionReady=true;},()=>{});
    });
    const start=AudioBufferSourceNode.prototype.start;
    AudioBufferSourceNode.prototype.start=function(...args){
     window.drawerAudioStarts++;
     return start.apply(this,args);
    };
   });
   await page.goto(mode==='desktop'?base:new URL(lang+'/',base).href);
   await page.waitForURL('**/'+lang+'/');
   await ready(page,'idle');
   assert.equal(await page.locator('[data-drawer]').count(),4);
   assert.equal(await page.locator('[data-plaque]:visible').count(),4);
   assert(await page.locator('[data-plaque]').evaluateAll(labels=>labels.every(label=>
    parseFloat(getComputedStyle(label).fontSize)>=9&&label.scrollWidth<=label.clientWidth+1)));
   const audio=page.locator('[data-audio]');
   assert.equal(await audio.getAttribute('aria-pressed'),mode==='reduced'?'false':'true');
   if(mode==='desktop'||mode==='mobile'){
    const canvas=page.locator('.archive-viewport canvas');
    const bounds=await canvas.boundingBox();
    const plaque=await page.locator('[data-plaque]').first().boundingBox();
    const position={x:plaque.x+plaque.width/2-bounds.x,y:plaque.y+plaque.height/2-bounds.y};
    if(touch)await canvas.tap({position});
    else{
     await canvas.hover({position});
     assert.equal(await canvas.evaluate(element=>getComputedStyle(element).cursor),'pointer');
     assert.equal(await page.evaluate(()=>window.drawerAudioStarts),0);
     await canvas.click({position});
    }
    await ready(page,'drawer-open');
    assert(await page.locator('[data-folders="featured"]').isVisible());
    await page.waitForFunction(()=>window.drawerAudioStarts===1);
    await audio.click();
    assert.equal(await audio.getAttribute('aria-pressed'),'false');
    if(touch)await page.locator('[data-back]').tap();
    else await page.keyboard.press('Escape');
    await ready(page,'idle');
    assert.equal(await page.evaluate(()=>window.drawerAudioStarts),1);
    await audio.click();
   }
   const activate=async locator=>{
    if(touch)await locator.tap();
    else if(mode==='desktop')await locator.press('Enter');
    else await locator.click();
   };
   const selectedDrawers=mode==='reduced'?Object.keys(mapping):[mode==='desktop'?'featured':mode==='tablet'?'digital':'games'];
   for(const drawer of selectedDrawers){
    const expected=mapping[drawer];
    for(const slug of mode==='reduced'?expected:[expected.at(-1)]){
     await activate(page.locator('[data-drawer="'+drawer+'"]'));
     await ready(page,'drawer-open');
     const folders=page.locator('[data-folders="'+drawer+'"] [data-folder]');
     assert.deepEqual(await folders.evaluateAll(elements=>elements.map(element=>element.dataset.folder)),expected);
     await activate(page.locator('[data-folders="'+drawer+'"] [data-folder="'+slug+'"]'));
     await ready(page,'file-selected');
     await activate(page.locator('[data-next]'));
     await ready(page,'file-unsealed');
     assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
     await activate(page.locator('[data-project-link]'));
     await page.waitForURL('**/work/'+slug+'/?from=archive&drawer='+drawer);
     assert(await page.locator('article.case h1').isVisible());
     if(mode==='desktop'){
      await page.waitForFunction(()=>window.archiveTransitionReady);
      await page.goBack();
      await ready(page,'file-unsealed');
      await page.waitForFunction(()=>window.archiveTransitionReady);
      await activate(page.locator('[data-project-link]'));
      await page.waitForURL('**/work/'+slug+'/?from=archive&drawer='+drawer);
      await page.waitForFunction(()=>window.archiveTransitionReady);
     }
     const back=page.locator('[data-return-archive]');
     await back.click();
     await page.waitForURL('**/?drawer='+drawer+'&file='+slug+'#archive');
     await ready(page,'file-unsealed');
     assert((await page.locator('[data-project-link]').getAttribute('href')).includes('/work/'+slug+'/'));
     for(const state of ['file-selected','drawer-open','idle']){
      if(mode==='desktop')await page.keyboard.press('Escape');
      else await activate(page.locator('[data-back]'));
      await ready(page,state);
     }
    }
   }
   assert.deepEqual(errors,[]);
   console.log(mode+': OK');
   await page.close();
  }
  const fallback=await browser.newPage();
  await fallback.addInitScript(()=>{HTMLCanvasElement.prototype.getContext=()=>null;});
  await fallback.goto(new URL('zh/',base).href);
  await fallback.waitForFunction(()=>document.querySelector('.archive-loading').textContent.includes('暂时无法'));
  await fallback.locator('.archive-direct').click();
  assert.equal(await fallback.locator('.work-card').count(),6);
  await fallback.locator('[data-filter="4"]').click();
  assert.equal(await fallback.locator('.work-card:visible').count(),1);
  await fallback.close();
  const noScript=await browser.newPage({javaScriptEnabled:false});
  await noScript.goto(new URL('en/',base).href);
  assert(await noScript.locator('.archive-direct').isVisible());
  console.log('WebGL and no-script index fallback: OK');
 }finally{await browser.close();}
}
run().catch(error=>{console.error(error);process.exitCode=1;});
