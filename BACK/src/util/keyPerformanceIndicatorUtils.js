const Hint = require('../models/hint')
const Page = require('../models/page')
const MetaData = require('../models/metaData')

function getHintsBasedOnHintID(hintID, startDate, endDate) {
    return Hint.find({ hintID: hintID, createdAt:{$gte:startDate, $lte:endDate} }, function(
        err,
        callback
      ) {
        if (err) {
          return;
        }
        if (callback.length == 0) {
          //no hints
          return;
        }
        return callback;
      });
}

function getHintsForDates(startDate, endDate) {
  return Hint.find({ createdAt:{$gte:startDate, $lte:endDate} }, function(
      err,
      callback
    ) {
      if (err) {
        return;
      }
      if (callback.length == 0) {
        //no hints
        return;
      }
      return callback;
    });
}

function getInterventionsForDates(startDate, endDate) {
  return Page.find({ createdAt:{$gte:startDate, $lte:endDate}, intervention:true }, function(
      err,
      callback
    ) {
      if (err) {
        return;
      }
      if (callback.length == 0) {
        //no interventions
        return;
      }
      return callback;
    });
}

function getMetaDataForDates(startDate, endDate) {
  return MetaData.find({ createdAt:{$gte:startDate, $lte:endDate} }, function(
      err,
      callback
    ) {
      if (err) {
        return;
      }
      if (callback.length == 0) {
        //no hints
        return;
      }
      return callback;
    });
}

module.exports = {
    getHintsBasedOnHintID: getHintsBasedOnHintID,
    getHintsForDates: getHintsForDates,
    getMetaDataForDates: getMetaDataForDates,
    getInterventionsForDates: getInterventionsForDates
}