import type {Lang} from './config';
import type {Project} from './projects';

const frames = {
 home:[3020,1550], algebra:[1867,1486], statistics:[3030,1649], frequency:[3031,1649],
 functions:[3030,1645], code:[3024,1624], probability:[3012,1655], matrix:[3033,1651], services:[3045,1256],
} as const;
export type LabFrame = keyof typeof frames;
export function labImage(frame:LabFrame){
 const [width,height]=frames[frame];
 return {src:'/assets/playground-lab/'+frame+'.png',width,height};
}
type Text = {
 value:string; summary:string; role:string; concept:[string,string]; experience:[string,string];
 labs:string; design:[string,string]; technical:[string,string]; visit:string; enlarge:string;
 captions:Record<LabFrame,string>;
};
export const labText:Record<Lang,Text>={
 en:{
  value:'A browser workspace for mathematics, statistics, probability, visualization and code.',
  summary:'Start with an expression, a dataset or a small program. Playground Lab keeps the tools for exploring each of them within reach, in English, Spanish and Simplified Chinese.',
  role:'Independent design and development',
  concept:['One workspace, several ways to investigate','A calculation often leads to a graph or a new question about the data. I brought those tools together so an investigation can continue in the same workspace.'],
  experience:['Keep related work in view','Tabs keep experiments separate, and split view places two tools side by side. The Professional and Learning modes support working directly with the tools or following a guided exploration. Quick Lab brings a calculator, a mini graph and probability tools into a side panel.'],
  labs:'Inside the labs',
  design:['Give the working material room','Ivory backgrounds soften the workspace while burgundy marks the active tab or a selected series. The same editorial hierarchy carries from the landing page into dense statistical tables and the darker code editor.'],
  technical:['How it is built','The application uses React and TypeScript with Vite. Math.js handles expressions and KaTeX renders notation. Code Studio uses CodeMirror for editing and loads Pyodide for Python execution. Workspace state is saved in the browser.'],
  visit:'Open Playground Lab',enlarge:'Open full-size screenshot',
  captions:{home:'The homepage pairs a function input with its graph and introduces the labs below.',algebra:'Math Engine shows an algebra and calculus method, the editable expression and its typeset preview.',matrix:'Matrix Lab places matrices A and B beside the result of the selected operation.',functions:'Function Lab plots two curves together, with a crosshair and readout for the selected point.',statistics:'Data Studio groups descriptive statistics by central tendency, dispersion, position and counts.',frequency:'A frequency chart sits beside its table, with the selected bar highlighted.',probability:'The Quick Lab calculator opens beside the normal distribution explorer.',code:'Code Studio runs a Python statistics example and shows the result in the output pane.',services:'The project’s Services page carries the same typography and ruled layout beyond the workspace.'},
 },
 es:{
  value:'Un espacio de trabajo en el navegador para explorar matemáticas, estadística, probabilidad, visualización y código.',
  summary:'Empieza con una expresión, un conjunto de datos o un pequeño programa. Playground Lab reúne las herramientas para explorarlos en inglés, español y chino simplificado.',
  role:'Diseño y desarrollo independientes',
  concept:['Un espacio para distintas formas de investigar','De un cálculo suele salir un gráfico o una nueva pregunta sobre los datos. Reuní estas herramientas para poder seguir explorando en un mismo lugar.'],
  experience:['El trabajo relacionado, a la vista','Las pestañas separan los experimentos y la vista dividida permite colocar dos herramientas en paralelo. Los modos Profesional y de Aprendizaje permiten trabajar directamente o seguir una exploración guiada. Quick Lab abre una calculadora, un gráfico pequeño y herramientas de probabilidad en un panel lateral.'],
  labs:'Dentro de los laboratorios',
  design:['Espacio para leer y trabajar','El fondo marfil suaviza la interfaz y el burdeos indica la pestaña activa o una serie seleccionada. La jerarquía editorial de la portada se mantiene en las tablas estadísticas y en el editor de código oscuro.'],
  technical:['Cómo está construido','La aplicación usa React y TypeScript con Vite. Math.js procesa las expresiones y KaTeX muestra la notación matemática. Code Studio usa CodeMirror para editar y carga Pyodide para ejecutar Python. El estado del espacio de trabajo se guarda en el navegador.'],
  visit:'Abrir Playground Lab',enlarge:'Abrir captura a tamaño completo',
  captions:{home:'La portada combina una entrada de funciones con su gráfica y presenta los laboratorios debajo.',algebra:'Math Engine muestra un método de álgebra y cálculo, la expresión editable y su vista previa tipográfica.',matrix:'Matrix Lab coloca las matrices A y B junto al resultado de la operación seleccionada.',functions:'Function Lab dibuja dos curvas y muestra las coordenadas del punto señalado.',statistics:'Data Studio agrupa las estadísticas descriptivas por tendencia central, dispersión, posición y recuentos.',frequency:'El gráfico de frecuencias aparece junto a su tabla, con la barra seleccionada resaltada.',probability:'La calculadora de Quick Lab se abre al lado del explorador de la distribución normal.',code:'Code Studio ejecuta un ejemplo de estadística en Python y muestra el resultado en el panel de salida.',services:'La página de servicios mantiene la tipografía y las líneas divisorias del proyecto fuera del espacio de trabajo.'},
 },
 zh:{
  value:'在浏览器里探索数学、统计、概率、可视化和编程的工作台。',
  summary:'可以从一条表达式、一份数据或一小段程序开始。Playground Lab 把探索这些问题时用到的工具放在一起，提供英语、西班牙语和简体中文界面。',
  role:'独立设计与开发',
  concept:['在同一个工作台继续追问','一次计算经常会引出一张图，或让人对数据产生新的疑问。我把这些工具放在同一个工作台里，让探索可以接着做下去。'],
  experience:['把相关的工作并排放在眼前','不同实验可以放在不同标签页，也能用分屏并排打开两个工具。专业模式适合直接操作，学习模式提供引导。需要临时计算时，Quick Lab 在侧栏提供计算器、小型图表和概率工具。'],
  labs:'走进各个实验室',
  design:['为公式、数据和代码留出空间','象牙白作为工作区底色，酒红色标出当前标签和选中的数据系列。从首页到信息密集的统计表，再到深色代码编辑器，页面沿用同一套阅读层级。'],
  technical:['实现方式','应用使用 React、TypeScript 和 Vite。Math.js 处理表达式，KaTeX 排版数学公式。Code Studio 用 CodeMirror 编辑代码，并加载 Pyodide 运行 Python。工作台状态保存在浏览器中。'],
  visit:'打开 Playground Lab',enlarge:'查看原尺寸截图',
  captions:{home:'首页把函数输入与图像放在一起，下方是各实验室的入口。',algebra:'Math Engine 的代数与微积分界面同时展示计算方法、可编辑表达式与公式预览。',matrix:'Matrix Lab 将矩阵 A、矩阵 B 和所选运算的结果并排呈现。',functions:'Function Lab 将两条曲线画在同一坐标系中，并显示选中点的坐标。',statistics:'Data Studio 按集中趋势、离散程度、位置与计数组织描述统计。',frequency:'频数图和频数表并排显示，选中的柱形以酒红色突出。',probability:'Quick Lab 计算器可在正态分布探索界面旁打开。',code:'Code Studio 运行一段 Python 统计示例，并在输出面板显示结果。',services:'应用的服务页沿用了工作台的字体与细线分隔。'},
 },
};

export const playgroundLab:Project={
 slug:'playground-lab',title:'PLAYGROUND LAB',category:4,tags:['Mathematics','Data visualization','Programming'],
 year:2026,status:'live',published:true,featured:true,cover:labImage('home').src,gallery:[],
 live:'https://playground-lab.pages.dev/',repository:null,
 technologies:['React','TypeScript','Vite','Math.js','KaTeX','CodeMirror','Pyodide'],
 translations:Object.fromEntries(Object.entries(labText).map(([lang,{value,summary,role}])=>
  [lang,{value,summary,role,objectives:[],process:[],features:[],challenges:[],outcomes:[]}]
 )) as Project['translations'],
};
