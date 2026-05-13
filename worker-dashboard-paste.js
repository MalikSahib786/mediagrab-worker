const INDEX_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>MediaGrab - Free Video & Image Downloader</title>
<script src="https://cdn.tailwindcss.com"></script>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
<style>body{font-family:'Inter',sans-serif;background:linear-gradient(135deg,#0f172a,#1e1b4b,#312e81);min-height:100vh;}
.glass{background:rgba(255,255,255,0.95);backdrop-filter:blur(12px);border-radius:24px;}
.btn-active{background:linear-gradient(135deg,#4f46e5,#7c3aed);color:white;}
</style>
</head>
<body class="text-slate-800">
<div class="container mx-auto px-4 py-8 max-w-4xl">
<div class="text-center mb-8">
<h1 class="text-4xl font-extrabold text-white mb-2">MediaGrab</h1>
<p class="text-slate-300">Download videos & images from YouTube, Twitter/X, Reddit, Instagram, TikTok</p>
<div class="flex flex-wrap justify-center gap-2 mt-3 text-xs font-medium">
<span class="px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-300">100% Free</span>
<span class="px-2 py-1 rounded-full bg-blue-500/20 text-blue-300">No Limits</span>
<span class="px-2 py-1 rounded-full bg-purple-500/20 text-purple-300">Edge-Powered</span>
</div>
</div>

<div class="glass shadow-2xl p-6 md:p-8">
<div class="flex gap-2 mb-4 overflow-x-auto pb-1" id="tabs">
<button onclick="setP('youtube')" class="tab-btn btn-active px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap" data-p="youtube">YouTube</button>
<button onclick="setP('twitter')" class="tab-btn px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap bg-white text-slate-600 border border-slate-200" data-p="twitter">Twitter / X</button>
<button onclick="setP('reddit')" class="tab-btn px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap bg-white text-slate-600 border border-slate-200" data-p="reddit">Reddit</button>
<button onclick="setP('instagram')" class="tab-btn px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap bg-white text-slate-600 border border-slate-200" data-p="instagram">Instagram</button>
<button onclick="setP('tiktok')" class="tab-btn px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap bg-white text-slate-600 border border-slate-200" data-p="tiktok">TikTok</button>
</div>

<div class="relative mb-3">
<input type="url" id="url" placeholder="Paste URL here..." class="w-full pl-4 pr-20 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none" onkeydown="if(event.key==='Enter')go()">
<button onclick="go()" class="absolute right-2 top-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold text-sm">Fetch</button>
</div>
<p id="hint" class="text-xs text-slate-500 mb-4">Paste a YouTube link to extract thumbnails and metadata</p>

<div id="loading" class="hidden py-8 text-center">
<div class="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500 mx-auto mb-3"></div>
<p class="text-slate-600 text-sm">Fetching from edge...</p>
</div>

<div id="results" class="hidden space-y-4"></div>
<div id="empty" class="py-8 text-center text-slate-400 text-sm">Enter a URL above to get started</div>
</div>

<div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 text-white text-center text-sm">
<div class="bg-white/5 border border-white/10 rounded-xl p-4">
<div class="text-2xl mb-1">⚡</div><h3 class="font-bold">Lightning Fast</h3><p class="text-slate-400 text-xs mt-1">Cloudflare global edge network</p>
</div>
<div class="bg-white/5 border border-white/10 rounded-xl p-4">
<div class="text-2xl mb-1">🔒</div><h3 class="font-bold">Zero Storage</h3><p class="text-slate-400 text-xs mt-1">Direct stream, nothing saved</p>
</div>
<div class="bg-white/5 border border-white/10 rounded-xl p-4">
<div class="text-2xl mb-1">♾️</div><h3 class="font-bold">Truly Unlimited</h3><p class="text-slate-400 text-xs mt-1">No daily caps or restrictions</p>
</div>
</div>
</div>

<script>
let P='youtube';
const CFG={
 youtube:{ph:'https://youtube.com/watch?v=dQw4w9WgXcQ',h:'Paste a YouTube link to extract thumbnails and metadata'},
 twitter:{ph:'https://twitter.com/user/status/1234567890',h:'Paste a tweet containing video or images'},
 reddit:{ph:'https://reddit.com/r/sub/comments/xxxxx/title/',h:'Paste a Reddit post link'},
 instagram:{ph:'https://instagram.com/p/AbCdEfGh/',h:'Paste a public Instagram post or reel'},
 tiktok:{ph:'https://tiktok.com/@user/video/1234567890',h:'Paste a TikTok video link'}
};
function setP(p){P=p;document.querySelectorAll('.tab-btn').forEach(b=>{if(b.dataset.p===p){b.className='tab-btn btn-active px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap'}else{b.className='tab-btn px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap bg-white text-slate-600 border border-slate-200'}});document.getElementById('url').placeholder=CFG[p].ph;document.getElementById('hint').textContent=CFG[p].h;}
function esc(t){const d=document.createElement('div');d.textContent=t||'';return d.innerHTML;}
async function go(){
 const u=document.getElementById('url').value.trim();
 if(!u){alert('Enter a URL');return;}
 document.getElementById('loading').classList.remove('hidden');
 document.getElementById('results').classList.add('hidden');
 document.getElementById('empty').classList.add('hidden');
 try{
  const r=await fetch('/api/download?platform='+P+'&url='+encodeURIComponent(u));
  const d=await r.json();
  if(!r.ok||d.error)throw new Error(d.error||'Server error');
  let h='<div class="bg-slate-50 rounded-xl p-4 border border-slate-200"><h2 class="font-bold text-lg truncate">'+esc(d.title)+'</h2><p class="text-slate-500 text-sm">'+esc(d.author||'Unknown')+' &bull; '+P+'</p>'+(d.disclaimer?'<p class="text-amber-600 text-xs mt-1 bg-amber-50 inline-block px-2 py-1 rounded">'+esc(d.disclaimer)+'</p>':'')+'</div>';
  if(d.media&&d.media.length){
   h+='<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">';
   for(const m of d.media){
    const isV=m.type==='video';
    const ext=isV?'mp4':(m.url.match(/\.([a-zA-Z0-9]+)(?:\?|$)/)?.[1]||'jpg');
    const fn=(d.platform+'_'+(d.title||'media').substring(0,30).replace(/[^a-z0-9]/gi,'_')+'.'+ext);
    h+='<div class="bg-white rounded-xl border border-slate-200 overflow-hidden">';
    h+='<div class="aspect-video bg-slate-100 relative">';
    if(isV){h+='<video src="'+m.url+'" preload="metadata" controls class="w-full h-full object-cover" poster="'+(m.thumbnail||'')+'"></video>';}
    else{h+='<img src="'+m.url+'" class="w-full h-full object-cover" loading="lazy" referrerpolicy="no-referrer">';}
    h+='<span class="absolute top-2 right-2 px-2 py-0.5 rounded text-xs font-bold '+(isV?'bg-red-500 text-white':'bg-indigo-500 text-white')+'">'+(isV?'VIDEO':'IMAGE')+'</span></div>';
    h+='<div class="p-3"><div class="flex justify-between text-xs text-slate-500 mb-2"><span class="font-semibold uppercase">'+(m.quality||'Original')+'</span>'+(m.resolution?'<span>'+m.resolution+'</span>':'')+'</div>';
    h+='<a href="/api/proxy?url='+encodeURIComponent(m.url)+'&filename='+encodeURIComponent(fn)+'" class="block bg-indigo-600 hover:bg-indigo-700 text-white text-center py-2 rounded-lg font-semibold text-sm">Download</a>';
    if(m.note)h+='<p class="text-amber-600 text-xs mt-1">'+esc(m.note)+'</p>';
    h+='</div></div>';
   }
   h+='</div>';
  }
  document.getElementById('results').innerHTML=h;
  document.getElementById('results').classList.remove('hidden');
 }catch(e){
  document.getElementById('results').innerHTML='<div class="bg-rose-50 border border-rose-200 rounded-xl p-6 text-center"><h3 class="font-semibold text-rose-800">Fetch Failed</h3><p class="text-rose-600 text-sm mt-1">'+esc(e.message)+'</p></div>';
  document.getElementById('results').classList.remove('hidden');
 }finally{
  document.getElementById('loading').classList.add('hidden');
 }
}
setP('youtube');
</script>
</body>
</html>`;

const cors={
  'Access-Control-Allow-Origin':'*',
  'Access-Control-Allow-Methods':'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers':'Content-Type',
};
function json(d,s=200){return new Response(JSON.stringify(d),{status:s,headers:{'Content-Type':'application/json',...cors}});}
function err(m,s=400){return json({error:m,success:false},s);}

function ytId(u){return(u.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)||[])[1];}
function twId(u){return(u.match(/(?:twitter|x)\.com\/\w+\/status\/(\d+)/)||[])[1];}
function igCode(u){return(u.match(/instagram\.com\/(?:p|reel|reels|tv)\/([A-Za-z0-9_-]+)/)||[])[1];}
function tkId(u){return(u.match(/tiktok\.com\/@[\w.]+\/video\/(\d+)/)||[])[1];}

async function yt(u){
 const id=ytId(u);if(!id)throw new Error('Invalid YouTube URL');
 const thumbs={maxres:'https://i.ytimg.com/vi/'+id+'/maxresdefault.jpg',standard:'https://i.ytimg.com/vi/'+id+'/sddefault.jpg',high:'https://i.ytimg.com/vi/'+id+'/hqdefault.jpg',medium:'https://i.ytimg.com/vi/'+id+'/mqdefault.jpg',default:'https://i.ytimg.com/vi/'+id+'/default.jpg'};
 let title='YouTube Video',author='Unknown';
 try{const r=await fetch('https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v='+id+'&format=json');if(r.ok){const d=await r.json();title=d.title||title;author=d.author_name||author;}}catch(e){}
 const media=Object.entries(thumbs).map(([q,url])=>({type:'image',url,quality:q,resolution:q==='maxres'?'1280x720':q==='standard'?'640x480':q==='high'?'480x360':q==='medium'?'320x180':'120x90',note:q==='maxres'?'May not exist for all videos':undefined}));
 return{platform:'youtube',title,author,videoId:id,media,disclaimer:'YouTube video streams require yt-dlp. This provides thumbnails and metadata only.'};
}

async function tw(u){
 const id=twId(u);if(!id)throw new Error('Invalid Twitter/X URL');
 const r=await fetch('https://cdn.syndication.twimg.com/tweet-result?id='+id+'&lang=en',{headers:{'User-Agent':'Mozilla/5.0','Accept':'application/json','Referer':'https://twitter.com/'}});
 if(!r.ok)throw new Error(r.status===404?'Tweet not found or private':'Twitter API error '+r.status);
 const d=await r.json();const media=[];
 if(d.video){const v=(d.video.variants||[]).filter(x=>x.type==='video/mp4'&&x.src).sort((a,b)=>(b.bitrate||0)-(a.bitrate||0));for(const x of v)media.push({type:'video',url:x.src,quality:(x.bitrate?Math.round(x.bitrate/1000)+'kbps':'unknown'),thumbnail:d.video.poster});}
 if(d.mediaDetails){for(const m of d.mediaDetails)if(m.type==='photo'&&m.media_url_https)media.push({type:'image',url:m.media_url_https+'?name=large',quality:'large',resolution:(m.original_info?.width||0)+'x'+(m.original_info?.height||0)});}
 if(!media.length)throw new Error('No media found in this tweet');
 return{platform:'twitter',title:(d.text||'').substring(0,200),author:d.user?.screen_name||'Unknown',tweetId:id,media};
}

async function ig(u){
 const code=igCode(u);if(!code)throw new Error('Invalid Instagram URL');
 const r=await fetch('https://www.instagram.com/p/'+code+'/',{headers:{'User-Agent':'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X)','Accept':'text/html','Referer':'https://www.instagram.com/'}});
 if(!r.ok)throw new Error('Instagram returned '+r.status);
 const html=await r.text();let media=[],title='Instagram Post',author='Unknown';
 const sm=html.match(/<script[^>]*>window\._sharedData\s*=\s*({.+?});<\/script>/);
 const am=html.match(/<script[^>]*>window\.__additionalDataLoaded\s*\(\s*['"][^'"]+['"]\s*,\s*({.+?})\s*\);<\/script>/);
 if(sm||am){try{const raw=(am?.[1]||sm?.[1]).replace(/\\u0026/g,'&');const data=JSON.parse(raw);const post=data.entry_data?.PostPage?.[0]?.graphql?.shortcode_media||data.graphql?.shortcode_media;if(post){author=post.owner?.username||author;title=post.edge_media_to_caption?.edges?.[0]?.node?.text?.substring(0,120)||title;if(post.__typename==='GraphSidecar'&&post.edge_sidecar_to_children?.edges){for(const e of post.edge_sidecar_to_children.edges){const n=e.node;if(n.is_video)media.push({type:'video',url:n.video_url,quality:n.dimensions?.width+'x'+n.dimensions?.height});else media.push({type:'image',url:n.display_url,quality:n.dimensions?.width+'x'+n.dimensions?.height});}}else if(post.is_video)media.push({type:'video',url:post.video_url,quality:post.dimensions?.width+'x'+post.dimensions?.height});else media.push({type:'image',url:post.display_url,quality:post.dimensions?.width+'x'+post.dimensions?.height});}}}catch(e){}}
 if(!media.length){const ov=html.match(/property="og:video" content="([^"]+)"/i)?.[1]||html.match(/"video_url":"([^"]+)"/)?.[1];const oi=html.match(/property="og:image" content="([^"]+)"/i)?.[1];const ot=html.match(/property="og:title" content="([^"]+)"/i)?.[1];if(ov)media.push({type:'video',url:ov.replace(/\\u0026/g,'&'),quality:'unknown'});else if(oi)media.push({type:'image',url:oi.replace(/\\u0026/g,'&'),quality:'unknown'});if(ot)title=ot;}
 if(!media.length)throw new Error('Unable to extract Instagram media. Meta now requires authentication.');
 return{platform:'instagram',title,author,shortcode:code,media};
}

async function tk(u){
 const clean=u.split('?')[0];let title='TikTok Video',author='Unknown';
 try{const r=await fetch('https://www.tiktok.com/oembed?url='+encodeURIComponent(clean));if(r.ok){const d=await r.json();title=d.title||title;author=d.author_name||author;}}catch(e){}
 const r=await fetch(clean,{headers:{'User-Agent':'Mozilla/5.0','Accept':'text/html','Referer':'https://www.tiktok.com/'}});
 let media=[];
 if(r.ok){const h=await r.text();const ld=h.match(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/i);if(ld){try{const d=JSON.parse(ld[1]);if(d.video?.contentUrl)media.push({type:'video',url:d.video.contentUrl,quality:'original'});}catch(e){}}if(!media.length){const v=h.match(/property="og:video:url" content="([^"]+)"/i)?.[1];if(v)media.push({type:'video',url:v,quality:'original'});}if(!media.length){const s=h.match(/<script[^>]*>window\['SIGI_STATE'\]\s*=\s*({.+?});<\/script>/);if(s){try{const d=JSON.parse(s[1]);const item=Object.values(d.ItemModule||{})[0];if(item?.video?.downloadAddr)media.push({type:'video',url:item.video.downloadAddr,quality:item.video.width+'x'+item.video.height});else if(item?.video?.playAddr)media.push({type:'video',url:item.video.playAddr,quality:item.video.width+'x'+item.video.height});}catch(e){}}}}
 if(!media.length)throw new Error('Unable to extract TikTok video. TikTok blocks automated access.');
 return{platform:'tiktok',title,author,media};
}

async function rd(u){
 let ju=u;if(!ju.endsWith('.json')){ju=ju.split('?')[0].replace(/\/?$/,'.json');}
 const r=await fetch(ju,{headers:{'User-Agent':'Mozilla/5.0 (compatible; MediaGrab/1.0)','Accept':'application/json'}});
 if(!r.ok)throw new Error('Reddit returned '+r.status);
 const data=await r.json();const post=data[0]?.data?.children?.[0]?.data;if(!post)throw new Error('No post data');
 const media=[];
 if(post.media?.reddit_video?.fallback_url)media.push({type:'video',url:post.media.reddit_video.fallback_url,quality:post.media.reddit_video.width+'x'+post.media.reddit_video.height});
 if(post.gallery_data?.items&&post.media_metadata){for(const item of post.gallery_data.items){const meta=post.media_metadata[item.media_id];if(meta?.s?.u)media.push({type:'image',url:meta.s.u.replace(/&amp;/g,'&'),quality:'original'});else if(meta?.s?.gif)media.push({type:'video',url:meta.s.gif.replace(/&amp;/g,'&'),quality:'gif'});}}
 const dest=post.url_overridden_by_dest;
 if(dest&&!post.is_self&&!media.length){if(dest.match(/\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i))media.push({type:'image',url:dest,quality:'original'});else if(dest.match(/\.(mp4|webm)(\?.*)?$/i))media.push({type:'video',url:dest,quality:'original'});else if(dest.includes('i.redd.it')||dest.includes('i.imgur.com'))media.push({type:'image',url:dest,quality:'original'});}
 if(!media.length&&post.preview?.images?.[0]?.source?.url)media.push({type:'image',url:post.preview.images[0].source.url.replace(/&amp;/g,'&'),quality:'preview'});
 if(!media.length)throw new Error('No downloadable media found.');
 return{platform:'reddit',title:post.title,author:post.author,subreddit:post.subreddit_name_prefixed,media};
}

export default{
 async fetch(request,env,ctx){
  const url=new URL(request.url);
  if(request.method==='OPTIONS')return new Response(null,{headers:cors});

  if(url.pathname==='/'||url.pathname==='/index.html'){
   return new Response(INDEX_HTML,{status:200,headers:{'Content-Type':'text/html; charset=utf-8',...cors}});
  }

  try{
   if(url.pathname==='/api/download'){
    const p=url.searchParams.get('platform');const mu=url.searchParams.get('url');
    if(!p)return err('Missing platform');if(!mu)return err('Missing url');
    let result;
    switch(p){
     case 'youtube':result=await yt(mu);break;
     case 'twitter':case 'x':result=await tw(mu);break;
     case 'instagram':result=await ig(mu);break;
     case 'tiktok':result=await tk(mu);break;
     case 'reddit':result=await rd(mu);break;
     default:return err('Unsupported platform: '+p);
    }
    return json({success:true,...result});
   }
   if(url.pathname==='/api/proxy'){
    const target=url.searchParams.get('url');const fn=url.searchParams.get('filename')||'download';
    if(!target)return err('Missing url');
    let parsed;try{parsed=new URL(target);}catch{return err('Invalid URL');}
    if(!['http:','https:'].includes(parsed.protocol))return err('Only HTTP/HTTPS allowed');
    const pr=await fetch(target,{headers:{'User-Agent':'Mozilla/5.0','Accept':'*/*','Referer':parsed.origin}});
    if(!pr.ok)return err('Upstream '+pr.status,502);
    const ct=pr.headers.get('content-type')||'application/octet-stream';
    const h={'Content-Type':ct,'Content-Disposition':'attachment; filename="'+fn.replace(/[^a-z0-9_.-]/gi,'_')+'"','Cache-Control':'public, max-age=3600',...cors};
    const cl=pr.headers.get('content-length');if(cl)h['Content-Length']=cl;
    return new Response(pr.body,{status:200,headers:h});
   }
   if(url.pathname==='/api/platforms'){
    return json({success:true,platforms:[
     {id:'youtube',name:'YouTube',status:'stable',types:['thumbnails','metadata'],notes:'Video streams require yt-dlp'},
     {id:'twitter',name:'Twitter / X',status:'stable',types:['videos','images'],notes:'Public tweets only'},
     {id:'reddit',name:'Reddit',status:'stable',types:['videos','images','galleries'],notes:'Public posts only'},
     {id:'instagram',name:'Instagram',status:'fragile',types:['videos','images'],notes:'Requires public post; may break due to auth walls'},
     {id:'tiktok',name:'TikTok',status:'fragile',types:['videos'],notes:'Frequently changes page structure; retry if failed'}
    ]});
   }
   return new Response('MediaGrab API v1.0\nEndpoints: /api/download, /api/proxy, /api/platforms',{status:404,headers:{'Content-Type':'text/plain',...cors}});
  }catch(e){console.error(e);return err(e.message||'Internal error',500);}
 }
};
