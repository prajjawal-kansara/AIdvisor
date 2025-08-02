const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// AI Tool Discovery and Recommendation using Gemini
async function discoverAndRecommendAITools(userPrompt) {
  const prompt = `
    Act as an expert AI tools researcher and consultant. Based on this user request: "${userPrompt}"

    Please research and recommend the BEST AI tools available globally that can solve this problem. Consider tools from all major providers: OpenAI, Google, Microsoft, Meta, Anthropic, Stability AI, Midjourney, RunwayML, ElevenLabs, Jasper, Copy.ai, and other emerging AI companies.

    Return your response in this EXACT JSON format:
    {
      "userIntent": {
        "problem": "clear description of what user wants to solve",
        "category": "primary AI category needed",
        "useCase": "specific use case",
        "techLevel": "beginner/intermediate/advanced",
        "budget": "estimated budget range or free"
      },
      "recommendations": [
        {
          "name": "Tool Name",
          "vendor": "Company Name",
          "description": "Detailed description of what this tool does and why it's perfect for this use case",
          "categories": ["Primary Category", "Secondary Category"],
          "useCases": ["Specific Use Case 1", "Use Case 2", "Use Case 3"],
          "pricing": {
            "hasFreeTier": true/false,
            "startingPrice": number,
            "pricingModel": "subscription/pay-per-use/one-time",
            "freeCredits": "description of free offering"
          },
          "features": ["Key Feature 1", "Feature 2", "Feature 3", "Feature 4"],
          "pros": ["Major Advantage 1", "Advantage 2", "Advantage 3"],
          "cons": ["Limitation 1", "Limitation 2"],
          "matchScore": number (70-100),
          "reasoning": "Detailed explanation why this tool is perfect for their specific need",
          "bestFor": "What this tool excels at for their use case",
          "gettingStarted": "Step-by-step guide to get started",
          "apiAvailable": true/false,
          "rating": number (4.0-5.0),
          "reviewsCount": estimated_number,
          "responseTime": "typical response time",
          "website": "official website URL",
          "alternatives": ["Alternative Tool 1", "Alternative 2"]
        }
      ],
      "summary": "Comprehensive analysis of the AI landscape for this problem",
      "marketAnalysis": "Current state of AI tools in this category",
      "trendingTools": ["Tool gaining popularity", "Emerging solution"],
      "budgetBreakdown": "Detailed cost analysis and recommendations",
      "implementationStrategy": "Step-by-step plan to implement these AI solutions",
      "futureConsiderations": "What to watch for in this AI space"
    }

    Requirements:
    - Recommend 3-5 REAL, currently available AI tools
    - Include both well-known and emerging tools
    - Provide accurate, up-to-date information
    - Consider different budget levels (free, affordable, premium)
    - Include specific websites and getting started guides
    - Focus on tools that are actively maintained and have good user reviews
    - Consider the user's technical level and specific requirements

    BE COMPREHENSIVE and provide tools that actually exist and are currently available. Include pricing information, features, and real websites.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('Raw Gemini response:', text.substring(0, 500) + '...');
    
    // Clean and extract JSON
    const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
    const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      const parsedResponse = JSON.parse(jsonMatch[0]);
      
      // Validate and enhance the response
      if (parsedResponse.recommendations && Array.isArray(parsedResponse.recommendations)) {
        return parsedResponse;
      }
    }
    
    throw new Error('Invalid JSON structure received');
    
  } catch (error) {
    console.error('Error in AI tool discovery:', error);
    throw error;
  }
}

// Get detailed information about a specific AI tool
async function getDetailedToolInfo(toolName) {
  const prompt = `
    Provide comprehensive, up-to-date information about the AI tool: "${toolName}"

    Return detailed information in this JSON format:
    {
      "name": "Official tool name",
      "vendor": "Company name",
      "description": "Detailed description of capabilities",
      "categories": ["Category 1", "Category 2"],
      "useCases": ["Use case 1", "Use case 2", "Use case 3"],
      "pricing": {
        "hasFreeTier": true/false,
        "plans": [
          {
            "name": "Plan name",
            "price": number,
            "features": ["feature 1", "feature 2"],
            "limits": "usage limits"
          }
        ]
      },
      "features": ["Feature 1", "Feature 2", "Feature 3"],
      "pros": ["Advantage 1", "Advantage 2"],
      "cons": ["Limitation 1", "Limitation 2"],
      "technicalDetails": {
        "apiAvailable": true/false,
        "integrations": ["Platform 1", "Platform 2"],
        "supportedFormats": ["Format 1", "Format 2"]
      },
      "userReviews": {
        "rating": number,
        "reviewCount": number,
        "commonPraise": ["What users love"],
        "commonComplaints": ["Common issues"]
      },
      "gettingStarted": {
        "steps": ["Step 1", "Step 2", "Step 3"],
        "timeToFirstResult": "estimated time",
        "learningCurve": "beginner/intermediate/advanced"
      },
      "website": "official website",
      "documentation": "documentation URL",
      "community": "community/support channels",
      "lastUpdated": "recent update info",
      "alternatives": ["Alternative 1", "Alternative 2"]
    }

    Provide REAL, accurate, current information only.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
    const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    throw new Error('Could not parse tool information');
    
  } catch (error) {
    console.error('Error getting tool details:', error);
    throw error;
  }
}

// Discover AI tools by category
async function discoverToolsByCategory(category) {
  const prompt = `
    Research and list the top AI tools in the "${category}" category. Include both popular and emerging tools.

    Return in this JSON format:
    {
      "category": "${category}",
      "overview": "Brief overview of this AI category",
      "marketSize": "Information about market size and growth",
      "tools": [
        {
          "name": "Tool Name",
          "vendor": "Company",
          "description": "Brief description",
          "pricing": "Pricing info",
          "popularity": "High/Medium/Low",
          "website": "URL",
          "keyFeatures": ["Feature 1", "Feature 2"]
        }
      ],
      "trends": "Current trends in this category",
      "futureOutlook": "Where this category is heading"
    }

    Include 5-10 real tools that are currently available.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
    const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    throw new Error('Could not parse category information');
    
  } catch (error) {
    console.error('Error discovering category tools:', error);
    throw error;
  }
}

// Get AI industry trends and insights
async function getAIIndustryInsights() {
  const prompt = `
    Provide current insights about the AI tools industry, trends, and market analysis.

    Return in this JSON format:
    {
      "marketOverview": {
        "totalTools": "estimated number",
        "marketValue": "current market size",
        "growthRate": "annual growth rate",
        "keyPlayers": ["Company 1", "Company 2", "Company 3"]
      },
      "trendingCategories": [
        {
          "category": "Category name",
          "growth": "growth percentage",
          "description": "why it's trending",
          "examples": ["Tool 1", "Tool 2"]
        }
      ],
      "emergingTools": [
        {
          "name": "Tool name",
          "category": "Category",
          "whyTrending": "Reason for popularity",
          "potential": "Future potential"
        }
      ],
      "investmentTrends": "Where money is flowing",
      "userAdoptionTrends": "How users are adopting AI",
      "futureOutlook": "Predictions for next 12 months",
      "recommendations": "What to watch for"
    }

    Provide current, accurate market intelligence.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
    const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    throw new Error('Could not parse industry insights');
    
  } catch (error) {
    console.error('Error getting industry insights:', error);
    throw error;
  }
}

// API Endpoints

// Main recommendation endpoint - the core feature
app.post('/api/recommend', async (req, res) => {
  try {
    const { userPrompt } = req.body;
    
    if (!userPrompt) {
      return res.status(400).json({ error: 'User prompt is required' });
    }

    console.log('Processing AI discovery request:', userPrompt);
    
    const startTime = Date.now();
    
    // Use Gemini to discover and recommend AI tools from the entire ecosystem
    const recommendations = await discoverAndRecommendAITools(userPrompt);
    
    const processingTime = Date.now() - startTime;
    
    res.json({
      success: true,
      query: userPrompt,
      ...recommendations,
      metadata: {
        processingTimeMs: processingTime,
        timestamp: new Date().toISOString(),
        totalRecommendations: recommendations.recommendations?.length || 0,
        aiPowered: true
      }
    });
    
  } catch (error) {
    console.error('Error in AI tool recommendation:', error);
    res.status(500).json({ 
      error: 'Failed to discover AI tools', 
      details: error.message,
      suggestion: 'Try rephrasing your request or check if Gemini API key is valid'
    });
  }
});

// Get detailed information about a specific AI tool
app.get('/api/tools/:toolName', async (req, res) => {
  try {
    const { toolName } = req.params;
    
    console.log('Getting detailed info for:', toolName);
    
    const toolInfo = await getDetailedToolInfo(toolName);
    
    res.json({
      success: true,
      tool: toolInfo,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error getting tool details:', error);
    res.status(500).json({ 
      error: 'Failed to get tool details', 
      details: error.message 
    });
  }
});

// Discover tools by category
app.get('/api/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    
    console.log('Discovering tools in category:', category);
    
    const categoryInfo = await discoverToolsByCategory(category);
    
    res.json({
      success: true,
      ...categoryInfo,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error discovering category tools:', error);
    res.status(500).json({ 
      error: 'Failed to discover category tools', 
      details: error.message 
    });
  }
});

// Get AI industry insights and trends
app.get('/api/insights', async (req, res) => {
  try {
    console.log('Getting AI industry insights...');
    
    const insights = await getAIIndustryInsights();
    
    res.json({
      success: true,
      insights,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error getting industry insights:', error);
    res.status(500).json({ 
      error: 'Failed to get industry insights', 
      details: error.message 
    });
  }
});

// Search for AI tools with natural language
app.post('/api/search', async (req, res) => {
  try {
    const { query, filters } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    console.log('Searching AI tools for:', query);
    
    let searchPrompt = `Search for AI tools related to: "${query}"`;
    
    if (filters) {
      if (filters.budget) searchPrompt += ` Budget: ${filters.budget}`;
      if (filters.category) searchPrompt += ` Category: ${filters.category}`;
      if (filters.techLevel) searchPrompt += ` Technical Level: ${filters.techLevel}`;
    }
    
    const results = await discoverAndRecommendAITools(searchPrompt);
    
    res.json({
      success: true,
      query,
      filters,
      ...results,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error in AI tools search:', error);
    res.status(500).json({ 
      error: 'Failed to search AI tools', 
      details: error.message 
    });
  }
});

// Compare multiple AI tools
app.post('/api/compare', async (req, res) => {
  try {
    const { tools } = req.body;
    
    if (!tools || !Array.isArray(tools) || tools.length < 2) {
      return res.status(400).json({ error: 'At least 2 tools required for comparison' });
    }

    const toolsList = tools.join(', ');
    const prompt = `
      Compare these AI tools in detail: ${toolsList}
      
      Provide a comprehensive comparison in this JSON format:
      {
        "comparison": {
          "tools": ["${tools.join('", "')}"],
          "categories": "Common categories they serve",
          "overview": "Brief comparison overview"
        },
        "detailedComparison": [
          {
            "aspect": "Pricing",
            "analysis": {
              ${tools.map(tool => `"${tool}": "pricing analysis"`).join(',\n              ')}
            }
          },
          {
            "aspect": "Features",
            "analysis": {
              ${tools.map(tool => `"${tool}": "feature analysis"`).join(',\n              ')}
            }
          },
          {
            "aspect": "Ease of Use",
            "analysis": {
              ${tools.map(tool => `"${tool}": "usability analysis"`).join(',\n              ')}
            }
          },
          {
            "aspect": "Performance",
            "analysis": {
              ${tools.map(tool => `"${tool}": "performance analysis"`).join(',\n              ')}
            }
          }
        ],
        "recommendations": {
          "bestFor": {
            ${tools.map(tool => `"${tool}": "what this tool is best for"`).join(',\n            ')}
          },
          "winner": "Overall recommendation with reasoning"
        },
        "summary": "Detailed comparison summary and final recommendations"
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
    const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      const comparisonData = JSON.parse(jsonMatch[0]);
      
      res.json({
        success: true,
        ...comparisonData,
        timestamp: new Date().toISOString()
      });
    } else {
      throw new Error('Could not parse comparison data');
    }
    
  } catch (error) {
    console.error('Error comparing tools:', error);
    res.status(500).json({ 
      error: 'Failed to compare tools', 
      details: error.message 
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'AI Tools Discovery Platform - Powered by Gemini AI',
    description: 'Real-time AI tool discovery and recommendations from the entire AI ecosystem',
    features: [
      'Real-time AI tool discovery',
      'Intelligent recommendations',
      'Industry insights',
      'Tool comparisons',
      'Market analysis'
    ],
    timestamp: new Date().toISOString(),
    version: '3.0.0'
  });
});

// Get available API endpoints
app.get('/api/endpoints', (req, res) => {
  res.json({
    success: true,
    endpoints: {
      'POST /api/recommend': 'Get AI tool recommendations based on natural language description',
      'GET /api/tools/:toolName': 'Get detailed information about a specific AI tool',
      'GET /api/category/:category': 'Discover tools in a specific category',
      'GET /api/insights': 'Get AI industry insights and trends',
      'POST /api/search': 'Search for AI tools with filters',
      'POST /api/compare': 'Compare multiple AI tools',
      'GET /health': 'Health check',
      'GET /api/endpoints': 'This endpoint - list all available endpoints'
    },
    description: 'Complete AI Tools Discovery Platform API'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Internal server error',
    details: err.message,
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Endpoint not found',
    availableEndpoints: '/api/endpoints',
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 AI Tools Discovery Platform running on port ${PORT}`);
  console.log('🤖 Powered by Gemini AI for real-time tool discovery');
  console.log('🌐 Discovering AI tools from the entire ecosystem');
  console.log('');
  console.log('📋 Available endpoints:');
  console.log('  POST /api/recommend - Get personalized AI tool recommendations');
  console.log('  GET /api/tools/:toolName - Get detailed tool information');
  console.log('  GET /api/category/:category - Discover tools by category');
  console.log('  GET /api/insights - Get industry insights and trends');
  console.log('  POST /api/search - Search AI tools with filters');
  console.log('  POST /api/compare - Compare multiple AI tools');
  console.log('  GET /health - Health check');
  console.log('  GET /api/endpoints - List all endpoints');
  console.log('');
  console.log('💡 This platform discovers AI tools from the ENTIRE ecosystem!');
});

module.exports = app;