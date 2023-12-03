function Warning({acknowledgeWarning}) {
    return (
        <div className="w-full flex flex-wrap justify-start p-2">
            <div className="w-full text-start font-semibold text-xl">Important Notice</div>
            <p className="w-full text-start py-1">This AI-powered classification assistant is an application that runs on the client side, i.e on your device. This guarantees data privacy as your inputs are processed on your hardware, which can explain differences in performance between users.</p>
           <p className="w-full text-start py-1">However, running a machine-learning model on your device requires downloading the model first. Models are downloaded from the HuggingFace hub; <a href="https://huggingface.co/Xenova/bge-small-en-v1.5">bge-small-en-v1.5</a> is downloaded by default. We kept the option to use another model, <a href="https://huggingface.co/Xenova/all-MiniLM-L6-v2">all-MiniLM-L6-v2</a>, which may yield better results based on our tests. This app does not use cookies and does not handle browser cache so models are downloaded again at each new session.</p>
           <p className="w-full text-start py-1">This app is a demo built to illustrate real-life use cases of AI, working exclusively with basic building blocks in order to demystify this technology. Read the blog post <a href="https://www.pitti.io/blogs">here</a>. The code of this app is available <a href="https://github.com/pappitti">here</a>.</p>
            <div className="w-full flex justify-end py-2">
                <button className="text-white font-bold py-2 px-4 rounded" onClick={()=>acknowledgeWarning()}>Start session</button> 
            </div>
        </div>
    )
  }

export default Warning;