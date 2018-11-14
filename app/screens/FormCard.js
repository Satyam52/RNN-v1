import {CardSection, Spinner} from '../components/common';
import React, {Component} from 'react';
import {
  View,TouchableOpacity,Platform, LayoutAnimation, FlatList, AsyncStorage
} from 'react-native';
import { connect } from 'react-redux';
import { realm } from '../realm';
import { Container, Button, Picker, Header,Footer, Content, Form, Item, Input, Label,Text, Left, Right, Body, Title, Card, Icon } from 'native-base';
import { styles,colors, PICKER, DROPDOWNS, GETQUESTION, GETCOMPANY } from '../actions/types';
import LinearGradient from 'react-native-linear-gradient';
import {getRequest} from '../actions'
let dropdowns = realm.objects(DROPDOWNS);
class FormCard extends Component {

  constructor(props) {
    super(props);
    this.user = {}
  }

  async componentDidMount() {
    await AsyncStorage.getItem('user').then((response) => {
      this.user = JSON.parse(response);
    })
      .catch(() => console.log('error'));
    await this.props.getRequest(GETQUESTION);
    await this.props.getRequest(GETCOMPANY);
    await this.props.getRequest(GETPICKER);
  }

  componentDidUpdate() {
    Platform.OS === 'ios' ? LayoutAnimation.spring() : LayoutAnimation.easeInEaseOut();
  }

  _keyExtractor(ans, index) {
    return index;
  }

  _popComp(id) {
      this.props.navigator.showLightBox({
        screen: "CompInfo",
        passProps: {
          id,
          close: () => this.props.navigator.dismissLightBox(),
        },
        style: {
          backgroundBlur: Platform.OS === 'ios' ? 'light' : 'dark',
          tapBackgroundToDismiss: true
        }
      });
  }

  getId() {
    let id = 0;
    if (this.props.cid) {
      id = this.props.data.answers.filtered('questionId="' + this.props.cid + '"')[0].answer
    }
    return id
  }

  renderPdt(ans){
    if(this.props.pickers.length){
      let questionId = this.props.pickers.filtered('question="Product"')[0].questionId;
      let answer = ans.filtered('questionId="' + questionId + '"')[0].answer;
      let pdtname = dropdowns.filtered('id="' + answer + '"').length ? dropdowns.filtered('id="' + answer + '"')[0].options : 'Product';
      return <Text style={{
        color: colors.headerPurple, fontSize: (Platform.OS === 'ios') ? 17 : 20,fontWeight:'bold' ,padding: 8, alignSelf:'center'}}>{pdtname}</Text>
    }
    else{
      return <View/>
    }
  }

  renderCom = () => {
    let id = this.getId()
    if (id) {
      return (
        <Text style={{ color: colors.lightText, fontStyle: 'italic', fontSize: (Platform.OS === 'ios') ? 14 : 17, padding: 5 }}>{'From : ' + this.props.companies.filtered('id="' + id + '"')[0].name}</Text>
      )
    }
    else {
      <Text >{'Company'}</Text>
    }
  }

  renderCompInfo = () => {
    let id = this.getId()
    if (id) {
      return (
        <Button transparent onPress={this._popComp.bind(this, id)}>
          <Icon name='ios-information-circle-outline' style={{ color: colors.lightText }} />
        </Button>
      )
    }
    else {
      return <View />
    }
  }

  oncardpress = () => {
    this.props.navigator.push({
      screen: 'RecordInfo',
      title: 'Record Info',
      passProps: {
        uuid: this.props.data.uuid
      }
    });
  }

  renderEmail(ans){
    if(this.props.eid != 0 && this.user != undefined){
      let email = ans.filtered('questionId="' + this.props.eid + '"').length ? ans.filtered('questionId="' + this.props.eid + '"')[0].answer : 'None';
      if(this.user.email == email){
        email = 'You';
      }
      return (<Text style={{
        color: colors.lightText, fontStyle: 'italic', fontSize: (Platform.OS === 'ios') ? 14: 17, padding: 5, alignSelf:'center'}}>{'By : '+email}</Text>)
    }
    return (<View/>);
  }

  render() {
    const {
      answers, uuid, hash, createdAt, updatedAt, createdby, updatedBy
    } = this.props.data;
    let ans = answers.sorted('questionId');
    
    if(this.props.loading){
      return <Spinner/>
    }
    else{
      return (
        <View style={[styles.card]} >
          <TouchableOpacity onPress={this.oncardpress.bind(this)}>
            <CardSection style={{
              justifyContent: 'space-between',
              borderBottomWidth: 0.5,
              borderBottomColor: colors.headerPurple + 'ff'
            }}>
              {this.renderCom()}
              {this.renderCompInfo()}
            </CardSection>
            {this.renderPdt(ans)}
            <View>
              {this.renderEmail(ans)}
              <Text style={{ color: colors.lightText, fontSize: (Platform.OS === 'ios') ? 14 : 17, padding: 5, alignSelf: 'center', fontStyle: 'italic' }}>{' Created at : ' + new Date(createdAt).toDateString()}</Text>
            </View>
          </TouchableOpacity>
        </View>
      );
    }
   
   
  }
}

const mapStateToProps = ({ getQuestions,
  getCompanies }) => {
  let loading = true;
  let eid = 0, cid = 0,id=0;
  let questions = [], companies = [];
  let pickers = realm.objects(PICKER);
  questions = getQuestions.response;
  companies = getCompanies.response;
  if (getQuestions.response.length && getCompanies.response.length && pickers.length) {
    cid = getQuestions.response.filtered('question="Vendor Company"')[0].id;
    eid = getQuestions.response.filtered('question="Email"')[0].id;
    loading = false;
  }
  else {
    loading = true;
  }
  return {
    loading, cid, eid, pickers, questions, companies
  }
}

export default connect(mapStateToProps,{getRequest})(FormCard);
