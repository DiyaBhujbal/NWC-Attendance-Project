// import React, { useState, useEffect, useCallback } from 'react';
// import Spreadsheet from 'react-spreadsheet';
// import * as XLSX from 'xlsx';
// import { saveAs } from 'file-saver';
// import './AttendanceSheet.css';
// import Navbar from './Navbar';
// import Sidebar from './Sidebar';

// // Function to generate a fixed grid of empty cells
// const createInitialData = (rows = 20, cols = 31) => {
//   return Array.from({ length: rows }, () => Array.from({ length: cols }, () => ({ value: "" })));
// };

// const AttendanceSheet = () => {
//   const [data, setData] = useState(createInitialData());
//   const [undoStack, setUndoStack] = useState([]);
//   const [redoStack, setRedoStack] = useState([]);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [fileHandle, setFileHandle] = useState(null);
//   const [isDataDirty, setIsDataDirty] = useState(false);
//   const [hour, setHour] = useState('12');
//   const [minute, setMinute] = useState('00');
//   const [period, setPeriod] = useState('AM');
//   useEffect(() => {
//     const handleBeforeUnload = (event) => {
//       if (isDataDirty) {
//         event.preventDefault();
//         event.returnValue = ''; // Some browsers require this to trigger the confirmation dialog
//       }
//     };

//     window.addEventListener('beforeunload', handleBeforeUnload);

//     return () => {
//       window.removeEventListener('beforeunload', handleBeforeUnload);
//     };
//   }, [isDataDirty]);

//   const ensureRows = (newData) => {
//     const requiredRows = createInitialData().length;
//     while (newData.length < requiredRows) {
//       newData.push(new Array(newData[0].length).fill({ value: "" }));
//     }
//   };

//   const ensureColumns = (newData) => {
//     const requiredCols = createInitialData()[0].length;
//     newData.forEach(row => {
//       while (row.length < requiredCols) {
//         row.push({ value: "" });
//       }
//     });
//   };

//   const handleCellChange = (newData) => {
//     setUndoStack(prev => [...prev, JSON.parse(JSON.stringify(data))]);
//     setRedoStack([]);
//     setIsDataDirty(true);

//     ensureRows(newData);
//     ensureColumns(newData);

//     setData(newData);
//   };

//   const undo = () => {
//     if (undoStack.length === 0) return;
//     const previousData = undoStack[undoStack.length - 1];
//     setUndoStack(undoStack.slice(0, -1));
//     setRedoStack(prev => [...prev, JSON.parse(JSON.stringify(data))]);
//     setData(previousData);
//     setIsDataDirty(true);
//   };

//   const redo = () => {
//     if (redoStack.length === 0) return;
//     const nextData = redoStack[redoStack.length - 1];
//     setRedoStack(redoStack.slice(0, -1));
//     setUndoStack(prev => [...prev, JSON.parse(JSON.stringify(data))]);
//     setData(nextData);
//     setIsDataDirty(true);
//   };

//   const downloadExcel = () => {
//     const worksheet = XLSX.utils.aoa_to_sheet(data.map(row => row.map(cell => cell.value)));
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
//     const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
//     const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
//     saveAs(blob, 'spreadsheet.xlsx');
//     setIsDataDirty(false); // Data is no longer dirty after download
//   };

//   const handleImport = async () => {
//     try {
//       const [fileHandle] = await window.showOpenFilePicker({
//         types: [
//           {
//             description: 'Excel Files',
//             accept: { 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'] },
//           },
//         ],
//       });
//       const file = await fileHandle.getFile();
//       const data = await file.arrayBuffer();
//       const workbook = XLSX.read(data, { type: 'array' });
//       const worksheet = workbook.Sheets[workbook.SheetNames[0]];
//       const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
//       const newData = jsonData.map(row => row.map(cell => ({ value: cell })));

//       setData(newData);
//       setFileHandle(fileHandle);
//       setIsDataDirty(true);
//     } catch (error) {
//       console.error('Error during file import:', error);
//     }
//   };

//   const saveToFile = async () => {
//     if (!fileHandle) {
//       alert('No file imported. Please import a file first.');
//       return;
//     }

//     const confirmSave = window.confirm('Do you want to save the changes?');
//     if (!confirmSave) return;

//     try {
//       const dataToExport = data.map(row => row.map(cell => cell ? cell.value : ''));
//       const worksheet = XLSX.utils.aoa_to_sheet(dataToExport);
//       const newWorkbook = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(newWorkbook, worksheet, 'Sheet1');
//       const arrayBuffer = XLSX.write(newWorkbook, { bookType: 'xlsx', type: 'array' });

//       const writable = await fileHandle.createWritable();
//       await writable.write(arrayBuffer);
//       await writable.close();

//       alert('File has been updated successfully.');
//       setIsDataDirty(false); // Data is no longer dirty after saving
//     } catch (error) {
//       if (error.name === 'AbortError') {
//         alert('The file is currently open in another program. Please close it before saving.');
//       } else {
//         console.error('Error during file update:', error);
//         alert('Error during file update.');
//       }
//     }
//   };

//   const toggleSidebar = () => {
//     setIsSidebarOpen(!isSidebarOpen);
//   };

//   return (
//     <div>
//       <Navbar toggleSidebar={toggleSidebar} />
//       <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
//       <h2>Lecture Records</h2>
//       <div className="button-container">
//         <button className="undo" onClick={undo} disabled={undoStack.length === 0}>Undo</button>
//         <button className="redo" onClick={redo} disabled={redoStack.length === 0}>Redo</button>
//         <button className="import" onClick={handleImport}>Import Excel File</button>
//         <button className="download" onClick={downloadExcel}>Download as Excel</button>
//         <button className="save" onClick={saveToFile} disabled={!fileHandle}>Save to Same File</button>
//       </div>
//       <div className="spreadsheet-container">
//         <Spreadsheet data={data} onChange={handleCellChange} />
//       </div>
//     </div>
//   );
// };

// export default AttendanceSheet;
