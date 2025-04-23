export type AnalysisType = 'property' | 'churn' | 'disease';

export interface ModelParams {
  algorithm: string;
  testSize: number;
  randomState: number;
  [key: string]: any;
}

export interface FileData {
  filename: string;
  data: PropertyData[] | ChurnData[] | DiseaseData[];
  columns: string[];
  summary?: DataSummary;
}

export interface DataSummary {
  rowCount: number;
  columnCount: number;
  missingValues: Record<string, number>;
  numericColumns: string[];
  categoricalColumns: string[];
}

export interface ModelResult {
  metrics: {
    accuracy?: number;
    precision?: number;
    recall?: number;
    f1Score?: number;
    mse?: number;
    rmse?: number;
    r2?: number;
    [key: string]: any;
  };
  featureImportance?: Record<string, number>;
  predictions?: any[];
  confusionMatrix?: number[][];
}

// Property Price Prediction Data Types
export interface PropertyData {
  longitude: number;
  latitude: number;
  housing_median_age: number;
  total_rooms: number;
  total_bedrooms: number;
  population: number;
  households: number;
  median_income: number;
  median_house_value: number;
  ocean_proximity: string;
}

export interface PropertyModelConfig {
  targetVariable: string;
  features: string[];
  modelType: 'simple' | 'multiple';
}

// Customer Churn Data Types
export interface ChurnData {
  customerID: string;
  gender: string;
  SeniorCitizen: 0 | 1;
  Partner: 'Yes' | 'No';
  Dependents: 'Yes' | 'No';
  tenure: number;
  PhoneService: 'Yes' | 'No';
  MultipleLines: 'Yes' | 'No';
  InternetService: 'DSL' | 'Fiber optic' | 'No';
  OnlineSecurity: 'Yes' | 'No';
  OnlineBackup: 'Yes' | 'No';
  DeviceProtection: 'Yes' | 'No';
  TechSupport: 'Yes' | 'No';
  StreamingTV: 'Yes' | 'No';
  StreamingMovies: 'Yes' | 'No';
  Contract: 'Month-to-month' | 'One year' | 'Two year';
  PaperlessBilling: 'Yes' | 'No';
  PaymentMethod: string;
  MonthlyCharges: number;
  TotalCharges: number;
  Churn: 'Yes' | 'No';
}

export interface ChurnModelConfig {
  targetVariable: string;
  features: string[];
  modelType: string;
}

// Disease Detection Data Types
export interface DiseaseData {
  date: string;
  country: string;
  id: number;
  active: 0 | 1;
  age: number;
  alco: 0 | 1;
  ap_hi: number;
  ap_lo: number;
  cholesterol: number;
  gender: string;
  gluc: number;
  height: number;
  occupation: string;
  smoke: 0 | 1;
  weight: number;
  disease: 0 | 1;
}

export interface DiseaseModelConfig {
  targetVariable: string;
  features: string[];
  modelType: string;
}