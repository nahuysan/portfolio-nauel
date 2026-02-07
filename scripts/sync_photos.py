import os
import json
from PIL import Image

# Configuración de rutas
BASE_DIR = os.path.join("..", "client", "public", "photography")
OUTPUT_JSON = os.path.join("..", "client", "src", "data", "photos.json")

MAX_WIDTH = 2560
QUALITY = 80
METHOD = 6

def get_next_available_index(existing_files):
    """Busca el número más alto en los archivos .webp y devuelve el siguiente."""
    indices = []
    for f in existing_files:
        if f.lower().endswith('.webp'):
            name = os.path.splitext(f)[0]
            if name.isdigit():
                indices.append(int(name))
    return max(indices) + 1 if indices else 1

def process_photography():
    photo_data = []
    abs_base_dir = os.path.abspath(BASE_DIR)
    
    if not os.path.exists(abs_base_dir):
        print(f"❌ Error: Carpeta no encontrada en {abs_base_dir}")
        return

    categories = sorted([c for c in os.listdir(abs_base_dir) if os.path.isdir(os.path.join(abs_base_dir, c))])

    for category in categories:
        cat_path = os.path.join(abs_base_dir, category)
        print(f"\n📸 Procesando Categoría: {category}")
        
        all_files = os.listdir(cat_path)
        
        # 1. Identificar WebPs existentes para no tocarlos y saber desde qué número seguir
        next_idx = get_next_available_index(all_files)
        
        # 2. Separar originales de WebPs
        originals = sorted([f for f in all_files if f.lower().endswith(('.png', '.jpg', '.jpeg'))])
        existing_webps = sorted([f for f in all_files if f.lower().endswith('.webp')])

        # Procesar Originales -> Convertir, Renombrar y Borrar
        for file in originals:
            file_path = os.path.join(cat_path, file)
            webp_name = f"{next_idx}.webp"
            webp_path = os.path.join(cat_path, webp_name)

            try:
                with Image.open(file_path) as img:
                    w, h = img.size
                    orientation = "portrait" if h > w else "landscape"
                    
                    if w > MAX_WIDTH:
                        img.thumbnail((MAX_WIDTH, MAX_WIDTH), Image.Resampling.LANCZOS)
                    
                    img.save(webp_path, "WEBP", quality=QUALITY, method=METHOD)
                    print(f"   > Convertido y Renombrado: {file} -> {webp_name}")
                
                # Borrar el original después de convertir
                os.remove(file_path)
                
                photo_data.append({
                    "webp": f"/photography/{category}/{webp_name}",
                    "original": f"/photography/{category}/{webp_name}",
                    "category": category,
                    "orientation": orientation
                })
                next_idx += 1
            except Exception as e:
                print(f"   ! Error procesando {file}: {e}")

        # Indexar WebPs que ya estaban (sin tocarlos)
        for file in existing_webps:
            # Si acabamos de crear este webp en este run, lo salteamos porque ya se agregó arriba
            if any(p["webp"] == f"/photography/{category}/{file}" for p in photo_data):
                continue
                
            file_path = os.path.join(cat_path, file)
            try:
                with Image.open(file_path) as img:
                    w, h = img.size
                    orientation = "portrait" if h > w else "landscape"
                
                photo_data.append({
                    "webp": f"/photography/{category}/{file}",
                    "original": f"/photography/{category}/{file}",
                    "category": category,
                    "orientation": orientation
                })
                print(f"   + Indexado (existente): {file}")
            except Exception as e:
                print(f"   ! Error leyendo {file}: {e}")

    # Guardado del JSON final
    with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
        json.dump(photo_data, f, indent=4, ensure_ascii=False)
        
    print(f"\n✅ Proceso completado. {len(photo_data)} fotos en el índice.")

if __name__ == "__main__":
    process_photography()