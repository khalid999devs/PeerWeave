export const emailResExp = new RegExp(
  /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
);

export const strWithExtSplit = (str, splitRange) => {
  if (str.length > splitRange) {
    const splited = str.split('.');
    const splitedL = splited.length;
    const firstPart = splited.slice(0, splitedL - 1).join('.');
    const sliced =
      firstPart.slice(0, splitRange - 5) + '...' + firstPart.slice(-2);
    return sliced + '.' + splited[splitedL - 1];
  } else {
    return str;
  }
};

export const splitTextWithDot = (str, targetRange) => {
  if (str.length > targetRange) {
    return str.slice(0, targetRange) + '...';
  } else {
    return str;
  }
};
