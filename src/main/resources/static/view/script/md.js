!function(e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e()):window.md=e()}(function(){function e(e){return n[e]||e}function r(r){if(!r)return"";var n=[],Y=0,Z=r.length;"\n"!==r[Z-1]&&"\n"!==r[Z-2]&&(r+="\n\n"),r=r.replace(k,function(r,l,t){var a="{code-block-"+Y+"}",o=new RegExp("{code-block-"+Y+"}","g");return n[Y++]={lang:l,block:t.replace(c,e),regex:o},a}).replace(l,t).replace(p,g).replace($,s).replace(u,"").replace(h,b).replace(x,y).replace(w,q).replace(C,E).replace(j,L).replace(A,B).replace(W,X).replace(i,m).replace(f,d).replace(R,z).replace(v,_).replace(K,M).replace(N,P).replace(O,"").replace(Q,T).replace(S,"").replace(D,F).replace(G,H).replace(I,J).replace(U,V).replace(a,o);for(var ee=0;ee<Y;ee++){var re=n[ee],ne=re.lang,ce=re.block;r=r.replace(re.regex,function(e){return'<pre><code class="language-'+ne+'">'+ce+"</code></pre>"})}return r.trim()}var n={"<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;","&":"&amp;","[":"&#91;","]":"&#93;","(":"&#40;",")":"&#41;"},c=/[<>&\(\)\[\]"']/g,l=/<(script)[^\0]*?>([^\0]+?)<\/(script)>/gim,t="&lt;$1&gt;$2&lt;/$3&gt;",a=/(<.*? [^\0]*?=[^\0]*?)(javascript:.*?)(.*>)/gim,o="$1#$2&#58;$3",p=/<img([^\0]*?onerror=)([^\0]*?)>/gim,g=function(r,n,l){return"<img"+n+l.replace(c,e)+">"},u=/^[\t ]+|[\t ]$/gm,i=/(<.*>[\t ]*\n^.*)/gm,m=function(e,r){return r.replace(/^\n|$\n/gm,"")},f=/(<style>[^]*<\/style>)/gm,d=m,$=/(<[^]+?)(on.*?=.*?)(.*>)/gm,s="$1$3",h=/^[ \t]*> (.*)/gm,b="<blockquote>$1</blockquote>",v=/`([^`]+?)`/g,_=function(r,n){return"<code>"+n.replace(c,e)+"</code>"},k=/```(.*)\n([^\0]+?)```(?!```)/gm,x=/!\[(.*)\]\((.*)\)/g,y=function(r,n,l){var t=l.replace(c,e),a=n.replace(c,e);return'<img src="'+t+'" alt="'+a+'">'},w=/^(#+) +(.*)/gm,q=function(e,r,n){var c=r.length;return"<h"+c+">"+n+"</h"+c+">"},j=/^([^\n\t ])(.*)\n----+/gm,C=/^([^\n\t ])(.*)\n====+/gm,E="<h1>$1$2</h1>",L="<h2>$1$2</h2>",R=/^([^-><#\d\+\_\*\t\n\[\! \{])([^]*?)(|  )(?:\n\n)/gm,z=function(e,r,n,c){var l=r,t=n,a=c?"\n<br>\n":"\n";return"<p>"+l+t+"</p>"+a},A=/^.*?(?:---|\*\*\*|- - -|\* \* \*)/gm,B="<hr>",D=/(?:\*\*|\_\_)([^\*\n_]+?)(?:\*\*|\_\_)/g,F="<strong>$1</strong>",G=/(?:\*|\_)([^\*\n_]+?)(?:\*|\_)/g,H="<em>$1</em>",I=/(?:~~)([^~]+?)(?:~~)/g,J="<del>$1</del>",K=/\[(.*?)\]\(([^\t\n ]*)(?:| "(.*)")\)+/gm,M=function(r,n,l,t){var a=l.replace(c,e),o=n.replace(c,e),p=t?' title="'+t.replace(c,e)+'"':"";return'<a href="'+a+'"'+p+">"+o+"</a>"},N=/^[\t ]*?(?:-|\+|\*) (.*)/gm,O=/(\<\/ul\>\n(.*)\<ul\>*)+/g,P="<ul><li>$1</li></ul>",Q=/^[\t ]*?(?:\d(?:\)|\.)) (.*)/gm,S=/(\<\/ol\>\n(.*)\<ol\>*)+/g,T="<ol><li>$1</li></ol>",U=/^\n\n+/gm,V="<br>",W=/\[( |x)\]/g,X=function(e,r){return'<input type="checkbox" disabled'+("x"===r.toLowerCase()?" checked":"")+">"};return r});