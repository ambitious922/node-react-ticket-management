const Utils = require('./processorUtils')
const Hint = require('../models/hint');
const MetaData = require('../models/metaData');
var hintNumbers = [];

const metaData = async URN => {
  try {
      var hints = await Utils.getHintsForPatient(URN)
      var digoxin = await Utils.getDigLevelForPatient(URN)
      var patient = await Utils.getPatientDetails(URN)
      var medications = await Utils.getMedicationsForPatient(URN)
      var creatinines = await Utils.getCreatininesForPatient(URN)
      var INR = await Utils.getINRsForPatient(URN)
    if (typeof URN !== "undefined") {
        await storeMetaData(URN, await digoxin, await patient, await medications, await creatinines, await INR, getHintNumbers(await hints));
      }
  } catch (e) {
  }
};

function getHintNumbers(hints){
  var hintNumbers = [];
  for(var i = 0;i<hints.length;i++){
    hintNumbers.push(hints[i].hintID);
  }
  return hintNumbers;
}


async function storeMetaData(URN, digoxin, patient, medications, creatinines, INR, hintNumbers){
  var todaysDate = new Date();
  var hintIDs = hintNumbers;
  var medicationsArray = [];
  for (var h = 0; h < medications.length; h++) {
    medicationsArray.push(medications[h].medicationName)
  }
  //var medicationArray = ["digoxin", "metoprolol"];
  //grab the last creatinine value for storing
  if(creatinines.length>1){
    creatinines = creatinines.sort((a, b) => b.dateRecorded - a.dateRecorded);
  }
  digoxin = digoxin.sort((a, b) => b.dateRecorded - a.dateRecorded);
  INR = INR.sort((a, b) => b.dateRecorded - a.dateRecorded);
  var patientWard = undefined;
  var lastCreatinineValue = undefined;
  var lasteGFRValue = undefined;
  var lastPotassiumValue = undefined;
  var lastDigoxinLevel = undefined;
  var lastINRLevel = undefined;
  var lastSodiumValue = undefined;
  var lastAlbuminValue = undefined;
  var patientTriageDiagnosis = undefined;
  var patientAge = undefined;
  var patientAdmitDate = undefined;
  var patientWeight = undefined;
  if(creatinines[0]===undefined){
    //do nothing, there are no values
  }
  else{
    lasteGFRValue = creatinines[0].eGFRValue;
    lastCreatinineValue = creatinines[0].creatinineValue;
    lastPotassiumValue = creatinines[0].potassiumValue;
    lastSodiumValue = creatinines[0].sodiumValue;
    lastAlbuminValue = creatinines[0].albuminValue;
  }
  if(digoxin[0]===undefined){
    //do nothing, there are no values
  }
  else{
    lastDigoxinLevel = digoxin[0].digoxinValue;
  }
  if(INR[0]===undefined){
    //do nothing, there are no values
  }
  else{
    lastINRLevel = INR[0].INRLevel;
  }
  if(patient[0]===undefined){
    //do nothing, there are no values
    console.log("THERE HAS TO BE SOME PATIENT DATA WHEN SAVING METADATA, SOMETHING REALLY WEIRD IS HAPPENING");
  }
  else{
    patientWard = patient[0].patientWard;
    patientTriageDiagnosis = patient[0].patientTriageDiagnosis;
    patientAge = patient[0].patientAge;
    patientAdmitDate = patient[0].patientAdmitDate;
    patientWeight = patient[0].patientWeight;
  }
  const todaysMetaData = new MetaData({
    patientNumber: URN,
    patientWard: patientWard,
    todaysDate: todaysDate,
    lastCreatinineValue: lastCreatinineValue,
    lasteGFRValue: lasteGFRValue,
    lastPotassiumValue: lastPotassiumValue,
    lastSodiumValue: lastSodiumValue,
    lastAlbuminValue: lastAlbuminValue,
    lastDigoxinLevel: lastDigoxinLevel,
    hintIDs: hintIDs,
    lastINRLevel: lastINRLevel,
    medicationNames: medicationsArray,
    patientTriageDiagnosis: patientTriageDiagnosis,
    patientAge: patientAge,
    patientAdmitDate: patientAdmitDate,
    patientWeight: patientWeight
  })
  try{
    const theMETA = await todaysMetaData.save();
    res.send(todaysMetaData);
  }
  catch(e){
    res.status(500).send()
  }
}

metaData()
  .then(result => {
    if (result === undefined) {
      //do nothing, there is no result
    } else {
      return result;
    }
  })
  .catch(e => {
  });

module.exports = metaData;