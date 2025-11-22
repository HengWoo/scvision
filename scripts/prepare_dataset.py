#!/usr/bin/env python3
"""
Sugarcane Disease Dataset Preparation Script

This script organizes the Kaggle sugarcane disease dataset into
YOLO classification format with train/val/test splits.

Usage:
    python prepare_dataset.py --source /path/to/kaggle/dataset --dest ./dataset
"""

import argparse
import os
import shutil
from pathlib import Path
from typing import Dict, List
import random
import yaml
from collections import defaultdict


# Disease class mapping
CLASS_NAMES = {
    0: 'Healthy',
    1: 'Mosaic',
    2: 'Redrot',
    3: 'Rust',
    4: 'Yellow'
}


def discover_dataset_structure(source_path: Path) -> Dict[str, List[Path]]:
    """
    Discover and organize images by class from the downloaded dataset.

    Args:
        source_path: Path to the downloaded Kaggle dataset

    Returns:
        Dictionary mapping class names to lists of image paths
    """
    print(f"\n🔍 Discovering dataset structure in: {source_path}")

    class_images = defaultdict(list)
    image_extensions = {'.jpg', '.jpeg', '.png', '.bmp', '.tiff'}

    # Walk through all directories to find images
    for root, dirs, files in os.walk(source_path):
        for file in files:
            if Path(file).suffix.lower() in image_extensions:
                file_path = Path(root) / file

                # Try to infer class from directory name or filename
                # Common patterns: directory name or filename contains class name
                folder_name = Path(root).name.lower()
                file_name = file.lower()

                # Check which class this image belongs to
                for class_name in CLASS_NAMES.values():
                    class_lower = class_name.lower()
                    if class_lower in folder_name or class_lower in file_name:
                        class_images[class_name].append(file_path)
                        break

    # Print discovered statistics
    print("\n📊 Dataset Discovery Results:")
    total_images = 0
    for class_name in sorted(class_images.keys()):
        count = len(class_images[class_name])
        total_images += count
        print(f"   {class_name}: {count} images")
    print(f"   Total: {total_images} images")

    return dict(class_images)


def split_dataset(class_images: Dict[str, List[Path]],
                 train_ratio: float = 0.7,
                 val_ratio: float = 0.2,
                 test_ratio: float = 0.1,
                 seed: int = 42) -> Dict[str, Dict[str, List[Path]]]:
    """
    Split images into train/val/test sets per class.

    Args:
        class_images: Dictionary mapping class names to image paths
        train_ratio: Proportion for training set (default: 0.7)
        val_ratio: Proportion for validation set (default: 0.2)
        test_ratio: Proportion for test set (default: 0.1)
        seed: Random seed for reproducibility

    Returns:
        Dictionary with split datasets
    """
    random.seed(seed)

    splits = {
        'train': defaultdict(list),
        'val': defaultdict(list),
        'test': defaultdict(list)
    }

    print(f"\n✂️  Splitting dataset (train: {train_ratio:.0%}, val: {val_ratio:.0%}, test: {test_ratio:.0%})")

    for class_name, images in class_images.items():
        # Shuffle images for random split
        shuffled = images.copy()
        random.shuffle(shuffled)

        total = len(shuffled)
        train_end = int(total * train_ratio)
        val_end = train_end + int(total * val_ratio)

        splits['train'][class_name] = shuffled[:train_end]
        splits['val'][class_name] = shuffled[train_end:val_end]
        splits['test'][class_name] = shuffled[val_end:]

        print(f"   {class_name}: {len(splits['train'][class_name])} train, "
              f"{len(splits['val'][class_name])} val, "
              f"{len(splits['test'][class_name])} test")

    return splits


def copy_images(splits: Dict[str, Dict[str, List[Path]]], dest_path: Path):
    """
    Copy images to the destination directory structure.

    Args:
        splits: Split datasets from split_dataset()
        dest_path: Destination directory path
    """
    print(f"\n📁 Organizing images into: {dest_path}")

    total_copied = 0

    for split_name, classes in splits.items():
        for class_name, images in classes.items():
            # Create destination directory
            dest_dir = dest_path / split_name / class_name
            dest_dir.mkdir(parents=True, exist_ok=True)

            # Copy images
            for img_path in images:
                dest_file = dest_dir / img_path.name
                shutil.copy2(img_path, dest_file)
                total_copied += 1

            print(f"   ✓ {split_name}/{class_name}: {len(images)} images")

    print(f"\n✅ Successfully copied {total_copied} images")


def create_data_yaml(dest_path: Path, class_names: Dict[int, str]):
    """
    Create data.yaml configuration file for YOLO training.

    Args:
        dest_path: Dataset directory path
        class_names: Dictionary mapping class IDs to names
    """
    yaml_path = dest_path / 'data.yaml'

    data_config = {
        'path': str(dest_path.absolute()),
        'train': 'train',
        'val': 'val',
        'test': 'test',
        'nc': len(class_names),
        'names': class_names
    }

    with open(yaml_path, 'w') as f:
        yaml.dump(data_config, f, default_flow_style=False, sort_keys=False)

    print(f"\n📝 Created data.yaml at: {yaml_path}")
    print("\n" + "="*50)
    print("data.yaml contents:")
    print("="*50)
    with open(yaml_path, 'r') as f:
        print(f.read())
    print("="*50)


def main():
    parser = argparse.ArgumentParser(
        description='Prepare sugarcane disease dataset for YOLO classification training'
    )
    parser.add_argument(
        '--source',
        type=str,
        required=True,
        help='Path to the downloaded Kaggle dataset'
    )
    parser.add_argument(
        '--dest',
        type=str,
        default='./dataset',
        help='Destination directory for organized dataset (default: ./dataset)'
    )
    parser.add_argument(
        '--train-ratio',
        type=float,
        default=0.7,
        help='Training set ratio (default: 0.7)'
    )
    parser.add_argument(
        '--val-ratio',
        type=float,
        default=0.2,
        help='Validation set ratio (default: 0.2)'
    )
    parser.add_argument(
        '--test-ratio',
        type=float,
        default=0.1,
        help='Test set ratio (default: 0.1)'
    )
    parser.add_argument(
        '--seed',
        type=int,
        default=42,
        help='Random seed for reproducibility (default: 42)'
    )

    args = parser.parse_args()

    # Convert paths
    source_path = Path(args.source)
    dest_path = Path(args.dest)

    # Validate source path
    if not source_path.exists():
        print(f"❌ Error: Source path does not exist: {source_path}")
        return

    # Validate ratios
    total_ratio = args.train_ratio + args.val_ratio + args.test_ratio
    if abs(total_ratio - 1.0) > 0.01:
        print(f"❌ Error: Train/val/test ratios must sum to 1.0 (got {total_ratio})")
        return

    print("="*70)
    print("  SUGARCANE DISEASE DATASET PREPARATION")
    print("="*70)

    # Step 1: Discover dataset structure
    class_images = discover_dataset_structure(source_path)

    if not class_images:
        print("\n❌ Error: No images found in source directory")
        return

    # Step 2: Split dataset
    splits = split_dataset(
        class_images,
        args.train_ratio,
        args.val_ratio,
        args.test_ratio,
        args.seed
    )

    # Step 3: Copy images to destination
    copy_images(splits, dest_path)

    # Step 4: Create data.yaml
    create_data_yaml(dest_path, CLASS_NAMES)

    print("\n" + "="*70)
    print("  ✅ DATASET PREPARATION COMPLETE!")
    print("="*70)
    print(f"\n📍 Dataset location: {dest_path.absolute()}")
    print(f"📍 Config file: {dest_path.absolute() / 'data.yaml'}")
    print("\n🚀 Next steps:")
    print("   1. Open notebooks/train_colab.ipynb in Google Colab")
    print("   2. Upload this dataset folder to Colab or use Google Drive")
    print("   3. Run the training notebook")
    print("\n" + "="*70 + "\n")


if __name__ == '__main__':
    main()
