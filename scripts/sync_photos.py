import os
import json
from PIL import Image

# Configuración de rutas - Ahora apuntamos hacia afuera de /scripts y hacia /client
# Usamos os.path.join para que no haya bardo entre Windows y Linux/Vercel
BASE_DIR = os.path.join("..", "client", "public", "photography")
OUTPUT_JSON = os.path.join("..", "client", "src", "data", "photos.json")

def process_photography():
    photo_data = []
    
    # Normalizamos la ruta para que Python la entienda bien
    abs_base_dir = os.path.abspath(BASE_DIR)
    
    if not os.path.exists(abs_base_dir):
        print(f"❌ Error: No se encontró la carpeta en {abs_base_dir}")
        print("Asegurate de estar corriendo el script desde la carpeta /scripts")
        return

    for category in os.listdir(abs_base_dir):
        cat_path = os.path.join(abs_base_dir, category)
        if not os.path.isdir(cat_path):
            continue
            
        print(f"📸 Procesando categoría: {category}")
        
        for file in os.listdir(cat_path):
            # 1. Validamos extensión (ignoramos webp para no procesar lo ya convertido)
            if file.lower().endswith(('.png', '.jpg', '.jpeg')) and not file.endswith('.webp'):
                file_path = os.path.join(cat_path, file)
                name_no_ext = os.path.splitext(file)[0]
                webp_path = os.path.join(cat_path, f"{name_no_ext}.webp")
                
                # --- Detectar orientación y conversión ---
                try:
                    with Image.open(file_path) as img:
                        w, h = img.size
                        orientation = "portrait" if h > w else "landscape"
                        
                        if not os.path.exists(webp_path):
                            img.save(webp_path, "WEBP", quality=80)
                            print(f"   > Convertido: {file} -> {name_no_ext}.webp")
                except Exception as e:
                    print(f"   ! Error procesando {file}: {e}")
                    continue

                # IMPORTANTE: El path del JSON sigue siendo relativo a la carpeta 'public' de React
                photo_data.append({
                    "webp": f"/photography/{category}/{name_no_ext}.webp",
                    "original": f"/photography/{category}/{file}",
                    "category": category.capitalize(),
                    "orientation": orientation
                })

    # Guardamos el JSON en la carpeta de data del frontend
    os.makedirs(os.path.dirname(os.path.abspath(OUTPUT_JSON)), exist_ok=True)
    with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
        json.dump(photo_data, f, indent=4, ensure_ascii=False)
    
    print(f"\n✅ Éxito: Se actualizó el índice en {OUTPUT_JSON}")
    print(f"Total de fotos indexadas: {len(photo_data)}")

if __name__ == "__main__":
    process_photography()