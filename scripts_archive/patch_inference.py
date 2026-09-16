import re

with open("backend/app/services/inference.py", "r") as f:
    code = f.read()

# Add the V6 Transformer Class right before InferenceService
v6_class = """class OceanHybridTransformer(nn.Module):
    def __init__(self):
        super(OceanHybridTransformer, self).__init__()
        
        self.register_buffer('input_mean', torch.zeros(1, 12, 1, 1))
        self.register_buffer('input_std', torch.ones(1, 12, 1, 1))
        self.register_buffer('target_mean', torch.zeros(1, 15, 1, 1))
        self.register_buffer('target_std', torch.ones(1, 15, 1, 1))
        
        self.cnn_encoder = nn.Sequential(
            nn.Conv2d(12, 32, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.Conv2d(32, 64, kernel_size=3, padding=1),
            nn.BatchNorm2d(64),
            nn.ReLU(),
            nn.MaxPool2d(2) 
        )
        
        encoder_layer = nn.TransformerEncoderLayer(d_model=64, nhead=4, dim_feedforward=256, dropout=0.1, batch_first=True)
        self.transformer = nn.TransformerEncoder(encoder_layer, num_layers=2)
        
        self.attention = SpatialAttention()
        
        self.decoder = nn.Sequential(
            nn.ConvTranspose2d(64, 32, kernel_size=2, stride=2),
            nn.ReLU(),
            nn.Conv2d(32, 15, kernel_size=3, padding=1)
        )

    def load_normalization_stats(self, stats_path):
        import json, torch
        with open(stats_path, "r") as f:
            stats = json.load(f)
        self.input_mean = torch.tensor(stats['input_mean'], dtype=torch.float32).view(1, -1, 1, 1)
        self.input_std = torch.tensor(stats['input_std'], dtype=torch.float32).view(1, -1, 1, 1)
        self.target_mean = torch.tensor(stats['target_mean'], dtype=torch.float32).view(1, -1, 1, 1)
        self.target_std = torch.tensor(stats['target_std'], dtype=torch.float32).view(1, -1, 1, 1)

    def forward(self, x):
        x_norm = (x - self.input_mean) / (self.input_std + 1e-8)
        features = self.cnn_encoder(x_norm)
        b, c, h, w = features.shape
        flat_features = features.view(b, c, h * w).permute(0, 2, 1)
        transformer_out = self.transformer(flat_features)
        features = transformer_out.permute(0, 2, 1).view(b, c, h, w)
        attended_features = self.attention(features)
        out_norm = self.decoder(attended_features)
        return (out_norm * self.target_std) + self.target_mean

class InferenceService:"""

if "OceanHybridTransformer" not in code:
    code = code.replace("class InferenceService:", v6_class)
    
# Change the model instantiation and version
code = code.replace("self.model = OceanSpatialAutoencoder().to(self.device)", "self.model = OceanHybridTransformer().to(self.device)")
code = code.replace('self.version = "OceanEmbed-v5.0 PINN (Physics-Informed)"', 'self.version = "OceanEmbed-v6.0 Hybrid (CNN+ViT)"')
code = code.replace('oceanembed_pinn_v5.pth', 'oceanembed_v6_hybrid.pth')

with open("backend/app/services/inference.py", "w") as f:
    f.write(code)

print("Injected V6 Transformer into Backend API!")
