import React, { useCallback, useState } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  MiniMap,
} from 'reactflow';
import 'reactflow/dist/style.css';
import './app.css'
import dagre from 'dagre';
import nodesData from './nodes.json';
import edgesData from './edges.json';
import { useNavigate } from 'react-router-dom';
import Modal from './detail.jsx';

const layout = (nodes, edges) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const nodeWidth = 172;
  const nodeHeight = 36;

  dagreGraph.setGraph({ rankdir: 'LR' });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = 'left';
    node.sourcePosition = 'right';

    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    };
  });

  return { nodes, edges };
};


const App = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(nodesData);
  const [edges, setEdges, onEdgesChange] = useEdgesState(edgesData);
  const [showModal, setShowModal] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);


  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);
  const onElementsRemove = useCallback(
    (elementsToRemove) => {
      setNodes((nds) => nds.filter((node) => !elementsToRemove.find((el) => el.id === node.id)));
      setEdges((eds) => eds.filter((edge) => !elementsToRemove.find((el) => el.id === edge.id)));
    },
    [setNodes, setEdges]
  );

  const onNodeAdd = useCallback(() => {
    let ans = prompt('輸入名字');
    const newNode = {
      id: `${nodes.length + 1}`,
      data: { label: `${ans}` },
      position: {
        x: 0,
        y: 0
      },
    };
    setNodes((nds) => nds.concat(newNode));
  }, [nodes, setNodes]);

  const onNodeClick = (event, node) => {
    // console.log('clicked!W');
    console.log(node);
    setSelectedNode(node);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedNode(null);
  };

  const navigate = useNavigate();

  const navigateToInput = () => {
    navigate('/input');
  };

  const navigateToEdit = () => {
    navigate('/edit');
  };


  const onLayout = useCallback(() => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = layout(nodes, edges);
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  }, [nodes, edges, setNodes, setEdges]);

  return (
    <div style={{ height: '100vh' }}>
      <button onClick={onLayout}>Refresh</button>
      {/* <Link to='/'>Home</Link> */}
      <button onClick={navigateToEdit}>Edit</button>
      <button onClick={navigateToInput}>Input</button>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onElementsRemove={onElementsRemove}
        onNodeClick={onNodeClick}
        fitView
      >
        <Controls />
        <Background />
        <MiniMap />
      </ReactFlow>
      <Modal show={showModal} onClose={closeModal} nodeData={selectedNode} />
    </div>
  );
};

const FlowWithProvider = () => (
  <ReactFlowProvider>
    <App />
  </ReactFlowProvider>
);

export default FlowWithProvider;
