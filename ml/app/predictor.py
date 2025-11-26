"""
Waste classification predictor using heuristics
"""

import io
import torch
import torch.nn as nn
from PIL import Image
import torchvision.transforms as transforms
import numpy as np
from typing import Dict, List, Optional
from app.config import settings

# Waste type classes
WASTE_CLASSES = [
    "plastic",
    "paper",
    "metal",
    "glass",
    "organic",
    "electronic",
    "textile",
    "unknown",
]


class WasteClassifier(nn.Module):
    """Simple CNN for waste classification"""
    
    def __init__(self, num_classes: int = len(WASTE_CLASSES)):
        super(WasteClassifier, self).__init__()
        self.conv1 = nn.Conv2d(3, 32, kernel_size=3, padding=1)
        self.conv2 = nn.Conv2d(32, 64, kernel_size=3, padding=1)
        self.conv3 = nn.Conv2d(64, 128, kernel_size=3, padding=1)
        self.pool = nn.MaxPool2d(2, 2)
        self.fc1 = nn.Linear(128 * 28 * 28, 512)
        self.fc2 = nn.Linear(512, num_classes)
        self.relu = nn.ReLU()
        self.dropout = nn.Dropout(0.3)
    
    def forward(self, x):
        x = self.pool(self.relu(self.conv1(x)))
        x = self.pool(self.relu(self.conv2(x)))
        x = self.pool(self.relu(self.conv3(x)))
        x = x.view(-1, 128 * 28 * 28)
        x = self.relu(self.fc1(x))
        x = self.dropout(x)
        x = self.fc2(x)
        return x


class WastePredictor:
    """Predictor for waste classification using heuristics"""
    
    def __init__(self):
        self.model = None
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self._load_model()
    
    def _load_model(self):
        """Load local model if available, otherwise use heuristics"""
        try:
            self.model = WasteClassifier()
            try:
                self.model.load_state_dict(torch.load(settings.MODEL_PATH, map_location=self.device))
                print(f"✓ Local model loaded from {settings.MODEL_PATH}")
                self.model.eval()
                self.model.to(self.device)
                print(f"Model ready on {self.device}")
            except FileNotFoundError:
                print(f"Warning: No local model found at {settings.MODEL_PATH}")
                print("Using heuristic-based detection as fallback")
                self.model = None
            except Exception as e:
                print(f"Warning: Could not load local model: {e}")
                self.model = None
        except Exception as e:
            print(f"Warning: Model initialization failed: {e}")
            self.model = None
    
    def is_ready(self) -> bool:
        """Check if model is ready"""
        return True  # Always ready (can fall back to heuristics)
    
    async def predict(self, image_bytes: bytes) -> Dict:
        """
        Predict waste type from image bytes using heuristics
        
        Args:
            image_bytes: Raw image bytes
            
        Returns:
            Dictionary with waste_type and confidence
        """
        try:
            # Convert bytes to PIL Image
            image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
            
            # Use heuristics
            return await self._predict_with_heuristics_wrapper(image)
            
        except Exception as e:
            # Return unknown on error
            return {
                "waste_type": "unknown",
                "confidence": 0.0,
                "alternatives": [],
                "error": str(e),
            }
    
    async def _predict_with_heuristics_wrapper(self, image: Image.Image) -> Dict:
        """Predict using heuristics (fallback method)"""
        try:
            # Analyze image properties
            dominant_color = self._get_dominant_color(image)
            brightness = self._get_average_brightness(image)
            transparency = self._check_transparency(image)
            edges = self._detect_edges(image)
            texture = self._analyze_texture(image)
            
            # Use heuristics to predict waste type
            prediction_result = self._predict_with_heuristics(
                dominant_color=dominant_color,
                brightness=brightness,
                transparency=transparency,
                edges=edges,
                texture=texture,
            )
            
            return prediction_result
        except Exception as e:
            return {
                "waste_type": "unknown",
                "confidence": 0.0,
                "alternatives": [],
                "error": str(e),
            }
    
    def _get_dominant_color(self, image: Image.Image) -> Dict[str, float]:
        """Get dominant colors in the image"""
        # Resize for faster processing
        image_small = image.resize((50, 50))
        pixels = np.array(image_small).reshape(-1, 3)
        
        # Calculate average RGB
        avg_color = pixels.mean(axis=0)
        
        return {
            "r": float(avg_color[0]),
            "g": float(avg_color[1]),
            "b": float(avg_color[2]),
        }
    
    def _get_average_brightness(self, image: Image.Image) -> float:
        """Get average brightness"""
        gray = image.convert("L")
        pixels = np.array(gray)
        return float(pixels.mean())
    
    def _check_transparency(self, image: Image.Image) -> bool:
        """Check if image has transparency"""
        return image.mode in ("RGBA", "LA") or "transparency" in image.info
    
    def _detect_edges(self, image: Image.Image) -> float:
        """Detect edge density using simple gradient"""
        # Convert to grayscale
        gray = image.convert("L")
        pixels = np.array(gray)
        
        # Calculate simple edge metric (variance of gradients)
        h_diff = np.abs(pixels[:, 1:] - pixels[:, :-1])
        v_diff = np.abs(pixels[1:, :] - pixels[:-1, :])
        edges = np.mean(h_diff) + np.mean(v_diff)
        
        return float(edges)
    
    def _analyze_texture(self, image: Image.Image) -> float:
        """Analyze texture complexity"""
        # Convert to grayscale
        gray = image.convert("L")
        pixels = np.array(gray)
        
        # Calculate texture as standard deviation
        texture = np.std(pixels)
        return float(texture)
    
    def _predict_with_heuristics(
        self,
        dominant_color: Dict[str, float],
        brightness: float,
        transparency: bool,
        edges: float,
        texture: float,
    ) -> Dict:
        """Predict waste type using intelligent heuristics with improved accuracy"""
        
        # Normalize color values to ratios
        total_color = dominant_color["r"] + dominant_color["g"] + dominant_color["b"]
        if total_color == 0:
            return self._create_result("unknown", 0.30, ["organic", "textile"])
            
        r_ratio = dominant_color["r"] / total_color
        g_ratio = dominant_color["g"] / total_color
        b_ratio = dominant_color["b"] / total_color
        
        # Calculate additional metrics
        color_saturation = max(r_ratio, g_ratio, b_ratio) - min(r_ratio, g_ratio, b_ratio)
        color_variance = max(r_ratio, g_ratio, b_ratio)
        grayness = 1.0 - (abs(r_ratio - 0.333) + abs(g_ratio - 0.333) + abs(b_ratio - 0.333))
        edge_density = edges / (brightness + 1) if brightness > 0 else 0
        
        # Priority 1: Glass - transparent or very bright with reflections
        if transparency:
            return self._create_result("glass", 0.88, ["plastic", "metal"])
        if brightness > 220 and edges > 35 and texture < 25 and edge_density < 0.3:
            return self._create_result("glass", 0.85, ["plastic", "metal"])
        if brightness > 200 and grayness > 0.65 and texture < 20:
            return self._create_result("glass", 0.80, ["plastic", "metal"])
        
        # Priority 2: Organic - green or brown colors with natural textures
        if brightness < 160:
            # Dark green organic (vegetables, plant waste)
            if g_ratio > 0.40 and g_ratio > r_ratio and g_ratio > b_ratio and texture > 25:
                return self._create_result("organic", 0.88, ["textile", "paper"])
            # Brown organic (food waste, compost)
            if 0.30 < r_ratio < 0.55 and 0.20 < g_ratio < 0.40 and b_ratio < 0.30 and texture > 20:
                return self._create_result("organic", 0.85, ["textile", "paper"])
            # Dark brown/black organic
            if brightness < 120 and r_ratio > 0.25 and g_ratio > 0.20:
                return self._create_result("organic", 0.82, ["textile", "electronic"])
        
        # Priority 3: Paper - light tones with low texture (check before metal)
        if 160 < brightness < 245 and texture < 32 and edges < 38:
            # Paper has warm tones and low complexity
            if b_ratio < 0.40 and r_ratio + g_ratio > 0.60:
                return self._create_result("paper", 0.80, ["textile", "plastic"])
            # White/light paper
            if grayness > 0.75 and texture < 25:
                return self._create_result("paper", 0.78, ["plastic", "textile"])
        
        # Priority 4: Plastic - bright, vibrant, or very saturated colors (check before metal)
        if brightness > 180:
            # Bright vibrant colors (red, blue, green, yellow plastic)
            if color_saturation > 0.35:
                return self._create_result("plastic", 0.82, ["glass", "textile"])
            # Bright uniform colors (white plastic bags, containers)
            if grayness > 0.70 and texture < 30:
                return self._create_result("plastic", 0.75, ["glass", "paper"])
        
        if brightness > 150:
            # Medium brightness with high color saturation
            if color_variance > 0.45:
                return self._create_result("plastic", 0.78, ["textile", "paper"])
        
        # Priority 5: Textile - medium brightness, soft edges, fabric-like texture
        if 100 < brightness < 180 and edges < 38 and 18 < texture < 55:
            # Fabric has distinctive texture patterns
            if edge_density < 0.35:
                return self._create_result("textile", 0.75, ["paper", "plastic"])
        
        # Priority 6: Metal - silver/gray with high reflectivity and VERY sharp edges
        if grayness > 0.82 and edges > 60 and 100 < brightness < 240:
            return self._create_result("metal", 0.85, ["glass", "plastic"])
        # Dark gray metal (iron, steel) - only very specific conditions
        if grayness > 0.75 and 50 < brightness < 150 and edges > 55 and texture > 30:
            return self._create_result("metal", 0.80, ["glass", "electronic"])
        
        # Priority 7: Electronic - very dark with complex patterns and textures
        if brightness < 90 and edges > 55 and texture > 45:
            return self._create_result("electronic", 0.78, ["metal", "plastic"])
        if brightness < 100 and edge_density > 0.6 and texture > 40:
            return self._create_result("electronic", 0.75, ["metal", "plastic"])
        
        # Fallback based on dominant characteristics
        if brightness > 200:
            return self._create_result("plastic", 0.58, ["glass", "paper"])
        elif brightness > 140:
            return self._create_result("plastic", 0.55, ["textile", "paper"])
        elif brightness > 100:
            return self._create_result("organic", 0.55, ["textile", "paper"])
        else:
            return self._create_result("unknown", 0.48, ["electronic", "metal"])
    
    def _create_result(
        self, waste_type: str, confidence: float, alternative_types: List[str]
    ) -> Dict:
        """Create standardized result with alternatives"""
        alternatives = [
            {
                "type": alt_type,
                "confidence": round(confidence * 0.7 - i * 0.1, 2),  # Decreasing confidence
            }
            for i, alt_type in enumerate(alternative_types)
        ]
        
        return {
            "waste_type": waste_type,
            "confidence": round(confidence, 2),
            "alternatives": alternatives[:2],  # Top 2 alternatives
        }

