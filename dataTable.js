/*
  dataTable.js
  A small "data object" for CSV data + transformative functions.

  Usage (after parsing):
    const dt = new DataTable(headers, rows, meta);
    const only = dt.select(["Epoch Time", "Voltage"]);
*/
(function (global) {
    'use strict';
  
    function DataTable(headers, rows, meta) {
      this.headers = Array.isArray(headers) ? headers.slice() : [];
      this.rows = Array.isArray(rows) ? rows.slice() : [];
      this.meta = meta || {};
    }
  
    // --- Transformative functions (return NEW DataTables unless noted) ---
  
    // Keep only certain columns
    DataTable.prototype.select = function (cols) {
      var columns = (cols || []).slice();
      var newRows = this.rows.map(function (r) {
        var obj = {};
        for (var i = 0; i < columns.length; i++) obj[columns[i]] = r[columns[i]];
        return obj;
      });
      return new DataTable(columns, newRows, this.meta);
    };
  
    // export
    global.DataTable = DataTable;
  })(typeof window !== 'undefined' ? window : this);
  
  // test
  (function () {
    var headers = ["A", "B", "C"];
    var rows = [
      { A: "1", B: "2", C: "3" },
      { A: "4", B: "5", C: "6" }
    ];
  
    var dt = new DataTable(headers, rows, { source: "unit-test" });
    var onlyAB = dt.select(["A", "B"]);
  
    console.assert(onlyAB.headers.length === 2, "Expected 2 headers");
    console.assert(onlyAB.headers[0] === "A" && onlyAB.headers[1] === "B", "Headers should be A,B");
    console.assert(Object.keys(onlyAB.rows[0]).length === 2, "Row should have 2 keys");
    console.assert(onlyAB.rows[0].A === "1" && onlyAB.rows[0].B === "2", "Row values should match");
    console.assert(onlyAB.rows[0].C === undefined, "C should be removed");
  
    // also verify original dt not changed
    console.assert(dt.headers.length === 3, "Original headers unchanged");
    console.log("DataTable.select() unit test passed", { dt, onlyAB });
  })();