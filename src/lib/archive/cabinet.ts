import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
import {states,nextState} from './state.mjs';

export function mountArchive(root:HTMLElement){
 const copy=JSON.parse(root.dataset.copy!);
 const canvas=root.querySelector('canvas')!;
 const viewport=root.querySelector<HTMLElement>('.archive-viewport')!;
 const status=root.querySelector<HTMLElement>('[data-status]')!;
 const loading=root.querySelector<HTMLElement>('.archive-loading')!;
 const next=root.querySelector<HTMLButtonElement>('[data-next]')!;
 const back=root.querySelector<HTMLButtonElement>('[data-back]')!;
 const link=root.querySelector<HTMLAnchorElement>('[data-project-link]')!;
 let renderer:THREE.WebGLRenderer;
 try{renderer=new THREE.WebGLRenderer({canvas,antialias:true,powerPreference:'low-power'});}catch{loading.textContent=copy.error;viewport.setAttribute('aria-busy','false');return;}
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
 renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.35;
 const scene=new THREE.Scene();scene.background=new THREE.Color('#1c3040');scene.fog=new THREE.Fog('#1c3040',13,30);
 const camera=new THREE.PerspectiveCamera(39,1,.1,45);
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 // Original seeded, seamless longitudinal grain. No external textures or models.
 function grain(paper=false){
  const c=document.createElement('canvas');c.width=c.height=512;const ctx=c.getContext('2d')!;
  const image=ctx.createImageData(512,512);let seed=47;const random=()=>((seed=(seed*16807)%2147483647)/2147483647);
  for(let y=0;y<512;y++)for(let x=0;x<512;x++){
   const bend=Math.sin(y/512*Math.PI*2)*3+Math.sin(y/512*Math.PI*6)*1.4;
   const fiber=Math.sin((x+bend)*1.8)*2+Math.sin((x+bend)*.31)*4;
   const pore=Math.pow(Math.max(0,Math.sin((x+bend)*.67)),18)*8;
   const value=paper?(random()-.5)*7:fiber-pore+(random()-.5)*4;
   const base=paper?[205,198,170]:[49,33,24];const i=(y*512+x)*4;
   image.data[i]=base[0]+value;image.data[i+1]=base[1]+value*.75;image.data[i+2]=base[2]+value*.5;image.data[i+3]=255;
  }
  ctx.putImageData(image,0,0);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.wrapS=t.wrapT=THREE.RepeatWrapping;t.anisotropy=Math.min(4,renderer.capabilities.getMaxAnisotropy());return t;
 }
 const woodTexture=grain();const paperTexture=grain(true);
 const wood=new THREE.MeshStandardMaterial({map:woodTexture,roughness:.78,bumpMap:woodTexture,bumpScale:.025});
 const edge=new THREE.MeshStandardMaterial({color:'#281c16',roughness:.86});
 const brass=new THREE.MeshStandardMaterial({color:'#a08a57',metalness:.72,roughness:.48});
 const railMaterial=new THREE.MeshStandardMaterial({color:'#676963',metalness:.65,roughness:.56});
 const paper=new THREE.MeshStandardMaterial({map:paperTexture,roughness:.96});
 const folderMaterial=new THREE.MeshStandardMaterial({color:'#65745b',roughness:.9,map:paperTexture});
 const burgundy=new THREE.MeshStandardMaterial({color:'#793d4a',roughness:.9});
 function box(parent:THREE.Object3D,w:number,h:number,d:number,x:number,y:number,z:number,mat:THREE.Material){const m=new THREE.Mesh(new RoundedBoxGeometry(w,h,d,2,Math.min(.012,w/5,h/5,d/5)),mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
 scene.add(new THREE.HemisphereLight('#f5f1e8','#65745b',2.1));
 const key=new THREE.SpotLight('#ffe7c1',95,22,.65,.65,1.5);key.position.set(-3,7,5);key.castShadow=true;key.shadow.mapSize.set(1024,1024);key.shadow.bias=-.0004;key.shadow.normalBias=.025;key.target.position.set(0,1.5,1);scene.add(key,key.target);
 const fill=new THREE.DirectionalLight('#c6d5dc',2);fill.position.set(4,5,-2);scene.add(fill);
 box(scene,200,.12,200,0,-.14,0,new THREE.MeshStandardMaterial({color:'#454b43',roughness:1}));
 const cabinet=new THREE.Group();scene.add(cabinet);
 // Solid carcase: 120 mm stiles, a recessed back, shelves, and inset drawer fronts.
 box(cabinet,.12,3.2,2,-1.55,1.65,0,wood);box(cabinet,.12,3.2,2,1.55,1.65,0,wood);
 box(cabinet,3.22,.14,2.12,0,3.3,0,wood);box(cabinet,3.1,.12,2,0,.22,0,wood);box(cabinet,3,.1,2,0,1.7,0,wood);
 box(cabinet,3,3,.1,0,1.75,-.96,edge);
 for(const x of [-1.3,1.3])for(const z of [-.7,.7])box(cabinet,.18,.24,.18,x,.04,z,edge);
 for(const y of [.6,1.3,2.94]){box(cabinet,2.94,y===2.94?.51:.64,.12,0,y,1.02,wood);box(cabinet,.45,.045,.07,0,y,1.13,brass);}
 const drawer=new THREE.Group();drawer.position.y=1.77;cabinet.add(drawer);
 box(drawer,2.85,.09,1.77,0,.045,0,wood);
 box(drawer,.09,.46,1.8,-1.39,.27,0,wood);box(drawer,.09,.46,1.8,1.39,.27,0,wood);box(drawer,2.8,.46,.09,0,.27,-.86,wood);
 box(drawer,2.94,.72,.14,0,.34,1.02,wood);
 // Handle anchored into the front with two brass standoffs.
 for(const x of [-.27,.27])box(drawer,.055,.055,.14,x,.36,1.15,brass);
 box(drawer,.6,.065,.055,0,.36,1.23,brass);
 box(drawer,.55,.2,.025,0,.57,1.105,brass);box(drawer,.47,.13,.028,0,.57,1.12,paper);
 // Three telescoping rail sections retain overlap throughout the 1.72 m travel.
 const middleRails:THREE.Mesh[]=[];
 for(const x of [-1.46,1.46]){box(cabinet,.035,.09,1.8,x,1.94,0,railMaterial);middleRails.push(box(cabinet,.025,.065,1.8,x,1.94,0,railMaterial));box(drawer,.035,.04,1.65,x,.17,0,railMaterial);}
 // Reading table is a supported physical destination, separate from the drawer path.
 box(scene,6.2,.12,1.7,-.6,1.42,3.35,wood);
 for(const x of [-3.25,2.05])for(const z of [2.75,3.95])box(scene,.1,1.44,.1,x,.64,z,edge);
 const file=new THREE.Group();scene.add(file);
 box(file,1.8,.025,1.12,0,0,0,folderMaterial);
 for(let i=0;i<4;i++)box(file,1.68,.007,1.01,0,.02+i*.008,0,paper);
 box(file,.48,.014,.14,.5,.015,-.6,folderMaterial);
 const hinge=new THREE.Group();hinge.position.set(-.9,.061,0);file.add(hinge);box(hinge,1.8,.022,1.12,.9,0,0,folderMaterial);
 box(hinge,.85,.004,.34,.95,.015,0,paper);box(hinge,.055,.006,.3,.53,.018,0,burgundy);
 const clasp=new THREE.Group();clasp.position.set(1.72,.025,0);hinge.add(clasp);box(clasp,.14,.025,.16,0,0,0,brass);
 function label(){const c=document.createElement('canvas');c.width=512;c.height=160;const ctx=c.getContext('2d')!;ctx.fillStyle='#eee7d3';ctx.fillRect(0,0,512,160);ctx.fillStyle='#1c3040';ctx.font='28px Georgia';ctx.fillText(root.dataset.project!.toUpperCase(),24,65);ctx.font='19px sans-serif';ctx.fillText('BETARCHIVO / 2026',24,115);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;const m=new THREE.Mesh(new THREE.PlaneGeometry(.77,.25),new THREE.MeshStandardMaterial({map:t,roughness:1}));m.rotation.x=-Math.PI/2;m.position.set(.95,.02,0);hinge.add(m);return t;}
 const labelTexture=label();
 let state='idle',busy=false,disposed=false,frame=0,epoch=0,failed=false;
 const pose={drawer:0,lift:0,transfer:0,lower:0,clasp:0,cover:0,camera:0};
 const target=()=>new THREE.Vector3(0,1.65+pose.camera*.05,.7+pose.camera*1.9);
 function render(){if(disposed)return;drawer.position.z=pose.drawer*1.72;for(const rail of middleRails)rail.position.z=pose.drawer*.86;
 file.position.set(0,1.91+pose.lift*.95-pose.lower*1.36,drawer.position.z+pose.transfer*(3.35-drawer.position.z));
 clasp.rotation.z=pose.clasp*-Math.PI/2;hinge.rotation.z=pose.cover*(Math.PI+.035);
 const mobile=viewport.clientWidth<650;camera.position.set((mobile?4.6:5.8)-pose.camera*1.3,(mobile?6.2:5.2)+pose.camera*.8,(mobile?9.6:8.3)+pose.camera*.7);const look=target();if(mobile){
  look.x=-.5;
  const backwards=camera.position.clone().sub(look).normalize();
  const right=new THREE.Vector3().crossVectors(camera.up,backwards).normalize();
  const up=new THREE.Vector3().crossVectors(backwards,right).normalize();
  const tangent=Math.tan(THREE.MathUtils.degToRad(camera.fov/2));
  let distance=camera.position.distanceTo(look);
  // Fit the full cabinet and opened folder on narrow screens, including the left cover.
  for(const x of [-3.7,2.5])for(const y of [-.1,3.4])for(const z of [-1.1,4.2]){
   const offset=new THREE.Vector3(x,y,z).sub(look),depth=offset.dot(backwards);
   distance=Math.max(distance,Math.abs(offset.dot(right))/(tangent*camera.aspect)*1.08+depth,Math.abs(offset.dot(up))/tangent*1.08+depth);
  }
  camera.position.copy(look).addScaledVector(backwards,distance);
 }camera.lookAt(look);renderer.render(scene,camera);}
 function resize(){const w=viewport.clientWidth,h=viewport.clientHeight;if(!w||!h)return;renderer.setSize(w,h,false);camera.aspect=w/h;camera.fov=w<650?46:39;camera.updateProjectionMatrix();render();}
 function ui(){const i=states.indexOf(state);root.dataset.state=state;root.setAttribute('aria-busy',String(busy));status.textContent=copy.steps[i];next.textContent=copy.actions[Math.min(i,3)];next.disabled=busy||failed;next.hidden=i>=3;back.disabled=busy||failed||i===0;link.hidden=i!==3;}
 function tween(values:Partial<typeof pose>,duration:number){const start={...pose},generation=epoch;return new Promise<void>((resolve,reject)=>{if(reduced.matches){Object.assign(pose,values);render();resolve();return;}const t0=performance.now();function tick(now:number){if(disposed||generation!==epoch){reject(new Error('interrupted'));return;}const t=Math.min(1,(now-t0)/duration),e=t*t*(3-2*t);for(const k of Object.keys(values) as (keyof typeof pose)[])pose[k]=start[k]+(values[k]!-start[k])*e;render();if(t<1)frame=requestAnimationFrame(tick);else resolve();}frame=requestAnimationFrame(tick);});}
 async function move(direction:number){if(busy||disposed||failed)return;const dest=nextState(state,direction);if(dest===state)return;busy=true;ui();
 try { if(direction===1){if(state==='idle')await tween({drawer:1,camera:.35},1100);if(state==='drawer-open'){await tween({lift:1},650);await tween({transfer:1,camera:1},1000);await tween({lower:1},700);}if(state==='file-selected'){await tween({clasp:1},450);await tween({cover:1},1000);}}
 else {if(state==='file-unsealed'){await tween({cover:0},850);await tween({clasp:0},350);}if(state==='file-selected'){await tween({lower:0},650);await tween({transfer:0,camera:.35},950);await tween({lift:0},650);}if(state==='drawer-open')await tween({drawer:0,camera:0},1000);}
 state=dest;busy=false;ui();if(next.hidden&&document.activeElement===next)link.focus();if(back.disabled&&document.activeElement===back)next.focus();}catch{if(!disposed){busy=false;ui();}}}
 const forward=()=>void move(1),reverse=()=>void move(-1);next.addEventListener('click',forward);back.addEventListener('click',reverse);
 const ray=new THREE.Raycaster();let down:{x:number;y:number}|undefined;
 canvas.addEventListener('pointerdown',e=>{down={x:e.clientX,y:e.clientY};});
 canvas.addEventListener('pointerup',e=>{if(!down||Math.hypot(e.clientX-down.x,e.clientY-down.y)>8)return;down=undefined;if(busy)return;const r=canvas.getBoundingClientRect();ray.setFromCamera(new THREE.Vector2((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1),camera);const hit=ray.intersectObjects(scene.children,true)[0];if(!hit)return;let o:THREE.Object3D|null=hit.object;let isDrawer=false,isFile=false;while(o){if(o===drawer)isDrawer=true;if(o===file)isFile=true;o=o.parent;}if((state==='idle'&&isDrawer)||(state==='drawer-open'&&isFile)||(state==='file-selected'&&isFile))forward();});
 root.addEventListener('keydown',e=>{if(e.key==='Escape'&&!back.disabled){e.preventDefault();reverse();}});
 link.addEventListener('click',()=>{state='project-open';busy=true;ui();});
 const ro=new ResizeObserver(resize);ro.observe(viewport);
 const io=new IntersectionObserver(entries=>{if(entries[0].isIntersecting)render();});io.observe(root);
 const restore=()=>{if(failed)return;epoch++;state='idle';busy=false;Object.assign(pose,{drawer:0,lift:0,transfer:0,lower:0,clasp:0,cover:0,camera:0});ui();resize();};
 window.addEventListener('pageshow',e=>{if(e.persisted)restore();});
 canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();failed=true;epoch++;busy=true;ui();next.disabled=true;back.disabled=true;loading.hidden=false;loading.textContent=copy.error;});
 function dispose(){disposed=true;cancelAnimationFrame(frame);ro.disconnect();io.disconnect();scene.traverse(o=>{if(o instanceof THREE.Mesh)o.geometry.dispose();});const materials=new Set<THREE.Material>();scene.traverse(o=>{if(o instanceof THREE.Mesh){for(const m of (Array.isArray(o.material)?o.material:[o.material]))materials.add(m);}});materials.forEach(m=>m.dispose());woodTexture.dispose();paperTexture.dispose();labelTexture.dispose();renderer.dispose();}
 window.addEventListener('pagehide',e=>{if(!e.persisted)dispose();},{once:true});
 loading.hidden=true;viewport.setAttribute('aria-busy','false');restore();
}
