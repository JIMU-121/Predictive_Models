import React, { useState } from 'react';
import FileUpload from '../components/data/FileUpload';
import DataSummary from '../components/data/DataSummary';
import DataPreview from '../components/data/DataPreview';
import ModelForm from '../components/models/ModelForm';
import ModelResults from '../components/results/ModelResults';
import { FileData, ModelParams, ModelResult } from '../types';
import { mockTrainModel } from '../utils/dataUtils';

const PropertyPricePrediction: React.FC = () => {
  const [fileData, setFileData] = useState<FileData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [modelResult, setModelResult] = useState<ModelResult | null>(null);

  const handleFileUpload = (data: FileData) => {
    setFileData(data);
    setModelResult(null);
  };

  const handleClearFile = () => {
    setFileData(null);
    setModelResult(null);
  };

  const handleTrainModel = async (
    targetVariable: string,
    features: string[],
    params: ModelParams
  ) => {
    if (!fileData) return;

    setIsLoading(true);
    try {
      const result = await mockTrainModel(
        fileData.data,
        targetVariable,
        features,
        params.algorithm,
        params.testSize
      );
      setModelResult(result);
    } catch (error) {
      console.error('Error training model:', error);
      alert('An error occurred while training the model.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-xl font-semibold text-gray-900 mb-4">Step 1: Upload Data</h1>
        <FileUpload
          onFileUpload={handleFileUpload}
          isLoading={isLoading}
          currentFile={fileData ? { name: fileData.filename } : null}
          onClearFile={handleClearFile}
        />
      </div>

      {fileData && (
        <>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-xl font-semibold text-gray-900 mb-4">Step 2: Explore Data</h1>
            <div className="space-y-6">
              <DataSummary fileData={fileData} />
              <DataPreview fileData={fileData} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h1 className="text-xl font-semibold text-gray-900 mb-4">Step 3: Configure Model</h1>
                <ModelForm
                  analysisType="property"
                  fileData={fileData}
                  onSubmit={handleTrainModel}
                  isLoading={isLoading}
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h1 className="text-xl font-semibold text-gray-900 mb-4">Step 4: Results</h1>
                {modelResult ? (
                  <ModelResults result={modelResult} analysisType="property" />
                ) : (
                  <div className="text-center p-8">
                    <p className="text-gray-500">Configure and train a model to see results</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PropertyPricePrediction;