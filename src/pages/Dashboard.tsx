import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Users, Heart, BarChart4, Database, Code as Model } from 'lucide-react';

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Data Science Dashboard</h1>
        <p className="mt-2 text-gray-600 max-w-3xl">
          Upload your CSV data and analyze it using a variety of models for property price prediction, 
          customer churn analysis, and heart disease detection.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AnalysisCard
          to="/property"
          title="Property Price Prediction"
          description="Predict property prices based on features like location, size, and amenities."
          icon={<TrendingUp size={24} />}
          color="bg-primary-600"
          features={[
            "Simple & Multiple Linear Regression",
            "Evaluate with MSE, RMSE, & R² metrics",
            "Feature importance visualization"
          ]}
        />
        
        <AnalysisCard
          to="/churn"
          title="Customer Churn Analysis"
          description="Predict customer churn based on demographics and behavior."
          icon={<Users size={24} />}
          color="bg-secondary-600"
          features={[
            "Logistic Regression & Random Forest",
            "Confusion matrix visualization",
            "Feature importance analysis"
          ]}
        />
        
        <AnalysisCard
          to="/disease"
          title="Heart Disease Detection"
          description="Detect heart disease risk using health indicators and lifestyle factors."
          icon={<Heart size={24} />}
          color="bg-accent-600"
          features={[
            "Multiple classification algorithms",
            "Full evaluation metrics",
            "Risk factor identification"
          ]}
        />
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">How It Works</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StepCard
            number={1}
            title="Upload Data"
            description="Upload your CSV dataset for analysis."
            icon={<Database size={24} />}
          />
          
          <StepCard
            number={2}
            title="Configure Analysis"
            description="Select target variables, features, and algorithm settings."
            icon={<BarChart4 size={24} />}
          />
          
          <StepCard
            number={3}
            title="View Results"
            description="Explore predictions, metrics, and feature importance."
            icon={<Model size={24} />}
          />
        </div>
      </div>
    </div>
  );
};

interface AnalysisCardProps {
  to: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  features: string[];
}

const AnalysisCard: React.FC<AnalysisCardProps> = ({
  to,
  title,
  description,
  icon,
  color,
  features,
}) => {
  return (
    <Link
      to={to}
      className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:transform hover:scale-[1.02] hover:shadow-lg"
    >
      <div className={`${color} p-4 text-white`}>
        {icon}
      </div>
      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="mt-2 text-sm text-gray-600">{description}</p>
        
        <ul className="mt-4 space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <svg
                className="h-5 w-5 text-success-500 mr-2 mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm text-gray-600">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </Link>
  );
};

interface StepCardProps {
  number: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const StepCard: React.FC<StepCardProps> = ({ number, title, description, icon }) => {
  return (
    <div className="flex items-start p-4 bg-gray-50 rounded-lg">
      <div className="bg-primary-100 rounded-full h-10 w-10 flex items-center justify-center text-primary-600 mr-4 flex-shrink-0">
        {number}
      </div>
      <div>
        <div className="flex items-center mb-2">
          <span className="mr-2 text-primary-600">{icon}</span>
          <h3 className="font-medium text-gray-900">{title}</h3>
        </div>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
};

export default Dashboard;