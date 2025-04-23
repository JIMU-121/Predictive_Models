import React from 'react';
import { FileData } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

interface DataSummaryProps {
  fileData: FileData | null;
}

const DataSummary: React.FC<DataSummaryProps> = ({ fileData }) => {
  if (!fileData || !fileData.summary) return null;

  const { summary } = fileData;

  // Check if there are missing values
  const hasMissingValues = Object.values(summary.missingValues).some((count) => count > 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle>Dataset Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-500">Rows</p>
              <p className="text-2xl font-bold text-gray-900">{summary.rowCount}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-500">Columns</p>
              <p className="text-2xl font-bold text-gray-900">{summary.columnCount}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-500">Missing Values</p>
              <p className={`text-2xl font-bold ${hasMissingValues ? 'text-warning-600' : 'text-success-600'}`}>
                {hasMissingValues ? 'Present' : 'None'}
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Numeric Columns ({summary.numericColumns.length})</h4>
              <div className="bg-gray-50 p-3 rounded-lg max-h-40 overflow-y-auto">
                <ul className="space-y-1">
                  {summary.numericColumns.map((col) => (
                    <li key={col} className="text-sm text-gray-700">
                      {col}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Categorical Columns ({summary.categoricalColumns.length})</h4>
              <div className="bg-gray-50 p-3 rounded-lg max-h-40 overflow-y-auto">
                <ul className="space-y-1">
                  {summary.categoricalColumns.map((col) => (
                    <li key={col} className="text-sm text-gray-700">
                      {col}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {hasMissingValues && (
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Missing Values</h4>
              <div className="bg-gray-50 p-3 rounded-lg max-h-40 overflow-y-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr>
                      <th className="text-left font-medium text-gray-500">Column</th>
                      <th className="text-right font-medium text-gray-500">Missing</th>
                      <th className="text-right font-medium text-gray-500">Percentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(summary.missingValues)
                      .filter(([_, count]) => count > 0)
                      .sort(([_, a], [__, b]) => b - a)
                      .map(([column, count]) => (
                        <tr key={column}>
                          <td className="py-1 text-gray-700">{column}</td>
                          <td className="py-1 text-right text-gray-700">{count}</td>
                          <td className="py-1 text-right text-gray-700">
                            {((count / summary.rowCount) * 100).toFixed(2)}%
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DataSummary;