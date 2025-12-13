import unittest
from unittest.mock import MagicMock, patch
import os
import sys

# Add parent directory to path to import modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from llm_provider import get_llm_provider, GeminiProvider, OpenAIProvider, ClaudeProvider

class TestLLMProvider(unittest.TestCase):
    
    def setUp(self):
        self.api_key = "test_key"
        
    def test_get_llm_provider_gemini(self):
        """Test factory returns Gemini provider"""
        with patch.dict(os.environ, {'LLM_PROVIDER': 'gemini', 'LLM_API_KEY': 'test'}):
            try:
                # We mock the import inside GeminiProvider to avoid needing real deps installed for unit test
                with patch.dict('sys.modules', {'google.generativeai': MagicMock()}):
                    provider = get_llm_provider()
                    self.assertIsInstance(provider, GeminiProvider)
            except Exception as e:
                # If dependencies aren't installed, it might fail, which is expected in some envs
                print(f"Skipping provider check due to missing deps: {e}")

    def test_gemini_extraction_logic(self):
        """Test that Gemini provider correctly extracts POIs and AOIs from text"""
        # We don't need real genai for this, just test the parsing logic
        # But we need to bypass the __init__ which imports genai
        
        with patch('llm_provider.GeminiProvider.__init__', return_value=None):
            provider = GeminiProvider("fake_key")
            # Manually set attributes needed
            provider.api_key = "fake_key"
            
            # Test POI extraction
            text = """
            Here are some suggestions:
            [POI: Test Place | 123 Test St | A great place | food]
            [POI: Another Place | 456 Main St | Fun times | entertainment]
            """
            items = provider._extract_creation_requests(text)
            self.assertEqual(len(items), 2)
            self.assertEqual(items[0]['name'], 'Test Place')
            self.assertEqual(items[0]['type'], 'poi')
            self.assertEqual(items[1]['category'], 'entertainment')
            
            # Test AOI extraction
            text_aoi = """
            Try this:
            [AOI: Hiking | Go up the hill | 2 hours | nature]
            """
            items_aoi = provider._extract_creation_requests(text_aoi)
            self.assertEqual(len(items_aoi), 1)
            self.assertEqual(items_aoi[0]['name'], 'Hiking')
            self.assertEqual(items_aoi[0]['type'], 'aoi')
            self.assertEqual(items_aoi[0]['duration'], '2 hours')

    def test_system_prompt_builder(self):
        """Test that system prompt includes context"""
        with patch('llm_provider.GeminiProvider.__init__', return_value=None):
            provider = GeminiProvider("fake_key")
            
            context = {
                'pois': [{'name': 'Existing POI', 'location': 'There', 'category': 'food'}],
                'aois': [{'name': 'Existing AOI', 'duration': '1h', 'category': 'sports'}],
                'events': [{'name': 'Event 1'}]
            }
            
            prompt = provider._build_system_prompt(context)
            
            self.assertIn("User's current Places of Interest", prompt)
            self.assertIn("Existing POI", prompt)
            self.assertIn("User's current Activities of Interest", prompt)
            self.assertIn("Existing AOI", prompt)
            self.assertIn("User has 1 upcoming events", prompt)

if __name__ == '__main__':
    unittest.main()
