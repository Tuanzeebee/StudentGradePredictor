import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UploadFile: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showChartButton, setShowChartButton] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setMessage('');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage('Vui lòng chọn file để upload');
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://localhost:3000/scores/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setMessage('Upload thành công!');
        setFile(null);
        setShowChartButton(true);
        // Reset file input
        const fileInput = document.getElementById('file-input') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      } else {
        setMessage('Upload thất bại. Vui lòng thử lại!');
        setShowChartButton(false);
      }
          } catch (error) {
        setMessage('Có lỗi xảy ra khi upload file');
        setShowChartButton(false);
      } finally {
        setIsLoading(false);
      }
  };

  return (
    <div style={{ 
      textAlign: 'center', 
      padding: '30px',
      border: '2px dashed #ccc',
      borderRadius: '10px',
      margin: '20px 0'
    }}>
      <h3>Upload File CSV</h3>
      
      {message && (
        <div style={{
          padding: '10px',
          margin: '10px 0',
          borderRadius: '5px',
          backgroundColor: message.includes('thành công') ? '#d4edda' : '#f8d7da',
          color: message.includes('thành công') ? '#155724' : '#721c24',
          border: `1px solid ${message.includes('thành công') ? '#c3e6cb' : '#f5c6cb'}`
        }}>
          {message}
        </div>
      )}

      <div style={{ marginBottom: '20px' }}>
        <input
          id="file-input"
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          style={{ 
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '5px',
            width: '300px'
          }}
        />
      </div>

      {file && (
        <div style={{ marginBottom: '20px' }}>
          <p>File đã chọn: <strong>{file.name}</strong></p>
          <p>Kích thước: {(file.size / 1024).toFixed(2)} KB</p>
        </div>
      )}

              <button
          onClick={handleUpload}
          disabled={!file || isLoading}
          style={{
            padding: '12px 30px',
            fontSize: '16px',
            backgroundColor: !file || isLoading ? '#6c757d' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: !file || isLoading ? 'not-allowed' : 'pointer',
            opacity: !file || isLoading ? 0.6 : 1,
            margin: '0 10px'
          }}
        >
          {isLoading ? 'Đang upload...' : 'Upload File'}
        </button>

        {showChartButton && (
          <button
            onClick={() => navigate('/score-chart')}
            style={{
              padding: '12px 30px',
              fontSize: '16px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              margin: '0 10px',
              animation: 'fadeIn 0.5s ease-in'
            }}
          >
            Xem Biểu Đồ Điểm
          </button>
        )}
    </div>
  );
};

export default UploadFile; 