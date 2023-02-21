import React, { useEffect, useState } from 'react';
import './App.css';
import { Rowma,Topic } from 'rowma_js';
import Button from '@material-ui/core/Button';

function App() {
  const [rowma, setRowma] = useState<any>(null);
  const [robotUuids, setRobotUuids] = useState<Array<string>>([]);
  const [selectedRobotUuid, setSelectedRobotUuid] = useState<string>('');

  const [robot, setRobot] = useState<any>(null);

  const [selectedTopicName, setSelectedTopicName] = useState<string>('');

  const [receivedTopics, setReceivedTopics] = useState<Array<string>>([]);

  useEffect(() => {
    const _rowma = new Rowma();
    setRowma(_rowma);

    _rowma.currentConnectionList().then((connList: any) => {
      setRobotUuids(connList.data.map((robot: any) => robot.uuid));
    })
  }, [])

  const handleConnectionListChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRobotUuid(event.target.value)
  }

  const handleConnectClicked = () => {
    rowma.connect()

    rowma.getRobotStatus(selectedRobotUuid).then((res: any) => {
      setRobot(res.data)
    })
  }

  const handleRostopicChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTopicName(event.target.value)
  }

  const handlePublishTopic_backward = () => {
    const currentTime = new Date()
    const msg = { "data": `backward` }
    rowma.publish(selectedRobotUuid, selectedTopicName, msg)
  }

  const handlePublishTopic_stop = () => {
    const currentTime = new Date()
    const msg = { "data": `stop` }
    rowma.publish(selectedRobotUuid, selectedTopicName, msg)
  }
  const handlePublishTopic_forward = () => {
    const currentTime = new Date()
    const msg = { "data": `forward` }
    rowma.publish(selectedRobotUuid, selectedTopicName, msg)
  }

  const handlePublishTopic_left = () => {
    const currentTime = new Date()
    const msg = { "data": `left` }
    rowma.publish(selectedRobotUuid, selectedTopicName, msg)
  }

  const handlePublishTopic_right = () => {
    const currentTime = new Date()
    const msg = { "data": `right` }
    rowma.publish(selectedRobotUuid, selectedTopicName, msg)
  }

  const handleSubscribeButtonClick = () => {
    rowma.setTopicRoute(selectedRobotUuid, 'application', rowma.uuid, selectedTopicName);
    rowma.subscribe(selectedTopicName, handleTopicArrival)
  }

  const handleTopicArrival = (event: Topic) => {
    console.log(event)
    setReceivedTopics(topics => [...topics, JSON.stringify(event.msg)])
  }

  return (
    <div className="App">
      <select onChange={handleConnectionListChange}>
        <option value=''>{''}</option>
        {robotUuids.length > 0 && (
          robotUuids.map((uuid: string) => {
            return(
              <option key={uuid} value={uuid}>{uuid}</option>
            )
          })
        )}
      </select>
      <button
        disabled={selectedRobotUuid === ''}
        onClick={handleConnectClicked}
      >
        Connect
      </button>
      <div>
        {robot && robot.rostopics.length > 0 && (
      	  <select onChange={handleRostopicChange}>
      	    <option value=''>{''}</option>
            {robot.rostopics.map((topic: string) => {
      	      return(
      	        <option key={topic} value={topic}>{topic}</option>
      	      )
      	    })}
      	  </select>
        )}
      </div>
      {selectedTopicName && (
        <div>
          <button onClick={handlePublishTopic_stop}>
            stp
          </button>
          <button onClick={handleSubscribeButtonClick}>
            Start Subscribe
          </button>
          <div className = "ConttollButton">
      <div className= "StopArea">

        <img  width="200" onClick={handlePublishTopic_stop} src="data:image/png;base64,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" />

      </div>
      <div className= "ForwardArea">
        <Button className="ForwardButton" variant="contained"  onClick={handlePublishTopic_forward} >↑</Button>
      </div>
        <div className = "CenterButton">
          <Button className="LeftButton" variant="contained" onClick={handlePublishTopic_left}>←</Button>
          <Button className="RightButton" variant="contained" onClick={handlePublishTopic_right}>→</Button>
        </div>
        <div className= "BackwardArea">
          <Button className="BackwardButton" variant="contained" onClick={handlePublishTopic_backward}>↓</Button>
        </div>
         
      </div>
        </div>
        
      )}
      {receivedTopics.map((topic: string, index: number) => (
        <div key={index}>
          <span>{topic}</span>
        </div>
      ))}
    </div>
  );
}

export default App;
