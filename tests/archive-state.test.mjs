import test from 'node:test';
import assert from 'node:assert/strict';
import {states,nextState} from '../src/lib/archive/state.mjs';
test('archive can progress to a project and reverse through each state',()=>{
 let state='idle';
 for(const expected of states.slice(1)){state=nextState(state,1);assert.equal(state,expected);}
 assert.equal(nextState(state,1),'project-open');
 for(const expected of states.slice(0,-1).reverse()){state=nextState(state,-1);assert.equal(state,expected);}
 assert.equal(nextState(state,-1),'idle');
});
test('invalid transitions cannot skip states',()=>{
 assert.equal(nextState('idle',2),'idle');assert.equal(nextState('idle',0),'idle');assert.equal(nextState('unknown',1),'unknown');
});
