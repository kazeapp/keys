import fetch from "node-fetch";
import fs from "fs";

// const fetch = require("node-fetch");
// const fs = require("fs");

// URL for data
const URL = "https://vizcloud.cloud/embed/7ZPNN0M12P02";

// function to get the raw data
// const getRawData = (URL) => {
//   return fetch(URL)
//     .then((response) => {
//       // console.log(response.text());
//       return response.text();
//     })
//     .then((data) => {
//       console.log(data);
//       return data;
//     });
// };

const getRawData = async (URL) => {
  const response = await fetch(URL, {
    method: "GET",
    headers: { Referer: "https://www9.bflix.to/" },
  });
  const body = await response.text();
  return body;
};

const getjsLink = async () => {
  const vizcloudRawData = await getRawData(URL);
  const result = vizcloudRawData.match(
    /<script type="text\/javascript" src="(.*?)\?v=(\d+)"><\/script>/
  );
  return result[1];
};

const saveFile = async (data) => {
  // writeFile function with filename, content and callback function
  fs.writeFile("viz.js", data, function (err) {
    if (err) throw err;
    console.log("File is created successfully.");
  });
};

const getKeys = async () => {
  const jsLink = "https://vizcloud.cloud" + (await getjsLink());
  const vizcloudScriptData = await getRawData(jsLink);
  await saveFile(vizcloudScriptData);
  await pushToGist();
  // console.log(vizcloudScriptData);
};

getKeys();

const pushToGist = async () => {
  var token = process.env.TOKEN;
  var filename = "viz.js";
  var gist_id = process.env.GIST;
  fs.readFile(filename, "utf8", async (err, data) => {
    var headers = { Authorization: `token ${token}` };
    var r = await fetch("https://api.github.com/gists/" + gist_id, {
      method: "PATCH",
      body: JSON.stringify({ files: { "vizcloud.js": { content: data } } }),
      headers: headers,
    });
  });
};
