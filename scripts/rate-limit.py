import requests
import json
import time

# Configuración técnica
URL = "http://localhost:3001/api/contact"
HEADERS = {"Content-Type": "application/json"}
DATA = {
    "name": "Nahuel Bot Test",
    "email": "bot@test.com",
    "message": "Probando el Rate Limit de mi servidor."
}

def run_test():
    print(f"🚀 Arrancando stress test sobre {URL}...\n")
    
    for i in range(1, 8):  # Mandamos 7 intentos
        try:
            response = requests.post(URL, data=json.dumps(DATA), headers=HEADERS)
            
            if response.status_code == 200:
                print(f"Intento {i}: ✅ Enviado (Status: 200)")
            elif response.status_code == 429:
                print(f"Intento {i}: 🛡️ BLOQUEADO (Status: 429)")
                print(f"Respuesta: {response.json()['message']}")
            else:
                print(f"Intento {i}: ⚠️ Error inesperado (Status: {response.status_code})")
                
        except requests.exceptions.ConnectionError:
            print("❌ Error: ¿Levantaste el backend en el puerto 3001?")
            break

if __name__ == "__main__":
    run_test()