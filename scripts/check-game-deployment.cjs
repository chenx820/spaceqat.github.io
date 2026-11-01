const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
(async()=>{
 const root=path.resolve(__dirname,'..');
 const server=http.createServer((req,res)=>{let p=new URL(req.url,'http://localhost').pathname;let file=path.resolve(root,'.'+p);if(!file.startsWith(root+path.sep)){res.writeHead(403);return res.end()}
 if(fs.existsSync(file)&&fs.statSync(file).isDirectory()){if(!p.endsWith('/')){res.writeHead(301,{Location:p+'/'});return res.end()}file=path.join(file,'index.html')}
 if(!fs.existsSync(file)){res.writeHead(404);return res.end()}
 res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.png':'image/png','.ttf':'font/ttf','.svg':'image/svg+xml'})[path.extname(file)]||'application/octet-stream');fs.createReadStream(file).pipe(res)});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
 try{browser=await chromium.launch({channel:'msedge',headless:true,args:['--no-proxy-server']});const page=await browser.newPage(),base='http://127.0.0.1:'+server.address().port,errors=[],missing=[];
 await page.route('**/*',r=>r.request().url().startsWith(base)?r.continue():r.abort());page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.url().includes('/game/')&&r.status()>=400)missing.push(r.url())});
 await page.goto(base+'/game/');await page.waitForTimeout(1500);assert.equal(await page.evaluate(()=>SPACEQAT_CONFIG.fatqatBaseUrl),null);
 const result=await page.evaluate(async()=>{const p=await import('/game/src/programming.js');const probabilities=p.localProgram(p.parseProgram('H 0\nCX 0 1'));let offline='';try{await p.connectLocalFatQat()}catch(e){offline=e.message}return {probabilities,offline,python:p.pythonProgram(p.parseProgram('H 0'))}});
 assert.ok(Math.abs(result.probabilities[0]-.5)<1e-6);assert.ok(Math.abs(result.probabilities[3]-.5)<1e-6);assert.match(result.offline,/尚未配置/);assert.match(result.python,/import fatqat/);
 await page.evaluate(()=>localStorage.setItem('spaceqat-player-avatar-v1','cat'));await page.reload();assert.equal(await page.evaluate(()=>localStorage.getItem('spaceqat-player-avatar-v1')),'cat');
 for(const width of [1366,390,320]){await page.setViewportSize({width,height:900});await page.waitForTimeout(800);await page.screenshot({path:require('node:os').tmpdir()+'/spaceqat-game-'+width+'.png'});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Game overflow '+width)}
 for(const file of ['index.html','en.html']){await page.goto(base+'/'+file);assert.equal(await page.locator('#navigation a[href="/game/"]').count(),1);for(const width of [1366,1200,1024,930,901,390]){await page.setViewportSize({width,height:900});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Homepage overflow '+width);if(width>900)assert.ok(await page.evaluate(()=>{const n=document.querySelector('#navigation').getBoundingClientRect(),b=document.querySelector('.wordmark').getBoundingClientRect();return n.left>=b.right&&n.right<=innerWidth}),'Nav overlap '+file+' '+width)}}
 assert.deepEqual(errors,[]);assert.deepEqual(missing,[]);console.log('PASS game resources, local Bell simulation, Python export, offline backend, avatar persistence, mobile layout and bilingual entry');
 }finally{await browser?.close();server.close()}
})().catch(e=>{console.error(e);process.exit(1)});
