import React, { useState } from 'react';
import Button from '../ui/Button';
import { FileData, ModelParams, AnalysisType } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

interface ModelFormProps {
  analysisType: AnalysisType;
  fileData: FileData;
  onSubmit: (targetVariable: string, features: string[], params: ModelParams) => void;
  isLoading: boolean;
}

const ModelForm: React.FC<ModelFormProps> = ({
  analysisType,
  fileData,
  onSubmit,
  isLoading,
}) => {
  const [targetVariable, setTargetVariable] = useState<string>('');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [testSize, setTestSize] = useState<number>(0.2);
  const [algorithm, setAlgorithm] = useState<string>('linear_regression');
  const [randomState, setRandomState] = useState<number>(42);

  const columnsWithoutTarget = targetVariable
    ? fileData.columns.filter((col) => col !== targetVariable)
    : fileData.columns;

  const toggleFeature = (feature: string) => {
    if (selectedFeatures.includes(feature)) {
      setSelectedFeatures(selectedFeatures.filter((f) => f !== feature));
    } else {
      setSelectedFeatures([...selectedFeatures, feature]);
    }
  };

  const selectAllFeatures = () => {
    setSelectedFeatures(columnsWithoutTarget);
  };

  const deselectAllFeatures = () => {
    setSelectedFeatures([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const params: ModelParams = {
      algorithm,
      testSize,
      randomState,
    };
    
    onSubmit(targetVariable, selectedFeatures, params);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configure Model</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="targetVariable" className="block text-sm font-medium text-gray-700 mb-1">
              Target Variable
            </label>
            <select
              id="targetVariable"
              value={targetVariable}
              onChange={(e) => setTargetVariable(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              required
            >
              <option value="">Select target variable</option>
              {fileData.columns.map((column) => (
                <option key={column} value={column}>
                  {column}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700">
                Select Features
              </label>
              <div className="space-x-2">
                <button
                  type="button"
                  onClick={selectAllFeatures}
                  className="text-xs text-primary-600 hover:text-primary-700"
                >
                  Select All
                </button>
                <button
                  type="button"
                  onClick={deselectAllFeatures}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  Deselect All
                </button>
              </div>
            </div>
            <div className="max-h-48 overflow-y-auto border border-gray-300 rounded-md p-2 bg-white">
              {columnsWithoutTarget.length === 0 ? (
                <p className="text-sm text-gray-500 p-2">Select a target variable first</p>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {columnsWithoutTarget.map((feature) => (
                    <div key={feature} className="flex items-center">
                      <input
                        id={`feature-${feature}`}
                        type="checkbox"
                        checked={selectedFeatures.includes(feature)}
                        onChange={() => toggleFeature(feature)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor={`feature-${feature}`}
                        className="ml-2 block text-sm text-gray-700 truncate"
                      >
                        {feature}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {selectedFeatures.length > 0 && (
              <p className="mt-1 text-xs text-gray-500">
                {selectedFeatures.length} features selected
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="algorithm" className="block text-sm font-medium text-gray-700 mb-1">
                Algorithm
              </label>
              <select
                id="algorithm"
                value={algorithm}
                onChange={(e) => setAlgorithm(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              >
                {analysisType === 'property' && (
                  <>
                    <option value="linear_regression">Linear Regression</option>
                    <option value="multiple_regression">Multiple Regression</option>
                  </>
                )}
                {analysisType === 'churn' && (
                  <>
                    <option value="logistic_regression">Logistic Regression</option>
                    <option value="decision_tree">Decision Tree</option>
                    <option value="random_forest">Random Forest</option>
                  </>
                )}
                {analysisType === 'disease' && (
                  <>
                    <option value="logistic_regression">Logistic Regression</option>
                    <option value="decision_tree">Decision Tree</option>
                    <option value="random_forest">Random Forest</option>
                    <option value="svm">Support Vector Machine</option>
                  </>
                )}
              </select>
            </div>

            <div>
              <label htmlFor="testSize" className="block text-sm font-medium text-gray-700 mb-1">
                Test Size ({(testSize * 100).toFixed(0)}%)
              </label>
              <input
                id="testSize"
                type="range"
                min="0.1"
                max="0.5"
                step="0.05"
                value={testSize}
                onChange={(e) => setTestSize(parseFloat(e.target.value))}
                className="block w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>10%</span>
                <span>50%</span>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="randomState" className="block text-sm font-medium text-gray-700 mb-1">
              Random State
            </label>
            <input
              id="randomState"
              type="number"
              min="1"
              max="100"
              value={randomState}
              onChange={(e) => setRandomState(parseInt(e.target.value, 10))}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              className="w-full"
              isLoading={isLoading}
              disabled={!targetVariable || selectedFeatures.length === 0 || isLoading}
            >
              Train Model
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ModelForm;