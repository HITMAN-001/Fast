from setuptools import setup, find_packages

setup(
    name="learning-fastapi",
    version="0.1.0",
    packages=find_packages(where="Fast-Backend"),
    package_dir={"": "Fast-Backend"},
    install_requires=[
        "fastapi>=0.68.0",
        "uvicorn>=0.15.0",
        "sqlalchemy>=1.4.0",
        "python-jose[cryptography]>=3.3.0",
        "passlib[bcrypt]>=1.7.4",
        "pytest>=7.0.0",
    ],
)
