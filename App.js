import React from 'react';
import { StyleSheet, Text, View,KeyboardAvoidingView,FlatList } from 'react-native';
import {Input,Card,Button,Icon} from 'native-base';
import * as firebase from 'firebase';  

var firebaseConfig = {
  apiKey: "AIzaSyDv-ZleypUApKZRAx2_8kK4ZbG5qKFsGcQ",
  authDomain: "reactbootcamp-5ff3e.firebaseapp.com",
  databaseURL: "https://reactbootcamp-5ff3e.firebaseio.com",
  projectId: "reactbootcamp-5ff3e",
  storageBucket: "reactbootcamp-5ff3e.appspot.com",
  messagingSenderId: "960339335848",
  appId: "1:960339335848:web:019f148de3749f5325809d",
  measurementId: "G-D1G52KZ78G"
};
// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      message:"",
      messageList:[]
    }
  }

  sendMessage= message => {
    var messageListRef = firebase.database().ref("message_list");
    var newMessageRef = messageListRef.push();
    newMessageRef.set({
      text:message,
      date:Date.now()
    })
    this.setState({message:""})
  }

  updateList = messageList => {
    this.setState({messageList:messageList});
    
  }

  componentWillMount() {
    var self = this;
    var messageListRef = firebase.database().ref("message_list");
    messageListRef.on("value", dataSnapShot=>{
      if (dataSnapShot.val()) {
        let messageList = Object.values(dataSnapShot.val());
        self.updateList(messageList.reverse())
      }
    })
  }
  render() {
    return (
      <KeyboardAvoidingView behavior="padding" enabled  style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Message Board</Text>
        </View>
        <View style={styles.listContainer}>
        <FlatList
        data={this.state.messageList}
        inverted
        keyExtractor= {(item,index) => item.date.toString()}
        renderItem={({item}) => (
          <Card style={styles.listItem}>
            <Text style={styles.messageText}>{item.text}</Text>
            <Text style={styles.timeText}>{new Date(item.date).toLocaleDateString}</Text>
          </Card>
        )}
        />
        </View>
        <View style={styles.inputContainer}>
          <Input
          onChangeText={text => {
            this.setState({message:text})
          }}
          placeholder="Enter message Here"
          />
          <Button onPress={() => {
            this.sendMessage(this.state.message);
            this.setState({message:""});
          }}>
            <Icon type="FontAwesome" name="arrow-right" />
          </Button>
        </View>
      </KeyboardAvoidingView>
    );
  }
  }
  

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop: 25,
      margin: 2,
      backgroundColor: "#01CBC6"
    },
    header: {
      backgroundColor: "#2B2B52",
      alignItems: "center",
      height: 40,
      justifyContent: "center"
    },
    headerText: {
      paddingHorizontal: 10,
      color: "#FFF",
      fontSize: 20
    },
    listContainer: {
      flex: 1,
      padding: 5
    },
    listItem: {
      padding: 10
    },
    messageText: {
      fontSize: 20
    },
    timeText: {
      fontSize: 10
    },
    inputContainer: {
      flexDirection: "row",
      padding: 5,
      borderWidth: 5,
      borderRadius: 15,
      borderColor: "#2B2B52",
      color: "#fff"
    }
  });
  