const dialog=document.querySelector('#share');const urlInput=document.querySelector('#url');
document.querySelectorAll('[data-share]').forEach(button=>button.addEventListener('click',()=>{const url=new URL(button.dataset.share,location.href).href;urlInput.value=url;const code=qrcode(0,'M');code.addData(url);code.make();document.querySelector('#qr').src=code.createDataURL(6,0);dialog.showModal();}));
document.querySelector('.close').addEventListener('click',()=>dialog.close());
document.querySelector('#copy').addEventListener('click',async()=>{await navigator.clipboard.writeText(urlInput.value);document.querySelector('#copy').textContent='Kopiert';});
