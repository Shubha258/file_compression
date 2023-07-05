class HuffmanNode
{
    constructor()
    {
        this.data = 0;
        this.c = '';
        this.left = this.right = null;
    }
}


export default function func(cl){

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


    function printCode(root,s ,code)
    {
        // console.log("-----------------------==============---------------------");

        // console.log(root.c);

        if (root.left == null && root.right == null){
            console.log(root.c + "  k:  " + s);
            code.set(root.c , s);
            return;
        }
  
        // && (root.c).toLowerCase() != (root.c).toUpperCase()
        
        if(root.left==null  || root.right==null){
            console.log("----------------------==============---------------------")
            return;
        }

        printCode(root.left, s + "0",code);
        printCode(root.right, s + "1",code);
    }
  
        var d = new Map();

        cl.split('').forEach(element => {
     
            if(d.has(element))
            {
                d.set(element, d.get(element)+1);
            }
            else
                d.set(element, 1);
      });


      let charArray=[];
      let charfreq=[];

      for (const [key, value] of d.entries()) {
        console.log(`Element: ${key}, Frequency: ${value}`);
        charArray.push(key);
        charfreq.push(value);
      }

      let n = charArray.length;
  
        let q = [];
        for (let i = 0; i < n; i++) {
            let hn = new HuffmanNode();  
            hn.c = charArray[i];
            hn.data = charfreq[i];
            hn.left = null;
            hn.right = null;
            q.push(hn);
        }
        let root = null;
          q.sort(function(a,b){return a.data-b.data;});
        while (q.length > 1) {
            let x = q[0];
            q.shift();
            let y = q[0];
            q.shift();
            let f = new HuffmanNode();
            f.data = x.data + y.data;
            f.c = '-';
            f.left = x;
            f.right = y;
            root = f;
            q.push(f);
            q.sort(function(a,b){return a.data-b.data;});
        }


        // to get the huffman codes don't ruff it
        var code = new Map();
        console.log("-----------------------==============---------------------");
        printCode(root, "" , code);

        // for (const [key, value] of code.entries()) {
        //     console.log(`Element: ${key}, Frequency: ${value}`);
        // } 



        let vcnt = "";

        cl.split('').forEach(element => {
            vcnt = vcnt + code.get(element);
      });


      let tree_str = make_tree(root);
      let size_tree = tree_str.length;

console.log("compressed: ",vcnt);

      let padding = (8 - (vcnt.length)%8)%8;

      for(let i=0;i<padding;i++){
        vcnt+="0";
      }

      let compress_message = "";

      for(let i=0;i<vcnt.length;){
        let count = 0;
        for(let j = 0;j<8;j++,i++){
            count*=2;
            count += vcnt[i] - '0';
        }
        compress_message += String.fromCharCode(count);
      }

      let final_compressed_message = size_tree.toString() + '#' + padding.toString() + '#' + tree_str + compress_message;

console.log("Compression ratio: ",final_compressed_message.length , "  ", cl.length);

return final_compressed_message;
}

