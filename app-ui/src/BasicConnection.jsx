import React from "react";
import {
  DiagramEngine,
  DiagramModel,
  DefaultNodeModel,
  DiagramWidget,
} from "storm-react-diagrams";

import "./style.css";
import {useState,useEffect} from 'react';



const useFetchPost = (url) => {
  const [data, setData] = useState(null);
  const [isPending, setIsPending] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    const abortCont = new AbortController();
    fetch(url, { signal: abortCont.signal ,method:"post",body:JSON.stringify({
      links:[],
    })})
      .then((res) => {
        if (!res.ok) {
          throw Error("Could not post data");
        }
        return res.json();
      })
      .then((data) => {
        setData(data);
        setIsPending(false);
        setErr(null);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          setErr(err.message);
          setIsPending(false);
        }
      });
    return () => abortCont.abort();
  }, [url]);
  return( {
    data,
    isPending,
    err,
  }
  )
};

const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [isPending, setIsPending] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    const abortCont = new AbortController();
    fetch(url, { signal: abortCont.signal })
      .then((res) => {
        if (!res.ok) {
          throw Error("Could not fetch data");
        }
        return res.json();
      })
      .then((data) => {
        setData(data);
        setIsPending(false);
        setErr(null);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          setErr(err.message);
          setIsPending(false);
        }
      });
    return () => abortCont.abort();
  }, [url]);
  return( {
    data,
    isPending,
    err,
  }
  )
};

const processStateData = (data) =>{
  // console.log(data.state);
  let components =[],links=[];
  var i =0;
  for(let st in data.state.components){
    // console.log(data.state.components[i]);
    let comp = {
      id:data.state.components[i].id,
      name:data.state.components[i].name,
    }
    i++;
    // console.log(comp);
    components.push(comp);
  }
  i = 0;
  for(var link in data.state.links){
    // console.log(data.state.links[i]);
    let lk = {
      src:data.state.links[i].src,
      dest:data.state.links[i].dest,
    }
    i++;
    links.push(lk);
  }
  return {components,links};
}

const ElmArchitecture = (state_data) => {

  var engine = new DiagramEngine();
  engine.installDefaultFactories();

  var model = new DiagramModel();
  // console.log(state_data);
  const state = processStateData(state_data);
  // console.log(state.components);
  var nodes = [];
  var offset_x= 0; 
  for(var st in state.components){
    // console.log(st);
    var node = new DefaultNodeModel(state.components[st].name,"rgb(0,192,255)");
    node.setPosition(offset_x+100,100);
    var node_id = {
      id : state.components[st].id,
      node : node,
    }
    // console.log(node);
    nodes.push(node_id);
    offset_x=offset_x + 300;
  }
  var i =0;
  for(var lk in state.links){
    // console.log(lk)
    var node_src =null,node_dest=null;
      for(node in nodes){
        console.log(nodes[node])
        if(state.links[lk].src === nodes[node].id){
          node_src= nodes[node].node;
          break;
        }
      }
    
    for(node in nodes){
      if(state.links[lk].dest===nodes[node].id){
        node_dest = nodes[node].node;
        break;
      }
    }
    i++;
    let port1 = node_src.addOutPort("Out");
    let port2 = node_dest.addInPort("In");

    let linked = port1.link(port2);

    model.addAll(node_src,node_dest,linked);
  }
  useFetchPost("http://localhost:5000/api/state/cache")

  // if(i==0){
  //   const obj = useFetchPost()
  // }


  // let link1 = port1.link(port2);

  // model.addAll(node1, node2, link1);

  engine.setDiagramModel(model);

  return <DiagramWidget className="srd-demo-canvas" diagramEngine={engine} />;
};

function BasicConnection() {
  const state = useFetch('http://localhost:5000/api/state');


  return (
    <div className="Elm">
      {state.err && console.log(state.err) && (<div>Error</div>)}
      {state.isPending && (<div>Loading</div>)}
      {state.data && (<ElmArchitecture state={state.data}/>)}
    </div>
  );
}

export default BasicConnection;