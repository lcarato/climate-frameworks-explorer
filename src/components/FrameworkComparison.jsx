// src/components/FrameworkComparison.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Download, Info, ArrowLeft } from 'lucide-react';

/**
 * Component to display framework comparison tables
 */
const FrameworkComparison = ({ 
  selectedFrameworks, 
  frameworks, 
  onClose, 
  language,
  t 
}) => {
  const [comparisonData, setComparisonData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [criteriaToShow, setCriteriaToShow] = useState([
    'adaptationDefinition',
    'technicalSpecificity',
    'regulatoryStatus',
    'energyStorageCriteria'
  ]);
  
  const apiBaseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
  
  // Define all available criteria
  const allCriteria = useMemo(() => [
    { key: 'adaptationDefinition', label: t.adaptationDefinition },
    { key: 'technicalSpecificity', label: t.technicalSpecificity },
    { key: 'regulatoryStatus', label: t.regulatoryStatus },
    { key: 'energyStorageCriteria', label: t.energyStorageCriteria },
    { key: 'transportCriteria', label: t.transportCriteria },
    { key: 'buildingCriteria', label: t.buildingCriteria },
    { key: 'waterCriteria', label: t.waterCriteria },
    { key: 'implementationRequirements', label: t.implementationRequirements }
  ], [t]);
  
  useEffect(() => {
    const loadComparisonData = async () => {
      if (selectedFrameworks.length === 0) return;
      
      setIsLoading(true);
      try {
        // Use the optimized API endpoint to get all comparison data at once
        const frameworkIds = selectedFrameworks.join(',');
        const response = await fetch(
          `${apiBaseUrl}/frameworks/compare?ids=${frameworkIds}&lang=${language}`
        );
        
        if (response.ok) {
          const data = await response.json();
          setComparisonData(data);
        } else {
          console.error('Error response from comparison API:', await response.text());
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading comparison data:', error);
        setIsLoading(false);
      }
    };
    
    loadComparisonData();
  }, [selectedFrameworks, language, apiBaseUrl]);
  
  // Download comparison data as CSV
  const downloadCSV = () => {
    let csv = `Criteria,${selectedFrameworks.map(fId => frameworks.find(f => f.id === fId)?.name || fId).join(',')}\n`;
    
    allCriteria.forEach(({ key, label }) => {
      const row = [label];
      
      selectedFrameworks.forEach(frameworkId => {
        let value = comparisonData[frameworkId]?.[key] || '';
        // Escape quotes for CSV
        value = value.replace(/"/g, '""');
        row.push(`"${value}"`);
      });
      
      csv += row.join(',') + '\n';
    });
    
    // Create and trigger download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `framework_comparison_${language}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url); // Clean up
  };
  
  // Toggle showing a criteria in the table
  const toggleCriteria = (criteriaKey) => {
    setCriteriaToShow(current => 
      current.includes(criteriaKey)
        ? current.filter(key => key !== criteriaKey)
        : [...current, criteriaKey]
    );
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900 mr-4"
            aria-label="Back to frameworks"
          >
            <ArrowLeft size={20} />
          </button>
          <h3 className="text-xl font-medium text-gray-900">{t.frameworkComparison}</h3>
        </div>
        
        <button
          onClick={downloadCSV}
          className="flex items-center text-yellow-600 hover:text-yellow-800"
          aria-label="Download CSV"
        >
          <Download size={18} className="mr-1" />
          <span className="text-sm">{t.download}</span>
        </button>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <h4 className="font-medium text-gray-900 mb-3">{t.criteriaToCompare}</h4>
        <div className="flex flex-wrap gap-2">
          {allCriteria.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => toggleCriteria(key)}
              className={`px-3 py-1 text-sm rounded-full ${
                criteriaToShow.includes(key)
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-gray-100 text-gray-700'
              }`}
              aria-pressed={criteriaToShow.includes(key)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      
      {Object.keys(comparisonData).length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Info size={36} className="text-gray-400 mb-4" />
          <p className="text-gray-500 text-center">
            {t.selectAtLeast}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t.criteria}
                </th>
                {selectedFrameworks.map(frameworkId => (
                  <th key={frameworkId} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {frameworks.find(f => f.id === frameworkId)?.name || frameworkId}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {allCriteria.filter(({ key }) => criteriaToShow.includes(key)).map(({ key, label }) => (
                <tr key={key}>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{label}</td>
                  {selectedFrameworks.map(frameworkId => (
                    <td key={frameworkId} className="px-4 py-3 text-sm text-gray-500">
                      {comparisonData[frameworkId]?.[key] || ''}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FrameworkComparison;
