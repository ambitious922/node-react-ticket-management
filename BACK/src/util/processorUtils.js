const Medication = require('../models/medication');
const Hint = require('../models/hint');
const INR = require('../models/INR');
const Digoxin = require('../models/digoxin');
const Creatinine = require('../models/creatinine');
const Patient = require('../models/patient');
const moment = require("moment");

var doseTypes = [
  {name:"im / subcut",type:"im"},
  {name:"intramuscular",type:"im"},
  {name:"intramuscular",type:"im"},
  {name:"im / iv",type:"iv"},
  {name:"iv",type:"iv"},
  {name:"im / iv / po",type:"iv"},
  {name:"im / iv / subcut",type:"iv"},
  {name:"intravenous",type:"iv"},
  {name:"iv / po",type:"po"},
  {name:"ngt / iv",type:"po"},
  {name:"oral",type:"po"},
  {name:"oral / topical",type:"po"},
  {name:"peg",type:"po"},
  {name:"po",type:"po"},
  {name:"po / im / pr",type:"po"},
  {name:"po / iv / ngt / pr",type:"po"},
  {name:"po / ngt",type:"po"},
  {name:"po / ngt / iv",type:"po"},
  {name:"po / pr",type:"po"},
  {name:"po / subcut",type:"po"},
  {name:"po / subcut / iv",type:"po"},
  {name:"po / sublingual",type:"po"},
  {name:"both eyes",type:"NOT"},
  {name:"both nostrils",type:"NOT"},
  {name:"buccal",type:"NOT"},
  {name:"inhalation",type:"NOT"},
  {name:"intraocular",type:"NOT"},
  {name:"left eye",type:"NOT"},
  {name:"left nostril",type:"NOT"},
  {name:"mouth/throat",type:"po"},
  {name:"nasal",type:"NOT"},
  {name:"nasogastric",type:"po"},
  {name:"not applicable",type:"NOT"},
  {name:"otic/aural",type:"NOT"},
  {name:"rectal",type:"NOT"},
  {name:"right eye",type:"NOT"},
  {name:"subcut via driver",type:"NOT"},
  {name:"subcutaneous",type:"NOT"},
  {name:"sublingual",type:"NOT"},
  {name:"topical/cutaneous",type:"NOT"},
  {name:"transdermal",type:"patch"},
  {name:"vaginal",type:"NOT"}
];

let frequencyLookups = [
  { name: "mane", dose: 1 },
  { name: "o.d.", dose: 1 },
  { name: "nocte", dose: 1 },
  { name: "once daily", dose: 1 },
  { name: "24", dose: 1 },
  { name: "midi", dose: 1 },
  { name: "daily", dose: 1 },
  { name: "24.ash", dose: 1 },
  { name: "brk", dose: 1 },
  { name: "din", dose: 1 },
  { name: "over24", dose: 1 },
  { name: "posthdx", dose: 1 },
  { name: "stat", dose: 1 },
  { name: "other", dose: 1 },
  { name: "in the morning", dose: 1 },
  { name: "24 hourly", dose: 1 },
  { name: "at night", dose: 1 },
  { name: "b.d", dose: 2 },
  { name: "dec-24", dose: 2 },
  { name: "12/24.ash", dose: 2 },
  { name: "12/24", dose: 2 },
  { name: "12/25", dose: 2 },
  { name: "twice daily", dose: 2 },
  { name: "Aug-24", dose: 3 },
  { name: "t.d.s", dose: 3 },
  { name: "t.d.m", dose: 3 },
  { name: "three times daily", dose: 3 },
  { name: "three times daily with meals", dose: 3 },
  { name: "8/24", dose: 3 },
  { name: "eight hourly", dose: 3 },
  { name: "q.i.d", dose: 4 },
  { name: "jun-24", dose: 4 },
  { name: "6/24", dose: 4 },
  { name: "four times daily", dose: 4 },
  { name: "c.i.d", dose: 5 },
  { name: "s.i.d", dose: 6 },
  { name: "apr-24", dose: 6 },
  { name: "4/24", dose: 6 },
  { name: "3/24", dose: 8 },
  { name: "twohourlywaking", dose: 9 },
  { name: "hourlywaking", dose: 17 }
];

function getMedicationsForPatient(URN) {
    return Medication.find({ patientNumber: URN }, function(
        err,
        medicationsArray
      ) {
        if (err) {
          return [];
        }
        if (medicationsArray.length == 0) {
          //no meds for this dude
          return [];
        }
        return medicationsArray;
      });
}

function getCreatininesForPatient(URN) {
  return Creatinine.find({ patientNumber: URN }, function(
      err,
      callback
    ) {
      if (err) {
        return [];
      }
      if (callback.length == 0) {
        //no creats for this dude
        return [];
      }
      return callback;
    });
}

function getINRsForPatient(URN) {
  return INR.find({ patientNumber: URN }, function(
      err,
      callback
    ) {
      if (err) {
        return [];
      }
      if (callback.length == 0) {
        //no INRS for this dude
        return [];
      }
      return callback;
    });
}

function getHintsForPatient(URN) {
    return Hint.find({ patientNumber: URN }, function(
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

function getPatientDetails(URN) {
  return Patient.find({ patientNumber: URN }, function(
      err,
      callback
    ) {
      if (err) {
        return;
      }
      if (callback.length == 0) {
        //WTF this guy does not exist
        return;
      }
      return callback;
    });
}

function getDigLevelForPatient(URN) {
  return Digoxin.find({ patientNumber: URN }, function(
      err,
      callback
    ) {
      if (err) {
        return;
      }
      if (callback.length == 0) {
        //no digoxin level dude
        return;
      }
      return callback;
    });
}

function extractRelevantMedicationNames(medications) {
    return medications
    // Filter out anything that's not oral peg or ngt
    .filter(med => {
        return med.route.toLowerCase().includes("oral") ||
        med.route.toLowerCase().includes("po") ||
        med.route.toLowerCase().includes("p.o") ||
        med.route.toLowerCase().includes("peg") ||
        med.route.toLowerCase().includes("p.e.g") ||
        med.route.toLowerCase().includes("n.g.t") ||
        med.route.toLowerCase().includes("ngt")
    })
    .map(med => {
        return med.medicationName.toLowerCase()
    });
}

function isHintCompleted(hints, hintId, medication) {
    return hints.find(hint => 
        hint.hintID === hintId &&
        hint.completed === true &&
        hint.medication === medication
    ) !== undefined;
}

function isHintCompletedNoMeds(hints, hintId) {
  return hints.find(hint => 
      hint.hintID === hintId &&
      hint.completed === true
  ) !== undefined;
}

function getDoseType(doseType){
  for(var r=0;r<doseTypes.length;r++){
    if(doseTypes[r].name===doseType){
      return doseTypes[r].type
    }    
  }
  return undefined;
}

function getFrequency(frequency){
  for(var d=0;d<doseTypes.length;d++){
    if(frequencyLookups[d].name===frequency){
      return frequencyLookups[d].dose;
    }    
  }
  return undefined;
}

function daysBetween(before, after) {
  return moment.duration(moment(after).diff(moment(before))).asDays();
}

function dumbExcelDateCleaner(excelDate) {
  //have added 14 hours to the moments so that it matches central time Australia (ish)
  let convertedDate = new Date();
  //if there is a slash, then I'm assuming it is a standard DD/MM/YYYY date
  if(excelDate.toString().includes("/")){
  convertedDate = moment(excelDate, 'DD/MM/YYYY').add(14, 'hours').toDate();
  }
  //otherwise it is the dumb 44508 excel date number
  else{
  var date = new Date(Math.round((excelDate - (25567 + 1)) * 86400 * 1000));
  convertedDate = moment(date.toISOString().split('T')[0],'YYYY-MM-DD').add(14, 'hours').toDate();
  }
  return convertedDate;
}

function onlyUnique(value, index, self) { 
  return self.indexOf(value) === index;
}

module.exports = {
    getHintsForPatient: getHintsForPatient,
    getDigLevelForPatient: getDigLevelForPatient,
    getMedicationsForPatient: getMedicationsForPatient,
    getCreatininesForPatient: getCreatininesForPatient,
    getINRsForPatient: getINRsForPatient,
    extractRelevantMedicationNames: extractRelevantMedicationNames,
    isHintCompleted: isHintCompleted,
    getDoseType: getDoseType,
    getFrequency: getFrequency,
    getPatientDetails: getPatientDetails,
    isHintCompletedNoMeds: isHintCompletedNoMeds,
    daysBetween: daysBetween,
    dumbExcelDateCleaner: dumbExcelDateCleaner,
    onlyUnique: onlyUnique
}