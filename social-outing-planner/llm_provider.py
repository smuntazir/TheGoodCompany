"""
LLM Provider Abstraction Layer
Supports multiple AI providers: Google Gemini, OpenAI GPT, Anthropic Claude
"""

import os
import json
from typing import Dict, List, Optional, Any

class LLMProvider:
    """Base class for LLM providers"""
    
    def __init__(self, api_key: str):
        self.api_key = api_key
    
    def chat(self, messages: List[Dict[str, str]], context: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Send chat message and get response with potential function calls"""
        raise NotImplementedError("Subclasses must implement chat method")


class GeminiProvider(LLMProvider):
    """Google Gemini AI Provider"""
    
    def __init__(self, api_key: str):
        super().__init__(api_key)
        try:
            import google.generativeai as genai
            genai.configure(api_key=api_key)
            self.model = genai.GenerativeModel('gemini-flash-latest')
        except Exception as e:
            raise Exception(f"Failed to initialize Gemini: {e}")
    
    def chat(self, messages: List[Dict[str, str]], context: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        try:
            # Build context-aware prompt
            system_context = self._build_system_prompt(context)
            
            # Combine system context with user message
            conversation_history = "\n".join([
                f"{'User' if msg['role'] == 'user' else 'Assistant'}: {msg['content']}"
                for msg in messages
            ])
            
            full_prompt = f"{system_context}\n\n{conversation_history}"
            
            response = self.model.generate_content(full_prompt)
            response_text = response.text
            
            # Parse response for POI/AOI creation requests
            extracted_items = self._extract_creation_requests(response_text)
            
            return {
                'response': response_text,
                'extracted_items': extracted_items
            }
        except Exception as e:
            return {
                'response': f"Error: {str(e)}",
                'extracted_items': []
            }
    
    def _build_system_prompt(self, context: Optional[Dict[str, Any]] = None) -> str:
        """Build system prompt with user's current POIs, AOIs, and events"""
        prompt = """You are an AI assistant helping users plan social outings and activities. 
Your role is to:
1. Brainstorm ideas for places to visit (Places of Interest - POIs) and activities to do (Activities of Interest - AOIs)
2. Help users discover new experiences based on their interests
3. Be concise. When a user wants to add something to their planner, extract the details clearly

When suggesting or creating items, use this format:
- For Places: [POI: name | location | description | category]
- For Activities: [AOI: name | description | duration | category]

Categories can be: food, entertainment, sports, culture, nature, shopping, social, other"""

        if context:
            if context.get('pois'):
                prompt += f"\n\nUser's current Places of Interest:\n"
                for poi in context['pois']:
                    prompt += f"- {poi.get('name')} ({poi.get('category', 'other')}) at {poi.get('location', 'unknown')}\n"
            
            if context.get('aois'):
                prompt += f"\n\nUser's current Activities of Interest:\n"
                for aoi in context['aois']:
                    prompt += f"- {aoi.get('name')} ({aoi.get('category', 'other')}) - {aoi.get('duration', 'flexible duration')}\n"
            
            if context.get('events'):
                prompt += f"\n\nUser has {len(context['events'])} upcoming events scheduled.\n"
        
        return prompt
    
    def _extract_creation_requests(self, text: str) -> List[Dict[str, Any]]:
        """Extract POI/AOI creation requests from response text"""
        items = []
        lines = text.split('\n')
        
        for line in lines:
            # Look for POI format: [POI: name | location | description | category]
            if '[POI:' in line:
                try:
                    content = line.split('[POI:')[1].split(']')[0]
                    parts = [p.strip() for p in content.split('|')]
                    if len(parts) >= 2:
                        items.append({
                            'type': 'poi',
                            'name': parts[0],
                            'location': parts[1] if len(parts) > 1 else '',
                            'description': parts[2] if len(parts) > 2 else '',
                            'category': parts[3] if len(parts) > 3 else 'other'
                        })
                except:
                    pass
            
            # Look for AOI format: [AOI: name | description | duration | category]
            if '[AOI:' in line:
                try:
                    content = line.split('[AOI:')[1].split(']')[0]
                    parts = [p.strip() for p in content.split('|')]
                    if len(parts) >= 1:
                        items.append({
                            'type': 'aoi',
                            'name': parts[0],
                            'description': parts[1] if len(parts) > 1 else '',
                            'duration': parts[2] if len(parts) > 2 else 'flexible',
                            'category': parts[3] if len(parts) > 3 else 'other'
                        })
                except:
                    pass
        
        return items


class OpenAIProvider(LLMProvider):
    """OpenAI GPT Provider"""
    
    def __init__(self, api_key: str):
        super().__init__(api_key)
        try:
            from openai import OpenAI
            self.client = OpenAI(api_key=api_key)
        except Exception as e:
            raise Exception(f"Failed to initialize OpenAI: {e}")
    
    def chat(self, messages: List[Dict[str, str]], context: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        try:
            system_context = self._build_system_prompt(context)
            
            # Prepend system message
            full_messages = [{"role": "system", "content": system_context}] + messages
            
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=full_messages,
                temperature=0.7
            )
            
            response_text = response.choices[0].message.content
            extracted_items = self._extract_creation_requests(response_text)
            
            return {
                'response': response_text,
                'extracted_items': extracted_items
            }
        except Exception as e:
            return {
                'response': f"Error: {str(e)}",
                'extracted_items': []
            }
    
    def _build_system_prompt(self, context: Optional[Dict[str, Any]] = None) -> str:
        """Same as Gemini - reuse the logic"""
        return GeminiProvider._build_system_prompt(self, context)
    
    def _extract_creation_requests(self, text: str) -> List[Dict[str, Any]]:
        """Same as Gemini - reuse the logic"""
        return GeminiProvider._extract_creation_requests(self, text)


class ClaudeProvider(LLMProvider):
    """Anthropic Claude Provider"""
    
    def __init__(self, api_key: str):
        super().__init__(api_key)
        try:
            from anthropic import Anthropic
            self.client = Anthropic(api_key=api_key)
        except Exception as e:
            raise Exception(f"Failed to initialize Claude: {e}")
    
    def chat(self, messages: List[Dict[str, str]], context: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        try:
            system_context = self._build_system_prompt(context)
            
            response = self.client.messages.create(
                model="claude-3-sonnet-20240229",
                max_tokens=1024,
                system=system_context,
                messages=messages
            )
            
            response_text = response.content[0].text
            extracted_items = self._extract_creation_requests(response_text)
            
            return {
                'response': response_text,
                'extracted_items': extracted_items
            }
        except Exception as e:
            return {
                'response': f"Error: {str(e)}",
                'extracted_items': []
            }
    
    def _build_system_prompt(self, context: Optional[Dict[str, Any]] = None) -> str:
        """Same as Gemini - reuse the logic"""
        return GeminiProvider._build_system_prompt(self, context)
    
    def _extract_creation_requests(self, text: str) -> List[Dict[str, Any]]:
        """Same as Gemini - reuse the logic"""
        return GeminiProvider._extract_creation_requests(self, text)


def get_llm_provider(provider_name: str = None, api_key: str = None) -> LLMProvider:
    """Factory function to get the appropriate LLM provider"""
    
    # Determine provider from environment or parameter
    provider_name = provider_name or os.environ.get('LLM_PROVIDER', 'gemini').lower()
    api_key = api_key or os.environ.get('LLM_API_KEY')
    
    if not api_key:
        raise ValueError("LLM_API_KEY environment variable is required")
    
    providers = {
        'gemini': GeminiProvider,
        'openai': OpenAIProvider,
        'gpt': OpenAIProvider,
        'claude': ClaudeProvider,
        'anthropic': ClaudeProvider
    }
    
    provider_class = providers.get(provider_name)
    if not provider_class:
        raise ValueError(f"Unknown provider: {provider_name}. Supported: {', '.join(providers.keys())}")
    
    return provider_class(api_key)
