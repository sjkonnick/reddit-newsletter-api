if (!process.env.AWS_REGION) {
  process.env.AWS_REGION = 'us-east-2';
}

if (!process.env.DYNAMODB_NAMESPACE) {
  process.env.DYNAMODB_NAMESPACE = 'dev';
}

const AWS = require('aws-sdk');

let DocumentClient = null;

if (process.env.IS_OFFLINE) {
  AWS.config.update({
    region: 'localhost',
    endpoint: "http://localhost:8000"
  });
}
DocumentClient = new AWS.DynamoDB.DocumentClient();

module.exports = {
  async purgeData() {
    await purgeTable('users', 'username');
    return envelop('Purged all data!');
  },

  getTableName(aName) {
    return `redditServerlessAPI-${process.env.DYNAMODB_NAMESPACE}-${aName}`;
  },

  envelop,

  tokenSecret: process.env.SECRET ? process.env.SECRET : '3ee058420bc2',
  DocumentClient,

};

function envelop(res, statusCode = 200) {
  let body;
  if (statusCode == 200) {
    body = JSON.stringify(res, null, 2);
  } else {
    body = JSON.stringify({ errors: { body: [res] } }, null, 2);
  }
  return {
    statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body,
  };
}

async function purgeTable(aTable, aKeyName) {
  const tableName = module.exports.getTableName(aTable);

  const allRecords = await DocumentClient
    .scan({ TableName: tableName }).promise();
  const deletePromises = [];
  for (let i = 0; i < allRecords.Items.length; ++i) {
    const recordToDelete = {
      TableName: tableName,
      Key: {},
    };
    recordToDelete.Key[aKeyName] = allRecords.Items[i][aKeyName];
    deletePromises.push(DocumentClient.delete(recordToDelete).promise());
  }
  await Promise.all(deletePromises);
}
