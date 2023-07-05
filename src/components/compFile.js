import React, { useState , useEffect } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import huffman from "./compress"
import "../compFile.css";
import { saveAs } from 'file-saver';
import decompress_the_file from "./decompress"

export default function CompFile(props) {

  const [filedata , setfiledata] = useState(null);
  const [isShown, setIsShown] = useState(false);
  const [compressedFile, setcompressedFile] = useState(null);
  const [decompressedFile, setdecompressedFile] = useState(null);
  const [filename, setfilename] = useState(null);
  const [filesize, setfilesize] = useState(null);
  const [buttonPress, setbuttonPress] = useState(false);
  const [cod,setcod] = useState(-1);
  const [compressed_by , setcompressed_by] = useState(0);


  let filereader;

  function getFile(event){
    const file = event.target.files[0];


if(!file){
  return;
}

    filereader = new FileReader();
  
    filereader.onload = () => {
      let data = filereader.result;
        setfiledata(data);      
    };
  
    filereader.readAsText(file);
    setfilename(file.name);
    setfilesize(file.size);
  }

  function compressing_file(){
    setbuttonPress(false);
    setIsShown(true);
  }

  function decompressing_file(){
    setbuttonPress(false);
    setIsShown(true);
  }

  function compress() {
    if (filedata == null) {
      alert("please upload a file");
    } else {
      setcod(1);
      setbuttonPress(true);
      var vl = filedata;
      setcompressedFile(huffman(vl));
      setTimeout(compressing_file, 2000);
      // console.log(vl.length);
    }
  }

  function decompress() {
    if (filedata == null) {
      alert("please upload a file");
    } else {
      setcod(2);
      setbuttonPress(true);
      var vl = filedata;
      console.log("decompressed file");
      // console.log(vl);
      // console.log(vl.length); 
      // console.log(decompress_the_file(filedata));
      // setd
      setdecompressedFile(decompress_the_file(filedata));
      setTimeout(decompressing_file, 2000);
    }
  }


  function downloadfle() {
    const link = document.createElement("a");
    

    let file ;
    if(cod==1){
      console.log("asdadf",compressedFile);      
      file  = new Blob([compressedFile],{ type: 'text/plain' });

    console.log("fsdfa",file);
    }
    else if(cod==2){
        file  = new Blob([decompressedFile], { type: "text/plain" });
    }
    else{
        console.log("{{{{{{{{{{{{{{{{ERROR in download fle if else conditions}}}}}}}}}}}}}}")
    }

    link.href = URL.createObjectURL(file);

    if(cod==1){
    link.download = filename.substring(0, filename.length - 4) + "_compressed.bin";
    }
    else if(cod==2){
        link.download = filename.substring(0, filename.length - 4) + "_decompressed.txt";    
    }
    else{
        console.log("{{{{{{{{{{{{{ERROR}}}}}}}}}}}}");
    }

    console.log(link.download);
    link.click();

    // console.log("fsdfa");
    // saveAs(file, 'file.bin');

    URL.revokeObjectURL(link.href);
    console.log("done");
  }


  useEffect(() => {
   if(cod==1){ 
    // console.log("___________+_+_+_+_+++++++++++++____________________");
    // console.log(filedata.length , "   ", compressedFile.length);
    let cmp = ((filedata.length - compressedFile.length)/filedata.length)*100;
    // console.log(cmp);
    
    setcompressed_by( Math.floor(cmp) )
  }
  }, [filedata , compressedFile]);

  // if(cod==1 && filedata!=null && compressedFile!=null){
  // console.log("___________+_+_+_+_+++++++++++++____________________");
  // console.log(filedata.length , "   ", compressedFile.length);
  // let cmp = ((filedata.length - compressedFile.length)/filedata.length)*100;
  // console.log(cmp);
  // setcompressed_by( cmp );
  // }

  const handleSubmit = (event) => {
    event.preventDefault(); // 👈️ prevent page refresh
  };

  return (
    <div className="par">
      <form onSubmit={handleSubmit} className="frm1">
        <div className="div2">
          <h2>Upload File</h2>
        </div>

        <div className="div2">
          <input type="file" name="file" onChange={getFile} />
        </div>

        <div className="div3">
          <button type="submit" onClick={compress}>
            Compress
          </button>

          <button type="submit" onClick={decompress}>
            Decompress
          </button>            
        </div>
      </form>

      {buttonPress===true && (<ClipLoader/>)}

      {isShown === true &&  (
        <div className="frm1">
          <div className="div2">
            <h2>Download File</h2>
          </div>
          <div className="div2">
            <button onClick={downloadfle}>Download</button>
          </div>
          <div className="div2">
            compressed by : {compressed_by} %
          </div>
        </div>
      )}

    </div>
  );
}
