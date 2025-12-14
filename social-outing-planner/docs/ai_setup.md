# AI Assistant Setup Guide

This guide will help you configure the AI brainstorming feature in your social outing planner. The app supports multiple AI providers: **Google Gemini**, **OpenAI GPT**, and **Anthropic Claude**.

## Table of Contents
- [Quick Start](#quick-start)
- [Supported Providers](#supported-providers)
- [Getting API Keys](#getting-api-keys)
- [Configuration](#configuration)
- [Usage](#usage)
- [Troubleshooting](#troubleshooting)

---

## Quick Start

1. Choose an AI provider (Gemini, OpenAI, or Claude)
2. Get an API key from the provider
3. Set environment variables
4. Install dependencies and run the app

---

## Supported Providers

### Google Gemini (Recommended for Free Tier)
- **Model**: `gemini-pro`
- **Free Tier**: Yes (60 requests/minute)
- **Best For**: General use, cost-effective
- **Provider Name**: `gemini`

### OpenAI GPT
- **Model**: `gpt-3.5-turbo`
- **Free Tier**: $5 credit for new accounts
- **Best For**: High-quality responses
- **Provider Name**: `openai` or `gpt`

### Anthropic Claude
- **Model**: `claude-3-sonnet-20240229`
- **Free Tier**: Limited trial
- **Best For**: Detailed, nuanced responses
- **Provider Name**: `claude` or `anthropic`

---

## Getting API Keys

### Option 1: Google Gemini (Free)

1. **Go to Google AI Studio**
   - Visit: https://makersuite.google.com/app/apikey
   - Sign in with your Google account

2. **Create API Key**
   - Click "Create API Key"
   - Select or create a Google Cloud project
   - Copy the generated API key

3. **Save Your Key**
   ```bash
   # Example key format
   AIzaSyB...your-key-here...xyz123
   ```

### Option 2: OpenAI (Paid)

1. **Sign Up for OpenAI**
   - Visit: https://platform.openai.com/signup
   - Create an account

2. **Add Billing**
   - Go to: https://platform.openai.com/account/billing
   - Add payment method (new accounts get $5 credit)

3. **Create API Key**
   - Visit: https://platform.openai.com/api-keys
   - Click "Create new secret key"
   - Copy and save the key immediately

4. **Save Your Key**
   ```bash
   # Example key format
   sk-...your-key-here...
   ```

### Option 3: Anthropic Claude (Paid)

1. **Sign Up for Anthropic**
   - Visit: https://console.anthropic.com/
   - Create an account

2. **Add Payment**
   - Set up billing information

3. **Create API Key**
   - Go to API Keys section
   - Generate a new key
   - Copy and save immediately

4. **Save Your Key**
   ```bash
   # Example key format
   sk-ant-...your-key-here...
   ```

---

## Configuration

### Method 1: Environment Variables (Recommended)

**For macOS/Linux:**

1. **Create or edit your shell configuration file:**
   ```bash
   # For bash users
   nano ~/.bash_profile
   
   # For zsh users (macOS default)
   nano ~/.zshrc
   ```

2. **Add these lines:**
   ```bash
   # AI Provider Configuration
   export LLM_PROVIDER="gemini"  # Options: gemini, openai, gpt, claude, anthropic
   export LLM_API_KEY="your-api-key-here"
   ```

3. **Save and reload:**
   ```bash
   # For bash
   source ~/.bash_profile
   
   # For zsh
   source ~/.zshrc
   ```

**For Windows:**

1. **Open System Environment Variables:**
   - Search "Environment Variables" in Start Menu
   - Click "Environment Variables" button

2. **Add New Variables:**
   - Variable: `LLM_PROVIDER`, Value: `gemini`
   - Variable: `LLM_API_KEY`, Value: your-api-key-here

3. **Restart your terminal/IDE**

### Method 2: .env File (Development)

1. **Create `.env` file in project root:**
   ```bash
   cd /path/to/social-outing-planner
   touch .env
   ```

2. **Add configuration:**
   ```env
   LLM_PROVIDER=gemini
   LLM_API_KEY=your-api-key-here
   JWT_SECRET=your-secret-key
   FLASK_DEBUG=True
   PORT=8080
   ```

3. **Load .env in your terminal (optional):**
   ```bash
   export $(cat .env | xargs)
   ```

### Method 3: Inline (Testing Only)

```bash
LLM_PROVIDER=gemini LLM_API_KEY=your-key python app.py
```

---

## Installation & Running

### 1. Install Python Dependencies

**With virtual environment (recommended):**
```bash
# Create virtual environment
python3 -m venv venv

# Activate it
source venv/bin/activate  # macOS/Linux
# or
venv\Scripts\activate     # Windows

# Install dependencies
pip install -r requirements.txt
```

**Without virtual environment:**
```bash
pip install -r requirements.txt
```

### 2. Install React Dependencies

```bash
cd client
npm install
cd ..
```

### 3. Run the Application

**Using the start script:**
```bash
chmod +x start.sh
./start.sh
```

**Manual start:**
```bash
# Terminal 1 - Backend
source venv/bin/activate
python app.py

# Terminal 2 - Frontend
cd client
npm start
```

### 4. Access the App

- Open browser to: http://localhost:3000
- Login or register
- Look for "AI Brainstorming" section in the sidebar

---

## Usage

### How to Use AI Brainstorming

1. **Start a Conversation**
   - Type in the chat input at the bottom
   - Example: "I'm looking for fun outdoor activities"

2. **Get Suggestions**
   - The AI will suggest places and activities
   - It sees your current POIs/AOIs for better context

3. **Review Suggestions**
   - AI extracts specific POI/AOI recommendations
   - Shows preview with details

4. **Approve or Skip**
   - Click "✓ Add to My List" to create the item
   - Click "✕ Skip" to dismiss

5. **Drag to Calendar**
   - Approved items appear in your POI/AOI lists
   - Drag them to calendar dates to create events

### Example Prompts

**For Places (POIs):**
- "Suggest some good Italian restaurants in downtown"
- "I need a quiet coffee shop for working"
- "Where can I go for a romantic date?"

**For Activities (AOIs):**
- "What outdoor activities can I do this weekend?"
- "Suggest some team building activities"
- "I want to learn a new hobby, any ideas?"

**Mixed Suggestions:**
- "Plan a day trip for 2 people interested in art"
- "I have 3 hours free on Saturday, what should I do?"
- "Suggest activities for a birthday celebration"

### AI Response Format

The AI will use special tags for structured suggestions:

**Place Format:**
```
[POI: Restaurant Name | 123 Main St | Great Italian food | food]
```

**Activity Format:**
```
[AOI: Hiking | Outdoor adventure in nearby trails | 3 hours | nature]
```

---

## Troubleshooting

### "AI Assistant Not Configured" Warning

**Cause:** Missing environment variables

**Solution:**
1. Verify environment variables are set:
   ```bash
   echo $LLM_PROVIDER
   echo $LLM_API_KEY
   ```

2. If empty, set them:
   ```bash
   export LLM_PROVIDER=gemini
   export LLM_API_KEY=your-key-here
   ```

3. Restart the Flask server

### "AI service error" Message

**Common Causes:**
1. Invalid API key
2. API quota exceeded
3. Network issues
4. Wrong provider name

**Solutions:**
1. **Verify API Key:**
   ```bash
   # Test Gemini
   curl https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=YOUR_KEY
   
   # Check for 200 response
   ```

2. **Check Quota:**
   - Gemini: https://makersuite.google.com/app/apikey
   - OpenAI: https://platform.openai.com/usage
   - Claude: https://console.anthropic.com/settings/limits

3. **Verify Provider Name:**
   - Must be: `gemini`, `openai`, `gpt`, `claude`, or `anthropic`

### Import Errors

**Error:** `ModuleNotFoundError: No module named 'google.generativeai'`

**Solution:**
```bash
source venv/bin/activate  # Activate venv first!
pip install -r requirements.txt
```

### No Suggestions Appearing

**Cause:** AI not extracting items properly

**Solution:** Use explicit phrasing:
- Instead of: "tell me about restaurants"
- Try: "suggest 3 restaurants I should visit"

Or manually add items using the "Add Place" / "Add Activity" buttons

---

## Switching Between Providers

You can easily switch providers without code changes:

```bash
# Switch to Gemini
export LLM_PROVIDER=gemini
export LLM_API_KEY=your-gemini-key

# Switch to OpenAI
export LLM_PROVIDER=openai
export LLM_API_KEY=your-openai-key

# Switch to Claude
export LLM_PROVIDER=claude
export LLM_API_KEY=your-claude-key
```

Then restart the Flask server.

---

## Cost Estimates

### Google Gemini
- **Free Tier**: 60 requests/minute
- **Cost**: Free for most use cases
- **Best For**: Development and personal use

### OpenAI GPT-3.5-Turbo
- **Cost**: ~$0.002 per 1K tokens
- **Typical Chat**: ~$0.01 per conversation
- **Best For**: Production with moderate traffic

### Anthropic Claude
- **Cost**: ~$0.008 per 1K tokens
- **Typical Chat**: ~$0.03 per conversation
- **Best For**: High-quality, detailed responses

---

## Security Best Practices

1. **Never commit API keys to git:**
   ```bash
   # .gitignore already includes
   .env
   venv/
   ```

2. **Use environment variables in production**

3. **Rotate keys regularly**

4. **Monitor usage dashboards**

5. **Set spending limits** (OpenAI, Claude)

---

## Additional Resources

- **Google Gemini Docs**: https://ai.google.dev/docs
- **OpenAI API Docs**: https://platform.openai.com/docs
- **Anthropic Claude Docs**: https://docs.anthropic.com/
- **Flask Environment Variables**: https://flask.palletsprojects.com/en/2.3.x/config/

---

## Need Help?

If you encounter issues:
1. Check the troubleshooting section above
2. Verify all environment variables are set
3. Check server logs for error messages
4. Ensure you have internet connectivity
5. Verify your API key is valid and has quota remaining

Happy planning! 🎉
