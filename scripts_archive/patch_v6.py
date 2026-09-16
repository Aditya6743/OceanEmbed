import re

with open("deeplearning_engine/scripts/train_v6_hybrid.py", "r") as f:
    code = f.read()

old_model = """class OceanPhysicsAutoencoder(nn.Module):
    def __init__(self):
        super(OceanPhysicsAutoencoder, self).__init__()
        
        # 12 Channels: 7 core + 2 Time (Sin/Cos) + 2 Space (Lat/Lon) + 1 Bathymetry
        self.register_buffer('input_mean', torch.zeros(1, 12, 1, 1))
        self.register_buffer('input_std', torch.ones(1, 12, 1, 1))
        self.register_buffer('target_mean', torch.zeros(1, 15, 1, 1))
        self.register_buffer('target_std', torch.ones(1, 15, 1, 1))
        
        self.encoder = nn.Sequential(
            nn.Conv2d(12, 32, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.Conv2d(32, 64, kernel_size=3, padding=1),
            nn.BatchNorm2d(64),
            nn.ReLU(),
            nn.MaxPool2d(2)
        )
        
        self.attention = SpatialAttention()
        
        self.decoder = nn.Sequential(
            nn.ConvTranspose2d(64, 32, kernel_size=2, stride=2),
            nn.ReLU(),
            nn.Conv2d(32, 15, kernel_size=3, padding=1)
        )

    def forward(self, x):
        # 1. Normalize
        x = (x - self.input_mean) / (self.input_std + 1e-8)
        
        # 2. Encode
        features = self.encoder(x)
        
        # 3. Apply Spatial Attention (Physics-focus)
        attended_features = self.attention(features)
        
        # 4. Decode to 15 depths
        out = self.decoder(attended_features)
        
        # We output standard normal, and denormalize in inference
        return out"""

new_model = """class OceanHybridTransformer(nn.Module):
    def __init__(self):
        super(OceanHybridTransformer, self).__init__()
        
        # 12 Channels: 7 core + 2 Time (Sin/Cos) + 2 Space (Lat/Lon) + 1 Bathymetry
        self.register_buffer('input_mean', torch.zeros(1, 12, 1, 1))
        self.register_buffer('input_std', torch.ones(1, 12, 1, 1))
        self.register_buffer('target_mean', torch.zeros(1, 15, 1, 1))
        self.register_buffer('target_std', torch.ones(1, 15, 1, 1))
        
        # 1. CNN LOCAL EXTRACTOR (Detects eddies, coastlines)
        self.cnn_encoder = nn.Sequential(
            nn.Conv2d(12, 32, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.Conv2d(32, 64, kernel_size=3, padding=1),
            nn.BatchNorm2d(64),
            nn.ReLU(),
            nn.MaxPool2d(2) # Reduces 32x32 to 16x16
        )
        
        # 2. VISION TRANSFORMER BLOCK (Global basin-wide currents & teleconnections)
        # Sequence length = 16x16 (256 patches), Embedding Dim = 64
        encoder_layer = nn.TransformerEncoderLayer(d_model=64, nhead=4, dim_feedforward=256, dropout=0.1, batch_first=True)
        self.transformer = nn.TransformerEncoder(encoder_layer, num_layers=2)
        
        # 3. ATTENTION BOTTLENECK (Hybrid fusion)
        self.attention = SpatialAttention()
        
        # 4. DECODER
        self.decoder = nn.Sequential(
            nn.ConvTranspose2d(64, 32, kernel_size=2, stride=2),
            nn.ReLU(),
            nn.Conv2d(32, 15, kernel_size=3, padding=1)
        )

    def forward(self, x):
        # Normalize
        x = (x - self.input_mean) / (self.input_std + 1e-8)
        
        # CNN Encoding
        features = self.cnn_encoder(x) # Shape: [Batch, 64, 16, 16]
        b, c, h, w = features.shape
        
        # Flatten for Transformer: [Batch, Sequence=256, Embed=64]
        flat_features = features.view(b, c, h * w).permute(0, 2, 1)
        
        # ViT Global Processing
        transformer_out = self.transformer(flat_features)
        
        # Unflatten back to CNN shape
        features = transformer_out.permute(0, 2, 1).view(b, c, h, w)
        
        # Attention Fusion & Decoding
        attended_features = self.attention(features)
        out = self.decoder(attended_features)
        
        return out"""

code = code.replace(old_model, new_model)
code = code.replace("model = OceanPhysicsAutoencoder().to(device)", "model = OceanHybridTransformer().to(device)")
code = code.replace("oceanembed_pinn_v5.pth", "oceanembed_v6_hybrid.pth")

with open("deeplearning_engine/scripts/train_v6_hybrid.py", "w") as f:
    f.write(code)
print("Created V6 CNN-ViT Hybrid script.")
