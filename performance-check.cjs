/*
 * Good Signal performance and acceptance fixture.
 * Run with the app's bundled Node/Playwright and Chrome executable, for example:
 * PATH=/Applications/ChatGPT.app/Contents/Resources/cua_node/bin:$PATH \
 * PLAYWRIGHT_PATH=/Applications/ChatGPT.app/Contents/Resources/cua_node/lib/node_modules/playwright \
 * CHROME_PATH='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' \
 * node performance-check.cjs
 */
'use strict';
const fs=require('fs');
const http=require('http');
const path=require('path');
const {performance}=require('perf_hooks');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');

const root=__dirname;
const originalCatalog=JSON.parse(fs.readFileSync(path.join(root,'guide-catalog.json'),'utf8'));
const categories=originalCatalog.guides.map(g=>g.id);
const makeCatalog=(version,count)=>{
  const catalog=JSON.parse(JSON.stringify(originalCatalog));
  catalog.guideVersion=version;
  catalog.reviewedAt='Performance fixture';
  catalog.publishedAt='2026-11-02';
  catalog.changeLog=[];
  catalog.migrations=[];
  catalog.guides=catalog.guides.map(guide=>({...guide,steps:Array.from({length:count},(_,i)=>({
    id:`step-${String(i+1).padStart(3,'0')}`,
    title:`Fixture privacy check ${String(i+1).padStart(3,'0')}`,
    purpose:'Synthetic step used only for the acceptance performance fixture.',
    instructions:['Review the corresponding setting in the device or companion app.','Record the choice that matches this fixture.'],
    tradeoff:'This synthetic instruction is not device guidance.'
  }))}));
  return catalog;
};
let servedCatalog=makeCatalog('1.3',99);
let workerSource=fs.readFileSync(path.join(root,'sw.js'),'utf8');
const mime={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.webmanifest':'application/manifest+json; charset=utf-8','.png':'image/png','.svg':'image/svg+xml'};
const server=http.createServer((req,res)=>{
  const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  if(pathname.endsWith('/guide-catalog.json')){res.writeHead(200,{'content-type':mime['.json'],'cache-control':'no-store'});res.end(JSON.stringify(servedCatalog));return;}
  if(pathname.endsWith('/sw.js')){res.writeHead(200,{'content-type':mime['.js'],'cache-control':'no-store'});res.end(workerSource);return;}
  const name=pathname==='/'?'index.html':path.basename(pathname);
  const file=path.join(root,name);
  if(!file.startsWith(root+path.sep)||!fs.existsSync(file)){res.writeHead(404);res.end('not found');return;}
  res.writeHead(200,{'content-type':mime[path.extname(file)]||'application/octet-stream','cache-control':'no-store'});
  fs.createReadStream(file).pipe(res);
});

const median=values=>[...values].sort((a,b)=>a-b)[Math.floor(values.length/2)];
const round=value=>Math.round(value*10)/10;
const fail=message=>{throw new Error(message);};

(async()=>{
  let browser;
  const errors=[];
  try{
    await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
    const base=`http://127.0.0.1:${server.address().port}/`;
    browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
    const context=await browser.newContext({viewport:{width:412,height:915},device_scale_factor:2.6,is_mobile:true,has_touch:true});
    let page=await context.newPage();
    page.on('pageerror',error=>errors.push(error.message));
    const cdp=await context.newCDPSession(page);
    await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});

    const timeToShell=async()=>{
      const start=performance.now();
      await page.goto(base,{waitUntil:'domcontentloaded'});
      await page.waitForFunction(()=>document.querySelector('main')?.children.length>0);
      return round(performance.now()-start);
    };

    const firstOnlineMs=await timeToShell();
    await page.evaluate(()=>navigator.serviceWorker.ready);
    await page.waitForFunction(()=>caches.keys().then(keys=>keys.some(key=>key.startsWith('still-shell-'))));
    await page.waitForFunction(()=>Boolean(navigator.serviceWorker.controller));

    const devices=Array.from({length:50},(_,i)=>{
      const category=categories[i%categories.length];
      const progress=Object.fromEntries(Array.from({length:99},(_,step)=>[
        `step-${String(step+1).padStart(3,'0')}`,
        {status:step%3===0?'complete':'not-started',note:`fixture note ${i+1}-${step+1}`,needsReview:false}
      ]));
      return {id:`perf-device-${String(i+1).padStart(3,'0')}`,category,nickname:`Fixture device ${String(i+1).padStart(3,'0')}`,manufacturer:'Fixture',model:`Model ${i+1}`,region:'US',firmware:'1.0',progress,guideVersion:'1.3',guideHistory:[],guideUpdateNotice:null};
    });
    const state={schemaVersion:1,guideCatalogVersion:'1.3',savedModelGuides:[],devices};
    await page.evaluate(async data=>{
      const db=await new Promise((resolve,reject)=>{const r=indexedDB.open('good-signal-data',1);r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});
      await new Promise((resolve,reject)=>{const tx=db.transaction('records','readwrite');tx.objectStore('records').put({key:'app-state',data});tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error);});
      db.close();
    },state);

    const onlineLoads=[];
    onlineLoads.push(await timeToShell());
    for(let i=0;i<4;i++)onlineLoads.push(await timeToShell());
    const launchSamples=[];
    await context.setOffline(true);
    for(let i=0;i<5;i++)launchSamples.push(await timeToShell());
    await context.setOffline(false);

    await page.goto(`${base}#device/${devices[0].id}`,{waitUntil:'domcontentloaded'});
    await page.waitForSelector('#status-step-001');
    await page.evaluate(()=>{
      window.__nextSaveStart=null;window.__lastUserSaveMs=null;
      const original=IDBDatabase.prototype.transaction;
      IDBDatabase.prototype.transaction=function(...args){
        const tx=original.apply(this,args);
        if(args[1]==='readwrite'&&window.__nextSaveStart!==null){
          const start=window.__nextSaveStart;
          tx.addEventListener('complete',()=>{window.__lastUserSaveMs=performance.now()-start;window.__nextSaveStart=null;},{once:true});
        }
        return tx;
      };
      document.addEventListener('change',event=>{if(event.target.matches('[data-status]'))window.__nextSaveStart=performance.now();},true);
    });
    const saveSamples=[];
    for(let i=0;i<7;i++){
      await page.evaluate(()=>window.__lastUserSaveMs=null);
      await page.locator('#status-step-001').selectOption(i%2?'complete':'unresolved');
      await page.waitForFunction(()=>window.__lastUserSaveMs!==null);
      saveSamples.push(round(await page.evaluate(()=>window.__lastUserSaveMs)));
    }

    await page.goto(`${base}#devices`);
    await page.locator('#search').fill('no such fixture device');
    const noResults=await page.getByText('No matching devices',{exact:true}).isVisible();
    await page.locator('#search').fill('');
    await page.goto(`${base}#device/${devices[0].id}`);
    const unavailableGuide=await page.getByText('No model-specific guide available to save offline.',{exact:true}).isVisible();

    await context.setOffline(true);
    await page.locator('#status-step-002').evaluate(el=>{el.closest('details').open=true;});
    await page.locator('#status-step-002').selectOption('complete');
    await page.waitForFunction(()=>window.__lastUserSaveMs!==null);
    await page.reload({waitUntil:'domcontentloaded'});
    await page.waitForSelector('#status-step-002',{state:'attached'});
    const offlineEditPersisted=await page.locator('#status-step-002').inputValue()==='complete';
    await context.setOffline(false);
    await page.waitForFunction(()=>navigator.onLine);
    await page.reload({waitUntil:'domcontentloaded'});
    await page.waitForSelector('#status-step-002',{state:'attached'});
    const reconnectPreserved=await page.locator('#status-step-002').inputValue()==='complete';

    servedCatalog=makeCatalog('1.4',100);
    servedCatalog.changeLog=[{from:'1.3',to:'1.4',summary:'Fixture added one checklist step and changed one instruction.',material:true}];
    servedCatalog.migrations=[{from:'1.3',to:'1.4',summary:'Fixture guide update.',material:true,byCategory:Object.fromEntries(categories.map(id=>[id,{added:['step-100'],changed:['step-001'],removed:[]}]))}];
    await page.goto(`${base}#settings`);
    await page.locator('[data-action="guide-update"]').click();
    await page.waitForFunction(()=>document.querySelector('#toast')?.textContent.includes('Guide catalog updated to v1.4'));
    await page.goto(`${base}#device/${devices[0].id}`);
    await page.waitForSelector('#status-step-100',{state:'attached'});
    const guideUpdatePreserved=await page.getByText('Review update',{exact:true}).count()>0;

    const badImport=path.join(require('os').tmpdir(),'good-signal-invalid-import.json');
    fs.writeFileSync(badImport,'{ bad json');
    await page.goto(`${base}#settings`);
    await page.locator('[data-action="import"]').click();
    await page.locator('#import-file').setInputFiles(badImport);
    await page.waitForFunction(()=>document.querySelector('#toast')?.textContent.length>0);
    const malformedImportRejected=!(await page.locator('#modal').getAttribute('open'));
    const exportPromise=page.waitForEvent('download');
    await page.locator('[data-action="export"]').first().click();
    const exported=await exportPromise;
    const backupExported=exported.suggestedFilename()==='good-signal-backup.json';

    await page.goto(`${base}#device/${devices[0].id}`);
    await page.locator('#status-step-003').evaluate(el=>{el.closest('details').open=true;});
    await page.evaluate(()=>{
      window.__originalStorePut=IDBObjectStore.prototype.put;window.__failOnePut=true;
      IDBObjectStore.prototype.put=function(...args){if(window.__failOnePut&&this.name==='records'){window.__failOnePut=false;throw new Error('Synthetic IndexedDB write failure');}return window.__originalStorePut.apply(this,args);};
    });
    await page.locator('#status-step-003').selectOption('complete');
    await page.waitForFunction(()=>!document.querySelector('#save-error').hidden);
    const failureSurfaced=true;
    await page.locator('[data-action="retry"]').click();
    await page.waitForFunction(()=>document.querySelector('#save-error').hidden);
    const retryRecovered=true;
    await page.evaluate(()=>{if(window.__originalStorePut)IDBObjectStore.prototype.put=window.__originalStorePut;});

    const cacheVersion=workerSource.match(/const CACHE='still-shell-v(\d+)'/);
    if(!cacheVersion)fail('Could not find the service worker cache version.');
    workerSource=workerSource.replace(cacheVersion[0],`const CACHE='still-shell-v${Number(cacheVersion[1])+1}'`);
    await page.evaluate(()=>navigator.serviceWorker.getRegistration().then(reg=>reg.update()));
    await page.waitForFunction(()=>!document.querySelector('#update-ready').hidden);
    const updateBlockedOnChecklist=await page.locator('[data-action="apply-update"]').isDisabled();
    await page.goto(`${base}#home`);
    await page.waitForFunction(()=>!document.querySelector('[data-action="apply-update"]').disabled);
    await page.locator('[data-action="apply-update"]').click();
    await page.waitForFunction(()=>navigator.serviceWorker.controller?.scriptURL.includes('sw.js'));
    await page.waitForFunction(()=>document.querySelector('#update-ready').hidden);
    const updateAppliedAfterLeaving=true;

    await page.evaluate(async data=>{
      const db=await new Promise((resolve,reject)=>{const r=indexedDB.open('good-signal-data',1);r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});
      await new Promise((resolve,reject)=>{const tx=db.transaction('records','readwrite');tx.objectStore('records').put({key:'app-state',data:{...data,devices:[]}});tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error);});db.close();
    },state);
    await page.goto(`${base}#devices`);
    await page.reload({waitUntil:'domcontentloaded'});
    await page.waitForSelector('.inventory-empty');
    const emptyInventory=true;

    const result={
      environment:{browser:'Google Chrome desktop on macOS',viewport:'412×915 CSS px, mobile emulation, DPR 2.6',cpuThrottle:'4× via Chrome DevTools',referenceDevice:'No Android hardware attached; results are not Android acceptance results.'},
      fixture:{devices:50,guideStepsPerCategory:100,initialGuideSteps:99,deviceProgressEntries:4950},
      firstOnlineShellMs:firstOnlineMs,
      fixtureOnlineLoadMs:onlineLoads,
      cachedOfflineLaunchMs:launchSamples,
      cachedOfflineLaunchMedianMs:round(median(launchSamples)),
      indexedDbSaveMs:saveSamples,
      indexedDbSaveMedianMs:round(median(saveSamples)),
      checks:{noResults,unavailableGuide,offlineEditPersisted,reconnectPreserved,guideUpdatePreserved,malformedImportRejected,backupExported,failureSurfaced,retryRecovered,updateBlockedOnChecklist,updateAppliedAfterLeaving,emptyInventory},
      pageErrors:errors
    };
    if(Object.values(result.checks).some(value=>value!==true))fail(`A scenario failed: ${JSON.stringify(result.checks)}`);
    if(errors.length)fail(`Browser errors: ${errors.join(' | ')}`);
    console.log(JSON.stringify(result,null,2));
  }catch(error){console.error(error.stack||error);process.exitCode=1;}
  finally{if(browser)await browser.close();server.close();}
})();
