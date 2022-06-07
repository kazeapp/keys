import fetch from "node-fetch";
import fs from 'fs';

// URL for data
const URL = "https://vizcloud.cloud/embed/7ZPNN0M12P02";

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
fs.writeFile('viz.js', data, function (err) {
  if (err) throw err;
  console.log('File is created successfully.');
});
}

const getKeys = async () => {
  const jsLink = "https://vizcloud.cloud" + (await getjsLink());
  const vizcloudScriptData = await getRawData(jsLink);
  await saveFile(vizcloudScriptData);
  // console.log(vizcloudScriptData);
};

getKeys();
