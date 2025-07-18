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

// AI Tools Database
const aiToolsDatabase = [
  {
    id: 1,
    name: "ChatGPT",
    category: "Conversational AI",
    description: "Advanced conversational AI for text generation, coding, and problem-solving",
    pricing: "$20/month for Plus",
    features: ["Text generation", "Code assistance", "Problem solving", "Creative writing"],
    useCases: ["Customer support", "Content creation", "Programming help", "Research"],
    techLevel: "beginner-advanced",
    pros: ["Versatile", "User-friendly", "Strong reasoning"],
    cons: ["Usage limits", "Can be expensive for heavy use"]
  },
  {
    id: 2,
    name: "Midjourney",
    category: "Image Generation",
    description: "AI-powered image generation from text prompts",
    pricing: "$10-60/month",
    features: ["Text-to-image", "Style variations", "High resolution", "Commercial use"],
    useCases: ["Marketing visuals", "Art creation", "Prototyping", "Social media"],
    techLevel: "beginner-intermediate",
    pros: ["High quality images", "Creative styles", "Active community"],
    cons: ["Discord-based interface", "Limited control"]
  },
  {
    id: 3,
    name: "Jasper",
    category: "Content Creation",
    description: "AI writing assistant for marketing and business content",
    pricing: "$49-125/month",
    features: ["Blog writing", "Ad copy", "Social media", "SEO optimization"],
    useCases: ["Marketing content", "Blog posts", "Email campaigns", "Social media"],
    techLevel: "beginner-intermediate",
    pros: ["Marketing focused", "Templates", "Team collaboration"],
    cons: ["Higher cost", "Learning curve"]
  },
  {
    id: 4,
    name: "GitHub Copilot",
    category: "Code Generation",
    description: "AI pair programmer for code completion and generation",
    pricing: "$10/month individual, $19/month business",
    features: ["Code completion", "Function generation", "Multiple languages", "IDE integration"],
    useCases: ["Software development", "Code review", "Learning programming"],
    techLevel: "intermediate-advanced",
    pros: ["IDE integration", "Multiple languages", "Context-aware"],
    cons: ["Requires programming knowledge", "Subscription based"]
  },
  {
    id: 5,
    name: "Runway ML",
    category: "Video Generation",
    description: "AI tools for video editing and generation",
    pricing: "$12-76/month",
    features: ["Video generation", "Background removal", "Motion tracking", "AI effects"],
    useCases: ["Video editing", "Content creation", "Film production", "Marketing videos"],
    techLevel: "intermediate-advanced",
    pros: ["Professional features", "Video focus", "Creative tools"],
    cons: ["Steep learning curve", "Resource intensive"]
  },
  {
    id: 6,
    name: "Stable Diffusion",
    category: "Image Generation",
    description: "Open-source image generation model",
    pricing: "Free (self-hosted) or $9-49/month (cloud)",
    features: ["Text-to-image", "Image-to-image", "Inpainting", "Customizable"],
    useCases: ["Art creation", "Product mockups", "Concept art", "Personal projects"],
    techLevel: "intermediate-advanced",
    pros: ["Open source", "Highly customizable", "No usage limits"],
    cons: ["Technical setup required", "Hardware requirements"]
  },
  {
    id: 7,
    name: "Notion AI",
    category: "Productivity",
    description: "AI writing assistant integrated into Notion workspace",
    pricing: "$8-10/month per user",
    features: ["Writing assistance", "Summarization", "Translation", "Brainstorming"],
    useCases: ["Note-taking", "Project management", "Team collaboration", "Documentation"],
    techLevel: "beginner-intermediate",
    pros: ["Notion integration", "Productivity focused", "Team features"],
    cons: ["Requires Notion subscription", "Limited to Notion ecosystem"]
  },
  {
    id: 8,
    name: "Murf AI",
    category: "Voice Generation",
    description: "AI voice generator for voiceovers and speech synthesis",
    pricing: "$19-79/month",
    features: ["Text-to-speech", "Voice cloning", "Multiple languages", "Emotions"],
    useCases: ["Voiceovers", "Presentations", "E-learning", "Podcasts"],
    techLevel: "beginner-intermediate",
    pros: ["Natural voices", "Multiple languages", "Easy to use"],
    cons: ["Subscription required", "Limited free tier"]
  },
  {
    id: 9,
    name: "Zapier AI",
    category: "Automation",
    description: "AI-powered workflow automation",
    pricing: "$19.99-599/month",
    features: ["Workflow automation", "AI triggers", "Integration", "Smart suggestions"],
    useCases: ["Business automation", "Data processing", "Marketing automation", "Productivity"],
    techLevel: "beginner-intermediate",
    pros: ["Extensive integrations", "No-code", "AI-powered"],
    cons: ["Can be expensive", "Complex workflows need learning"]
  },
  {
    id: 10,
    name: "Anthropic Claude",
    category: "Conversational AI",
    description: "AI assistant focused on being helpful, harmless, and honest",
    pricing: "$20/month for Pro",
    features: ["Conversational AI", "Document analysis", "Code assistance", "Research"],
    useCases: ["Research assistance", "Writing help", "Analysis", "Problem solving"],
    techLevel: "beginner-advanced",
    pros: ["Strong reasoning", "Document handling", "Ethical focus"],
    cons: ["Limited availability", "Usage limits"]
  }
];

// NLP Processing Functions
async function extractUserIntent(userPrompt) {
  const prompt = `
    Analyze the following user request and extract key information in JSON format:
    
    User Request: "${userPrompt}"
    
    Extract and return ONLY a JSON object with these fields:
    {
      "intent": "primary goal/task they want to accomplish",
      "category": "type of AI tool needed (e.g., 'image generation', 'text generation', 'code assistance', 'automation', etc.)",
      "budget": "budget range mentioned or 'not specified'",
      "techLevel": "technical expertise level (beginner/intermediate/advanced) or 'not specified'",
      "useCase": "specific use case or application",
      "features": ["array of specific features mentioned"],
      "industry": "industry/domain mentioned or 'general'",
      "urgency": "timeline mentioned or 'not specified'"
    }
    
    Be concise and specific. If information isn't provided, use "not specified".
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    // Fallback parsing
    return {
      intent: "general AI assistance",
      category: "not specified",
      budget: "not specified",
      techLevel: "not specified",
      useCase: "general",
      features: [],
      industry: "general",
      urgency: "not specified"
    };
  } catch (error) {
    console.error('Error extracting intent:', error);
    return null;
  }
}

function filterAITools(intent) {
  const { category, budget, techLevel, useCase, features } = intent;
  
  let filteredTools = [...aiToolsDatabase];
  
  // Filter by category
  if (category !== 'not specified') {
    filteredTools = filteredTools.filter(tool => 
      tool.category.toLowerCase().includes(category.toLowerCase()) ||
      tool.useCases.some(uc => uc.toLowerCase().includes(category.toLowerCase()))
    );
  }
  
  // Filter by use case
  if (useCase !== 'general' && useCase !== 'not specified') {
    filteredTools = filteredTools.filter(tool =>
      tool.useCases.some(uc => uc.toLowerCase().includes(useCase.toLowerCase())) ||
      tool.description.toLowerCase().includes(useCase.toLowerCase())
    );
  }
  
  // Filter by technical level
  if (techLevel !== 'not specified') {
    filteredTools = filteredTools.filter(tool =>
      tool.techLevel.includes(techLevel)
    );
  }
  
  // Filter by features
  if (features.length > 0) {
    filteredTools = filteredTools.filter(tool =>
      features.some(feature =>
        tool.features.some(tf => tf.toLowerCase().includes(feature.toLowerCase()))
      )
    );
  }
  
  return filteredTools;
}

async function generateRecommendations(userPrompt, intent, filteredTools) {
  const toolsData = filteredTools.map(tool => ({
    name: tool.name,
    category: tool.category,
    description: tool.description,
    pricing: tool.pricing,
    pros: tool.pros,
    cons: tool.cons,
    useCases: tool.useCases
  }));

  const prompt = `
    Based on the user request: "${userPrompt}"
    
    And extracted intent: ${JSON.stringify(intent)}
    
    From these AI tools: ${JSON.stringify(toolsData)}
    
    Provide personalized recommendations in this JSON format:
    {
      "recommendations": [
        {
          "toolName": "tool name",
          "matchScore": "percentage (0-100)",
          "reasoning": "why this tool fits their needs",
          "bestFor": "what this tool excels at for their use case",
          "considerations": "things to keep in mind"
        }
      ],
      "summary": "brief summary of recommendations",
      "nextSteps": "suggested next steps for the user"
    }
    
    Rank by relevance (max 5 tools). Be conversational and helpful.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    return {
      recommendations: [],
      summary: "I couldn't generate specific recommendations, but the filtered tools above should be helpful.",
      nextSteps: "Try refining your requirements or ask for more specific help."
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
    
    // Step 1: Extract intent using NLP
    const intent = await extractUserIntent(userPrompt);
    if (!intent) {
      return res.status(500).json({ error: 'Failed to process user intent' });
    }
    
    console.log('Extracted intent:', intent);
    
    // Step 2: Filter AI tools based on intent
    const filteredTools = filterAITools(intent);
    
    // Step 3: Generate personalized recommendations
    const recommendations = await generateRecommendations(userPrompt, intent, filteredTools);
    
    // Step 4: Combine with tool details
    const detailedRecommendations = recommendations.recommendations.map(rec => {
      const toolDetails = aiToolsDatabase.find(tool => tool.name === rec.toolName);
      return {
        ...rec,
        toolDetails
      };
    });
    
    res.json({
      success: true,
      userIntent: intent,
      recommendations: detailedRecommendations,
      summary: recommendations.summary,
      nextSteps: recommendations.nextSteps,
      totalToolsConsidered: filteredTools.length
    });
    
  } catch (error) {
    console.error('Error in recommendation endpoint:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all AI tools
app.get('/api/tools', (req, res) => {
  res.json({
    success: true,
    tools: aiToolsDatabase,
    total: aiToolsDatabase.length
  });
});

// Get specific tool by ID
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

// Search tools by category
app.get('/api/tools/category/:category', (req, res) => {
  const category = req.params.category.toLowerCase();
  const tools = aiToolsDatabase.filter(tool => 
    tool.category.toLowerCase().includes(category)
  );
  
  res.json({
    success: true,
    tools,
    total: tools.length
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'AI Recommender API is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`AI Recommender API running on port ${PORT}`);
  console.log('Available endpoints:');
  console.log('  POST /api/recommend - Get AI recommendations');
  console.log('  GET /api/tools - Get all AI tools');
  console.log('  GET /api/tools/:id - Get specific tool');
  console.log('  GET /api/tools/category/:category - Get tools by category');
  console.log('  GET /health - Health check');
});

module.exports = app;