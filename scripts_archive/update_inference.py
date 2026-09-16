import re

with open("backend/app/services/inference.py", "r") as f:
    code = f.read()

# Replace MODEL_PATH
code = re.sub(r'MODEL_PATH = .*', 'MODEL_PATH = Path(__file__).resolve().parents[3] / "deeplearning_engine" / "weights" / "oceanembed_pinn_v5.pth"', code)

# Define the new Architecture string
new_arch = """class SpatialAttention(nn.Module):
    def __init__(self, kernel_size=7):
        super().__init__()
        self.conv = nn.Conv2d(2, 1, kernel_size=kernel_size, padding=kernel_size//2)
        self.sigmoid = nn.Sigmoid()

    def forward(self, x):
        avg_out = torch.mean(x, dim=1, keepdim=True)
        max_out, _ = torch.max(x, dim=1, keepdim=True)
        y = torch.cat([avg_out, max_out], dim=1)
        y = self.conv(y)
        return x * self.sigmoid(y)

class OceanSpatialAutoencoder(nn.Module):
    def __init__(self):
        super(OceanSpatialAutoencoder, self).__init__()
        
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

    def load_normalization_stats(self, json_path):
        if not os.path.exists(json_path):
            return
            
        import json
        with open(json_path, 'r') as f:
            stats = json.load(f)
            
        self.input_mean[0, 0, 0, 0] = stats.get('thetao', {}).get('mean', 28.0)
        self.input_std[0, 0, 0, 0]  = stats.get('thetao', {}).get('std', 3.0)
        self.input_mean[0, 1, 0, 0] = stats.get('so', {}).get('mean', 35.0)
        self.input_std[0, 1, 0, 0]  = stats.get('so', {}).get('std', 1.0)
        self.input_mean[0, 2, 0, 0] = stats.get('zos', {}).get('mean', 0.0)
        self.input_std[0, 2, 0, 0]  = stats.get('zos', {}).get('std', 0.5)
        
        self.target_mean.fill_(stats.get('thetao', {}).get('mean', 15.0))
        self.target_std.fill_(stats.get('thetao', {}).get('std', 10.0))
        
    def forward(self, x):
        x_norm = (x - self.input_mean) / self.input_std
        features = self.encoder(x_norm)
        features = self.attention(features)
        out_norm = self.decoder(features)
        return (out_norm * self.target_std) + self.target_mean"""

# Regex replacement for architecture
code = re.sub(r'class SpatialAttention.*?(?=class InferenceService)', new_arch + "\n\n", code, flags=re.DOTALL)

# Also update the prediction code to 12 channels
old_predict = r'input_tensor = torch\.tensor\(\[sst, sss, ssh, 0\.0, 0\.0, 0\.0, 0\.0\], dtype=torch\.float32\)'
new_predict = r'# Compute dynamic physics inputs\n                import pandas as pd\n                try:\n                    doy = pd.to_datetime(date_str).dayofyear\n                except:\n                    doy = 180\n                sin_t = math.sin(2 * math.pi * doy / 365.25)\n                cos_t = math.cos(2 * math.pi * doy / 365.25)\n                bathy_proxy = 0.5\n                input_tensor = torch.tensor([sst, sss, ssh, 0.0, 0.0, 0.0, 0.0, sin_t, cos_t, lat/90.0, lon/180.0, bathy_proxy], dtype=torch.float32)'
code = re.sub(old_predict, new_predict, code)

# Update tensor shape expansion
code = code.replace(".view(1, 7, 1, 1).expand(1, 7, 32, 32)", ".view(1, 12, 1, 1).expand(1, 12, 32, 32)")
code = code.replace("OceanEmbed-v2.0 (PyTorch Deep Learning)", "OceanEmbed-v5.0 PINN (Physics-Informed)")

# Update version fallback logic
old_fallback = """        v4_path = Path(__file__).resolve().parents[3] / "deeplearning_engine" / "weights" / "oceanembed_hybrid_v4_full.pth"
        v3_path = Path(__file__).resolve().parents[3] / "deeplearning_engine" / "weights" / "oceanembed_hybrid_v3_7_channel.pth"
        
        MODEL_PATH = v4_path if v4_path.exists() else v3_path"""
new_fallback = '        MODEL_PATH = Path(__file__).resolve().parents[3] / "deeplearning_engine" / "weights" / "oceanembed_pinn_v5.pth"'
code = code.replace(old_fallback, new_fallback)

with open("backend/app/services/inference.py", "w") as f:
    f.write(code)

print("Updated inference.py to v5!")
