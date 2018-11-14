import React, { PureComponent } from 'react';
import {
  ScrollView, View, Text, Image, Keyboard, StatusBar,
  Platform, Alert, LayoutAnimation, AsyncStorage, Dimensions, KeyboardAvoidingView
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {connect} from 'react-redux';
import { Container, Button, Picker,Header, Content, Form, Item, Input, Label, Left, Right,Body, Title, Card, Icon } from 'native-base';
import { getRequest,changeAnswer, defaultValue } from '../actions';
import {styles, colors,GETANSWERS, GETQUESTION ,RECORDS, GETCOMPANY, COMPANIES, PICKER, GETPICKER} from '../actions/types';
import {Spinner, CardSection} from '../components/common';
import {realm} from '../realm';
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

var uid = require('react-native-uuid');
class EditForms extends PureComponent {

  async componentWillMount() {
    this.setState({loading:true})
    if (await this.props.uuid) {
      await this.props.changeAnswer(0,0);
      await this.props.defaultValue(this.props.uuid);
    }
    else {
      await this.props.changeAnswer(0, 0);
      await this.props.defaultValue(0);
    }
    this.props.getRequest(GETPICKER);
    this.setState({loading: false});
    this.count = Object.keys(this.props.answers).length;
    

  }

  static navigatorStyle = {
    navBarHidden: true,
    statusBarTextColorScheme: 'light',
  }

  count=0
  state={
    loading:false
  }

  componentWillUpdate() {
    Platform.OS === 'ios' ? LayoutAnimation.spring() : LayoutAnimation.easeInEaseOut();
  }
  
  renderItem(query){
    if (Number.isInteger(query)) {
      let p = [];
      if (this.props.pickers.length) {
        try {
          let dropdowns = this.props.pickers.filtered('questionId="' + query + '"')[0].dropdowns;
          if (dropdowns.length) {
            dropdowns.forEach((c,i) => {
              p.push(<Picker.Item key={c.id} value={c.id} label={c.options} />)
            });
          }
        } catch (error) {
          return p;
        }
      }
      return p;
    }
    else if(query == COMPANIES){
        let comp=[];
        if(this.props.companies.length){
          this.props.companies.forEach((c,i) => {
            comp.push(<Picker.Item key={c.id} value={c.id} label={c.name} />)
          });
        }
        return comp;
    }
    return [];
  }

  renderAddPdt(qus){
    if (qus.question == 'Product'){
      return (<Button transparent full style={{ margin: 5 }} onPress={() => {
        this.props.navigator.showLightBox({
          screen: "ProductReg",
          passProps: {
            close: () => this.props.navigator.dismissLightBox(),
          },
          style: {
            backgroundBlur: Platform.OS === 'ios' ? 'light' : 'dark',
            tapBackgroundToDismiss: true,
            alignSelf:'center'
          }
        });
      }}><Text style={{ color: colors.headerPurple, alignSelf: 'center', fontWeight: 'bold' }}>Add Product</Text></Button>);
    }
    else{
      return <View/>;
    }
  }

  renderPicker = (qus,query,pop) => {
    return (
      <CardSection style={{ alignItems: 'center', width: SCREEN_WIDTH }}>
        <Text style={styles.textHeader}>{qus.question + ' : '}</Text>
        <Picker
          style={{ width: SCREEN_WIDTH }}
          iosHeader={qus.question}
          mode="dropdown"
          selectedValue={this.props.answers[pop]}
          onValueChange={(text) => this.props.changeAnswer(pop, text)}
        >
          {this.renderItem(query)}
        </Picker>
      </CardSection>
    );
  }

  renderComponents(){
    if (this.props.questions) {
      return this.props.questions.map((qus) => {
        let pop = parseInt(qus.id);
        if (qus.question == 'Email'){
          return <View key={pop.toString()}/>;
        }
        else if (qus.question == 'Vendor Company'){
          return(
            <View style={styles.container} key={pop.toString()}>
              {this.renderPicker(qus, COMPANIES,pop)}
              <Button transparent full style={{ margin: 5 }}
                onPress={() => {
                  this.props.navigator.push({
                    screen: 'CompReg',
                    title: 'Company Registration'
                  });
                }}>
                <Text style={{ color: colors.headerPurple, alignSelf: 'center', fontWeight: 'bold' }}> Add Company </Text>
              </Button>
          </View>);
        }
        else if (qus.answerDataType == 'dropDown'){
          return (
            <View style={styles.container} >
            {this.renderPicker(qus,pop,pop)}
            {this.renderAddPdt(qus)}
            </View>
            );
        }
        else if (qus.question == 'Created by' || qus.question == 'Updated by' || qus.question == 'Image of blocks'){
          return <View/>;
        }
        return (
          <View style={styles.container}>
            <Text style={styles.textHeader}>{qus.question}</Text>
          <Item last >
          <Input 
                style={styles.textInput}
                placeholder={'Type here !'}
            autoCapitalize={'none'}
            autoCorrect={false}
            
            value={this.props.answers[pop]} 
            onChangeText={(text) => {
              this.props.changeAnswer(pop, text)}}/>
        </Item>
        </View>);
      });
    }
    else {
      return <View />
    }
  }

  alertIt = (title,message,onPress) => {
    Alert.alert(
      title,
      message,
      [
        {
          text: 'OK', onPress
        },
      ],
      { cancelable: false }
    );
  }

  renderButton = () => {
    return (<Button full style={{ borderRadius: 10, margin: 5, borderColor: colors.snow, backgroundColor: colors.headerPurple }} onPress={() => {
      try {
        if (this.props.uuid) {
          let rR = this.props.records.filtered('uuid = "' + this.props.uuid + '"')[0];
          let d = new Date();
          let updatedAt = d.toISOString();
          let changed = false;
          realm.write(() => {
            let answers = [];
            for (let p in this.props.answers) {
              answers.push({ questionId: parseInt(p), answer: this.props.answers[parseInt(p)].toString() });
            }
            if (rR.answers.length == answers.length) {
              answers.forEach((ans) => {
                let rO = rR.answers.find(x => x.questionId === ans.questionId);
                if (rO) {
                  if (rO.answer != ans.answer) {
                    changed = true;
                  }
                }
              });
              if (changed) {
                realm.delete(rR.answers);
                rR.answers = [...answers];
                rR.updatedAt = updatedAt;
                this.props.getRequest(GETANSWERS);
                this.alertIt('Form Updated', 'Your form has been updated successfully ', () => {
                  this.props.navigator.pop();
                });
              }
              else {
                this.alertIt('No Changes Made', '', () => {
                  this.props.navigator.pop();
                });
              }
            }
            else {
              realm.delete(rR.answers);
              rR.answers = [...answers];
              rR.updatedAt = updatedAt;
              this.props.getRequest(GETANSWERS);
              this.alertIt('Form Updated', 'Your form has been updated successfully ', () => {
                this.props.navigator.pop();
              });
            }
          });
        }
        else {
          realm.write(() => {
            let d = new Date();
            let hash = 'newRecord';
            let createdBy = 1;
            let updatedBy = 1;
            let createdAt = d.toISOString();
            let updatedAt = d.toISOString();
            let answers = [];
            let uuid = uid.v1();
            for (let p in this.props.answers) {
              answers.push({ questionId: parseInt(p), answer: this.props.answers[parseInt(p)].toString() });
            }
            if (answers.length > this.count) {
              realm.create(RECORDS, {
                createdBy, updatedBy, createdAt, updatedAt, hash, uuid, answers
              });
              this.props.getRequest(GETANSWERS);
              this.alertIt('Success', 'Your form has been created successfully ', () => {
                this.props.navigator.pop();
              });
            }
            else {
              this.alertIt('Empty Fields', 'Enter the values of the fields', () => {
                console.log('cool')
              });
            }
          });
        }
      } catch (error) {
        console.log(error);
        this.alertIt('Error', 'Error updating the form', () => {
          this.props.navigator.pop();
        });
      }
    }} ><Text style={{ color: colors.snow }}>Submit</Text></Button>);
  }

  renderLoader = () => {
if (this.state.loading) {
  return (
    <View style={{margin:30}}>
  <Spinner/>
  </View>) ;
}
else {
return (<View style={styles.card}>
          <ScrollView>
            {this.renderComponents()}
            {this.renderButton()}
          </ScrollView>
          </View>);
}
  }

  render() {
    
    return (
      <Container>
        <StatusBar
          barStyle="light-content"
        />
        <View style={styles.header}>         
         <Left >
            <Button transparent onPress={() => {
              this.props.navigator.pop();
            }}>
              <Icon name='arrow-dropleft' style={{ color: colors.snow }} />
            </Button>
          </Left>
          <Body>
            <Title style={{ color: colors.snow }}>{this.props.header}</Title>
          </Body>
          <Right />
        </View>
        <LinearGradient colors={styles.linearGrad} style={{ flex: 1 }}>
          <StatusBar
            barStyle="light-content"
          />
          <KeyboardAvoidingView
            behavior="padding"
            keyboardVerticalOffset={60}
          >
            {this.renderLoader()}
          </KeyboardAvoidingView>
        </LinearGradient>
      </Container>
    );
  }
}

const mapStateToProps = ({ 
  getQuestions, 
  answers,
  getAnswers,
  getCompanies,
  getPicker
}) => {
  const questions = getQuestions.response;
  let records = getAnswers.response;
  let loading = getCompanies.loading || getQuestions.loading || getPicker.loading || getAnswers.loading ;
  const companies = getCompanies.response;
  const pickers = getPicker.response;
  return {
    questions, loading, answers, companies, pickers, records };
};

export default connect(mapStateToProps,{getRequest,changeAnswer, defaultValue})(EditForms);
