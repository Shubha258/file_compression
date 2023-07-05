import func from "./compress";

class HuffmanNode
{
    constructor()
    {
        this.data = 0;
        this.c = '';
        this.left = this.right = null;
    }
}

function generate_original_message(ptr , message){
    let n = message.length;
    let i = 0;
    let sand="";
    let nod = ptr;

    while(i<n){
        if(message[i]=='0'){
            nod = nod.left;
        }
        else{
            nod = nod.right;
        }
        if(nod.left==null && nod.right==null){
            sand+=nod.c;
            nod = ptr;
        }
    i+=1;
    }
return sand;
}

function make_tree(ptr){

    let str = "";
    
            var queue = [];
            
            queue.push(ptr);
    
            let vl;
            while(queue.length!=0){
                vl = queue.shift();
                if(vl==null){
    
    // console.log("NULL");
                    str+="+";
                }
                else{
    
                    // console.log(vl.c , "  " ,vl.data);
    
                    str+=vl.c;
                    queue.push(vl.left);
                    queue.push(vl.right);          
                }
            }
    
    return str;
            }


function construct_tree(str){

console.log("__________________________");

    let n = str.length;
    
    let vec=[];

    for(let k=0;k<n;k++){
        if(str[k]=='+'){
            vec.push(null);
        }
        else{
            let f = new HuffmanNode();
            f.c = str[k];
            vec.push(f);
        }
    }



    let i=0,j=1;
    
    while(j<n){
    
        console.log(j," : ",n);
    
        vec[i].left = vec[j];
        vec[i].right = vec[j+1];
        i+=1;
        while(i<n && vec[i]==null){
            i+=1;
        }
        j+=2;
    }


    console.log("__________________________");

    // console.log(vec);
    // console.log(vec[0]);
    // console.log(vec[0].c);

let ptr = vec[0];

return ptr;
}


function retrieve_message(str){
    let vl = "";
for(let i=0;i<str.length;i++){
    vl += (str.charCodeAt(i)).toString(2).padStart(8,'0');  
}
return vl;
}

 export default function decomp(text){

let temp = text;
let tree_length = "";
let padding_length = "";
let tree_str="";
let message="";
let n = temp.length;

let i=0;

while(temp[i]!='#'){
    tree_length += temp[i];
    i+=1;
}

i+=1;

while(temp[i]!='#'){
    padding_length += temp[i];
    i+=1;
}

i+=1;


tree_length = Number(tree_length);
padding_length = Number(padding_length);

for(let j=0;j<tree_length;j++){
tree_str += temp[i];
i+=1;
}

console.log("i is" , i);
console.log("n is " , n);

while(i<n){
    message += temp[i];
    i+=1;
}


let binary_message = retrieve_message(message);
binary_message = binary_message.substring(0,binary_message.length-padding_length);
// console.log("decompressed: ",binary_message);

let ptr = null;

// regenerating the huffman tree 
ptr = construct_tree(tree_str);

let original_message = generate_original_message(ptr , binary_message);

return original_message;
}