import React, { useState } from "react";

// Узел дерева
const TreeNode = ({ node, onDelete, onAdd }) => {
  const [newNodeName, setNewNodeName] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleDelete = () => {
    onDelete(node.id);
  };

  const handleAdd = () => {
    if (newNodeName.trim()) {
      onAdd(node.id, newNodeName);
      setNewNodeName("");
      setIsAdding(false);
    }
  };

  return (
    <div className="ml-4">
      <div className="flex items-center">
        <span className="mr-2">{node.name}</span>
        <button
          className="rounded bg-red-500 px-2 py-1 text-white hover:bg-red-600"
          onClick={handleDelete}
        >
          Удалить
        </button>
        <button
          className="ml-2 rounded bg-green-500 px-2 py-1 text-white hover:bg-green-600"
          onClick={() => setIsAdding(!isAdding)}
        >
          Добавить
        </button>
      </div>
      {isAdding && (
        <div className="mt-2 flex items-center">
          <input
            type="text"
            value={newNodeName}
            onChange={(e) => setNewNodeName(e.target.value)}
            className="rounded border border-gray-300 px-2 py-1"
            placeholder="Имя узла"
          />
          <button
            className="ml-2 rounded bg-blue-500 px-2 py-1 text-white hover:bg-blue-600"
            onClick={handleAdd}
          >
            Сохранить
          </button>
        </div>
      )}
      {node.children && (
        <div className="border-l border-gray-300 pl-4">
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              onDelete={onDelete}
              onAdd={onAdd}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Компонент дерева
const Tree = () => {
  const [treeData, setTreeData] = useState([
    {
      id: 1,
      name: "Узел 1",
      children: [
        {
          id: 2,
          name: "Узел 1.1",
          children: [
            { id: 3, name: "Узел 1.1.1" },
            { id: 4, name: "Узел 1.1.2" },
          ],
        },
        { id: 5, name: "Узел 1.2" },
      ],
    },
    {
      id: 6,
      name: "Узел 2",
      children: [{ id: 7, name: "Узел 2.1" }],
    },
  ]);

  const deleteNode = (id) => {
    const deleteNodeRecursive = (nodes, id) => {
      return nodes
        .map((node) => {
          if (node.id === id) {
            return null;
          }
          if (node.children) {
            node.children = deleteNodeRecursive(node.children, id);
          }
          return node;
        })
        .filter((node) => node !== null);
    };

    setTreeData((prevData) => deleteNodeRecursive(prevData, id));
  };

  const addNode = (parentId, nodeName) => {
    const addNodeRecursive = (nodes, parentId, nodeName) => {
      return nodes.map((node) => {
        if (node.id === parentId) {
          const newNode = {
            id: Date.now(),
            name: nodeName,
            children: [],
          };
          node.children = [...(node.children || []), newNode];
        } else if (node.children) {
          node.children = addNodeRecursive(node.children, parentId, nodeName);
        }
        return node;
      });
    };

    setTreeData((prevData) => addNodeRecursive(prevData, parentId, nodeName));
  };

  return (
    <div className="p-4">
      {treeData.map((node) => (
        <TreeNode
          key={node.id}
          node={node}
          onDelete={deleteNode}
          onAdd={addNode}
        />
      ))}
    </div>
  );
};

export default Tree;
