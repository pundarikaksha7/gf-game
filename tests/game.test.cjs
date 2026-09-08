const fs = require('fs'), vm = require('vm'), assert = require('assert');
const noop = () => {};
const ctx = new Proxy({}, {get: (_, key) => key === 'createLinearGradient' ? () => ({addColorStop:noop}) : noop, set:()=>true});
const el = () => ({style:{},setAttribute:noop,classList:{add:noop,remove:noop},appendChild:noop,addEventListener:noop,querySelector:()=>el(),getContext:()=>ctx});
const sandbox = {console,Math,Set,performance:{now:()=>0},requestAnimationFrame:noop,document:{getElementById:()=>el(),createElement:()=>el()}, window:{addEventListener:noop}, Image:class{}, Audio:class{play(){return Promise.resolve()} pause(){}}, navigator:{maxTouchPoints:0}};
let source = fs.readFileSync('src/code.html','utf8').match(/<script>([\s\S]*?)<\/script>/)[1];
source = source.replace('lastTime = performance.now();', `window.test = { player, keys, get chain(){return styleChain}, get score(){return stageScore}, powerupTimers, powerupDefinitions, updatePowerups, dropPowerup, get powerups(){return powerups}, damageEnemy, updateBoss, startAttack, activatePowerup, updatePlayer, updateEnemies, beginLevel, restartLevel, getPlatforms, gameLoop, getLevelLength, get boss(){return boss}, get enemies(){return enemies}, get companions(){return companions}, get holes(){return groundHoles}, get complete(){return allLevelsComplete}, tick(dt){worldTime+=dt;updatePlayer(dt);updateLevelTransition(dt);} }; lastTime = performance.now();`);
(async()=>{
 vm.createContext(sandbox); vm.runInContext(source,sandbox); await Promise.resolve(); const g=sandbox.window.test; assert(g,'boot');
 const tick=(n)=>{for(let i=0;i<n;i++)g.tick(1/120)};
 g.activatePowerup('cfa'); assert(g.startAttack('punch')); tick(70); assert(g.startAttack('kick'),'beam fires repeatedly'); tick(70); assert(g.startAttack('punch'));
 g.restartLevel(); assert(!g.player.cfaActive); g.activatePowerup('cat'); assert.equal(g.companions.length,2); g.gameLoop(16);
 // Pursuit must work in both directions across a height difference, for every IQ tier.
 for(const type of ['small','medium','large']) {
   g.beginLevel(0); const e=g.enemies.find(e=>e.type===type);g.enemies.filter(o=>o!==e).forEach(o=>o.x=-10000);
   Object.assign(e,{x:790,y:810-e.h-16,onGround:true,awakened:true,jumpCooldown:0,support:null});
   Object.assign(g.player,{x:1200,y:968,hurtTimer:100});
   const initial=Math.abs(e.x-g.player.x); tick(120*7);
   assert(e.health>0 && Math.abs(e.x-g.player.x)<initial-150, type+' hunts from platform to ground');
   g.player.x=e.x-140;g.updateEnemies(1/120);assert(!e.facingRight, type+' faces left toward hero');
   g.player.x=e.x+140;g.updateEnemies(1/120);assert(e.facingRight, type+' faces right toward hero');
 }
 g.restartLevel();
 g.dropPowerup('blue', {x:g.player.x,y:g.player.y,w:64,h:96});
 const drop=g.powerups[0];Object.assign(g.player,{x:drop.x,y:drop.y});
 g.updatePowerups(.99);assert(!g.player.blueBoost && g.powerups.length===1,'one-second pickup lock');
 g.updatePowerups(.02);assert(g.player.blueBoost && g.powerups.length===0,'collect after delay');
 for(const kind of ['cat','cfa','blue']) {
   g.activatePowerup(kind);g.updatePowerups(2);
   g.activatePowerup(kind);assert.equal(g.powerupTimers[kind],g.powerupDefinitions[kind].duration,'refresh without stacking');
   g.updatePowerups(g.powerupDefinitions[kind].duration+.01);assert.equal(g.powerupTimers[kind],0);
   if(kind==='cat') assert.equal(g.companions.length,0);
   if(kind==='cfa') assert(!g.player.cfaActive);
   if(kind==='blue') assert(!g.player.blueBoost);
 }
 g.restartLevel();
 g.beginLevel(0);const comboEnemy=g.enemies.find(e=>e.type==='large');
 comboEnemy.health=1000;g.damageEnemy(comboEnemy,10,'punch');comboEnemy.hurtTimer=0;g.damageEnemy(comboEnemy,10,'kick');assert.equal(g.chain,2,'mixed attacks build combo');
 comboEnemy.hurtTimer=0;g.damageEnemy(comboEnemy,10,'kick');assert.equal(g.chain,1,'repeating move resets combo');
 g.beginLevel(0);const stompEnemy=g.enemies[0];g.enemies.filter(e=>e!==stompEnemy).forEach(e=>e.x=-10000);
 Object.assign(stompEnemy,{x:300,y:1080-stompEnemy.h-16,onGround:true,awakened:true});
 Object.assign(g.player,{x:300,y:stompEnemy.y+14-112,vy:250,onGround:false,hurtTimer:100});const stompHealth=stompEnemy.health;
 tick(3);assert(stompEnemy.health<stompHealth && g.player.vy<0,'stomp deals damage and bounces');assert(g.score>0);
 g.restartLevel();assert.equal(g.score,0,'score resets');
 for(let level=0;level<3;level++){
  g.beginLevel(level); assert.equal(g.enemies.length,[14,18,23][level],'stage enemy count'); assert(g.holes.some(h=>h.w>600));
  g.enemies.forEach(e=>e.x=-10000); const moving=g.getPlatforms().find(p=>p.moving); Object.assign(g.player,{x:moving.x+40,y:moving.y-112,onGround:true,support:{id:moving.id,x:moving.x,y:moving.y}}); const offset=g.player.x-moving.x; tick(60); const now=g.getPlatforms().find(p=>p.id===moving.id); assert(Math.abs(g.player.x-now.x-offset)<2,'moving platform carries player');
  g.beginLevel(level); const count=g.enemies.length; tick(120*15); assert.equal(g.enemies.filter(e=>e.health>0).length,count,'idle NPCs survive terrain');
  g.beginLevel(level);
  if(level === 2) {
    const b = g.boss; assert(b && b.w > 100 && b.maxHealth >= 400);
    g.player.x=g.getLevelLength()-200; tick(2); assert(!g.complete, 'boss blocks final exit');
    g.player.hurtTimer=100; const phases=new Set();
    for(let i=0;i<120*10;i++){g.tick(1/120);phases.add(b.phase)}
    for(const phase of ['charge-windup','charge','slam-windup','slam','recover']) assert(phases.has(phase), phase);
    // Slam hits grounded players but can be dodged with a jump.
    b.phase='slam';b.timer=.2;b.attackHitDone=false;g.player.x=b.x;g.player.y=968;g.player.hurtTimer=0;const before=g.player.health;g.updateBoss(b,.01);assert(g.player.health<before);
    b.attackHitDone=false;g.player.y=720;g.player.hurtTimer=0;const airborne=g.player.health;g.updateBoss(b,.01);assert.equal(g.player.health,airborne,'jump dodges slam');
    g.player.hurtTimer=100;
    b.hurtTimer=0;b.phase='approach';const hp=b.health;g.damageEnemy(b,20);const guarded=hp-b.health;
    b.hurtTimer=0;b.phase='recover';const hp2=b.health;g.damageEnemy(b,20);assert(hp2-b.health>guarded,'recovery vulnerability');
    b.hurtTimer=0;g.damageEnemy(b,2000);tick(60); assert.equal(b.health,0,'boss defeated');
  }
  g.player.x=g.getLevelLength()-200; tick(400);
 }
 assert(g.complete,'all three exits complete'); g.restartLevel(); assert(g.boss && g.boss.health===480 && !g.complete,'boss resets after replay'); console.log('PASS: timed powerup expiry/refresh and delayed pickup; boss gate, attack phases, recovery vulnerability, victory award flow; boot, repeated CFA, reset, helpers/render, moving platforms, NPC survival, three-stage completion');
})().catch(e=>{console.error(e);process.exitCode=1});
