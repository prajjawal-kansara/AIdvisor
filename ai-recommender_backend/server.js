const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Enhanced AI Tools Database with more comprehensive data
const aiToolsDatabase = [
  {
    id: 1,
    name: "ChatGPT",
    vendor: "OpenAI",
    description: "Advanced conversational AI for text generation, coding, problem-solving, and creative writing with human-like responses.",
    categories: ["Conversational AI", "Text Generation", "Code Assistance", "Creative Writing"],
    use_cases: ["Customer Support", "Content Creation", "Programming Help", "Research Assistant", "Education", "Writing Enhancement"],
    pricing: {
      has_free_tier: true,
      starting_price: 20,
      pricing_model: "subscription"
    },
    features: ["Natural Language Processing", "Code Generation", "Multi-language Support", "Context Awareness", "Creative Writing", "Problem Solving"],
    limitations: ["Usage Limits on Free Tier", "Knowledge Cutoff Date", "Cannot Browse Internet in Real-time"],
    api_available: true,
    rating: 4.6,
    reviews_count: 12500,
    average_response_time: "2-5 seconds",
    techLevel: "beginner-advanced"
  },
  {
    id: 2,
    name: "DALL-E",
    vendor: "OpenAI",
    description: "An AI system that creates realistic images and art from natural language descriptions with exceptional quality and creativity.",
    categories: ["Image Generation", "Creative AI", "Visual Content Creation"],
    use_cases: ["Marketing Material Creation", "Concept Art", "Content Illustration", "Product Visualization", "Social Media Graphics", "Digital Art"],
    pricing: {
      has_free_tier: true,
      starting_price: 15,
      pricing_model: "credit-based"
    },
    features: ["Text to Image", "Style Customization", "High Resolution Output", "Prompt-based Generation", "Artistic Styles", "Commercial Usage Rights"],
    limitations: ["Cannot Edit Existing Images", "Limited Understanding of Complex Scenes", "Credit-based System"],
    api_available: true,
    rating: 4.5,
    reviews_count: 8500,
    average_response_time: "5-15 seconds",
    techLevel: "beginner-intermediate"
  },
  {
    id: 3,
    name: "Midjourney",
    vendor: "Midjourney Inc.",
    description: "AI-powered image generation platform known for creating stunning, artistic images from text prompts with unique aesthetic styles.",
    categories: ["Image Generation", "Digital Art", "Creative AI"],
    use_cases: ["Digital Art Creation", "Marketing Visuals", "Concept Design", "Social Media Content", "Book Illustrations", "Brand Assets"],
    pricing: {
      has_free_tier: false,
      starting_price: 10,
      pricing_model: "subscription"
    },
    features: ["Artistic Style Generation", "High Quality Images", "Community Gallery", "Style Variations", "Upscaling", "Remix Capabilities"],
    limitations: ["Discord-based Interface", "No Free Tier", "Limited Control Over Details", "Community-visible Creations"],
    api_available: false,
    rating: 4.7,
    reviews_count: 15200,
    average_response_time: "30-60 seconds",
    techLevel: "beginner-intermediate"
  },
  {
    id: 4,
    name: "GitHub Copilot",
    vendor: "GitHub (Microsoft)",
    description: "AI pair programmer that provides intelligent code completions, suggestions, and entire function generation across multiple programming languages.",
    categories: ["Code Generation", "Developer Tools", "Programming Assistant"],
    use_cases: ["Software Development", "Code Completion", "Bug Fixing", "Learning Programming", "Code Review", "Documentation"],
    pricing: {
      has_free_tier: false,
      starting_price: 10,
      pricing_model: "subscription"
    },
    features: ["Multi-language Support", "IDE Integration", "Context-aware Suggestions", "Function Generation", "Code Explanation", "Real-time Assistance"],
    limitations: ["Requires Programming Knowledge", "Subscription Required", "May Suggest Insecure Code", "Limited to Supported IDEs"],
    api_available: true,
    rating: 4.4,
    reviews_count: 9800,
    average_response_time: "instant",
    techLevel: "intermediate-advanced"
  },
  {
    id: 5,
    name: "Jasper AI",
    vendor: "Jasper AI Inc.",
    description: "Comprehensive AI writing assistant specialized in marketing content, blog posts, and business communications with brand voice customization.",
    categories: ["Content Creation", "Marketing AI", "Writing Assistant"],
    use_cases: ["Blog Writing", "Marketing Copy", "Social Media Content", "Email Campaigns", "Product Descriptions", "SEO Content"],
    pricing: {
      has_free_tier: true,
      starting_price: 49,
      pricing_model: "subscription"
    },
    features: ["Brand Voice Training", "SEO Optimization", "Template Library", "Team Collaboration", "Plagiarism Checker", "Multi-language Support"],
    limitations: ["Higher Cost", "Learning Curve", "Requires Content Strategy Knowledge", "Credit-based Limits"],
    api_available: true,
    rating: 4.3,
    reviews_count: 6700,
    average_response_time: "3-8 seconds",
    techLevel: "beginner-intermediate"
  },
  {
    id: 6,
    name: "Runway ML",
    vendor: "Runway AI Inc.",
    description: "Advanced AI platform for video generation, editing, and creative content creation with cutting-edge machine learning tools.",
    categories: ["Video Generation", "Video Editing", "Creative AI"],
    use_cases: ["Video Content Creation", "Film Production", "Marketing Videos", "Social Media Content", "Animation", "Visual Effects"],
    pricing: {
      has_free_tier: true,
      starting_price: 12,
      pricing_model: "credit-based"
    },
    features: ["Text to Video", "Video Editing", "Background Removal", "Motion Tracking", "AI Effects", "Real-time Processing"],
    limitations: ["Steep Learning Curve", "Resource Intensive", "Limited Free Credits", "Requires High-end Hardware"],
    api_available: true,
    rating: 4.2,
    reviews_count: 4300,
    average_response_time: "30-120 seconds",
    techLevel: "intermediate-advanced"
  },
  {
    id: 7,
    name: "Claude",
    vendor: "Anthropic",
    description: "AI assistant focused on being helpful, harmless, and honest with exceptional reasoning capabilities and document analysis features.",
    categories: ["Conversational AI", "Research Assistant", "Document Analysis"],
    use_cases: ["Research Assistance", "Document Analysis", "Writing Help", "Code Review", "Academic Work", "Complex Reasoning"],
    pricing: {
      has_free_tier: true,
      starting_price: 20,
      pricing_model: "subscription"
    },
    features: ["Long Context Understanding", "Document Processing", "Ethical Reasoning", "Code Analysis", "Research Capabilities", "Safety-focused"],
    limitations: ["Limited Availability", "Usage Limits", "No Image Generation", "Regional Restrictions"],
    api_available: true,
    rating: 4.5,
    reviews_count: 5600,
    average_response_time: "2-6 seconds",
    techLevel: "beginner-advanced"
  },
  {
    id: 8,
    name: "Stable Diffusion",
    vendor: "Stability AI",
    description: "Open-source image generation model offering high customization and control over image creation without usage restrictions.",
    categories: ["Image Generation", "Open Source AI", "Creative AI"],
    use_cases: ["Art Creation", "Product Mockups", "Concept Art", "Personal Projects", "Commercial Use", "Research"],
    pricing: {
      has_free_tier: true,
      starting_price: 9,
      pricing_model: "cloud-hosting"
    },
    features: ["Open Source", "High Customization", "No Usage Limits", "Fine-tuning Capable", "Multiple Models", "Community Extensions"],
    limitations: ["Technical Setup Required", "Hardware Requirements", "Learning Curve", "Inconsistent Results"],
    api_available: true,
    rating: 4.1,
    reviews_count: 7200,
    average_response_time: "10-30 seconds",
    techLevel: "intermediate-advanced"
  },
  {
    id: 9,
    name: "Murf AI",
    vendor: "Murf AI",
    description: "Professional AI voice generator creating natural-sounding voiceovers and speech synthesis in multiple languages and emotions.",
    categories: ["Voice Generation", "Text-to-Speech", "Audio AI"],
    use_cases: ["Voiceovers", "Presentations", "E-learning", "Podcasts", "Marketing Videos", "Audiobooks"],
    pricing: {
      has_free_tier: true,
      starting_price: 19,
      pricing_model: "subscription"
    },
    features: ["Natural Voice Synthesis", "Multiple Languages", "Emotion Control", "Voice Cloning", "Background Music", "Commercial Rights"],
    limitations: ["Subscription Required", "Limited Free Tier", "Voice Licensing Restrictions", "Internet Required"],
    api_available: true,
    rating: 4.3,
    reviews_count: 3400,
    average_response_time: "5-15 seconds",
    techLevel: "beginner-intermediate"
  },
  {
    id: 10,
    name: "Zapier AI",
    vendor: "Zapier Inc.",
    description: "Intelligent workflow automation platform that connects apps and automates repetitive tasks with AI-powered triggers and actions.",
    categories: ["Automation", "Workflow AI", "Business Tools"],
    use_cases: ["Business Automation", "Data Processing", "Marketing Automation", "CRM Integration", "Task Management", "Data Synchronization"],
    pricing: {
      has_free_tier: true,
      starting_price: 19.99,
      pricing_model: "subscription"
    },
    features: ["App Integrations", "AI Triggers", "No-code Automation", "Smart Suggestions", "Team Collaboration", "Advanced Logic"],
    limitations: ["Can Be Expensive", "Complex Workflows Need Learning", "Dependent on Third-party APIs", "Limited Free Tier"],
    api_available: true,
    rating: 4.4,
    reviews_count: 11200,
    average_response_time: "instant",
    techLevel: "beginner-intermediate"
  }
];

// Enhanced NLP Processing with OpenAI
async function extractUserIntent(userPrompt) {
  const prompt = `
    Analyze the following user request and extract key information. Return ONLY a valid JSON object with these exact fields:
    
    User Request: "${userPrompt}"
    
    {
      "intent": "primary goal/task they want to accomplish",
      "categories": ["array of AI tool categories needed"],
      "budget": "budget range mentioned or 'not specified'",
      "techLevel": "technical expertise level (beginner/intermediate/advanced) or 'not specified'",
      "useCases": ["array of specific use cases mentioned"],
      "features": ["array of specific features mentioned"],
      "industry": "industry/domain mentioned or 'general'",
      "urgency": "timeline mentioned or 'not specified'",
      "preferences": ["any specific preferences mentioned"]
    }
    
    Be specific and extract multiple categories/use cases if mentioned. If information isn't provided, use "not specified" or empty arrays.
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.1,
      max_tokens: 500
    });

    const content = response.choices[0].message.content.trim();
    
    // Extract JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    // Fallback parsing
    return {
      intent: "general AI assistance",
      categories: [],
      budget: "not specified",
      techLevel: "not specified",
      useCases: [],
      features: [],
      industry: "general",
      urgency: "not specified",
      preferences: []
    };
  } catch (error) {
    console.error('Error extracting intent:', error);
    return null;
  }
}

function filterAITools(intent) {
  const { categories, useCases, techLevel, budget, features } = intent;
  
  let filteredTools = [...aiToolsDatabase];
  let scores = new Map();

  // Initialize scores
  filteredTools.forEach(tool => scores.set(tool.id, 0));

  // Score by categories
  if (categories.length > 0) {
    filteredTools.forEach(tool => {
      categories.forEach(category => {
        if (tool.categories.some(cat => cat.toLowerCase().includes(category.toLowerCase()))) {
          scores.set(tool.id, scores.get(tool.id) + 30);
        }
      });
    });
  }

  // Score by use cases
  if (useCases.length > 0) {
    filteredTools.forEach(tool => {
      useCases.forEach(useCase => {
        if (tool.use_cases.some(uc => uc.toLowerCase().includes(useCase.toLowerCase()))) {
          scores.set(tool.id, scores.get(tool.id) + 25);
        }
      });
    });
  }

  // Score by technical level
  if (techLevel !== 'not specified') {
    filteredTools.forEach(tool => {
      if (tool.techLevel.includes(techLevel)) {
        scores.set(tool.id, scores.get(tool.id) + 15);
      }
    });
  }

  // Score by features
  if (features.length > 0) {
    filteredTools.forEach(tool => {
      features.forEach(feature => {
        if (tool.features.some(tf => tf.toLowerCase().includes(feature.toLowerCase()))) {
          scores.set(tool.id, scores.get(tool.id) + 20);
        }
      });
    });
  }

  // Score by pricing preferences
  if (budget !== 'not specified') {
    const budgetNum = parseInt(budget.replace(/[^0-9]/g, ''));
    if (!isNaN(budgetNum)) {
      filteredTools.forEach(tool => {
        if (tool.pricing.has_free_tier) {
          scores.set(tool.id, scores.get(tool.id) + 10);
        }
        if (tool.pricing.starting_price <= budgetNum) {
          scores.set(tool.id, scores.get(tool.id) + 15);
        }
      });
    }
  }

  // Sort by score and return top tools
  const sortedTools = filteredTools
    .map(tool => ({ ...tool, score: scores.get(tool.id) }))
    .sort((a, b) => b.score - a.score)
    .filter(tool => tool.score > 0);

  return sortedTools.length > 0 ? sortedTools : filteredTools.slice(0, 5);
}

async function generateDetailedRecommendations(userPrompt, intent, filteredTools) {
  const toolsData = filteredTools.slice(0, 5).map(tool => ({
    name: tool.name,
    vendor: tool.vendor,
    description: tool.description,
    categories: tool.categories,
    use_cases: tool.use_cases,
    pricing: tool.pricing,
    features: tool.features,
    limitations: tool.limitations,
    rating: tool.rating,
    techLevel: tool.techLevel
  }));

  const prompt = `
    Based on the user request: "${userPrompt}"
    
    And extracted intent: ${JSON.stringify(intent)}
    
    From these AI tools: ${JSON.stringify(toolsData)}
    
    Provide detailed recommendations in this JSON format:
    {
      "recommendations": [
        {
          "toolName": "tool name",
          "matchScore": number (0-100),
          "reasoning": "detailed explanation why this tool fits their needs",
          "bestFor": "what this tool excels at for their specific use case",
          "considerations": "important things to keep in mind",
          "recommendedPlan": "which pricing tier to start with",
          "learningCurve": "time investment needed",
          "alternatives": "brief mention of similar tools"
        }
      ],
      "summary": "comprehensive summary of recommendations with key insights",
      "nextSteps": "specific actionable next steps for the user",
      "budgetConsiderations": "budget-related advice",
      "implementationOrder": "suggested order to try/implement these tools"
    }
    
    Provide exactly 3-5 tools ranked by relevance. Be detailed and practical.
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      max_tokens: 1500
    });

    const content = response.choices[0].message.content.trim();
    
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    return {
      recommendations: [],
      summary: "I couldn't generate specific recommendations, but the filtered tools should be helpful.",
      nextSteps: "Try refining your requirements or ask for more specific help.",
      budgetConsiderations: "Consider free tiers first to test functionality.",
      implementationOrder: "Start with the highest-rated tools that match your use case."
    };
  } catch (error) {
    console.error('Error generating recommendations:', error);
    return null;
  }
}

// API Endpoints
app.post('/api/recommend', async (req, res) => {
  try {
    const { userPrompt } = req.body;
    
    if (!userPrompt) {
      return res.status(400).json({ error: 'User prompt is required' });
    }

    console.log('Processing request:', userPrompt);
    
    // Step 1: Extract intent using OpenAI
    const intent = await extractUserIntent(userPrompt);
    if (!intent) {
      return res.status(500).json({ error: 'Failed to process user intent' });
    }
    
    console.log('Extracted intent:', intent);
    
    // Step 2: Filter and score AI tools based on intent
    const filteredTools = filterAITools(intent);
    
    // Step 3: Generate detailed recommendations
    const recommendations = await generateDetailedRecommendations(userPrompt, intent, filteredTools);
    
    // Step 4: Combine with full tool details
    const detailedRecommendations = recommendations.recommendations.map(rec => {
      const toolDetails = aiToolsDatabase.find(tool => tool.name === rec.toolName);
      return {
        ...rec,
        toolDetails: toolDetails ? {
          name: toolDetails.name,
          vendor: toolDetails.vendor,
          description: toolDetails.description,
          categories: toolDetails.categories,
          use_cases: toolDetails.use_cases,
          pricing: toolDetails.pricing,
          features: toolDetails.features,
          limitations: toolDetails.limitations,
          api_available: toolDetails.api_available,
          rating: toolDetails.rating,
          reviews_count: toolDetails.reviews_count,
          average_response_time: toolDetails.average_response_time
        } : null
      };
    });
    
    res.json({
      success: true,
      userIntent: intent,
      recommendations: detailedRecommendations,
      summary: recommendations.summary,
      nextSteps: recommendations.nextSteps,
      budgetConsiderations: recommendations.budgetConsiderations,
      implementationOrder: recommendations.implementationOrder,
      totalToolsConsidered: filteredTools.length,
      processingTime: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error in recommendation endpoint:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

// Get all AI tools with enhanced format
app.get('/api/tools', (req, res) => {
  res.json({
    success: true,
    tools: aiToolsDatabase,
    total: aiToolsDatabase.length,
    categories: [...new Set(aiToolsDatabase.flatMap(tool => tool.categories))],
    vendors: [...new Set(aiToolsDatabase.map(tool => tool.vendor))]
  });
});

// Get specific tool by ID with full details
app.get('/api/tools/:id', (req, res) => {
  const toolId = parseInt(req.params.id);
  const tool = aiToolsDatabase.find(t => t.id === toolId);
  
  if (!tool) {
    return res.status(404).json({ error: 'Tool not found' });
  }
  
  res.json({
    success: true,
    tool
  });
});

// Search tools by category with enhanced filtering
app.get('/api/tools/category/:category', (req, res) => {
  const category = req.params.category.toLowerCase();
  const tools = aiToolsDatabase.filter(tool => 
    tool.categories.some(cat => cat.toLowerCase().includes(category))
  );
  
  res.json({
    success: true,
    tools,
    total: tools.length,
    category: req.params.category
  });
});

// Get tools by use case
app.get('/api/tools/usecase/:usecase', (req, res) => {
  const usecase = req.params.usecase.toLowerCase();
  const tools = aiToolsDatabase.filter(tool => 
    tool.use_cases.some(uc => uc.toLowerCase().includes(usecase))
  );
  
  res.json({
    success: true,
    tools,
    total: tools.length,
    usecase: req.params.usecase
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'AI Recommender API is running with OpenAI integration',
    timestamp: new Date().toISOString(),
    version: '2.0.0'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!', details: err.message });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`AI Recommender API v2.0 running on port ${PORT}`);
  console.log('Enhanced with OpenAI integration and detailed tool information');
  console.log('Available endpoints:');
  console.log('  POST /api/recommend - Get detailed AI recommendations');
  console.log('  GET /api/tools - Get all AI tools with full details');
  console.log('  GET /api/tools/:id - Get specific tool');
  console.log('  GET /api/tools/category/:category - Get tools by category');
  console.log('  GET /api/tools/usecase/:usecase - Get tools by use case');
  console.log('  GET /health - Health check');
});

module.exports = app;