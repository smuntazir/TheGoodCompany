# AI Feature Quick Start 🚀

## What Was Added

Your social outing planner now has **AI-powered brainstorming**! Chat with AI assistants (Gemini/GPT/Claude) to discover new places and activities.

## Quick Setup (2 Minutes)

### Option 1: Google Gemini (Free & Recommended)

1. **Get Free API Key**
   - Visit: https://makersuite.google.com/app/apikey
   - Click "Create API Key"
   - Copy the key

2. **Set Environment Variables**
   ```bash
   export LLM_PROVIDER=gemini
   export LLM_API_KEY=your-api-key-here
   ```

3. **Start the App**
   ```bash
   source venv/bin/activate
   python app.py
   ```

4. **Open Browser**
   - Go to: http://localhost:8080
   - Login and look for "AI Brainstorming" section in sidebar

## How It Works

1. **Chat with AI**: Type "Suggest fun weekend activities"
2. **Get Suggestions**: AI extracts specific POIs/AOIs in special format
3. **Preview & Approve**: Click "✓ Add to My List" to create items
4. **Drag to Calendar**: New items appear in your lists, ready to drag!

## Example Conversation

```
You: I'm looking for good restaurants in downtown

AI: Here are some great options:
[POI: The French Bistro | 123 Main St | Authentic French cuisine | food]
[POI: Sushi Paradise | 456 Oak Ave | Fresh sushi and sake | food]

You: [Preview cards appear with "Add to My List" buttons]
```

## Context-Aware

The AI sees your:
- ✅ Current Places of Interest
- ✅ Current Activities of Interest  
- ✅ Scheduled Events

This helps it make personalized suggestions!

## Switching Providers

**Google Gemini (Free):**
```bash
export LLM_PROVIDER=gemini
export LLM_API_KEY=your-gemini-key
```

**OpenAI GPT:**
```bash
export LLM_PROVIDER=openai
export LLM_API_KEY=sk-your-openai-key
```

**Anthropic Claude:**
```bash
export LLM_PROVIDER=claude
export LLM_API_KEY=sk-ant-your-claude-key
```

## Troubleshooting

**"AI Assistant Not Configured" warning?**
- Environment variables not set
- Solution: Run the export commands above and restart Flask

**No suggestions appearing?**
- Be explicit: "Suggest 3 restaurants to add"
- AI looks for [POI: ...] or [AOI: ...] format

## Full Documentation

See [AI_SETUP.md](./AI_SETUP.md) for:
- Detailed setup for all providers
- Cost estimates
- Advanced configuration
- Full troubleshooting guide

---

**Ready to brainstorm!** 🎉
