
import requests
import time
import sys

BASE_URL = "http://127.0.0.1:8080"
REGISTER_URL = f"{BASE_URL}/api/register"
LOGIN_URL = f"{BASE_URL}/api/login"
CHAT_URL = f"{BASE_URL}/api/chat"

def test_endpoint():
    print("Testing API Endpoint Latency...")
    
    # 1. Login/Register to get token
    session = requests.Session()
    unique_user = f"perf_test_{int(time.time())}"
    user_data = {
        "username": unique_user,
        "email": f"{unique_user}@example.com",
        "password": "password123"
    }
    
    start = time.time()
    try:
        reg_res = session.post(REGISTER_URL, json=user_data)
        if reg_res.status_code != 200:
             # Try login if user exists
             login_res = session.post(LOGIN_URL, json={
                 "email": user_data['email'],
                 "password": user_data['password']
             })
             if login_res.status_code != 200:
                 print(f"Auth failed: {login_res.text}")
                 return
             token = login_res.json()['token']
        else:
             token = reg_res.json()['token']
        
        print(f"Auth took {time.time() - start:.2f}s")
        
        # 2. Test Chat Endpoint
        headers = {"Authorization": f"Bearer {token}"}
        # Use the "short" prompt that failed for the user
        payload = {"messages": [{"role": "user", "content": "Startup"}]}
        
        print(f"Sending prompt: 'Startup'...")
        chat_start = time.time()
        res = session.post(CHAT_URL, json=payload, headers=headers, timeout=120)
        duration = time.time() - chat_start
        
        print(f"Response Code: {res.status_code}")
        print(f"Duration: {duration:.2f}s")
        
        if res.status_code == 200:
            print(f"Response Body Preview: {res.text[:100]}...")
        else:
            print(f"Error Body: {res.text}")

    except Exception as e:
        print(f"Request Failed: {e}")

if __name__ == "__main__":
    test_endpoint()
