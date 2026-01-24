import os
import json
from PIL import Image

# Configuración de rutas
BASE_DIR = "public/photography"
OUTPUT_JSON = "src/data/photos.json"

def process_photography():
    photo_data = []
    
    if not os.path.exists(BASE_DIR):
        print(f"Error: No se encontró la carpeta {BASE_DIR}")
        return

    for category in os.listdir(BASE_DIR):
        cat_path = os.path.join(BASE_DIR, category)
        if not os.path.isdir(cat_path):
            continue
            
        print(f"Procesando categoría: {category}")
        
        for file in os.listdir(cat_path):
            # 1. Validamos extensión
            if file.lower().endswith(('.png', '.jpg', '.jpeg')) and not file.endswith('.webp'):
                file_path = os.path.join(cat_path, file)
                name_no_ext = os.path.splitext(file)[0]
                webp_path = os.path.join(cat_path, f"{name_no_ext}.webp")
                
                # --- NUEVO: Detectar orientación ---
                try:
                    with Image.open(file_path) as img:
                        w, h = img.size
                        orientation = "portrait" if h > w else "landscape" #
                        
                        # Aprovechamos que la imagen está abierta para convertirla
                        if not os.path.exists(webp_path):
                            img.save(webp_path, "WEBP", quality=80)
                            print(f"  > Convertido: {file} -> {name_no_ext}.webp")
                except Exception as e:
                    print(f"  ! Error procesando {file}: {e}")
                    continue
                # -----------------------------------

                # Agregamos al índice con la orientación detectada
                photo_data.append({
                    "webp": f"/photography/{category}/{name_no_ext}.webp",
                    "original": f"/photography/{category}/{file}",
                    "category": category.capitalize(),
                    "orientation": orientation # Esto es lo que React usará para la grilla
                })

    # Guardamos el JSON
    os.makedirs(os.path.dirname(OUTPUT_JSON), exist_ok=True)
    with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
        json.dump(photo_data, f, indent=4, ensure_ascii=False)
    print(f"\nÉxito: Se generó {OUTPUT_JSON} con {len(photo_data)} fotos.")

if __name__ == "__main__":
    process_photography()