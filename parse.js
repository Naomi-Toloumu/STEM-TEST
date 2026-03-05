//This Program is essentially a practice round to overcome the learning curve for how to parse the file. 
//A table is a good way to demonstrate this ability/visualize that it works
//TODO
//Utilize the same parsing algorithm to create an object for data manipulation
//Write additional funcitons for data analysis of said objects (avg, statistical outliers, etc)
//Find effective ways to calculate and represent errors/potential warnings, e.g. how to automatically detect that a range of values is "off"
//Create visual layout for generated report, get feedback.

(function () {

    var NEWLINE = /\r?\n/; // Handles both Unix and Windows line endings
    var input = document.getElementById('file');
    var table = document.getElementById('table');
  
    if (!input) {
      return;
    }
  
    // Listens for file selection and starts parsing
    input.addEventListener('change', function () {
      if (input.files && input.files.length > 0) {
        parseCSV(input.files[0]);
      }
    });
  
    // Reads CSV file and passes text to table generator
    function parseCSV(file) {
      if (!file || typeof FileReader === 'undefined') {
        return;
      }
  
      var reader = new FileReader();
  
      reader.onload = function (e) {
        var dataTable = toDataTable(e.target.result, file.name);
        window.currentDataTable = dataTable; // store globally for manipulation/comparison
        renderDataTable(dataTable);
      };
  
      reader.readAsText(file);
    }
  
    // Converts CSV text into a DataTable object
    function toDataTable(text, fileName) {
      if (!text) {
        return new DataTable([], [], { sourceFileName: fileName });
      }
  
      // Basic quote-safe CSV parser (supports commas and quoted fields)
      var rows = [];
      var currentRow = [];
      var currentField = '';
      var inQuotes = false;
  
      for (var i = 0; i < text.length; i++) {
        var char = text[i];
        var nextChar = text[i + 1];
  
        if (char === '"' && inQuotes && nextChar === '"') {
          currentField += '"';
          i++;
        } else if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          currentRow.push(currentField);
          currentField = '';
        } else if ((char === '\n' || char === '\r') && !inQuotes) {
          if (char === '\r' && nextChar === '\n') {
            i++;
          }
          currentRow.push(currentField);
          rows.push(currentRow);
          currentRow = [];
          currentField = '';
        } else {
          currentField += char;
        }
      }
  
      if (currentField.length > 0 || currentRow.length > 0) {
        currentRow.push(currentField);
        rows.push(currentRow);
      }
  
      if (rows.length === 0) {
        return new DataTable([], [], { sourceFileName: fileName });
      }
  
      var headers = rows.shift().map(function (h) {
        return h.trim().replace(/^"|"$/g, '');
      });
  
      var dataRows = rows.map(function (row) {
        var obj = {};
        headers.forEach(function (h, i) {
          var value = row[i] == null ? "" : row[i];
          obj[h] = value.trim().replace(/^"|"$/g, '');
        });
        return obj;
      });
  
      return new DataTable(headers, dataRows, { sourceFileName: fileName });
    }
  
    // Converts DataTable object into an HTML table
    function renderDataTable(dataTable) {
      if (!dataTable || !table) {
        return;
      }
  
      while (table.lastElementChild) {
        table.removeChild(table.lastElementChild);
      }
  
      var headerRow = document.createElement('tr');
  
      dataTable.headers.forEach(function (header) {
        var th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
      });
  
      table.appendChild(headerRow);
  
      dataTable.rows.forEach(function (row) {
        var tableRow = document.createElement('tr');
  
        dataTable.headers.forEach(function (header) {
          var td = document.createElement('td');
          td.textContent = row[header] == null ? "" : row[header];
          tableRow.appendChild(td);
        });
  
        table.appendChild(tableRow);
      });
    }
  
  window.toDataTable = toDataTable;
  window.renderDataTable = renderDataTable; //Exposes to global scope
  
  })();