const { expect } = require("chai");
const { createRef, formatData, createDate, formatData2 } = require("../utils/utils");

describe("createRef", () => {
  it("returns an empty object, when passed an empty array", () => {
    const input = [];
    const actual = createRef(input);
    const expected = {};
    expect(actual).to.eql(expected);
  });
  xit("returns an object containing one key value pair containing a owner name and id", () => {
    const ownerData = [
      {
        owner_id: 1,
        forename: "firstname-b",
        surname: "lastname-b",
        age: 30
      },
      {
        owner_id: 2,
        forename: "firstname-c",
        surname: "lastname-c",
        age: 21
      },
      {
        owner_id: 3,
        forename: "firstname-d",
        surname: "lastname-d",
        age: 17
      }
    ];
    const actual = createRef(ownerData);
    const expected = {
      "firstname-b": 1,
      "firstname-c": 2,
      "firstname-d": 3
    };
    expect(actual).to.eql(expected);
  });
});
describe("formatData", () => {
  it("returns a new empty array, when passed an empty array", () => {
    const shopData = [];
    const referenceObj = {};
    const actual = formatData(shopData, referenceObj);
    const expected = [];
    expect(actual).to.eql(expected);
    expect(actual).to.not.equal(shopData);
  });
  it("returns formatted array, when passed reference object and array", () => {
    const shopData = [
      { shop_name: "shop-b", owner: "firstname-b", slogan: "slogan-b" },
      { shop_name: "shop-d", owner: "firstname-c", slogan: "slogan-d" },
      { shop_name: "shop-e", owner: "firstname-d", slogan: "slogan-e" }
    ];
    const referenceObj = {
      "firstname-b": 1,
      "firstname-c": 2,
      "firstname-d": 3
    };
    const actual = formatData(shopData, referenceObj, "owner", "owner_id");
    const expected = [
      { shop_name: "shop-b", owner_id: 1, slogan: "slogan-b" },
      { shop_name: "shop-d", owner_id: 2, slogan: "slogan-d" },
      { shop_name: "shop-e", owner_id: 3, slogan: "slogan-e" }
    ];
    expect(actual).to.eql(expected);
    expect(actual).to.not.equal(shopData);
  });
});
describe("generic reference function (createRef2)", () => {
  it("creates a reference object using passed key and value", () => {
    const inputArr = [
      { name: "bob", id: 1 },
      { name: "frank", id: 2 },
      { name: "ken", id: 3 }
    ];
    const expectedOutput = {
      bob: 1,
      frank: 2,
      ken: 3
    };
    const actualOutput = createRef(inputArr, "name", "id");
    expect(actualOutput).to.eql(expectedOutput);
  });
});

describe("updates the timestamp", ()=>{
    it("takes an array of data, and updates the timestamp field", ()=>{
        const input = [{
            title: 'Running a Node App',
            topic: 'coding',
            author: 'jessjelly',
            body:
              'This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.',
            created_at: 1471522072389,
          }]
const time = new Date(1471522072389)
        const output = [{
            title: 'Running a Node App',
            topic: 'coding',
            author: 'jessjelly',
            body:
              'This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.',
            created_at: time
          }];

          const actualOutput = createDate(input);
          expect(actualOutput).to.eql(output);
    });
});

describe("updates the keys", ()=>{
  it("takes an array of data, and updates the key field", ()=>{
      const input = [{ created_at: "2017-03-17T22:27:49.732Z",
        article_id: 19,
        body:
         'Reiciendis enim soluta a sed cumque dolor quia quod sint. Laborum tempore est et quisquam dolore. Qui voluptas consequatur cumque neque et laborum unde sed. Impedit et consequatur tempore dignissimos earum distinctio cupiditate.',
        created_by: 'happyamy2016',
        votes: 17 },]

      const output = [{ created_at: "2017-03-17T22:27:49.732Z",
        article_id: 19,
        body:
         'Reiciendis enim soluta a sed cumque dolor quia quod sint. Laborum tempore est et quisquam dolore. Qui voluptas consequatur cumque neque et laborum unde sed. Impedit et consequatur tempore dignissimos earum distinctio cupiditate.',
        author: 'happyamy2016',
        votes: 17 }];

        const actualOutput = formatData2(input, "created_by", "author");
        expect(actualOutput).to.eql(output);
  });
});

