import Papa from 'papaparse';
import { FileData, DataSummary } from '../types';

export const parseCSV = (file: File): Promise<FileData> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const columns = results.meta.fields || [];
        resolve({
          filename: file.name,
          data: results.data,
          columns,
          summary: generateDataSummary(results.data, columns),
        });
      },
      error: (error: Error) => {
        reject(error);
      },
    });
  });
};

export const generateDataSummary = (data: any[], columns: string[]): DataSummary => {
  // Count missing values per column
  const missingValues: Record<string, number> = {};
  const numericColumns: string[] = [];
  const categoricalColumns: string[] = [];

  // Analyze columns
  columns.forEach((col) => {
    missingValues[col] = 0;
    let isNumeric = true;

    // Check first 10 rows (or all if less) to determine column type
    const sampleSize = Math.min(10, data.length);
    for (let i = 0; i < sampleSize; i++) {
      if (data[i][col] === undefined || data[i][col] === null || data[i][col] === '') {
        missingValues[col]++;
      } else if (isNumeric) {
        // Try to convert to number
        const num = Number(data[i][col]);
        if (isNaN(num)) {
          isNumeric = false;
        }
      }
    }

    // Classify column
    if (isNumeric) {
      numericColumns.push(col);
    } else {
      categoricalColumns.push(col);
    }
  });

  return {
    rowCount: data.length,
    columnCount: columns.length,
    missingValues,
    numericColumns,
    categoricalColumns,
  };
};

export const calculateStatistics = (data: any[], column: string) => {
  // Filter out non-numeric values and convert to numbers
  const values = data
    .map((row) => row[column])
    .filter((val) => val !== undefined && val !== null && val !== '')
    .map((val) => Number(val))
    .filter((val) => !isNaN(val));

  if (values.length === 0) return null;

  // Sort values for percentile calculations
  values.sort((a, b) => a - b);

  // Calculate statistics
  const sum = values.reduce((acc, val) => acc + val, 0);
  const mean = sum / values.length;
  
  // Calculate standard deviation
  const squaredDiffs = values.map((val) => Math.pow(val - mean, 2));
  const variance = squaredDiffs.reduce((acc, val) => acc + val, 0) / values.length;
  const stdDev = Math.sqrt(variance);

  return {
    count: values.length,
    min: values[0],
    max: values[values.length - 1],
    mean,
    median: values[Math.floor(values.length / 2)],
    stdDev,
    q1: values[Math.floor(values.length * 0.25)],
    q3: values[Math.floor(values.length * 0.75)],
  };
};

export const categoricalDistribution = (data: any[], column: string) => {
  const distribution: Record<string, number> = {};

  data.forEach((row) => {
    const value = row[column];
    if (value !== undefined && value !== null && value !== '') {
      distribution[value] = (distribution[value] || 0) + 1;
    }
  });

  return distribution;
};

export const mockTrainModel = (
  data: any[],
  targetColumn: string,
  featureColumns: string[],
  modelType: string,
  testSize: number = 0.2
) => {
  // This is a mock implementation that simulates model training
  // In a real application, this would be done on a backend server

  // Simulate some processing time
  return new Promise<any>((resolve) => {
    setTimeout(() => {
      // Generate mock results based on the model type
      if (targetColumn.toLowerCase().includes('price') || targetColumn.toLowerCase().includes('value')) {
        // Regression metrics
        resolve({
          metrics: {
            mse: Math.random() * 100,
            rmse: Math.random() * 10,
            r2: 0.5 + Math.random() * 0.4,
          },
          featureImportance: featureColumns.reduce((acc, feature) => {
            acc[feature] = Math.random();
            return acc;
          }, {} as Record<string, number>),
        });
      } else {
        // Classification metrics
        resolve({
          metrics: {
            accuracy: 0.7 + Math.random() * 0.25,
            precision: 0.7 + Math.random() * 0.25,
            recall: 0.7 + Math.random() * 0.25,
            f1Score: 0.7 + Math.random() * 0.25,
          },
          featureImportance: featureColumns.reduce((acc, feature) => {
            acc[feature] = Math.random();
            return acc;
          }, {} as Record<string, number>),
          confusionMatrix: [
            [Math.floor(Math.random() * 100), Math.floor(Math.random() * 30)],
            [Math.floor(Math.random() * 30), Math.floor(Math.random() * 100)],
          ],
        });
      }
    }, 1500);
  });
};