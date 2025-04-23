import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, FileText } from 'lucide-react';
import Button from '../ui/Button';
import { parseCSV } from '../../utils/dataUtils';
import { twMerge } from 'tailwind-merge';
import * as XLSX from 'xlsx';

interface FileUploadProps {
  onFileUpload: (fileData: any) => void;
  isLoading: boolean;
  currentFile: { name: string } | null;
  onClearFile: () => void;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileUpload,
  isLoading,
  currentFile,
  onClearFile,
}) => {
  const handleExcelFile = async (file: File) => {
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      
      if (jsonData.length === 0) {
        throw new Error('No data found in Excel file');
      }

      const columns = Object.keys(jsonData[0]);
      return {
        filename: file.name,
        data: jsonData,
        columns,
      };
    } catch (error) {
      console.error('Error parsing Excel file:', error);
      throw new Error('Failed to parse Excel file');
    }
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;
      
      try {
        const file = acceptedFiles[0];
        let fileData;

        if (file.name.toLowerCase().endsWith('.csv')) {
          fileData = await parseCSV(file);
        } else if (file.name.toLowerCase().match(/\.(xlsx|xls)$/)) {
          fileData = await handleExcelFile(file);
        } else {
          throw new Error('Unsupported file format');
        }

        onFileUpload(fileData);
      } catch (error) {
        console.error('Error parsing file:', error);
        alert('Failed to parse file. Please ensure it is a valid CSV or Excel format.');
      }
    },
    [onFileUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
    },
    maxFiles: 1,
    disabled: isLoading || !!currentFile,
  });

  return (
    <div className="space-y-4">
      {!currentFile ? (
        <div
          {...getRootProps()}
          className={twMerge(
            'border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ease-in-out',
            isDragActive
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50',
            (isLoading || !!currentFile) && 'opacity-60 cursor-not-allowed'
          )}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="p-3 bg-primary-50 rounded-full">
              <Upload className="h-8 w-8 text-primary-600" />
            </div>
            <div className="text-center">
              <p className="text-base font-medium text-gray-900">
                {isDragActive ? 'Drop the file here' : 'Drag & drop your file here'}
              </p>
              <p className="mt-1 text-sm text-gray-500">or click to browse files</p>
            </div>
            <p className="text-xs text-gray-400">
              Accepts CSV and Excel files (.csv, .xlsx, .xls)
            </p>
          </div>
        </div>
      ) : (
        <div className="border rounded-lg p-4 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary-50 rounded-full">
                <FileText className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{currentFile.name}</p>
                <p className="text-sm text-gray-500">File loaded successfully</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              className="text-gray-500"
              onClick={onClearFile}
              disabled={isLoading}
            >
              <X size={18} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;