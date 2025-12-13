
import os
import sys
import unittest
from dotenv import load_dotenv

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Load .env from client/.env (where user said it is) or root
# Try root first, then client/.env
load_dotenv() 
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'client', '.env'))

from llm_provider import get_llm_provider

class TestLiveAI(unittest.TestCase):
    def test_live_connection(self):
        """
        Test a real connection to the LLM provider.
        Requires LLM_API_KEY validity.
        """
        api_key = os.environ.get('LLM_API_KEY')
        if not api_key:
            self.skipTest("LLM_API_KEY not found in environment. Skipping live test.")
            
        print(f"\nTesting with provider: {os.environ.get('LLM_PROVIDER', 'gemini')}...")
        
        try:
            provider = get_llm_provider()
            
            messages = [{"role": "user", "content": "Suggest one fun activity for a sunny day. Reply with just the activity name."}]
            
            print("Sending request...")
            result = provider.chat(messages)
            
            print(f"Response extracted items: {result.get('extracted_items')}")
            print(f"Full Response: {result.get('response')}")
            
            self.assertIsNotNone(result.get('response'))
            self.assertTrue(len(result.get('response')) > 0)
            
        except Exception as e:
            self.fail(f"Live API connection failed: {str(e)}")

if __name__ == '__main__':
    unittest.main()
