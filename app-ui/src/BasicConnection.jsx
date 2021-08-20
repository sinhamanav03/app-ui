import React from "react";
import ReactDOM from "react-dom";
import {
  DiagramEngine,
  DiagramModel,
  DefaultNodeModel,
  LinkModel,
  DiagramWidget,
  DefaultLinkModel
} from "storm-react-diagrams";

import "./style.css";

const ElmArchitecture = () => {

  var engine = new DiagramEngine();
  engine.installDefaultFactories();

  var model = new DiagramModel();

  var node1 = new DefaultNodeModel("Source", "rgb(0,192,255)");
  let port1 = node1.addOutPort("Out");
  node1.setPosition(100, 100);

  var node2 = new DefaultNodeModel("Destination", "rgb(192,255,0)");
  let port2 = node2.addInPort("in");
  node2.setPosition(400, 100);

  let link1 = port1.link(port2);

  model.addAll(node1, node2, link1);

  engine.setDiagramModel(model);

  return <DiagramWidget className="srd-demo-canvas" diagramEngine={engine} />;
};

function BasicConnection() {
  return (
    <div className="Elm">
      <ElmArchitecture />
    </div>
  );
}

export default BasicConnection;