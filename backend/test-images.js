const https = require('https');

const ids = [
  '1498307833015-e1b2e4d5a479', // beach resort
  '1566073771259-6a8506099945', // hotel pool
  '1522708323590-d24dbb6b0267', // luxury room
  '1493246507139-91e8fad9978e', // lodge
  '1571003123894-1f053c462965', // resort
  '1582719508461-890e1f748107', // safari
  '1510798831971-661eb04b3739', // resort
  '1542314831-c6a4d27ce6a2', // luxury hotel
  '1585406085521-4f10fac8b122', // luxury pool
  '1590490360182-c5188bfb972d', // nature lodge
  '1563911302283-d2bc129e7570', // luxury hotel
  '1578683014746-98ac5a56b2fc', // safari
  '1551882547-ff40c0dffe1c', // luxury safari
];

async function testLinks() {
  const valid = [];
  for (const id of ids) {
    const url = `https://images.unsplash.com/photo-${id}?w=800&fit=crop`;
    await new Promise(resolve => {
      https.get(url, (res) => {
        if (res.statusCode === 200 || res.statusCode === 302 || res.statusCode === 301) {
          valid.push(id);
          console.log(`Valid: ${id}`);
        } else {
          console.log(`Failed: ${id} (${res.statusCode})`);
        }
        resolve();
      });
    });
  }
  console.log("FINAL VALID LIST: ", JSON.stringify(valid));
}

testLinks();
