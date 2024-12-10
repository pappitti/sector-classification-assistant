import { pipeline, env } from '@xenova/transformers';
import gics from './assets/GICS.json' assert { type: 'json' };
import nace from './assets/NACE.json' assert { type: 'json' };

env.allowLocalModels = false;
env.useBrowserCache= true; 
// largely based on https://huggingface.co/docs/transformers.js/tutorials/react

class MyEmbeddingPipeline {
  static task = "feature-extraction";
  static models = {
    "all-MiniLM": ["Xenova/all-MiniLM-L6-v2","all-MiniLM-L6-v2"], //model to retrieve from HuggingFace Hub, model key in the sectors json files. To add new embeddings, see README 
    "bge-small": ["Xenova/bge-small-en-v1.5","BAAI/bge-small-en-v1.5"]          
  };
  static instances = {};

  static async loadModel(modelKey, progress_callback = null) {
    //check if model key is valid
    if (!this.models[modelKey]) {
      throw new Error('Invalid model key');
    }
    //create a new instance if it doesn't exist
    if (!this.instances[modelKey]) {
      this.instances[modelKey] = pipeline(this.task, this.models[modelKey][0], { progress_callback});
    }
  }

  static async getInstance(modelKey, progress_callback = null) {
    //checking should not be necessary, but just in case
    if (!this.instances[modelKey]) {
      this.instances[modelKey] = pipeline(this.task, this.models[modelKey][0], { progress_callback});
    }
    // retrieves the instance
    return this.instances[modelKey];
  }
}

// Cosine similarity (transformers.js has this built-in but we wanted to use our own for science)
function cosineSimilarity(vecA, vecB) {
    let dotProduct = 0.0;
    let normA = 0.0;
    let normB = 0.0;


    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        normA += vecA[i] * vecA[i];
        normB += vecB[i] * vecB[i];
    }

    normA = Math.sqrt(normA);
    normB = Math.sqrt(normB);


    return dotProduct / (normA * normB);
}


// Listen for messages from the main thread
self.addEventListener('message', async (event) => {
    const modelKey = event.data.model;
    console.log(event.data) // Just keeping this here to see what's coming in from the main thread

     // Check if the model key is valid. If you want to add more models, you need to add them to  MyEmbeddingPipeline.models["modelKey"] = ["model name", "embedding name"]
    if (!MyEmbeddingPipeline.models[modelKey]) {
      self.postMessage({ status: 'error', message: 'Invalid model key' });
      return;
    }

    if (event.data.task === "initialize") {
      // Retrieve the extraction pipeline. When called for the first time,
      // this will load the pipeline and save it for future use.
      if (!MyEmbeddingPipeline.instances[modelKey]){
        self.postMessage({ status: 'clean', message: 'new model' });
        let extractor = await MyEmbeddingPipeline.loadModel(modelKey,x => {
          // We also add a progress callback to the pipeline so that we can
          // track model loading.
          self.postMessage(x);
      });
      }
    }
    
    if (event.data.task === "classify") {
      // Actually perform the extraction
      let extractor = await MyEmbeddingPipeline.getInstance(modelKey,x => {
      // If, for some reason, the model is not loaded yet, we can track the download progress
        self.postMessage(x);
      });
      let output = await extractor(event.data.text, { pooling: 'mean', normalize: true }); //normalization is necessary if you use built-in functions, we do in our own cosine similarity function anyway so we could ignore it here

      let jsonEmbeddings= gics;
      if (event.data.classification === 'NACE') {
          jsonEmbeddings = nace;
          }

      // calculate cosine similarity based on embeddings saved in json file
      let similarities = jsonEmbeddings.map((embedding, index) => {
          const similarityScore = cosineSimilarity(output.tolist()[0], embedding["embedding"][MyEmbeddingPipeline.models[modelKey][1]]);
          return [index,similarityScore]
          }).sort((a, b) => b[1] - a[1]);

      
      //only sends the top 100 results back to the main thread (does not really change anything in the end, but makes it easier to work with in the main thread)
      let topK = similarities.slice(0, 100)
    

      topK = topK.map((item) => { return {score:item[1],description:jsonEmbeddings[item[0]]["description"],levels:jsonEmbeddings[item[0]]["metadata"],exclusions:jsonEmbeddings[item[0]]["exclusions"]}});
      // Send the output back to the main thread
      self.postMessage({
          status: 'complete',
          output: topK, 
      });
    }});
  