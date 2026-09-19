import urllib.request
import json

req = urllib.request.Request('https://api.github.com/users/udbhavnc7/repos', headers={'User-Agent': 'Python-Agent'})
try:
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode('utf-8'))
        with open('repos.json', 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2)
        print("Saved repos.json with count:", len(data))
except Exception as e:
    print("Error:", e)
