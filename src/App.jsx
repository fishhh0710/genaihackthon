import React, { useCallback, useState, useEffect, useMemo } from 'react';
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
import './app.css';
import dagre from 'dagre';
import nodesData from './nodes.json';
import edgesData from './edges.json';
import { useNavigate } from 'react-router-dom';
import Modal from './detail.jsx';
import CustomNode from './CustomNode.jsx';

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
  const [nodes, setNodes, onNodesChange] = useNodesState(
    nodesData.map(node => ({
      ...node,
      style: { border: `2px solid ${node.data.done === 1 ? 'green' : 'red'}` }
    }))
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(edgesData);
  const [showModal, setShowModal] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);

  const updateNodeStyles = (nodes, edges) => {
    const nodeMap = nodes.reduce((acc, node) => {
      acc[node.id] = node;
      return acc;
    }, {});

    const childMap = {};
    edges.forEach(edge => {
      if (!childMap[edge.source]) {
        childMap[edge.source] = [];
      }
      childMap[edge.source].push(edge.target);
    });

    return nodes.map(node => {
      let newBorder = node.data.done === 1 ? 'green' : 'red';

      if (node.data.done === 0 && childMap[node.id]) {
        const allChildrenDone = childMap[node.id].every(childId => nodeMap[childId]?.data.done === 1);
        if (allChildrenDone) {
          newBorder = 'orange';
        }
      }

      return {
        ...node,
        style: { ...node.style, border: `2px solid ${newBorder}` }
      };
    });
  };

  useEffect(() => {
    const updatedNodes = updateNodeStyles(nodes, edges);
    setNodes(updatedNodes);
  }, []); // 空依賴數組確保只在初始加載時執行一次

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
    let des = prompt('輸入描述');
    let ti = prompt('輸入預估時間');
    let dl = prompt('輸入deadline');
    const newNode = {
      id: `${nodes.length + 1}`,
      type: 'customNode',
      data: {
        label: `${ans}`,
        description: `${des}`,
        time: `${ti}`,
        deadline: `${dl}`,
        done: 0
      },
      position: {
        x: 0,
        y: 0
      },
    };
    setNodes((nds) => updateNodeStyles(nds.concat(newNode), edges));
  }, [nodes, setNodes]);

  const onNodeClick = (event, node) => {
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
  const navigateToPersonal = () => {
    navigate('/personal');
  };
  const navigateToTeam = () => {
    navigate('/team');
  };
  const handleMenuClick = () => {
    setIsActive(!isActive)
  };

  const onLayout = useCallback(() => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = layout(nodes, edges);
    const updatedNodes = updateNodeStyles(layoutedNodes, layoutedEdges);
    setNodes(updatedNodes); 
    setEdges(layoutedEdges);
  }, [nodes, edges, setNodes, setEdges]);
  // 123
  useEffect(() => {
    onLayout();
  }, [onLayout]);

  return (
    <div style={{ height: '84vh' }}>
      <nav className='nav'>
        <div className='app-nav'>
          <ul>
            <button className='app-button' ><i className="material-icons" onClick={handleMenuClick} id='menu'>menu</i></button>
            <button className='app-button' onClick={navigateToTeam}>Team Page</button>
            {/* <button onClick={onLayout}>Refresh</button> */}
            <button className='app-button' onClick={onNodeAdd}>Add Node</button>
            <button className='app-button' onClick={navigateToInput}>Input</button>
          </ul>
        </div>
        <div className='rightNav'>
          <ul>
            {/* <li><i className="material-icons">notifications</i></li> */}
          </ul>
        </div>
      </nav>
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
