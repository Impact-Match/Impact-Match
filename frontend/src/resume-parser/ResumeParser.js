import React, { useState, useEffect } from 'react';
import { Document, Page } from 'react-pdf';
import { useDropzone } from 'react-dropzone';
import { pdfjs } from 'react-pdf';
import { AiOutlineZoomIn, AiOutlineZoomOut, AiOutlinePrinter, AiOutlineFileText, AiOutlineArrowLeft, AiOutlineArrowRight } from 'react-icons/ai';
import { ResumeTable } from './ResumeTable';
import { parseResume } from './ParsePDF';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Set workerSrc for the local pdf.worker.js file
pdfjs.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/pdf.worker.min.js`;

const ResumeParser = () => {
  const [file, setFile] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);  // Current page number
  const [scale, setScale] = useState(1.0);          // Zoom scale for PDF
  const [fileInfo, setFileInfo] = useState({});     // PDF file properties
  const [showProperties, setShowProperties] = useState(false); // Show/hide file properties popup
  const [containerWidth, setContainerWidth] = useState(0);      // Container width for PDF
  const [resumeData, setResumeData] = useState(null); // State to hold parsed resume data

  // Handle successful PDF document load
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPageNumber(1); // Reset to page 1 when a new file is loaded
    // Update file information
    if (file) {
      setFileInfo({
        name: file.name,
        size: (file.size / 1024).toFixed(2) + ' KB',
        type: file.type,
        lastModified: new Date(file.lastModified).toLocaleDateString(),
      });
    }
  };

  // Zoom in
  const zoomIn = () => {
    setScale((prevScale) => prevScale + 0.2);
  };

  // Zoom out
  const zoomOut = () => {
    setScale((prevScale) => Math.max(prevScale - 0.2, 0.5)); // Minimum zoom is 0.5
  };

  // Handle printing the PDF
  const handlePrint = () => {
    window.print();
  };

  // Next page
  const nextPage = () => {
    setPageNumber((prevPageNumber) => Math.min(prevPageNumber + 1, numPages));
  };

  // Previous page
  const prevPage = () => {
    setPageNumber((prevPageNumber) => Math.max(prevPageNumber - 1, 1));
  };

  // Use react-dropzone for drag and drop file upload
  const { getRootProps, getInputProps } = useDropzone({
    accept: 'application/pdf',
    onDrop: async (acceptedFiles) => {
      setFile(acceptedFiles[0]);

      // 解析简历数据
      const parsedResume = await parseResume(acceptedFiles[0]);
      setResumeData(parsedResume);  // 将解析后的数据保存到状态中
    }
  });

  // Toggle the file properties popup
  const toggleProperties = () => {
    setShowProperties(!showProperties);
  };

  // Dynamically adjust PDF container width based on the toolbar width
  useEffect(() => {
    const handleResize = () => {
      const toolbarWidth = document.querySelector('.toolbar')?.offsetWidth || 0;
      setContainerWidth(toolbarWidth); // Set PDF container width to match the toolbar
    };

    // Set initial width on load
    handleResize();

    // Recalculate width on window resize
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="flex h-screen">
      {/* Left side for PDF preview */}
      <div className="w-1/2 bg-white shadow-lg p-6 flex flex-col items-center" style={{ height: '100vh' }}>
        <h2 className="text-2xl font-semibold mb-4">Resume Preview</h2>

        {/* PDF toolbar */}
        <div className="toolbar bg-darkBlue text-white flex justify-center py-2 mb-4 space-x-6 w-full">
          {/* Page information display */}
          <div className="flex items-center space-x-1 text-lg" title="Page Info">
            <span>{pageNumber} / {numPages} pages</span>
          </div>

          <button onClick={prevPage} disabled={pageNumber <= 1} className="text-2xl" title="Previous Page">
            <AiOutlineArrowLeft />
          </button>
          <button onClick={nextPage} disabled={pageNumber >= numPages} className="text-2xl" title="Next Page">
            <AiOutlineArrowRight />
          </button>
          <button onClick={zoomOut} className="text-2xl" title="Zoom Out">
            <AiOutlineZoomOut />
          </button>
          <button onClick={zoomIn} className="text-2xl" title="Zoom In">
            <AiOutlineZoomIn />
          </button>
          <button onClick={handlePrint} className="text-2xl" title="Print">
            <AiOutlinePrinter />
          </button>

          <button onClick={toggleProperties} className="text-2xl" title="Document Properties">
            <AiOutlineFileText />
          </button>
        </div>

        {/* PDF preview section */}
        <div className="w-full flex justify-center" style={{ flex: '1', overflow: 'auto' }}>
          <div className="overflow-auto border" style={{ height: '100%' }}>
            {file ? (
              <Document
                file={file}
                onLoadSuccess={onDocumentLoadSuccess}
                loading="Loading PDF..."
              >
                <Page
                  pageNumber={pageNumber}
                  scale={scale}  // Set zoom scale
                  width={containerWidth} // Set PDF width to match toolbar
                />
              </Document>
            ) : (
              <p className="text-gray-500 text-center">Upload a PDF to preview here</p>
            )}
          </div>
        </div>
      </div>

      {/* Right side for drag-and-drop and resume table */}
      <div className="w-1/2 p-4 flex flex-col items-center overflow-auto" style={{ height: '150vh' }}>
        {/* Drag and drop area, positioned at the top-right */}
        <div {...getRootProps({ className: 'dropzone' })} className="min-h-[100px] border-dashed border-4 border-gray-300 w-full flex items-center justify-center cursor-pointer">
            <input {...getInputProps()} />
            <p className="text-gray-500 text-center">Drag & drop a PDF file here, or click to select one</p>
        </div>

        {/* Resume table, positioned below the drag-and-drop area */}
        <div className="mt-6 w-full">
          {resumeData ? (
            <ResumeTable resume={resumeData} />
          ) : (
            <p className="text-gray-500 text-center">No resume data to display</p>
          )}
        </div>
      </div>

      {/* File properties popup */}
      {showProperties && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-semibold mb-4">Document Properties</h3>
            <ul className="list-disc list-inside">
              <li><strong>File Name:</strong> {fileInfo.name}</li>
              <li><strong>File Size:</strong> {fileInfo.size}</li>
              <li><strong>File Type:</strong> {fileInfo.type}</li>
              <li><strong>Last Modified:</strong> {fileInfo.lastModified}</li>
              <li><strong>Total Pages:</strong> {numPages}</li>
            </ul>
            <button onClick={toggleProperties} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeParser;