import FileResizer from 'react-image-file-resizer';

export const resizeFile = (file: any) =>
  new Promise((resolve) => {
    FileResizer.imageFileResizer(
      file, //? File or path
      900, //? maxWidth
      600, //? maxHeight
      'JPEG', //? JPEG, PNG or WEBP.
      100, //? quality 0-100
      0, //? rotaition
      (uri) => {
        resolve(uri);
      },
      'file' //? base64, blob or file
    );
  });

export const addTextToImage = (file: any, text: string) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function (event) {
      const img: any = new Image();
      img.onload = function () {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx: any = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        ctx.font = 'bold 40px Arial';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.fillText(text, canvas.width / 2, canvas.height / 2);
        canvas.toBlob((blob: any) => {
          const newFile = new File([blob], file.name, {
            type: file.type,
            lastModified: Date.now(),
          });
          resolve(newFile);
        }, file.type);
      };
      img.src = event.target?.result;
    };
    reader.readAsDataURL(file);
  });
};
