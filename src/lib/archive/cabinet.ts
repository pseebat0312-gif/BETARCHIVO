import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
import type {archiveDrawers} from '../../data/archive';
import {drawerAudio} from './drawer-audio';
import {states,nextState} from './state.mjs';

export function mountArchive(root:HTMLElement){
 const copy=JSON.parse(root.dataset.copy!);
 const catalogue:ReturnType<typeof archiveDrawers>=JSON.parse(root.dataset.drawers!);
 const drawerOptions=root.querySelector<HTMLElement>('[data-drawer-options]')!;
 const drawerButtons=[...root.querySelectorAll<HTMLButtonElement>('[data-drawer]')];
 const folderOptions=[...root.querySelectorAll<HTMLElement>('[data-folders]')];
 const folderButtons=[...root.querySelectorAll<HTMLButtonElement>('[data-folder]')];
 const overlay=root.querySelector<HTMLElement>('.archive-paper')!;
 const notes=root.querySelector<HTMLDetailsElement>('.archive-notes')!;
 const canvas=root.querySelector('canvas')!;
 const viewport=root.querySelector<HTMLElement>('.archive-viewport')!;
 const plaques=[...root.querySelectorAll<HTMLElement>('[data-plaque]')];
 const status=root.querySelector<HTMLElement>('[data-status]')!;
 const loading=root.querySelector<HTMLElement>('.archive-loading')!;
 const next=root.querySelector<HTMLButtonElement>('[data-next]')!;
 const back=root.querySelector<HTMLButtonElement>('[data-back]')!;
 const link=root.querySelector<HTMLAnchorElement>('[data-project-link]')!;
 let renderer:THREE.WebGLRenderer;
 try{renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'low-power'});}catch{loading.textContent=copy.error;viewport.setAttribute('aria-busy','false');return;}
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
 renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.35;
 const scene=new THREE.Scene();
 const camera=new THREE.PerspectiveCamera(39,1,.1,45);
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const audio=drawerAudio(root.querySelector<HTMLButtonElement>('[data-audio]')!,reduced);
 // Original seeded, seamless longitudinal grain. No external textures or models.
 function grain(paper=false){
  const c=document.createElement('canvas');c.width=c.height=512;const ctx=c.getContext('2d')!;
  const image=ctx.createImageData(512,512);let seed=47;const random=()=>((seed=(seed*16807)%2147483647)/2147483647);
  for(let y=0;y<512;y++)for(let x=0;x<512;x++){
   const bend=Math.sin(y/512*Math.PI*2+x*.022)*5+Math.sin(y/512*Math.PI*6+x*.019)*1.5;
   const fiber=Math.sin((x+bend)*1.8)*1.3+Math.sin((x+bend)*.31)*3.5+Math.sin(x*.061+y*.008)*3.4;
   const pore=Math.pow(Math.max(0,Math.sin((x+bend)*.67)),18)*5;
   const value=paper?(random()-.5)*7:fiber-pore+(random()-.5)*4;
   const base=paper?[205,198,170]:[58,44,37];const i=(y*512+x)*4;
   image.data[i]=base[0]+value;image.data[i+1]=base[1]+value*.75;image.data[i+2]=base[2]+value*.5;image.data[i+3]=255;
  }
  ctx.putImageData(image,0,0);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.wrapS=t.wrapT=THREE.RepeatWrapping;t.anisotropy=Math.min(4,renderer.capabilities.getMaxAnisotropy());return t;
 }
 const woodTexture=grain();const paperTexture=grain(true);
 const wood=new THREE.MeshStandardMaterial({map:woodTexture,roughness:.69,bumpMap:woodTexture,bumpScale:.009});
 const trim=new THREE.MeshStandardMaterial({map:woodTexture,color:'#c5ae99',roughness:.81});
 const edge=new THREE.MeshStandardMaterial({color:'#281c16',roughness:.86});
 const brass=new THREE.MeshStandardMaterial({color:'#a39372',metalness:.64,roughness:.54});
 const patina=new THREE.MeshStandardMaterial({color:'#594b36',metalness:.48,roughness:.65});
 const enamel=new THREE.MeshBasicMaterial({color:'#ded1b6',toneMapped:false});
 const railMaterial=new THREE.MeshStandardMaterial({color:'#676963',metalness:.65,roughness:.56});
 const paper=new THREE.MeshStandardMaterial({map:paperTexture,roughness:.96});
 const folderMaterial=new THREE.MeshStandardMaterial({color:'#65745b',roughness:.9,map:paperTexture});
 const burgundy=new THREE.MeshStandardMaterial({color:'#793d4a',roughness:.9});
 const boxes=new Map<string,THREE.BufferGeometry>();
 function box(parent:THREE.Object3D,w:number,h:number,d:number,x:number,y:number,z:number,mat:THREE.Material){
  const size=[w,h,d].join('/');
  let geometry=boxes.get(size);
  if(!geometry){
   geometry=new RoundedBoxGeometry(w,h,d,2,Math.min(.012,w/5,h/5,d/5));
   boxes.set(size,geometry);
  }
  const mesh=new THREE.Mesh(geometry,mat);
  mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);
  return mesh;
 }
 scene.add(new THREE.HemisphereLight('#f5f1e8','#202e40',2.1));
 const key=new THREE.SpotLight('#ffe7c1',95,22,.65,.65,1.5);key.position.set(-3,7,5);key.castShadow=true;key.shadow.mapSize.set(1024,1024);key.shadow.bias=-.0004;key.shadow.normalBias=.025;key.target.position.set(0,1.5,1);scene.add(key,key.target);
 const fill=new THREE.DirectionalLight('#c6d5dc',2);fill.position.set(4,5,-2);scene.add(fill);
 const floor=new THREE.Mesh(new THREE.PlaneGeometry(40,40),new THREE.ShadowMaterial({color:'#09131b',opacity:.31,depthWrite:false}));
 floor.rotation.x=-Math.PI/2;floor.position.y=-.08;floor.receiveShadow=true;scene.add(floor);
 const cabinet=new THREE.Group();scene.add(cabinet);
 // Four inset drawer bays share the same dimensions and rail travel.
 const drawerHeight=.73;
 box(cabinet,.12,3.2,2,-1.55,1.65,0,wood);box(cabinet,.12,3.2,2,1.55,1.65,0,wood);
 box(cabinet,3.22,.14,2.12,0,3.3,0,wood);box(cabinet,3.1,.12,2,0,.22,0,wood);
 box(cabinet,3,3,.1,0,1.75,-.96,edge);
 for(const x of [-1.3,1.3])for(const z of [-.7,.7])box(cabinet,.18,.24,.18,x,.04,z,edge);
 for(let i=1;i<4;i++)box(cabinet,3,.047,1.95,0,.3+i*drawerHeight,0,wood);
 const textures:THREE.Texture[]=[];
 function inscription(title:string,number:string){
  const surface=document.createElement('canvas');surface.width=768;surface.height=128;
  const ctx=surface.getContext('2d')!;
  ctx.fillStyle='#eee7d3';ctx.fillRect(0,0,768,128);
  ctx.fillStyle='#5b432b';ctx.font='bold 32px sans-serif';ctx.fillText(number,22,75);
  ctx.fillStyle='#1c3040';ctx.font='bold 49px Georgia, serif';ctx.fillText(title,number.length>2?180:95,79,565);
  return surface;
 }
 function plaque(parent:THREE.Object3D,width:number,height:number,surface:HTMLCanvasElement){
  const texture=new THREE.CanvasTexture(surface);texture.colorSpace=THREE.SRGBColorSpace;textures.push(texture);
  const mesh=new THREE.Mesh(new THREE.PlaneGeometry(width,height),new THREE.MeshBasicMaterial({map:texture,toneMapped:false}));
  parent.add(mesh);return {mesh,texture};
 }
 const drawers=catalogue.map((record,index)=>{
  const group=new THREE.Group();group.position.y=.315+(3-index)*drawerHeight;cabinet.add(group);
  box(group,2.85,.09,1.77,0,.045,0,wood);
  for(const x of [-1.39,1.39])box(group,.09,.36,1.8,x,.22,0,wood);
  box(group,2.8,.36,.09,0,.22,-.86,wood);box(group,2.94,.66,.14,0,.33,1.02,trim);
  box(group,2.88,.60,.024,0,.33,1.092,wood);
  for(const x of [-.27,.27])box(group,.055,.055,.14,x,.22,1.15,brass);
  const handleMaterial=brass.clone();
  box(group,.6,.065,.055,0,.22,1.23,handleMaterial);
  box(group,2.12,.272,.031,0,.48,1.112,patina);
  box(group,2.08,.249,.019,0,.48,1.132,brass);
  box(group,1.99,.208,.007,0,.48,1.142,enamel);
  for(const x of [-1.02,1.02])box(group,.013,.019,.008,x,.48,1.145,patina);
  const rails=[-1.46,1.46].map(x=>{
   box(cabinet,.035,.09,1.8,x,group.position.y+.17,0,railMaterial);
   box(group,.035,.04,1.65,x,.17,0,railMaterial);
   return box(cabinet,.025,.065,1.8,x,group.position.y+.17,0,railMaterial);
  });
  const folders=record.projects.map((project,i)=>{
   const folder=new THREE.Group();
   // Arrange folders by row while keeping all labels exposed.
   const columns=Math.max(2,Math.ceil(record.projects.length/2));
   const width=2.48/columns;
   folder.position.set((i%columns-(columns-1)/2)*width,.109,i<columns?.44:-.39);
   folder.scale.x=Math.min(1,width/1.14);
   folder.rotation.y=i%2===0?.035:-.035;
   group.add(folder);
   box(folder,1.06,.036,.69,0,0,0,folderMaterial);box(folder,.98,.014,.62,0,.023,0,paper);
   box(folder,1.06,.021,.69,0,.035,0,folderMaterial);
   const {mesh}=plaque(folder,.91,.17,inscription(project.title,project.number));
   mesh.rotation.x=-Math.PI/2;mesh.position.y=.048;
   return folder;
  });
  return {record,group,rails,folders,handleMaterial};
 });
 // The table starts beyond the maximum front travel of the lowest drawer.
 const tableZ=4.12;
 const tableX=-2.75;
 const table=new THREE.Group();scene.add(table);
 box(table,4.1,.12,1.88,tableX-.83,1.42,tableZ,wood);
 for(const x of [tableX-2.67,tableX+.98])for(const z of [3.36,4.88])box(table,.1,1.44,.1,x,.64,z,edge);
 const secret=box(cabinet,.27,.14,.036,1.19,3.305,1.066,brass);

 const file=new THREE.Group();scene.add(file);
 box(file,1.8,.025,1.12,0,0,0,folderMaterial);
 for(let i=0;i<4;i++)box(file,1.68,.007,1.01,0,.02+i*.008,0,paper);
 box(file,.48,.014,.14,.5,.015,-.6,folderMaterial);
 const hinge=new THREE.Group();hinge.position.set(-.9,.061,0);file.add(hinge);box(hinge,1.8,.022,1.12,.9,0,0,folderMaterial);
 box(hinge,.85,.004,.34,.95,.015,0,paper);box(hinge,.055,.006,.3,.53,.018,0,burgundy);
 const clasp=new THREE.Group();clasp.position.set(1.72,.025,0);hinge.add(clasp);box(clasp,.14,.025,.16,0,0,0,brass);
 const labelSurface=inscription('','');
 const {mesh:labelMesh,texture:labelTexture}=plaque(hinge,.78,.16,labelSurface);
 labelMesh.rotation.x=-Math.PI/2;labelMesh.position.set(.95,.022,0);
 const documentPage=box(file,1.58,.004,.92,0,.051,0,paper);
 const documentTexture=plaque(file,1.5,.24,inscription('',''));
 documentTexture.mesh.rotation.x=-Math.PI/2;
 documentTexture.mesh.position.set(0,.054,-.26);

 let state='idle',busy=false,disposed=false,frame=0,epoch=0,failed=false;
 let hover=-1,hoverFrame=0;
 const highlights=drawers.map(()=>0);
 let drawerIndex=0,folderIndex=0;
 const selected=()=>drawers[drawerIndex].record.projects[folderIndex];
 const pose={drawer:0,lift:0,transfer:0,lower:0,clasp:0,cover:0,camera:0,approach:0};
 const initial={...pose};
 function setFolder(index:number){
  folderIndex=index;
  const project=selected();
  labelSurface.getContext('2d')!.drawImage(inscription(project.title,project.number),0,0);
  labelTexture.needsUpdate=true;
  (documentTexture.texture.image as HTMLCanvasElement).getContext('2d')!.drawImage(inscription(project.title,project.number),0,0);
  documentTexture.texture.needsUpdate=true;
  link.href=project.url;
 }
 function render(){
  if(disposed||failed)return;
  const active=drawers[drawerIndex], slot=active.folders[folderIndex];
  const travel=pose.drawer*1.72;
  drawers.forEach(({group,rails,folders},i)=>{
   group.position.z=i===drawerIndex?travel:0;
   for(const rail of rails)rail.position.z=group.position.z*.5;
   folders.forEach((folder,j)=>folder.visible=!(i===drawerIndex&&j===folderIndex&&pose.lift>0));
  });
  file.visible=pose.lift>0;
  // Lift above the drawer walls before moving across to the reading table.
  const clearance=active.group.position.y+.7;
  const liftY=THREE.MathUtils.lerp(active.group.position.y+slot.position.y,clearance,pose.lift);
  const transferY=THREE.MathUtils.lerp(liftY,2.79,Math.max(0,pose.transfer*2-1));
  const slideSideways=THREE.MathUtils.smoothstep(pose.transfer,.36,1);
  file.position.set(THREE.MathUtils.lerp(slot.position.x,tableX,slideSideways),transferY-pose.lower*1.295,THREE.MathUtils.lerp(travel+slot.position.z,tableZ,pose.transfer));
  const scale=THREE.MathUtils.lerp(.6,1,slideSideways);
  file.scale.set(scale*THREE.MathUtils.lerp(slot.scale.x,1,slideSideways),scale,scale);
  file.rotation.y=slot.rotation.y*(1-pose.transfer);
  clasp.rotation.z=-pose.clasp*Math.PI/2;hinge.rotation.z=pose.cover*(Math.PI+.035);
  const mobile=viewport.clientWidth<650;
  const look=new THREE.Vector3(0,1.67,.25);
  const drawerLook=new THREE.Vector3(0,active.group.position.y+.36,1.55);
  const tableLook=new THREE.Vector3(tableX-.55,1.62,3.85);
  const cameraPosition=new THREE.Vector3(mobile?1.85:2.75,3.7,7.7);
  const drawerCamera=new THREE.Vector3(2.15,drawerLook.y+3.55,7.55);
  const tableCamera=new THREE.Vector3(tableX+1.38,4.7,7.65);
  if(mobile||camera.aspect<1.28){
   fit(cameraPosition,look,[-1.62,1.62,-.1,3.38,-1.06,1.25]);
   fit(drawerCamera,drawerLook,[-1.51,1.51,active.group.position.y,active.group.position.y+.95,-.5,2.97]);
   fit(tableCamera,tableLook,[tableX-2.75,tableX+1.15,1.4,2.15,3.1,5.06]);
  }
  if(pose.camera<=.35){
   const amount=pose.camera/.35;
   look.lerp(drawerLook,amount);cameraPosition.lerp(drawerCamera,amount);
  }else{
   const amount=(pose.camera-.35)/.65;
   look.copy(drawerLook).lerp(tableLook,amount);cameraPosition.copy(drawerCamera).lerp(tableCamera,amount);
  }
  look.lerp(new THREE.Vector3(tableX,1.55,tableZ),pose.approach);
  cameraPosition.lerp(new THREE.Vector3(tableX,3.13,tableZ+.18),pose.approach);
  camera.position.copy(cameraPosition);camera.lookAt(look);renderer.render(scene,camera);
  projectPlaques();
 }
 const plaquePoints=[new THREE.Vector3(),new THREE.Vector3(),new THREE.Vector3()];
 const plaqueCorners=[[-.995,.584],[.995,.584],[-.995,.376]];
 function projectPlaques(){
  const w=viewport.clientWidth,h=viewport.clientHeight;
  drawers.forEach(({group},index)=>{
   const label=plaques[index];
   label.hidden=pose.lift>0||(pose.drawer>0&&index!==drawerIndex);
   if(label.hidden)return;
   const [origin,right,bottom]=plaquePoints;
   plaquePoints.forEach((point,i)=>{
    const [x,y]=plaqueCorners[i];
    group.localToWorld(point.set(x,y,1.146)).project(camera);
    point.set((point.x+1)*w*.5,(1-point.y)*h*.5,point.z);
   });
   const dx=right.x-origin.x,dy=right.y-origin.y;
   const downX=bottom.x-origin.x,downY=bottom.y-origin.y;
   const width=Math.hypot(dx,dy),height=Math.hypot(downX,downY);
   if(width<1||height<1){label.hidden=true;return;}
   label.style.width=width+'px';label.style.height=height+'px';
   label.style.fontSize=Math.min(17,width/(catalogue[index].label.length*.48+3.6),height*.86)+'px';
   label.style.transform='matrix('+[dx/width,dy/width,downX/height,downY/height,origin.x,origin.y].join(',')+')';
  });
 }

 function fit(position:THREE.Vector3,look:THREE.Vector3,bounds:number[]){
  const backwards=position.clone().sub(look).normalize();
  const right=new THREE.Vector3().crossVectors(camera.up,backwards).normalize();
  const up=new THREE.Vector3().crossVectors(backwards,right);
  const tangent=Math.tan(THREE.MathUtils.degToRad(camera.fov/2));
  const offset=new THREE.Vector3();
  let distance=position.distanceTo(look);
  for(const x of bounds.slice(0,2))for(const y of bounds.slice(2,4))for(const z of bounds.slice(4,6)){
   offset.set(x,y,z).sub(look);
   const depth=offset.dot(backwards);
   distance=Math.max(distance,Math.abs(offset.dot(right))/(tangent*camera.aspect)*1.1+depth,Math.abs(offset.dot(up))/tangent*1.1+depth);
  }
  position.copy(look).addScaledVector(backwards,distance);
 }
 function resize(){const w=viewport.clientWidth,h=viewport.clientHeight;if(!w||!h)return;renderer.setSize(w,h,false);camera.aspect=w/h;camera.fov=w<650?46:39;camera.updateProjectionMatrix();render();}
 function ui(){
  const stage=states.indexOf(state), idle=stage===0, choosing=stage===1;
  root.dataset.state=state;root.setAttribute('aria-busy',String(busy));
  status.textContent=idle?drawerOptions.getAttribute('aria-label')!:copy.steps[stage];
  drawerOptions.hidden=!idle;
  drawerButtons.forEach(button=>button.disabled=busy||failed);
  folderOptions.forEach((group,i)=>group.hidden=!choosing||i!==drawerIndex);
  folderButtons.forEach(button=>button.disabled=busy||failed);
  back.hidden=idle||stage===4;back.disabled=busy||failed;
  next.hidden=stage!==2;next.disabled=busy||failed;
  link.hidden=stage!==3;link.setAttribute('aria-disabled',String(busy||failed));
 }

 function tween(values:Partial<typeof pose>,duration:number){const start={...pose},generation=epoch;return new Promise<void>((resolve,reject)=>{if(reduced.matches){Object.assign(pose,values);render();resolve();return;}const t0=performance.now();function tick(now:number){if(disposed||generation!==epoch){reject(new Error('interrupted'));return;}const t=Math.min(1,(now-t0)/duration),e=t*t*(3-2*t);for(const k of Object.keys(values) as (keyof typeof pose)[])pose[k]=start[k]+(values[k]!-start[k])*e;render();if(t<1)frame=requestAnimationFrame(tick);else resolve();}frame=requestAnimationFrame(tick);});}
 async function move(direction:number){if(busy||disposed||failed)return;const dest=nextState(state,direction);if(dest===state)return;
 if(state==='idle'||(state==='drawer-open'&&direction<0))audio.play(direction>0);
 setHover(-1);busy=true;ui();
 try {
 if(direction===1){
  if(state==='idle')await tween({drawer:1,camera:.35},1100);
  if(state==='drawer-open'){
   await tween({lift:1},650);await tween({transfer:1,camera:1},1000);await tween({lower:1},700);
  }
  if(state==='file-selected'){
   await tween({clasp:1},450);await tween({cover:1},1000);
   if(!reduced.matches)await tween({approach:.12},360);
  }
 }else{
  if(state==='file-unsealed'){
   await tween({cover:0,approach:0},850);await tween({clasp:0},350);
  }
  if(state==='file-selected'){
   await tween({lower:0},650);await tween({transfer:0,camera:.35},950);await tween({lift:0},650);
  }
  if(state==='drawer-open')await tween({drawer:0,camera:0},1000);
 }
 state=dest;busy=false;ui();
 if(dest==='idle'){
  const home=new URL(location.href);
  home.searchParams.delete('drawer');home.searchParams.delete('file');
  if(home.href!==location.href)history.replaceState(history.state,'',home);
  drawerButtons[drawerIndex].focus();
 }
 if(dest==='drawer-open')folderOptions[drawerIndex].querySelectorAll('button')[folderIndex]?.focus();
 if(dest==='file-selected')next.focus();
 if(dest==='file-unsealed')link.focus();
 }catch{if(!disposed){busy=false;ui();}}}
 function chooseDrawer(index:number){
  if(busy||failed||state!=='idle')return;
  drawerIndex=index;setFolder(0);void move(1);
 }
 function chooseFolder(index:number){
  if(busy||failed||state!=='drawer-open')return;
  setFolder(index);void move(1);
 }
 drawerButtons.forEach((button,index)=>button.addEventListener('click',()=>chooseDrawer(index)));
 folderOptions.forEach(group=>group.querySelectorAll('button').forEach((button,index)=>button.addEventListener('click',()=>chooseFolder(index))));
 next.addEventListener('click',()=>void move(1));
 back.addEventListener('click',()=>void move(-1));

 const ray=new THREE.Raycaster();let down:{x:number;y:number}|undefined;
 function hitAt(e:PointerEvent){
  const bounds=canvas.getBoundingClientRect();
  ray.setFromCamera(new THREE.Vector2((e.clientX-bounds.left)/bounds.width*2-1,-(e.clientY-bounds.top)/bounds.height*2+1),camera);
  return ray.intersectObjects(scene.children,true).find(({object})=>{
   for(let parent:THREE.Object3D|null=object;parent;parent=parent.parent)if(!parent.visible)return false;
   return true;
  });
 }
 function hoveredDrawer(e:PointerEvent){
  const hit=hitAt(e);
  for(let object:THREE.Object3D|null=hit?.object??null;object;object=object.parent){
   const index=drawers.findIndex(drawer=>drawer.group===object);
   if(index!==-1)return index;
  }
  return -1;
 }
 function setHover(index:number){
  if(index===hover)return;
  hover=index;canvas.style.cursor=index===-1?'':'pointer';
  cancelAnimationFrame(hoverFrame);
  const previous=highlights.slice(),start=performance.now();
  function paint(now:number){
   const t=reduced.matches?1:Math.min(1,(now-start)/145);
   const eased=1-(1-t)**2;
   drawers.forEach(({handleMaterial},i)=>{
    const value=highlights[i]=THREE.MathUtils.lerp(previous[i],i===hover?1:0,eased);
    handleMaterial.color.copy(brass.color).lerp(hoverBrass,value);
    handleMaterial.roughness=.54-value*.14;
   });
   render();
   if(t<1&&!disposed&&!failed)hoverFrame=requestAnimationFrame(paint);
  }
  if(reduced.matches)paint(start);
  else hoverFrame=requestAnimationFrame(paint);
 }
 const hoverBrass=new THREE.Color('#cab18a');
 canvas.addEventListener('pointermove',e=>{
  if(e.pointerType==='mouse'&&!busy&&!failed&&state==='idle')setHover(hoveredDrawer(e));
 });
 canvas.addEventListener('pointerleave',()=>setHover(-1));
 canvas.addEventListener('pointerdown',e=>{
  down={x:e.clientX,y:e.clientY};
  if(e.pointerType!=='mouse'&&!busy&&!failed&&state==='idle')setHover(hoveredDrawer(e));
 });
 canvas.addEventListener('pointercancel',()=>{down=undefined;setHover(-1);});
 canvas.addEventListener('pointerup',e=>{
  const start=down;down=undefined;
  if(e.pointerType!=='mouse')setHover(-1);
  if(!start||busy||failed||Math.hypot(e.clientX-start.x,e.clientY-start.y)>8)return;
  const hit=hitAt(e);
  if(!hit)return;
  for(let parent:THREE.Object3D|null=hit.object;parent;parent=parent.parent){
   if(state==='idle'){
    const index=drawers.findIndex(drawer=>drawer.group===parent);
    if(index!==-1){chooseDrawer(index);return;}
    if(parent===secret){notes.open=!notes.open;if(notes.open)notes.querySelector('summary')!.focus();return;}
   }
   if(state==='drawer-open'){
    const index=drawers[drawerIndex].folders.indexOf(parent as THREE.Group);
    if(index!==-1){chooseFolder(index);return;}
   }
   if(state==='file-selected'&&parent===file){void move(1);return;}
   if(state==='file-unsealed'&&parent===file){link.click();return;}
  }
 });
 root.addEventListener('keydown',e=>{
  if(e.key==='Escape'&&!back.hidden&&!back.disabled){e.preventDefault();void move(-1);}
 });

 function paperFrames(){
  const bounds=canvas.getBoundingClientRect();
  const points=[[-.79,-.46],[-.79,.46],[.79,-.46],[.79,.46]].map(([x,z])=>{
   const point=documentPage.localToWorld(new THREE.Vector3(x,0,z)).project(camera);
   return {x:bounds.left+(point.x+1)*bounds.width/2,y:bounds.top+(1-point.y)*bounds.height/2};
  });
  const left=Math.max(0,Math.min(...points.map(p=>p.x))),right=Math.min(innerWidth,Math.max(...points.map(p=>p.x)));
  const top=Math.max(0,Math.min(...points.map(p=>p.y))),bottom=Math.min(innerHeight,Math.max(...points.map(p=>p.y)));
  const closed={clipPath:'inset('+top+'px '+(innerWidth-right)+'px '+(innerHeight-bottom)+'px '+left+'px)',opacity:.82};
  return [closed,{clipPath:'inset(0px 0px 0px 0px)',opacity:1}];
 }
 function showPaper(){
  const project=selected(), image=overlay.querySelector('img')!;
  overlay.querySelector('span')!.textContent=project.number;
  overlay.querySelector('strong')!.textContent=project.title;
  image.hidden=!project.cover;
  if(project.cover)image.src=project.cover;
  overlay.hidden=false;
 }
 async function openProject(event:MouseEvent){
  if(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||event.button!==0)return;
  event.preventDefault();
  if(busy||failed||state!=='file-unsealed')return;
  const project=selected();
  const home=new URL(location.href);
  home.searchParams.set('drawer',drawers[drawerIndex].record.id);
  home.searchParams.set('file',project.id);
  home.hash='archive';
  history.replaceState(history.state,'',home);
  if(reduced.matches){location.assign(project.url);return;}
  state='project-open';busy=true;ui();
  const bounds=viewport.getBoundingClientRect();
  if(bounds.top<0||bounds.bottom>innerHeight)viewport.scrollIntoView({block:'center',behavior:'smooth'});
  try{
   await new Promise(resolve=>setTimeout(resolve,230));
   await tween({approach:1},940);
   showPaper();
   await overlay.animate(paperFrames(),{duration:470,easing:'ease-in-out',fill:'forwards'}).finished;
  }catch{overlay.hidden=true;}
  location.assign(project.url);
 }
 link.addEventListener('click',openProject);
 const ro=new ResizeObserver(resize);ro.observe(viewport);

 function restore(){
  if(failed)return;
  epoch++;cancelAnimationFrame(frame);
  overlay.getAnimations().forEach(animation=>animation.cancel());overlay.hidden=true;
  busy=false;Object.assign(pose,initial);
  const params=new URLSearchParams(location.search);
  const restoredDrawer=drawers.findIndex(drawer=>drawer.record.id===params.get('drawer'));
  const restoredFolder=drawers[restoredDrawer]?.record.projects.findIndex(project=>project.id===params.get('file'))??-1;
  if(restoredDrawer<0||restoredFolder<0){drawerIndex=0;setFolder(0);state='idle';ui();resize();return;}
  drawerIndex=restoredDrawer;setFolder(restoredFolder);state='file-unsealed';
  Object.assign(pose,{drawer:1,lift:1,transfer:1,lower:1,clasp:1,cover:1,camera:1});
  if(reduced.matches||!('animate' in overlay)){ui();resize();return;}
  busy=true;pose.approach=1;ui();resize();showPaper();
  const animation=overlay.animate(paperFrames().reverse(),{duration:420,easing:'ease-in-out'});
  void animation.finished.then(async()=>{
   overlay.hidden=true;
   await tween({approach:.12},760);
   busy=false;ui();link.focus({preventScroll:true});
  }).catch(()=>{});
 }
 window.addEventListener('pageshow',e=>{if(e.persisted)restore();});
 canvas.addEventListener('webglcontextlost',e=>{
  e.preventDefault();failed=true;epoch++;busy=true;ui();audio.stop();plaques.forEach(label=>label.hidden=true);overlay.hidden=true;loading.hidden=false;loading.textContent=copy.error;
 });
 function dispose(){
  disposed=true;cancelAnimationFrame(frame);cancelAnimationFrame(hoverFrame);ro.disconnect();audio.dispose();
  const materials=new Set<THREE.Material>();
  const geometries=new Set<THREE.BufferGeometry>();
  scene.traverse(object=>{
   if(object instanceof THREE.Mesh){
    geometries.add(object.geometry);
    for(const material of Array.isArray(object.material)?object.material:[object.material])materials.add(material);
   }
  });
  geometries.forEach(geometry=>geometry.dispose());
  materials.forEach(material=>material.dispose());
  for(const texture of [...textures,woodTexture,paperTexture])texture.dispose();
  key.shadow.dispose();renderer.dispose();
 }

 window.addEventListener('pagehide',e=>{if(e.persisted)audio.stop();else dispose();});
 loading.hidden=true;viewport.setAttribute('aria-busy','false');restore();
}
