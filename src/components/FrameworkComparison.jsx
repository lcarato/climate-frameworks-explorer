// src/components/FrameworkComparison.jsx
import React, { useState, useEffect } from 'react';
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
  
  useEffect(() => {
    const loadComparisonData = async () => {
      setIsLoading(true);
      try {
        // Create comparison data structure
        const data = {};
        
        // Load comparison data for each framework
        for (const frameworkId of selectedFrameworks) {
          const response = await fetch(
            `${apiBaseUrl}/frameworks/${frameworkId}/comparison?lang=${language}`
          );
          
          if (response.ok) {
            const frameworkData = await response.json();
            data[frameworkId] = frameworkData;
          }
        }
        
        setComparisonData(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading comparison data:', error);
        setIsLoading(false);
      }
    };
    
    if (selectedFrameworks.length > 0) {
      loadComparisonData();
    }
  }, [selectedFrameworks, language, apiBaseUrl]);
  
  // Download comparison data as CSV
  const downloadCSV = () => {
    const criteria = [
      { key: 'adaptationDefinition', label: t.adaptationDefinition },
      { key: 'technicalSpecificity', label: t.technicalSpecificity },
      { key: 'regulatoryStatus', label: t.regulatoryStatus },
      { key: 'energyStorageCriteria', label: t.energyStorageCriteria },
      { key: 'transportCriteria', label: t.transportCriteria },
      { key: 'buildingCriteria', label: t.buildingCriteria },
      { key: 'waterCriteria', label: t.waterCriteria },
      { key: 'implementationRequirements', label: t.implementationRequirements }
    ];
    
    let csv = `Criteria,${selectedFrameworks.map(fId => frameworks.find(f => f.id === fId)?.name || fId).join(',')}\n`;
    
    criteria.forEach(({ key, label }) => {
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
          >
            <ArrowLeft size={20} />
          </button>
          <h3 className="text-xl font-medium text-gray-900">{t.frameworkComparison}</h3>
        </div>
        
        <button
          onClick={downloadCSV}
          className="flex items-center text-yellow-600 hover:text-yellow-800"
        >
          <Download size={18} className="mr-1" />
          <span className="text-sm">{t.download}</span>
        </button>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <h4 className="font-medium text-gray-900 mb-3">{t.criteriaToCompare}</h4>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => toggleCriteria('adaptationDefinition')}
            className={`px-3 py-1 text-sm rounded-full ${
              criteriaToShow.includes('adaptationDefinition')
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            {t.adaptationDefinition}
          </button>
          <button
            onClick={() => toggleCriteria('technicalSpecificity')}
            className={`px-3 py-1 text-sm rounded-full ${
              criteriaToShow.includes('technicalSpecificity')
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            {t.technicalSpecificity}
          </button>
          <button
            onClick={() => toggleCriteria('regulatoryStatus')}
            className={`px-3 py-1 text-sm rounded-full ${
              criteriaToShow.includes('regulatoryStatus')
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            {t.regulatoryStatus}
          </button>
          <button
            onClick={() => toggleCriteria('energyStorageCriteria')}
            className={`px-3 py-1 text-sm rounded-full ${
              criteriaToShow.includes('energyStorageCriteria')
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            {t.energyStorageCriteria}
          </button>
          <button
            onClick={() => toggleCriteria('transportCriteria')}
            className={`px-3 py-1 text-sm rounded-full ${
              criteriaToShow.includes('transportCriteria')
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            {t.transportCriteria}
          </button>
          <button
            onClick={() => toggleCriteria('buildingCriteria')}
            className={`px-3 py-1 text-sm rounded-full ${
              criteriaToShow.includes('buildingCriteria')
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            {t.buildingCriteria}
          </button>
          <button
            onClick={() => toggleCriteria('waterCriteria')}
            className={`px-3 py-1 text-sm rounded-full ${
              criteriaToShow.includes('waterCriteria')
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            {t.waterCriteria}
          </button>
          <button
            onClick={() => toggleCriteria('implementationRequirements')}
            className={`px-3 py-1 text-sm rounded-full ${
              criteriaToShow.includes('implementationRequirements')
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            {t.implementationRequirements}
          </button>
        </div>
      </div>
      
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
            {criteriaToShow.includes('adaptationDefinition') && (
              <tr>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{t.adaptationDefinition}</td>
                {selectedFrameworks.map(frameworkId => (
                  <td key={frameworkId} className="px-4 py-3 text-sm text-gray-500">
                    {comparisonData[frameworkId]?.adaptationDefinition || ''}
                  </td>
                ))}
              </tr>
            )}
            
            {criteriaToShow.includes('technicalSpecificity') && (
              <tr>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{t.technicalSpecificity}</td>
                {selectedFrameworks.map(frameworkId => (
                  <td key={frameworkId} className="px-4 py-3 text-sm text-gray-500">
                    {comparisonData[frameworkId]?.technicalSpecificity || ''}
                  </td>
                ))}
              </tr>
            )}
            
            {criteriaToShow.includes('regulatoryStatus') && (
              <tr>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{t.regulatoryStatus}</td>
                {selectedFrameworks.map(frameworkId => (
                  <td key={frameworkId} className="px-4 py-3 text-sm text-gray-500">
                    {comparisonData[frameworkId]?.regulatoryStatus || ''}
                  </td>
                ))}
              </tr>
            )}
            
            {criteriaToShow.includes('energyStorageCriteria') && (
              <tr>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{t.energyStorageCriteria}</td>
                {selectedFrameworks.map(frameworkId => (
                  <td key={frameworkId} className="px-4 py-3 text-sm text-gray-500">
                    {comparisonData[frameworkId]?.energyStorageCriteria || ''}
                  </td>
                ))}
              </tr>
            )}
            
            {criteriaToShow.includes('transportCriteria') && (
              <tr>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{t.transportCriteria}</td>
                {selectedFrameworks.map(frameworkId => (
                  <td key={frameworkId} className="px-4 py-3 text-sm text-gray-500">
                    {comparisonData[frameworkId]?.transportCriteria || ''}
                  </td>
                ))}
              </tr>
            )}
            
            {criteriaToShow.includes('buildingCriteria') && (
              <tr>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{t.buildingCriteria}</td>
                {selectedFrameworks.map(frameworkId => (
                  <td key={frameworkId} className="px-4 py-3 text-sm text-gray-500">
                    {comparisonData[frameworkId]?.buildingCriteria || ''}
                  </td>
                ))}
              </tr>
            )}
            
            {criteriaToShow.includes('waterCriteria') && (
              <tr>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{t.waterCriteria}</td>
                {selectedFrameworks.map(frameworkId => (
                  <td key={frameworkId} className="px-4 py-3 text-sm text-gray-500">
                    {comparisonData[frameworkId]?.waterCriteria || ''}
                  </td>
                ))}
              </tr>
            )}
            
            {criteriaToShow.includes('implementationRequirements') && (
              <tr>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{t.implementationRequirements}</td>
                {selectedFrameworks.map(frameworkId => (
                  <td key={frameworkId} className="px-4 py-3 text-sm text-gray-500">
                    {comparisonData[frameworkId]?.implementationRequirements || ''}
                  </td>
                ))}
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FrameworkComparison;