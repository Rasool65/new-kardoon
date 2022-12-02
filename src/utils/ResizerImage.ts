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
