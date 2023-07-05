#include <iostream>
#include <fstream>
#include <queue>
#include <unordered_map>
using namespace std;

// Huffman tree node
struct Node {
    char data;
    int frequency;
    Node* left, * right;
    Node(char data, int frequency) : data(data), frequency(frequency), left(nullptr), right(nullptr) {}
};

// Comparison function for priority queue
struct Compare {
    bool operator()(Node* l, Node* r) {
        return l->frequency > r->frequency;
    }
};

// Utility function to create Huffman tree
Node* buildHuffmanTree(const unordered_map<char, int>& frequencies) {
    priority_queue<Node*, vector<Node*>, Compare> pq;

    for (const auto& pair : frequencies) {
        pq.push(new Node(pair.first, pair.second));
    }

    while (pq.size() != 1) {
        Node* left = pq.top();
        pq.pop();

        Node* right = pq.top();
        pq.pop();

        Node* parent = new Node('-', left->frequency + right->frequency);
        parent->left = left;
        parent->right = right;

        pq.push(parent);
    }

    return pq.top();
}

// Utility function to encode characters in Huffman tree
void encode(Node* root, string code, unordered_map<char, string>& codes) {
    if (root == nullptr) {
        return;
    }

    if (!root->left && !root->right) {
        codes[root->data] = code;
    }

    encode(root->left, code + "0", codes);
    encode(root->right, code + "1", codes);
}

// Utility function to compress the file
void compressFile(const string& inputFile, const string& outputFile) {
    ifstream input(inputFile, ios::binary);
    ofstream output(outputFile, ios::binary);

    unordered_map<char, int> frequencies;

    char c;
    while (input.get(c)) {
        frequencies[c]++;
    }

    Node* root = buildHuffmanTree(frequencies);
    unordered_map<char, string> codes;
    encode(root, "", codes);

    // Writing Huffman tree to the output file
    output << frequencies.size() << "\n";
    for (const auto& pair : frequencies) {
        output << pair.first << " " << pair.second << "\n";
    }

    // Writing compressed data to the output file
    input.clear();
    input.seekg(0);

    string buffer;
    while (input.get(c)) {
        buffer += codes[c];
        while (buffer.length() >= 8) {
            unsigned char byte = 0;
            for (int i = 0; i < 8; i++) {
                byte <<= 1;
                if (buffer[i] == '1') {
                    byte |= 1;
                }
            }
            output << byte;
            buffer = buffer.substr(8);
        }
    }

    // Writing remaining bits
    if (!buffer.empty()) {
        unsigned char byte = 0;
        for (char bit : buffer) {
            byte <<= 1;
            if (bit == '1') {
                byte |= 1;
            }
        }
        byte <<= (8 - buffer.length());
        output << byte;
    }

    input.close();
    output.close();
}

// Utility function to decode the file
void decompressFile(const string& inputFile, const string& outputFile) {
    ifstream input(inputFile, ios::binary);
    ofstream output(outputFile, ios::binary);

    unordered_map<char, int> frequencies;

    // Reading Huffman tree from the input file
    int uniqueChars;
    input >> uniqueChars;
    input.ignore();

    for (int i = 0; i < uniqueChars; i++) {
        char c;
        int frequency;
        input.get(c);
        input >> frequency;
        input.ignore();
        frequencies[c] = frequency;
    }

    Node* root = buildHuffmanTree(frequencies);
    Node* curr = root;

    // Decoding the compressed data
    char byte;
    while (input.get(byte)) {
        for (int i = 7; i >= 0; i--) {
            bool bit = (byte >> i) & 1;
            if (bit) {
                curr = curr->right;
            } else {
                curr = curr->left;
            }

            if (!curr->left && !curr->right) {
                output << curr->data;
                curr = root;
            }
        }
    }

    input.close();
    output.close();
}

int main() {
    string inputFile = "input.txt";
    string compressedFile = "compressed.bin";
    string decompressedFile = "decompressed.txt";

    compressFile(inputFile, compressedFile);
    decompressFile(compressedFile, decompressedFile);

    cout << "File compression and decompression completed successfully.\n";
    return 0;
}
