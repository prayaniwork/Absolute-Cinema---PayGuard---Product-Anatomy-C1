const http=require('http'),fs=require('fs'),path=require('path');
const root=path.resolve(process.argv[2]||__dirname),port=5173,clients=new Set();
fs.watch(root,{recursive:true},(_,f)=>{if(f&&!f.startsWith('.git'))clients.forEach(r=>r.write('data: r\n\n'))});
const snip='<script>new EventSource("/__reload").onmessage=()=>location.reload()</script>';
http.createServer((q,r)=>{
  if(q.url==='/__reload'){r.writeHead(200,{'Content-Type':'text/event-stream','Cache-Control':'no-cache'});clients.add(r);q.on('close',()=>clients.delete(r));return}
  let p=q.url.split('?')[0];if(p==='/')p='/index.html';
  const f=path.join(root,path.normalize(p));
  if(!f.startsWith(root)||!fs.existsSync(f)){r.writeHead(404);return r.end('not found')}
  const b=fs.readFileSync(f),h=f.endsWith('.html');
  r.writeHead(200,{'Content-Type':h?'text/html; charset=utf-8':'application/octet-stream','Cache-Control':'no-store'});
  r.end(h?b+snip:b);
}).listen(port,'127.0.0.1',()=>console.log('http://127.0.0.1:'+port));
