/**
 * Script to populate the Climate Adaptation Frameworks database with
 * comprehensive comparison data from research results
 */
const mysql = require('mysql2/promise');
require('dotenv').config();

// Database connection configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'climate_frameworks',
  waitForConnections: true,
  connectionLimit: 10
};

// Complete research data for framework comparisons
const frameworkComparisonData = {
  // EU Taxonomy
  "eu": {
    "en": {
      "adaptationDefinition": "Activities that substantially contribute to adapting to current and expected future climate through: (1) preventing or reducing adverse climate impacts on the activity itself, or (2) preventing or reducing adverse climate impacts outside the activity.",
      "technicalSpecificity": "Detailed technical screening criteria with specific thresholds for different hazards. Includes robust methodology requirements for climate risk assessment.",
      "regulatoryStatus": "Mandatory for EU financial market participants subject to SFDR and large companies subject to CSRD. Legal basis established in Regulation (EU) 2020/852.",
      "energyStorageCriteria": "Storage facilities must demonstrate climate resilience through robust risk assessment and implement physical and non-physical solutions that reduce material physical climate risks. Detailed requirements for batteries, pumped hydro, thermal and other storage technologies.",
      "transportCriteria": "Transport infrastructure must demonstrate climate resilience through robust risk assessment and implement adaptation solutions, including physical and non-physical measures. Includes specific criteria for roads, railways, airports and ports.",
      "buildingCriteria": "Buildings must implement adaptation solutions addressing identified physical risks, including structural upgrades, cooling systems for heat resilience, flood protection measures, and drought-resistant landscaping.",
      "waterCriteria": "Water infrastructure must demonstrate climate resilience through comprehensive risk assessment considering increased water scarcity, water quality degradation, flood protection, and implement both physical and ecosystem-based solutions.",
      "implementationRequirements": "Requires robust climate risk assessment using climate projections across a range of future scenarios. Implementation must substantially reduce all material physical climate risks and must not increase risks to other areas or hamper adaptation elsewhere."
    },
    "es": {
      "adaptationDefinition": "Actividades que contribuyen sustancialmente a la adaptación al clima actual y futuro mediante: (1) la prevención o reducción de los impactos climáticos adversos en la propia actividad, o (2) la prevención o reducción de los impactos climáticos adversos fuera de la actividad.",
      "technicalSpecificity": "Criterios técnicos de selección detallados con umbrales específicos para diferentes peligros. Incluye requisitos metodológicos robustos para la evaluación de riesgos climáticos.",
      "regulatoryStatus": "Obligatorio para los participantes del mercado financiero de la UE sujetos a SFDR y grandes empresas sujetas a CSRD. Base legal establecida en el Reglamento (UE) 2020/852.",
      "energyStorageCriteria": "Las instalaciones de almacenamiento deben demostrar resiliencia climática mediante una evaluación de riesgos robusta e implementar soluciones físicas y no físicas que reduzcan los riesgos físicos climáticos materiales. Requisitos detallados para baterías, hidroeléctrica de bombeo, almacenamiento térmico y otras tecnologías.",
      "transportCriteria": "La infraestructura de transporte debe demostrar resiliencia climática mediante una evaluación de riesgos robusta e implementar soluciones de adaptación, incluidas medidas físicas y no físicas. Incluye criterios específicos para carreteras, ferrocarriles, aeropuertos y puertos.",
      "buildingCriteria": "Los edificios deben implementar soluciones de adaptación que aborden los riesgos físicos identificados, incluidas mejoras estructurales, sistemas de refrigeración para resistencia al calor, protección contra inundaciones y paisajismo resistente a la sequía.",
      "waterCriteria": "La infraestructura hídrica debe demostrar resiliencia climática mediante una evaluación de riesgos integral considerando el aumento de la escasez de agua, la degradación de la calidad del agua, la protección contra inundaciones, e implementar soluciones tanto físicas como basadas en ecosistemas.",
      "implementationRequirements": "Requiere una evaluación robusta de riesgos climáticos utilizando proyecciones climáticas en diversos escenarios futuros. La implementación debe reducir sustancialmente todos los riesgos físicos climáticos materiales y no debe aumentar los riesgos en otras áreas ni obstaculizar la adaptación en otros lugares."
    },
    "pt": {
      "adaptationDefinition": "Atividades que contribuem substancialmente para a adaptação ao clima atual e futuro por meio de: (1) prevenção ou redução dos impactos climáticos adversos na própria atividade, ou (2) prevenção ou redução dos impactos climáticos adversos fora da atividade.",
      "technicalSpecificity": "Critérios técnicos detalhados com limites específicos para diferentes perigos. Inclui requisitos metodológicos robustos para avaliação de riscos climáticos.",
      "regulatoryStatus": "Obrigatório para participantes do mercado financeiro da UE sujeitos ao SFDR e grandes empresas sujeitas ao CSRD. Base legal estabelecida no Regulamento (UE) 2020/852.",
      "energyStorageCriteria": "As instalações de armazenamento devem demonstrar resiliência climática através de avaliação de risco robusta e implementar soluções físicas e não físicas que reduzam riscos climáticos físicos materiais. Requisitos detalhados para baterias, hidrelétricas reversíveis, armazenamento térmico e outras tecnologias.",
      "transportCriteria": "A infraestrutura de transporte deve demonstrar resiliência climática através de avaliação de risco robusta e implementar soluções de adaptação, incluindo medidas físicas e não físicas. Inclui critérios específicos para estradas, ferrovias, aeroportos e portos.",
      "buildingCriteria": "Os edifícios devem implementar soluções de adaptação que abordem os riscos físicos identificados, incluindo melhorias estruturais, sistemas de refrigeração para resistência ao calor, proteção contra inundações e paisagismo resistente à seca.",
      "waterCriteria": "A infraestrutura hídrica deve demonstrar resiliência climática através de avaliação de risco abrangente considerando o aumento da escassez de água, degradação da qualidade da água, proteção contra inundações, e implementar soluções tanto físicas quanto baseadas em ecossistemas.",
      "implementationRequirements": "Requer avaliação robusta de riscos climáticos usando projeções climáticas em diversos cenários futuros. A implementação deve reduzir substancialmente todos os riscos climáticos físicos materiais e não deve aumentar os riscos em outras áreas ou dificultar a adaptação em outros lugares."
    }
  },
  
  // MDB Joint Methodology
  "mdb": {
    "en": {
      "adaptationDefinition": "Activities that address current and expected climate change impacts and risks to people, nature or assets, targeting vulnerability reduction and enhanced climate resilience within a context- and location-specific approach.",
      "technicalSpecificity": "Process-based approach without standardized technical thresholds, focusing on three key pillars: setting out climate vulnerability context, explicit statement of intent to address climate risks, and clear linkage between climate risks and project activities.",
      "regulatoryStatus": "Voluntary methodology used by Multilateral Development Banks for tracking and reporting climate finance. Not legally binding but serves as standard practice for MDB climate finance reporting.",
      "energyStorageCriteria": "Energy storage projects must demonstrate contribution to reducing identified climate vulnerabilities through addressing specific physical climate risks to storage systems or supporting broader system resilience in a changing climate.",
      "transportCriteria": "Transport projects qualify when they incorporate climate-resilient design elements that address identified climate risks or vulnerabilities, including infrastructure strengthening, elevation of assets in flood-prone areas, or use of heat-resistant materials.",
      "buildingCriteria": "Building activities qualify when they explicitly address identified climate vulnerabilities through design modifications, materials selection, location planning, or operational changes that enhance resilience to expected climate impacts.",
      "waterCriteria": "Water sector activities must demonstrate direct connection to addressing identified water-related climate vulnerabilities, including water scarcity, flood protection, or maintaining water quality under changing climate conditions.",
      "implementationRequirements": "Project documentation must establish climate vulnerability context, state clear intent to address climate risks, and demonstrate direct link between project activities and reducing identified climate vulnerabilities. Requires context-specific assessment rather than standardized metrics."
    },
    "es": {
      "adaptationDefinition": "Actividades que abordan los impactos y riesgos del cambio climático actuales y esperados para las personas, la naturaleza o los activos, con el objetivo de reducir la vulnerabilidad y mejorar la resiliencia climática dentro de un enfoque específico de contexto y ubicación.",
      "technicalSpecificity": "Enfoque basado en procesos sin umbrales técnicos estandarizados, centrándose en tres pilares clave: establecer el contexto de vulnerabilidad climática, declaración explícita de intención de abordar los riesgos climáticos, y vínculo claro entre los riesgos climáticos y las actividades del proyecto.",
      "regulatoryStatus": "Metodología voluntaria utilizada por los Bancos Multilaterales de Desarrollo para el seguimiento y reporte de financiamiento climático. No es legalmente vinculante pero sirve como práctica estándar para el reporte de financiamiento climático de los BMD.",
      "energyStorageCriteria": "Los proyectos de almacenamiento de energía deben demostrar contribución a la reducción de vulnerabilidades climáticas identificadas mediante el abordaje de riesgos climáticos físicos específicos para los sistemas de almacenamiento o el apoyo a una mayor resiliencia del sistema en un clima cambiante.",
      "transportCriteria": "Los proyectos de transporte califican cuando incorporan elementos de diseño resistentes al clima que abordan riesgos o vulnerabilidades climáticas identificadas, incluido el fortalecimiento de infraestructuras, la elevación de activos en áreas propensas a inundaciones o el uso de materiales resistentes al calor.",
      "buildingCriteria": "Las actividades de construcción califican cuando abordan explícitamente las vulnerabilidades climáticas identificadas mediante modificaciones de diseño, selección de materiales, planificación de ubicación o cambios operativos que mejoran la resiliencia a los impactos climáticos esperados.",
      "waterCriteria": "Las actividades del sector hídrico deben demostrar una conexión directa para abordar las vulnerabilidades climáticas relacionadas con el agua identificadas, incluida la escasez de agua, la protección contra inundaciones o el mantenimiento de la calidad del agua en condiciones climáticas cambiantes.",
      "implementationRequirements": "La documentación del proyecto debe establecer el contexto de vulnerabilidad climática, declarar la clara intención de abordar los riesgos climáticos y demostrar un vínculo directo entre las actividades del proyecto y la reducción de las vulnerabilidades climáticas identificadas. Requiere una evaluación específica del contexto en lugar de métricas estandarizadas."
    },
    "pt": {
      "adaptationDefinition": "Atividades que abordam os impactos e riscos atuais e esperados das mudanças climáticas para pessoas, natureza ou ativos, visando a redução da vulnerabilidade e o aumento da resiliência climática dentro de uma abordagem específica de contexto e localização.",
      "technicalSpecificity": "Abordagem baseada em processos sem limites técnicos padronizados, focando em três pilares principais: estabelecimento do contexto de vulnerabilidade climática, declaração explícita de intenção de abordar riscos climáticos e vínculo claro entre riscos climáticos e atividades do projeto.",
      "regulatoryStatus": "Metodologia voluntária utilizada pelos Bancos Multilaterais de Desenvolvimento para rastreamento e relatório de financiamento climático. Não é legalmente vinculativa, mas serve como prática padrão para relatórios de financiamento climático dos BMDs.",
      "energyStorageCriteria": "Projetos de armazenamento de energia devem demonstrar contribuição para reduzir vulnerabilidades climáticas identificadas através do tratamento de riscos climáticos físicos específicos para sistemas de armazenamento ou apoiando maior resiliência do sistema em um clima em mudança.",
      "transportCriteria": "Projetos de transporte se qualificam quando incorporam elementos de design resilientes ao clima que abordam riscos ou vulnerabilidades climáticas identificadas, incluindo fortalecimento de infraestrutura, elevação de ativos em áreas propensas a inundações ou uso de materiais resistentes ao calor.",
      "buildingCriteria": "Atividades de construção se qualificam quando abordam explicitamente vulnerabilidades climáticas identificadas através de modificações de design, seleção de materiais, planejamento de localização ou mudanças operacionais que aumentam a resiliência aos impactos climáticos esperados.",
      "waterCriteria": "Atividades do setor hídrico devem demonstrar conexão direta para abordar vulnerabilidades climáticas relacionadas à água identificadas, incluindo escassez de água, proteção contra inundações ou manutenção da qualidade da água em condições climáticas em mudança.",
      "implementationRequirements": "A documentação do projeto deve estabelecer o contexto de vulnerabilidade climática, declarar clara intenção de abordar riscos climáticos e demonstrar ligação direta entre atividades do projeto e redução das vulnerabilidades climáticas identificadas. Requer avaliação específica do contexto em vez de métricas padronizadas."
    }
  },
  
  // TCFD Recommendations
  "tcfd": {
    "en": {
      "adaptationDefinition": "Process of adjustment to actual or expected climate change and its effects to moderate harm or exploit beneficial opportunities. TCFD focuses on understanding, assessing, and disclosing climate-related risks and opportunities rather than defining adaptation specifically.",
      "technicalSpecificity": "Principles-based approach providing general guidance on governance, strategy, risk management, and metrics & targets. Does not provide detailed technical thresholds but encourages scenario analysis and forward-looking assessment.",
      "regulatoryStatus": "Voluntary disclosure framework that has been increasingly adopted into mandatory reporting requirements in various jurisdictions including UK, EU, New Zealand, Switzerland, and Singapore. Being incorporated into ISSB standards.",
      "energyStorageCriteria": "No sector-specific technical criteria for energy storage. TCFD recommends disclosure of how climate-related physical risks might impact energy assets and infrastructure, and what resilience measures are being implemented.",
      "transportCriteria": "No sector-specific technical criteria for transport. Focuses on disclosure of climate-related physical risks to transport assets and infrastructure and associated adaptation strategies rather than prescribing specific measures.",
      "buildingCriteria": "No sector-specific technical criteria for buildings. Encourages disclosure of physical climate risks to real estate assets and adaptation strategies rather than prescribing specific building measures.",
      "waterCriteria": "No sector-specific technical criteria for water infrastructure. Focuses on disclosure of water-related climate risks and adaptation strategies rather than prescribing specific measures.",
      "implementationRequirements": "Requires governance structures for climate risk oversight, integration of climate risk into strategy, implementation of risk management processes, and disclosure of metrics and targets. Implementation focuses on disclosure rather than specific adaptation actions."
    },
    "es": {
      "adaptationDefinition": "Proceso de ajuste al cambio climático real o esperado y sus efectos para moderar el daño o explotar oportunidades beneficiosas. El TCFD se centra en comprender, evaluar y divulgar los riesgos y oportunidades relacionados con el clima, en lugar de definir específicamente la adaptación.",
      "technicalSpecificity": "Enfoque basado en principios que proporciona orientación general sobre gobernanza, estrategia, gestión de riesgos y métricas y objetivos. No proporciona umbrales técnicos detallados, pero fomenta el análisis de escenarios y la evaluación prospectiva.",
      "regulatoryStatus": "Marco de divulgación voluntario que ha sido adoptado cada vez más en requisitos de informes obligatorios en varias jurisdicciones, incluidas Reino Unido, UE, Nueva Zelanda, Suiza y Singapur. Está siendo incorporado en los estándares ISSB.",
      "energyStorageCriteria": "No hay criterios técnicos específicos del sector para el almacenamiento de energía. El TCFD recomienda la divulgación de cómo los riesgos físicos relacionados con el clima podrían afectar a los activos e infraestructuras energéticas, y qué medidas de resiliencia se están implementando.",
      "transportCriteria": "No hay criterios técnicos específicos del sector para el transporte. Se centra en la divulgación de los riesgos físicos relacionados con el clima para los activos e infraestructuras de transporte y las estrategias de adaptación asociadas, en lugar de prescribir medidas específicas.",
      "buildingCriteria": "No hay criterios técnicos específicos del sector para edificios. Fomenta la divulgación de los riesgos climáticos físicos para los activos inmobiliarios y las estrategias de adaptación, en lugar de prescribir medidas específicas para edificios.",
      "waterCriteria": "No hay criterios técnicos específicos del sector para la infraestructura hídrica. Se centra en la divulgación de los riesgos climáticos relacionados con el agua y las estrategias de adaptación, en lugar de prescribir medidas específicas.",
      "implementationRequirements": "Requiere estructuras de gobernanza para la supervisión del riesgo climático, la integración del riesgo climático en la estrategia, la implementación de procesos de gestión de riesgos y la divulgación de métricas y objetivos. La implementación se centra en la divulgación en lugar de acciones específicas de adaptación."
    },
    "pt": {
      "adaptationDefinition": "Processo de ajuste às mudanças climáticas reais ou esperadas e seus efeitos para moderar danos ou explorar oportunidades benéficas. O TCFD concentra-se em entender, avaliar e divulgar riscos e oportunidades relacionados ao clima, em vez de definir adaptação especificamente.",
      "technicalSpecificity": "Abordagem baseada em princípios que fornece orientação geral sobre governança, estratégia, gestão de riscos e métricas e metas. Não fornece limites técnicos detalhados, mas incentiva análise de cenários e avaliação prospectiva.",
      "regulatoryStatus": "Estrutura de divulgação voluntária que tem sido cada vez mais adotada em requisitos de relatórios obrigatórios em várias jurisdições, incluindo Reino Unido, UE, Nova Zelândia, Suíça e Singapura. Está sendo incorporada nos padrões ISSB.",
      "energyStorageCriteria": "Sem critérios técnicos específicos do setor para armazenamento de energia. O TCFD recomenda a divulgação de como os riscos físicos relacionados ao clima podem impactar ativos e infraestrutura de energia, e quais medidas de resiliência estão sendo implementadas.",
      "transportCriteria": "Sem critérios técnicos específicos do setor para transporte. Concentra-se na divulgação de riscos físicos relacionados ao clima para ativos e infraestrutura de transporte e estratégias de adaptação associadas, em vez de prescrever medidas específicas.",
      "buildingCriteria": "Sem critérios técnicos específicos do setor para edifícios. Incentiva a divulgação de riscos climáticos físicos para ativos imobiliários e estratégias de adaptação, em vez de prescrever medidas específicas para edifícios.",
      "waterCriteria": "Sem critérios técnicos específicos do setor para infraestrutura hídrica. Concentra-se na divulgação de riscos climáticos relacionados à água e estratégias de adaptação, em vez de prescrever medidas específicas.",
      "implementationRequirements": "Requer estruturas de governança para supervisão de risco climático, integração de risco climático na estratégia, implementação de processos de gestão de riscos e divulgação de métricas e metas. A implementação concentra-se na divulgação em vez de ações específicas de adaptação."
    }
  },
  
  // Climate Bonds Initiative
  "cbi": {
    "en": {
      "adaptationDefinition": "Activities that build resilience to climate change through dedicated investments in adaptation or by incorporating climate resilience features into new or existing assets and systems. Covers both climate resilience investments and adaptation activities.",
      "technicalSpecificity": "Detailed sector-specific technical criteria based on climate science with clear thresholds. Adaptation and resilience scorecard approach with specific requirements that vary by sector.",
      "regulatoryStatus": "Voluntary market standard for green bond issuers. Not legally binding but widely recognized by investors and market participants as credible verification standard for climate-aligned investment.",
      "energyStorageCriteria": "Energy storage facilities must meet both mitigation criteria (emissions thresholds) and resilience criteria through comprehensive climate risk assessment. Requires demonstration that climate risks are addressed in design, construction and operation.",
      "transportCriteria": "Transport assets must demonstrate climate resilience through assessments covering vulnerability to climate hazards, critical interdependencies, and adaptation measures. Includes specific requirements for different transport modes.",
      "buildingCriteria": "Buildings must demonstrate climate resilience through comprehensive assessment of physical climate risks and implementation of appropriate adaptation measures. Includes specific criteria for residential and commercial buildings.",
      "waterCriteria": "Water infrastructure must demonstrate resilience to climate change through comprehensive assessment and adaptation plan. Specific criteria for water treatment, supply, storage, and flood defense infrastructure.",
      "implementationRequirements": "Requires certification from approved verifiers and ongoing reporting. Implementation must follow sector-specific criteria including climate risk assessment, resilience benefit analysis, and adaptation planning. Does not generally allow trade-offs between different climate objectives."
    },
    "es": {
      "adaptationDefinition": "Actividades que desarrollan resiliencia al cambio climático a través de inversiones dedicadas a la adaptación o mediante la incorporación de características de resiliencia climática en activos y sistemas nuevos o existentes. Cubre tanto inversiones en resiliencia climática como actividades de adaptación.",
      "technicalSpecificity": "Criterios técnicos detallados específicos del sector basados en la ciencia climática con umbrales claros. Enfoque de tarjeta de puntuación de adaptación y resiliencia con requisitos específicos que varían según el sector.",
      "regulatoryStatus": "Estándar voluntario de mercado para emisores de bonos verdes. No es legalmente vinculante pero ampliamente reconocido por inversores y participantes del mercado como un estándar de verificación creíble para inversiones alineadas con el clima.",
      "energyStorageCriteria": "Las instalaciones de almacenamiento de energía deben cumplir tanto los criterios de mitigación (umbrales de emisiones) como los criterios de resiliencia a través de una evaluación exhaustiva de riesgos climáticos. Requiere demostración de que los riesgos climáticos se abordan en el diseño, construcción y operación.",
      "transportCriteria": "Los activos de transporte deben demostrar resiliencia climática a través de evaluaciones que cubran la vulnerabilidad a los peligros climáticos, las interdependencias críticas y las medidas de adaptación. Incluye requisitos específicos para diferentes modos de transporte.",
      "buildingCriteria": "Los edificios deben demostrar resiliencia climática a través de una evaluación exhaustiva de los riesgos climáticos físicos y la implementación de medidas de adaptación apropiadas. Incluye criterios específicos para edificios residenciales y comerciales.",
      "waterCriteria": "La infraestructura hídrica debe demostrar resiliencia al cambio climático a través de una evaluación exhaustiva y un plan de adaptación. Criterios específicos para tratamiento de agua, suministro, almacenamiento e infraestructura de defensa contra inundaciones.",
      "implementationRequirements": "Requiere certificación de verificadores aprobados e informes continuos. La implementación debe seguir criterios específicos del sector, incluida la evaluación de riesgos climáticos, el análisis de beneficios de resiliencia y la planificación de adaptación. Generalmente no permite compensaciones entre diferentes objetivos climáticos."
    },
    "pt": {
      "adaptationDefinition": "Atividades que constroem resiliência às mudanças climáticas através de investimentos dedicados à adaptação ou incorporando características de resiliência climática em ativos e sistemas novos ou existentes. Cobre tanto investimentos em resiliência climática quanto atividades de adaptação.",
      "technicalSpecificity": "Critérios técnicos detalhados específicos do setor baseados na ciência climática com limites claros. Abordagem de scorecard de adaptação e resiliência com requisitos específicos que variam por setor.",
      "regulatoryStatus": "Padrão voluntário de mercado para emissores de títulos verdes. Não é legalmente vinculativo, mas amplamente reconhecido por investidores e participantes do mercado como padrão de verificação credível para investimentos alinhados ao clima.",
      "energyStorageCriteria": "Instalações de armazenamento de energia devem atender tanto aos critérios de mitigação (limites de emissões) quanto aos critérios de resiliência através de avaliação abrangente de riscos climáticos. Requer demonstração de que os riscos climáticos são abordados no design, construção e operação.",
      "transportCriteria": "Ativos de transporte devem demonstrar resiliência climática através de avaliações cobrindo vulnerabilidade a perigos climáticos, interdependências críticas e medidas de adaptação. Inclui requisitos específicos para diferentes modos de transporte.",
      "buildingCriteria": "Edifícios devem demonstrar resiliência climática através de avaliação abrangente de riscos climáticos físicos e implementação de medidas de adaptação apropriadas. Inclui critérios específicos para edifícios residenciais e comerciais.",
      "waterCriteria": "Infraestrutura hídrica deve demonstrar resiliência às mudanças climáticas através de avaliação abrangente e plano de adaptação. Critérios específicos para tratamento de água, abastecimento, armazenamento e infraestrutura de defesa contra inundações.",
      "implementationRequirements": "Requer certificação de verificadores aprovados e relatórios contínuos. A implementação deve seguir critérios específicos do setor, incluindo avaliação de riscos climáticos, análise de benefícios de resiliência e planejamento de adaptação. Geralmente não permite compensações entre diferentes objetivos climáticos."
    }
  },
  
  // ASEAN Taxonomy
  "asean": {
    "en": {
      "adaptationDefinition": "Economic activities that improve human, natural and physical system's resilience to climate change impacts and strengthen adaptive capacity through assessment and management of climate risks and supporting the transition towards climate resilience.",
      "technicalSpecificity": "Two-tier approach with Foundation Framework (qualitative) and Plus Standard (including some quantitative metrics). Limited technical specificity for adaptation with focus on general principles rather than detailed thresholds.",
      "regulatoryStatus": "Voluntary regional reference framework developed by ASEAN member states. Non-binding but aims to provide common language for sustainable finance in ASEAN region.",
      "energyStorageCriteria": "Energy storage projects qualify if they incorporate climate resilience features to address material physical climate risks identified through climate risk assessment. Limited specific technical requirements for storage technologies.",
      "transportCriteria": "Transport projects must conduct climate risk and vulnerability assessment and implement appropriate adaptation measures. General criteria focusing on resilience principles rather than specific technical requirements.",
      "buildingCriteria": "Building projects qualify if they demonstrate contribution to increasing climate resilience through physical or non-physical measures addressing identified climate risks. Limited specific technical requirements.",
      "waterCriteria": "Water management activities must conduct climate risk assessment and implement measures to increase resilience to climate change impacts. General criteria rather than specific technical requirements.",
      "implementationRequirements": "Two-tier approach allows for progressive implementation. Foundation Framework requires ensuring no significant harm to adaptation objectives and contribution to building climate resilience. Plus Standard adds more specific criteria but remains less technically detailed than EU Taxonomy."
    },
    "es": {
      "adaptationDefinition": "Actividades económicas que mejoran la resiliencia de los sistemas humanos, naturales y físicos frente a los impactos del cambio climático y fortalecen la capacidad adaptativa mediante la evaluación y gestión de los riesgos climáticos y el apoyo a la transición hacia la resiliencia climática.",
      "technicalSpecificity": "Enfoque de dos niveles con Marco Fundacional (cualitativo) y Estándar Plus (incluyendo algunas métricas cuantitativas). Especificidad técnica limitada para adaptación con enfoque en principios generales en lugar de umbrales detallados.",
      "regulatoryStatus": "Marco de referencia regional voluntario desarrollado por los estados miembros de ASEAN. No vinculante pero tiene como objetivo proporcionar un lenguaje común para las finanzas sostenibles en la región de ASEAN.",
      "energyStorageCriteria": "Los proyectos de almacenamiento de energía califican si incorporan características de resiliencia climática para abordar los riesgos climáticos físicos materiales identificados a través de la evaluación de riesgos climáticos. Requisitos técnicos específicos limitados para tecnologías de almacenamiento.",
      "transportCriteria": "Los proyectos de transporte deben realizar una evaluación de riesgo y vulnerabilidad climática e implementar medidas de adaptación apropiadas. Criterios generales centrados en principios de resiliencia en lugar de requisitos técnicos específicos.",
      "buildingCriteria": "Los proyectos de construcción califican si demuestran contribución al aumento de la resiliencia climática a través de medidas físicas o no físicas que aborden los riesgos climáticos identificados. Requisitos técnicos específicos limitados.",
      "waterCriteria": "Las actividades de gestión del agua deben realizar una evaluación de riesgos climáticos e implementar medidas para aumentar la resiliencia a los impactos del cambio climático. Criterios generales en lugar de requisitos técnicos específicos.",
      "implementationRequirements": "El enfoque de dos niveles permite una implementación progresiva. El Marco Fundacional requiere asegurar que no haya daños significativos a los objetivos de adaptación y contribución a la construcción de resiliencia climática. El Estándar Plus añade criterios más específicos pero sigue siendo menos técnicamente detallado que la Taxonomía de la UE."
    },
    "pt": {
      "adaptationDefinition": "Atividades econômicas que melhoram a resiliência dos sistemas humanos, naturais e físicos aos impactos das mudanças climáticas e fortalecem a capacidade adaptativa através da avaliação e gestão dos riscos climáticos e apoiando a transição para a resiliência climática.",
      "technicalSpecificity": "Abordagem de dois níveis com Estrutura Fundamental (qualitativa) e Padrão Plus (incluindo algumas métricas quantitativas). Especificidade técnica limitada para adaptação com foco em princípios gerais em vez de limites detalhados.",
      "regulatoryStatus": "Estrutura de referência regional voluntária desenvolvida pelos estados membros da ASEAN. Não vinculativa, mas visa fornecer uma linguagem comum para finanças sustentáveis na região da ASEAN.",
      "energyStorageCriteria": "Projetos de armazenamento de energia se qualificam se incorporarem características de resiliência climática para lidar com riscos climáticos físicos materiais identificados através de avaliação de risco climático. Requisitos técnicos específicos limitados para tecnologias de armazenamento.",
      "transportCriteria": "Projetos de transporte devem conduzir avaliação de risco e vulnerabilidade climática e implementar medidas de adaptação apropriadas. Critérios gerais focando em princípios de resiliência em vez de requisitos técnicos específicos.",
      "buildingCriteria": "Projetos de construção se qualificam se demonstrarem contribuição para aumentar a resiliência climática através de medidas físicas ou não físicas que abordem os riscos climáticos identificados. Requisitos técnicos específicos limitados.",
      "waterCriteria": "Atividades de gestão de água devem conduzir avaliação de risco climático e implementar medidas para aumentar a resiliência aos impactos das mudanças climáticas. Critérios gerais em vez de requisitos técnicos específicos.",
      "implementationRequirements": "Abordagem de dois níveis permite implementação progressiva. A Estrutura Fundamental requer garantir que não haja danos significativos aos objetivos de adaptação e contribuição para a construção de resiliência climática. O Padrão Plus adiciona critérios mais específicos, mas permanece menos tecnicamente detalhado que a Taxonomia da UE."