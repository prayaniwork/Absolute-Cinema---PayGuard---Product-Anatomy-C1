head=open('head.html').read(); js=open('app.js').read(); tail=open('tail.html').read()
open('index.html','w').write(head+'<script>'+js+'</script>'+tail); print(len(head+js+tail)//1024,'KB')
