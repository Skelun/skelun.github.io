(()=>{console.log("This site was generated by Hugo.");document.addEventListener("DOMContentLoaded",function(){fetch("/index.json").then(e=>e.json()).then(e=>{let c=new Fuse(e,{keys:["title","date","wokeness"],threshold:.3,minMatchCharLength:3}),s=document.querySelector(".main-search input"),t=document.querySelector(".search-results");function i(){let r=s.value;if(r.trim()===""){t.style.display="none",t.innerHTML="";return}let o=c.search(r);t.innerHTML=o.map(a=>{let n=a.item;return`<a href="/${n.origin}/${n.title.toLowerCase().replace(/\s+/g,"-")}.html">${n.title}</a>`}).join(""),t.style.display=o.length?"block":"none"}s.addEventListener("input",i)}).catch(e=>console.error("Error fetching JSON:",e))});})();
