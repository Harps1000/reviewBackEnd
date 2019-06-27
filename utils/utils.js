const createRef = (ownerData, key, value) => {
  if (ownerData.length === 0) return {};
  const referenceObj = {};
  ownerData.forEach(elem => {
    const keys = elem[key];
    const values = elem[value];
    return (referenceObj[keys] = values);
  });
  return referenceObj;
};

const formatData = (dataToConvert, referenceObj, keyToReject, newKey) => {
  if (dataToConvert.length === 0) return [];
  const returnArr = [];
  dataToConvert.forEach(elem => {
    const { [keyToReject]: rejectedKey, ...restOfObject } = elem;
    returnArr.push({ [newKey]: referenceObj[rejectedKey], ...restOfObject });
  });
  return returnArr;
};

const createDate = arr => {
  const ref = [];
  arr.forEach(elem => {
    const { created_at, ...restOfObject } = elem;
    const newTime = new Date(created_at);
    ref.push({ created_at: newTime, ...restOfObject });
  });
  return ref;
};

const formatData2 = (dataToConvert, keyToRename, newKey) => {
  if (dataToConvert.length === 0) return [];
  // console.log(newKey)
  // console.log(keyToRename)
  const returnArr = [];
  dataToConvert.forEach(elem => {
    const { [keyToRename]: value, ...restOfObject } = elem;
    returnArr.push({ [newKey]: value, ...restOfObject });
  });
  return returnArr;
};

module.exports = { createRef, formatData, createDate, formatData2 };
