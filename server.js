const jsonServer = require('json-server');
const express = require('express');
const server = jsonServer.create();
const customRoutes = require('./routes.json');
const rewriter = jsonServer.rewriter(customRoutes);
const router = jsonServer.router('data/db.json');
const middlewares = jsonServer.defaults();
const task = require('./schemes/tsd-service/task');
const db = require('./data/db.json');
const path = require('path');

server.use('/public', express.static(path.join(__dirname, 'public')));
server.use(middlewares);
server.use(jsonServer.bodyParser);

// TODO: add custom handlers here

server.put('/api/tsd-service/v1/resources/barcodes/:barcode/register', (req, res) => {
  if (req.params.barcode.length < 8) {
    res.statusCode = 400;
    res.json({
      clientErrors: [{message: 'Длина штрихкода должна быть 8 символов'}],
      serverErrors: [{message: 'server error'}],
    });
  } else {
    res.statusCode = 200;

    res.json({
      deviceId: req.body.deviceId,
      id: 'resourceID',
      statusId: 'IDLE' // BUSY | IDLE | INACTIVE
    });
  }
});

server.get('/api/tsd-service/v1/devices/:deviceId/resources/:resourceId', (req, res) => {
  return res.status(200).json({
    ...db.resource,
    id: 'resourceID',
  });
});

server.put('/api/tsd-service/v1/resources/:id/deactivate', (req, res) => {
  if (Math.random() > 0.5) {
    res.statusCode = 400;
    res.json({
      clientErrors: [{message: 'client error'}],
      serverErrors: [{message: 'server error'}],
    });
  } else {
    res.statusCode = 200;

    res.json({
      deviceId: 'goldfish_x86',
      id: 'resourceID',
      resourceGroupName: 'resourceGroupName',
      resourceNumber: 'resourceNumber',
      siteId: 'siteId',
      statusId: 'INACTIVE', // BUSY | IDLE | INACTIVE,
      taskId: 'taskId',
    });
  }
});

server.put('/api/tsd-service/v1/resources/:id/task/assign', (req, res) => {
  if (Math.random() < 0.3) {
    return res.status(204).send('OK');
  } else {
    // TODO: make enum taskId
    return res.status(200).json(task);
  }
});

const inboundDelivery_unloading = [
  require('./schemes/tsd-service/step/inboundDelivery_unloading/scanCarrierBarcode'),
  // require('./schemes/tsd-service/step/inboundDelivery_unloading/scanLocationBarcode'),
];

const inboundDelivery_acceptance = [
  // require('./schemes/tsd-service/step/inboundDelivery_acceptance/scanLocationBarcode'),
  // require('./schemes/tsd-service/step/inboundDelivery_acceptance/scanProductBarcode'),
  // require('./schemes/tsd-service/step/inboundDelivery_acceptance/enterProductInfo'),
  // require('./schemes/tsd-service/step/inboundDelivery_acceptance/newCarrier_scanLocationBarcode'),
  // require('./schemes/tsd-service/step/inboundDelivery_acceptance/newCarrier_scanCarrierBarcode'),
  // require('./schemes/tsd-service/step/inboundDelivery_acceptance/placeProductOnCarrier'),
  require('./schemes/tsd-service/step/inboundDelivery_acceptance/selectCarriersToClose'),
];

const transfer_transferToElevator = [
  require('./schemes/tsd-service/step/transfer_transferToElevator/scanCarrierBarcode'),
  require('./schemes/tsd-service/step/transfer_transferToElevator/scanElevatorBarcode'),
];

const transfer_transferFromElevator = [
  require('./schemes/tsd-service/step/transfer_transferFromElevator/scanCarrierBarcode'),
  require('./schemes/tsd-service/step/transfer_transferFromElevator/scanPlaceBarcode'),
];

const transfer_productPlacement = [
  require('./schemes/tsd-service/step/transfer_productPlacement/scanCarrierBarcode'),
  // require('./schemes/tsd-service/step/transfer_productPlacement/scanProductBarcode'),
  // require('./schemes/tsd-service/step/transfer_productPlacement/scanPlaceBarcode'),
  // require('./schemes/tsd-service/step/transfer_productPlacement/addProductAmount')
];

function getStep(steps) {
  const index = Math.ceil(Math.random() * steps.length) - 1;
  return {
    ...steps[index],
    taskStatus: Math.random() < 0.7 ? 'pohui' : 'COMPLETED',
    status: Math.random() < 0.5 ? 'pohui' : 'COMPLETED',
  };
}

server.get('/api/tsd-service/v1/tasks/:id/steps/current', (req, res) => {
  if (Math.random() < 0.3) {
    return res.status(404).send('');
  } else {
    return res.status(200).json({
      ...getStep(inboundDelivery_unloading),
      ...getStep(inboundDelivery_acceptance),
      // ...getStep(transfer_transferToElevator),
      // ...getStep(transfer_transferFromElevator),
      // ...getStep(transfer_productPlacement),
      taskId: req.params.id
    });
  }
});

server.put('/api/tsd-service/v1/steps/:id/complete', (req, res) => {
  const rand = Math.ceil(Math.random() * 3);

  return res.status(200).json({
    id: 'whatever',
  });
});

server.use(rewriter);
server.use(router);

server.listen(3032, function () {
  console.log('\x1b[33m%s\x1b[0m', 'JSON Server is running!');
});
