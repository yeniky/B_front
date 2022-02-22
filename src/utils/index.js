import tagService from 'services/tags';

//for update a key inside an array of objects in multiple instances
export const updateKey = (array, key, oldValue, newValue) => {
  return array.map((item) => ({
    ...item,
    [key]: item[key] === oldValue ? newValue : item[key],
  }));
};

export const updateItem = (array, idName, hashValue) => {
  const hashmap = Object.fromEntries(array.map((item) => [item[idName], item]));
  const updatedHash = { ...hashmap, ...hashValue };
  return Object.values(updatedHash);
};

export const downloadFile = (data, name) =>
  tagService.downloadFile(data).then((res) => {
    const downloadUrl = window.URL.createObjectURL(new Blob([res]));
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('download', `${name}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  });

export const rotate_point = (pointX, pointY, originX, originY, angle) => {
  switch (angle) {
    case 90:
      return [-pointY + originX, pointX];
    case 180:
      return [-pointX + originX, -pointY + originY];
    case 270:
      return [pointY, -pointX + originY];
    default:
      return [pointX, pointY];
  }
};
