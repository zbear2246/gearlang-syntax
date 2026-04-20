import koffii from "koffi";
import * as lsp from "vscode-languageserver/node";
import { TextDocument } from "vscode-languageserver-textdocument";
import path from "node:path";

const connection = lsp.createConnection(lsp.ProposedFeatures.all);
const documents = new lsp.TextDocuments(TextDocument);

const libPath = path.join(__dirname, "..", "./libgearlib.so")

const lib = koffii.load(libPath)

const gear_dump_ast = lib.func();


connection.onInitialize((_params: lsp.InitializeParams): lsp.InitializeResult => {


    return {
        capabilities: {
            textDocumentSync: lsp.TextDocumentSyncKind.Incremental,
            completionProvider: {
                resolveProvider: false
            }
        }
    };
});

connection.onCompletion((_params: lsp.TextDocumentPositionParams): lsp.CompletionItem[] => {
    
    return [];

});

documents.onDidOpen((event) => {
    const text: string = event.document.getText();

    const uri: string = event.document.uri;

    analyzeDocument(text, uri);


})

documents.onDidChangeContent((event) => {
    const text: string = event.document.getText();

    const uri: string = event.document.uri;

    analyzeDocument(text, uri);
})

function analyzeDocument(text: string, uri: string): void {
        const filepath = uri.replace('file://', '');
    
    const result = gear_dump_ast(filepath);
    
    connection.console.log(result);
    
}

documents.listen(connection)
connection.listen();