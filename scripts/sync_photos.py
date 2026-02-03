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

    # Ordenamos las categorías para consistencia
    categories = sorted([c for c in os.listdir(abs_base_dir) if os.path.isdir(os.path.join(abs_base_dir, c))])

    for category in categories:
        cat_path = os.path.join(abs_base_dir, category)
        print(f"\n📸 Procesando Categoría: {category}")
        
        # Inicializamos el contador para esta categoría
        count = 1
        
        # Listamos y ordenamos los archivos para que el 1, 2, 3 sea siempre igual
        files = sorted(os.listdir(cat_path))
        
        for file in files:
            # Solo procesamos archivos de imagen originales (no los webp generados antes)
            if file.lower().endswith(('.png', '.jpg', '.jpeg')):
                file_path = os.path.join(cat_path, file)
                
                # Definimos el nuevo nombre secuencial
                webp_name = f"{count}.webp"
                webp_path = os.path.join(cat_path, webp_name)
                
                # --- PROCESAMIENTO DE IMAGEN ---
                try:
                    # Siempre abrimos para chequear orientación y guardado
                    with Image.open(file_path) as img:
                        w, h = img.size
                        orientation = "portrait" if h > w else "landscape"
                        
                        # Si el webp secuencial ya existe, igual lo actualizamos o saltamos
                        # En este caso, lo generamos para asegurar que el índice sea correcto
                        if not os.path.exists(webp_path):
                            if w > MAX_WIDTH:
                                img.thumbnail((MAX_WIDTH, MAX_WIDTH), Image.Resampling.LANCZOS)
                            
                            # Guardamos con el nombre numerado
                            img.save(webp_path, "WEBP", quality=QUALITY, method=METHOD)
                            print(f"   > Generado: {webp_name} (desde {file})")
                        else:
                            print(f"   - Existente: {webp_name}")

                    # Armamos el objeto para el JSON
                    photo_data.append({
                        "webp": f"/photography/{category}/{webp_name}",
                        "original": f"/photography/{category}/{file}",
                        "category": category.capitalize(),
                        "orientation": orientation
                    })
                    
                    # Incrementamos para la siguiente foto
                    count += 1
                    
                except Exception as e:
                    print(f"   ! Error en {file}: {e}")
                    continue

    # Guardado del JSON final
    with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
        json.dump(photo_data, f, indent=4, ensure_ascii=False)
        
    print(f"\n✅ Índice actualizado: {len(photo_data)} fotos indexadas.")

if __name__ == "__main__":
    process_photography()