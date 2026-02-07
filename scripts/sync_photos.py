import os
import json
from PIL import Image

# Configuración de rutas
BASE_DIR = os.path.join("..", "client", "public", "photography")
OUTPUT_JSON = os.path.join("..", "client", "src", "data", "photos.json")

MAX_WIDTH = 2560
QUALITY = 75
METHOD = 6

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
        
        files = sorted(os.listdir(cat_path))
        
        # Diccionario auxiliar para evitar duplicados si existen ambos (jpg y webp)
        processed_names = set()

        for file in files:
            file_lower = file.lower()
            
            # CASO 1: Es un original (JPG/PNG) - Lo procesamos y convertimos
            if file_lower.endswith(('.png', '.jpg', '.jpeg')):
                file_path = os.path.join(cat_path, file)
                # El nombre de destino será el nombre original pero con .webp
                # O si querés mantener tu lógica de números, usamos el contador.
                # Para no romper tu lógica, buscaremos si ya tiene un nombre numerado.
                
                # Para simplificar y que no se duplique, si es original, lo procesamos:
                try:
                    with Image.open(file_path) as img:
                        w, h = img.size
                        orientation = "portrait" if h > w else "landscape"
                        
                        webp_name = os.path.splitext(file)[0] + ".webp"
                        webp_path = os.path.join(cat_path, webp_name)

                        if not os.path.exists(webp_path):
                            if w > MAX_WIDTH:
                                img.thumbnail((MAX_WIDTH, MAX_WIDTH), Image.Resampling.LANCZOS)
                            img.save(webp_path, "WEBP", quality=QUALITY, method=METHOD)
                            print(f"   > Convertido: {file} -> {webp_name}")
                        
                        photo_data.append({
                            "webp": f"/photography/{category}/{webp_name}",
                            "original": f"/photography/{category}/{file}",
                            "category": category, # Mantenemos el nombre de la carpeta tal cual para las keys del translation
                            "orientation": orientation
                        })
                        processed_names.add(webp_name)
                except Exception as e:
                    print(f"   ! Error en {file}: {e}")

            # CASO 2: Ya es un WebP y no lo procesamos antes (fotos que quedaron solas)
            elif file_lower.endswith('.webp'):
                if file not in processed_names:
                    file_path = os.path.join(cat_path, file)
                    try:
                        with Image.open(file_path) as img:
                            w, h = img.size
                            orientation = "portrait" if h > w else "landscape"
                            
                        photo_data.append({
                            "webp": f"/photography/{category}/{file}",
                            "original": f"/photography/{category}/{file}", # Fallback al mismo webp
                            "category": category,
                            "orientation": orientation
                        })
                        print(f"   + Indexado (existente): {file}")
                        processed_names.add(file)
                    except Exception as e:
                        print(f"   ! Error leyendo metadatos de {file}: {e}")

    # Guardado del JSON final
    with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
        json.dump(photo_data, f, indent=4, ensure_ascii=False)
        
    print(f"\n✅ Índice actualizado: {len(photo_data)} fotos indexadas.")

if __name__ == "__main__":
    process_photography()