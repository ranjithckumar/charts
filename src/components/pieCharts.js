import React,{ Component} from 'react';
import Calculate from './Calculate';
import { Doughnut, defaults } from 'react-chartjs-2'

defaults.global.tooltips.enabled = false
defaults.global.legend.position = 'bottom'

    class Piechart  extends Component{
        constructor(props){
            super(props);
            this.state = {
                rawdata:[],
                idle:0,
                booting:0,
                sleep:0,
                scan:0,
                nodata:0,
                anomaly:0
            };
        }

        // calculate time difference
         calculateTime = () => {
          let first_object = Object(this.state.rawdata);
          var previousElement = first_object[0];
          var booting_time = 0;
          var sleep_time = 0;
          var scan_time = 0;
          var nodata_time = 0;
          var anomaly_time = 0;
          var idle_time = 0;

            // forEach loop to populate data

            first_object.forEach(element => {
            var currentElement = element;
            var date1 = new Date(currentElement.timestamp.slice(0,19));
            var date2 = new Date(previousElement.timestamp.slice(0,19));
            var diffrenece_hr = Math.abs(date1.getHours()-date2.getHours());
            var diffrenece_min = (Math.abs(date1.getMinutes()-date2.getMinutes()))/60;
            var diffrenece_sec = (Math.abs(date1.getSeconds()-date2.getSeconds()))/3600;
            var total = diffrenece_hr+diffrenece_min+diffrenece_sec;
    
            // IDLE TIME
            if(element.user_state==="IDLE"){
               idle_time = idle_time + total;
               this.setState({idle:idle_time});
            }
            // BOOTING TIME
            if(element.user_state==="BOOTING"){
              booting_time = booting_time + total;
              this.setState({booting:booting_time});
            }
            // SLEEP TIME
            if(element.user_state==="SLEEP"){
            sleep_time = sleep_time + total;
            this.setState({sleep:sleep_time});
            }
          
           //  SCAN TIME
           if(element.user_state==="SCAN"){
            scan_time = scan_time + total;
            this.setState({scan:scan_time});
            }
            // NO DATA TIME
           if(element.user_state==="NO_DATA"){
            nodata_time = nodata_time + total;
            this.setState({nodata:nodata_time});
            }
           //  ANOMALY TIME
           if(element.user_state==="ANOMALY"){
            anomaly_time = anomaly_time + total;
            this.setState({anomaly:anomaly_time});
            }
            //  Assigning current element to previous element
            previousElement = currentElement;
          });
         
        }    
        //  Fetching data from api
        componentDidMount(){
              fetch('https://api.jsonbin.io/b/5fad19f621ff892e1a1c27a5')
              .then(response=>response.json())
              .then(timedata => this.setState({rawdata:timedata.predictions}));
              // this.calculateTime();
            }
        
        render(){
          // Destructuring data
          const { idle,booting,sleep,scan,nodata,anomaly} = this.state;
          console.log(` Idle_time: ${idle} \n Booting_time:  ${booting} \n Sleep_time:  ${sleep}
          \n Scan_time: ${scan} \n Nodata_time:  ${nodata}\n Anomaly_time:  ${anomaly}`);
          return (
          <div>
          <Calculate calculateTime={this.calculateTime}>
          </Calculate>
          <h1 style={{color:'deepskyblue',marginLeft:'120px'}}> Pie chart</h1>
          <Doughnut
            data={{
              labels: ['IDLE', 'BOOTING', 'SLEEP', 'SCAN', 'NO_DATA', 'ANOMALY'],
              datasets: [
                {
                  data: [idle, booting, sleep, scan, nodata, anomaly],
                  backgroundColor: ['orange','gray','yellow','green','purple','red'],
                  borderWidth: 1,
                },
              ],
            }}
            height={350}
            width={600}
            options={{
              maintainAspectRatio: true,
              legend: {
                labels: {
                  fontSize: 20,
                },
              },
            }}
           />
           <div style = {{marginTop:'20px'}}>
          <h4 style={{color:'orange',marginLeft:'25px'}}>{`IDLE : ${idle}%`}</h4>
          <h4 style={{color:'gray',marginLeft:'25px'}}>{`BOOTING: ${booting}%`}</h4>
          <h4 style={{color:'yellow',marginLeft:'25px'}}>{`SLEEP : ${sleep}%`}</h4>
          <h4 style={{color:'green',marginLeft:'25px'}}>{`SCAN : ${scan}%`}</h4>
          <h4 style={{color:'purple',marginLeft:'25px'}}>{`NODATA : ${nodata}%`}</h4>
          <h4 style={{color:'red',marginLeft:'25px'}}>{`ANOMALY : ${anomaly}%`}</h4>
           </div>
          </div>
         )
        }
    }
export default Piechart;