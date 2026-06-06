import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE } from '../constants/image';

export const validateImage = (file: File): string | null => {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return 'Only PNG and JPEG files are allowed';
  }

  if (file.size > MAX_IMAGE_SIZE) {
    return 'Maximum file size is 2MB';
  }

  return null;
};
