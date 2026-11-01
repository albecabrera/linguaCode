const dialog = document.querySelector('#share-dialog');
const qrImage = document.querySelector('#share-qr');
const shareUrl = document.querySelector('#share-url');
const shareTitle = document.querySelector('#share-title');

for (const button of document.querySelectorAll('[data-share]')) {
  button.addEventListener('click', () => {
    const url = button.dataset.share;
    const title = button.dataset.title;
    const code = qrcode(0, 'M');
    code.addData(url);
    code.make();
    qrImage.src = code.createDataURL(6, 0);
    qrImage.alt = `QR-Code für ${title}`;
    shareUrl.value = url;
    shareTitle.textContent = title;
    dialog.showModal();
  });
}

document.querySelector('#share-close').addEventListener('click', () => dialog.close());
