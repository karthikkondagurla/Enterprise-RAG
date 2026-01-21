import requests
import sys
import time

BASE_URL = "http://localhost:8000"

def wait_for_server():
    print("Waiting for server to start...")
    for _ in range(30):
        try:
            requests.get(f"{BASE_URL}/health")
            print("Server is up!")
            return True
        except:
            time.sleep(2)
    return False

def test_ingestion():
    print("Testing Ingestion...")
    url = f"{BASE_URL}/ingest"
    files = {'file': ('test_doc.txt', open('test_doc.txt', 'rb'))}
    try:
        response = requests.post(url, files=files)
        response.raise_for_status()
        print("Ingestion Success:", response.json())
        return True
    except Exception as e:
        print("Ingestion Failed:", e)
        print(response.text if 'response' in locals() else "")
        return False

def test_query():
    print("Testing Query...")
    url = f"{BASE_URL}/query"
    payload = {"query": "What causes Error 504 on the payment gateway?"}
    try:
        response = requests.post(url, json=payload)
        response.raise_for_status()
        data = response.json()
        print("Query Response:", data)
        
        # Validation
        if "timeout" in data.get("answer", "").lower() or "timeout" in str(data.get("context", "")).lower():
            print("✅ Verification Passed: Answer contained expected keyword 'timeout'")
        else:
            print("⚠️ Verification Warning: Answer might not be perfect.")
            
        return True
    except Exception as e:
        print("Query Failed:", e)
        print(response.text if 'response' in locals() else "")
        return False

if __name__ == "__main__":
    if not wait_for_server():
        print("Server failed to start.")
        sys.exit(1)
        
    if test_ingestion():
        # Give DB a second to index
        time.sleep(1)
        test_query()
