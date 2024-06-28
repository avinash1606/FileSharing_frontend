import { useRef, useState, useEffect } from 'react';
import './App.css';
import { upLoadFile } from './services/api';

function App() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [fileSize, setFileSize] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [downloadLink, setDownloadLink] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [offlineMode, setOfflineMode] = useState(false); // State to track offline mode

  const fileInputRef = useRef();

  const onUploadClick = () => {
    fileInputRef.current.click();
  };

  useEffect(() => {
    const uploadFile = async () => {
      if (file) {
        const data = new FormData();
        data.append("name", file.name);
        data.append("file", file);

        try {
          let response = await upLoadFile(data, setUploadProgress);
          setDownloadLink(response.path);
        } catch (error) {
          console.error("Error uploading file:", error);
          setOfflineMode(true); // Set offline mode if upload fails
        }
      }
    };
    uploadFile();
  }, [file]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setFileName(selectedFile.name);
    setFileSize((selectedFile.size / (1024 * 1024)).toFixed(2)); // Convert size to MB
    setFileType(selectedFile.type);
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(downloadLink);
    alert("Link copied to clipboard!");
  };

  return (
    <div className="App">
      <div className='wrapper'>
        <h1>Simple File Sharing</h1>
        <p>Upload and share the download link</p>

        {offlineMode ? (
          <p style={{ color: 'red' }}>You are currently offline. Please check your internet connection.</p>
        ) : (
          <>
            <input
              type='file'
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />

            <button onClick={onUploadClick}>Upload</button>

            {uploadProgress > 0 && (
              <div className="progress-bar">
                <div className="progress" style={{ width: `${uploadProgress}%` }}> {uploadProgress}%</div>
              </div>
            )}

            {file && (
              <div className="file-info">
                <p>File Name: {fileName}</p>
                <p>File Size: {fileSize} MB</p>
                <p>File Type: {fileType}</p>
              </div>
            )}

            {downloadLink && (
              <div className="result">
                <a href={downloadLink} target="_blank" rel="noopener noreferrer">{downloadLink}</a>
                <button onClick={handleCopyToClipboard}>Copy to Clipboard</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
