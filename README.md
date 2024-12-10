# Sector Classification Assistant

## The broader project

This app was built as a demo to illustrate real-life use cases of AI, working exclusively with basic building blocks in order to demystify this technology. This explains why we reinvent the wheel in the worker.js file. 

Read about other solutions we have built or tested in context of that project to classify companies by sector: https://www.pitti.io/blogs/ELIAAM/sector-classification 

## This sector classification assistant

This AI-powered classification assistant performs semantic search comparing your company description to all sectors (level 4) in the chosen classification and orders them by similarity scores. This tool can narrow down the options but should not be trusted to identify the correct answer.   

This application was built using the Vite template, which provides a minimal setup to get React working in Vite with HMR and some ESLint rules. The app runs on the client side. This guarantees data privacy but it means that performance can vary between users. Client-side inference requires downloading a model first. Models are downloaded from the HuggingFace hub; bge-small-en-v1.5 is downloaded by default. We kept the option to use another model, all-MiniLM-L6-v2, which may yield better results based on our tests. This app is just a demo but if precision is what you need, you should consider using bge-large-en-v1.5. See "Running other models" below.  

## Running other versions of the model

The app runs the quantized version of the models by default. This allows faster download and inference of the model but quantized models are less precise. If you wish to use the original versions of the models (onnx format), you can do so by passing { quantized: false } as an optional argument when pipeline() is called to create a new instance in the worker.js file. Please refer to the Transformers.js documentation : https://huggingface.co/docs/transformers.js/api/pipelines

## Running other models

If you wish to run other models by modifying MyEmbeddingPipeline in worker.js, note that you need to modify the classification files (/assets/GICS.json and /asset/NACE.json) as the sector description embeddings are stored there, but only for bge-small-en-v1.5 and all-MiniLM-L6-v2. This repo (in python) can provide tools to this by just passing the name of the new model : https://github.com/pappitti/sector-classification
It can also be used to embed sectors according to your own classifications
