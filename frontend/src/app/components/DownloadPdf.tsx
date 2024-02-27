"use client";
import React from 'react';
import jsPDF from 'jspdf';

const DownloadPdf = () => {
  const downloadPdf = () => {
    const doc = new jsPDF();
    const text = document.getElementById('text-to-download')?.innerText;
    doc.text(text || '', 10, 10);
    doc.save('download.pdf');
  };

  return <button className='btn btn-outline ' onClick={downloadPdf}>Download as PDF</button>;
};

export default DownloadPdf;
