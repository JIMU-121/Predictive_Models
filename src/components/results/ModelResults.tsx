import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { ModelResult } from '../../types';

interface ModelResultsProps {
  result: ModelResult | null;
  analysisType: 'property' | 'churn' | 'disease';
}

const ModelResults: React.FC<ModelResultsProps> = ({ result, analysisType }) => {
  if (!result) return null;

  const isRegression = analysisType === 'property';
  const metrics = result.metrics;

  // Prepare feature importance data for chart
  const featureImportanceData = result.featureImportance
    ? Object.entries(result.featureImportance)
        .map(([feature, importance]) => ({
          feature,
          importance: parseFloat(importance.toFixed(4)),
        }))
        .sort((a, b) => b.importance - a.importance)
        .slice(0, 10) // Top 10 features
    : [];

  return (
    <div className="space-y-6 animate-slide-up">
      <Card>
        <CardHeader>
          <CardTitle>Model Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {isRegression ? (
              // Regression metrics
              <>
                <MetricCard
                  label="R² Score"
                  value={metrics.r2 ? metrics.r2.toFixed(4) : 'N/A'}
                  description="Coefficient of determination"
                  good={metrics.r2 && metrics.r2 > 0.7}
                />
                <MetricCard
                  label="MSE"
                  value={metrics.mse ? metrics.mse.toFixed(4) : 'N/A'}
                  description="Mean Squared Error"
                  good={false}
                  inverse
                />
                <MetricCard
                  label="RMSE"
                  value={metrics.rmse ? metrics.rmse.toFixed(4) : 'N/A'}
                  description="Root Mean Squared Error"
                  good={false}
                  inverse
                />
              </>
            ) : (
              // Classification metrics
              <>
                <MetricCard
                  label="Accuracy"
                  value={metrics.accuracy ? (metrics.accuracy * 100).toFixed(2) + '%' : 'N/A'}
                  description="Overall accuracy"
                  good={metrics.accuracy && metrics.accuracy > 0.8}
                />
                <MetricCard
                  label="Precision"
                  value={metrics.precision ? (metrics.precision * 100).toFixed(2) + '%' : 'N/A'}
                  description="Positive predictive value"
                  good={metrics.precision && metrics.precision > 0.8}
                />
                <MetricCard
                  label="Recall"
                  value={metrics.recall ? (metrics.recall * 100).toFixed(2) + '%' : 'N/A'}
                  description="Sensitivity"
                  good={metrics.recall && metrics.recall > 0.8}
                />
                <MetricCard
                  label="F1 Score"
                  value={metrics.f1Score ? (metrics.f1Score * 100).toFixed(2) + '%' : 'N/A'}
                  description="Harmonic mean of precision and recall"
                  good={metrics.f1Score && metrics.f1Score > 0.8}
                />
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {featureImportanceData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Feature Importance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={featureImportanceData}
                  layout="vertical"
                  margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 'dataMax']} />
                  <YAxis
                    dataKey="feature"
                    type="category"
                    width={90}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    formatter={(value: any) => [`${value}`, 'Importance']}
                    labelFormatter={(label) => `Feature: ${label}`}
                  />
                  <Bar dataKey="importance" name="Importance">
                    {featureImportanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`rgb(${30 + index * 20}, ${144 - index * 10}, ${255}`} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {!isRegression && result.confusionMatrix && (
        <Card>
          <CardHeader>
            <CardTitle>Confusion Matrix</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center mt-4">
              <div className="inline-block">
                <div className="grid grid-cols-2 gap-px bg-gray-300">
                  <div className="bg-white p-4 text-center">
                    <div className="font-medium">True Negative</div>
                    <div className="text-2xl mt-2 font-bold text-primary-600">
                      {result.confusionMatrix[0][0]}
                    </div>
                  </div>
                  <div className="bg-white p-4 text-center">
                    <div className="font-medium">False Positive</div>
                    <div className="text-2xl mt-2 font-bold text-warning-600">
                      {result.confusionMatrix[0][1]}
                    </div>
                  </div>
                  <div className="bg-white p-4 text-center">
                    <div className="font-medium">False Negative</div>
                    <div className="text-2xl mt-2 font-bold text-warning-600">
                      {result.confusionMatrix[1][0]}
                    </div>
                  </div>
                  <div className="bg-white p-4 text-center">
                    <div className="font-medium">True Positive</div>
                    <div className="text-2xl mt-2 font-bold text-primary-600">
                      {result.confusionMatrix[1][1]}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 mt-2 text-center text-sm text-gray-500">
                  <div>Predicted Negative</div>
                  <div>Predicted Positive</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

interface MetricCardProps {
  label: string;
  value: string | number;
  description: string;
  good: boolean;
  inverse?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({ label, value, description, good, inverse = false }) => {
  let colorClass = 'text-gray-700';
  
  if (value !== 'N/A') {
    if (inverse) {
      colorClass = good ? 'text-success-600' : 'text-error-600';
    } else {
      colorClass = good ? 'text-success-600' : 'text-warning-600';
    }
  }
  
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className={`text-2xl font-bold mt-1 ${colorClass}`}>{value}</p>
      <p className="text-xs text-gray-500 mt-1">{description}</p>
    </div>
  );
};

export default ModelResults;