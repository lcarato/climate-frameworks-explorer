// src/components/ClimateFrameworksExplorer.jsx

// Import the framework comparison component
import FrameworkComparison from './FrameworkComparison';

// Add these translations to the existing translations object
const comparisonTranslations = {
  en: {
    // Existing translations...
    
    // Comparison specific translations
    frameworkComparison: "Framework Comparison",
    criteriaToCompare: "Select criteria to compare",
    download: "Download CSV",
    adaptationDefinition: "Adaptation Definition",
    technicalSpecificity: "Technical Specificity",
    regulatoryStatus: "Regulatory Status",
    energyStorageCriteria: "Energy Storage Criteria",
    transportCriteria: "Transport Criteria",
    buildingCriteria: "Building Criteria",
    waterCriteria: "Water Criteria",
    implementationRequirements: "Implementation Requirements",
    selectAtLeast: "Please select at least two frameworks to compare",
    maximumFrameworks: "Maximum 4 frameworks can be compared at once",
    compare: "Compare Selected",
    backToFrameworks: "Back to Frameworks"
  },
  es: {
    // Existing translations...
    
    // Comparison specific translations
    frameworkComparison: "Comparación de Marcos",
    criteriaToCompare: "Seleccionar criterios para comparar",
    download: "Descargar CSV",
    adaptationDefinition: "Definición de Adaptación",
    technicalSpecificity: "Especificidad Técnica",
    regulatoryStatus: "Estado Regulatorio",
    energyStorageCriteria: "Criterios de Almacenamiento de Energía",
    transportCriteria: "Criterios de Transporte",
    buildingCriteria: "Criterios de Edificios",
    waterCriteria: "Criterios de Agua",
    implementationRequirements: "Requisitos de Implementación",
    selectAtLeast: "Por favor seleccione al menos dos marcos para comparar",
    maximumFrameworks: "Se pueden comparar máximo 4 marcos a la vez",
    compare: "Comparar Seleccionados",
    backToFrameworks: "Volver a Marcos"
  },
  pt: {
    // Existing translations...
    
    // Comparison specific translations
    frameworkComparison: "Comparação de Estruturas",
    criteriaToCompare: "Selecionar critérios para comparar",
    download: "Baixar CSV",
    adaptationDefinition: "Definição de Adaptação",
    technicalSpecificity: "Especificidade Técnica",
    regulatoryStatus: "Status Regulatório",
    energyStorageCriteria: "Critérios de Armazenamento de Energia",
    transportCriteria: "Critérios de Transporte",
    buildingCriteria: "Critérios de Edifícios",
    waterCriteria: "Critérios de Água",
    implementationRequirements: "Requisitos de Implementação",
    selectAtLeast: "Por favor selecione pelo menos duas estruturas para comparar",
    maximumFrameworks: "No máximo 4 estruturas podem ser comparadas de uma vez",
    compare: "Comparar Selecionados",
    backToFrameworks: "Voltar para Estruturas"
  }
};

// In your ClimateFrameworksExplorer component, add a new state for comparison view
const [showComparison, setShowComparison] = useState(false);

// Modify the handleCompareClick function
const handleCompareClick = () => {
  if (selectedFrameworks.length < 2) {
    alert(t.selectAtLeast);
    return;
  }
  if (selectedFrameworks.length > 4) {
    alert(t.maximumFrameworks);
    return;
  }
  setShowComparison(true);
};

// Add a function to close the comparison view
const handleCloseComparison = () => {
  setShowComparison(false);
};

// Add this button in the UI to initiate comparison when in compare mode
{compareMode && selectedFrameworks.length > 0 && (
  <button 
    onClick={handleCompareClick}
    className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded-md text-sm font-medium"
  >
    {t.compare} ({selectedFrameworks.length})
  </button>
)}

// Modify the main content area to show the comparison component when showComparison is true
{/* Main content area */}
<div className="md:w-3/4">
  <div className="bg-white p-6 rounded-lg shadow-sm">
    {showComparison ? (
      <FrameworkComparison
        selectedFrameworks={selectedFrameworks}
        frameworks={frameworks}
        onClose={handleCloseComparison}
        language={language}
        t={t}
      />
    ) : activeFramework ? (
      <>
        {/* Existing framework details code */}
      </>
    ) : (
      <>
        {/* Existing empty state code */}
      </>
    )}
  </div>
</div>
