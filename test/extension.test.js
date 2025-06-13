const assert = require('assert');
const path = require('path');
const fs = require('fs');
const { ScriptTreeItem, ScriptsProvider } = require('../extension');

// Mock workspace root and package.json
const mockWorkspaceRoot = __dirname;
const mockPackageJsonPath = path.join(mockWorkspaceRoot, 'package.json');
const mockScripts = {
    "start": "node index.js",
    "test": "echo \"Error: no test specified\" && exit 1"
};

suite('ScriptDeck Extension Test Suite', () => {
    suiteSetup(() => {
        // Create a mock package.json
        fs.writeFileSync(mockPackageJsonPath, JSON.stringify({ scripts: mockScripts }, null, 2));
    });

    suiteTeardown(() => {
        // Remove mock package.json
        fs.unlinkSync(mockPackageJsonPath);
    });

    test('ScriptsProvider should list scripts from package.json', () => {
        const provider = new ScriptsProvider(mockWorkspaceRoot);
        const children = provider.getChildren();
        assert.strictEqual(children.length, 2);
        assert.strictEqual(children[0].label, 'start');
        assert.strictEqual(children[1].label, 'test');
    });

    test('ScriptTreeItem should set correct properties', () => {
        const item = new ScriptTreeItem('build', 'npm run build');
        assert.strictEqual(item.label, 'build');
        assert.strictEqual(item.description, 'npm run build');
        assert.strictEqual(item.contextValue, 'scriptItem');
        assert.ok(item.iconPath);
    });
});
