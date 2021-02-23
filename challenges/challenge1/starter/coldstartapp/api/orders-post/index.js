const { getUser } = require('../shared/user-utils');
const { QueueClient, QueueServiceClient } = require('@azure/storage-queue');
const { v4: uuidv4 } = require('uuid');

module.exports = async function (context, req) {
  // Get the user details from the request
  const user = getUser(req);
  if (!user) {
    context.res.status(401);
    return;
  }

  const connectionString = process.env.AzureWebJobsStorage;
  const queueServiceClient = QueueServiceClient.fromConnectionString(
    connectionString
  );

  const queueClient = queueServiceClient.getQueueClient('orders');
  await queueClient.createIfNotExists();

  // Get the pre-order from the request
  const order = {
    Id: uuidv4(),
    User: user.userDetails,
    Date: new Date().toJSON(),
    IcecreamId: req.body.icecreamId,
    Status: 'New',
    DriverId: null,
    FullAddress: '1 Microsoft Way, Redmond, WA 98052, USA',
    LastPosition: null,
  };

  await queueClient.sendMessage(JSON.stringify(order));

  context.res.status(201);
  context.res.body = order;
};
