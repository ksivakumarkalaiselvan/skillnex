/**
 * SKILLNEX Google Apps Script Web App API
 * Deploy this script as a Web App with access set to "Anyone"
 */

function doPost(e) {
  try {
    const requestData = JSON.parse(e.postData.contents);
    const action = requestData.action;
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    
    let result = { success: false, message: "Invalid action" };

    switch (action) {
      case "getUsers":
        result = { success: true, data: readSheetData(ss, "Users") };
        break;
      case "createUser":
        result = { success: true, data: appendSheetRow(ss, "Users", requestData.user) };
        break;
      case "getCities":
        result = { success: true, data: readSheetData(ss, "Cities") };
        break;
      case "updateCityScore":
        result = { success: true, data: updateCity(ss, requestData.cityName, requestData.pointsAdded) };
        break;
      case "getCourses":
        result = { success: true, data: readSheetData(ss, "Courses") };
        break;
      case "createCourse":
        result = { success: true, data: appendSheetRow(ss, "Courses", requestData.course) };
        break;
      case "getProgress":
        result = { success: true, data: readSheetData(ss, "Learning_Progress") };
        break;
      case "updateProgress":
        result = { success: true, data: appendSheetRow(ss, "Learning_Progress", requestData.progress) };
        break;
      case "getAssessments":
        result = { success: true, data: readSheetData(ss, "Assessments") };
        break;
      case "createAssessment":
        result = { success: true, data: appendSheetRow(ss, "Assessments", requestData.assessment) };
        break;
      case "getAssessmentResults":
        result = { success: true, data: readSheetData(ss, "Assessment_Results") };
        break;
      case "createAssessmentResult":
        result = { success: true, data: appendSheetRow(ss, "Assessment_Results", requestData.result) };
        break;
      case "getStudyPlans":
        result = { success: true, data: readSheetData(ss, "Study_Plans") };
        break;
      case "createStudyPlan":
        result = { success: true, data: appendSheetRow(ss, "Study_Plans", requestData.plan) };
        break;
      case "getCityBattles":
        result = { success: true, data: readSheetData(ss, "City_Battles") };
        break;
      case "createCityBattle":
        result = { success: true, data: appendSheetRow(ss, "City_Battles", requestData.battle) };
        break;
      case "getSkills":
        result = { success: true, data: readSheetData(ss, "Skills") };
        break;
      case "updateSkill":
        result = { success: true, data: appendSheetRow(ss, "Skills", requestData.skill) };
        break;
      case "getNotifications":
        result = { success: true, data: readSheetData(ss, "Notifications") };
        break;
      case "createNotification":
        result = { success: true, data: appendSheetRow(ss, "Notifications", requestData.notification) };
        break;
      default:
        result = { success: false, message: "Unknown action: " + action };
    }

    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: "SKILLNEX Google Apps Script API active",
    timestamp: new Date()
  })).setMimeType(ContentService.MimeType.JSON);
}

function readSheetData(ss, sheetName) {
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) return [];
  const rows = sheet.getDataRange().getValues();
  if (rows.length < 2) return [];
  const headers = rows[0];
  const result = [];
  for (let i = 1; i < rows.length; i++) {
    let rowObj = {};
    for (let j = 0; j < headers.length; j++) {
      rowObj[headers[j]] = rows[i][j];
    }
    result.push(rowObj);
  }
  return result;
}

function appendSheetRow(ss, sheetName, dataObj) {
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) return dataObj;
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const row = headers.map(h => dataObj[h] !== undefined ? dataObj[h] : "");
  sheet.appendRow(row);
  return dataObj;
}

function updateCity(ss, cityName, pointsAdded) {
  const sheet = ss.getSheetByName("Cities");
  if (!sheet) return null;
  const rows = sheet.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][1].toString().toLowerCase() === cityName.toLowerCase()) {
      let currentXp = Number(rows[i][2]) || 0;
      rows[i][2] = currentXp + Number(pointsAdded);
      rows[i][5] = new Date().toISOString().split('T')[0];
      sheet.getRange(i + 1, 1, 1, rows[i].length).setValues([rows[i]]);
      return { city_id: rows[i][0], city_name: rows[i][1], total_xp: rows[i][2] };
    }
  }
  return null;
}
