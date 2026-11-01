export function fatqatEndpoint(config=globalThis.SPACEQAT_CONFIG, location=globalThis.location){
 const configured=config?.fatqatBaseUrl;
 if(configured===null||configured==='')return null;
 if(configured!==undefined){
  const url=new URL(configured,location?.href||'http://localhost:4173/');
  if(!['http:','https:'].includes(url.protocol))throw Error('FatQat 地址必须使用 HTTP 或 HTTPS');
  if(location?.protocol==='https:'&&url.protocol!=='https:')throw Error('HTTPS 游戏需要 HTTPS FatQat 服务');
  return url.href.replace(/\/$/,'');
 }
 return !location||(['localhost','127.0.0.1'].includes(location.hostname)&&location.port==='4173')?'http://127.0.0.1:4180':null;
}
