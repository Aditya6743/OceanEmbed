import re

with open("deeplearning_engine/scripts/train_physics.py", "r") as f:
    code = f.read()

# Add resuming logic to train_model
old_init = """    model.to(device)
    
    full_dataset = PhysicsOceanDataset(processed_dirs=["""

new_init = """    model.to(device)
    
    save_path = "../weights/oceanembed_pinn_v5.pth"
    start_epoch = 0
    if os.path.exists(save_path):
        logger.info(f"Resuming training from {save_path}...")
        model.load_state_dict(torch.load(save_path, map_location=device))
        start_epoch = 15 # Resume from where we left off
    
    full_dataset = PhysicsOceanDataset(processed_dirs=["""
code = code.replace(old_init, new_init)


old_loop = """    epochs = 15
    best_val_loss = float('inf')
    save_path = "../weights/oceanembed_pinn_v5.pth"
    os.makedirs("../weights", exist_ok=True)
    
    logger.info(f"Starting Training on {device}...")
    
    for epoch in range(epochs):"""

new_loop = """    epochs = 30 # Increased to train further
    best_val_loss = float('inf')
    os.makedirs("../weights", exist_ok=True)
    
    logger.info(f"Starting/Resuming Training on {device} (Target: {epochs} epochs)...")
    
    for epoch in range(start_epoch, epochs):"""
code = code.replace(old_loop, new_loop)


with open("deeplearning_engine/scripts/train_physics.py", "w") as f:
    f.write(code)
print("Patched train_physics.py to resume training.")
