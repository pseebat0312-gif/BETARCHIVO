export const states = ['idle','drawer-open','file-selected','file-unsealed','project-open'];
export function nextState(state, direction) {
 const index=states.indexOf(state);
 if(index<0 || ![-1,1].includes(direction)) return state;
 return states[Math.max(0,Math.min(states.length-1,index+direction))];
}
