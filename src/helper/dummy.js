import { makeString } from "./utils";

export const dummyData = (num = 10) => {
  let data = [];
  for (var i = 0; i < num; i++) {
    let status = i % 2;
    data.push({
      key: i,
      id: i,
      name: `Gesang ${makeString(6)} ${i}`,
      email: `gesang_${makeString(6)}_${i}@mail.com`,
      address: `Havard ${makeString(6)} ${i}`,
      status: status,
    });
  }
  console.log(data);
  return data;
};
