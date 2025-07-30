export const textCenterEllipsis = (str: string, from: number, to: number) => {
  return `${str.substr(0, from)}...${str.substr(str.length - to, str.length)}`;
};

export const textEndEllipsis = (str: string, number: number) => {
  if (str.length > number) {
    return `${str.substr(0, number)}...`;
  }
  return str;
};
