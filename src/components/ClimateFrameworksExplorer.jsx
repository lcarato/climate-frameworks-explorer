// src/components/ClimateFrameworksExplorer.jsx
import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, ChevronUp, Download, Edit, Info, Globe, Menu, X } from 'lucide-react';
import FrameworkComparison from './FrameworkComparison';

// Main application component
const ClimateFrameworksExplorer = () => {
  console.log('ClimateFrameworksExplorer component rendering');
  
  const [language, setLanguage] = useState('en');
  const [activeTab, setActiveTab] = useState('home');
  const [frameworks, setFrameworks] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [news, setNews] = useState([]);
  const [resources, setResources] = useState([]);
  const [activeFramework, setActiveFramework] = useState(null);
  const [frameworkDetails, setFrameworkDetails] = useState(null);
  const [activeSector, setActiveSector] = useState(null);
  const [activeDetailTab, setActiveDetailTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [selectedFrameworks, setSelectedFrameworks] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showComparison, setShowComparison] = useState(false);
  const [loadingError, setLoadingError] = useState(null);
  
  // Make sure to use port 3002 as discovered in debugging
  const apiBaseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3002/api';
  console.log('API Base URL being used:', apiBaseUrl);
  
  const translations = {
    en: {
      // General
      appTitle: "Climate Adaptation Frameworks Explorer",
      appSubtitle: "A tool to analyze and compare climate adaptation investment taxonomies",
      // Navigation
      navHome: "Home",
      navInstitutional: "Institutional",
      navProjects: "Projects",
      navPublications: "Publications",
      navResources: "Resources",
      navWorkWithUs: "Work with us",
      navPartners: "Partners & Allies",
      // Framework explorer
      exploreFrameworks: "Explore Frameworks",
      compareFrameworks: "Compare Frameworks",
      filterFrameworks: "Filter Frameworks",
      searchPlaceholder: "Search frameworks...",
      selectFramework: "Select a Framework",
      exitCompareMode: "Exit Compare Mode",
      frameworks: "Frameworks",
      // Filters
      filters: "Filters",
      region: "Region",
      type: "Type",
      ranking: "Ranking",
      // Framework details
      overview: "Overview",
      energySectors: "Energy Sectors",
      infrastructure: "Infrastructure",
      implementation: "Implementation",
      sources: "Sources",
      frameworkDescription: "Framework Description",
      adaptationDefinition: "Adaptation Definition",
      regulatoryStatus: "Regulatory Status",
      keyFeatures: "Key Features",
      // Sectors
      energySectorCategories: "Energy Sector Categories",
      viewDetails: "Click to view detailed adaptation criteria",
      criteria: "Criteria",
      requirements: "Requirements",
      source: "Source",
      selectCategory: "Select an energy category to view detailed adaptation criteria",
      // Comparison
      frameworkComparison: "Framework Comparison",
      technicalSpecificity: "Technical Specificity",
      energyStorageCriteria: "Energy Storage Criteria",
      transportCriteria: "Transport Criteria",
      buildingCriteria: "Building Criteria",
      waterCriteria: "Water Criteria",
      implementationRequirements: "Implementation Requirements",
      criteriaToCompare: "Select criteria to compare",
      download: "Download CSV",
      selectAtLeast: "Please select at least two frameworks to compare",
      maximumFrameworks: "Maximum 4 frameworks can be compared at once",
      compare: "Compare Selected",
      backToFrameworks: "Back to Frameworks",
      // News
      news: "News",
      // Resources
      copEvaluations: "COP Climate Change Evaluations",
      events: "Events",
      webinars: "Webinars",
      workshops: "Workshops",
      seminars: "Seminars",
      // Footer
      about: "About",
      documentation: "Documentation",
      contact: "Contact",
      api: "API"
    },
    es: {
      // General
      appTitle: "Explorador de Marcos de Adaptación Climática",
      appSubtitle: "Una herramienta para analizar y comparar taxonomías de inversión en adaptación climática",
      // Navigation
      navHome: "Inicio",
      navInstitutional: "Institucional",
      navProjects: "Proyectos",
      navPublications: "Publicaciones",
      navResources: "Recursos",
      navWorkWithUs: "Trabajá con nosotros",
      navPartners: "Socios y aliados",
      // Framework explorer
      exploreFrameworks: "Explorar Marcos",
      compareFrameworks: "Comparar Marcos",
      filterFrameworks: "Filtrar Marcos",
      searchPlaceholder: "Buscar marcos...",
      selectFramework: "Seleccionar un Marco",
      exitCompareMode: "Salir del Modo Comparación",
      frameworks: "Marcos",
      // Filters
      filters: "Filtros",
      region: "Región",
      type: "Tipo",
      ranking: "Clasificación",
      // Framework details
      overview: "Descripción General",
      energySectors: "Sectores Energéticos",
      infrastructure: "Infraestructura",
      implementation: "Implementación",
      sources: "Fuentes",
      frameworkDescription: "Descripción del Marco",
      adaptationDefinition: "Definición de Adaptación",
      regulatoryStatus: "Estado Regulatorio",
      keyFeatures: "Características Principales",
      // Sectors
      energySectorCategories: "Categorías del Sector Energético",
      viewDetails: "Haga clic para ver criterios detallados de adaptación",
      criteria: "Criterios",
      requirements: "Requisitos",
      source: "Fuente",
      selectCategory: "Seleccione una categoría de energía para ver criterios detallados de adaptación",
      // Comparison
      frameworkComparison: "Comparación de Marcos",
      technicalSpecificity: "Especificidad Técnica",
      energyStorageCriteria: "Criterios de Almacenamiento de Energía",
      transportCriteria: "Criterios de Transporte",
      buildingCriteria: "Criterios de Edificios",
      waterCriteria: "Criterios de Agua",
      implementationRequirements: "Requisitos de Implementación",
      criteriaToCompare: "Seleccionar criterios para comparar",
      download: "Descargar CSV",
      selectAtLeast: "Por favor seleccione al menos dos marcos para comparar",
      maximumFrameworks: "Se pueden comparar máximo 4 marcos a la vez",
      compare: "Comparar Seleccionados",
      backToFrameworks: "Volver a Marcos",
      // News
      news: "Novedades",
      // Resources
      copEvaluations: "Evaluaciones COP de Cambio Climático",
      events: "Eventos",
      webinars: "Webinars",
      workshops: "Talleres",
      seminars: "Seminarios",
      // Footer
      about: "Acerca de",
      documentation: "Documentación",
      contact: "Contacto",
      api: "API"
    },
    pt: {
      // General
      appTitle: "Explorador de Estruturas de Adaptação Climática",
      appSubtitle: "Uma ferramenta para analisar e comparar taxonomias de investimento em adaptação climática",
      // Navigation
      navHome: "Início",
      navInstitutional: "Institucional",
      navProjects: "Projetos",
      navPublications: "Publicações",
      navResources: "Recursos",
      navWorkWithUs: "Trabalhe conosco",
      navPartners: "Parceiros e Aliados",
      // Framework explorer
      exploreFrameworks: "Explorar Estruturas",
      compareFrameworks: "Comparar Estruturas",
      filterFrameworks: "Filtrar Estruturas",
      searchPlaceholder: "Buscar estruturas...",
      selectFramework: "Selecionar uma Estrutura",
      exitCompareMode: "Sair do Modo de Comparação",
      frameworks: "Estruturas",
      // Filters
      filters: "Filtros",
      region: "Região",
      type: "Tipo",
      ranking: "Classificação",
      // Framework details
      overview: "Visão Geral",
      energySectors: "Setores de Energia",
      infrastructure: "Infraestrutura",
      implementation: "Implementação",
      sources: "Fontes",
      frameworkDescription: "Descrição da Estrutura",
      adaptationDefinition: "Definição de Adaptação",
      regulatoryStatus: "Status Regulatório",
      keyFeatures: "Principais Características",
      // Sectors
      energySectorCategories: "Categorias do Setor de Energia",
      viewDetails: "Clique para ver critérios detalhados de adaptação",
      criteria: "Critérios",
      requirements: "Requisitos",
      source: "Fonte",
      selectCategory: "Selecione uma categoria de energia para ver critérios detalhados de adaptação",
      // Comparison
      frameworkComparison: "Comparação de Estruturas",
      technicalSpecificity: "Especificidade Técnica",
      energyStorageCriteria: "Critérios de Armazenamento de Energia",
      transportCriteria: "Critérios de Transporte",
      buildingCriteria: "Critérios de Edifícios",
      waterCriteria: "Critérios de Água",
      implementationRequirements: "Requisitos de Implementação",
      criteriaToCompare: "Selecionar critérios para comparar",
      download: "Baixar CSV",
      selectAtLeast: "Por favor selecione pelo menos duas estruturas para comparar",
      maximumFrameworks: "No máximo 4 estruturas podem ser comparadas de uma vez",
      compare: "Comparar Selecionados",
      backToFrameworks: "Voltar para Estruturas",
      // News
      news: "Novidades",
      // Resources
      copEvaluations: "Avaliações COP sobre Mudanças Climáticas",
      events: "Eventos",
      webinars: "Webinars",
      workshops: "Oficinas",
      seminars: "Seminários",
      // Footer
      about: "Sobre",
      documentation: "Documentação",
      contact: "Contato",
      api: "API"
    }
  };
  
  const t = translations[language];
  
  // Load data based on selected language
  useEffect(() => {
    const loadData = async () => {
      console.log('Starting to load data with language:', language);
      setIsLoading(true);
      setLoadingError(null);
      
      try {
        // Load frameworks
        const frameworksUrl = `${apiBaseUrl}/frameworks?lang=${language}`;
        console.log('Fetching frameworks from:', frameworksUrl);
        
        const frameworksResponse = await fetch(frameworksUrl);
        console.log('Frameworks response status:', frameworksResponse.status);
        
        if (!frameworksResponse.ok) {
          throw new Error(`Failed to fetch frameworks. Status: ${frameworksResponse.status}`);
        }
        
        const frameworksData = await frameworksResponse.json();
        console.log('Frameworks data received:', frameworksData);
        setFrameworks(frameworksData);
        
        // Load sectors
        console.log('Fetching sectors...');
        const sectorsUrl = `${apiBaseUrl}/sectors?lang=${language}`;
        const sectorsResponse = await fetch(sectorsUrl);
        
        if (!sectorsResponse.ok) {
          console.warn(`Failed to fetch sectors. Status: ${sectorsResponse.status}`);
          setSectors([]);
        } else {
          const sectorsData = await sectorsResponse.json();
          console.log('Sectors data received:', sectorsData);
          setSectors(sectorsData);
        }
        
        // Load news - use sample data if API fails
        try {
          console.log('Fetching news...');
          const newsUrl = `${apiBaseUrl}/news?lang=${language}`;
          const newsResponse = await fetch(newsUrl);
          
          if (!newsResponse.ok) {
            throw new Error(`Failed to fetch news. Status: ${newsResponse.status}`);
          }
          
          const newsData = await newsResponse.json();
          setNews(newsData);
        } catch (newsError) {
          console.warn('Error loading news, using placeholder data:', newsError);
          // Set placeholder news data
          setNews([
            { id: 'news1', title: 'Climate Framework Updates', image_url: '/img/climate-adaptation.svg', link_url: '#' },
            { id: 'news2', title: 'New TCFD Guidelines Released', image_url: '/img/climate-adaptation.svg', link_url: '#' },
            { id: 'news3', title: 'EU Taxonomy Amendments', image_url: '/img/climate-adaptation.svg', link_url: '#' },
            { id: 'news4', title: 'ASEAN Framework Adoption', image_url: '/img/climate-adaptation.svg', link_url: '#' }
          ]);
        }
        
        // Load resources - use sample data if API fails
        try {
          console.log('Fetching resources...');
          const resourcesUrl = `${apiBaseUrl}/resources?lang=${language}`;
          const resourcesResponse = await fetch(resourcesUrl);
          
          if (!resourcesResponse.ok) {
            throw new Error(`Failed to fetch resources. Status: ${resourcesResponse.status}`);
          }
          
          const resourcesData = await resourcesResponse.json();
          setResources(resourcesData);
        } catch (resourcesError) {
          console.warn('Error loading resources, using placeholder data:', resourcesError);
          // Set placeholder resources data
          setResources([
            { id: 'res1', title: 'Framework Comparison Guide', link_url: '#', category: 'guide' },
            { id: 'res2', title: 'Climate Adaptation Assessment Tools', link_url: '#', category: 'tools' },
            { id: 'res3', title: 'Investment Criteria Overview', link_url: '#', category: 'report' }
          ]);
        }
        
        // Reset framework details if language changes
        if (activeFramework) {
          try {
            console.log('Fetching framework details for:', activeFramework);
            const detailsUrl = `${apiBaseUrl}/frameworks/${activeFramework}?lang=${language}`;
            const detailsResponse = await fetch(detailsUrl);
            
            if (!detailsResponse.ok) {
              throw new Error(`Failed to fetch framework details. Status: ${detailsResponse.status}`);
            }
            
            const detailsData = await detailsResponse.json();
            console.log('Framework details received:', detailsData);
            setFrameworkDetails(detailsData);
          } catch (detailsError) {
            console.warn('Error loading framework details:', detailsError);
            setFrameworkDetails(null);
          }
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setLoadingError(error.toString());
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [language, activeFramework, apiBaseUrl]);
  
  const handleFrameworkClick = async (frameworkId) => {
    console.log('Framework clicked:', frameworkId);
    
    if (compareMode) {
      if (selectedFrameworks.includes(frameworkId)) {
        setSelectedFrameworks(selectedFrameworks.filter(id => id !== frameworkId));
      } else if (selectedFrameworks.length < 3) {
        setSelectedFrameworks([...selectedFrameworks, frameworkId]);
      }
    } else {
      setActiveFramework(frameworkId);
      try {
        console.log('Fetching details for framework:', frameworkId);
        const detailsUrl = `${apiBaseUrl}/frameworks/${frameworkId}?lang=${language}`;
        console.log('Framework details URL:', detailsUrl);
        
        const response = await fetch(detailsUrl);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch framework details. Status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Framework details received:', data);
        setFrameworkDetails(data);
        setActiveDetailTab(0);
      } catch (error) {
        console.error('Error fetching framework details:', error);
      }
    }
  };
  
  const handleSectorClick = async (sectorId) => {
    console.log('Sector clicked:', sectorId);
    
    if (sectorId === activeSector) {
      setActiveSector(null);
      return;
    }
    
    setActiveSector(sectorId);
    if (activeFramework) {
      try {
        console.log('Fetching sector criteria for:', sectorId);
        const sectorUrl = `${apiBaseUrl}/frameworks/${activeFramework}/sectors/${sectorId}?lang=${language}`;
        console.log('Sector criteria URL:', sectorUrl);
        
        const response = await fetch(sectorUrl);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch sector criteria. Status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Sector criteria received:', data);
        // Update sector criteria in framework details
        setFrameworkDetails({
          ...frameworkDetails,
          sectorCriteria: data
        });
      } catch (error) {
        console.error('Error fetching sector criteria:', error);
      }
    }
  };
  
  // Handle comparison
  const handleCompareClick = () => {
    console.log('Compare clicked with frameworks:', selectedFrameworks);
    
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
  
  // Close comparison view
  const handleCloseComparison = () => {
    setShowComparison(false);
  };
  
  // Filter frameworks based on search query
  const filteredFrameworks = frameworks.filter(framework => 
    framework.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    framework.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
    framework.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Add a debug section at the top if there are issues
  const renderDebugInfo = () => {
    if (process.env.NODE_ENV === 'development') {
      return (
        <div style={{padding: '10px', background: '#f8f9fa', border: '1px solid #ddd', margin: '10px', fontSize: '12px'}}>
          <h3>Debug Info:</h3>
          <p>API URL: {apiBaseUrl}</p>
          <p>Language: {language}</p>
          <p>Frameworks count: {frameworks.length}</p>
          <p>Loading: {isLoading ? 'Yes' : 'No'}</p>
          {loadingError && (
            <div style={{color: 'red'}}>
              <p>Error: {loadingError}</p>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Debug info in development */}
      {renderDebugInfo()}
      
      {/* Add a simple fallback to show if things aren't loading correctly */}
      {isLoading ? (
        <div style={{padding: '20px', background: '#f0f0f0', margin: '20px'}}>
          <h2>Loading data...</h2>
        </div>
      ) : frameworks.length === 0 ? (
        <div style={{padding: '20px', background: '#f0f0f0', margin: '20px'}}>
          <h2>No frameworks loaded</h2>
          <p>API URL: {apiBaseUrl}</p>
          <p>Language: {language}</p>
          <p>This should not happen if the API is working correctly.</p>
          {loadingError && <p>Error: {loadingError}</p>}
        </div>
      ) : null}
      
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center">
              <div className="text-yellow-500 font-bold text-xl mr-2">
                FUNDACIÓN
              </div>
              <div className="text-gray-900 font-bold text-xl">
                TORCUATO DI TELLA
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-6">
              <a href="#" className={`hover:text-yellow-500 ${activeTab === 'home' ? 'text-yellow-500' : 'text-gray-700'}`} onClick={() => setActiveTab('home')}>
                {t.navHome}
              </a>
              <a href="#" className={`hover:text-yellow-500 ${activeTab === 'institutional' ? 'text-yellow-500' : 'text-gray-700'}`} onClick={() => setActiveTab('institutional')}>
                {t.navInstitutional}
              </a>
              <a href="#" className={`hover:text-yellow-500 ${activeTab === 'projects' ? 'text-yellow-500' : 'text-gray-700'}`} onClick={() => setActiveTab('projects')}>
                {t.navProjects}
              </a>
              <a href="#" className={`hover:text-yellow-500 ${activeTab === 'publications' ? 'text-yellow-500' : 'text-gray-700'}`} onClick={() => setActiveTab('publications')}>
                {t.navPublications}
              </a>
              <a href="#" className={`hover:text-yellow-500 ${activeTab === 'resources' ? 'text-yellow-500' : 'text-gray-700'}`} onClick={() => setActiveTab('resources')}>
                {t.navResources}
              </a>
              <a href="#" className="text-gray-700 hover:text-yellow-500">
                {t.navWorkWithUs}
              </a>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex space-x-2">
                <button 
                  onClick={() => setLanguage('es')} 
                  className={`px-2 py-1 text-sm ${language === 'es' ? 'font-bold text-yellow-500' : 'text-gray-500'}`}
                >
                  ES
                </button>
                <button 
                  onClick={() => setLanguage('en')} 
                  className={`px-2 py-1 text-sm ${language === 'en' ? 'font-bold text-yellow-500' : 'text-gray-500'}`}
                >
                  EN
                </button>
                <button 
                  onClick={() => setLanguage('pt')} 
                  className={`px-2 py-1 text-sm ${language === 'pt' ? 'font-bold text-yellow-500' : 'text-gray-500'}`}
                >
                  PT
                </button>
              </div>
              
              <button 
                className="md:hidden text-gray-700"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white py-4 px-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              <a href="#" className={`${activeTab === 'home' ? 'text-yellow-500' : 'text-gray-700'}`} onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); }}>
                {t.navHome}
              </a>
              <a href="#" className={`${activeTab === 'institutional' ? 'text-yellow-500' : 'text-gray-700'}`} onClick={() => { setActiveTab('institutional'); setMobileMenuOpen(false); }}>
                {t.navInstitutional}
              </a>
              <a href="#" className={`${activeTab === 'projects' ? 'text-yellow-500' : 'text-gray-700'}`} onClick={() => { setActiveTab('projects'); setMobileMenuOpen(false); }}>
                {t.navProjects}
              </a>
              <a href="#" className={`${activeTab === 'publications' ? 'text-yellow-500' : 'text-gray-700'}`} onClick={() => { setActiveTab('publications'); setMobileMenuOpen(false); }}>
                {t.navPublications}
              </a>
              <a href="#" className={`${activeTab === 'resources' ? 'text-yellow-500' : 'text-gray-700'}`} onClick={() => { setActiveTab('resources'); setMobileMenuOpen(false); }}>
                {t.navResources}
              </a>
              <a href="#" className="text-gray-700">
                {t.navWorkWithUs}
              </a>
            </nav>
          </div>
        )}
      </header>

      {/* Page Title Banner */}
      <div className="bg-yellow-400 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900">
            {activeTab === 'home' && t.appTitle}
            {activeTab === 'institutional' && t.navInstitutional}
            {activeTab === 'projects' && t.navProjects}
            {activeTab === 'publications' && t.navPublications}
            {activeTab === 'resources' && t.navResources}
          </h1>
        </div>
      </div>
      
      {/* Secondary Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex space-x-6 py-4 overflow-x-auto">
            <a href="#" className="text-gray-700 hover:text-yellow-500 whitespace-nowrap">
              {t.navInstitutional}
            </a>
            <a href="#" className="text-gray-700 hover:text-yellow-500 whitespace-nowrap">
              {t.navProjects}
            </a>
            <a href="#" className="text-gray-700 hover:text-yellow-500 whitespace-nowrap">
              {t.navPublications}
            </a>
            <a href="#" className="text-gray-700 hover:text-yellow-500 whitespace-nowrap">
              {t.navResources}
            </a>
            <a href="#" className="text-gray-700 hover:text-yellow-500 whitespace-nowrap">
              {t.navPartners}
            </a>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-grow">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
          </div>
        ) : (
          <>
            {activeTab === 'home' && (
              <div className="container mx-auto px-4 py-8">
                {/* News section */}
                <section className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">{t.news}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {news.map(item => (
                      <div key={item.id} className="flex flex-col">
                        <img src={item.image_url} alt={item.title} className="w-full mb-3 rounded" />
                        <h3 className="text-yellow-500 font-medium mb-1">{item.title}</h3>
                        <a href={item.link_url} className="text-sm text-gray-700 hover:text-yellow-500 mt-auto">
                          {t.viewDetails} →
                        </a>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Framework Explorer */}
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Left sidebar */}
                  <div className="md:w-1/4">
                    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder={t.searchPlaceholder}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-medium text-gray-900">{t.filters}</h2>
                        <button 
                          onClick={() => setFilterOpen(!filterOpen)}
                          className="text-gray-500"
                        >
                        {filterOpen ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
                        </button>
                      </div>
                      
                      {filterOpen && (
                        <div className="space-y-4">
                          <div>
                            <h3 className="font-medium text-gray-700 mb-2">{t.region}</h3>
                            <div className="space-y-2">
                              {['Global', 'Europe', 'Asia', 'Africa', 'Americas'].map(region => (
                                <label key={region} className="flex items-center">
                                  <input type="checkbox" className="rounded text-yellow-600 mr-2" />
                                  <span>{region}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <h3 className="font-medium text-gray-700 mb-2">{t.type}</h3>
                            <div className="space-y-2">
                              {['Regulatory', 'Voluntary'].map(type => (
                                <label key={type} className="flex items-center">
                                  <input type="checkbox" className="rounded text-yellow-600 mr-2" />
                                  <span>{type}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <h3 className="font-medium text-gray-700 mb-2">{t.ranking}</h3>
                            <div className="space-y-2">
                              {['High', 'Medium-High', 'Medium', 'Low-Medium', 'Low'].map(ranking => (
                                <label key={ranking} className="flex items-center">
                                  <input type="checkbox" className="rounded text-yellow-600 mr-2" />
                                  <span>{ranking}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-medium text-gray-900">{t.frameworks}</h2>
                        <button 
                          onClick={() => setCompareMode(!compareMode)}
                          className={`px-4 py-2 rounded-md text-sm font-medium ${
                            compareMode 
                              ? 'bg-yellow-100 text-yellow-900 border border-yellow-300' 
                              : 'bg-gray-100 text-gray-700 border border-gray-300'
                          }`}
                        >
                          {compareMode ? t.exitCompareMode : t.compareFrameworks}
                        </button>
                      </div>
                      <div className="space-y-2">
                        {filteredFrameworks.map(framework => (
                          <div 
                            key={framework.id}
                            onClick={() => handleFrameworkClick(framework.id)}
                            className={`p-3 rounded-md cursor-pointer transition-colors ${
                              activeFramework === framework.id || selectedFrameworks.includes(framework.id)
                                ? 'bg-yellow-100 border-l-4 border-yellow-500'
                                : 'hover:bg-gray-100'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="font-medium text-gray-900">{framework.name}</h3>
                                <div className="flex items-center text-sm text-gray-500 mt-1">
                                  <span className="mr-2">{framework.region}</span>
                                  <span className="mr-2">•</span>
                                  <span>{framework.type}</span>
                                </div>
                              </div>
                              <div className={`px-2 py-1 rounded-full text-xs ${
                                framework.ranking === 'High' || framework.ranking === 'Alto' || framework.ranking === 'Alto' ? 'bg-green-100 text-green-800' :
                                framework.ranking === 'Medium-High' || framework.ranking === 'Medio-Alto' || framework.ranking === 'Médio-Alto' ? 'bg-green-100 text-green-800' :
                                framework.ranking === 'Medium' || framework.ranking === 'Medio' || framework.ranking === 'Médio' ? 'bg-yellow-100 text-yellow-800' :
                                framework.ranking === 'Low-Medium' || framework.ranking === 'Bajo-Medio' || framework.ranking === 'Baixo-Médio' ? 'bg-orange-100 text-orange-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {framework.ranking}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Compare button */}
                      {compareMode && selectedFrameworks.length > 0 && (
                        <button 
                          onClick={handleCompareClick}
                          className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded-md text-sm font-medium w-full"
                        >
                          {t.compare} ({selectedFrameworks.length})
                        </button>
                      )}
                    </div>
                  </div>

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
                          <div className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                              {frameworks.find(f => f.id === activeFramework)?.name}
                            </h2>
                            <div className="flex items-center text-sm text-gray-500">
                              <span className="mr-3">{frameworks.find(f => f.id === activeFramework)?.region}</span>
                              <span className="mr-3">•</span>
                              <span className="mr-3">{frameworks.find(f => f.id === activeFramework)?.type}</span>
                              <span className="mr-3">•</span>
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                frameworks.find(f => f.id === activeFramework)?.ranking === 'High' || 
                                frameworks.find(f => f.id === activeFramework)?.ranking === 'Alto' || 
                                frameworks.find(f => f.id === activeFramework)?.ranking === 'Alto' ? 'bg-green-100 text-green-800' :
                                frameworks.find(f => f.id === activeFramework)?.ranking === 'Medium-High' || 
                                frameworks.find(f => f.id === activeFramework)?.ranking === 'Medio-Alto' || 
                                frameworks.find(f => f.id === activeFramework)?.ranking === 'Médio-Alto' ? 'bg-green-100 text-green-800' :
                                frameworks.find(f => f.id === activeFramework)?.ranking === 'Medium' || 
                                frameworks.find(f => f.id === activeFramework)?.ranking === 'Medio' || 
                                frameworks.find(f => f.id === activeFramework)?.ranking === 'Médio' ? 'bg-yellow-100 text-yellow-800' :
                                frameworks.find(f => f.id === activeFramework)?.ranking === 'Low-Medium' || 
                                frameworks.find(f => f.id === activeFramework)?.ranking === 'Bajo-Medio' || 
                                frameworks.find(f => f.id === activeFramework)?.ranking === 'Baixo-Médio' ? 'bg-orange-100 text-orange-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {frameworks.find(f => f.id === activeFramework)?.ranking}
                              </span>
                            </div>
                          </div>

                          {/* Custom Tabs Implementation */}
                          <div className="w-full">
                            {/* Tab Navigation */}
                            <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
                              {[t.overview, t.energySectors, t.infrastructure, t.implementation, t.sources].map((tab, index) => (
                                <button
                                  key={index}
                                  onClick={() => setActiveDetailTab(index)}
                                  className={`px-4 py-2 text-gray-600 hover:text-yellow-500 cursor-pointer focus:outline-none whitespace-nowrap ${
                                    activeDetailTab === index ? 'border-b-2 border-yellow-500 text-yellow-500 font-medium' : ''
                                  }`}
                                >
                                  {tab}
                                </button>
                              ))}
                            </div>

                            {/* Tab Content */}
                            {activeDetailTab === 0 && frameworkDetails && (
                              <>
                                <div className="mb-6">
                                  <h3 className="text-lg font-medium text-gray-900 mb-3">{t.frameworkDescription}</h3>
                                  <p className="text-gray-700">
                                    {frameworks.find(f => f.id === activeFramework)?.description}
                                  </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                  <div className="border border-gray-200 rounded-lg p-4">
                                    <h3 className="text-lg font-medium text-gray-900 mb-3">{t.adaptationDefinition}</h3>
                                    <p className="text-gray-700">
                                      {frameworkDetails.adaptationDefinition}
                                    </p>
                                  </div>

                                  <div className="border border-gray-200 rounded-lg p-4">
                                    <h3 className="text-lg font-medium text-gray-900 mb-3">{t.regulatoryStatus}</h3>
                                    <p className="text-gray-700">
                                      {frameworkDetails.regulatoryStatus}
                                    </p>
                                  </div>
                                </div>

                                <div>
                                  <h3 className="text-lg font-medium text-gray-900 mb-3">{t.keyFeatures}</h3>
                                  <ul className="list-disc pl-5 text-gray-700 space-y-2">
                                    {frameworkDetails.keyFeatures?.map((feature, index) => (
                                      <li key={index}>{feature}</li>
                                    ))}
                                  </ul>
                                </div>
                              </>
                            )}

                            {activeDetailTab === 1 && frameworkDetails && (
                              <div>
                                <div className="flex items-center justify-between mb-4">
                                  <h3 className="text-lg font-medium text-gray-900">{t.energySectorCategories}</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                  {sectors.slice(0, 3).map(sector => (
                                    <div 
                                      key={sector.id}
                                      onClick={() => handleSectorClick(sector.id)}
                                      className={`border ${activeSector === sector.id ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200'} rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow`}
                                    >
                                      <h4 className="font-medium text-gray-900 mb-2">{sector.name}</h4>
                                      <p className="text-sm text-gray-500">
                                        {t.viewDetails}
                                      </p>
                                    </div>
                                  ))}
                                </div>

                                {activeSector && frameworkDetails.sectorCriteria && (
                                  <div className="border border-gray-200 rounded-lg p-4 mb-6">
                                    <div className="flex items-center justify-between mb-4">
                                      <h4 className="text-lg font-medium text-gray-900">{sectors.find(s => s.id === activeSector)?.name}</h4>
                                      <div className="flex items-center space-x-2">
                                        <button className="text-yellow-500 hover:text-yellow-700">
                                          <Download size={18} />
                                        </button>
                                      </div>
                                    </div>

                                    <div className="overflow-x-auto">
                                      <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                          <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.criteria}</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.requirements}</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.source}</th>
                                          </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                          {frameworkDetails.sectorCriteria.map((item, index) => (
                                            <tr key={index}>
                                              <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.criteria}</td>
                                              <td className="px-4 py-3 text-sm text-gray-500">{item.requirements}</td>
                                              <td className="px-4 py-3 text-sm text-gray-500">{item.source}</td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                )}

                                {!activeSector && (
                                  <div className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex items-center justify-center h-40">
                                      <div className="text-center">
                                        <Info size={24} className="mx-auto mb-2 text-gray-400" />
                                        <p className="text-gray-500">{t.selectCategory}</p>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}

                            {activeDetailTab === 2 && (
                              <div className="flex items-center justify-center h-64">
                                <div className="text-center">
                                  <Info size={24} className="mx-auto mb-2 text-gray-400" />
                                  <p className="text-gray-500">{t.infrastructure}</p>
                                </div>
                              </div>
                            )}

                            {activeDetailTab === 3 && (
                              <div className="flex items-center justify-center h-64">
                                <div className="text-center">
                                  <Info size={24} className="mx-auto mb-2 text-gray-400" />
                                  <p className="text-gray-500">{t.implementation}</p>
                                </div>
                              </div>
                            )}

                            {activeDetailTab === 4 && frameworkDetails && (
                              <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-3">{t.sources}</h3>
                                <ul className="list-disc pl-5 text-gray-700 space-y-2">
                                  {frameworkDetails.sources?.map((source, index) => (
                                    <li key={index}>
                                      {source.text}. <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-yellow-500 hover:underline">{source.url}</a>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-96">
                          <img src="/img/climate-adaptation.svg" alt="Climate Adaptation Frameworks" className="mb-6 w-64" />
                          <h2 className="text-xl font-medium text-gray-900 mb-2">{t.appTitle}</h2>
                          <p className="text-gray-500 text-center max-w-md mb-6">
                            {t.appSubtitle}
                          </p>
                          <div className="flex space-x-4">
                            <button className="bg-yellow-500 text-white px-4 py-2 rounded-md text-sm font-medium">
                              {t.selectFramework}
                            </button>
                            <button 
                              onClick={() => setCompareMode(!compareMode)}
                              className={`px-4 py-2 rounded-md text-sm font-medium ${
                                compareMode 
                                  ? 'bg-yellow-100 text-yellow-900 border border-yellow-300' 
                                  : 'bg-gray-100 text-gray-700 border border-gray-300'
                              }`}
                            >
                              {compareMode ? t.exitCompareMode : t.compareFrameworks}
                            </button>
                          </div>
                          {compareMode && (
                            <p className="text-sm text-yellow-500 mt-4">
                              {t.selectFramework}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Resources tab content */}
            {activeTab === 'resources' && (
              <div className="container mx-auto px-4 py-8">
                <section className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">{t.copEvaluations}</h2>
                  <div className="space-y-3">
                    {resources.map(resource => (
                      <div key={resource.id} className="p-3 hover:bg-yellow-50 rounded-md transition-colors">
                        <a href={resource.link_url} className="text-yellow-500 hover:underline">
                          {resource.title}
                        </a>
                      </div>
                    ))}
                  </div>
                </section>
                
                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">{t.events}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <img src="/img/webinars-icon.svg" alt="Webinars" className="mx-auto mb-4 w-32 h-32" />
                      <button className="bg-yellow-500 text-white px-6 py-2 rounded-md">{t.webinars}</button>
                    </div>
                    <div className="text-center">
                      <img src="/img/workshops-icon.svg" alt="Workshops" className="mx-auto mb-4 w-32 h-32" />
                      <button className="bg-yellow-500 text-white px-6 py-2 rounded-md">{t.workshops}</button>
                    </div>
                    <div className="text-center">
                      <img src="/img/seminars-icon.svg" alt="Seminars" className="mx-auto mb-4 w-32 h-32" />
                      <button className="bg-yellow-500 text-white px-6 py-2 rounded-md">{t.seminars}</button>
                    </div>
                  </div>
                </section>
              </div>
            )}
            
            {/* Other tab content */}
            {(activeTab === 'institutional' || activeTab === 'projects' || activeTab === 'publications') && (
              <div className="container mx-auto px-4 py-8">
                <div className="bg-white p-6 rounded-lg">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    {activeTab === 'institutional' && t.navInstitutional}
                    {activeTab === 'projects' && t.navProjects}
                    {activeTab === 'publications' && t.navPublications}
                  </h2>
                  
                  <p className="text-gray-700 mb-6">
                    {activeTab === 'institutional' && "La Fundación Torcuato Di Tella (FTDT) es una institución sin fines de lucro que fue constituida el 22 de julio de 1958 con el propósito de promover, estimular, colaborar, participar y/o, en cualquier otra forma, intervenir en toda clase de iniciativas, obras y empresas de carácter educacional, intelectual, artístico, social, medioambiental y filantrópico."}
                    {activeTab === 'projects' && "La Fundación Torcuato Di Tella (FTDT) desarrolla actividades para la expansión del conocimiento, la mejora en el diseño de las políticas públicas, el fortalecimiento de las capacidades para la toma de decisiones -públicas y privadas- en materia de cambio climático, asuntos ambientales, y energía, con el fin último de contribuir a la mejora en las condiciones de vida de los ciudadanos."}
                    {activeTab === 'publications' && "Publicaciones recientes de la Fundación Torcuato Di Tella sobre adaptación climática, políticas climáticas y energía sostenible."}
                  </p>
                  
                  {activeTab === 'projects' && (
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mt-8">
                      <div className="text-center">
                        <img src="/img/project-icon-1.svg" alt="Project 1" className="mx-auto mb-3 w-24 h-24" />
                        <h3 className="text-yellow-500 font-medium">PtX</h3>
                      </div>
                      <div className="text-center">
                        <img src="/img/project-icon-2.svg" alt="Project 2" className="mx-auto mb-3 w-24 h-24" />
                        <h3 className="text-yellow-500 font-medium">CCAC</h3>
                      </div>
                      <div className="text-center">
                        <img src="/img/project-icon-3.svg" alt="Project 3" className="mx-auto mb-3 w-24 h-24" />
                        <h3 className="text-yellow-500 font-medium">Descarboniz.ar</h3>
                      </div>
                      <div className="text-center">
                        <img src="/img/project-icon-4.svg" alt="Project 4" className="mx-auto mb-3 w-24 h-24" />
                        <h3 className="text-yellow-500 font-medium">C2G y CEPAL</h3>
                      </div>
                      <div className="text-center">
                        <img src="/img/project-icon-5.svg" alt="Project 5" className="mx-auto mb-3 w-24 h-24" />
                        <h3 className="text-yellow-500 font-medium">Delta Alliance</h3>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center">
                <div className="text-yellow-500 font-bold text-lg mr-2">
                  FUNDACIÓN
                </div>
                <div className="text-gray-900 font-bold text-lg">
                  TORCUATO DI TELLA
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {t.appSubtitle}
              </p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-sm text-gray-500 hover:text-yellow-500">{t.about}</a>
              <a href="#" className="text-sm text-gray-500 hover:text-yellow-500">{t.documentation}</a>
              <a href="#" className="text-sm text-gray-500 hover:text-yellow-500">{t.contact}</a>
              <a href="#" className="text-sm text-gray-500 hover:text-yellow-500">{t.api}</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ClimateFrameworksExplorer;
