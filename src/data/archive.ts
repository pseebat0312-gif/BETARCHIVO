import type {Lang} from './config';
import {publicProjects} from './projects';

// Slugs are stable IDs. Numbers stay fixed when the display order changes.
const archiveNumbers: Record<string, string> = {
 'entre-flores':'BA-001', 'student-hub-spain':'BA-002', 'playground-lab':'BA-003',
 'interactive-phone':'BA-004', 'merge-game':'BA-005', 'squish-toy':'BA-006',
};
const drawers = [
 {id:'featured', names:{en:'Featured Work',es:'Obras destacadas',zh:'精选作品'}, includes:(p:typeof publicProjects[number])=>p.featured},
 {id:'digital', names:{en:'Digital Products',es:'Productos digitales',zh:'数字产品'}, includes:(p:typeof publicProjects[number])=>[1,4].includes(p.category)},
 {id:'visual', names:{en:'Visual & Interactive',es:'Visual e interactivo',zh:'视觉与交互'}, includes:(p:typeof publicProjects[number])=>p.category===2},
 {id:'games', names:{en:'Games & Experiments',es:'Juegos y experimentos',zh:'游戏与实验'}, includes:(p:typeof publicProjects[number])=>p.category===3},
];
export function archiveDrawers(lang:Lang){
 return drawers.map(({id,names,includes},index)=>({
  id, label:names[lang], number:String(index+1).padStart(2,'0'),
  projects:publicProjects.filter(includes).map(p=>({
   id:p.slug, title:p.title, number:archiveNumbers[p.slug]??p.slug, cover:p.cover,
   url:`/${lang}/work/${p.slug}/?from=archive&drawer=${id}`,
  })),
 }));
}
export const archiveLabels = {
 en:{choose:'Select a drawer on the cabinet',folders:'Project folders',notes:'Cabinet notes',note:'Four drawers share one catalogue. Featured files also appear in their subject drawer.',mute:'Drawer sound on',unmute:'Drawer sound off'},
 es:{choose:'Selecciona un cajón del archivador',folders:'Carpetas de proyectos',notes:'Notas del archivador',note:'Cuatro cajones comparten un catálogo. Las carpetas destacadas también están en su cajón temático.',mute:'Sonido de cajones activado',unmute:'Sonido de cajones silenciado'},
 zh:{choose:'选择柜面上的抽屉',folders:'项目文件夹',notes:'档案柜札记',note:'四只抽屉共用一份目录。精选档案也可在所属主题的抽屉里查阅。',mute:'抽屉声音已开启',unmute:'抽屉声音已关闭'},
};
export const archiveCopy:Record<Lang,{steps:string[];actions:string[];back:string;index:string;loading:string;error:string;return:string}>={
 en:{steps:['The archive is closed.','Choose the folder inside the drawer.','The folder rests on the reading table. Release its clasp.','The file is open. Enter the project.','Opening the project.'],actions:['Open drawer','Select folder','Unseal file','View project'],back:'Previous step',index:'Browse all projects',loading:'Preparing the archive…',error:'The 3D archive is unavailable. Browse the projects below.',return:'Return to archive'},
 es:{steps:['El archivo está cerrado.','Elige la carpeta del cajón.','La carpeta está en la mesa. Abre el cierre.','El archivo está abierto. Entra en el proyecto.','Abriendo el proyecto.'],actions:['Abrir cajón','Elegir carpeta','Abrir archivo','Ver proyecto'],back:'Paso anterior',index:'Ver todos los proyectos',loading:'Preparando el archivo…',error:'El archivo 3D no está disponible. Explora los proyectos abajo.',return:'Volver al archivo'},
 zh:{steps:['档案柜尚未开启。','选择抽屉中的文件夹。','文件已放在阅览台上，请解开搭扣。','档案已打开，可以进入项目。','正在进入项目。'],actions:['拉开抽屉','选择文件','启封档案','查看项目'],back:'返回上一步',index:'浏览全部项目',loading:'正在准备档案室…',error:'暂时无法显示三维档案，可通过下方链接浏览项目。',return:'返回档案柜'}
};
