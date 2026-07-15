export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.addEventListener('load', () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
        return;
      }

      reject(new Error('Failed to convert file to base64'));
    });

    reader.addEventListener('error', () => {
      reject(new Error(reader.error?.message ?? 'Failed to read file'));
    });

    reader.readAsDataURL(file);
  });
};
