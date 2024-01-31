export const blobToBase64 = (url: string) => {
  return new Promise(async (resolve, _) => {
    // do a request to the blob uri
    const response = await fetch(url);
    // response has a method called .blob() to get the blob file
    const blob = await response.blob();
    // instantiate a file reader
    const fileReader = new FileReader();
    // read the file
    fileReader.readAsDataURL(blob);

    fileReader.onloadend = function () {
      resolve(fileReader.result); // Here is the base64 string
    }
  });
};

export const jpegBase64ToStringBase64 = (image: unknown): string => {
  const replaceValue = 'data:image/jpeg;base64,'
  let newImage = image as string
  newImage = newImage.replace(replaceValue, '');
  return newImage;
}

export function validateSAIDNumber(idNumber: string): boolean {
  // Check if the ID number is 13 characters long
  
  if (idNumber.length !== 13) {
    return false;
  }

  // Check if the ID number contains only numeric characters
  if (!/^\d+$/.test(idNumber)) {
    return false;
  }

  // Extract the birthdate from the ID number
  const year = parseInt(idNumber.substring(0, 2), 10);
  const month = parseInt(idNumber.substring(2, 4), 10);
  const day = parseInt(idNumber.substring(4, 6), 10);

  // Validate the birthdate
  if (year < 0 || year > 99 || month < 1 || month > 12 || day < 1 || day > 31) {
    return false;
  }

  // Calculate the checksum
  const checksum = parseInt(idNumber.charAt(12), 10);
  const weightedSum = idNumber
    .substring(0, 12)
    .split('')
    .map((digit, index) => parseInt(digit, 10) * (index % 2 === 0 ? 1 : 2))
    .join('')
    .split('')
    .map((digit) => parseInt(digit, 10))
    .reduce((acc, val) => acc + val, 0);

  const calculatedChecksum = (10 - (weightedSum % 10)) % 10;

  // Check if the checksum is valid
  return checksum === calculatedChecksum;
}

