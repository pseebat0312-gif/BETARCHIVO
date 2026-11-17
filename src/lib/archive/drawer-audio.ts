// Original procedural wood and rail sounds, synthesized only after user input.
export function drawerAudio(button:HTMLButtonElement,reduced:MediaQueryList){
 const key='betarchivo.drawer-muted';
 let preference:boolean|undefined;
 try{
  const stored=localStorage.getItem(key);
  if(stored!==null)preference=stored==='true';
 }catch{}
 const muted=()=>preference??reduced.matches;
 let context:AudioContext|undefined;
 let active:AudioBufferSourceNode|undefined;
 let generation=0;
 const sounds=new Map<boolean,AudioBuffer>();
 function stop(){
  generation++;
  if(active){active.stop();active=undefined;}
 }
 function update(){
  button.textContent=muted()?button.dataset.off!:button.dataset.on!;
  button.setAttribute('aria-pressed',String(!muted()));
  if(muted())stop();
 }
 function toggle(){
  preference=!muted();
  try{localStorage.setItem(key,String(preference));}catch{}
  update();
 }
 button.hidden=typeof AudioContext==='undefined';
 button.addEventListener('click',toggle);
 reduced.addEventListener('change',update);
 update();
 function makeSound(audio:AudioContext,opening:boolean){
  const length=opening?1.09:.99;
  const rate=audio.sampleRate;
  const buffer=audio.createBuffer(1,Math.floor(rate*length),rate);
  const samples=buffer.getChannelData(0);
  const impactTime=opening?.91:.87;
  let random=71,grain=0,deep=0;
  for(let i=0;i<samples.length;i++){
   const t=i/rate;
   random=(random*16807)%2147483647;
   grain+=.24*(random/1073741823.5-1-grain);
   deep+=.025*(grain-deep);
   const envelope=Math.sin(Math.PI*Math.min(t/impactTime,1))**1.7;
   const friction=(grain*.085+deep*.11)*envelope*(.75+.25*Math.sin(t*63));
   const elapsed=t-impactTime;
   const thud=elapsed<0?0:Math.exp(-elapsed*38)*(1-Math.exp(-elapsed*290))
    *(Math.sin(elapsed*440)*.072+Math.sin(elapsed*690)*.027+grain*.034);
   samples[i]=friction+thud*(opening?.58:1);
  }
  return buffer;
 }
 return {
  play(opening:boolean){
   if(muted()||typeof AudioContext==='undefined'||active)return;
   const request=++generation;
   try{
    const audio=context??=new AudioContext();
    void audio.resume().then(()=>{
     if(request!==generation||muted()||active||audio.state!=='running')return;
     const source=audio.createBufferSource();
     if(!sounds.has(opening))sounds.set(opening,makeSound(audio,opening));
     source.buffer=sounds.get(opening)!;
     source.connect(audio.destination);
     source.onended=()=>{if(active===source)active=undefined;source.disconnect();};
     active=source;
     source.start();
    }).catch(()=>{});
   }catch{}
  },
  stop,
  dispose(){
   stop();
   button.removeEventListener('click',toggle);
   reduced.removeEventListener('change',update);
   if(context)void context.close().catch(()=>{});
  },
 };
}
