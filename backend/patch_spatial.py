with open("app/services/spatial_engine.py", "r") as f:
    content = f.read()

content = content.replace(
    "ssh = np.nan_to_num(ds.zos.isel(time=0).values, nan=0.0)",
    "ssh = np.nan_to_num(ds.zos.isel(time=0).squeeze().values, nan=0.0)"
)

with open("app/services/spatial_engine.py", "w") as f:
    f.write(content)
