import React, { useEffect, useState } from 'react';
import './App.css';
import Rowma, { Topic } from 'rowma_js';
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
      <div className= "ForwardArea">
        <Button className="ForwardButton" variant="contained" onClick={handlePublishTopic_forward} >↑</Button>
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